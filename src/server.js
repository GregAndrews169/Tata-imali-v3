const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.use(express.json()); // Add this line to parse JSON in the request body

// Define an API endpoint to make external API calls to MoMo
app.post('/api/momo-topup', async (req, res) => {
  console.log('Request received from client:', req.body);

  try {
    // Set your MoMo API URL and headers
    const momoApiUrl = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay';
    const momoHeaders = {
      Authorization: `Bearer ${'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6Ijk3NjI2MDU2LTE2OTctNDRmOS05YTliLTg0NDVmNTYyNThkYSIsImV4cGlyZXMiOiIyMDIzLTEyLTA5VDEwOjIxOjEyLjk1NiIsInNlc3Npb25JZCI6ImZiNjE2YmE0LWZmMzgtNDA5MS1iZDlmLTVkMTNkNGQzMDNjYyJ9.dMoORmufB9TCE9KYfA3BHjA2NmVfxaJgeQTYNdMwX1RKNdpa2M83pRDYeP3vsHG96pjyMVLlfzR-xtQkGAJ12BcXKO8gw6uFIOhrNmDs-j_1M7XSsDN9130U2HKDhhxpDoyP9LUXoQhAgodrH7iTv7FQorXHU1TwJ-NomLgn1O2fu_KTbaqaUUu5TFf4emJFb-w9gcDpFF0SAcmOa7TRjGRBEbB97FAwfHhG5zpEIHmWZu5H-qd7qKuh5jtPGMCaTfAS0VP_MdKqVFkYz0HSMIDiEBFHh6NWSUvreFo3vx8gQmf1XhNROEq9By-XI6DI8K1KzMX1oBqkX9imGZZlJg'}`, // Use the Authorization token for the Collections product
      'X-Reference-Id': req.headers['x-reference-id'], // Use the generated UUID as X-Reference-Id
      'X-Target-Environment': 'sandbox',
      'Ocp-Apim-Subscription-Key': '7083bbb08a9441f1a666bada4679875a', // Use the subscription key for the Collections product
      'Content-Type': 'application/json',
    };

    const { amount, phoneNumber } = req.body; // Get the amount and phoneNumber from the request body

    // Create a request payload for MoMo API
    const payload = {
      amount: amount.toString(), // Convert amount to string if needed
      currency: 'EUR',
      externalId: req.headers['x-reference-id'], // Use the generated UUID as externalId
      payer: {
        partyIdType: 'MSISDN',
        partyId: phoneNumber.toString(), // Convert phoneNumber to string
      },
      payerMessage: 'Pay for stablecoin mint',
      payeeNote: 'Payment note',
    };

    // Make a POST request to MoMo API
    const response = await axios.post(momoApiUrl, payload, { headers: momoHeaders });

    // Console log the entire response
    console.log('MoMo API Response:', response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Error making MoMo API call:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Define an API endpoint to make external API calls to MoMo
app.post('/api/momo-cashout', async (req, res) => {
  console.log('Request received from client:', req.body);

  try {
    // Set your MoMo API URL and headers
    const momoApiUrl = 'https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/deposit';
    const momoHeaders = {
      Authorization: `Bearer ${'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6ImI3NmI5NDVmLTI3MzYtNDU3Mi1hNmU1LTYxMTdmMTAxZTkwMSIsImV4cGlyZXMiOiIyMDIzLTEyLTA5VDEwOjI0OjQ1LjExOCIsInNlc3Npb25JZCI6IjQyZWNkM2Q1LTRmODktNDZlNi05YzdiLTE4YTc5Y2I2YmJjNSJ9.mnmE36PsBPx96zF2tMQLp-H3zfzoK-A_n0bBBJzHqvjBeuuj8-gAQ3GBzcdAT4pierHVZbeMiHDYB0p0ERZNzbAGWZC-PQ6sw3EMTLx7J1KqgXENBJ_7Itd4JUfNLxQaFqXrnyy7jss07P224ersNWR_uS9K1rZsivhkVs2YSSM-t9IedyaZiaoFNAa0jRhw4lcWK7ktZ_Su5HJ9JnnjbGAOlQPhRhOhFGG44ft6Oqj9tn8Cn_Kxc9yy84HBiNjPyad7NfxG9g3HGZKnHmeNp1eO-EwZkRt3-3PwCjeKNEHXrcSqhEDbOSivSqMeFXA_g8GYXZLdwNeWUmwLPIJazQ'}`, // Use the Authorization token for the Disbursements product
      'X-Reference-Id': req.headers['x-reference-id'], // Use the generated UUID as X-Reference-Id
      'X-Target-Environment': 'sandbox',
      'Ocp-Apim-Subscription-Key': 'c3a4d4fd75494b1a9bdcbc7f09d2dd2f', // Use the subscription key for the Disbursements product
      'Content-Type': 'application/json',
    };

    const { amount, phoneNumber } = req.body; // Get the amount and phoneNumber from the request body

    // Create a request payload for MoMo API
    const payload = {
      amount: amount.toString(), // Convert amount to string if needed
      currency: 'EUR',
      externalId: '123456',
      payee: {
        partyIdType: 'MSISDN',
        partyId: phoneNumber.toString(), // Convert phoneNumber to string
      },
      payerMessage: 'Cashoutofstablecoin',
      payeeNote: 'Paymentnote',
    };

    // Make a POST request to MoMo API
    const response = await axios.post(momoApiUrl, payload, { headers: momoHeaders });

    // Console log the entire response
    console.log('MoMo API Response:', response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Error making MoMo API call:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



// Define an API endpoint to make external API calls to MoMo for KYC
app.post('/api/kyc', async (req, res) => {
    console.log('KYC Request received from client:', req.body);
  

    const { phoneNumber } = req.body; // Get the phoneNumber from the request body

    try {
      // Set your MoMo KYC API URL and headers
      const momoKycApiUrl = `https://sandbox.momodeveloper.mtn.com/collection/v1_0/accountholder/msisdn/${phoneNumber}/basicuserinfo`;
      const momoKycHeaders = {
        Authorization: `Bearer ${'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6Ijk3NjI2MDU2LTE2OTctNDRmOS05YTliLTg0NDVmNTYyNThkYSIsImV4cGlyZXMiOiIyMDIzLTEyLTA5VDEwOjIxOjEyLjk1NiIsInNlc3Npb25JZCI6ImZiNjE2YmE0LWZmMzgtNDA5MS1iZDlmLTVkMTNkNGQzMDNjYyJ9.dMoORmufB9TCE9KYfA3BHjA2NmVfxaJgeQTYNdMwX1RKNdpa2M83pRDYeP3vsHG96pjyMVLlfzR-xtQkGAJ12BcXKO8gw6uFIOhrNmDs-j_1M7XSsDN9130U2HKDhhxpDoyP9LUXoQhAgodrH7iTv7FQorXHU1TwJ-NomLgn1O2fu_KTbaqaUUu5TFf4emJFb-w9gcDpFF0SAcmOa7TRjGRBEbB97FAwfHhG5zpEIHmWZu5H-qd7qKuh5jtPGMCaTfAS0VP_MdKqVFkYz0HSMIDiEBFHh6NWSUvreFo3vx8gQmf1XhNROEq9By-XI6DI8K1KzMX1oBqkX9imGZZlJg'}`, // Use the Authorization token for the Collections product
        'Ocp-Apim-Subscription-Key': '7083bbb08a9441f1a666bada4679875a', // Use the subscription key for the Collections product
        'X-Target-Environment': 'sandbox',
        'Content-Type': 'application/json',
      };
  
      
  
      // Make a GET request to MoMo KYC API
      const response = await axios.get(momoKycApiUrl, {
        headers: momoKycHeaders,
        params: {
          msisdn: phoneNumber.toString(),
        },
      });
  
      // Console log the entire KYC response
      console.log('MoMo KYC API Response:', response.data);
  
      res.json(response.data);
    } catch (error) {
      console.error('Error making MoMo KYC API call:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // Define an API endpoint to predict credit scores
app.post('/api/predict-credit-score', async (req, res) => {
  try {
    // Get the necessary data from the request body (modify as needed)
    const { age, income, creditHistory } = req.body;

    // Your credit score prediction logic here (modify as needed)
    // For example, a simple scoring logic might be:
    let creditScore = 0;
    if (age > 30) creditScore += 10;
    if (income > 50000) creditScore += 20;
    if (creditHistory === 'good') creditScore += 30;

    // Send back the credit score prediction
    res.json({ creditScore });
  } catch (error) {
    console.error('Error predicting credit score:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});