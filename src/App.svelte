<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";

  // Admin Layout
  import Admin from "./layouts/Admin.svelte";
  // Auth Layout
  import Auth from "./layouts/Auth.svelte";

  // No Layout Pages
  import Index from "./views/Index.svelte";
  import Landing from "./views/Landing.svelte";
  import Profile from "./views/Profile.svelte";
  import FunFee from "./views/FunFee.svelte";

  export let url = "";
</script>

<Router url="{url}">
<!--  &lt;!&ndash; admin layout &ndash;&gt;-->
<!--  <Route path="admin/*admin" component="{Admin}" />-->
<!--  &lt;!&ndash; auth layout &ndash;&gt;-->
<!--  <Route path="auth/*auth" component="{Auth}" />-->
<!--  &lt;!&ndash; no layout pages &ndash;&gt;-->
<!--  <Route path="landing" component="{Landing}" />-->
<!--  <Route path="profile" component="{Profile}" />-->
<!--  <Route path="/" component="{Index}" />-->
  <Route path="/" component="{FunFee}" />
</Router>
