<script>
  import * as bybitApi from "../apis/bybit-api";
  import * as ftxApi from "../apis/ftx-api";
  import * as upbitApi from "../apis/upbit-api";

  export let id;
  export let color = "light";

  const stores = [
    { value: 'ftx', text: 'FTX' },
    { value: 'bybit', text: 'Bybit' },
  ];

  let sort = { field: 'usdTokrw' };
  let usdMarkets = {};
  let krwMarkets = [];
  let list = [];

  $:
    usdToKrwList = [...list].sort((r1, r2) => {
      if (r1.coin === 'XRP') return -1;
      if (r2.coin === 'XRP') return 1;
      return r1.usdTokrw < r2.usdTokrw ? 1 : -1;
    });
  $: krwToUsdList = [...list].sort((r1, r2) => {
      if (r1.coin === 'XRP') return -1;
      if (r2.coin === 'XRP') return 1;
      return r1.krwToUsd < r2.krwToUsd ? -1 : 1;
    })
  $: selectedStore = stores.find(s => s.value === id) ?? {};

  async function refresh() {
    list = [];
    if (id == 'ftx') {
      usdMarkets = await ftxApi.getMarkets();
    } else if (id === 'bybit') {
      usdMarkets = await bybitApi.getMarkets();
    }
    krwMarkets = await upbitApi.getMarkets();
    const arr = krwMarkets.filter(({ coin }) => usdMarkets[coin]).map((u) => ({
      coin: u.coin,
      krw: u.market,
      usd: usdMarkets[u.coin],
    }));
    const tickers = await upbitApi.getOrderBooks(arr.map(({ krw }) => krw));
    list = arr.map(({ coin, usd }) => ({
      coin, usd, krw: tickers[coin],
      usdTokrw: (tickers[coin].bid / usd.ask),
      krwToUsd: (tickers[coin].ask / usd.bid),
    }));
  }
  refresh();

  const onChangeStore = ({ target: { value } }) => {
    if (!value) {
      return;
    }
    location.href = `/transfer/${value}`;
  };
</script>

<div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {color === 'light' ? 'bg-white' : 'bg-red-800 text-white'}"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1 flex justify-between">
        <h3
            class="font-semibold text-lg {color === 'light' ? 'text-blueGray-700' : 'text-white'}"
        >
          Gaps ({selectedStore.text ?? ''} - Upbit)
        </h3>
        <select bind:value="{id}" on:change="{onChangeStore}">
          <option value="">Select</option>
          {#each stores as s}
            <option value="{s.value}">{s.text}</option>
          {/each}
        </select>
        <button
            class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            on:click={refresh}
        >
          Refresh
        </button>
      </div>
    </div>
  </div>
  <div class="flex">
    <div class="block w-full overflow-x-auto">
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
        <tr>
          <th
              class="px-1 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            {selectedStore.text} -> Upbit
          </th>
        </tr>
        </thead>
        <tbody>
        {#each usdToKrwList as { coin, usd, krw, usdTokrw }}
          <tr>
            <td
                class="border-t-0 px-1 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2"
            >
              <div
                  class="ml-3 flex font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'} flex justify-center"
              >
                { coin } ({ usdTokrw.toFixed() })
              </div>
              <div>
                <div class="flex justify-center">$ { usd.ask.toFixed(4) }</div>
                <div class="flex justify-center">₩ { krw.bid }</div>
              </div>
            </td>
          </tr>
        {/each}
        </tbody>
      </table>
    </div>
    <div class="block w-full overflow-x-auto ml-1">
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
        <tr>
          <th
              class="px-1 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Upbit -> {selectedStore.text}
          </th>
        </tr>
        </thead>
        <tbody>
        {#each krwToUsdList as { coin, usd, krw, krwToUsd }}
          <tr>
            <td
                class="border-t-0 px-1 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2"
            >
              <div
                  class="ml-3 flex font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'} flex justify-center"
              >
                { coin } ({ krwToUsd.toFixed() })
              </div>
              <div>
                <div class="flex justify-center">$ { usd.bid.toFixed(4) }</div>
                <div class="flex justify-center">₩ { krw.ask }</div>
              </div>
            </td>
          </tr>
        {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
