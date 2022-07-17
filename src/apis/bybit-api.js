import axios from 'axios';

const BASE_URL = 'https://xrmxuo2hf1.execute-api.ap-northeast-2.amazonaws.com/prod';

export async function getFutures() {
  const { data: { body: { result } } } = await axios.post(`${BASE_URL}/proxy`, {
    market: 'bybit',
    method: 'get',
    path: '/v2/public/tickers',
  });
  return result.filter(({ symbol }) => symbol.endsWith('USDT')).map(({ symbol, ask_price, bid_price, volume_24h }) => ({ name: symbol.replace('USDT', ''), ask: ask_price, bid: bid_price, volume: volume_24h }));
}

export async function getRates() {
  const { data: { body } } = await axios.get(`${BASE_URL}/bybit/funding-rates`);
  return body;
}