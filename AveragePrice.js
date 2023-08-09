async function getAveragePrices() {
    const ccxt = require('ccxt');
    const exchange = new ccxt.binance();
    const markets = await exchange.loadMarkets();

    const coins = Object.keys(markets);
    const recentTransactions = await exchange.fetchTrades(coins[0], undefined, 100); // Fetching recent trades for the first coin (you can loop over all coins)

    const prices = {};

    for (const coin of coins) {
        const coinTrades = recentTransactions.filter(trade => trade.symbol === coin);
        if (coinTrades.length > 0) {
            const totalAmount = coinTrades.reduce((sum, trade) => sum + parseFloat(trade.price), 0);
            const averagePrice = totalAmount / coinTrades.length;
            prices[coin] = averagePrice;
        }
    }

    return prices;
}

getAveragePrices()
    .then(averagePrices => {
        console.log('Average Prices:', averagePrices);
    })
    .catch(error => {
        console.error('Error fetching average prices:', error);
    });
