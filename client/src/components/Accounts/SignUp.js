import React, {Component} from 'react';
import {Container, Button, Form, FormGroup, Label, Input, Row, Col, Alert } from 'reactstrap';
import axios from 'axios';
import { StyledInput, StyledAlert } from '../Reusable'
import { SPACER } from '../../constants';
/*
This component renders the form for users to sign up for an account.
Form contains field for username and password.
*/
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
			signUpError: false,
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
    
    // checks if username is in db already and alert that it is taken
    // if not, adds new user to db and redirects to log in page.
    signUp = (e) => {
        axios.post(`/api/createuser`, {
            username: this.state.username,
            password: this.state.password,
        })
        .then((response) => {
            // our api will return True if it can successfully sign someone up
            // alert user and send them to login page
            if (response.data === true) {
                alert('Thank you for signing up. You may now log in.');
                this.props.history.push('/login');
            } else {
                this.setState({
					signUpError: true
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
                <h1>Sign Up</h1>
                <Form onSubmit={this.signUp}>
					<StyledInput fieldName="username" labelText="Username" xs="4" fieldType="text" changeFunction={this.handleUsernameChange}></StyledInput>
                    <div style={SPACER} />
					{this.state.signUpError && (
						<StyledAlert color="warning" message="This username is taken. Please try another one."/>
						)
                    }
                    <StyledInput fieldName="password" labelText="Password" xs="4" fieldType="password" changeFunction={this.handlePasswordChange}></StyledInput>
                    <div style={SPACER} />
                    <Button>Sign Up</Button>
                </Form>
            </Container>
        )
    }
}

export default SignUp;