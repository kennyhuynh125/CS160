import React, {Component} from 'react';
import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap';

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
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
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
    
    // authenticates and logs user if username/password is valid
    authenticate = (e) => {
        // print statements for testing purposes
        console.log(this.state.username);
        console.log(this.state.password);
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
                    <Button>Log In</Button>
                </Form>
            </Container>
        )
    }
}

export default LogIn;
