<script>
  import { fly, fade } from 'svelte/transition';
  import {
    soupPrototype,
    currentSoup,
    activeStep,
    viewport,
  } from '../../store';
  import addonsLib from '../../constants/addons-lib';
  import IncDec from '../../components/IncDec.svelte';
  import StepNavSpace from '../../components/StepNavSpace.svelte';

  export let enter;
  export let soup;
  export let titleFlexDirection = 'column';

  let pickedAddons = addonsLib.map((addon) => {
    const match = $currentSoup.addons.find((a) => a.id === addon.id);
    let amount = match ? match.amount : 0;

    return {
      ...addon,
      amount,
    };
  });

  let totalPrice = 0;
  $: totalPrice = pickedAddons.reduce(
    (tot, next) => tot + next.price * next.amount,
    0
  );

  $: newSoupTotal = totalPrice + $currentSoup.proto.price;
  $: validAddons = pickedAddons.filter((a) => a.amount > 0);

  $: currentSoup.set({
    ...$currentSoup,
    addons: validAddons,
    price: newSoupTotal,
  });
</script>

{#if $activeStep.id === 'plus'}
  <div
    class="soup-addon stage-container"
    in:fly="{enter}"
    style="z-index:{$activeStep.id === 'plus' ? 1 : -1};"
  >
    <h2 class="stage-title" style="flex-direction:{titleFlexDirection};">
      <span
        style="margin-left:{titleFlexDirection === 'column' ? '0.3em' : '0'};"
      >
        Något extra på din
      </span>
      <span> {soup.name.toUpperCase()}? </span>
    </h2>

    <ul class="addon-list" style="width:100%;">
      {#each pickedAddons as { name, unit, price, currency, img, id, amount } (id)}
        <li>
          <p class="addon" added="{amount > 0}">
            {name},
            {price}
            {currency}/{unit}
          </p>
          {#if amount > 0}
            <p class="addon-total-single">{amount}st</p>
          {/if}
          <div>
            <IncDec bind:value="{amount}" />
          </div>
        </li>
      {/each}

      {#if $currentSoup.addons.length > 0}
        <p class="addon-total" transition:fly="{{ y: 50, duration: 300 }}">
          Summa extra:
          {totalPrice}kr
        </p>
      {/if}
    </ul>
    <StepNavSpace />
  </div>
{/if}

<style>
  .soup-addon {
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    background: var(--theme-background-primary);
    padding: 0;
    margin: 0 auto;
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

  .addon {
    margin-right: 10px;
    flex: 1;
  }

  .addon-total {
    font-weight: 700;
    font-size: 18px;
    margin-right: 20px;
  }

  .addon-total-single {
    font-weight: 700;
  }
</style>
