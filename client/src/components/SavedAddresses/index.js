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
                                
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.cards.map((address, i) => {
                                    return (
                                        <tr key={i+1}>
                                            
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
