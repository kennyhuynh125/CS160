import React, { Component } from 'react';
/*
This component is the main page when the user goes on our site.
*/
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        }
    }

    // before we render the home page, make an api call to get all users
    // and set the response to the users state.
    async componentDidMount() {
        try {
            const res = await fetch('/api/');
            const users = await res.json();
            this.setState({
                users: users,
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        // print state to see if are retrieving users for testing purposes
        console.log(this.state);
        return (
            <div>
                Hello World!
            </div>
        )
    }
}

export default Home;
