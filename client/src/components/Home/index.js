import React, { Component } from 'react';
import { Container } from 'reactstrap';
import homeImage from '../../images/main.png';
import history from '../../history';
import 
{
    SPACER
} from '../../constants';
/*
This component is the main page when the user goes on our site.
*/
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    // if user is logged in, redirect to homepage
    componentDidMount() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            history.push('/homepage');
        }
    }
    render() {
        return (
            <Container>
                <img src={homeImage} alt="home-banner" />
                <div style={SPACER} />
                <br/><h1>LetItFly</h1>
                LetItFly is a new service that allows you to book a ride to or from any Bay Area airport any time you
                want.
                <p/><h2>Getting Started</h2>
                <p/>Sign up or log into the website as a customer or driver.
            </Container>
        )
    }
}

export default Home;
