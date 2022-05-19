<script>
  import * as ftxApi from "../apis/ftx-api";
  import * as bybitApi from "../apis/bybit-api";

  let futures = {};
  let sortBy = { direction: false, by: 'diff' };

  $:
    list = Object.values(futures)
            .filter(({ ftx, bybit }) => ftx && bybit)
            .map(({ name, ftx, bybit }) => ({ name, ftx, bybit, diff: 1 - (ftx.ask / bybit.ask) }))
            .sort((r1, r2) => ((r1[sortBy.by] < r2[sortBy.by]) ? -1 : 1) * (sortBy.direction ? 1 : -1));

  function onClickSort(by) {
    sortBy = { by, direction: sortBy.by === by ? !sortBy.direction : false };
  }

  async function refresh() {
    const ftxData = await ftxApi.getFutures();
    futures = ftxData.reduce((r, { name, ...ftx }) => {
      r[name] = { name, ftx };
      return r;
    }, {});

    const bybitData = await bybitApi.getFutures();
    futures = bybitData.reduce((r, { name, ...bybit }) => {
      r[name] = r[name] ?? { name };
      r[name].bybit = bybit;
      return r;
    }, futures);
  }

  refresh();

  export let color = "light";
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
          FTX - Bybit Diff
        </h3>
      </div>
    </div>
  </div>
  <div class="block w-full overflow-x-auto">
    <!-- Projects table -->
    <table class="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('name')}
          >
            Coin
          </th>
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('diff')}
          >
            Diff(%)
          </th>
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            FTX-perp
          </th>
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Bybit-perp
          </th>
        </tr>
      </thead>
      <tbody>
      {#each list as { name, diff, ftx, bybit }}
        <tr>
          <th
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
          >
            <span
              class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
            >
              { name }
            </span>
          </th>
          <td
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            { ((diff) * 100).toFixed(1) }%
          </td>
          <td
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            { ftx?.ask }
          </td>
          <td
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            { bybit?.ask }
          </td>
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
</div>
