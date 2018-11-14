import React, {PureComponent} from 'react';
import { Alert, Row, Col } from 'reactstrap';
/*
This component renders the form for users to log in.
Form contains field for username and password.
*/
class StyledAlert extends PureComponent {
    render() {
        return (
			<Row>
				<Col xs="auto">
					<Alert color={this.props.color}>{this.props.message}</Alert>
				</Col>
			</Row>
        )
    }
}
export default StyledAlert;
