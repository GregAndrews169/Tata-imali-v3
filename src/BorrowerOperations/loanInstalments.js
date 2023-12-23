import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './loanInstalments.css';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';

function LoanInstallments() {
  const [loanAmount, setLoanAmount] = useState('');
  const [numberOfInstallments, setNumberOfInstallments] = useState(2);
  const [installmentDetails, setInstallmentDetails] = useState(null);

  const calculateInstallments = () => {
    const interestRate = 0.2; // 20% interest for the example
    const totalRepayment = loanAmount * (1 + interestRate);
    const installmentValue = totalRepayment / numberOfInstallments;

    let installmentDates = [];
    for (let i = 1; i <= numberOfInstallments; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      installmentDates.push(date.toLocaleDateString());
    }

    setInstallmentDetails({
      totalRepayment,
      installmentValue,
      installmentDates,
    });

    toast.info('Installment terms calculated', { autoClose: 3000 });
  };

  return (
    <div className="container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <ToastContainer />
      <h2 className="form-heading">Loan Installments</h2>
      <p className="info-text">Specify loan amount and number of instaments below:</p>
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

      {installmentDetails && (
        <div className="userfeedback">
          <p>Total Repayment: {installmentDetails.totalRepayment.toFixed(2)}</p>
          <p>Installment Value: {installmentDetails.installmentValue.toFixed(2)}</p>
          <p>Installment Dates:</p>
          <ul>
            {installmentDetails.installmentDates.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LoanInstallments;
