import React from 'react';
const Cards = ({ cards }) => {
    return (
      <div className="col-md-12">
        <h3>Existing Cards</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Card Number</th>
              <th scope="col">Balance</th>
              <th scope="col">Limit</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card._id}>
                <td>{card.name}</td>
                <td>{card.number}</td>
                <td>{card.balance}</td>
                <td>{card.limit}</td>
              </tr>
            ))}
            
          </tbody>
        </table>
        
      </div>
    )
  };

  export default Cards;