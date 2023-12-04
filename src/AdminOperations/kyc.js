import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './kyc.css';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';


function KYC() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [kycData, setKYCData] = useState(null);

  const handleKYCRequest = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.toString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('KYC API Response:', data);
        setKYCData(data); // Set the received data in state
        toast.success('KYC request sent successfully!', {
          position: toast.POSITION.TOP_CENTER,
          style: { backgroundColor: '#1E1E1E' },
        });
      } else {
        console.error('Failed to send KYC request:', response.statusText);
        toast.error('Failed to send KYC request', {
          position: toast.POSITION.TOP_CENTER,
          style: { backgroundColor: '#1E1E1E' },
        });
      }
    } catch (error) {
      console.error('Error making KYC API call:', error);
    }
  };

  return (
    <div className="kyc-container">
      <div className="logo-container">
        <img src={logo} alt="Logo-kyc" className="logo-kyc" />
      </div>
      <h2 className="form-heading">KYC Request</h2>
      <p className="info-text">Enter user phone number to obtain basic user information</p>
      <div className="input-container">
        <label className="kyc-label">Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="kyc-input"
        />
      </div>
      <button onClick={handleKYCRequest} className="kyc-button">
        Request user info
      </button>

      {/* Render the table if KYC data is available */}
      {kycData && (
        <div className="table-container">
          <h3 className="kyc-h3" >User basic info</h3>
          <table className="kyc-table">
            
            <tbody>
              {Object.entries(kycData).map(([field, value]) => (
                <tr key={field}>
                  <td>{field}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default KYC;
