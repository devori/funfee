<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";

  import Diff from "./views/Diff.svelte";
  import FunFee from "./views/FunFee.svelte";
  import Transfer from "./views/Transfer.svelte";
</script>

<Router>
  <Route path="/transfer/:id" component="{Transfer}" />
  <Route path="/funfee" component="{FunFee}" />
  <Route path="/funfee/:id" component="{FunFee}" />
  <Route path="/diff/:id" component="{Diff}" />
</Router>
