const apis = require('./bybit-api');

apis.handler().then((r) => {
    console.log(r);
});