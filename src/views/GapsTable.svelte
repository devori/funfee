<script>
  import * as ftxApi from "../apis/ftx-api";
  import * as upbitApi from "../apis/upbit-api";

  let sort = { field: 'ftxToUpbit' };
  let ftxMarkets = {};
  let upbitMarkets = [];
  let list = [];

  $:
    ftxToUpbitList = [...list].sort((r1, r2) => {
      if (r1.coin === 'XRP') return -1;
      if (r2.coin === 'XRP') return 1;
      return r1.ftxToUpbit < r2.ftxToUpbit ? 1 : -1;
    });
  $: upbitToFtxList = [...list].sort((r1, r2) => {
      if (r1.coin === 'XRP') return -1;
      if (r2.coin === 'XRP') return 1;
      return r1.upbitToFtx < r2.upbitToFtx ? -1 : 1;
    })

  async function refresh() {
    list = [];
    ftxMarkets = await ftxApi.getMarkets();
    upbitMarkets = await upbitApi.getMarkets();
    const arr = upbitMarkets.filter(({ coin }) => ftxMarkets[coin]).map((u) => ({
      coin: u.coin,
      krw: u.market,
      usd: ftxMarkets[u.coin],
    }));
    const tickers = await upbitApi.getOrderBooks(arr.map(({ krw }) => krw));
    list = arr.map(({ coin, usd }) => ({
      coin, usd, krw: tickers[coin],
      ftxToUpbit: (tickers[coin].bid / usd.ask).toFixed(),
      upbitToFtx: (tickers[coin].ask / usd.bid).toFixed(),
    }));
  }
  refresh();

  export let color = "light";
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
          Gaps (FTX - Upbit)
        </h3>
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
              class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Market
          </th>
          <th
              class="px-3 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            FTX -> Upbit
          </th>
        </tr>
        </thead>
        <tbody>
        {#each ftxToUpbitList as { coin, usd, krw, ftxToUpbit }}
          <tr>
            <th
                class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
            >
            <span
                class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
            >
              { coin }
            </span>
            </th>
            <td
                class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              { ftxToUpbit } ({ usd.ask }, { krw.bid })
            </td>
          </tr>
        {/each}
        </tbody>
      </table>
    </div>
    <div class="block w-full overflow-x-auto ml-3">
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
        <tr>
          <th
              class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Market
          </th>
          <th
              class="px-3 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Upbit -> FTX
          </th>
        </tr>
        </thead>
        <tbody>
        {#each upbitToFtxList as { coin, usd, krw, upbitToFtx }}
          <tr>
            <th
                class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
            >
            <span
                class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
            >
              { coin }
            </span>
            </th>
            <td
                class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              { upbitToFtx } ({ usd.bid }, { krw.ask })
            </td>
          </tr>
        {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
