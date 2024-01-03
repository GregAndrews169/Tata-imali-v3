if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl');
}

// Account credentials
const loanIncomeAddress = 'rshEW2GG5BVQXsrwMqxsXnSHaihkZDR9ww';
const loanIncomeSecret = 'sEdTsjCjqyAxHPy5vHpA63kcNY9hiGS'; // Secret key will be stored more securely in later vesions 


const feeIncomeAddress = 'r3o4P4BNAVCR2QzCzeZXVrsvwheoh3vJa7';
const feeIncomeSecret = 'sEdVKStdXTx6z6iuBe3pW2pqR8Xzo9Q'; 

// Create trust line to iMali-ZAR


      
async function createTrustLines() {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
  
    const loanIncomeWallet = xrpl.Wallet.fromSeed('sEdTsjCjqyAxHPy5vHpA63kcNY9hiGS');
    const feeIncomeWallet = xrpl.Wallet.fromSeed('sEdVKStdXTx6z6iuBe3pW2pqR8Xzo9Q');
  
    const currency_code = "ZAR";
    const issuer = 'rPBnJTG63f17dAa7m1Vm43UHNs8Yj8muoz';
    const value = "10000000000";
  
    const trustSetTx = (wallet) => ({
      "TransactionType": "TrustSet",
      "Account": wallet.classicAddress,
      "LimitAmount": {
        "currency": currency_code,
        "issuer": issuer,
        "value": value
      }
    });
  
    // Creating TrustSet for Loan Income Account
    const tsLoanIncome = trustSetTx(loanIncomeWallet);
    const tsLoanIncomePrepared = await client.autofill(tsLoanIncome);
    const tsLoanIncomeSigned = loanIncomeWallet.sign(tsLoanIncomePrepared);
    await client.submitAndWait(tsLoanIncomeSigned.tx_blob);
    console.log(`Trust line created for Loan Income Account: ${tsLoanIncomeSigned.hash}`);
  
    // Creating TrustSet for Fee Income Account
    const tsFeeIncome = trustSetTx(feeIncomeWallet);
    const tsFeeIncomePrepared = await client.autofill(tsFeeIncome);
    const tsFeeIncomeSigned = feeIncomeWallet.sign(tsFeeIncomePrepared);
    await client.submitAndWait(tsFeeIncomeSigned.tx_blob);
    console.log(`Trust line created for Fee Income Account: ${tsFeeIncomeSigned.hash}`);
  
    await client.disconnect();
  }
  
  createTrustLines().catch(console.error);