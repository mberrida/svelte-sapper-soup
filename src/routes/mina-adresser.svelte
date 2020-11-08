<script context="module">
  export async function preload(page, { user, tokenExists }) {
    if (!user || !tokenExists) this.redirect(302, '/');
    return { userId: user.id };
  }
</script>

<script>
  import { stores, goto } from '@sapper/app';
  import { fly } from 'svelte/transition';
  import {
    currentAddress,
    enter,
    exit,
    viewport,
    Lstored,
    streetMap,
    validStreet,
  } from '../store';
  import { geoSearch } from '../utils/dynamicImport';
  import AddressList from '../components/AddressList.svelte';
  import AddressForm from '../components/AddressForm.svelte';
  import ActionBtn from '../components/ActionBtn.svelte';
  import StepNav from '../components/StepNav.svelte';
  import StepNavBtn from '../components/StepNavBtn.svelte';
  import { onMount } from 'svelte';
  import { addressSearch } from '../utils/helpers';

  const { session } = stores();
  export let userId;

  let user = null;

  let error = null;

  let streetCool = false;

  const bg = {
    active: {
      primary: 'var(--theme-background-pop-primary)',
      secondary: 'var(--theme-background-pop-secondary)',
    },
    past: { primary: '#aaa', secondary: '#ddd' },
  };

  const getUser = async () => {
    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'getUser',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (fetched.status !== 200) {
      // return console.log('Failed to get user', fetched.error);
    }

    return (await fetched.json()).user;
  };

  const updateUser = async (data) => {
    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'updateUser',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (fetched.status !== 200) {
      return console.log('Failed to update user', fetched.error);
    }

    const res = await fetched.json();

    // console.log('update user res', res.user.addresses);
    $session.user = res.user;

    // console.log('User addresses updated successfully', res);

    // get updatedUser
    user = await getUser();
  };

  const onAdd = () => {
    if (!user) {
      error = 'Något gick fel. Prova att ladda om sidan.';
      // return console.log('valid street', streetCool, 'user', user);
    }

    // valid street
    // validStreet.set(!!addressSearch($streetMap, $currentAddress.street));
    // if (!$validStreet) {
    //   return;
    // }

    // check if no duplicate street
    let streetDuplicate = [user.mainAddress, ...user.addresses].some(
      (a) => a.street.toLowerCase() === $currentAddress.street.toLowerCase()
    );

    if (streetDuplicate) {
      error = $currentAddress.street + ' finns redan bland dina adresser.';
      return console.log($currentAddress.street, ' already street exists');
    }

    const { firstName, lastName, street, zip, city, notes } = $currentAddress;

    const data = {
      prevUser: {
        email: user.email,
        id: user.id,
      },
      newUser: {
        ...user,
      },
      newAddress: { firstName, lastName, street, zip, city, notes },
    };

    updateUser(data);
  };

  const onRemove = (_id) => {
    console.log('todo...');
  };

  const setAsMain = (_id) => {
    console.log('todo...');
  };

  onMount(async () => {
    user = await getUser();
    // set leaflet/streetmap instance
    if (!$Lstored) Lstored.set(L);
    if (!$streetMap)
      streetMap.set(new (await geoSearch()).OpenStreetMapProvider());
  });

  $: streetCool = $validStreet;
  $: !$session.tokenExists && goto('/');
  // $: console.log('validStr', $validStreet);
  // $: console.log('cool', streetCool);
  // $: console.log('USER', user);
  // $: console.log('SESS', $session.user);
</script>

<svelte:head>
  <title>Svelte Sapper Soup! Mina ordrar</title>
</svelte:head>

{#await user}
  <p>Laddar...</p>
{:then user}
  <div
    class="container"
    style="width:{$viewport.width - 10}px;"
    in:fly="{$enter()}"
    out:fly="{$exit()}"
  >
    <h1>Mina adresser</h1>

    {#if user}
      <h2>Huvudadress</h2>
      <AddressList addresses="{[user.mainAddress]}" />

      <hr />

      <h2>Andra</h2>
      <AddressList
        addresses="{user.addresses}"
        onRemove="{onRemove}"
        setAsMain="{setAsMain}"
      />
    {/if}

    <hr />

    <h2>Lägg till en ny adress</h2>
    <AddressForm bind:parentError="{error}" />

    <div class="btn-container">
      <ActionBtn link="{false}" onClick="{onAdd}">Lägg till</ActionBtn>
    </div>

    <div class="footer-space"></div>
  </div>
{:catch}
  <p>Kunde inte hämta dina adresser...</p>
{/await}
<StepNav>
  <StepNavBtn href="/" primary="{false}">Till sopporna</StepNavBtn>
</StepNav>

<style>
  .container {
    display: flex;
    flex-direction: column;
    padding: 5px;
  }

  .btn-container {
    display: flex;
    justify-content: center;
  }

  .footer-space {
    height: var(--theme-footer-height);
    width: 100%;
  }
</style>
