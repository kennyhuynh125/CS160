import React, { Component } from 'react';
import { Button } from 'reactstrap';
import history from '../../history';

/*
* This component renders out the summary page after a ride has been completed.
*/
class BookingPayment extends Component {
    // redirects 
    redirectToHome = () => {
        history.push('/');
    }

    render() {
        return (
            <center>
                <p>Ride Summary</p>
                <p>Destination: {this.props.destination}</p>
                <p>Total Distance: {this.props.distance} mi</p>
                <p>Total Duration: {this.props.duration} mins</p>
                <p>Total Cost: ${this.props.totalCost}</p>
                <Button onClick={this.redirectToHome}>Home</Button>
            </center>
        )
    }
}

export default BookingPayment;
