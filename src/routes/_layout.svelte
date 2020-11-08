<script>
  import {
    viewport,
    stageDirection,
    enter,
    exit,
    modal,
    currentUser,
    currentAddress,
    Lstored,
    cartSoups,
    cartSides,
    cartDrinks,
    cartMeta,
    streetMap,
    headerHeight,
    validStreet,
    activeStep,
  } from '../store';
  import ThemeContext from '../constants/ThemeContext.svelte';
  import LoginModal from '../components/Modal/Login.svelte';
  import RegisterModal from '../components/Modal/Register.svelte';
  import UserModal from '../components/Modal/User.svelte';
  import AddressModal from '../components/Modal/Address.svelte';
  import StepNavSpace from '../components/StepNavSpace.svelte';
  import Logo from '../components/Logo.svelte';
  import CartBtn from '../components/CartBtn.svelte';
  import { storage, addressSearch } from '../utils/helpers';
  import {
    initialSoups,
    initialSides,
    initialDrinks,
  } from '../constants/cart-preset';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { enterTransition, exitTransition } from '../utils/transition';
  import UAParser from 'ua-parser-js';

  import Nav from '../components/Nav.svelte';

  import { stores } from '@sapper/app';
  const { session, page } = stores();

  export let segment;

  // dimensions
  let mounted = false;

  let innerWidth;
  let innerHeight;
  let scrollY;
  let mobile;

  // conditional header
  let header = true;
  $: header = $page.path === '/' || !$currentAddress;

  // conditional footer
  let footer = true;
  $: footer =
    $page.path === '/' ||
    $page.path === '/om-oss' ||
    $page.path === '/logga-in' ||
    $page.path === '/registrera' ||
    $page.path === '/mina-ordrar' ||
    $page.path === '/admin'
      ? true
      : false;

  $: viewport.set({
    width: innerWidth,
    height: innerHeight,
    scrollY,
    orientation: innerHeight > innerWidth ? 'portrait' : 'landscape',
    mobile,
  });

  let title = {
    w: $viewport.width < 620 || $viewport.scrollY > 100 ? 300 : 600,
    h: $viewport.width < 620 || $viewport.scrollY > 100 ? 50 : 100,
    containerW: $viewport.width < 1000 ? 500 : 1000,
    shadow: $viewport.scrollY > 100 ? '0px 8px 10px -15px #000' : 'none',
  };

  $: if ($viewport) {
    title = {
      w: $viewport.width < 620 || $viewport.scrollY > 100 ? 300 : 600,
      h: $viewport.width < 620 || $viewport.scrollY > 100 ? 50 : 100,
      containerW: $viewport.width < 1000 ? 500 : 1000,
      shadow: $viewport.scrollY > 100 ? '0px 8px 10px -15px #000' : 'none',
    };
  }

  // auth state

  // latest actual user address
  $: if ($session.user) {
    const { firstName, lastName, email } = $session.user;
    currentUser.set({
      firstName,
      lastName,
      email,
    });

    currentAddress.set($session.user.mainAddress);
  }

  $: if ($streetMap && $currentAddress && !$validStreet) {
    if ($currentAddress.street) {
      validStreet.set(!!addressSearch($streetMap, $currentAddress.street));
    }
  }

  // general transition anims
  $: if ($stageDirection) {
    enter.set(enterTransition($stageDirection));
    exit.set(exitTransition($stageDirection));
  }

  // conditional header

  let headerColumns = '50px 1fr';
  $: headerColumns = !header
    ? '1fr'
    : '50px 1fr ' + ($cartMeta.count.total > 0 ? '70px' : '');

  $: !header && headerHeight.set(80);

  onMount(() => {
    mounted = true;

    const {
      user,
      tokenExists,
      userAgent,
      MODE,
      BACKEND_URL,
      CART_EMPTY,
    } = $session;

    const parser = new UAParser();
    parser.setUA($session.userAgent);
    mobile = parser.getResult().device['type'] == 'mobile';

    // console.log('SESSION (_layout.svelte):');
    // console.table({
    //   userExists: !!user,
    //   tokenExists,
    //   userAgent,
    //   mobile,

    //   MODE,
    //   BACKEND_URL,
    //   CART_EMPTY,
    // });
  });

  $: if (segment) {
    if (
      segment.substr(0, 8) !== 'ny-soppa' &&
      segment.substr(0, 5) !== 'order' &&
      $activeStep
    ) {
      activeStep.set({});
    }
  } else if ($activeStep) {
    activeStep.set({});
  }
</script>

<svelte:window bind:scrollY bind:innerWidth bind:innerHeight />

<svelte:head>
  <!-- LEAFLET -->
  <link rel="stylesheet" href="leaflet/leaflet@1.7.1.css" crossorigin="" />
  <link
    rel="stylesheet"
    href="leaflet/leaflet-routing-machine.css"
    crossorigin=""
  />
  <link rel="stylesheet" href="leaflet/leaflet-geocoder.css" crossorigin="" />
  <!--  -->
  <script src="leaflet/leaflet@1.7.1.js" crossorigin="">
  </script>
  <script src="leaflet/leaflet-routing-machine.min.js" crossorigin="">
  </script>
  <script src="leaflet/moving-marker.js" crossorigin="">
  </script>
  <script src="leaflet/AnimatedMarker.js" crossorigin="">
  </script>
  <script src="leaflet/leaflet-geocoder.js" crossorigin="">
  </script>
</svelte:head>

<ThemeContext>
  {#if header}
    <header
      style="--header-height:{$headerHeight}px; 
      --scrollY:{$viewport.scrollY}; 
      grid-template-columns:{headerColumns}; 
      --header-radius:0px 0px {innerWidth > 1000 && scrollY < 100 ? '100px 100px' : '0 0'};"
      in:fly="{$enter()}"
      out:fly="{$exit()}"
    >
      <Logo />

      <AddressModal user="{$session.user}" col="{2}" />

      {#if $cartMeta.count.total > 0}
        <CartBtn />
      {/if}

      <div
        class="title-container"
        style="width:{title.containerW}px; box-shadow:{title.shadow};"
      >
        <img
          class="title-img"
          src="img/icon/title.png"
          alt="title img"
          style="width:{title.w}px; height:{title.h}px;"
        />
      </div>
    </header>
  {/if}

  <main>
    <div
      class="main-content-wrapper"
      style="max-width:{segment === 'admin' ? 'unset' : '1000px'};"
    >
      <slot />
    </div>

    {#if $modal === 'login'}
      <LoginModal />
    {:else if $modal === 'register'}
      <RegisterModal />
    {:else if $modal === 'user'}
      <UserModal />
    {/if}

    {#if $viewport.width < 480}
      <StepNavSpace />
    {/if}
  </main>
  {#if footer}
    <footer>
      <Nav segment="{segment}" />
    </footer>
  {/if}
</ThemeContext>

<style>
  :global(html) {
    background-color: var(--theme-background-primary);
    color: var(--theme-color-primary);
  }

  header,
  header > * {
    height: var(--header-height);
    min-height: 47px;
  }

  header {
    position: fixed;
    width: 100%;
    z-index: 3;

    display: grid;
    max-width: 1000px;
    align-self: center;

    background: var(--theme-background-secondary);
    border-radius: var(--header-radius);
  }

  main {
    width: 100%;
    height: 100%;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .main-content-wrapper {
    width: 100%;
    max-width: 1000px;

    height: 100vh;
    margin: 0 auto;

    position: relative;
    display: flex;
    flex-direction: column;
  }

  .title-container {
    max-width: 100%;
    height: fit-content;
    margin: 0 auto;
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    background: rgba(255, 255, 255, calc((var(--scrollY) / 100)));
  }

  footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: var(--theme-footer-height);
    z-index: 3;

    display: flex;
    justify-content: center;
  }

  @media all and (max-width: 1000px) {
    .main-content-wrapper {
      min-width: fill-available;
      min-width: -webkit-fill-available;
    }
  }
</style>
