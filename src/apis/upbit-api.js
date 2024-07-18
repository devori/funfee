import axios from 'axios';

const BASE_URL = 'https://xrmxuo2hf1.execute-api.ap-northeast-2.amazonaws.com/prod';

export async function getMarkets() {
  const r = await axios.post(`${BASE_URL}/proxy`, {
    market: 'upbit',
    method: 'get',
    path: '/v1/market/all',
  });
  const data  = r.data.body.result;

  return data.filter(({ market }) => market.startsWith('KRW-'))
    .map(({ market }) => {
      const [base, coin] = market.split('-');
      return { market, base, coin };
    });
}

export async function getOrderBooks(markets) {
  if (!markets) {
    const arr = await getMarkets();
    markets = arr.map(({ market }) => market);
  }

  const r = await axios.post(`${BASE_URL}/proxy`, {
    market: 'upbit',
    method: 'get',
    path: `/v1/orderbook?markets=${markets.join(',')}`,
  });
  const data  = r.data.body.result;

  return data.reduce((s, { market, orderbook_units }) => {
    const [, coin] = market.split('-');
    s[coin] = {
      coin,
      ask: orderbook_units[0]?.ask_price,
      bid: orderbook_units[0]?.bid_price,
    };
    return s;
  }, {});
}
