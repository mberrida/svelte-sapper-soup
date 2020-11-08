<script>
  import { fade } from 'svelte/transition';
  import { goto } from '@sapper/app';
  import ActionOptions from '../../components/ActionOptions.svelte';
  import ActionBtn from '../../components/ActionBtn.svelte';
  import StepNavSpace from '../../components/StepNavSpace.svelte';
  import { stageDirection } from '../../store';

  export let activeStep;
  export let fly = () => {};
  export let enter = () => {};
  export let exit = () => {};

  let optionsHeight;
</script>

<div
  class="stage-container payment-method"
  in:fly="{$enter({ delay: 200 })}"
  out:fly="{$exit()}"
>
  <h1 class="stage-title">Hur vill du betala?</h1>

  <div
    class="options-outer"
    style="min-height:{optionsHeight}px; z-index:{$activeStep.id === 'betalningsmetod' ? '1' : '-1'};"
  >
    <ActionOptions bind:height="{optionsHeight}">
      <ActionBtn
        link="{false}"
        disabled
        primary="{false}"
        index="{0}"
        count="{5}"
      >
        Swish
      </ActionBtn>

      <ActionBtn
        href="order~betalning"
        index="{1}"
        count="{5}"
        onClick="{() => stageDirection.set('right')}"
      >
        Kort
      </ActionBtn>
      <ActionBtn
        link="{false}"
        disabled
        primary="{false}"
        index="{2}"
        count="{5}"
      >
        Klarna
      </ActionBtn>

      <ActionBtn
        href="order~adress"
        onClick="{() => {
          stageDirection.set('left');
        }}"
        primary="{false}"
        index="{3}"
        count="{5}"
        icon="img/icon/arrow-l.svg"
      >
        Namn/Adress
      </ActionBtn>

      <ActionBtn
        href="varukorg"
        primary="{false}"
        index="{4}"
        count="{5}"
        onClick="{() => stageDirection.set('left')}"
        icon="img/icon/arrow-fast-l.svg"
      >
        Varukorgen
      </ActionBtn>
    </ActionOptions>
  </div>
  <StepNavSpace />
</div>

<style>
  .stage-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    position: absolute;
  }
  .stage-title {
    text-align: center;
    margin-bottom: 20px;
  }
  .options-outer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
</style>
