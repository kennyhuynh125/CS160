import React from 'react';
import { Table } from 'reactstrap';

/*
* i stole this from cardinformation to fill out later
*/
const SavedAddresses = (props) => {
    return (
        <div>
            {
                props.addresses !== undefined && props.addresses.length !== 0 && (
                    <Table bordered hover striped>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last name</th>
                                <th>Street</th>
                                <th>Apt No.</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Zip</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.addresses.map((address, i) => {
                                    return (
                                        <tr key={i+1}>
                                            <td>{address.firstName}</td>
                                            <td>{address.lastName}</td>
                                            <td>{address.street}</td>
                                            <td>{address.aptNo}</td>
                                            <td>{address.city}</td>
                                            <td>{address.state}</td>
                                            <td>{address.zipCode}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                )
            }
            {
                (props.addresses === undefined || props.addresses.length === 0) && (
                    <p>No addresses saved.</p>
                )
            }
        </div>
    )
}

export default SavedAddresses;
