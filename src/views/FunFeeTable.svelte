<script>
  import axios from 'axios';

  let rates = [];
  let sortAsc = false;

  $:
    list = rates.sort((r1, r2) => ((r1.rate < r2.rate) ? -1 : 1) * (sortAsc ? 1 : -1))

  async function refresh() {
    const { data: { body } } = await axios.get('https://xrmxuo2hf1.execute-api.ap-northeast-2.amazonaws.com/prod/funding_rates');
    const lastTime = body.reduce((v, { time }) => v > time ? v : time, '');
    rates = body.filter(({ time }) => time === lastTime);
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
            on:click={() => sortAsc = !sortAsc}
          >
            Rate
          </th>
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Time
          </th>
        </tr>
      </thead>
      <tbody>
      {#each list as { future, rate, time }}
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
            { new Date(time).toLocaleTimeString() }
          </td>
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
</div>
