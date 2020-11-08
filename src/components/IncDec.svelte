<script>
  import { viewport } from '../store';
  import FaRegPlusSquare from 'svelte-icons/fa/FaRegPlusSquare.svelte';
  import FaRegMinusSquare from 'svelte-icons/fa/FaRegMinusSquare.svelte';

  export let value = 0;
  export let onDec = () => value--;
  export let onInc = () => value++;

  export let negative = false;
  export let label = false;
  export let size = 45;
</script>

{#if label}
  <p class="label">{label}</p>
{/if}

<button
  class="action dec"
  style="width:{size}px; height:{size}px;"
  on:click="{() => {
    if (value > 0 || negative) {
      onDec();
    }
  }}"
><FaRegMinusSquare /></button>

<button
  class="action inc"
  style="width:{size}px; height:{size}px;"
  on:click="{onInc}"
><FaRegPlusSquare /></button>

<style>
  button {
    background-size: 1.4em 1.4em;
    border: none;
    opacity: 1;
    transition: opacity 0.2s;
    cursor: pointer;
    outline: none;
    padding: 10px;
  }

  .inc,
  .dec {
    width: 45px;
    height: 45px;
    position: relative;
    z-index: 1;
  }

  .label {
    font-weight: 700;
    align-self: center;
  }

  @media all and (max-width: 480px) {
    .inc,
    .dec {
      width: 42px;
      height: auto;
    }
  }
</style>
