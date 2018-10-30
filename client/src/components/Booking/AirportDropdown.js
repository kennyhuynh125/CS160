import React, {Component} from 'react';
import {Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import axios from 'axios';
import history from '../../history';

import { Margin, Padding } from 'styled-components-spacing';
/*
This component is the booking page, users can select or input locations
and then book a ride
*/
class AirportDropdown extends Component {
	
    constructor(props) {
        super(props);
        this.state = {
			isOpen: false,
			labelText: this.props.labelText,
        }
		this.onClick = this.onClick.bind(this);
    }
	toggle = () => {
		this.setState(prevState => ({
			isOpen: !prevState.isOpen
		}));
	}
	onClick(e) {
		if (this.props.onSelect) {
			this.props.onSelect(e);
		}
		this.setState(prevState => ({
			labelText:"A",
		}));
		this.toggle;
	}
	render() {
        return (
			<Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
				<DropdownToggle caret>{this.state.labelText}</DropdownToggle>
				<DropdownMenu>
					<DropdownItem label={this.props.label1} value={this.props.loc1} onClick={this.onClick}>{this.props.label1}</DropdownItem>
					<DropdownItem label={this.props.label2} value={this.props.loc2} onClick={this.onClick}>{this.props.label2}</DropdownItem>
					<DropdownItem label={this.props.label3} value={this.props.loc3} onClick={this.onClick}>{this.props.label3}</DropdownItem>
				</DropdownMenu>
			</Dropdown>
        )
    }
}

export default AirportDropdown;
