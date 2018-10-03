import React, {Component} from 'react';
import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

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
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.signUp = this.signUp.bind(this);
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
                alert('Username is taken. Please try another one.');
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
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="text" name="username" id="username" onChange={this.handleUsernameChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="password" name="password" id="password" onChange={this.handlePasswordChange} required />
                    </FormGroup>
                    <Button>Sign Up</Button>
                </Form>
            </Container>
        )
    }
}

export default SignUp;
