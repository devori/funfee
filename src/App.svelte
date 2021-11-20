<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";

  import FunFee from "./views/FunFee.svelte";
  import Gaps from "./views/Gaps.svelte";

  export let url = "";
</script>

<Router url="{url}">
  <Route path="/" component="{Gaps}" />
  <Route path="/funfee" component="{FunFee}" />
</Router>
