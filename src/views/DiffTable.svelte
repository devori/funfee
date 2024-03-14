<script>
  import * as bybitApi from "../apis/bybit-api";
  import * as binanceApi from "../apis/binance-api";
  import * as upbitApi from "../apis/upbit-api";

  export let id;
  export let color = "light";

  let result = [];
  let sortBy = { direction: true, by: 'upbit' };
  
  const stores = [
    { value: 'bybit', text: 'Bybit' },
    { value: 'binance', text: 'Binance' },
  ];

  $:
    list = result.sort((r1, r2) => {
      if (r1[sortBy.by] === null) return 1;
      if (r2[sortBy.by] === null) return -1;
      return ((r1[sortBy.by] < r2[sortBy.by]) ? -1 : 1) * (sortBy.direction ? 1 : -1);
    });

  function onClickSort(by) {
    sortBy = { by, direction: sortBy.by === by ? !sortBy.direction : false };
  }

  async function refresh() {
    let futures = []
    if (id === 'bybit') {
      futures = await bybitApi.getFutures();
    } else if (id === 'binance') {
      futures = await binanceApi.getFutures();
    } else {
      alert(`Not supported future exchange: ${id}`);
      return;
    }

    const bybitMarkets = await bybitApi.getMarkets();
    const binanceMarkets = await binanceApi.getMarkets();
    const upbitMarkets = await upbitApi.getOrderBooks();

    result = futures.filter(({ name }) => bybitMarkets[name] || upbitMarkets[name])
      .map(({ name, ask }) => {
        return {
          name,
          future: ask,
          bybit: bybitMarkets[name] ? (bybitMarkets[name].ask / ask) : null,
          binance: binanceMarkets[name] ? (binanceMarkets[name].ask / ask) : null,
          upbit: upbitMarkets[name] ? (upbitMarkets[name].ask / ask) : null,
        }
      });
  }

  refresh();

  const onChangeStore = ({ target: { value } }) => {
    location.href = `/diff/${value}`;
  };
</script>

<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {color === 'light' ? 'bg-white' : 'bg-red-800 text-white'}"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3
          class="font-semibold text-lg {color === 'light' ? 'text-blueGray-700' : 'text-white'}"
        >
          Future - Market
        </h3>
      </div>
      <select bind:value="{id}" on:change="{onChangeStore}">
        <option value="">Select</option>
        {#each stores as s}
          <option value="{s.value}">{s.text}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="block w-full overflow-x-auto">
    <!-- Projects table -->
    <table class="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          <th
            class="px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('name')}
          >
            Coin
          </th>
          <th
            class="px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Future
            <br />
            ({ stores.find(({ value }) => value === id).text })
          </th>
          <th
            class="px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('bybit')}
          >
            Bybit
          </th>
          <th
            class="px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('binance')}
          >
            Binance
          </th>
          <th
            class="px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('upbit')}
          >
            Upbit
          </th>
        </tr>
      </thead>
      <tbody>
      {#each list as { name, future, bybit, binance, upbit }}
        <tr>
          <th
            class="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
          >
            <span
              class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
            >
              { name }
            </span>
          </th>
          <td
            class="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            { future }
          </td>
          <td
            class="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            { bybit ? (bybit * 100).toFixed(2) : '-' }%
          </td>
          <td
            class="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            { binance ? (binance * 100).toFixed(2) : '-' }%
          </td>
          <td
            class="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            { upbit ? upbit.toFixed(0) : '-' }
          </td>
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
</div>
