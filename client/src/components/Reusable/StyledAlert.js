
import React, {PureComponent} from 'react';
import {Container, Alert, Row, Col} from 'reactstrap';
/*
This component renders the form for users to log in.
Form contains field for username and password.
*/
class StyledAlert extends PureComponent {
    render() {
        return (
			<Container>
				<Row>
					<Col xs="auto">
						<Alert color={this.props.color}>{this.props.message}</Alert>
						</Col>
				</Row>
			</Container>
        )
    }
}
export default StyledAlert;
