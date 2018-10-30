import React, { Component, Fragment } from 'react';
import history from '../../history';
import { Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
import { updateDriverStatus } from '../../helper';

/*
This component renders the header on the top of the screen.
*/
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    // log out user by setting driver status to 0 and clearing sessionStorage
    logOut = () => {
        const userId = sessionStorage.getItem('userId');
        const isDriver = sessionStorage.getItem('driver');
        updateDriverStatus(userId, isDriver, 0);
        alert('You have successfully logged out.');
        sessionStorage.clear();
        window.location.reload();
        history.push('/');
    }

    render() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        return (
            <Container>
                <Navbar expand="md">
                    <NavbarBrand href="/" className="mr-auto">LetItFly</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} className="mr-2" />
                    <Collapse isOpen={!this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/">Home</NavLink>
                            </NavItem>
                            {
                                !isLoggedIn && (
                                    <Fragment>
                                        <NavItem>
                                            <NavLink href="/login">Log In</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="/signup">Sign Up</NavLink>
                                        </NavItem>
                                    </Fragment>
                                )
                            }
                            {
                                isLoggedIn && (
                                    <Fragment>
                                        <NavItem>
                                            <NavLink href="/payment">Payment Settings</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="/settings">Account Info</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="#" onClick={this.logOut}>Log Out</NavLink>
                                        </NavItem>
                                    </Fragment>
                                )
                            }
                        </Nav>
                    </Collapse>
                </Navbar>
            </Container>
        )
    }
}

export default Header;
