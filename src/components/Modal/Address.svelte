<script>
  import Modal from './index.svelte';
  import { onMount } from 'svelte';
  import { goto, stores } from '@sapper/app';
  import { hasEmptyFields, addressSearch } from '../../utils/helpers';
  import {
    modal,
    stageDirection,
    currentAddress,
    streetMap,
    headerHeight,
  } from '../../store';
  import Icon from '../Icon.svelte';

  const { session } = stores();

  export let user;
  export let col;

  let error = null;
  let msg = null;

  let submitting = false;
  let close;

  $: if (error !== null) {
    submitting = false;
  }

  let editing = false;

  let input = $currentAddress.street
    ? $currentAddress.street
    : user
    ? user.mainAddress.street
    : '';

  $: street = $currentAddress.street
    ? $currentAddress.street
    : $session.tokenExists && user
    ? user.mainAddress.street
    : input
    ? input
    : null;
  $: output = street ? street + ', Vannes' : '';

  const submit = async () => {
    error = null;
    submitting = true;

    // light input check
    if (input.length < 3) {
      error = true;
      msg = 'Veuillez saisir une adresse valide à Vannes';
      return;
    }

    // search coordinates

    // on fail, return error/msg
    const res = await addressSearch($streetMap, input);

    if (!res) {
      error = true;
      msg = 'Nous ne pouvons malheureusement pas livrer à cette adresse, veuillez réessayer.';
      inputRef.select();
      return;
    }

    // on success, update currentAddress
    currentAddress.set({ ...$currentAddress, ...res.address });

    submitting = false;
    editing = false;
    msg = '';
  };

  let inputRef = null;

  onMount(() => {
    if ($currentAddress) input = $currentAddress.street;
  });

  $: if (editing && inputRef) inputRef.select();
</script>

<Modal
  className="address"
  bind:close
  overlay="{false}"
  sticky="{true}"
  bg="none"
  padding="0"
  position="relative"
  margin="0"
  col="{col}"
>
  <div
    class="container"
    style="margin:0 auto 0 10px;"
    bind:offsetHeight="{$headerHeight}"
  >
    {#if ($currentAddress.street || $session.tokenExists || user) && !editing}
      <div
        class="s-container"
        on:click="{() => {
          editing = true;
        }}"
      >
        <p>
          Adresse de livraison (cliquez pour modifier)  <br />
          <span class="address">{output}
            <img
              class="address-check"
              src="img/icon/check.svg"
              alt="checkmark"
            /></span>
        </p>
      </div>
    {:else}
      <h2>Pouvons-nous vous livrer?</h2>

      <div class="content">
        <form on:submit|preventDefault="{() => (!submitting ? submit() : {})}">
          <label for="first-name">Adresse de rue</label>
          <input
            bind:this="{inputRef}"
            type="text"
            id="first-name"
            placeholder="{`ex: "aigle celeste"`}"
            bind:value="{input}"
            minlength="3"
            on:focus="{() => {
              if (submitting) submitting = false;

              if (!editing) editing = true;
              if (error) error = null;
              if (msg) msg = null;
            }}"
            on:blur="{() => (!submitting ? submit() : {})}"
          />

          <!-- <button class="submit" type="submit">Spara ändringar</button> -->
        </form>
        {#if error}
          <p class="info error">{msg || error}</p>
        {:else if msg}
          <p class="info">{msg}</p>
        {/if}
      </div>
      {#if submitting}
        <p class="info">Chargement...</p>
      {/if}
    {/if}
  </div>
</Modal>

<style>
  * {
    color: var(--theme-color-secondary);
  }

  .container {
    width: 100%;
  }

  .s-container {
    display: flex;
    justify-content: flex-start;
  }

  .s-container > p {
    flex: 1;
    font-size: 12px;
    cursor: pointer;
  }

  .container {
    max-width: 90%;
    margin: 0 auto;
  }

  h2 {
    grid-column-start: 1;
    grid-column-end: 3;
    margin: 0;
  }

  form {
    display: flex;
    margin-bottom: 5px;
  }

  input {
    border: none;
    border-bottom: 1px var(--theme-color-secondary) solid;
    border-radius: 0;

    outline: none;
    background: none;

    flex: 1;
    margin-left: 10px;
  }

  span.address {
    font-weight: 700;
    font-size: 13px;
    color: var(--theme-color-success-third);
  }

  span.address > img {
    width: 15px;
    height: 100%;
    position: absolute;
    top: 10px;
    margin-left: 5px;
  }

  .info {
    font-size: 12px;
    font-style: italic;
    width: 100%;
    text-align: center;
    color: var(--theme-color-info-secondary);
  }

  .error {
    color: var(--theme-color-error-secondary);
  }
</style>
