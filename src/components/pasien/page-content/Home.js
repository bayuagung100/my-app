import React, { Component } from 'react';
// import { Carousel } from 'react-responsive-carousel';
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import Banner from '../../../assets/img/banner-img.png';
// import ZigWhite from '../../../assets/img/icon-zigzag-white.png';
import Zig from '../../../assets/img/icon-zigzag.png';
import Barcode from '../../../assets/img/barcode.png';
import { uAPIlocal } from '../../lib/config';
import axios from 'axios';
// import { Link } from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cabang: null,
        }
    }
    async getCabang() {
        await axios.get(uAPIlocal + '/api/v1/home/cabang')
            .then(function (response) {
                return response.data.results;
            })
            .then(response => {
                // console.log(response)
                this.setState({
                    cabang: response,
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    componentDidMount() {
        // this.getCabang();
    }
    render() {
        return (
            // <div className='container-fluids'>
            //     <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} >
            //         {
            //             this.state.cabang ? (
            //                 this.state.cabang.map((value, index) => {
            //                     return (
            //                         <div key={index} style={{ maxHeight: '400px' }} >
            //                             <img alt="banner" src={Banner} />
            //                             <div className='mySlider'>
            //                                 <h4 >SWAB TEST LOCATION</h4>
            //                                 <h3>BIO MEDIKA</h3>
            //                                 <h3>{ value.branch_name }</h3>
            //                                 <img alt="zig-zag" src={ZigWhite} className='zig-zag' />
            //                                 <Link to='/registrasi' className="btn btn-success btn-block">REGISTRASI</Link>
            //                             </div>
            //                         </div>
            //                     )
            //                 })
            //             ) : null
            //         }
            //     </Carousel>
            // </div>
            <div className='container'>
                <div className='row pd-40'>
                    <div className='col-xl-9'>
                        <img alt="zig-zag" src={Zig} className='zig-zag bg-icon1' />
                        <div className="row">
                            <div className="col-md-12 font-green">
                                <h3>Syarat &amp; Ketentuan untuk mengikuti Swab Test :</h3>
                            </div>
                            <div className="col-md-12 mg-b-30">
                                <div> 1. Membawa KTP (KTP Wali bila belum memiliki KTP).</div>
                                <div> 2. Memakai Masker.</div>
                                <div> 3. Didampingi maksimal 1 org pendamping, terutama untuk pasien anak, manula ataupun pasien dengan disabilitas.</div>
                            </div>
                            <div className="col-md-12">
                                <h3> <span className="btn-green">Address:</span></h3>
                            </div>
                            <div className="col-md-12 mg-b-30">
                                <div> <b>Jl. Gandaria 1 No.95, RT.2/RW.8, Gandaria Utara, Kec. Kby. Baru, <br /> Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12140</b></div>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-3'>
                        <div className="row">
                            <div className="col-md-12">
                                <img alt="barcode-maps" src={Barcode} className='barcode' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Home;