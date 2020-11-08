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
    currentUser,
    currentAddress,
    stageDirection,
    nextStepDisabled,
    Lstored,
    streetMap,
    validStreet,
  } from '../store';

  import { geoSearch } from '../utils/dynamicImport';

  export let onSubmit = () => {};
  export let autoFocus = false;

  const preSubmit = () => {
    // ...
    onSubmit();
  };

  let fNameRef;
  let lNameRef;
  let emailRef;

  let initialValues;

  export const restore = () => {
    currentUser.set({ ...initialValues });
  };

  let allEmpty = false;
  $: allEmpty = $currentUser ? allEmptyFields($currentUser) : true;

  onMount(async () => {
    initialValues = { ...$currentUser };

    // auto-focus-hack
    if (fNameRef && autoFocus) {
      setTimeout(() => {
        const tryFocus = nextEmptyField([fNameRef, lNameRef, emailRef]);
        if (tryFocus) tryFocus.focus();
      }, 0);
    }
  });

  const autofillTwin = (key) => {
    if ($currentUser[key] && !$currentAddress[key])
      $currentAddress[key] = $currentUser[key];
  };
</script>

<form on:submit|preventDefault="{preSubmit}">
  <h2>Beställare</h2>
  <label for="first-name">Förnamn*</label>
  <input
    type="text"
    id="first-name"
    placeholder="..."
    min="2"
    max="50"
    required
    bind:value="{$currentUser.firstName}"
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
    bind:value="{$currentUser.lastName}"
    bind:this="{lNameRef}"
    on:blur="{() => autofillTwin('lastName')}"
  />

  <label for="email">Epost*</label>
  <input
    type="email"
    id="email"
    placeholder="..."
    min="2"
    max="100"
    required
    bind:value="{$currentUser.email}"
    bind:this="{emailRef}"
  />
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
