import React, { Component } from 'react';

class BillingInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const props = this.props;
        // console.log(props)
        return (
            <div className="card">
                <div className="card-body">
                    <h3>Billing Information</h3>
                    <section>
                        <div className="table-responsive mg-t-20">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td>Test Swab</td>
                                        <td className="text-right">Rp 900.000</td>
                                    </tr>
                                    <tr>
                                        <td><span>Order Total</span></td>
                                        <td>
                                            <h2 className="price text-right mb-0">Rp 900.000</h2>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row row-sm form-group">
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                {props.hasPrev() && <button onClick={props.prev} class="btn btn-secondary btn-block">Kembali</button>}
                            </div>
                            <div class="col-sm-3 col-md-3 col-lg-3"></div>
                            <div class="col-sm-3 col-md-3 col-lg-3"></div>
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                {props.hasNext() && <button onClick={props.next} class="btn btn-primary btn-block">Lanjut</button>}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
export default BillingInfo;