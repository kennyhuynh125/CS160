import React, {PureComponent} from 'react';
import { UncontrolledAlert, Row, Col} from 'reactstrap';
/*
This component renders the form for users to log in.
Form contains field for username and password.
*/
class StyledUncontrolledAlert extends PureComponent {
    render() {

        return (
                {
                    this.props.cond1 && this.props.cond2 && (
                        <UncontrolledAlert color="success">
                            Ride request accepted. Customer has been notified.
                        </UncontrolledAlert>
                    )
                }
        )
    }
}
export default StyledUncontrolledAlert;
