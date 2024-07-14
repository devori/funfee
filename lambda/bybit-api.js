async function callApi(path, query, state) {
  const https = require('https');
  return new Promise((resolve) => {
    https.get(`https://api.bybit.com/v5/market/${path}${query ? `?${query}` : ''}`, res => {
      let data = [];
      res.on('data', chunk => {
          data.push(chunk);
      });

      res.on('end', () => {
          try {
            const r = JSON.parse(Buffer.concat(data).toString());
            resolve({ state, result: r.result.list }); 
          } catch (e) {
            resolve({ state, result: [] });
          }
      });
    })
  });
}

async function getRates() {
  const r = await callApi('instruments-info', 'category=linear');
  const futures = r.result.filter(row => row.contractType === 'LinearPerpetual' && row.quoteCoin === 'USDT');
  
  const rates = [];
  for await (const { state: { symbol }, result } of futures.map(({ symbol }) => callApi('tickers', `category=linear&symbol=${symbol}`, { symbol }))) {
    const [d] = result.filter((row) => row.symbol === symbol);
    if (!d) continue;
    rates.push({ future: d.symbol, rate: Number(d.fundingRate), time: Number(d.nextFundingTime), history: [] })
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