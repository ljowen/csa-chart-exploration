<script>
  import { onMount } from "svelte";
  import { fetchData } from "./fetchData.js";
  import Radar from "./Radar.svelte";
  import Scatter from "./Scatter.svelte";

  let loading = null;;
  let combinedDict = null;
  let uname = "";
  let pass = "";

  const load = async () => {
    loading = true;
    combinedDict = await fetchData(`${uname}:${pass}`);
    loading = false;
  };
</script>

<main>
  <label>username: <input bind:value={uname} /></label>
  <label>pass: <input bind:value={pass} /></label>
  <button
    on:click={() => load()}    
  >
    LOAD
  </button>

  {#if loading === false}
    <div style="margin-bottom: 4rem">
      <h1 class="text-3xl">Radar Monthly TMin </h1>
      <Radar {combinedDict} />
    </div>
    <div>
      <h1>Scatter Monthly TMin</h1>
      <Scatter {combinedDict} />
    </div>
  {/if}
  {#if loading === true}
    <pre> loading... </pre>
  {/if}
</main>
