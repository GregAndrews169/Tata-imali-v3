import React, { useState, useEffect } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import './debtView.css'; // Ensure you create a CSS file for styling
import { auth, firestore } from '../Firebase/config';

function DebtView() {
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      firestore.collection('debt')
        .where('userId', '==', currentUser.uid)
        .get()
        .then(querySnapshot => {
          const userDebts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDebts(userDebts);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching debts:', error);
          setIsLoading(false);
        });
    }
  }, []);

  const handleRollover = (debtId) => {
    // Implement rollover functionality
  };

  const handleRepayNow = (debtId) => {
    // Implement repayment functionality
  };

  return (
    <div className="debt-view-container">
      <div className="logo-container">
        <img src={logo} alt="Tata iMali Logo" className="logo" />
      </div>
      {isLoading ? (
        <p>Loading debts...</p>
      ) : (
        debts.map(debt => (
          <div key={debt.id} className="debt-card">
            <table className="debt-table">
              <tbody>
                <tr>
                  <td>Amount owing:</td>
                  <td>{debt.totalAmount}</td>
                </tr>
                <tr>
                  <td>Due date:</td>
                  <td>{debt.repaymentDate.slice(0, -14)}</td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td>{debt.status}</td>
                </tr>
              </tbody>
            </table>
            <div className="debt-buttons">
              <button onClick={() => handleRollover(debt.id)} className="rollover-button">Rollover</button>
              <button onClick={() => handleRepayNow(debt.id)} className="repay-button">Repay Now</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DebtView;
