import React, { useState, useEffect } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import dp from '../Branding/Jermone.png'; // User's profile picture
import './userProfile.css'; // Ensure you create a CSS file for styling
import { auth, firestore, database } from '../Firebase/config'; // Import the database instance

function UserProfile() {
  const [userInfo, setUserInfo] = useState({});
  const [totalLoanedValue, setTotalLoanedValue] = useState(0);
  const [totalActiveDebt, setTotalActiveDebt] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
          setUserInfo(userDoc.data());
          // Fetch loan history for total loaned value
          const loanRequestsRef = database.ref('token-requests');
          const snapshot = await loanRequestsRef.once('value');
          const loanRequests = snapshot.val();
          const userLoanOrders = Object.values(loanRequests).filter(request => request.userId === currentUser.uid && request.status === 'Accepted');
          const totalValue = userLoanOrders.reduce((total, order) => total + Number(order.desiredAmount), 0);
          setTotalLoanedValue(totalValue);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchActiveDebtsTotal = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Fetch active debts for the current user
        const debtsSnapshot = await firestore.collection('debt')
          .where('userId', '==', currentUser.uid)
          .where('status', '==', 'Active')
          .get();
  
        const activeDebts = debtsSnapshot.docs.map(doc => doc.data());
        const totalActiveDebt = activeDebts.reduce((total, debt) => total + Number(debt.totalAmount), 0);
  
        // Set the state with the total active debt value
        setTotalActiveDebt(totalActiveDebt);
      }
    };
  
    fetchActiveDebtsTotal();
  }, []);
  
  return (
    <div className="user-profile-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="user-profile">
        <img src={dp} alt="User" className="profile-pic" />
        <h2>{userInfo.firstName} {userInfo.surname}</h2>
        <div className="loan-statistics">
        <h3>Loan Statistics</h3>
        <table className="loan-stats-table">
            <tbody>
            <tr>
                <td>User Credit Score:</td>
                <td>{userInfo.creditScore}</td> {/* Dynamically load user's credit score */}
            </tr>
            <tr>
                <td>Total Loaned Value:</td>
                <td>{totalLoanedValue}</td> {/* Dynamically load total loaned value */}
            </tr>
            <tr>
                <td>Outstanding Debt:</td>
                <td>{totalActiveDebt}</td> {/* Dynamically load outstanding debt */}
            </tr>
            </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
