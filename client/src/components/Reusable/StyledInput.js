import React, { Component } from 'react';
import { Container, Label, Input, Row, Col } from 'reactstrap';
/*
This component renders the form for users to log in.
Form contains field for username and password.
*/
class StyledInput extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Label for={this.props.fieldName}>{this.props.labelText}</Label>
        </Row>
        <Row>
          <Col xs={this.props.xs}>
            <Input
              type={this.props.fieldType}
              name={this.props.fieldName}
              id={this.props.fieldName}
              onChange={this.props.changeFunction}
              required
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default StyledInput;
