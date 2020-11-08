<script context="module">
  export async function preload({ params }, session) {
    const { soupId, stepId } = params;
    if (!soupId || !stepId) return redirect(302, '/');

    const soupRes = await this.fetch(`fetch/get~soups~${soupId}`);

    if (soupRes.error) return { error: soupRes.error };

    const soup = await soupRes.json();

    return soup ? { soup } : redirect(302, '/');
  }
</script>

<script>
  import { goto, stores } from '@sapper/app';
  import { onDestroy, onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { expoOut } from 'svelte/easing';
  import { writable } from 'svelte/store';
  import {
    activeStep,
    viewport,
    stageDirection,
    enter,
    exit,
    streetMap,
    currentSoup,
    soupPrototype,
    editMode,
    cartSoups,
    justAddedToCart,
  } from '../store';
  import steps from '../steps/soups';
  import { geoSearch } from '../utils/dynamicImport';
  import { timeStamp } from '../utils/helpers';
  import { soupTemplate } from '../constants/preset';
  import StepNav from '../components/StepNav.svelte';
  import StepNavBtn from '../components/StepNavBtn.svelte';

  const { page } = stores();

  export let soup;

  if (soup && !$soupPrototype) soupPrototype.set({ ...soup });

  $: activeStep.set(steps.find((s) => s.id === $page.params.stepId) || {});

  if (!$currentSoup) currentSoup.set(soupTemplate(soup));

  let prevStep = {},
    nextStep = {},
    isFirstStep,
    isLastStep,
    backText,
    nextVisible;

  $: if ($activeStep) {
    prevStep = steps.find((s) => s.key + 1 === $activeStep.key) || {};
    nextStep = steps.find((s) => s.key - 1 === $activeStep.key) || {};

    isFirstStep = $activeStep.key === 0;
    isLastStep = $activeStep.key === steps.length - 1;

    backText = isFirstStep ? 'avbryt' : 'bakåt';
    nextVisible = isLastStep || $activeStep.id === 'vem' ? false : true;
  }

  const goPrev = () => {
    stageDirection.set('left');
    activeStep.set(prevStep || {});
    const next = !isFirstStep
      ? `ny-soppa~${$soupPrototype.id || $currentSoup.proto.id}~${prevStep.id}`
      : $editMode
      ? 'varukorg'
      : '/';
    if (isFirstStep && editMode) editMode.set(false);
    goto(next);
  };

  const goNext = () => {
    stageDirection.set('right');
    activeStep.set(nextStep || {});
    goto(
      `ny-soppa~${$soupPrototype.id || $currentSoup.proto.id}~${nextStep.id}`
    );
  };

  const save = () => {
    justAddedToCart.set($editMode ? false : true);

    // replace?
    const index = $cartSoups.findIndex((s) => s.id === $currentSoup.id);

    if (index > -1) $cartSoups[index] = { ...$currentSoup };
    else cartSoups.set([...$cartSoups, $currentSoup]);

    goto($editMode ? 'varukorg' : '/');
    editMode.set(false);
  };

  /*  */

  onMount(async () => {
    // streetMap present?
    if (!$streetMap)
      streetMap.set(new (await geoSearch()).OpenStreetMapProvider());
  });

  let route;
  $: route = $page.path.substr(0, 9);
  console.log(route);
</script>

<svelte:head>
  <title>
    Svelte Sapper Soups!
    {$activeStep ? $activeStep.title : 'preferenser'}
  </title>
</svelte:head>

{#if soup}
  <div class="page ny-soppa">
    {#if $activeStep.page === 'ny-soppa'}
      <svelte:component
        this="{$activeStep.component}"
        enter="{$enter()}"
        exit="{$exit()}"
        soup="{soup}"
        titleFlexDirection="{$viewport.width <= 480 ? 'column' : 'row'}"
      />
    {/if}
    <StepNav>
      <!-- <button on:click="{goPrev}">{isFirstStep ? 'avbryt' : 'bakåt'}</button> -->

      <StepNavBtn link="{false}" primary="{false}" onClick="{goPrev}">
        {isFirstStep ? 'Avbryt' : 'Bakåt'}
      </StepNavBtn>

      <!-- <button on:click="{save}">spara</button> -->

      <StepNavBtn
        link="{false}"
        onClick="{save}"
        primary="{isLastStep}"
        color="var(--theme-color-pop-primary)"
      >
        Spara
      </StepNavBtn>

      {#if nextVisible && !isLastStep}
        <!-- <button on:click="{goNext}">vidare</button> -->

        <StepNavBtn
          link="{false}"
          primary="{$editMode ? false : true}"
          onClick="{goNext}"
        >
          Vidare
        </StepNavBtn>
      {/if}
    </StepNav>
  </div>
{/if}
