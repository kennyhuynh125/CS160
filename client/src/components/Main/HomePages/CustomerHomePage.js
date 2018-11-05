import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Col, Button } from 'reactstrap';

/*
* This component displays the home page for when a customer signs in.
*/
class CustomerHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    render() {
        return (
            <div>
                <h1>Hello Customer!</h1>
                <Col>
                    <a href="/booking"><Button color="primary"><FontAwesomeIcon icon={faPaperPlane} /> Request a Ride</Button></a>
                </Col>
            </div>
        )
    }
}

export default CustomerHomePage;
