<script>
  import { goto } from '@sapper/app';
  import { onMount } from 'svelte';
  import {
    stageDirection,
    currentAddress,
    nextStepDisabled,
    currentUser,
    validStreet,
  } from '../../store';
  import AddressForm from '../../components/AddressForm.svelte';
  import StepNavSpace from '../../components/StepNavSpace.svelte';
  import ActionOptions from '../../components/ActionOptions.svelte';
  import ActionBtn from '../../components/ActionBtn.svelte';
  import UserForm from '../../components/UserForm.svelte';
  import { hasEmptyFields } from '../../utils/helpers';

  export let fly = () => {};
  export let enter = () => {};
  export let exit = () => {};
  export let logout = () => {};

  let optionsHeight;
  let restoreAddress;
  let error = null;

  $: checkFields = {
    user: {
      firstName: $currentUser.firstName,
      lastName: $currentUser.lastName,
      email: $currentUser.email,
    },
    address: {
      firstName: $currentAddress.firstName,
      lastName: $currentAddress.lastName,
      street: $currentAddress.street,
      zip: $currentAddress.zip,
      city: $currentAddress.city,
    },
  };

  $: validInput =
    !hasEmptyFields(checkFields.user) &&
    !hasEmptyFields(checkFields.address) &&
    $validStreet;

  $: formToFocus = hasEmptyFields(checkFields.user)
    ? 'user'
    : hasEmptyFields(checkFields.address)
    ? 'address'
    : null;
</script>

<div
  class="address-input stage-container"
  in:fly="{$enter({ delay: 100 })}"
  out:fly="{$exit()}"
>
  <UserForm autoFocus="{formToFocus === 'user'}" />

  <AddressForm
    onSubmit="{() => stageDirection.set('top')}"
    bind:restore="{restoreAddress}"
    autoFocus="{formToFocus === 'address'}"
  />

  {#if error}
    <div class="flex-row">
      <p class="error">{error}</p>
    </div>
  {/if}

  <ActionOptions bind:height="{optionsHeight}" position="relative">
    <ActionBtn
      link="{false}"
      disabled="{!validInput}"
      index="{0}"
      count="{3}"
      onClick="{() => {
        if (!validInput) {
          error = 'Du måste fylla i alla obligatoriska fält.';
          return;
        }
        goto('order~adress');
        stageDirection.set('bottom');
      }}"
    >
      Spara
    </ActionBtn>

    <ActionBtn
      link="{false}"
      onClick="{() => {
        stageDirection.set('top');
        logout(() => {
          goto('order~vem');
        });
      }}"
      primary="{false}"
      index="{1}"
      count="{3}"
      icon="img/icon/arrow-l.svg"
    >
      Annat konto/gäst
    </ActionBtn>

    <ActionBtn
      href="varukorg"
      primary="{false}"
      index="{2}"
      count="{3}"
      onClick="{() => stageDirection.set('left')}"
      icon="img/icon/arrow-fast-l.svg"
      iconAlt="backwards arrow"
    >
      Varukorgen
    </ActionBtn>
  </ActionOptions>

  <StepNavSpace />
</div>

<style>
  .stage-container {
    min-height: 100%;
    /* position: absolute; */
    position: relative;
    height: fit-content;
  }

  .flex-row {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .error {
    font-size: 12px;
    font-style: italic;
    color: var(--theme-color-error-primary);
  }
</style>
