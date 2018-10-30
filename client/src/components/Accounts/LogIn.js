import React, {Component} from 'react';
import { Container, Button, Form, CustomInput, Row, Col} from 'reactstrap';
import axios from 'axios';
import history from '../../history';
import { addDriver } from '../../helper';
import {StyledInput, StyledAlert} from '../Reusable'
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
			loginError: false
        }
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
        let userId;
        let isDriver;
        axios.post(`/api/loguser`, {
            username: this.state.username,
            password: this.state.password,
        })
        .then((response) => { // logs user
            if (response.data) {
                sessionStorage.setItem('isLoggedIn', true);
                sessionStorage.setItem('driver', !this.state.isCustomer);
                sessionStorage.setItem('customer', this.state.isCustomer);
                sessionStorage.setItem('userId', response.data);
                userId = sessionStorage.getItem('userId');
                isDriver = sessionStorage.getItem('driver');
                const geolocation = navigator.geolocation;
                if (geolocation) {
                    geolocation.getCurrentPosition((position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        return addDriver(userId, isDriver, 1, latitude, longitude);
                    });
                }
				// push to home page on successful login
				history.push('/');
            } else {
				this.setState({
					loginError: true
				});	
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
					<StyledInput fieldName="username" labelText="Username" xs="4" fieldType="text" changeFunction={this.handleUsernameChange}></StyledInput>
					<StyledInput fieldName="password" labelText="Password" xs="4" fieldType="password" changeFunction={this.handlePasswordChange}></StyledInput>
					{
						this.state.loginError && (
						<StyledAlert color="warning" message="The username or password was incorrect! Please Try again."/>
						)
					}
					<Row xs="2">
						<Col xs={{size: "auto", offset: .5}}>
							<CustomInput type="radio" id="radio" name="customRadio" label="Customer" value="customer" onChange={this.handleCustomerChange} inline required />
						</Col>
						<Col xs={{size: "auto", offset: 0}}>
							<CustomInput type="radio" id="radio1" name="customRadio" label="Driver" value="driver" onChange={this.handleCustomerChange} inline required />
						</Col>
					</Row>
                    <Button>Log In</Button>
                </Form>
            </Container>
        )
    }
}

export default LogIn;
