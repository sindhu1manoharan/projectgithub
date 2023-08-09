const ccxt = require('ccxt');

async function getTradableCoins() {
    const exchange = new ccxt.binance();
    const markets = await exchange.loadMarkets();

    const tradableCoins = Object.keys(markets);
    return tradableCoins;
}

getTradableCoins()
    .then(coins => {
        console.log('Tradable Coins on Binance:', coins);
    })
    .catch(error => {
        console.error('Error fetching tradable coins:', error);
    });
