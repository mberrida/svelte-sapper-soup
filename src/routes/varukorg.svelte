<script>
  import { fly, fade } from 'svelte/transition';
  import { stores } from '@sapper/app';
  import {
    stageDirection,
    soupPrototype,
    currentSoup,
    stage,
    editMode,
    enter,
    exit,
    cartSoups,
    cartSides,
    cartDrinks,
    cartMeta,
    Lstored,
    streetMap,
    viewport,
  } from '../store';
  import { itemPrototype } from '../utils/helpers';
  import { onMount } from 'svelte';
  import { geoSearch } from '../utils/dynamicImport';
  import StepNav from '../components/StepNav.svelte';
  import StepNavBtn from '../components/StepNavBtn.svelte';
  import StepNavSpace from '../components/StepNavSpace.svelte';

  const { page } = stores();

  onMount(async () => {
    if (!$Lstored) Lstored.set(L || window.L);
    if (!$streetMap)
      streetMap.set(new (await geoSearch()).OpenStreetMapProvider());
  });

  import CartList from '../components/CartList.svelte';
</script>

<svelte:head>
  <title>Svelte Sapper Soup! Varukorg</title>
</svelte:head>

{#if $page.path === '/varukorg'}
  <div class="cart" in:fly="{$enter()}" out:fly="{$exit()}">
    <div class="content" style="width:{$viewport.width - 10}px;">
      <h1 class="title">Varukorgen</h1>

      {#if $cartMeta.count.total > 0}
        <p class="subtitle">
          Här kan du lägga till, ta bort eller ändra produkter.
        </p>
        <CartList editable="{true}" />
      {:else}
        <h2 class="subtitle">Här var det torrt!</h2>

        <p class="subtitle">Och tomt.</p>
      {/if}
      <StepNavSpace />
    </div>
    <StepNav>
      <StepNavBtn
        primary="{false}"
        href="/"
        onClick="{() => stageDirection.set('bottom')}"
      >
        tillbaka
      </StepNavBtn>

      {#if $cartMeta.count.total > 0}
        <StepNavBtn
          href="order~vem"
          onClick="{() => stageDirection.set('right')}"
          flex="1"
        >
          Gå vidare
        </StepNavBtn>
      {/if}
    </StepNav>
  </div>
{/if}

<style>
  .cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--theme-background-primary);
    padding: 0;
    margin: 0 auto;
    height: 100vh;
    position: absolute;
    width: 100%;
  }

  .title {
    text-align: center;
    font-size: var(--theme-title-fontSize-primary);
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .subtitle {
    font-style: italic;
    text-align: center;
  }
</style>
