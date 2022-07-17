async function callApi(path, state) {
  const https = require('https');
  return new Promise((resolve) => {
    https.get(`https://ftx.com/api/${path}`, res => {
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
  const list = await callApi('futures');
  const futures = list.result.filter(r => r.enabled && !r.expired && !r.expiry && r.perpetual && r.type === 'perpetual');
  
  const rates = [];
  for await (const { state, result: { nextFundingTime, nextFundingRate } } of futures.map(({ name }) => callApi(`futures/${name}/stats`, name))) {
    rates.push({ future: state, rate: nextFundingRate, time: nextFundingTime, history: [] })
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