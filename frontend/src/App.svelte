<script lang="ts">
  import Layout from "@/components/Layout.svelte";
  import NotFound from "@/pages/404.svelte";
  import Dashboard from "@/pages/Dashboard.svelte";
  import Home from "@/pages/Home.svelte";
  import Swap from "@/pages/Swap.svelte";
  import Username from "@/pages/Profile.svelte";
  import Campaigns from "@/pages/Campaign.svelte";
  import ToastContainer from "@/components/ui/ToastContainer.svelte";
  import { Route, Router } from "svelte5-router";
</script>

<Layout />
<Router>
  <Route path="/" component={Home} />
  <Route path="/swap" component={Swap} />
  <Route path="/dashboard" component={Dashboard} />
  <Route path="/u/:username" component={Username} />
  <Route path="/c/:useraddress/:id" component={Campaigns} />
  <Route path="*" component={NotFound} />
</Router>
<ToastContainer />
