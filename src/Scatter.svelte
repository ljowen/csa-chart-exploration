<script>
  import { Chart, registerables } from "chart.js";
  import { onMount } from "svelte";
  import { PALETTE } from "./palette.ts";
  import mean from "lodash/mean";

  import regression from "regression";

  export let combinedDict;
  Chart.register(...registerables);

  let canvas;

  const allYears = Object.keys(combinedDict);
  const firstProjYear = Object.entries(combinedDict).find(
    ([_, value]) => !!value.rcp45
  )[0];

  const regreessionLineContainer = Array.from(
    Array(allYears.length),
    () => NaN
  );

  const obsMeanYears = Object.entries(combinedDict).map(([year, values]) => {
    return { x: parseInt(year), y: mean(values.obs) };
  });

  const rcp45MeanYears = Object.entries(combinedDict).map(([year, values]) => {
    return { x: parseInt(year), y: mean(values.rcp45) };
  });

  const rcp85MeanYears = Object.entries(combinedDict).map(([year, values]) => {
    return { x: parseInt(year), y: mean(values.rcp85) };
  });

  const obsReg = regression.linear(
    obsMeanYears.filter((my) => !!my.y).map((my) => [my.x, my.y])
  );
  const rcp45Reg = regression.linear(
    rcp45MeanYears.filter((my) => !!my.y).map((my) => [my.x, my.y])
  );

  const rcp45RegLine = [
    ...regreessionLineContainer.slice(0, allYears.indexOf(firstProjYear)),
    ...rcp45Reg.points.map(([_, y]) => y),
  ];
  
  const rcp85Reg = regression.linear(
    rcp85MeanYears.filter((my) => !!my.y).map((my) => [my.x, my.y])
  );
  const rcp85RegLine = [
    ...regreessionLineContainer.slice(0, allYears.indexOf(firstProjYear)),
    ...rcp85Reg.points.map(([_, y]) => y),
  ];

  onMount(() => {
    const ctx = canvas.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: allYears,
        datasets: [
          {
            type: "line",
            label: "Observation",
            data: obsMeanYears,
            backgroundColor: PALETTE.blue(0.5),
            showLine: false,
          },
          {
            type: "line",
            label: "Obs Reg",
            data: obsReg.points,
            pointRadius: 0,
            borderColor: PALETTE.blue(1),
          },
          {
            type: "line",
            label: "RCP45",
            data: rcp45MeanYears,
            backgroundColor: PALETTE.orange(0.5),
            showLine: false,
          },
          {
            type: "line",
            label: "rcp45 Reg",
            data: rcp45RegLine,
            pointRadius: 0,
            borderColor: PALETTE.orange(1),
          },
          {
            type: "line",
            label: "RCP85",
            data: rcp85MeanYears,
            backgroundColor: PALETTE.red(0.5),
            showLine: false,
          },
          {
            type: "line",
            label: "rcp85 Reg",
            data: rcp85RegLine,
            pointRadius: 0,
            borderColor: PALETTE.red(1),
          },
        ],
      },
      scales: {},    
    });

    chart.draw();
  });
</script>

<div>
  <div
    class="chart-container"
    style="position: relative;"
  >
    <canvas bind:this={canvas} width="400" height="400" id="scatter" />
  </div>
</div>
