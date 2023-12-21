import React, { useState, useEffect } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png'; 
import './alertsView.css'; // Your CSS file for styling
import { auth, firestore } from '../Firebase/config'; // Import the database instance

function AlertsView() {
  const [alerts, setAlerts] = useState([]); // State to store alerts
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    setIsLoading(true);
    const currentUser = auth.currentUser;

    if (currentUser) {
      firestore.collection('alerts')
        .where('userId', '==', currentUser.uid) // Filter alerts for the logged-in user
        .get()
        .then(querySnapshot => {
          const userAlerts = querySnapshot.docs.map(doc => doc.data());
          setAlerts(userAlerts);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user alerts:', error);
          setIsLoading(false);
        });
    } else {
      console.error('No user is currently logged in.');
      setIsLoading(false);
    }
  }, []);


  const clearAlerts = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const alertsRef = firestore.collection('alerts').where('userId', '==', currentUser.uid);
      const querySnapshot = await alertsRef.get();
      querySnapshot.forEach(doc => {
        doc.ref.delete(); // Delete each alert
      });
      setAlerts([]); // Clear alerts from state
    }
  };
  

  return (
    <div className="alerts-view-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2 className="content-heading">Alerts</h2>
      <button onClick={clearAlerts} className="clear-alerts-button">
        Clear
      </button>
      {isLoading ? (
        <p>Loading alerts...</p>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, index) => (
            <div key={index} className="alert-item">
              {alert.message} {/* Display alert content */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertsView;
