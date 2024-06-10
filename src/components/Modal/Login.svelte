<script>
  import Modal from './index.svelte';

  import { goto, stores } from '@sapper/app';
  import { hasEmptyFields, httpResMSg } from '../../utils/helpers';
  import { modal, stageDirection, currentAddress } from '../../store';
  import axios from 'axios';

  const { session, page } = stores();

  let close;

  const fields = {
    email: '',
    password: '',
  };

  let error = null;
  let msg = null;

  let submitting = false;
  $: if (error) submitting = false;

  $: console.error('login error', error);

  const submit = async () => {
    error = null;
    submitting = true;
    // light input check
    if (hasEmptyFields(fields)) {
      return (error = 'Un ou plusieurs champs obligatoires sont vides');
    }

    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'login',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fields),
    });

    submitting = false;

    if (fetched.status !== 200) {
      error = fetched.status + ' ' + fetched.statusText;

      msg = httpResMSg(fetched.status, 'Connexion');

      console.error('Login failed.', error, msg);

      return;
    }

    const res = await fetched.json();
    // console.log('Login res', res);

    $session.user = res.user;

    $session.tokenExists = res.tokenExists;

    currentAddress.set(res.user.mainAddress);

    stageDirection.set('bottom');

    modal.set(null);

    // go to admin-page
    /* if ($session.user.roles.indexOf('admin') > -1 && $page.path === '/')
        goto('admin'); */
  };

  /* const switchModal = (name) => {
    stageDirection.set('top')
    modal.set(name)
  } */
</script>

<Modal className="logga-in" bind:close>
  {#if submitting}
    <p class="info">Connexion en cours...</p>
  {:else}
    <h2>Connexion</h2>
    <form on:submit|preventDefault="{submit}">
      <label for="email">Email</label>
      <input type="email" bind:value="{fields.email}" minlength="5" />

      <label for="password" minlength="6">Mot de passe</label>
      <input type="password" bind:value="{fields.password}" />

      <button class="submit" type="submit">Se connecter</button>

      <button
        class="cancel"
        on:click="{() => {
          modal.set(null);
          close();
        }}"
        type="reset"
      >Fermer</button>
      <button
        class="register strong"
        on:click="{() => modal.set('register')}"
        type="reset"
      >Nouveau membre ?</button>
    </form>
    {#if error || msg}
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
    font-weight: 700;
    cursor: pointer;
    height: 50px;
  }

  .submit {
    grid-column-start: 1;
    grid-column-end: 3;

    background: var(--theme-background-secondary);
    color: white;
    border-radius: 2px;
    height: 70px;
  }

  .cancel {
    border-right: solid 1px var(--theme-color-primary);
  }

  .register {
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
</style>
