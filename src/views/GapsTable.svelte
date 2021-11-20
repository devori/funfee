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
              class="px-1 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            FTX -> Upbit
          </th>
        </tr>
        </thead>
        <tbody>
        {#each ftxToUpbitList as { coin, usd, krw, ftxToUpbit }}
          <tr>
            <td
                class="border-t-0 px-1 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2"
            >
              <div
                  class="ml-3 flex font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'} flex justify-center"
              >
                { coin } ({ ftxToUpbit })
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
            Upbit -> FTX
          </th>
        </tr>
        </thead>
        <tbody>
        {#each upbitToFtxList as { coin, usd, krw, upbitToFtx }}
          <tr>
            <td
                class="border-t-0 px-1 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2"
            >
              <div
                  class="ml-3 flex font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'} flex justify-center"
              >
                { coin } ({ upbitToFtx })
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
