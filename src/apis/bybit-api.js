import axios from 'axios';

const BASE_URL = 'https://xrmxuo2hf1.execute-api.ap-northeast-2.amazonaws.com/prod';

export async function getFutures() {
  const { data: { body: { result } } } = await axios.post(`${BASE_URL}/proxy`, {
    market: 'bybit',
    method: 'get',
    path: '/v5/market/tickers?category=linear',
  });
  return result.filter(({ symbol }) => symbol.endsWith('USDT')).map(({ symbol, ask1Price, bid1Price, volume24h }) => ({ name: symbol.replace('USDT', ''), ask: Number(ask1Price), bid: Number(bid1Price), volume: Number(volume24h) }));
}

export async function getMarkets() {
  const { data: { body: { result } } } = await axios.post(`${BASE_URL}/proxy`, {
    market: 'bybit',
    method: 'get',
    path: '/v5/market/tickers?category=spot',
  });
  const list = result.map(({ ask1Price, bid1Price, symbol }) => {
    let coin;
    let base;
    if (symbol.endsWith('USDT')) {
      coin = symbol.substring(0, symbol.length - 4);
      base = 'USDT';
    } else if (symbol.endsWith('USD')) {
      coin = symbol.substring(0, symbol.length - 3);
      base = 'USD';
    }
    return {
      market: symbol,
      ask: Number(ask1Price),
      bid: Number(bid1Price),
      coin,
      type: 'spot',
      base,
    };
  }).filter(({ coin }) => coin);

  return list.reduce((r, c) => {
    r[c.coin] = c;
    return r;
  }, {});
}

export async function getRates() {
  const { data: { body } } = await axios.get(`${BASE_URL}/bybit/funding-rates`);
  return body;
}