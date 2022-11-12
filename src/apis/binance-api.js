import axios from 'axios';

const BASE_URL = 'https://api.binance.com';

export async function getFutures() {
  return [];
}

export async function getMarkets() {
  const { data } = await axios.get(`${BASE_URL}/api/v3/ticker/bookTicker`);
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
    .reduce((r, c) => {
      r[c.coin] = c;
      return r;
    }, {});
}

export async function getRates() {
  return [];
}