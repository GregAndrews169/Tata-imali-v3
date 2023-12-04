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
  - [ConfigAndIssue.js](#xrpl-configuration-xrpl-configjs)
  - [checkRequests.js](#checkrequestsjs)
  - [checkBalance.js](#checkbalancejs)
  - [transferForm.js](#transferformjs)
  - [License](#License)

## Introduction

Welcome to Tata-iMali, a pioneering financial technology platform built on the XRP Ledger (XRPL) with a mission to revolutionize micro-credit. Our platform leverages blockchain technology to deliver efficient, transparent, and secure micro-credit services, empowering lower-income individuals in Africa against unforeseen expenses. What sets Tata-iMali apart is its use of advanced machine learning algorithms for credit prediction. These algorithms enable us to predict credit scores for users without formal credit histories, ensuring that even individuals with limited financial records can access the micro-credit they need to thrive.

## Key Features

- **Blockchain-Powered Micro-Credit**: Tata-iMali utilizes the capabilities of the XRP Ledger (XRPL) to offer a blockchain-based micro-credit platform, ensuring trust, affordability, speed, transparency, and security in financial transactions.

- **Innovative Lending Algorithms**: Tata-iMali employs cutting-edge machine learning techniques to assess creditworthiness. These algorithms, including scikit-learn and TensorFlow, analyze a variety of mobile usage data factors, to predict credit scores. This allows us to extend micro-credit to users without a formal credit history, making financial services more accessible to all.

- **Financial Inclusion**: Tata-iMali is committed to promoting financial inclusion by extending credit services to underserved and unbanked populations, fostering economic growth worldwide.

- **User-Friendly Interface**: We provide a user-friendly interface for both lenders and borrowers, ensuring a seamless and accessible financial experience.

- **Security and Decentralization**: With XRPL's decentralized infrastructure, Tata-iMali ensures the highest level of security for all financial activities while minimizing central points of failure.

- **MTN Integration**: Tata-iMali seamlessly integrates with major African telecoms provider MTN's open API to obtain KYC (Know Your Customer) information and enables users to exchange the iMali-ZAR stablecoin for mobile money within the mobile money ecosystem.

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

### ConfigAndIssue.js

Prerequisite: Create and fund three independent XRPL accounts with XRP using facet.

- **Configure Cold Account Setting (Issuer Account):** Configure the settings for the cold account, which acts as the issuer account for the stablecoin.

- **Configure Hot Account Settings (Capital Pool Account):** Configure the settings for the hot account, which serves as the capital pool account for lending.

- **Create Tust Line:** Establish a trust line from the hot account to the cold account and then from the borrower's account to the hot account.

- **Issue ZAR Stablecoin:** Use the issuer account to issue ZAR stablecoin and transfer it to the hot (capital pool) account.

- **Transfer from Hot to Borrower:** Transfer funds from the hot account to the borrower's account as part of the loan disbursement process.

- **Check Account Balances:** Verify the success of the configuration and transactions by checking the account balances.

### checkRequests.js

In this module:

- The borrower's loan request query is obtained from the Firebase server.

- The borrower's address and requested amount are appended to a transaction from the capital pool account to the borrower's end account. On approval of the loan, the transaction is signed and submitted.

### checkBalance.js

The borrower queries the balance of his iMali-ZAR stablecoin asset associated with his account.

### transferForm.js

The borrower specifies the amount he would like to repay. This amount is then appended to a transaction and transferred from the borrower's account to the capital pool account.

## License

The code submitted herewith is the proprietary and confidential intellectual property of Tata-iMali. It is provided solely for the purpose of evaluation and review by authorized representatives of the XRPL grants program. Unauthorized access, distribution, or sharing of this code is strictly prohibited.

By accessing and reviewing this code, you, as an authorized XRPL grants representative, agree to the following:

1. You are an authorized representative involved with the grant review process of the XRPL grants program.
2. You will maintain the confidentiality of the code and will not share, distribute, or use it for any purpose other than the grant review.
3. Your access to and review of this code does not grant you any rights, licenses, or permissions to use, modify, or distribute the code for any other purpose.

Your cooperation and adherence to these terms are greatly appreciated.
# Tata-imali-v3
