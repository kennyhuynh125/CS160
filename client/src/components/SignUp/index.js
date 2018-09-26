import React, {Component} from 'react';
import { Container, Button, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap';

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
            isCustomer: '',
        }

        this.handleCustomerChange = this.handleCustomerChange.bind(this);
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

    handleCustomerChange = (e) => {
        this.setState({
            isCustomer: e.target.value === 'customer' ? true : false,
        });
    }
    
    // checks if username is in db already
    // if not, adds new user to db and redirects to log in page.
    signUp = (e) => {
        // print statement for testing purposes
        console.log(this.state.username);
        console.log(this.state.password);
        e.preventDefault();
    }
    render() {
        console.log(this.state);
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
                    <FormGroup>
                        <CustomInput type="radio" id="radio" name="customRadio" label="Customer" 
                        value="customer" onChange={this.handleCustomerChange} inline  />
                        <CustomInput type="radio" id="radio1" name="customRadio" label="Driver" 
                        value="driver" onChange={this.handleCustomerChange} inline />
                    </FormGroup>
                    <Button>Sign Up</Button>
                </Form>
            </Container>
        )
    }
}

export default SignUp;