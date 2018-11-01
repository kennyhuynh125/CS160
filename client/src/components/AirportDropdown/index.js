import React, {Component} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

/*
This component is the booking page, users can select or input locations
and then book a ride
*/

class AirportDropdown extends Component {
	
    constructor(props) {
        super(props);
        this.state = {
			isOpen: false,
        }
    }
	toggle = () => {
		this.setState({
            isOpen: !this.state.isOpen,
        });
    }
    
	render() {
        return (
			<Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
				<DropdownToggle caret>{this.props.labelText}</DropdownToggle>
				<DropdownMenu>
					<DropdownItem label={this.props.label1} value={this.props.loc1} onClick={this.props.onClick}>{this.props.label1}</DropdownItem>
					<DropdownItem label={this.props.label2} value={this.props.loc2} onClick={this.props.onClick}>{this.props.label2}</DropdownItem>
					<DropdownItem label={this.props.label3} value={this.props.loc3} onClick={this.props.onClick}>{this.props.label3}</DropdownItem>
				</DropdownMenu>
			</Dropdown>
        )
    }
}

export default AirportDropdown;