<script lang="ts">
  import { T } from "@threlte/core";
  import { Stars } from "@threlte/extras";
  import Wallet from "./Wallet.svelte";
</script>

<T.PerspectiveCamera
  makeDefault
  position={[0, 0, 8]}
  oncreate={(ref) => {
    ref.lookAt(0, 0, -5);
  }}
>
  <!-- <OrbitControls /> -->
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 10, 10]} />
<Stars count={500} speed={2.5} />
<Wallet />
