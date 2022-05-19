import axios from 'axios';

const BASE_URL = 'https://xrmxuo2hf1.execute-api.ap-northeast-2.amazonaws.com/prod';

export async function getFutures() {
  const { data: { body: { result } } } = await axios.post(`${BASE_URL}/proxy`, {
    market: 'ftx',
    method: 'get',
    path: '/futures',
  });
  return result.filter(({ type, expired }) => type === 'perpetual' && !expired).map(({ ask, bid, underlying, volumeUsd24h }) => ({ ask, bid, name: underlying, volume: volumeUsd24h }));
}

export async function getRates() {
  const { data: { body } } = await axios.get(`${BASE_URL}/funding_rates`);
  return body;
}

export async function getMarkets() {
  const { data: { body: { result } } } = await axios.post(`${BASE_URL}/proxy`, {
    method: 'get',
    path: '/markets',
  });
  const coins = result
    .filter(({ enabled, restricted, volumeUsd24h }) => {
      if (!enabled) return false;
      if (restricted) return false;
      if (volumeUsd24h < 100000) return false;

      return true;
    })
    .map(({ name, baseCurrency, quoteCurrency, underlying, type, ask, bid, price }) => {
      return {
        market: name,
        type,
        base: quoteCurrency,
        coin: baseCurrency || underlying,
        ask,
        bid,
        price
      };
    });
  const perps = coins.reduce((s, r) => {
    if (r.type === 'future' && r.market.endsWith('-PERP')) {
      s[r.coin] = r;
    }
    return s;
  }, {});
  const spots = coins
    .reduce((s, r) => {
      if (perps[r.coin] && r.base === 'USD') {
        s[r.coin] = { ...r, perp: perps[r.coin].market };
      }
      return s;
    }, {});
  return spots;
}
