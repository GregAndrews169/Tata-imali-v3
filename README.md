# Tata-iMali - Revolutionizing Micro-Credit on XRPL

![Tata-iMali Logo](./src/Branding/Tata-iMali-logo-colour-transparent.png)

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Dependencies](#dependencies)
  - [Installation](#installation)
  - [Running the Program](#running-the-program)
- [XRPL Code Structure](#xrpl-code-structure)
  - [Prerequisite XRPL Operations](#prerequisite-xrpl-operations)
    - [ConfigNewAsset.js](#confignewassetjs)
    - [ConfigAndIssue.js](#configandissuejs)
    - [MintiMaliZAR.js](#mintimalizarjs)
  - [Onboarding](#onboarding)
    - [signUp.js](#signupjs)
  - [Borrower Operations](#borrower-operations)
    - [checkBalance.js](#checkbalancejs)
    - [assetHoldings.js](#assetholdingsjs)
    - [transferForm.js](#transferformjs)
  - [Admin Operations](#admin-operations)
    - [assetPurchaseRequest.js](#assetpurchaserequestjs)
    - [checkRequest.js](#checkrequestjs)
  - [License](#license)

## Introduction

Welcome to Tata-iMali, a pioneering financial technology platform built on the XRP Ledger (XRPL) with a mission to revolutionize micro-credit. Our platform leverages blockchain technology to deliver efficient, transparent, and secure micro-credit services, empowering lower-income individuals in Africa against unforeseen expenses. What sets Tata-iMali apart is its use of advanced machine learning algorithms for credit prediction. These algorithms enable us to predict credit scores for users without formal credit histories, ensuring that even individuals with limited financial records can access the micro-credit they need to thrive.

## Key Features

- **Blockchain-Powered Micro-Credit**: Tata-iMali utilizes the capabilities of the XRP Ledger (XRPL) to offer a blockchain-based micro-credit platform, ensuring trust, affordability, speed, transparency, and security in financial transactions.

- **Innovative Lending Algorithms**: Tata-iMali employs cutting-edge machine learning techniques to assess creditworthiness. These algorithms, including scikit-learn and TensorFlow, analyze a variety of mobile usage data factors, to predict credit scores. This allows us to extend micro-credit to users without a formal credit history, making financial services more accessible to all.

- **Financial Inclusion**: Tata-iMali is committed to promoting financial inclusion by extending credit services to underserved and unbanked populations, fostering economic growth worldwide.

- **User-Friendly Interface**: We provide a user-friendly interface for both lenders and borrowers, ensuring a seamless and accessible financial experience.

- **Security and Decentralization**: With XRPL's decentralized infrastructure, Tata-iMali ensures the highest level of security for all financial activities while minimizing central points of failure.

- **MTN Integration**: Tata-iMali seamlessly integrates with major African telecoms provider MTN's open API to obtain KYC (Know Your Customer) information and enables users to exchange the iMali-ZAR stablecoin for mobile money within the mobile money ecosystem.

- **Tokenized Equities and ETF Trading**: Introducing the capability to trade in tokenized equities and ETFs using the iMali-ZAR stablecoin. This feature allows users to engage in equity and ETF trading on a secure, blockchain-based platform.

## Dependencies

All project dependencies have been thoughtfully documented in the `package.json` file.

## Installation

Follow these steps to install the required dependencies:

- Open your terminal.

- Navigate to the root directory of your project.

- To install, run the following command:

```shell
npm install
```

## Running the Program

Once you have installed dependancies, you may start the program. To start the program, follow these steps:

- Open your terminal.
- Navigate to the root directory of your project.
- Run the following command to start the program:

```shell
npm start
```

This command will initiate the necessary processes, and your program will start running.

Note: Make sure you have satisfied all the prerequisites and dependencies before running the program.

## XRPL Code Structure

The Tata-iMali platform integrates several XRPL operations across its system. The code is organized into modules covering asset configuration, user onboarding, borrower operations, and admin operations. Each module is designed to interact seamlessly with the XRPL, ensuring a robust and efficient micro-credit platform.

### Prerequisite XRPL Operations

#### `ConfigNewAsset.js`

- **Connect to XRPL**: Establishes a connection with the XRPL testnet.
- **Configure Cold Issuer Account**: Sets up the issuer account for tokenized assets (MTN, STX, APL).
- **Configure Hot Issuer Account**: Prepares the operational account for transactions.
- **Create Trust Line for Each Asset**: Establishes trust lines from the operational account to the issuer for each asset.
- **Issue Token and Immediate Transfer**: Issues new tokens and transfers them immediately to the operational account.

#### `ConfigAndIssue.js`

- **Connect to XRPL**: Establishes a connection with the XRPL testnet.
- **Configure Cold Issuer Account**: Sets up the issuer account for iMali-ZAR stablecoin.
- **Configure Hot Issuer Account**: Prepares the operational account for transactions.
- **Create Trust Line for Each Asset**: Establishes trust lines from the operational account to the issuer for the iMali-ZAR asset.
- **Issue Token and Immediate Transfer**: Issues new tokens and transfers them immediately to the operational account.

#### `MintiMaliZAR.js`

- **Connect to Main Net**: Establishes a connection with the XRPL testnet.
- **Issue iMali-ZAR**: Issues the iMali-ZAR stablecoin.
- **Immediate Transfer to Hot Account**: Transfers the issued iMali-ZAR immediately to the operational account.

### Onboarding

#### `signUp.js`

- **Connect to XRPL**: Establishes a connection with the XRPL testnet.
- **Create New XRPL Account**: Generates a new XRPL account for the user.
- **Obtain XRPL Address and Key**: Retrieves the address and private key for the account.
- **Create Trust Line to All Assets**: Establishes trust lines from the new account to all relevant assets.
- **Store XRPL Details in Database**: Saves the XRPL address and key in the database and associates them with the user.

### Borrower Operations

#### `checkBalance.js`

- **Authenticate User**: Verifies the current user's identity.
- **Retrieve XRPL Account from Firebase**: Fetches the XRPL account details associated with the user.
- **Request Account Lines**: Queries the XRPL for the account's credit lines.
- **Extract 'ZAR' Balance**: Retrieves the ZAR balance of the account.

#### `assetHoldings.js`

- Similar operations as `checkBalance.js` for retrieving asset holdings information but tokenized asset balances are extracted (STX, MTN, APL).

#### `transferForm.js`

- **Authenticate User**: Confirms the identity of the current user.
- **Retrieve XRPL Key from Firebase**: Fetches the user's XRPL private key.
- **Prepare Transfer Transaction**: Sets up a ZAR transfer transaction to the capital pool account for loan repayment.
- **Sign Transaction with User Wallet**: Uses the user's wallet to sign the transaction.

### Admin Operations

#### `assetPurchaseRequest.js`

- **AcceptPurchase**: Handles the purchase request for assets.
  - Retrieves the XRPL address and key using the user ID from the request.
  - Creates a transaction for asset transfer from MarketMaker to User.
  - Sets up a ZAR payment transaction from User to MarketMaker.
- **AcceptSale**: Manages the sale of assets.
  - Retrieves the XRPL address and key using the user ID.
  - Creates a transaction for asset transfer from User to MarketMaker.
  - Arranges a ZAR payment transaction from MarketMaker to User.

#### `checkRequest.js`

- **AcceptRequest**: Processes loan requests.
  - Retrieves the XRPL address using the user ID from the request.
  - Creates a ZAR payment transaction from the capital pool to the borrower's address.

## License

The code submitted herewith is the proprietary and confidential intellectual property of Tata-iMali. It is provided solely for the purpose of evaluation and review by authorized representatives of the XRPL grants program. Unauthorized access, distribution, or sharing of this code is strictly prohibited.

By accessing and reviewing this code, you, as an authorized XRPL grants representative, agree to the following:

1. You are an authorized representative involved with the grant review process of the XRPL grants program.
2. You will maintain the confidentiality of the code and will not share, distribute, or use it for any purpose other than the grant review.
3. Your access to and review of this code does not grant you any rights, licenses, or permissions to use, modify, or distribute the code for any other purpose.

Your cooperation and adherence to these terms are greatly appreciated.

# Tata-imali-v3
