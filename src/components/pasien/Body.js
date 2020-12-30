import React, { Component } from 'react';
import Home from './page-content/Home';
import Registrasi from './page-content/Registrasi';

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            path: this.props.path,
        }
    }
    componentDidMount() {
        console.log(this.props);
    }
    render() {
        if (this.state.path === '/') {
            return (
                <Home />
            )
        } else if (this.state.path === '/registrasi') {
            return (
                <Registrasi />
            )
        } else {
            return <h3>Not Found</h3>;
        }
        // return (
        //     <div>
        //         {
        //             this.state.path === '/' ? (
        //                 <Home />
        //             ) : (

        //                     <Registrasi />
        //                 )
        //         }
        //     </div>

        // )
    }
}
export default Body;