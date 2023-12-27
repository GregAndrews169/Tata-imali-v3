import React, { useState, useEffect } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import './debtView.css'; // Ensure you create a CSS file for styling
import { auth, firestore } from '../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Client, Wallet } from 'xrpl';


function DebtView() {
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false); 

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      firestore.collection('debt')
        .where('userId', '==', currentUser.uid)
        .where('status', '==', 'Active') // Filter for 'active' status
        .get()
        .then(querySnapshot => {
          let userDebts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort debts by repaymentDate in ascending order
          userDebts.sort((a, b) => new Date(a.repaymentDate) - new Date(b.repaymentDate));
          setDebts(userDebts);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching debts:', error);
          setIsLoading(false);
        });
    }
}, []);
  




  const fetchUserDebts = async (userId) => {
    const querySnapshot = await firestore.collection('debt').where('userId', '==', userId).get();
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const handleRepayNow = (debt) => {
    const daysEarly = calculateDaysEarly(debt.repaymentDate);
    const discount = calculateDiscount(daysEarly, debt.totalAmount);
    setSelectedDebt({ ...debt, daysEarly, discount });
    // Show summary and confirm repayment button
  };

  const confirmRepayment = async () => {
    if (!selectedDebt) return;
  
    try {
      // Perform token transfer
      await transferTokens(selectedDebt.earlySettlementAmount, /* other parameters */);
  
      // Update debt status in Firestore
      await firestore.collection('debt').doc(selectedDebt.id).update({
        status: 'Repaid'
      });
  
      // Update local state to reflect changes
      const updatedDebts = debts.map(debt => 
        debt.id === selectedDebt.id ? { ...debt, status: 'Repaid' } : debt
      );
      setDebts(updatedDebts);
      setSelectedDebt(null);
      setIsPaymentConfirmed(true);  
      toast.success('Loan repaid successfully', { autoClose: 3000 });
    } catch (error) {
      console.error('Error during repayment:', error);
      toast.error('Error during repayment', { autoClose: 3000 });
    }
  };
  
  

  const handleRollover = (debtId) => {
    // Implement rollover functionality
  };

  function calculateDaysEarly(repaymentDate) {
    const repaymentDueDate = new Date(repaymentDate);
    const today = new Date();
    return Math.round((repaymentDueDate - today) / (1000 * 3600 * 24));
  }
  
  function calculateDiscount(daysEarly, amount) {
    const discountRate = 0.001; // 5% discount rate
    const discount = daysEarly * discountRate * amount;
    return parseFloat(discount.toFixed(3)); 
  }
  
  async function transferTokens(senderSecret, senderAddress, recipientAddress, amount) {
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    console.log('Connecting to XRPL...');
    await client.connect();

    try {
      


    const amount = selectedDebt.totalAmount - selectedDebt.discount;

    recipientAddress = 'rBtJV7ZfphGij1R6JAfLa2GGQ4UtB4qNB6'

      // Get the current user
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : null;

    if (!userId) {
        throw new Error("No user ID found for the current user.");
    }

    // Retrieve the XRPL account from Firestore using the userId
    const userDoc = await firestore.collection('users').doc(userId).get();
    if (!userDoc.exists) {
        throw new Error("User document not found in Firestore.");
    }

    // Get the XRPL account address and private key from the user document
    const userXrplAccount = userDoc.data().xrplAddress;
    if (!userXrplAccount) {
        throw new Error("XRPL account address not found for the user.");
    }

    const userXrplKey = userDoc.data().xrplPrivateKey;
    if (!userXrplKey) {
        throw new Error("XRPL private key not found for the user.");
    }

    // Create the borrower's wallet from the XRPL private key
    const borrowerWallet = Wallet.fromSeed(userXrplKey.toString());

    // Prepare the transaction
    const transaction = {
        TransactionType: 'Payment',
        Account: userXrplAccount,
        Amount: {
        currency: 'ZAR',
        value: amount.toString(),
        issuer: 'rPBnJTG63f17dAa7m1Vm43UHNs8Yj8muoz', // Add the issuer address
        },
        Destination: recipientAddress,
        DestinationTag: 1,
    };

    // Sign and submit the transaction
    const prepared = await client.autofill(transaction);
    const signed = borrowerWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

        if (result.result.meta.TransactionResult === 'tesSUCCESS') {
            
            console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed.hash}`);
            toast.success('Tokens transferred successfully!', { autoClose: 3000 }); // Display success message
            
        } else {
            throw `Error sending transaction: ${result.result.meta.TransactionResult}`;
        }
        } catch (error) {
        console.error('An error occurred:', error);
        } finally {
        console.log('Disconnecting from XRPL...');
        client.disconnect();
        }
    }

    return (
        <div className="debt-view-container">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <h2 style={{ fontSize: '16px', color: '#FFFFFF' }}>Debt</h2>
          <p className="info-text">View your outstanding debt below:</p>
          <ToastContainer />
          {isLoading ? (
            <p>Loading debts...</p>
          ) : selectedDebt ? (
            <div className="debt-card">
              <table className="summary-table">
             <tbody>
               
               <tr>
                 <td>Days Early:</td>
                 <td>{selectedDebt.daysEarly}</td>
               </tr>
               <tr>
                 <td>Repayment Amount:</td>
                 <td>{selectedDebt.totalAmount}</td>
               </tr>
               <tr>
                 <td>Early Settlement Discount:</td>
                 <td>{selectedDebt.discount}</td>
               </tr>
               <tr>
                 <td>Early Settlement Amount:</td>
                 <td>{selectedDebt.totalAmount - selectedDebt.discount}</td>
               </tr>
             </tbody>
           </table>
           <button onClick={confirmRepayment} className="confirm-repayment-button" disabled={isPaymentConfirmed}>Confirm Repay Now</button>
            </div>
          ) : (
            <div className="debt-cards-container">
              {debts.map(debt => (
                <div key={debt.id} className="debt-card">
                    
                 <table className="debt-table">
                <tbody>
                  <tr>
                    <td>Amount owing:</td>
                    <td>{debt.totalAmount}</td>
                  </tr>
                  <tr>
                    <td>Due date:</td>
                    <td>{new Date(debt.repaymentDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td>Status:</td>
                    <td>{debt.status}</td>
                  </tr>
                </tbody>
              </table>
              <button onClick={() => handleRepayNow(debt)} className="repay-button" >Repay Now</button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
}




export default DebtView;
