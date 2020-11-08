<script>
  import { fly, fade } from 'svelte/transition';
  import spin from '../utils/spin';
  import {
    justAddedToCart,
    stageDirection,
    menuIndex,
    cartSoups,
    cartMeta,
  } from '../store';
  import Icon from '../components/Icon.svelte';

  //export let soupIndex;
  let ghostItem = false;

  $: ghostItem = $cartSoups[$cartSoups.length - 1] ? true : false;

  const onGhostEnd = () => {
    ghostItem = false;
  };

  const onClick = () => {
    //menuIndex.set(soupIndex);
    stageDirection.set('top');
  };

  $: amountOutput = $cartMeta.count.total < 10000 ? $cartMeta.count.total : '!';
  $: amountSize =
    $cartMeta.count.total < 100 || $cartMeta.count.total >= 10000
      ? 20
      : $cartMeta.count.total < 1000
      ? 18
      : 13;
</script>

<a
  href="/varukorg"
  class="cart-btn"
  on:click="{onClick}"
  transition:fly="{{ y: 100, duration: 500 }}"
>
  {#if ghostItem && $justAddedToCart}
    <img
      in:fly="{{ y: 1000, x: -400, duration: 1000 }}"
      out:fade="{{ duration: 500 }}"
      on:introend="{onGhostEnd}"
      class="ghost"
      alt="soup-thumbnail"
      src="{$cartSoups[$cartSoups.length - 1].proto.img}"
    />
  {:else}
    <div
      class="amount-container"
      in:spin="{{ duration: $justAddedToCart ? 1000 : 0 }}"
      on:introend="{() => justAddedToCart.set(false)}"
    >
      <Icon icon="img/icon/cart.svg" position="absolute" />
      <p class="amount" style="font-size:{amountSize}px;">{amountOutput}</p>
    </div>
  {/if}
</a>

<style>
  .cart-btn {
    grid-column: 3;
    position: absolute;
    top: 10px;
    z-index: 4;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(
      45deg,
      transparent 40%,
      rgba(255, 255, 255, 0.4)
    );
    /* box-shadow: 0 0 10px black; */
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    border-width: 1px;
    padding: 0;
  }

  .cart-btn,
  .cart-btn > * {
    text-decoration: none;
  }

  .cart-btn:hover {
    transform: scale(1.1);
  }

  .amount-container {
    flex: 1;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .amount {
    font-size: 20px;
    text-align: center;
    font-weight: 700;
    position: relative;
    z-index: 2;
    top: -5px;
    left: 5px;
    color: var(--theme-color-success-secondary);
    text-shadow: 0px 0px 5px black;
  }

  .ghost {
    position: absolute;
    z-index: 5;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: var(--theme-background-secondary);
  }
</style>
