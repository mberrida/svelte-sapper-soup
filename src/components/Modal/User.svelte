<script>
  import Modal from './index.svelte';

  import { goto, stores } from '@sapper/app';
  import {
    hasEmptyFields,
    addressSearch,
    nextEmptyField,
  } from '../../utils/helpers';
  import {
    modal,
    stageDirection,
    currentAddress,
    streetMap,
    validStreet,
  } from '../../store';
  const { session } = stores();

  $: user = $session.user;

  let { firstName, lastName, email, mainAddress, id } = $session.user;

  let fields = {
    firstName,
    lastName,
    email,
    mainAddress,
  };

  let error = null;
  let msg = null;
  let info = null;

  let submitting = false;
  let editing = false;
  let close;

  let editingEmail = false;

  let profileRefs = {
    firstName: null,
    lastName: null,
    email: null,
  };
  let addressRefs = {
    firstName: null,
    lastName: null,
    street: null,
    zip: null,
    city: null,
  };

  $: if (error !== null) {
    editing = false;
    submitting = false;
  }

  let searching = false;

  async function logout() {
    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'logout',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const res = await fetched.json();

    // console.log('logout res status', res);

    $session.user = null;
    $session.tokenExists = false;
    $session.token = null;

    currentAddress.set({});

    stageDirection.set('top');
    modal.set('login');
  }

  const submit = async () => {
    error = null;
    info = null;
    editing = false;
    submitting = true;

    // light input check
    if (hasEmptyFields(fields))
      return (error = 'Ett eller flera obligatoriska fält är tomma');

    const newUser = { ...fields };
    const prevUser = { email, id };

    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'updateUser',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newUser, prevUser }),
    });

    const res = await fetched.json();

    // console.log('update user res status', res.status);

    if (res.status === 200) {
      $session.user = { ...res.user };
      const { firstName, lastName, email, mainAddress } = res.user;

      fields = {
        firstName,
        lastName,
        email,
        mainAddress,
      };

      msg = 'Sparat!';

      editing = false;

      currentAddress.set(mainAddress);

      // if email change, logout
      // if (newUser.email !== prevUser.email) logout();
    } else {
      error = res.error;

      msg = res.msg || 'Något gick fel';

      console.error('update user error', error);
    }

    submitting = false;
  };

  const validateAddress = async () => {
    error = null;
    searching = true;
    info = 'Söker efter adressen...';
    const addr = await addressSearch($streetMap, fields.mainAddress.street);

    if (addr) {
      info = null;
      validStreet.set(true);
      const { street, zip, city } = addr.address;
      currentAddress.set({ ...$currentAddress, street, zip, city });

      fields.mainAddress = { ...fields.mainAddress, street, city, zip };
    } else {
      validStreet.set(false);
      info = 'Vi kunde inte hitta adressen.';
    }
    searching = false;

    let nextFocus = nextEmptyField(addressRefs);
    if (nextFocus) nextFocus.focus();
  };
</script>

<Modal className="user" bind:close>
  <div class="container">
    {#if submitting}
      <p class="info">Uppdaterar...</p>
    {:else}
      <h2>Profil</h2>
      <div class="content">
        {#if editing}
          <form
            on:submit|preventDefault="{submit}"
            on:click="{() => {
              if (msg) msg = '';
            }}"
          >
            <label for="first-name">Förnamn*</label>
            <input
              type="text"
              id="first-name"
              bind:value="{fields.firstName}"
              minlength="2"
              bind:this="{profileRefs.firstName}"
            />

            <label for="last-name">Efternamn*</label>
            <input
              type="text"
              id="last-name"
              bind:value="{fields.lastName}"
              minlength="2"
              bind:this="{profileRefs.lastName}"
            />

            <label for="email">Epost*</label>
            <input
              type="text"
              id="email"
              bind:value="{fields.email}"
              minlength="2"
              on:focus="{() => (editingEmail = true)}"
              on:blur="{() => (editingEmail = false)}"
              bind:this="{profileRefs.email}"
            />
            {#if editingEmail}
              <p class="info field">
                Vid uppdatering av epost behöver du logga in på nytt.
              </p>
            {/if}
            <fieldset class="address">
              <legend>Adress</legend>
              <label for="addressFirstName">Förnamn*</label>
              <input
                type="text"
                id="addressFirstName"
                bind:value="{fields.mainAddress.firstName}"
                minlength="2"
                bind:this="{addressRefs.firstName}"
              />

              <label for="addressLasttName">Efternamn*</label>
              <input
                type="text"
                id="addressLasttName"
                bind:value="{fields.mainAddress.lastName}"
                minlength="2"
                bind:this="{addressRefs.lastName}"
              />

              <label for="street">Gatuadress*</label>
              <input
                type="text"
                id="street"
                bind:value="{fields.mainAddress.street}"
                minlength="2"
                on:blur="{validateAddress}"
                bind:this="{addressRefs.street}"
                disabled="{searching}"
              />

              <label for="zip">Postnr*</label>
              <input
                type="text"
                id="zip"
                bind:value="{fields.mainAddress.zip}"
                minlength="2"
                bind:this="{addressRefs.zip}"
                disabled="{searching}"
              />

              <label for="city">Ort*</label>
              <input
                type="text"
                id="city"
                bind:value="{fields.mainAddress.city}"
                minlength="2"
                bind:this="{addressRefs.city}"
                disabled="{searching}"
              />
              {#if info}
                <p class="info address">{info}</p>
              {/if}
            </fieldset>

            <button class="submit" type="submit">Spara ändringar</button>
          </form>
        {:else if $session.user}
          <div class="profile-data">
            <p>{$session.user.firstName} {$session.user.lastName}</p>

            <p>{$session.user.email}</p>
            <h3>Adress</h3>
            <p>
              {$session.user.mainAddress.firstName || 'Förnamn: ?'}
              {$session.user.mainAddress.lastName || 'Efternamn: ?'}
            </p>
            <p>{$session.user.mainAddress.street || 'Gatuadress: ?'}</p>
            <p>
              {$session.user.mainAddress.zip || 'Postnr: ?'}
              {$session.user.mainAddress.city || 'Ort: ?'}
            </p>

            <button
              class="btn link"
              href="mina-ordrar"
              rel="prefetch"
              on:click="{() => {
                stageDirection.set('bottom');
                modal.set(null);
                goto('mina-ordrar');
              }}"
            >Se köphistorik</button>
          </div>
        {/if}
        {#if error}
          <p class="info error">{msg || error}</p>
        {/if}
      </div>
      <div class="options" class:editing>
        {#if editing}
          <button
            class="cancel-edit"
            on:click="{() => (editing = false)}"
            type="reset"
          >Avbryt ändring</button>
        {:else}
          <button
            on:click="{() => {
              (editing = true), (error = null), (msg = null);
            }}"
          >Ändra uppgifter</button>
        {/if}
        <button on:click="{logout}">Logga ut</button>

        <button
          on:click="{() => {
            modal.set(null);
            close();
          }}"
        >Stäng</button>
      </div>
    {/if}
  </div>
</Modal>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 100px;
    column-gap: 20px;
  }

  h2 {
    grid-column-start: 1;
    grid-column-end: 3;
  }

  .profile-data {
    display: flex;
    flex-direction: column;
  }

  .profile-data > * {
    margin: 0;
  }

  .profile-data > h3 {
    margin-top: 10px;
  }

  .content,
  .options {
    display: flex;
    flex-direction: column;
  }

  .options > * {
    height: 50px;
    border-left: 1px solid var(--theme-color-primary);
    margin-bottom: 10px;
    text-align: left;
    font-size: var(--theme-btn-fontSize-third);
  }

  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 20px;
  }

  .address {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-row-gap: 5px;
    padding: 5px;
    position: relative;
  }

  .address > legend {
    grid-column: 1 / -1;
  }

  .address > label {
    grid-column: 1;
  }

  .address > input {
    grid-column: 2;
    width: 90%;
  }

  input {
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

  .btn {
    margin: 10px 0;
    border-radius: 2px;
    font-weight: 700;
  }

  .btn.link {
    color: var(--theme-color-pop-primary);
  }

  .submit {
    grid-column-start: 1;
    grid-column-end: 3;
    height: 100%;
    background: var(--theme-background-pop-primary);
    color: white;
    font-weight: 700;
    height: 70px;
    border-radius: 2px;
  }

  .cancel-edit {
    color: var(--theme-color-pop-primary);
  }

  .info {
    font-style: italic;
    width: 100%;
    text-align: center;
  }

  .info.address {
    position: absolute;
    width: fit-content;
    top: 0;
    text-align: right;
    font-size: 10px;
    white-space: nowrap;
  }

  .info.field {
    grid-column-start: 1;
    grid-column-end: 3;
    font-size: 10px;
    font-style: italic;
  }
  .error {
    color: red;
  }

  @media all and (max-width: 480px) {
    .container {
      grid-template-columns: 1fr 70px;
    }
    .address {
      grid-template-columns: 65px 1fr;
      width: 93%;
    }

    .address label {
      font-size: 10px;
    }

    .options > button {
      font-size: 10px;
      max-width: 50px;
    }
  }

  @media all and (max-height: 480px) and (min-width: 480px) {
    h2 {
      margin: 0;
    }
    form {
      grid-template-columns: 105px 1fr;
      row-gap: 0;
    }

    form * {
      font-size: 11px !important;
    }

    fieldset {
      row-gap: 0;
      padding: 5px;
    }

    .submit {
      width: 100%;
      height: 35px;
      margin: 5px 0;
      font-size: var(--theme-btn-fontSize-third);
    }
  }
</style>
