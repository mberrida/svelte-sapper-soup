<script>
  import { onMount } from 'svelte';
  import {
    clone,
    hasEmptyFields,
    allEmptyFields,
    addressSearch,
    nextEmptyField,
  } from '../utils/helpers';
  import {
    currentAddress,
    stageDirection,
    nextStepDisabled,
    Lstored,
    streetMap,
    validStreet,
    currentUser,
  } from '../store';

  import { geoSearch } from '../utils/dynamicImport';

  export let parentError = null;
  export let onSubmit = () => {};
  export let autoFocus = false;

  const preSubmit = () => {
    // ...
    onSubmit();
  };

  let fNameRef;
  let lNameRef;
  let streetRef;
  let zipRef;
  let cityRef;
  let notesRef;

  let initialValues;

  export const restore = () => {
    currentAddress.set({ ...initialValues });
  };

  let streetErr = null;

  let searching = false;

  const checkStreet = async () => {
    searching = true;

    if (!$streetMap) {
      return console.log("Can't check street. Streetmap unavailable.");
    }
    const res = await addressSearch($streetMap, streetRef.value);

    if (res) {
      validStreet.set(true);
      const { street, zip, city } = res.address;
      currentAddress.set({ ...$currentAddress, street, zip, city });

      streetErr = null;
    } else {
      validStreet.set(false);
      streetErr = 'Vi kunde inte hitta adressen';
    }

    searching = false;

    const tryFocus = nextEmptyField([
      fNameRef,
      lNameRef,
      streetRef,
      zipRef,
      cityRef,
      notesRef,
    ]);
    if (tryFocus) tryFocus.focus();
  };

  let allEmpty = false;
  $: allEmpty = $currentAddress
    ? allEmptyFields($currentAddress, 'notes')
    : true;

  onMount(async () => {
    initialValues = { ...$currentAddress };

    // set leaflet/streetmap instance
    if (!$Lstored) Lstored.set(L);
    if (!$streetMap)
      streetMap.set(new (await geoSearch()).OpenStreetMapProvider());

    // ready to check addr?
    if ($currentAddress) {
      if ($nextStepDisabled && $currentAddress.street) {
        checkStreet();
      }
    }

    // auto-focus-hack
    if (fNameRef && autoFocus) {
      setTimeout(() => {
        const tryFocus = nextEmptyField([
          fNameRef,
          lNameRef,
          streetRef,
          zipRef,
          cityRef,
          notesRef,
        ]);
        if (tryFocus) tryFocus.focus();
      }, 0);
    }
  });

  const autofillTwin = (key) => {
    if ($currentAddress[key] && !$currentUser[key])
      $currentUser[key] = $currentAddress[key];
  };
</script>

<form on:submit|preventDefault="{preSubmit}">
  <h2>Leveransadress</h2>
  <label for="first-name">Förnamn*</label>
  <input
    type="text"
    id="first-name"
    placeholder="..."
    min="2"
    max="50"
    required
    bind:value="{$currentAddress.firstName}"
    bind:this="{fNameRef}"
    on:blur="{() => autofillTwin('firstName')}"
  />

  <label for="last-name">Efternamn*</label>
  <input
    type="text"
    id="last-name"
    placeholder="..."
    min="2"
    max="50"
    required
    bind:value="{$currentAddress.lastName}"
    bind:this="{lNameRef}"
    on:blur="{() => autofillTwin('lastName')}"
  />

  <label for="street">Gatuadress*</label>
  <input
    type="text"
    id="street"
    placeholder="..."
    min="2"
    max="100"
    required
    bind:value="{$currentAddress.street}"
    bind:this="{streetRef}"
    on:blur="{checkStreet}"
    on:focus="{() => {
      streetErr = null;
      parentError = null;
    }}"
    disabled="{searching}"
  />

  {#if streetErr || parentError}
    <p class="error">{streetErr || parentError}</p>
  {/if}

  <label for="zip">Postnr*</label>
  <input
    type="text"
    id="zip"
    placeholder="..."
    min="5"
    max="7"
    required
    bind:value="{$currentAddress.zip}"
    bind:this="{zipRef}"
    disabled="{searching}"
  />

  <label for="city">Ort*</label>
  <input
    type="text"
    placeholder="..."
    min="1"
    max="50"
    required
    bind:value="{$currentAddress.city}"
    bind:this="{cityRef}"
    disabled="{searching}"
  />
  {#if searching}
    <p class="info">Söker adress...</p>
  {/if}

  <label for="notes">Portkod/ <br /> meddelande</label>
  <textarea
    type="text"
    id="notes"
    placeholder="..."
    rows="4"
    maxlength="150"
    bind:value="{$currentAddress.notes}"
    bind:this="{notesRef}"
  ></textarea>
</form>

<style>
  form {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 20px 10px;
    max-width: 400px;
    margin: 0 auto;
    align-self: center;
    margin-bottom: 20px;
  }

  h2 {
    grid-column: 1 / -1;
  }

  label {
    grid-column: 1;
  }

  input,
  textarea {
    grid-column: 2;
    background: none;
    outline: none;
    border: none;
    border-bottom: var(--theme-border-primary);
  }

  textarea {
    border: var(--theme-border-primary);
    border-radius: var(--theme-borderRadius);
  }

  .error {
    grid-column: 1 / -1;
    font-style: italic;
    color: var(--theme-color-error-primary);
  }
</style>
