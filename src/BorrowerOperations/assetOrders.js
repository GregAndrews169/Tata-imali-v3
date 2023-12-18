import React, { useState, useEffect } from 'react';
import { auth, database } from '../Firebase/config';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import './assetOrders.css';

function Orders() {
  const [assetPurchases, setAssetPurchases] = useState([]);
  const [assetSales, setAssetSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No user is currently logged in.");
      setIsLoading(false);
      return;
    }

    const userId = currentUser.uid; // Get the ID of the logged-in user

    const purchasesRef = database.ref('asset-purchases');
    const salesRef = database.ref('asset-sales');

    const fetchOrders = async () => {
      try {
        // Fetch asset purchases for the current user
        const purchasesSnapshot = await purchasesRef.once('value');
        const purchases = purchasesSnapshot.val() || {};
        setAssetPurchases(Object.entries(purchases)
          .map(([key, value]) => ({ id: key, ...value }))
          .filter(purchase => purchase.userId === userId)); // Filter by user ID

        // Fetch asset sales for the current user
        const salesSnapshot = await salesRef.once('value');
        const sales = salesSnapshot.val() || {};
        setAssetSales(Object.entries(sales)
          .map(([key, value]) => ({ id: key, ...value }))
          .filter(sale => sale.userId === userId)); // Filter by user ID
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to safely format timestamps
  function formatTimestamp(timestamp) {
    return timestamp ? timestamp.slice(0, -11) : 'N/A';
  }

  return (
    <div className="order-history-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2 className="content-heading">Order History</h2>
      {isLoading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <>
          <h3 className='h3'>Purchase Orders</h3>
          <div className="order-history-table-container">
            <table className="order-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assetPurchases.map((purchase, index) => (
                  <tr key={index}>
                    <td>{formatTimestamp(purchase.purchaseTimestamp)}</td>
                    <td>{purchase.assetId}</td>
                    <td>{purchase.purchaseAmount}</td>
                    <td>{purchase.totalPrice}</td>
                    <td>{purchase.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className='h3'>Sale Orders</h3>
          <div className="order-history-table-container">
            <table className="order-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assetSales.map((sale, index) => (
                  <tr key={index}>
                    <td>{formatTimestamp(sale.sellTimestamp)}</td>
                    <td>{sale.assetId}</td>
                    <td>{sale.sellAmount}</td>
                    <td>{sale.sellTotal}</td>
                    <td>{sale.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;
