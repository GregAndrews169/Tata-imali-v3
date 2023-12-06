if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl');
}

// Account credentials
const coldAddress = 'rPBnJTG63f17dAa7m1Vm43UHNs8Yj8muoz';
const coldSecret = 'sEdTHEyx2cmj7xhoocfatWU1i1jpZhk'; // Secret key will be stored more securely in later vesions 

const hotAddress = 'rBtJV7ZfphGij1R6JAfLa2GGQ4UtB4qNB6';
const hotSecret = 'sEd7Jux5F8vU63jWoNejCk3HEZckSta'; // Secret key will be stored more securely in later vesions 


async function main() {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    console.log("Connecting to Testnet...");
    await client.connect();

    // Use the provided account credentials
    const cold_wallet = xrpl.Wallet.fromSeed(coldSecret);
    const hot_wallet = xrpl.Wallet.fromSeed(hotSecret);
   

    
  // Issue token from cold and immediatly send to hot ----------------------------------------------------------------
  const issue_quantity = "3840000"
  const send_token_tx = {
    "TransactionType": "Payment",
    "Account": cold_wallet.address,
    "Amount": {
      "currency": 'ZAR',
      "value": issue_quantity,
      "issuer": cold_wallet.address
    },
    "Destination": hot_wallet.address,
    "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                        // on the hot account earlier.
  }
  
  const pay_prepared = await client.autofill(send_token_tx)
  const pay_signed = cold_wallet.sign(pay_prepared)
  console.log(`Sending ${issue_quantity} to ${hot_wallet.address}...`)
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`)
  } else {
    throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
  }
  
  
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`);
      
      
    
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
  
  
  
  client.disconnect();
}}
  
  
main();