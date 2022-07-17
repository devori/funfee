async function callApi(path, query, state) {
  const https = require('https');
  return new Promise((resolve) => {
    https.get(`https://api.bybit.com/v2/public/${path}${query ? `?${query}` : ''}`, res => {
      let data = [];
      res.on('data', chunk => {
          data.push(chunk);
      });

      res.on('end', () => {
          const r = JSON.parse(Buffer.concat(data).toString());
          resolve({ state, result: r.result });
      });
    })
  });
}

async function getRates() {
  const list = await callApi('symbols');
  const futures = list.result.filter(r => r.name === r.alias && r.quote_currency === 'USDT');
  
  const rates = [];
  for await (const { state: { name }, result } of futures.map(({ name }) => callApi('tickers', `symbol=${name}`, { name }))) {
    const [d] = result.filter(({ symbol }) => symbol === name);
    if (!d) continue;
    rates.push({ future: d.symbol, rate: Number(d.funding_rate), time: d.next_funding_time, history: [] })
  }
  return rates;
}

exports.handler = async (event) => {
  const https = require('https');
  const rates = await getRates();
  return {
    statusCode: 200,
    body: rates,
  };
};