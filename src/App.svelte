<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";

  import FunFee from "./views/FunFee.svelte";

  export let url = "";
</script>

<Router url="{url}">
  <Route path="/" component="{FunFee}" />
</Router>
