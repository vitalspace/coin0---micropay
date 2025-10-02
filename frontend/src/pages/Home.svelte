<script lang="ts">
  import Cta from "@/components/home/Cta.svelte";
  import Features from "@/components/home/Features.svelte";
  import Hero from "@/components/home/Hero.svelte";
  import Hiw from "@/components/home/Hiw.svelte";
  import Usecases from "@/components/home/Usecases.svelte";
</script>

<main class="flex flex-col min-h-screen">
  <!-- Hero Section -->
  <Hero />
  <!-- How It Works Section -->
  <Hiw />
  <!-- Use Cases Section -->
  <Usecases />
  <!-- Features Section -->
  <Features />
  <!-- Final Call to Action Section -->
  <Cta />
</main>
