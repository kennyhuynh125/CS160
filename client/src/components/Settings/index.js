import React, {Component} from 'react';
import { Container, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText} from 'reactstrap';
import Editable from 'react-x-editable';
import { AvForm, AvField } from 'availity-reactstrap-validation';
//import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
//requires you to install react-x-editable: npm install react-x-editable

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        }
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

    handleValidSubmit(event, values) {
        this.setState({email: values.email});
    }

    handleInvalidSubmit(event, errors, values) {
        this.setState({email: values.email, error: true});
    }

    render() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        return (
            <Form>
                <FormGroup>
                    <legend>Account Settings</legend>
                </FormGroup>
                <FormGroup>
                    <Label for="exampleFirstName">First Name</Label>
                    <Input type="firstName" name="firstName" id="exampleFirstName" placeholder="with a placeholder" onUpdate={this.handleFirstNameChange}/>
                </FormGroup>
                <FormGroup>
                    <Label for="exampleLastName">Last Name</Label>
                    <Input type="lastName" name="lastName" id="exampleLastName" placeholder="with a placeholder" onUpdate={this.handleLastNameChange}/>
                </FormGroup>
                <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
                    <AvField name="email" label="Email Address" type="email" required placeholder="with a placeholder" onUpdate={this.handleEmailChange}/>
                </AvForm>
                <AvForm>
                    <AvField name="phoneNumber" label="Phone Number" type="tel" placeholder="with a placeholder" onUpdate={this.handleEmailChange}/>
                </AvForm>
                    <FormGroup tag="fieldset">
                    <label>Allow Detour</label>
                    <FormGroup check>
                        <Label check>
                            <Input type="radio" name="radio1" />{' '}
                            Yes
                        </Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="radio" name="radio1" />{' '}
                            No
                        </Label>
                    </FormGroup>
                </FormGroup>
                < Button > Submit </Button>
                <h5><a href="/">Ride History</a></h5>
                <h5><a href="/">Change Password</a></h5>
            </Form>
        );
    }
}

                            /*
                            <h2>Account Settings</h2>
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
                            <h5>Allow Detours</h5>
                            <ButtonGroup>
                                <Button color="success">On</Button>
                                <Button color="link">Off</Button>
                            </ButtonGroup>
                            <h5><a href="/">Ride History</a></h5>
                            <h5><a href="/">Change Password</a></h5>
                    )
                }
                {
                    !isLoggedIn && (
                        <div>You must be logged in to access this page!</div>
                    )
                }

            </Form>
        );
    }
}
*/