<script>
  import {getRates} from "../apis/ftx-api";

  let rates = [];
  let sortBy = { direction: false, by: 'rate' };

  $:
    list = rates.sort((r1, r2) => ((r1[sortBy.by] < r2[sortBy.by]) ? -1 : 1) * (sortBy.direction ? 1 : -1));

  function onClickSort(by) {
    sortBy = { by, direction: sortBy.by === by ? !sortBy.direction : false };
  }

  async function refresh() {
    const data = await getRates();
    const lastTime = data.reduce((v, { time }) => v > time ? v : time, '');
    rates = data.filter(({ future, time }) => future.endsWith('-PERP') && time === lastTime).map((row) => ({
      ...row,
      future: row.future.replace('-PERP', ''),
      accum1: row.history.slice(0, 24).reduce((sum, { rate }) => sum + rate, 0),
      accum3: row.history.slice(0, 24 * 3).reduce((sum, { rate }) => sum + rate, 0),
      accum7: row.history.slice(0, 24 * 7).reduce((sum, { rate }) => sum + rate, 0),
      accum14: row.history.slice(0, 24 * 14).reduce((sum, { rate }) => sum + rate, 0),
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
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3
          class="font-semibold text-lg {color === 'light' ? 'text-blueGray-700' : 'text-white'}"
        >
          FTX Funding Rates
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
          >
            Market
          </th>
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('rate')}
          >
            { list[0] ? new Date(list[0]?.time).toLocaleTimeString() : '시간' }
          </th>
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('accum1')}
          >
            누적(1일)
          </th>
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('accum3')}
          >
            누적(3일)
          </th>
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('accum7')}
          >
            누적(7일)
          </th>
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSort('accum14')}
          >
            누적(14일)
          </th>
        </tr>
      </thead>
      <tbody>
      {#each list as { future, rate, time, accum1, accum3, accum7, accum14 }}
        <tr>
          <th
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
          >
            <span
              class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}"
            >
              { future }
            </span>
          </th>
          <td
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            { (rate * 100).toFixed(4) }%
          </td>
          <td
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            { (accum1 * 100).toFixed(4) }%
          </td>
          <td
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            { (accum3 * 100).toFixed(4) }%
          </td>
          <td
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            { (accum7 * 100).toFixed(4) }%
          </td>
          <td
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            { (accum14 * 100).toFixed(4) }%
          </td>
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
</div>
