import React from 'react';
import { Table } from 'reactstrap';

/*
* This component renders a table that displays the list of cards for the current user.
*/
const CardInformation = (props) => {
    return (
        <div>
            {
                props.cards !== undefined && props.cards.length !== 0 && (
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Number</th>
                                <th>CVV</th>
                                <th>Exp Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.cards.map((card, i) => {
                                    return (
                                        <tr key={i+1}>
                                            <td>{card.ccName}</td>
                                            <td>{card.ccType}</td>
                                            <td>{card.ccNumber.replace(/./g, '*')}</td>
                                            <td>{card.ccCVV}</td>
                                            <td>{`${card.ccExpirationMonth}/${card.ccExpirationYear}`}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                )
            }
            {
                (props.cards === undefined || props.cards.length === 0) && (
                    <p>No cards saved.</p>
                )
            }
        </div>
    )
}

export default CardInformation;
