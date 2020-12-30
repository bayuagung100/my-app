import React, { Component } from 'react';
import { Steps, Step } from "react-step-builder";
import BillingInfo from './Regist-Step/BillingInfo';
import PersonalInfo from './Regist-Step/PersonalInfo';

class Registrasi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    render() {
        return (
            <div className="container" style={{marginTop: '1.3rem'}}>
                <PersonalInfo/>
                {/* <Steps>
                    <Step title="Personal Information"  component={PersonalInfo} />
                    <Step title="Billing Information"  component={BillingInfo} />
                </Steps> */}
            </div>
        )
    }
}

export default Registrasi;