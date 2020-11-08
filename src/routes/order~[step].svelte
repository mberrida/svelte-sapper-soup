<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { fly } from 'svelte/transition';
  import {
    activeStep,
    currentUser,
    currentAddress,
    prevStepDisabled,
    nextStepDisabled,
    viewport,
    stageDirection,
    enter,
    exit,
    cartMeta,
    Lstored,
    delivered,
    streetMap,
    validStreet,
  } from '../store';
  import steps from '../steps/order';
  import { geoSearch } from '../utils/dynamicImport';
  import StepNav from '../components/StepNav.svelte';
  import StepNavBtn from '../components/StepNavBtn.svelte';
  import StepNavSpace from '../components/StepNavSpace.svelte';
  import { hasEmptyFields, tryCallback } from '../utils/helpers';
  import ActionBtn from '../components/ActionBtn.svelte';
  import Logo from '../components/Logo.svelte';

  const { page, session } = stores();

  let cartEmpty = true;

  async function logout(cb) {
    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'logout',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const res = await fetched.json();

    $session.user = null;
    $session.tokenExists = false;
    $session.token = null;

    tryCallback(cb);
  }

  onMount(async () => {
    if ($Lstored === null) Lstored.set(L || window.L);
    if (!$streetMap)
      streetMap.set(new (await geoSearch()).OpenStreetMapProvider());
  });

  $: activeStep.set(steps.find((s) => s.id === $page.params.step) || {});

  $: cartEmpty = $cartMeta.count.total < 1;
  $: cartEmpty && nextStepDisabled.set(true);

  $: nextStepDisabled.set(
    hasEmptyFields($currentAddress, 'notes') ||
      (!$validStreet && $streetMap) ||
      cartEmpty
  );
</script>

<svelte:head>
  <title>
    Svelte Sapper Soups!
    {$activeStep ? $activeStep.title : 'order'}
  </title>
</svelte:head>

{#if $activeStep.page === 'order' && $cartMeta}
  <div
    class="order page"
    in:fly="{$enter()}"
    out:fly="{$exit()}"
    style="--page-justify:{$cartMeta.count.total > 0 ? 'space-between' : 'space-evenly'};"
  >
    <Logo placement="top-right" />
    {#if $cartMeta.count.total > 0}
      <svelte:component
        this="{$activeStep.component}"
        activeStep="{activeStep}"
        currentUser="{currentUser}"
        currentAddress="{currentAddress}"
        user="{$session.user}"
        enter="{enter}"
        exit="{exit}"
        fly="{fly}"
        logout="{logout}"
      />
    {:else}
      <h1>Hoppsan, din varukorg verkar vara tom</h1>

      <ActionBtn href="/" onClick="{() => stageDirection.set('top')}">
        Till sopporna
      </ActionBtn>
    {/if}

    <!-- <StepNav>
      {#if $activeStep.prev !== false && !$prevStepDisabled}
        <StepNavBtn
          href="{cartEmpty ? '/' : $activeStep.prev.href}"
          primary="{false}"
          onClick="{() => ($activeStep.prev.onClick ? $activeStep.prev.onClick() : stageDirection.set('left'))}"
        >
          {cartEmpty ? 'Till sopporna!' : $activeStep.prev.text || 'Bakåt'}
        </StepNavBtn>
      {/if}

      {#if $activeStep.next !== false && !$nextStepDisabled}
        <StepNavBtn
          href="{$activeStep.next.href}"
          onClick="{() => ($activeStep.next.onClick ? $activeStep.next.onClick() : stageDirection.set('left'))}"
        >
          {$activeStep.next.text || 'Vidare'}
        </StepNavBtn>
      {/if}
    </StepNav> -->
  </div>
{/if}

<style>
  .page {
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 100vh;
    overflow-x: hidden;
    background: var(--theme-background-primary);

    display: flex;
    flex-direction: column;
    justify-content: var(--page-justify);
    align-items: center;

    flex: 1;
  }

  .fail-container {
    display: flex;
    flex-direction: column;
    height: 86vh;
  }
</style>
