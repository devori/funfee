async function callFtxApi(method, path) {
  const https = require('https');
  return new Promise((resolve) => {
    https[method](`https://ftx.com/api${path}`, res => {
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

async function callBybitApi(method, path) {
  const https = require('https');
  return new Promise((resolve) => {
    https[method](`https://api.bybit.com${path}`, res => {
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

exports.handler = async (event) => {
  const { method, path, market = 'ftx' } = event;
  let result;
  if (market === 'ftx') {
    result = await callFtxApi(method, path);
  } else if (market === 'bybit') {
    result = await callBybitApi(method, path);
  }
  return {
    statusCode: 200,
    body: rates,
  };
};