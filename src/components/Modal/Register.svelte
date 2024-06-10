<script>
  import Modal from './index.svelte';

  import { goto, stores } from '@sapper/app';
  import {
    hasEmptyFields,
    addressSearch,
    httpResMSg,
    nextEmptyField,
  } from '../../utils/helpers';
  import {
    modal,
    stageDirection,
    currentUser,
    currentAddress,
    streetMap,
    validStreet,
  } from '../../store';
  const { session } = stores();

  let password = '';
  let password2 = '';

  let error = null;
  let streetError = null;
  let searching = null;
  let msg = null;

  let submitting = false;
  $: if (error) submitting = false;

  $: checkFields = {
    user: {
      firstName: $currentUser.firstName,
      lastName: $currentUser.lastName,
      email: $currentUser.email,
      password,
    },
    address: {
      firstName: $currentAddress.firstName,
      lastName: $currentAddress.lastName,
      street: $currentAddress.street,
      zip: $currentAddress.zip,
      city: $currentAddress.city,
    },
  };

  $: $currentAddress.firstName = $currentUser.firstName;
  $: $currentAddress.lastName = $currentUser.lastName;

  let refs = {
    lName: null,
    fName: null,
    email: null,
    password: null,
    password2: null,
    street: null,
    zip: null,
    city: null,
  };

  const checkStreet = async () => {
    searching = true;

    if (!$streetMap) {
      return console.log("Impossible de vérifier l'adresse. Carte indisponible.");
    }

    const res = await addressSearch($streetMap, $currentAddress.street);

    if (res) {
      validStreet.set(true);
      const { street, zip, city } = res.address;
      currentAddress.set({ ...$currentAddress, street, zip, city });

      streetError = null;
    } else {
      validStreet.set(false);
      streetError = 'Nous n\'avons pas pu trouver l\'adresse.';
    }

    searching = false;

    const tryFocus = nextEmptyField(refs);
    if (tryFocus) tryFocus.focus();
  };

  const submit = async () => {
    error = null;
    submitting = true;
    // light input check
    if (hasEmptyFields(checkFields)) {
      error = 'Form data error';
      msg = 'Un ou plusieurs champs obligatoires sont vides';
      return;
    }

    if (password !== password2) {
      error = 'Form data error';
      msg = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (!$validStreet) {
      error = 'Form data error';
      msg = 'Impossible de trouver l\'adresse à Vannes.';
      return;
    }

    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'register',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...$currentUser,
        password,
        mainAddress: { ...$currentAddress },
        _id: `${Date.now()}_`,
      }),
    });

    if (fetched.status !== 200) {
      error = fetched.status + ' ' + fetched.statusText;
      msg = httpResMSg(fetched.status, 'l\'enregistrement');

      console.error('Échec de l\'enregistrement.', error, msg);
      return;
    }

    const res = await fetched.json();

    // console.log('Register res', res);

    $session.user = res.user;
    $session.tokenExists = res.tokenExists;
    $session.token = res.token;

    stageDirection.set('bottom');
    modal.set(null);
  };

  let close;
</script>

<Modal className="logga-in" bind:close>
  {#if submitting}
    <p class="info">Connexion en cours...</p>
  {:else}
    <h2>Connexion</h2>
    <form on:submit|preventDefault="{submit}">
      <label for="firstName">Prénom*</label>
      <input
        type="text"
        id="firstName"
        bind:value="{$currentUser.firstName}"
        minlength="1"
        required
        bind:this="{refs.fName}"
      />

      <label for="lastName">Nom de famille*</label>
      <input
        type="text"
        id="lastName"
        bind:value="{$currentUser.lastName}"
        minlength="1"
        required
        bind:this="{refs.lName}"
      />

      <label for="email">Email*</label>
      <input
        type="email"
        id="email"
        bind:value="{$currentUser.email}"
        min="5"
        required
        bind:this="{refs.email}"
      />

      <label for="password">Password*</label><input
        type="password"
        id="password"
        bind:value="{password}"
        minlength="6"
        required
        bind:this="{refs.password}"
      />

      <label for="password2">Confirmer password*</label>
      <input
        type="password"
        id="password2"
        bind:value="{password2}"
        minlength="6"
        required
        bind:this="{refs.password2}"
      />

      <label for="street">Adresse*</label>
      <input
        type="text"
        id="street"
        bind:value="{$currentAddress.street}"
        minlength="3"
        on:blur="{checkStreet}"
        on:focus="{() => {
          streetError = null;
        }}"
        bind:this="{refs.street}"
      />

      {#if streetError}
        <p class="info error grid">{streetError}</p>
      {/if}

      <label for="zip">Code postal*</label>
      <input
        type="text"
        id="zip"
        bind:value="{$currentAddress.zip}"
        minlength="5"
        bind:this="{refs.zip}"
      />

      <label for="city">Ville*</label>
      <input
        type="text"
        id="city"
        bind:value="{$currentAddress.city}"
        minlength="2"
        bind:this="{refs.city}"
      />

      <button class="submit" type="submit">S'inscrire</button>
      <button
        class="cancel option"
        on:click="{() => {
          modal.set(null);
          close();
        }}"
        type="reset"
      >Fermer</button>
      <button
        class="login strong option"
        on:click="{() => modal.set('login')}"
        type="reset"
      >Déjà membre ?</button>
    </form>
    {#if error}
      <p class="info error">{msg || error}</p>
    {/if}
  {/if}
</Modal>

<style>
  form {
    display: grid;
    grid-template-columns: 1fr 65%;
    grid-column-gap: 10px;
    grid-row-gap: 20px;
  }

  input,
  input[type='password'],
  input[type='email'] {
    border: none;
    border-bottom: 1px var(--theme-color-primary) solid;
    border-radius: 0;
    outline: none;
  }

  button {
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    height: 50px;
    font-weight: 700;
  }

  .submit {
    grid-column-start: 1;
    grid-column-end: 3;
    height: 100%;
    background: var(--theme-background-secondary);
    color: white;
    font-weight: 700;
    height: 70px;
    border-radius: 2px;
  }

  .cancel {
    grid-column: 1;
    font-weight: 700;
    border-right: solid 1px var(--theme-color-primary);
  }

  .login {
    border-left: solid 1px var(--theme-color-primary);
  }

  .strong {
    color: var(--theme-color-pop-primary);
  }

  .info {
    font-style: italic;
    width: 100%;
    text-align: center;
  }
  .error {
    color: red;
  }

  .error.grid {
    grid-column: 1 / -1;
  }

  @media all and (max-height: 480px) {
    h2 {
      margin: 0;
    }
    form {
      row-gap: 1px;
    }

    form > input {
      max-width: 250px;
    }

    .submit {
      height: 35px;
      margin: 5px 0;
    }

    .option {
      height: 35px;
      font-size: var(--theme-btn-fontSize-third);
    }
  }
</style>
