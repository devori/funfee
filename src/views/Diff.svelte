<script>
  import DiffTable from "./DiffTable.svelte";
  export let id;
</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <DiffTable id={id}/>
  </div>
</div>
