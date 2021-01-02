import React, { Component } from 'react';
import { uAPIlocal } from '../../lib/config';
import axios from 'axios';
import Midtrans from '../../lib/midtrans';
import Loader from 'react-loader-spinner';
import { Redirect } from 'react-router-dom';

/* Fungsi formatRupiah */
function formatRupiah(angka, prefix) {
    var separator;
    var number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            midtrans: this.props.location.state ? this.props.location.state.midtrans : null,
            personalInfo: this.props.location.state ? this.props.location.state.personalInfo : null,
            orderDetail: {
                jenisTest: '',
                cabang: '',
                jamCheck: '',
                price: '',
                totalPrice: '',
            },
            loader: true,
        }
    }

    async getData() {
        await axios.post(uAPIlocal + '/api/v1/register/checkout', {
            order_id: this.state.midtrans.order_id,
        })
            .then(function (response) {
                return response.data.results[0];
            })
            .then(response => {
                console.log(response)
                this.setState({
                    orderDetail: {
                        jenisTest: response.test_name,
                        cabang: response.branch_name,
                        jamCheck: `${response.start_time} - ${response.end_time}`,
                        price: response.price,
                        totalPrice: response.total_price,
                    },
                    loader: false,
                }, () => console.log(this.state.orderDetail))
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    componentDidMount() {
        // console.log(this.props);
        // this.getData();
        if (this.state.midtrans !== null) {
            this.getData();
        } 
    }
    render() {
        if (this.state.midtrans === null) {
            return (<Redirect to={{
                pathname: "/",
            }} />)
        }
        return (
            <div className="container" style={{ marginTop: '1.3rem' }}>
                <div className="card">
                    <div className="card-body">
                        <div className='text-center'>
                            <h3 >Jadwal Pemeriksaan Anda Telah Dibuat.</h3>
                        </div>
                        <hr />
                        {
                            this.state.loader ? (
                                <div className='text-center'>
                                    <Loader type="Circles" color="#00BFFF" height={80} width={100} />
                                </div>
                            ) : (
                                    <div>
                                        <div class="form-group row">
                                            <label class="col-sm-2 "><b>Order ID :</b></label>
                                            <div class="col-sm-4">
                                                <b>{this.state.midtrans.order_id}</b>
                                            </div>
                                            <label class="col-sm-2 "><b>Nama Lengkap :</b></label>
                                            <div class="col-sm-4">
                                                <b>{`${this.state.personalInfo.firstname} ${this.state.personalInfo.lastname}`}</b>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-sm-2" ><b>No Hp / Telepon :</b></label>
                                            <div class="col-sm-4">{this.state.personalInfo.phone}</div>
                                            <label class="col-sm-2" ><b>Email :</b></label>
                                            <div class="col-sm-4">{this.state.personalInfo.email}</div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-sm-2" ><b>Jenis Kelamin :</b></label>
                                            <div class="col-sm-4">{this.state.personalInfo.gender}</div>
                                            <label class="col-sm-2" ><b>Tanggal Lahir :</b></label>
                                            <div class="col-sm-4">{this.state.personalInfo.dob}</div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2"><b>Alamat :</b></label>
                                            <div class="col-sm-4">{this.state.personalInfo.address}</div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-sm-2" ><b>Jenis Test :</b></label>
                                            <div class="col-sm-4">{this.state.orderDetail.jenisTest}</div>
                                            <label class="col-sm-2" ><b>Cabang Bio Medika :</b></label>
                                            <div class="col-sm-4">{this.state.orderDetail.cabang}</div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-sm-2" ><b>Tanggal Periksa :</b></label>
                                            <div class="col-sm-4">{this.state.personalInfo.check_date}</div>
                                            <label class="col-sm-2" ><b>Jam Periksa :</b></label>
                                            <div class="col-sm-4">{this.state.orderDetail.jamCheck}</div>
                                        </div>
                                        <section>
                                            <h3 >Order Detail.</h3>
                                            <div className="table-responsive mg-t-20">
                                                <table className="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td>{this.state.orderDetail.jenisTest}</td>
                                                            <td className="text-right">{formatRupiah(this.state.orderDetail.price, 'Rp. ')}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><span>Order Total</span></td>
                                                            <td>
                                                                <h2 className="price text-right mb-0">{formatRupiah(this.state.orderDetail.totalPrice, 'Rp. ')}</h2>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-lg-12 col-md-12 col-sm-12 ">
                                                    <Midtrans clientKey={this.state.midtrans.clientKey} token={this.state.midtrans.token}>
                                                        <button className="btn btn-primary btn-block" type="button" > Bayar </button>
                                                    </Midtrans>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                )
                        }
                    </div>
                </div >
            </div >
        )
    }
}
export default Checkout;