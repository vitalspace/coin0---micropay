<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, type ChartData, type ChartOptions } from 'chart.js/auto';
  import type { Donor } from '@/types/types';

  interface Props {
    donors: Donor[];
  }

  let { donors }: Props = $props();
  let canvas: HTMLCanvasElement;
  let chart: Chart;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const chartData: ChartData = {
        labels: donors.map(d => d.address.slice(0, 6) + '...'),
        datasets: [{
          label: 'Total Amount (APT)',
          data: donors.map(d => d.totalAmount),
          backgroundColor: 'rgba(0, 191, 255, 0.6)',
          borderColor: 'rgb(0, 191, 255)',
          borderWidth: 1,
        }]
      };

      const options: ChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Top Donors',
            color: 'white',
          },
        },
        scales: {
          x: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
          y: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
        },
      };

      chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options,
      });
    }
  });

  $effect(() => {
    if (chart && donors) {
      chart.data.labels = donors.map(d => d.address.slice(0, 6) + '...');
      chart.data.datasets[0].data = donors.map(d => d.totalAmount);
      chart.update();
    }
  });
</script>

<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-lg">
  <canvas bind:this={canvas} class="w-full h-64"></canvas>
</div>