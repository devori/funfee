<script>
  import {getRates as getRatesForFtx} from "../apis/ftx-api";
  import {getRates as getRatesForBybit} from "../apis/bybit-api";

  export let id;
  export let color = "light";

  const stores = [
    { value: 'bybit', text: 'Bybit' },
    { value: 'ftx', text: 'FTX' },
  ];
  let rates = [];
  let sortBy = { asc: false, time: '' };

  $: list = rates.sort((r1, r2) => {
    const direction = sortBy.asc ? 1 : -1;
    if (sortBy.time !== r1.time) return 1;
    if (sortBy.time !== r2.time) return -1;
    return (r1.rate - r2.rate) * direction;
  });
  $: times = [...new Set(rates.map(({ time }) => time))].sort((t1, t2) => t1 < t2 ? -1 : 1);

  function onClickSortByTime(time) {
    sortBy = { time, asc: sortBy.time === time ? !sortBy.asc : false };
  }

  async function refresh() {
    switch (id) {
      case 'ftx':
        rates = (await getRatesForFtx()).filter((r) => r.future.endsWith('-PERP')).map((r) => ({ ...r, future: r.future.replace('-PERP', '') }));
        break;
      case 'bybit':
        rates = (await getRatesForBybit()).map((r) => ({ ...r, future: r.future.replace('USDT', '') }));
        break;
      default:
        break;
    }
    await Promise.resolve();
    onClickSortByTime(times?.[0] ?? ''); 
  }

  refresh();
  
  const onChangeStore = ({ target: { value } }) => {
    location.href = `/funfee/${value}`;
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
          FTX Funding Rates
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
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            Market
          </th>
          {#each times as t}
          <th
            class="px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
            on:click={() => onClickSortByTime(t)}
          >
          { new Date(t).toLocaleTimeString() }
          </th>
          {/each}
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
          {#each times as t}
          <td
            class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            { t === time ? `${(rate * 100).toFixed(4)}%` : '-' }
          </td>
          {/each}
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
</div>
