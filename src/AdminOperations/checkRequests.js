import React, { useEffect, useState } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './checkRequests.css';
import { firestore, database } from '../Firebase/config'; // Import the database instance
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl');
}

function DisplayTokenRequests() {
  const [password, setPassword] = useState('');
  const [showTokenRequests, setShowTokenRequests] = useState(false);
  const [tokenRequests, setTokenRequests] = useState([]);

  useEffect(() => {
    // Use the imported 'database' instance
    const tokenRequestsRef = database.ref('token-requests');

    tokenRequestsRef
    .once('value')
    .then((snapshot) => {
      const requests = snapshot.val();
      if (requests) {
        // Log the retrieved requests to check the data
        console.log("Retrieved requests:", requests);

        const requestsArray = Object.entries(requests)
          .map(([key, value]) => ({ id: key, ...value }))
          .filter(request => request.status === 'requested'); // Ensure this matches the database exactly

        // Log the filtered requests to see if the filter is working
        console.log("Filtered requests:", requestsArray);

        setTokenRequests(requestsArray);
      }
    })
    .catch((error) => {
      console.error('Error fetching token requests:', error);
    });
}, []);

  function handlePasswordSubmit() {
    const correctPassword = '12345'; // Replace with your actual password

    if (password === correctPassword) {
      setShowTokenRequests(true);
    } else {
      toast.error('Invalid password', { autoClose: 3000 });
    }
  }

  const sendAlert = async (userId, message) => {
    const alertsRef = firestore.collection('alerts');
    await alertsRef.add({
      userId,
      message,
      timestamp: new Date(),
      read: false
    });
  };
  

  async function acceptRequest(request) {
    try {
      const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
      console.log("Connecting to Testnet...");
      await client.connect();

      // Retrieve the XRPL account from Firestore using the userId from the request
      const userDoc = await firestore.collection('users').doc(request.userId).get();
      if (!userDoc.exists) {
          throw new Error("User document not found in Firestore.");
      }

      const userXrplAccount = userDoc.data().xrplAddress;
      if (!userXrplAccount) {
          throw new Error("XRPL account address not found for the user.");
      }

      // Use the provided account credentials for the receiver account
      const receiver_wallet = xrpl.Wallet.fromSeed('sEd7Jux5F8vU63jWoNejCk3HEZckSta'); // Ensure this is securely managed

      // Extract transaction details from the request object
      const { desiredAmount } = request;

      // Prepare the transaction to transfer the desired amount of tokens from sender to receiver
      const transfer_tx = {
          TransactionType: 'Payment',
          Account: receiver_wallet.address,
          Amount: {
              currency: 'ZAR', // Replace with the currency code you are using
              value: desiredAmount.toString(),
              issuer: 'rPBnJTG63f17dAa7m1Vm43UHNs8Yj8muoz', // Replace with the issuer's account ID
          },
          Destination: userXrplAccount // Using the user's XRPL account from Firestore
      };

      const prepared_tx = await client.autofill(transfer_tx);
      const signed_tx = receiver_wallet.sign(prepared_tx);

      console.log(`Sending ${desiredAmount} YOUR_CURRENCY from sender to receiver...`);

      const result = await client.submitAndWait(signed_tx.tx_blob);
      if (result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed_tx.hash}`);
        
        // Update status
        const tokenRequestsRef = database.ref('token-requests');
        await tokenRequestsRef.child(request.id).update({ status: 'Accepted' });

        const debtRef = firestore.collection('debt');
        await debtRef.add({
          userId: request.userId,
          totalAmount: request.totalAmount,
          repaymentDate: request.repaymentAmount, // Assume this is part of your request object
          status: 'Active' // or any other initial status
        });
        

        

        // Show success notification
        toast.success('Token transfer accepted successfully!', { autoClose: 3000 });

        await sendAlert(request.userId, `Your loan request for ${request.desiredAmount} has been accepted.`);

       
      } else {
        throw `Error sending transaction: ${result.result.meta.TransactionResult}`;
      }

      client.disconnect();
    } catch (error) {
      console.error('Error accepting token request:', error);
    }
  }

  async function rejectRequest(request) {
    try {
        // Update Status
        const tokenRequestsRef = database.ref('token-requests');
        await tokenRequestsRef.child(request.id).update({ status: 'Rejected' });
       


      // Show success notification
      toast.error('Token transfer rejected!', { autoClose: 3000 });
      await sendAlert(request.userId, `Your loan request for ${request.desiredAmount} has been rejected.`);

      // Reload the page after the notification disappears
      
    } catch (error) {
      console.error('Error rejecting token request:', error);
    }
  }

  const filteredRequests = tokenRequests.filter(
    (request) => request.status === 'requested'
  );

  if (!showTokenRequests) {
    return (
      <div className="password-protect-container">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="password-logo" />
        </div>
        <div className="password-form">
          <h2>Enter Password</h2>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <button onClick={handlePasswordSubmit} className="password-button">
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="token-requests-view-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="token-logo" />
      </div>
      <h3 className="token-requests-heading">Loan requests</h3>
      {filteredRequests.map((request) => (
        <div key={request.id} className="request-card">
          <p><strong>Request account:</strong> {request.receiverAccountId}</p>
          <p><strong>Amount:</strong> {request.desiredAmount}</p>
          <div className="button-group">
            <button onClick={() => acceptRequest(request)} className="accept-button">
              Accept
            </button>
            <button onClick={() => rejectRequest(request)} className="reject-button">
              Reject
            </button>
          </div>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
  
}

export default DisplayTokenRequests;
