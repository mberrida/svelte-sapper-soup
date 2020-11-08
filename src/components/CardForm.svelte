<script>
  import { onMount } from 'svelte';
  import { clone, hasEmptyFields } from '../utils/helpers';
  import { currentAddress, currentCard, viewport } from '../store';
  import ActionOptions from './ActionOptions.svelte';
  import ActionBtn from '../components/ActionBtn.svelte';

  export let onSubmit = () => {};

  const preSubmit = () => {
    console.log('card pre submit...');
    onSubmit();
  };

  $: if ($currentAddress && !$currentCard.name)
    $currentCard.name = `${$currentAddress.firstName} ${$currentAddress.lastName}`;

  let ref = {
    name: null,
    no1: null,
    no2: null,
    no3: null,
    no4: null,
    month: null,
    year: null,
    secret: null,
    submit: null,
  };

  $: jumpOnLength = {
    name: { max: 100, next: ref.no1 },
    no1: { max: 4, next: ref.no2 },
    no2: { max: 4, next: ref.no3 },
    no3: { max: 4, next: ref.no4 },
    no4: { max: 4, next: ref.month },
    month: { max: 2, next: ref.year },
    year: { max: 2, next: ref.secret },
    secret: { max: 3, next: null },
  };

  onMount(() => {
    if (ref.name) {
      // autofocus-hack
      setTimeout(() => {
        ref.name.focus();
        if (ref.name.value !== '') ref.name.select();
      }, 0);
    }
  });

  let newFocus = false;
  let focusedInput = null;
  let focusedLength = 0;
  let select = false;

  $: if (focusedLength) {
    if (!newFocus && focusedLength === jumpOnLength[focusedInput.id].max) {
      select = true;

      let nextInput = jumpOnLength[focusedInput.id].next;
      if (nextInput) {
        jumpOnLength[focusedInput.id].next.focus();
      } else {
        ref[focusedInput.id].blur();
      }
    }
    newFocus = false;
  }

  $: if (focusedInput) {
    newFocus = true;
    if (select && focusedInput.id !== 'secret') focusedInput.select();
    select = false;
  }

  $: if ($currentCard && focusedInput) {
    focusedLength = focusedInput.value.length;
  }

  let optionsHeight;
</script>

<div class="form-container">
  <form on:submit|preventDefault="{preSubmit}">
    <div class="form-grid">
      <label for="name">Namn på kortet*</label>
      <input
        type="text"
        id="name"
        placeholder="..."
        bind:value="{$currentCard.name}"
        bind:this="{ref.name}"
        on:focus="{() => (focusedInput = ref.name)}"
      />

      <label for="no1">Kortnr*</label>
      <fieldset class="card-no">
        <input
          id="no1"
          type="number"
          placeholder="xxxx"
          minlength="4"
          maxlength="4"
          required
          bind:value="{$currentCard.no1}"
          bind:this="{ref.no1}"
          on:focus="{() => (focusedInput = ref.no1)}"
        />
        <span class="divider card-no">-</span>
        <input
          id="no2"
          type="number"
          placeholder="xxxx"
          minlength="4"
          maxlength="4"
          required
          bind:value="{$currentCard.no2}"
          bind:this="{ref.no2}"
          on:focus="{() => (focusedInput = ref.no2)}"
        />
        <span class="divider card-no">-</span>
        <input
          id="no3"
          type="number"
          placeholder="xxxx"
          minlength="4"
          maxlength="4"
          required
          bind:value="{$currentCard.no3}"
          bind:this="{ref.no3}"
          on:focus="{() => (focusedInput = ref.no3)}"
        />
        <span class="divider card-no">-</span>
        <input
          id="no4"
          type="number"
          placeholder="xxxx"
          minlength="4"
          maxlength="4"
          required
          bind:value="{$currentCard.no4}"
          bind:this="{ref.no4}"
          on:focus="{() => (focusedInput = ref.no4)}"
        />
      </fieldset>

      <label for="month">Förfallodatum*</label>
      <fieldset class="exp">
        <input
          id="month"
          type="number"
          placeholder="MM"
          minlength="2"
          maxlength="2"
          required
          bind:value="{$currentCard.month}"
          bind:this="{ref.month}"
          on:focus="{() => (focusedInput = ref.month)}"
        />
        <span class="divider exp">/</span>
        <input
          id="year"
          type="number"
          placeholder="ÅÅ"
          minlength="2"
          maxlength="2"
          required
          bind:value="{$currentCard.year}"
          bind:this="{ref.year}"
          on:focus="{() => (focusedInput = ref.year)}"
        />
      </fieldset>

      <label for="secret">CVV/CVC*</label>
      <input
        id="secret"
        type="number"
        placeholder="xxx"
        required
        minlength="3"
        maxlength="3"
        bind:value="{$currentCard.secret}"
        bind:this="{ref.secret}"
        on:focus="{() => (focusedInput = ref.secret)}"
      />
    </div>

    <div class="submit-container" style="height:{optionsHeight}px;">
      <ActionOptions bind:height="{optionsHeight}">
        <ActionBtn
          link="{false}"
          type="submit"
          bind:ref="{ref.submit}"
          outline="solid"
        >
          Betala
        </ActionBtn>
      </ActionOptions>
    </div>
  </form>
</div>

<style>
  .form-container {
    width: 95%;
    margin: 0 auto;
    left: 0;
    position: relative;
  }
  form {
    width: 100%;

    margin: 20px auto;
  }

  .form-grid {
    max-width: 100%;
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 20px 10px;
  }

  .submit-container {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }

  label {
    grid-column: 1;
  }

  input,
  fieldset {
    grid-column: 2;
    border: none;
    outline: none;
    height: 30px;
    margin: 0;
  }

  input {
    border-radius: var(--theme-borderRadius);
    padding-left: 5px;
    border: var(--theme-border-secondary);
  }

  fieldset {
    padding: 0;
  }

  fieldset.card-no {
    display: flex;
  }
  fieldset.card-no > input {
    width: 35px;
  }

  @media all and (max-width: 480px) {
    .form-grid {
      grid-template-columns: 1fr 1fr;
    }

    fieldset.card-no > input {
      width: 5vw;
      font-size: 2vw;
    }
  }

  .divider {
    line-height: 30px;
  }

  .divider.card-no {
    margin: 0 5px;
  }

  fieldset.exp > input {
    width: 19px;
  }

  #month,
  #year,
  #secret {
    width: 26px;
  }

  #month,
  #year {
    padding-left: 8px;
    width: 23px;
  }
</style>
