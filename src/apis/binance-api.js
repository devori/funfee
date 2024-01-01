import axios from 'axios';

export async function getFutures() {
  const { data } = await axios.get('https://fapi.binance.com/fapi/v1/ticker/bookTicker');
  return data
    .filter(({ symbol }) => symbol.endsWith('USDT'))
    .map(({ symbol, askPrice, bidPrice }) => ({ name: symbol.replace('USDT', ''), ask: askPrice, bid: bidPrice, volume: null }));
}

export async function getMarkets() {
  const { data } = await axios.get('https://api.binance.com/api/v3/ticker/bookTicker');
  return data
    .filter(({ symbol }) => symbol.endsWith('USDT'))
    .map(({ symbol, bidPrice, askPrice }) => ({
      market: symbol,
      bid: Number(bidPrice),
      ask: Number(askPrice),
      coin: symbol.substring(0, symbol.length - 4),
      type: 'spot',
      base: 'USDT',
    }))
    .filter(({ bid, ask }) => bid && ask)
    .reduce((r, c) => {
      r[c.coin] = c;
      return r;
    }, {});
}

export async function getRates() {
  /*
{
    "symbol": "SOLUSDT",
    "markPrice": "104.89759531",
    "indexPrice": "104.77962703",
    "estimatedSettlePrice": "104.65318022",
    "lastFundingRate": "0.00061819",
    "interestRate": "0.00010000",
    "nextFundingTime": 1704124800000,
    "time": 1704114246000
}

  */
  const { data } = await axios.get('https://fapi.binance.com/fapi/v1/premiumIndex');
  return data
    .filter(({ symbol }) => symbol.endsWith('USDT'))
    .map(({ symbol, lastFundingRate, nextFundingTime }) => ({ future: symbol, rate: lastFundingRate, time: new Date(nextFundingTime).toUTCString() }));
}