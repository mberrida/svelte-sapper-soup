<script>
  import { orderStages, statusStages } from '../constants/preset';
  import { slide } from 'svelte/transition';
  import { expoOut } from 'svelte/easing';
  import Icon from '../components/Icon.svelte';
  import ProductList from './ProductList.svelte';
  import FaRegEdit from 'svelte-icons/fa/FaRegEdit.svelte';
  import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte';

  export let addresses;

  export let writeMode;

  export let bg = {
    primary: 'var(--theme-background-pop-primary)',
    secondary: 'var(--theme-background-pop-secondary)',
  };

  let addressOpen = false;

  const submit = () => {
    console.log('todo...');
  };

  const onRemove = () => {
    // ...
  };
</script>

{#each addresses as { firstName, lastName, street, zip, city, notes, _id } (_id)}
  <div class="address" transition:slide>
    <button
      class="toggle-panel"
      on:click="{() => {
        addressOpen = addressOpen === _id ? false : _id;
      }}"
      style="background:{addressOpen === _id ? bg.secondary : bg.primary};"
    >
      <p class="label" style="opacity:{addressOpen === _id ? '0' : '1'};">
        {street}
      </p>
      <Icon
        icon="angleDown"
        color="var(--theme-color-primary)"
        width="auto"
        transform="{addressOpen === _id ? 'rotate(180deg)' : 'rotate(0deg)'}"
      />
    </button>
    {#if addressOpen === _id}
      <form
        on:submit|preventDefault="{submit}"
        transition:slide="{{ duration: 500, easing: expoOut }}"
        style="background:{bg.secondary};"
      >
        <input
          id="firstName"
          placeholder="Förnamn*"
          bind:value="{firstName}"
          disabled="{!writeMode}"
          min="2"
          max="50"
          required
        />
        <input
          id="lastName"
          placeholder="Efternamn*"
          bind:value="{lastName}"
          disabled="{!writeMode}"
          min="2"
          max="50"
          required
        />
        <input
          id="street"
          placeholder="Gatuadress*"
          bind:value="{street}"
          disabled="{!writeMode}"
          min="2"
          max="50"
          required
        />
        <input
          id="zip"
          placeholder="Postnr*"
          bind:value="{zip}"
          disabled="{!writeMode}"
          min="5"
          max="7"
          required
        />
        <input
          id="city"
          placeholder="Ort*"
          bind:value="{city}"
          disabled="{!writeMode}"
          min="2"
          max="50"
          required
        />
        <label for="notes">Instruktioner/portkod</label>
        <input
          id="notes"
          placeholder="Instruktioner/portkod"
          bind:value="{notes}"
          disabled="{!writeMode}"
          max="150"
        />

        {#if !writeMode}
          <div class="edit-container row">
            <button
              class="edit"
              on:click="{() => {
                writeMode = true;
              }}"
            ><FaRegEdit /></button>
            <button
              class="remove"
              on:click="{() => {
                onRemove(_id);
              }}"
            ><FaRegTrashAlt /></button>
          </div>
        {:else}
          <div class="save-container row">
            <button
              class="save"
              on:click="{() => {
                // ...
                writeMode = false;
              }}"
            >Spara</button>
          </div>
        {/if}
      </form>
    {/if}
  </div>
{/each}

<style>
  .address {
    margin: 10px 0;
  }
  .toggle-panel {
    width: 100%;
    margin: 0 auto;
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
    border-radius: 2px;
    padding: 5px;
  }

  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    padding: 20px;
  }

  form > * {
    align-self: center;
  }

  .row {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
  }

  .row > button {
    width: 50px;
    height: 50px;
    background: none;
    border: none;
    outline: none;
    color: var(--theme-color-primary);
  }

  #street {
    grid-column: 1 / -1;
  }

  input {
    border: solid #444 1px;
    padding: 5px;
    border-radius: 2px;
  }
</style>
