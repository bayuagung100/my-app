import React, { Component } from 'react';
import Select from 'react-select';
import { uAPIlocal } from '../../../lib/config';
import axios from 'axios';
import TestName from '../../../admin/page-content/TestName';
import { Helmet } from "react-helmet";
import $ from 'jquery';

import Midtrans from '../../../lib/midtrans';
import { Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'




class PersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personalInfo: {
                firstname: null,
                lastname: null,
                phone: null,
                email: null,
                gender: null,
                selectedGender: null,
                dob: null,
                address: null,
                test_name: null,
                selectedTest_name: null,
                branch_bio: null,
                selectedBranch_bio: null,
                check_hours: null,
                selectedCheck_hours: null,
                check_date: null,
                slot: null,
                id_slot: null,
                // firstname: "Bayu",
                // lastname: "Agung",
                // phone: "089634372389",
                // email: "smileyoudontcry100@gmail.com",
                // gender: "Laki-Laki",
                // selectedGender: {
                //     value: "Laki-Laki",
                //     label: "Laki - Laki",
                // },
                // dob: "1998-09-14",
                // address: "Kemuning Permai Blob B2 no 31",
                // test_name: "1",
                // selectedTest_name: {
                //     value: "1",
                //     label: "Swab (900000)",
                // },
                // branch_bio: "1",
                // selectedBranch_bio: {
                //     value: "1",
                //     label: "Gandaria",
                // },
                // check_hours: "2",
                // selectedCheck_hours: {
                //     value: "2",
                //     label: "01:00:00 - 02:00:00",
                // },
                // check_date: "2020-12-30",
                // slot: "100",
                // id_slot: 2,
            },
            test_name: null,
            cabang: null,
            jam: null,

            modalAlert: false,
            modalAlertMessage: null,

            modalConfirm: false,

            midtrans: null,
            loader: false,
        }
        this.onChange = this.onChange.bind(this);
        this.hidemodalAlert = this.hidemodalAlert.bind(this);
        this.hidemodalConfirm = this.hidemodalConfirm.bind(this);
        this.setujuLanjut = this.setujuLanjut.bind(this);

        this.snapMidtrans = this.snapMidtrans.bind(this);
        this.pay = React.createRef();
        this.onSuccess = this.onSuccess.bind(this);
        this.onPending = this.onPending.bind(this);
        this.onError = this.onError.bind(this);
        this.onClose = this.onClose.bind(this);

        this.phoneChange = this.phoneChange.bind(this);
        this.dobChange = this.dobChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }
    onChange(e) {
        let newPersonal = { ...this.state.personalInfo };
        newPersonal[e.target.name] = e.target.value;
        this.setState({
            personalInfo: newPersonal

        }, () => console.log(this.state.personalInfo))
    }
    phoneChange(e){
        if(e !== undefined){
            // console.log(e)
            this.setState({
                personalInfo: {
                    ...this.state.personalInfo,
                    phone: e
                }
            })
        } else {
            this.setState({
                personalInfo: {
                    ...this.state.personalInfo,
                    phone: null
                }
            })
        }
    }
    dobChange(e) {
        // console.log(e);
        if (e._isValid) {
            var date = e._d;
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date.getFullYear();
            date = dd + '-' + mm + '-' + yyyy;

            this.setState({
                personalInfo: {
                    ...this.state.personalInfo,
                    dob: date
                }
            })
        }
    }
    checkChange(e) {
        // console.log(e);
        if (e._isValid) {
            var date = e._d;
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date.getFullYear();
            date = dd + '-' + mm + '-' + yyyy;

            this.setState({
                personalInfo: {
                    ...this.state.personalInfo,
                    check_date: date
                }
            })
        }
    }
    onSubmit(e) {
        e.preventDefault();
        let newPersonal = { ...this.state.personalInfo };
        for (let i = 0; i < e.target.length - 1; i++) {
            // console.log(e.target[i].name);
            newPersonal[e.target[i].name] = e.target[i].value;
        }
        this.setState({
            personalInfo: newPersonal,
        }, () => console.log(this.state.personalInfo))
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (this.state.personalInfo.firstname === "" || this.state.personalInfo.firstname === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Nama Depan Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.lastname === "" || this.state.personalInfo.lastname === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Nama Belakang Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.phone === "" || this.state.personalInfo.phone === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "No Hp / Telepon Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.email === "" || this.state.personalInfo.email === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Email Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.gender === "" || this.state.personalInfo.gender === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Jenis Kelamin Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.dob === "" || this.state.personalInfo.dob === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Tanggal Lahir Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.address === "" || this.state.personalInfo.address === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Alamat Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.test_name === "" || this.state.personalInfo.test_name === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Jenis Test Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.branch_bio === "" || this.state.personalInfo.branch_bio === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Lokasi Cabang Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.check_hours === "" || this.state.personalInfo.check_hours === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Jam Kedatangan Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.check_date === "" || this.state.personalInfo.check_date === null) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Tanggal Periksa Tidak Boleh Kosong!"
            })
        } else if (this.state.personalInfo.slot === "" || this.state.personalInfo.slot === null || this.state.personalInfo.slot === 0) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Slot Tidak Boleh Kosong!"
            })
        } else if (!pattern.test(this.state.personalInfo.email)) {
            this.setState({
                modalAlert: true,
                modalAlertMessage: "Email yang anda masukkan tidak valid!"
            })
        } else {
            this.setState({
                modalConfirm: true,
            })
        }

    }
    genderChange = async selected => {
        await this.setState({
            personalInfo: {
                ...this.state.personalInfo,
                gender: selected.value,
                selectedGender: selected,
            }
        });


    };
    optionsGender = [
        { value: 'Laki-Laki', label: 'Laki - Laki' },
        { value: 'Perempuan', label: 'Perempuan' },
    ]

    async getTestName() {
        await axios.get(uAPIlocal + '/api/v1/register/test-name')
            .then(response =>
                response.data.results.map(TestName => ({
                    value: `${TestName.id_test}`,
                    label: `${TestName.test_name} (${TestName.price})`,
                }))
            )
            .then(TestName => {
                this.setState({
                    test_name: TestName,
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    testChange = async selected => {
        await this.setState({
            personalInfo: {
                ...this.state.personalInfo,
                test_name: selected.value,
                selectedTest_name: selected,
            }
        });
    };

    async getCabang() {
        await axios.get(uAPIlocal + '/api/v1/home/cabang')
            .then(response =>
                response.data.results.map(branch => ({
                    value: `${branch.id_branch}`,
                    label: `${branch.branch_name}`,
                }))
            )
            .then(branch => {
                this.setState({
                    cabang: branch,
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    cabangChange = async selected => {
        await this.setState({
            personalInfo: {
                ...this.state.personalInfo,
                branch_bio: selected.value,
                selectedBranch_bio: selected,
                check_hours: null,
                selectedCheck_hours: null,
                slot: "",
                id_slot: null,
            }
        });

        await axios.post(uAPIlocal + '/api/v1/register/jam', {
            id_branch: this.state.personalInfo.branch_bio,
        })
            .then(response =>
                response.data.results.map(jam => ({
                    value: `${jam.id_slot}`,
                    label: `${jam.start_time} - ${jam.end_time}`,
                }))
            )
            .then(jam => {
                // console.log(jam)
                this.setState({
                    jam: jam,
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    jamChange = async selected => {
        await this.setState({
            personalInfo: {
                ...this.state.personalInfo,
                check_hours: selected.value,
                selectedCheck_hours: selected,
            }
        });

        await axios.post(uAPIlocal + '/api/v1/register/slot', {
            id_branch: this.state.personalInfo.branch_bio,
            id_slot: this.state.personalInfo.check_hours,
        })
            .then(function (response) {
                return response.data.results[0];
            })
            .then(response => {
                this.setState({
                    personalInfo: {
                        ...this.state.personalInfo,
                        slot: response.slot,
                        id_slot: response.id_slot,
                    }
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    hidemodalAlert() {
        this.setState({
            modalAlert: false,
            modalAlertMessage: null,
        })
    }
    hidemodalConfirm() {
        this.setState({
            modalConfirm: false,
        })
    }
    async setujuLanjut() {
        // console.log(this.state.personalInfo)
        await this.setState({
            loader: true
        })
        const formData = new FormData();
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        formData.append('firstname', this.state.personalInfo.firstname);
        formData.append('lastname', this.state.personalInfo.lastname);
        formData.append('hp', this.state.personalInfo.phone);
        formData.append('email', this.state.personalInfo.email);
        formData.append('gender', this.state.personalInfo.gender);
        formData.append('birth_date', this.state.personalInfo.dob);
        formData.append('address', this.state.personalInfo.address);
        formData.append('id_branch', this.state.personalInfo.branch_bio);
        // formData.append('check_hours', this.state.personalInfo.check_hours);
        formData.append('check_date', this.state.personalInfo.check_date);
        formData.append('id_slot', this.state.personalInfo.id_slot);
        formData.append('id_test', this.state.personalInfo.test_name);
        formData.append('status', 'UNPAID');

        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }

        await axios.post(uAPIlocal + '/api/v1/register/setuju', formData, config)
            .then(function (response) {
                return response.data;
            })
            .then(response => {
                console.log(response)
                const midtransToken = response.token;
                const midtransclientKey = response.clientKey;
                const midtransredirectUrl = response.redirectUrl;

                if (response.status === 202 || response.status === 204) {
                    this.setState({
                        loader: false,
                        modalConfirm: false,
                        modalAlert: true,
                        modalAlertMessage: response.message
                    })
                } else {
                    this.setState({
                        // midtrans: {
                        //     token: midtransToken,
                        //     clientKey: midtransclientKey,
                        //     redirectUrl: midtransredirectUrl,
                        // }
                        loader: false,
                        midtrans: response
                    })
                }


                // this.pay.current.click();

            })
            // .catch(function (error) {
            //     console.log(error)
            //     return error;
            // })
            .catch(error => {
                console.log(error);
                this.setState({
                    loader: false,
                    modalConfirm: false,
                    modalAlert: true,
                    modalAlertMessage: "Terjadi Kesalahan."
                })
            })



    }

    async snapMidtrans() {
        await axios.get(uAPIlocal + '/api/v1/payment/sandbox')
            .then(function (response) {
                return response.data;
            })
            .then(response => {
                this.setState({
                    midtrans: response,
                })
            })
            .catch(function (error) {
                console.log(error);
            });

        window.location.href = this.state.midtrans.redirectUrl;
        // window.open(this.state.midtrans.redirectUrl);

        // await snap.pay(this.state.midtrans.token, {
        //     onSuccess: function (result) {
        //         console.log('success');
        //         console.log(result);
        //     },
        //     onPending: function (result) {
        //         console.log('pending');
        //         console.log(result);
        //     },
        //     onError: function (result) {
        //         console.log('error');
        //         console.log(result);
        //     },
        //     onClose: function () {
        //         console.log('customer closed the popup without finishing the payment');
        //     }
        // })
    }
    onSuccess(result) {
        console.log('success');
        console.log(result);
    }
    onPending(result) {
        console.log('pending');
        console.log(result);
    }
    onError(result) {
        console.log('error');
        console.log(result);
    }
    onClose() {
        console.log('customer closed the popup without finishing the payment');
    }
    componentDidMount() {
        // console.log(this.props)
        this.getCabang();
        this.getTestName();
    }
    render() {
        const props = this.props;
        // console.log(props)
        if (this.state.midtrans !== null) {
            return (
                <Redirect to={{
                    pathname: "/registrasi/checkout",
                    state: {
                        midtrans: this.state.midtrans,
                        personalInfo: this.state.personalInfo
                    }
                }} />
            )
        }
        return (
            <div className="card">
                <div className="card-body">
                    <div id="wizard1">
                        <h3>Personal Information</h3>
                        <form onSubmit={e => this.onSubmit(e)}>
                            <div className="row row-sm form-group">
                                <div className="col-md-6 col-lg-6">
                                    <label className="form-control-label">Nama Depan: <span className="tx-danger">*</span></label>
                                    <input className="form-control" name="firstname" type="text" value={this.state.personalInfo.firstname} placeholder="Enter firstname" onChange={this.onChange} required />
                                </div>
                                <div className="col-md-6 col-lg-6 mg-t-20 mg-md-t-0">
                                    <label className="form-control-label">Nama Belakang: <span className="tx-danger">*</span></label>
                                    <input className="form-control" name="lastname" type="text" value={this.state.personalInfo.lastname} placeholder="Enter lastname" onChange={this.onChange} required />
                                </div>
                            </div>
                            <div className="row row-sm form-group">
                                <div className="col-md-6 col-lg-6">
                                    <label className="form-control-label">No Hp / Telepon: <span className="tx-danger">*</span></label>
                                    {/* <input className="form-control" name="phone" type="tel" value={this.state.personalInfo.phone} placeholder="Enter Hp" onChange={this.onChange} required /> */}
                                    <PhoneInput
                                        // className="form-control"
                                        // name="phone"
                                        type="tel"
                                        placeholder="Enter phone number"
                                        defaultCountry="ID"
                                        international={false}
                                        value={this.state.personalInfo.phone}
                                        onChange={this.phoneChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 col-lg-6 mg-t-20 mg-md-t-0">
                                    <label className="form-control-label">Email: <span className="tx-danger">*</span></label>
                                    <input className="form-control" name="email" type="email" value={this.state.personalInfo.email} placeholder="Enter Email" onChange={this.onChange} required />
                                </div>
                            </div>
                            <div className="row row-sm form-group">
                                <div className="col-md-6 col-lg-6">
                                    <label className="form-control-label">Jenis Kelamin: <span className="tx-danger">*</span></label>
                                    {/* <select className="form-control" name="gender" required>
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="L">Laki - Laki</option>
                                        <option value="P">Perempuan</option>
                                    </select> */}
                                    <Select
                                        name="gender"
                                        placeholder='Pilih Jenis Kelamin'
                                        value={this.state.personalInfo.selectedGender}
                                        onChange={this.genderChange}
                                        options={this.optionsGender}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-6 mg-t-20 mg-md-t-0">
                                    <label className="form-control-label">Tanggal Lahir: <span className="tx-danger">*</span></label>
                                    {/* <input className="form-control" name="dob" type="date" format="dd-mm-yyyy" value={this.state.personalInfo.dob} required /> */}
                                    <Datetime
                                        initialViewDate={new Date()}
                                        dateFormat="DD-MM-YYYY"
                                        timeFormat={false}
                                        onChange={this.dobChange}
                                        inputProps={{ name: "dob", placeholder: "dd-mm-yyyy", required: true }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-control-label">Alamat: <span className="tx-danger">*</span></label>
                                <textarea className="form-control" name="address" value={this.state.personalInfo.address} placeholder="Enter Address" onChange={this.onChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-control-label">Jenis Test: <span className="tx-danger">*</span></label>
                                <Select
                                    name="test_name"
                                    placeholder='Pilih Jenis Test'
                                    value={this.state.personalInfo.selectedTest_name}
                                    onChange={this.testChange}
                                    options={this.state.test_name}
                                />
                            </div>
                            <div className="row row-sm form-group">
                                <div className="col-md-6 col-lg-6">
                                    <label className="form-control-label">Tanggal Periksa: <span className="tx-danger">*</span></label>
                                    {/* <input className="form-control" name="check_date" type="date" value={this.state.personalInfo.check_date} required /> */}
                                    <Datetime
                                        initialViewDate={new Date()}
                                        dateFormat="DD-MM-YYYY"
                                        timeFormat={false}
                                        onChange={this.checkChange}
                                        inputProps={{ name: "check_date", placeholder: "dd-mm-yyyy", required: true }}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-6">
                                    <label className="form-control-label">Cabang Bio Medika: <span className="tx-danger">*</span></label>
                                    {/* <input className="form-control" name="branch_bio" type="text" /> */}
                                    <Select
                                        name="branch_bio"
                                        placeholder='Pilih Lokasi Cabang'
                                        value={this.state.personalInfo.selectedBranch_bio}
                                        onChange={this.cabangChange}
                                        options={this.state.cabang}
                                    />
                                </div>

                            </div>
                            <div className="row row-sm form-group">
                                <div className="col-md-6 col-lg-6 mg-t-20 mg-md-t-0">
                                    <label className="form-control-label">Jam Tersedia: <span className="tx-danger">*</span></label>
                                    {/* <input className="form-control" name="check_hours" type="text" /> */}
                                    <Select
                                        name="check_hours"
                                        placeholder='Pilih Jam'
                                        value={this.state.personalInfo.selectedCheck_hours}
                                        onChange={this.jamChange}
                                        isDisabled={this.state.jam === null ? true : false}
                                        options={this.state.jam ? this.state.jam : []}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-6 mg-t-20 mg-md-t-0">
                                    <label className="form-control-label">Slot Tersedia : <span className="tx-danger">*</span></label>
                                    <input className="form-control" name="slot" type="text" value={this.state.personalInfo.slot} readOnly required />
                                </div>
                            </div>
                            <div className="row row-sm form-group">
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    {/* <button className="btn btn-secondary btn-block">Kembali</button> */}
                                    {/* {
                                        props.hasPrev() && <button onClick={props.prev} className="btn btn-secondary btn-block">Kembali</button>
                                    } */}
                                </div>
                                <div className="col-sm-3 col-md-3 col-lg-3"></div>
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    {/* <Midtrans clientKey={'SB-Mid-client-Pqj7432TcWI9hC06'} token={'236158b4-3901-4301-a807-07cc3bf54aab'}>
                                        <button> My Button For PayMe </button>
                                    </Midtrans> */}
                                    {/* <button id="pay-button" type="button" className="btn btn-primary btn-block" onClick={this.snapMidtrans} >TEST</button> */}
                                </div>
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <button type="submit" className="btn btn-primary btn-block">Lanjut</button>
                                    {/* {props.hasNext() && <button onClick={props.next} type='submit' className="btn btn-primary btn-block">Lanjut</button>} */}
                                </div>
                            </div>
                            {/* {props.step.hasPrev() && <button onClick={props.prev}>Previous</button>}
                            {props.step.hasNext() && <button onClick={props.next}>Next</button>} */}
                        </form>
                    </div>

                    {
                        this.state.modalAlert ? (
                            <div className="modal" style={{ display: 'block' }}>
                                <div className="modal-dialog modal-dialog-centered" >
                                    <div className="modal-content tx-size-sm">
                                        <div className="modal-body tx-center pd-y-20 pd-x-20">
                                            <button className="close" type="button" onClick={this.hidemodalAlert}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <h4 className="tx-danger mg-b-20">Error: Cannot process your entry!</h4>
                                            <p className="mg-b-20 mg-x-20">{this.state.modalAlertMessage}</p>
                                            <button className="btn ripple btn-danger pd-x-25" type="button" onClick={this.hidemodalAlert}>Continue</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }

                    {
                        this.state.modalConfirm ? (
                            <div className="modal" style={{ display: 'block' }}>
                                <div className="modal-dialog modal-dialog-centered" >
                                    <div className="modal-content tx-size-sm">
                                        <div className="modal-body tx-center pd-y-20 pd-x-20">
                                            <button className="close" type="button" onClick={this.hidemodalConfirm}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <h4 className="tx-success tx-semibold mg-b-20">Melanjutkan Ke Pembayaran.</h4>
                                            <p className="mg-b-20 mg-x-20">Pastikan semua data yang anda isi sudah benar dan setuju untuk patuh terhadap syarat & ketentuan di Bio Medika Lab.</p>
                                            {
                                                this.state.loader ? (
                                                    <Loader type="TailSpin" color="#00BFFF" height={50} width={100} />
                                                ) : (
                                                        <div>

                                                            <button className="btn ripple btn-secondary pd-x-25" type="button" onClick={this.hidemodalConfirm}>Kembali</button> <button className="btn ripple btn-primary pd-x-25" type="button" onClick={this.setujuLanjut}>Lanjutkan</button>
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }


                </div>
            </div>
        )
    }
}
export default PersonalInfo;