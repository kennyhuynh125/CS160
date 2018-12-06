import React, { Component } from 'react';
import { Container } from 'reactstrap';
import homeImage from '../../images/main.png';
import history from '../../history';
import { SPACER } from '../../constants';
/*
This component is the main page when the user goes on our site.
*/
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
        <br />
        <h1>What is LetItFly?</h1>
        LetItFly is a new on-demand airport shuttle service that allows you to
        book a ride to or from any Bay Area airport, any time you want! With
        rides available 24/7 and competitive rates, it's the best way to save
        both time and money traveling throughout the Bay Area. Not interested in
        a ride, but willing to drive? Our drivers are subcontracted from across
        the Bay Area, so you can also start driving for other people right away
        and get compensated for your time.
        <p />
        <h2>How does LetItFly work?</h2>
        <p />
        LetItFly uses real-time driving traffic and location-based searches to
        ensure the shortest wait times possible. With heavily-congested Bay Area
        roads, we know it can be a hassle to travel around, so our fare
        calculation is weighted more heavily towards distance than time - all to
        ensure you get to where you're headed quickly and affordably. If you're
        not in a hurry, you can carpool with others and even save on your fare.
        <p />
        <h2>Getting Started</h2>
        <p />
        Sign up or log into the website as a customer or driver.
        <p />
        Getting started with LetItFly is easy - just{' '}
        <a href="/signup">sign up</a> or <a href="/login">log in</a> to the
        website as a customer or driver, and you're ready to fly!
        <p />
      </Container>
    );
  }
}

export default Home;
