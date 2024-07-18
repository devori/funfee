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
          resolve({ result: r.result });
      });
    })
  });
}

async function callBybitApi(method, path) {
  const https = require('https');
  const query = path.startsWith('/v5') ? '?category=linear' : ''
  return new Promise((resolve) => {
    https[method](`https://api.bybit.com${path}${query}`, res => {
      let data = [];
      res.on('data', chunk => {
          data.push(chunk);
      });

      res.on('end', () => {
          const r = JSON.parse(Buffer.concat(data).toString());
          resolve({ result: r.result.list });
      });
    })
  });
}

async function callUpbitApi(method, path) {
  const https = require('https');
  return new Promise((resolve) => {
    https[method](`https://api.upbit.com${path}`, res => {
      let data = [];
      res.on('data', chunk => {
          data.push(chunk);
      });

      res.on('end', () => {
          const r = JSON.parse(Buffer.concat(data).toString());
          resolve({ result: r });
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
  } else if (market === 'upbit') {
    result = await callUpbitApi(method, path);
  }
  return {
    statusCode: 200,
    body: result,
  };
};