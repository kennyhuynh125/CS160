import React, {Component} from 'react';
import { Container, Button, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap';
import axios from 'axios';
import history from '../../history';
/*
This component renders the form for users to log in.
Form contains field for username and password.
*/
class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isCustomer: '',
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleCustomerChange = this.handleCustomerChange.bind(this);
        this.authenticate = this.authenticate.bind(this);
    }

    // changes the password state to what the user inpus
    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
        })
    }

    // changes the username state to what the user inputs;
    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value,
        })
    }
    
    // changes whether person logs in as driver or customer
    handleCustomerChange = (e) => {
        this.setState({
            isCustomer: e.target.value === 'customer' ? true : false,
        });
    }
    
    // authenticates and logs user if username/password is valid
    authenticate = (e) => {
        // print statements for testing purposes
        axios.post(`/api/loguser`, {
            username: this.state.username,
            password: this.state.password,
        })
        .then((response) => {
            if (response.data === true) {
                alert('Sucessfully logged in.');
                sessionStorage.setItem('isLoggedIn', true);
                sessionStorage.setItem('driver', !this.state.isCustomer);
                sessionStorage.setItem('customer', this.state.isCustomer);
                history.push('/');
            }
        })
        .catch((error) => {
            console.log(error);
        })
        e.preventDefault();
    }
    render() {
        return (
            <Container>
                <h1>Log In</h1>
                <Form onSubmit={this.authenticate}>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="text" name="username" id="username" onChange={this.handleUsernameChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="password" name="password" id="password" onChange={this.handlePasswordChange} required />
                    </FormGroup>
                    <FormGroup>
                        <CustomInput type="radio" id="radio" name="customRadio" label="Customer" 
                        value="customer" onChange={this.handleCustomerChange} inline required />
                        <CustomInput type="radio" id="radio1" name="customRadio" label="Driver" 
                        value="driver" onChange={this.handleCustomerChange} inline requred />
                    </FormGroup>
                    <Button>Log In</Button>
                </Form>
            </Container>
        )
    }
}

export default LogIn;
