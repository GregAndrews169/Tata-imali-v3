import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import TransferForm from './BorrowerOperations/transferForm';
import TokenBalancesView from './BorrowerOperations/checkBalance';
import TokenRequestView from './BorrowerOperations/tokenRequest';
import DisplayTokenRequests from './AdminOperations/checkRequests';
import CashOut from './BorrowerOperations/CashOut';
import TopUp from './BorrowerOperations/TopUp';
import KYC from './AdminOperations/kyc';
import CreditScore from './AdminOperations/creditScore';
import SignupPage from './Onboarding/SignUp';
import LoginPage from './Onboarding/login';
import WelcomeScreen from './Onboarding/welcome'; // Import the WelcomeScreen component
import WelcomeScreenAdmin from './Onboarding/welcomeAdmin'; // Import the WelcomeScreen component
import AssetHoldings from './BorrowerOperations/assetHoldings'; // Import the AssetHoldings component
import Marketplace from './BorrowerOperations/marketPlace'; // Import the AssetHoldings component
import PurchaseRequests from './AdminOperations/assetPurchaseRequests'; // Import the AssetHoldings component
import Cashflows from './BorrowerOperations/cashFlows'
import Accounts from './BorrowerOperations/accounts'
import Loans from './BorrowerOperations/Loans'
import cash from './Branding/cash.png';
import Wallet from './Branding/Wallet.png';
import Loan from './Branding/Loan.png';
import Shop from './Branding/Shop.png';
import { auth, firestore } from './Firebase/config'; // Import the database instance
import LogRocket from 'logrocket';



import './App.css';

import dpd from './Branding/Jermone.png'

LogRocket.init('owkqfs/tata-imali');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const [userName, setUserName] = useState('');

  const handleLogin = async (userType) => {
    setIsLoggedIn(true);
    setUserType(userType);

    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserName(`${userData.firstName} ${userData.surname}`);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType('');
    setUserName('');
  };

  return (
    <Router>
      <div className="App">
        <div className="view-container">
        {isLoggedIn && (
          <nav className='topNav'>
            
          <div className="nav-user-info">
            <span className="user-name">{userName}</span> {/* Replace with dynamic user name */}
            <img 
              src= {dpd} /* Replace with dynamic profile picture path */
              alt="User"
              className="user-profile-pic"
              onClick={handleLogout} /* Logout on profile picture click */
            />
          </div>
        </nav>
        )}
          <Routes>
            <Route
              path="/welcome"
              element={
                isLoggedIn && userType === 'Borrower' ? (
                  <WelcomeScreen />
                ) : userType === 'Admin' ? (
                  <WelcomeScreenAdmin />
                ) : (
                  <Navigate to="/signup" />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isLoggedIn ? <Navigate to="/welcome" /> : <SignupPage />
              }
            />
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/welcome" />
                ) : (
                  <LoginPage onLogin={handleLogin} setUserType={setUserType} />
                )
              }
            />
            {isLoggedIn && (
              <>
                {userType === 'Borrower' && (
                  <>
                    <Route path="/cashout" element={<CashOut />} />
                    <Route path="/topup" element={<TopUp />} />
                    <Route path="/cashflows" element={<Cashflows />}>
                      <Route path="topup" element={<TopUp />} />
                      <Route path="cashout" element={<CashOut />} />
                    </Route>
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/loans" element={<Loans />} />
                    <Route path="/tokenrequest" element={<TokenRequestView />} />
                    <Route path="/transfer" element={<TransferForm />} />
                    <Route path="/checkbalance" element={<TokenBalancesView />} />
                    <Route path="/assetholdings" element={<AssetHoldings />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                  </>
                )}
                {userType === 'Admin' && (
                  <>
                    <Route path="/kyc" element={<KYC />} />
                    <Route path="/checkrequests" element={<DisplayTokenRequests />} />
                    <Route path="/creditscore" element={<CreditScore />} />
                    <Route path="/checkpurchaserequests" element={<PurchaseRequests />} />


                    PurchaseRequests
                  </>
                )}
                <Route path="/logout" element={<Navigate to="/login" />} />
              </>
            )}
            {!isLoggedIn && (
              <Route path="/*" element={<Navigate to="/signup" />} />
            )}
          </Routes>
        </div>
        {isLoggedIn && (
          <nav className='bottomNav'>
            <ul className="nav-links">
              {userType === 'Borrower' && (
                <>
                  
                  <li>
                    <Link to="/cashflows" className="nav-link">
                      <img className='nav-icons' src={cash}  />
                    </Link>
                  </li>
                  <li>
                    <Link to="/accounts" className="nav-link">
                    <img className='nav-icons' src={Wallet}  />
                    </Link>
                  </li>
                  <li>
                    <Link to="/loans" className="nav-link">
                    <img className='nav-icons' src={Loan}  />
                    </Link>
                  </li>
                  <li>
                    <Link to="/marketplace" className="nav-link">
                    <img className='nav-iconsS' src={Shop}  />
                    </Link>
                  </li>
                  
                </>
              )}
              {userType === 'Admin' && (
                <>
                  <li>
                    <Link to="/kyc" className="nav-linkA">
                      KYC
                    </Link>
                  </li>
                  <li>
                    <Link to="/creditscore" className="nav-linkA">
                      Credit Score
                    </Link>
                  </li>
                  <li>
                    <Link to="/checkrequests" className="nav-linkA">
                      Loan Requests
                    </Link>
                  </li>
                  <li>
                    <Link to="/checkpurchaserequests" className="nav-linkA">
                      Asset Requests
                    </Link>
                  </li>
                </>
              )}
            
            </ul>
          </nav>

        )}
       
      </div>
    </Router>
  );
}

export default App;