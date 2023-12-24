import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './loanInstalments.css';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import { auth, database } from '../Firebase/config'; // Import the database instance

function LoanInstallments() {
  const [loanAmount, setLoanAmount] = useState('');
  const [numberOfInstallments, setNumberOfInstallments] = useState(2);
  const [installmentDetails, setInstallmentDetails] = useState(null);
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null; // Get the current user's ID
  const [isLoanRequested, setIsLoanRequested] = useState(false); 

  const calculateInstallments = () => {
    const interestRate = 0.2; // 20% interest for the example
    const totalRepayment = loanAmount * (1 + interestRate);
    const installmentValue = totalRepayment / numberOfInstallments;

    let installmentDates = [];
    for (let i = 1; i <= numberOfInstallments; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      installmentDates.push(date.toISOString());
    }

    setInstallmentDetails({
      totalRepayment,
      installmentValue,
      installmentDates,
      loanAmount
    });

    toast.info('Installment terms calculated', { autoClose: 3000 });
  };

  

  const handleRequestNow = async () => {
    try {
      const tokenRequestsRef = database.ref('token-requests');
      const requestTimestamp = new Date().toISOString().replace(/[.:]/g, '');
      const installmentValue = installmentDetails.installmentValue;
  
      for (let i = 0; i < installmentDetails.installmentDates.length; i++) {
        const installmentDate = installmentDetails.installmentDates[i];
        const rawAmount = parseFloat(loanAmount) / installmentDetails.installmentDates.length;
        const roundedAmount = rawAmount.toFixed(2);
        const requestObject = {
          userId,
          desiredAmount: roundedAmount,
          instalmentAmount: installmentValue,
          repaymentAmount: installmentDate,
          requestTimestamp: `${requestTimestamp}_${i}`,
          totalAmount: installmentValue,
          status: 'requested'
        };
        await tokenRequestsRef.child(`${requestTimestamp}_${i}`).set(requestObject);
      }
      setIsLoanRequested(true);
      toast.success('Loan installments requested successfully!', { autoClose: 3000 });
    } catch (error) {
      console.error('Error sending installment requests:', error);
    }
  };

return (
    <div className="loan-installments-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <ToastContainer />
     
      <h2 className="form-heading">Loan Installments</h2>
      <p className="info-text">Specify loan amount and installments below:</p>
      {!installmentDetails ? (
        // Input fields section
        <div className="form-section">
        <label className="input-label">
          Loan Amount:
          <input
            className="input-fieldI"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
          />
        </label>
        <label className="input-label">
          Number of Installments:
          <select
            className="input-fieldI2"
            value={numberOfInstallments}
            onChange={(e) => setNumberOfInstallments(parseInt(e.target.value, 10))}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="6">6</option>
          </select>
        </label>
        <button className="submit-button" onClick={calculateInstallments}>Calculate Terms</button>
      </div>
      ) : (
        // Installment details display
        <div className="debt-card">
        <table className="debt-tableI">
          <tbody>
          <tr>
              <td>Amount borrowed:</td>
              <td>{installmentDetails.loanAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total Repayment:</td>
              <td>{installmentDetails.totalRepayment.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Installment Value:</td>
              <td>{installmentDetails.installmentValue.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Installment Dates:</td>
              <td>
                {installmentDetails.installmentDates.map((date, index) => (
                  <div key={index}>{date.slice(0, 10)}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
        <button className="confirm-repayment-button" onClick={handleRequestNow} disabled={isLoanRequested}>Request Now</button>
      </div>
      )}
    </div>
  );
}

export default LoanInstallments;
