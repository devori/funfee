<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";

  import Diff from "./views/Diff.svelte";
  import FunFee from "./views/FunFee.svelte";
  import Gaps from "./views/Gaps.svelte";

  export let url = "";
</script>

<Router url="{url}">
  <Route path="/" component="{Gaps}" />
  <Route path="/funfee" component="{FunFee}" />
  <Route path="/diff" component="{Diff}" />
</Router>
