<script>
  import { onMount } from "svelte";
  import { Chart, registerables } from "chart.js";
  import { PALETTE } from "./palette.ts";

  export let combinedDict = {};

  Chart.register(...registerables);

  let canvas;
  let chart;
  let minValue,
    maxValue = 0;
  let allYears = [];
  let currentYear = 0;

  allYears = Object.keys(combinedDict);
  const allValues = allYears
    .map((year) => Object.values(combinedDict[year]))
    .flat()
    .flat();

  currentYear = allYears[0];
  maxValue = Math.max(...allValues);
  minValue = Math.min(...allValues);

  onMount(() => {
    const ctx = canvas.getContext("2d");

    chart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: "JFMAMJJASOND".split(""),
        datasets: [
          { label: "Observation", backgroundColor: PALETTE.blue(0.5) },
          { label: "RCP45", backgroundColor: PALETTE.orange(0.5) },
          { label: "RCP85", backgroundColor: PALETTE.red(0.5) },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: false,
            angleLines: {
              display: true,
            },
            min: minValue,
            max: maxValue,
          },
        },
        plugins: {
          filler: {
            propagate: false,
          },
          "samples-filler-analyser": {
            target: "chart-analyser",
          },
        },
        interaction: {
          intersect: false,
        },        
      },
    });
    draw();
  });

  function draw() {    
    const { obs = [], rcp45 = [], rcp85 = [] } = combinedDict[currentYear];

    chart.data.datasets[0].data = obs;
    chart.data.datasets[1].data = rcp45;
    chart.data.datasets[2].data = rcp85;

    chart.options.scales.r.min = minValue;
    chart.options.scales.r.max = maxValue;
    chart.update();
  }

  let playInt = null;
  function play() {
    playInt = setInterval(() => {
      currentYear = parseInt(currentYear) + 1;
      draw();
    }, 500);
  }

  function pause() {
    clearInterval(playInt);
  }

</script>
  <div
    class="chart-container"
    style=""
  >
    <h1>{currentYear}</h1>
    <canvas bind:this={canvas} id="radar" />
    <div>
      <input
        style="width: 100%;"
        list="tickmarks"
        on:input={draw}
        bind:value={currentYear}
        type="range"
        min={allYears[0]}
        max={allYears[allYears.length - 1]}
        step="1"
      />
      <datalist id="tickmarks">
        {#each allYears as year}
          <option value={year} label={year}>{year}</option>
        {/each}
      </datalist>
      <div class="btn-wrapper">
      <button on:click={() => currentYear = allYears[0]}> &lt;&lt;| </button>
      <button on:click={() => { currentYear--; draw(); }  }> &lt;| </button>
      <button on:click={play}>Play</button>
      <button on:click={pause}>Pause</button>
      <button on:click={() => { currentYear++; draw(); } }> |&gt; </button>
      <button on:click={() => currentYear = allYears[allYears.length -1]}> |&gt;&gt; </button>
      </div>
    </div>
  </div>

<style>
  button {
    padding: 0.5rem;
  }
  .btn-wrapper {
    text-align: center;
  }
</style>