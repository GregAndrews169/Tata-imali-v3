const xrpl = require('xrpl');

async function createEscrow(client, senderWallet, destination, amountSTX, issuer) {
    const escrowCreateTx = {
        "TransactionType": "EscrowCreate",
        "Account": senderWallet.address,
        "Destination": destination,
        "Amount": '10',
        "FinishAfter": 533171558,
        // Optionally set "CancelAfter" or "FinishAfter"
    };
    const prepared = await client.autofill(escrowCreateTx);
    const signed = senderWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    console.log("Escrow created:", result);
    return result.transaction.Sequence;
}

async function finishEscrow(client, finisherWallet, owner, escrowSequence) {
    const escrowFinishTx = {
        "TransactionType": "EscrowFinish",
        "Account": finisherWallet.address,
        "Owner": owner,
        "OfferSequence": escrowSequence
    };
    const prepared = await client.autofill(escrowFinishTx);
    const signed = finisherWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    console.log("Escrow finished:", result);
}

async function cancelEscrow(client, cancellerWallet, owner, escrowSequence) {
    const escrowCancelTx = {
        "TransactionType": "EscrowCancel",
        "Account": cancellerWallet.address,
        "Owner": owner,
        "OfferSequence": escrowSequence
    };
    const prepared = await client.autofill(escrowCancelTx);
    const signed = cancellerWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    console.log("Escrow canceled:", result);
}

async function main() {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    const hotWallet = xrpl.Wallet.fromSeed('sEdTPyCTWtYWeHKqekRS6dVfjcYBqb2'); 
    const borrowerAddress = 'rLcSMxXAmvxzMhiirizpCsiGftRQxZa2Gb';

    const issuerAddress = 'rf3wo5pktDqbS8pvJRRztToonuUEn5rGaF';
    const amountSTX = '10'; // Amount of STX to escrow

    // Hot Account locks STX in escrow
    const escrowSequence = await createEscrow(client, hotWallet, borrowerAddress, amountSTX, issuerAddress);

    // Choose to either finish or cancel the escrow based on your conditions
    // Example usage (uncomment the desired line):
    // await finishEscrow(client, hotWallet, hotWallet.address, escrowSequence);
    // await cancelEscrow(client, hotWallet, hotWallet.address, escrowSequence);

    client.disconnect();
};

main()