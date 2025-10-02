<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import { Studio } from "@threlte/studio";

  let showStudio = $state(false);
</script>

<Canvas>
  {#if showStudio}
    <Studio>
      <Scene />
    </Studio>
  {:else}
    <Scene />
  {/if}
</Canvas>