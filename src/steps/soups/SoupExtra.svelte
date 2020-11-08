<script>
  import { fly, fade } from 'svelte/transition';
  import {
    soupPrototype,
    currentSoup,
    activeStep,
    cartDrinks,
    cartSides,
    viewport,
    cartMeta,
  } from '../../store';
  import sides from '../../constants/sides-lib';
  import drinks from '../../constants/drinks-lib';
  import IncDec from '../../components/IncDec.svelte';
  import StepNavSpace from '../../components/StepNavSpace.svelte';

  export let enter;
  export let soup;
  export let titleFlexDirection = 'column';

  let pickedDrinks = drinks.map((drink) => {
    let amount = 0;
    const match = $cartDrinks.find((d) => d.id === drink.id);

    if (match) amount = match.amount;

    return {
      ...drink,
      amount,
    };
  });

  let pickedSides = sides.map((side) => {
    let amount = 0;
    const match = $cartSides.find((s) => s.id === side.id);

    if (match) amount = match.amount;

    return {
      ...side,
      amount,
    };
  });

  $: cartDrinks.set(pickedDrinks.filter((d) => d.amount > 0));

  $: cartSides.set(pickedSides.filter((s) => s.amount > 0));

  let total = 0;
</script>

{#if $activeStep.id === 'tillval'}
  <div
    class="soup-extra stage-container"
    in:fly="{enter}"
    style="z-index:{$activeStep.id === 'tillval' ? 1 : -1};"
  >
    <h2 class="stage-title" style="flex-direction:{titleFlexDirection};">
      <span
        style="margin-left:{titleFlexDirection === 'column' ? '0.3em' : '0'};"
      >
        Tillval
      </span>
      <span> (för hela beställningen) </span>
    </h2>

    <h3 class="soup-name">{soup.name.toUpperCase()}</h3>

    <h4 class="section-title sides">Tillbehör</h4>
    {#each pickedSides as { name, unit, price, currency, img, id, amount } (id)}
      <ul class="sides-list" style="width:100%;">
        <li>
          <p class="extra">
            <span class:added="{amount > 0}"> {name}, </span>
            {price}{currency}
          </p>
          <div class="inc-dec-container">
            <IncDec
              bind:value="{amount}"
              label="{amount > 0 ? amount + 'st' : false}"
            />
          </div>
          <!-- <input min="0" type="number" bind:value="{amount}" /> -->
        </li>
      </ul>
    {/each}

    <h4 class="section-title drinks">Dryck</h4>
    {#each pickedDrinks as { name, unit, price, currency, img, id, amount } (id)}
      <ul class="drink-list" style="width:100%;">
        <li>
          <p class="drink">
            <span class:added="{amount > 0}"> {name}, </span>
            {price}{currency}
          </p>
          <div class="inc-dec-container">
            <IncDec
              bind:value="{amount}"
              label="{amount > 0 ? amount + 'st' : false}"
            />
          </div>
          <!-- <input min="0" type="number" bind:value="{amount}" /> -->
        </li>
      </ul>
    {/each}
    {#if $cartMeta.price.sides + $cartMeta.price.drinks > 0}
      <p class="extra-total" transition:fly="{{ y: 50, duration: 300 }}">
        Summa tillval:
        {$cartMeta.price.sides + $cartMeta.price.drinks}kr
      </p>
      <StepNavSpace />
    {/if}
  </div>
{/if}

<style>
  .soup-extra {
    position: absolute;
    display: flex;
    flex-direction: column;

    background: var(--theme-background-primary);
    padding: 0;
    height: 100%;
  }

  .section-title {
    font-weight: 700;
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

  .added {
    font-weight: 700;
  }

  .inc-dec-container {
    display: flex;
  }

  .extra-total {
    font-weight: 700;
    font-size: 18px;
    margin-right: 20px;
  }
</style>
