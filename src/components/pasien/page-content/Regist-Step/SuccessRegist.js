import React, { Component } from 'react';
import Logo from '../../../../assets/img/login-logo.png';
import jsPDF from "jspdf";
import QR from "react-qr-code";
import QRCode from 'qrcode'
import QueryString from 'query-string'
import { Redirect } from 'react-router-dom';



class SuccessRegist extends Component {
    constructor(props) {
        super(props);
        const queryString = QueryString.parse(window.location.search);
        this.state = {
            queryString: window.location.search ? queryString : null,
        }
        this.ref = React.createRef();
    }
    generatePDF = () => {
        var doc = new jsPDF();

        doc.setFontSize(30);
        doc.setFont("helvetica", "bold");
        doc.text("Bio Medika", 110, 20, null, null, "center");
        doc.setFontSize(20);
        doc.setFont("times", "normal");
        doc.text("Laboratorium Klinik", 110, 26, null, null, "center");

        doc.setFont("times", "bold");
        doc.text("Kode Booking", 110, 40, null, null, "center");
        doc.addImage(this.state.qrImage, "PNG", 80, 42, 60, 60);
        doc.text(this.state.queryString.order_id, 110, 110, null, null, "center");

        doc.setLineWidth(0.5);
        doc.line(10, 115, 200, 115);

        doc.setFontSize(14);
        doc.setFont("times", "normal");
        doc.text("Pastikan datang pada tanggal yang sudah dibooking.", 10, 125);
        doc.text("Pastikan membawa KTP (KTP wali bila belum memiliki KTP).", 10, 132);
        doc.text("Pastikan memakai masker.", 10, 139);
        doc.text("Pastikan didampingi maksimal 1 orang pendamping.", 10, 146);

        doc.setLineWidth(0.5);
        doc.line(10, 155, 200, 155);

        doc.setFontSize(14);
        doc.setFont("times", "normal");
        doc.text("Ada pertanyaan?", 10, 165);
        doc.text("Silahkan hubungi", 10, 170);
        doc.text("Tel: 021 29 222 222", 10, 175);
        doc.text("Sms: 0812 8799 2222", 10, 180);
        doc.text("Email: customercare@ancol.com", 10, 185);


        doc.save(`Kode Booking - ${this.state.queryString.order_id }.pdf`)
    }


    componentDidMount() {
        QRCode.toDataURL('GA060120210001A', { type: "png" })
            .then(img => {
                this.setState({
                    qrImage: img
                })
            })

    }
    render() {
        if (this.state.queryString === null) {
            return (<Redirect to={{
                pathname: "/",
            }} />)
        }
        return (
            <div className="container" style={{ marginTop: '1.3rem' }}>
                <div className="card">
                    <div className="card-body">
                        <div className='text-center'>
                            <h3 style={{ color: 'green' }}>Pembayaran Berhasil.</h3>
                            <hr />
                            <h4>Pastikan anda menyimpan Kode Booking dibawah ini.</h4>
                            <h5>Berikut Kode Booking Anda:</h5>
                            <p>{this.state.queryString.order_id}</p>
                            <QR value={this.state.queryString.order_id} />

                            <p><br />atau download QR Code</p>
                            <button onClick={this.generatePDF} className="btn btn-primary btn-block">Download</button>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}
export default SuccessRegist;