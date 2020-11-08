<script>
  import { fly, fade } from 'svelte/transition';
  import {
    soupPrototype,
    currentSoup,
    activeStep,
    viewport,
  } from '../../store';
  import StepNavSpace from '../../components/StepNavSpace.svelte';

  export let enter;
  export let soup;
  export let titleFlexDirection = 'column';

  let ingredients = soup.content.map((ingr) => {
    const removed = $currentSoup.removed.findIndex((i) => i.name === ingr) > -1;

    return {
      name: ingr,
      removed,
    };
  });

  $: currentSoup.update((prev) => ({
    ...prev,
    removed: ingredients.filter((i) => i.removed),
  }));
</script>

{#if $activeStep.id === 'minus'}
  <div
    class="soup-remove stage-container"
    in:fly="{enter}"
    style="z-index:{$activeStep.id === 'minus' ? 1 : -1};"
  >
    <h2 class="stage-title" style="flex-direction:{titleFlexDirection};">
      <span
        style="margin-left:{titleFlexDirection === 'column' ? '0.3em' : '0'};"
      >
        Vill du ta bort något från din
      </span>
      <span> {soup.name.toUpperCase()}? </span>
    </h2>

    <ul class="remove-list" style="width:100%;">
      {#each ingredients as { name, removed } (name)}
        <li>
          <p class="content" status="{removed ? 'removed' : 'added'}">{name}</p>
          <input type="checkbox" bind:checked="{removed}" />
        </li>
      {/each}
    </ul>
    <StepNavSpace />
  </div>
{/if}

<style>
  .soup-remove {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: absolute;
    background: var(--theme-background-primary);
    padding: 0;
  }

  ul {
    list-style: none;
    padding: 0;

    display: flex;
    flex-direction: column;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;

    border-bottom: grey solid 1px;
  }

  .content {
    font-weight: 700;
    margin-right: 10px;
    flex: 1;
  }

  [status='removed'] {
    font-weight: 100;
    text-decoration: line-through;
  }

  input {
    width: 50px;
    height: 30px;
    mix-blend-mode: luminosity;
  }
</style>
