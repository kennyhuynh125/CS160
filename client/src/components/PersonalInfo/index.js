import React, {Component} from 'react';
import { Container } from 'reactstrap';
import Editable from 'react-x-editable';
//requires you to install react-x-editable: npm install react-x-editable

export default class PersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'e-mail',
            phone: 'Phone',
        }
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
    }


    // changes the firstname state to what the user inputs
    handleFirstNameChange = (e) => {
        this.setState({
            firstName: e.target.value,
        })
    }

    // changes the lastname state to what the user inputs
    handleLastNameChange = (e) => {
        this.setState({
            lastName: e.target.value,
        })
    }

    // changes the email state to what the user inputs
    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
        })
    }

    // changes the phone number state to what the user inputs
    handlePhoneChange = (e) => {
        this.setState({
            phone: e.target.value,
        })
    }


    render() {
        return (
            <Container>
                <h2>Personal Information</h2>
                <h5>First Name:</h5>
                <Editable
                    name="First Name"
                    dataType="text"
                    mode="inline"
                    value={this.state.firstName}
                    onUpdate={this.handleFirstNameChange}
                />
                <h5>Last Name:</h5>
                <Editable
                    name="Last Name"
                    dataType="text"
                    mode="inline"
                    value={this.state.lastName}
                    onUpdate={this.handleLastNameChange}
                />
                <h5>E-mail:</h5>
                <Editable
                    name="e-mail"
                    dataType="text"
                    mode="inline"
                    value={this.state.email}
                    onUpdate={this.handleEmailChange}
                    validate={(value) => {
                        let validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if(!validEmail.test(value)){
                            return 'Must input a valid e-mail address';
                        }
                    }}
                /> 
                <h5>Phone Number:</h5>
                <Editable
                    name="phone"
                    dataType="text"
                    mode="inline"
                    value={this.state.phone}
                    onUpdate={this.handlePhoneChange}
                    validate={(value) => {
                        if(value % 1 !== 0 || value.length !== 10){
                            return 'Must input a valid number (no spaces, include area code)';
                        }
                    }}
                />
            </Container>
        );
    }
}
