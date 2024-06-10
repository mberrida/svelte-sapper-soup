<script>
  import { fly, fade } from 'svelte/transition';
  import {
    soupPrototype,
    currentSoup,
    activeStep,
    viewport,
  } from '../../store';
  import Switch from '../../components/Switch.svelte';
  import StepNavSpace from '../../components/StepNavSpace.svelte';

  export let enter;
  export let soup;
  export let titleFlexDirection = 'column';

  let hot = $currentSoup.served === 'hot';
  $: currentSoup.update((prev) => ({ ...prev, served: hot ? 'hot' : 'cold' }));

  const trans = { x: 100, duration: 300 };
</script>

{#if $activeStep.id === 'serveurs'}
  <div
    class="temperature stage-container"
    in:fly="{enter}"
    style="z-index:{$activeStep.id === 'serveur' ? 1 : -1};"
  >
    <h2 class="stage-title" style="flex-direction:{titleFlexDirection};">
      <span
        style="margin-left:{titleFlexDirection === 'column' ? '0.3em' : '0'};"
      >
      Comment va le vôtre
      </span>
      <span> {soup.name.toUpperCase()} </span>
      <span> serveur? </span>
    </h2>

    <div class="options">
      <Switch
        bind:checked="{hot}"
        color="{{ true: 'var(--theme-background-pop-primary)', false: 'var(--theme-background-blue-primary)' }}"
      />
      <div class="label-container">
        {#if hot}
          <p class="label hot" in:fly="{{ ...trans, delay: 200 }}">Chaude</p>
        {:else}
          <p class="label cold" in:fly="{{ ...trans, delay: 200 }}">Froide</p>
        {/if}
      </div>
    </div>
    <StepNavSpace />
  </div>
{/if}

<style>
  .temperature {
    position: absolute;
    display: flex;
    flex-direction: column;

    background: var(--theme-background-primary);
    padding: 0;
    height: 100%;
  }

  .options {
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
  }

  .label-container {
    position: relative;
    width: 60px;
  }

  .label {
    font-size: 30px;
    font-weight: 700;
    position: absolute;
    left: 0;
    margin: 0;
  }

  .label.hot {
    color: var(--theme-color-pop-primary);
  }
  .label.cold {
    color: var(--theme-color-blue-primary);
  }

  @media all and (min-height: 480px) {
    .options {
      margin-top: 100px;
    }
  }
</style>
