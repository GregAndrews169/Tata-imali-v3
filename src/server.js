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
      Authorization: `Bearer ${'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6IjYxMmM5MmJlLTkxM2EtNDFlNy1iZWIxLTlhMzJjOGU3ZTI2YiIsImV4cGlyZXMiOiIyMDIzLTA5LTIyVDIwOjE2OjAzLjczOCIsInNlc3Npb25JZCI6IjI2ZDdjNzUyLWVlNmYtNGUxMy1hOThhLWMzZWM3YTZmYWI5MyJ9.MBiaB5XForHn0xL997o9nxYOK-zLIueSIr8RLk21Q1P_U7INQjzgqqYPfwxqQHMKsoHpiWurQa8gwysBSRBoNWLhaJI5eiNZ43pmZov_RKhVzw4Aw48-JbIHVjx7r4SZsKlRhR6EAiubJRqCpALOY7PavUbuKp_K23QeCItNuuGlySQf_WblN67tbFyr-P2iG47tee0goL83y2E5IjJCwkjaD_YBhmfBYfTOs3YZmR2u-3r3snhD2RoYeAmHGj77F4SWLQvXuV6PjVqZtzkdS0nnbdY12z-lk5OPkwPduvTa57R1UQgQWi__Dh77CRMSaxtXtKFbHxWguGaPrY1srQ'}`, // Use the Authorization token for the Collections product
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
      Authorization: `Bearer ${'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6ImIyNTYyZTgxLWJhZTEtNGVjNS04NDU4LWEwNDk2M2VkZWRiYiIsImV4cGlyZXMiOiIyMDIzLTA5LTIyVDIwOjE4OjA2Ljc3MSIsInNlc3Npb25JZCI6IjY0NDg2NDFmLTQxZjItNDQ3OC05ODg1LWFlOTA4Mjc0NTMwNSJ9.eGB7waBJjuGgD2DjtkL0C6rgGychlb56fYd7PngggVdsmAnJCIJa8AH1DVWFFEo7taeCTdmoG2rlRzqLLTepNLNWDKhg24AF58YS6tq3AYRZu70TX525jCjtJBaY6fMYGRgactRYmHyVrDJfWVa6wiLjtBp32EgJoOqPfwPlXTVUXrKxwaBWI9ru0pj9K3851Ze2RHuseOrENwl-MscnAbClV3r1FKBjvcXjgP7i8Cjy_3t88ZWTjZcIdSdZ4TRdLQKBeSOQLm5Yv4HFrGAVvaYYQ_xpsa2E5B-mUEy3kv1cUDCc0ByNNiwOTWHhQo4eAfXKaM8tICSyaZIywu8zrQ'}`, // Use the Authorization token for the Disbursements product
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
        Authorization: `Bearer ${'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6IjYxMmM5MmJlLTkxM2EtNDFlNy1iZWIxLTlhMzJjOGU3ZTI2YiIsImV4cGlyZXMiOiIyMDIzLTA5LTIyVDIwOjE2OjAzLjczOCIsInNlc3Npb25JZCI6IjI2ZDdjNzUyLWVlNmYtNGUxMy1hOThhLWMzZWM3YTZmYWI5MyJ9.MBiaB5XForHn0xL997o9nxYOK-zLIueSIr8RLk21Q1P_U7INQjzgqqYPfwxqQHMKsoHpiWurQa8gwysBSRBoNWLhaJI5eiNZ43pmZov_RKhVzw4Aw48-JbIHVjx7r4SZsKlRhR6EAiubJRqCpALOY7PavUbuKp_K23QeCItNuuGlySQf_WblN67tbFyr-P2iG47tee0goL83y2E5IjJCwkjaD_YBhmfBYfTOs3YZmR2u-3r3snhD2RoYeAmHGj77F4SWLQvXuV6PjVqZtzkdS0nnbdY12z-lk5OPkwPduvTa57R1UQgQWi__Dh77CRMSaxtXtKFbHxWguGaPrY1srQ'}`, // Use the Authorization token for the Collections product
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