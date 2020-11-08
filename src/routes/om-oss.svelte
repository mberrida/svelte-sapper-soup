<script>
  import { fly } from 'svelte/transition';
  import { enter, exit } from '../store';
  import { credits } from '../constants/preset';
  import Icon from '../components/Icon.svelte';
  import StepNavSpace from '../components/StepNavSpace.svelte';
  import Logo from '../components/Logo.svelte';
</script>

<svelte:head>
  <title>Svelte Sapper Soup! Om oss</title>
</svelte:head>

<div in:fly="{$enter()}" out:fly="{$exit()}">
  <Logo />

  <h1>Vi är Sapper-Soups</h1>

  <div class="icon-container">
    <Icon icon="smile" color="var(--theme-color-primary)" size="{100}" />
  </div>

  <div class="credits">
    <h2>Credits</h2>
    {#each credits as { key, val }, nth}
      <div class="credit">
        <p>{key}</p>
        <div>
          {@html val}
        </div>
      </div>
      <hr />
    {/each}
  </div>

  <StepNavSpace />
</div>

<style>
  div {
    width: 100%;

    text-align: center;
  }

  .logo {
    display: block;
    position: absolute;
    right: 0;
    width: 50px;
    height: 50px;
  }

  .logo > img {
    width: 100%;
    height: 100%;
  }

  .icon-container {
    display: flex;
    justify-content: center;
  }

  .logo:hover {
    transform: rotate(360deg);
    transition: 600ms;
  }

  .credits {
    padding: 0 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .credit {
    margin: 20px 0;
  }

  .credit > * {
    text-align: left;
  }

  .credits > hr {
    width: 100px;
    color: grey;
  }
</style>
