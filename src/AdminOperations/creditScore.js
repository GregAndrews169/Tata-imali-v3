import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import 'react-toastify/dist/ReactToastify.css';
import './creditScore.css';
import Creditdata from './creditScoringAlgo/MockCreditScoreData.json';
import { randomForestCreditScoreModel } from './creditScoringAlgo/creditScoreAlgo'; // Update the import

function CreditScore() {
  const [userID, setUserID] = useState('');
  const [predictedCreditScore, setPredictedCreditScore] = useState(null);

  const handleCreditScoreCalculation = () => {
    try {
      const userEntry = Creditdata.find(entry => entry["Phone Number"] === userID);

      if (userEntry) {
        const predictors = { ...userEntry };
        delete predictors["Phone Number"];
        delete predictors["Actual Credit Score"];

        const predictedScore = randomForestCreditScoreModel.predict([predictors]); // Update the model
        const roundedScore = Math.round(predictedScore[0]); // Round to a whole number
        setPredictedCreditScore(roundedScore);

        toast.success('Credit score predicted successfully!', {
          position: toast.POSITION.TOP_CENTER,
          style: { backgroundColor: '#1E1E1E' },
        });
      } else {
        toast.error('User not found', {
          position: toast.POSITION.TOP_CENTER,
          style: { backgroundColor: '#1E1E1E' },
        });
      }
    } catch (error) {
      console.error('Error predicting credit score:', error);
    }
  };

  return (
    <div className="credit-score-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="token-logo" />
      </div>  
      <h2 className="form-heading">Credit Score Prediction</h2>
      <p className="info-text">Enter user ID to predict credit score</p>
      <div className="input-container">
        <label className="credit-score-label">User ID:</label>
        <input
          type="text"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="credit-score-input"
        />
        <button onClick={handleCreditScoreCalculation} className="credit-score-button">
          Predict Credit Score
        </button>
      </div>

      {predictedCreditScore !== null && (
        <div className="predicted-score-container">
          <h3 className="predicted-score-h3">Predicted Credit Score</h3>
          <p className="predicted-score">{predictedCreditScore}</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default CreditScore;
