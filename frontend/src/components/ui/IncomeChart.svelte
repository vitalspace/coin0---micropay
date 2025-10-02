<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, type ChartData, type ChartOptions } from 'chart.js/auto';

  interface Props {
    data: { date: string; amount: number }[];
    title: string;
  }

  let { data, title }: Props = $props();
  let canvas: HTMLCanvasElement;
  let chart: Chart;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const chartData: ChartData = {
        labels: data.map(d => d.date),
        datasets: [{
          label: 'Income (APT)',
          data: data.map(d => d.amount),
          borderColor: 'rgb(0, 191, 255)',
          backgroundColor: 'rgba(0, 191, 255, 0.1)',
          tension: 0.4,
          fill: true,
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
            text: title,
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
        type: 'line',
        data: chartData,
        options,
      });
    }
  });

  $effect(() => {
    if (chart && data) {
      chart.data.labels = data.map(d => d.date);
      chart.data.datasets[0].data = data.map(d => d.amount);
      chart.update();
    }
  });
</script>

<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-lg">
  <canvas bind:this={canvas} class="w-full h-64"></canvas>
</div>