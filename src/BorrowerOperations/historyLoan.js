import React, { useState, useEffect } from 'react';
import { auth, database } from '../Firebase/config'; // Ensure correct import paths
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png'; // Update the path to your logo as necessary
import './historyLoan.css'; // Import your stylesheet

function LoanHistory() {
  const [loanOrders, setLoanOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLoanOrders = async () => {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No user is currently logged in.");
        setIsLoading(false);
        return;
      }

      try {
        // Retrieve loan requests from Firebase Realtime Database
        const loanRequestsRef = database.ref('token-requests');
        const snapshot = await loanRequestsRef.once('value');
        const loanRequests = snapshot.val();
        
        // Filter loan requests for the current user
        const userLoanOrders = Object.values(loanRequests).filter(request => request.userId === currentUser.uid);
        
        setLoanOrders(userLoanOrders);
      } catch (error) {
        console.error('Error fetching loan orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanOrders();
  }, []);

  return (
    <div className="loan-history-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2 className="content-heading">Loan History</h2>
      {isLoading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="loan-history-table-container">
        <table className="loan-history-table">
          <thead>
            <tr>
              
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {loanOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.requestTimestamp.slice(0, -13)}</td>
                
                <td>{order.desiredAmount}</td>
                <td>{order.status}</td>
                {/* Render more data as needed */}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

export default LoanHistory;
