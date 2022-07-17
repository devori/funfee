<script>
  // core components
  import FunFeeTable from "./FunFeeTable.svelte";
  export let id;
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <FunFeeTable id="{id}" />
  </div>
</div>
