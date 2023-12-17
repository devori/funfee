import axios from 'axios';

const BASE_URL = 'https://api.upbit.com/v1';
export async function getMarkets() {
  const { data } = await axios.get(`${BASE_URL}/market/all`);
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
  const { data } = await axios.get(`${BASE_URL}/orderbook`, {
    params: {
      markets: markets.join(','),
    },
  });

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
