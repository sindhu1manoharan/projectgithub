const express = require('express');
const ethers = require('ethers');
const axios = require('axios');

const app = express();
const port = 3000;

// Function to check if a wallet address is valid
function isValidAddress(address) {
    return ethers.utils.isAddress(address);
}

// Function to create a new wallet
function createWallet() {
    const wallet = ethers.Wallet.createRandom();
    return wallet;
}

// Function to get latest 1000 Ethereum transactions sorted by amount
async function getLatestTransactions() {
    try {
        const response = await axios.get(
            'https://api.etherscan.io/api',
            {
                params: {
                    module: 'account',
                    action: 'txlist',
                    address: 'YOUR_ETHEREUM_ADDRESS',
                    sort: 'desc',
                    apikey: 'YOUR_ETHERSCAN_API_KEY',
                },
            }
        );

        const transactions = response.data.result.slice(0, 1000).map(tx => ({
            transactionHash: tx.hash,
            senderAddress: tx.from,
            receiverAddress: tx.to,
            amount: ethers.utils.formatEther(tx.value),
            blockNumber: tx.blockNumber,
        }));

        return transactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

app.get('/isValidAddress/:address', (req, res) => {
    const address = req.params.address;
    const isValid = isValidAddress(address);
    res.json({ isValid });
});

app.get('/createWallet', (req, res) => {
    const wallet = createWallet();
    res.json({ address: wallet.address, privateKey: wallet.privateKey });
});

app.get('/getLatestTransactions', async (req, res) => {
    const transactions = await getLatestTransactions();
    res.json(transactions);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
