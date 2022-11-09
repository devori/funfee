<script>
  import TransferTable from "./TransferTable.svelte";

  export let id;
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <TransferTable id="{id}"/>
  </div>
</div>
