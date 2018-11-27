import React, { Component, Fragment } from 'react';
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { updateDriverStatus } from '../../helper';
import history from '../../history';

/*
This component renders the header on the top of the screen.
*/
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  // log out user by setting driver status to 0 and clearing sessionStorage
  logOut = () => {
    const userId = sessionStorage.getItem('userId');
    const isDriver = sessionStorage.getItem('driver');
    updateDriverStatus(userId, isDriver, 0);
    alert('You have successfully logged out.');
    sessionStorage.clear();
    window.location.reload();
    history.push('/');
  };

  render() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    return (
      <Navbar color="dark" dark expand="md" sticky="top">
        <Container>
          <NavbarBrand href="/" className="mr-auto">
            <div style={{ color: '#fff' }}>
              <FontAwesomeIcon icon={faPaperPlane} /> LetItFly
            </div>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} className="mr-2" />
          <Collapse isOpen={!this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {!isLoggedIn && (
                <Fragment>
                  <NavItem>
                    <NavLink href="/login">Log In</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/signup">Sign Up</NavLink>
                  </NavItem>
                </Fragment>
              )}
              {isLoggedIn && (
                <Fragment>
                  <NavItem>
                    <NavLink href="/homepage">Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/payment">Payment Settings</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/settings">Account Info</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#" onClick={this.logOut}>
                      Log Out
                    </NavLink>
                  </NavItem>
                </Fragment>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Header;
