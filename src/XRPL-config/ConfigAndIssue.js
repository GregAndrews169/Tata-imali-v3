// Script overview:
// Prerequisate: Create and fund (with XRP using facet) three independant XRPL accounts
// Step 1: Configure cold account setting (Issuer account)
// Step 2: Configure hot account settings (Capital pool account)
// Step 3: Create rust line from hot to cold and then from borrower to hot
// Step 4: Issue ZAR stablecoin from using issuer and transfer to hot (capital pool)
// Step 5: Transfer from hot to borrower
// Step 6: check accountt balances to verify success 


// Dependencies for Node.js.
// In browsers, use <script> tags as in the example demo.html.
if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl');
}

// Account credentials
const coldAddress = 'rPBnJTG63f17dAa7m1Vm43UHNs8Yj8muoz';
const coldSecret = 'sEdTHEyx2cmj7xhoocfatWU1i1jpZhk'; // Secret key will be stored more securely in later vesions 

const hotAddress = 'rBtJV7ZfphGij1R6JAfLa2GGQ4UtB4qNB6';
const hotSecret = 'sEd7Jux5F8vU63jWoNejCk3HEZckSta'; // Secret key will be stored more securely in later vesions 

const borrowerAddress = 'rLcSMxXAmvxzMhiirizpCsiGftRQxZa2Gb';
const borrowerSecret = 'sEdTVBUzCxRMG972Zdi2wTvzSq4TR8m'; // Secret key will be stored more securely in later vesions 

// Connect ---------------------------------------------------------------------
async function main() {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    console.log("Connecting to Testnet...");
    await client.connect();

    // Use the provided account credentials
    const cold_wallet = xrpl.Wallet.fromSeed(coldSecret);
    const hot_wallet = xrpl.Wallet.fromSeed(hotSecret);
    const borrower_wallet = xrpl.Wallet.fromSeed(borrowerSecret);

    // Configure issuer (cold address) settings ----------------------------------
    const cold_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": cold_wallet.address,
        "TransferRate": 0,
        "TickSize": 5,
        "Domain": "6578616D706C652E636F6D", // "example.com"
        "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple,
        // Using tf flags, we can enable more flags in one transaction
        "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
          xrpl.AccountSetTfFlags.tfRequireDestTag)
      };
    
      const cst_prepared = await client.autofill(cold_settings_tx);
      const cst_signed = cold_wallet.sign(cst_prepared);
      console.log("Sending cold address AccountSet transaction...");
      const cst_result = await client.submitAndWait(cst_signed.tx_blob);
      if (cst_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${cst_signed.hash}`);
      } else {
        throw `Error sending transaction: ${cst_result}`;
      }
    
      // Configure hot address settings --------------------------------------------
    
      const hot_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": hot_wallet.address,
        "Domain": "6578616D706C652E636F6D", // "example.com"
        // enable Require Auth so we can't use trust lines that users
        // make to the hot address, even by accident:
        "SetFlag": xrpl.AccountSetAsfFlags.asfRequireAuth,
        "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
          xrpl.AccountSetTfFlags.tfRequireDestTag)
      };
    
      const hst_prepared = await client.autofill(hot_settings_tx);
      const hst_signed = hot_wallet.sign(hst_prepared);
      console.log("Sending hot address AccountSet transaction...");
      const hst_result = await client.submitAndWait(hst_signed.tx_blob);
      if (hst_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${hst_signed.hash}`);
      } else {
        throw `Error sending transaction: ${hst_result.result.meta.TransactionResult}`;
      }
  
  
    
    
      // Create trust line from hot to cold address --------------------------------
      const currency_code = "ZAR";
      const trust_set_tx = {
        "TransactionType": "TrustSet",
        "Account": hot_wallet.address,
        "LimitAmount": {
          "currency": currency_code,
          "issuer": cold_wallet.address,
          "value": "10000000000" // Large limit, arbitrarily chosen
        }
      };
    
      const ts_prepared = await client.autofill(trust_set_tx);
      const ts_signed = hot_wallet.sign(ts_prepared);
      console.log("Creating trust line from hot address to issuer...");
      const ts_result = await client.submitAndWait(ts_signed.tx_blob);
      if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.hash}`);
      } else {
        throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`;
      }
    
      // Set a trust line from the borrower to the hot account -------------------------
      const trust_set_borrower_tx = {
        "TransactionType": "TrustSet",
        "Account": borrower_wallet.address,
        "LimitAmount": {
          "currency": currency_code,
          "issuer": cold_wallet.address,
          "value": "100000000000" // You can set the trust limit as desired
        }
      };
    
      const trust_set_borrower_prepared = await client.autofill(trust_set_borrower_tx);
      const trust_set_borrower_signed = borrower_wallet.sign(trust_set_borrower_prepared);
      console.log("Setting a trust line from borrower to hot address...");
      const trust_set_borrower_result = await client.submitAndWait(trust_set_borrower_signed.tx_blob);
      if (trust_set_borrower_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Trust line succeeded: https://testnet.xrpl.org/transactions/${trust_set_borrower_signed.hash}`);
      } else {
        throw `Error sending transaction: ${trust_set_borrower_result.result.meta.TransactionResult}`;
      }
    
  // Issue token from cold and immediatly send to hot ----------------------------------------------------------------
  const issue_quantity = "3840"
  const send_token_tx = {
    "TransactionType": "Payment",
    "Account": cold_wallet.address,
    "Amount": {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": cold_wallet.address
    },
    "Destination": hot_wallet.address,
    "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                        // on the hot account earlier.
  }
  
  const pay_prepared = await client.autofill(send_token_tx)
  const pay_signed = cold_wallet.sign(pay_prepared)
  console.log(`Sending ${issue_quantity} ${currency_code} to ${hot_wallet.address}...`)
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`)
  } else {
    throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
  }
  
  
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`);
      
      // Now that the cold to hot transaction is confirmed, proceed with the hot to borrower transaction
      const send_to_borrower_quantity = "20";
      const send_to_borrower_tx = {
        "TransactionType": "Payment",
        "Account": hot_wallet.address,
        "Amount": {
          "currency": "ZAR",
          "value": send_to_borrower_quantity,
          "issuer": cold_wallet.address
        },
        "Destination": borrower_wallet.address,
      };
    
      try {
        const send_to_borrower_prepared = await client.autofill(send_to_borrower_tx);
        const send_to_borrower_signed = hot_wallet.sign(send_to_borrower_prepared);
        console.log(`Sending ${send_to_borrower_quantity} ZAR from hot to borrower...`);
        const send_to_borrower_result = await client.submitAndWait(send_to_borrower_signed.tx_blob);
        if (send_to_borrower_result.result.meta.TransactionResult == "tesSUCCESS") {
          console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${send_to_borrower_signed.hash}`);
        } else {
          throw `Error sending transaction: ${send_to_borrower_result.result.meta.TransactionResult}`;
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
      
    } else {
      throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`;
    }
  
    
  // Check balances ------------------------------------------------------------
  console.log("Getting hot address balances...");
  const hot_balances = await client.request({
      command: "account_lines",
      account: hot_wallet.address,
      ledger_index: "validated"
  });
  console.log(hot_balances.result);
  
  console.log("Getting cold address balances...");
  const cold_balances = await client.request({
      command: "gateway_balances",
      account: cold_wallet.address,
      ledger_index: "validated",
      hotwallet: [hot_wallet.address]
  });
  console.log(JSON.stringify(cold_balances.result, null, 2));
  
  console.log("Getting borrower address balances...");
  const borrower_balances = await client.request({
      command: "account_lines",
      account: borrower_wallet.address,
      ledger_index: "validated"
  });
  console.log(borrower_balances.result);
  
  client.disconnect();
}
  
  
main();
