<script context="module">
  export function preload(page, { user }) {
    if (user) this.redirect(302, 'order~address');
  }
</script>

<script>
  import { goto, stores } from '@sapper/app';
  import { modal, stageDirection } from '../../store';
  import ActionOptions from '../../components/ActionOptions.svelte';
  import ActionBtn from '../../components/ActionBtn.svelte';

  const { session, page } = stores();

  export let fly = () => {};
  export let enter = () => {};
  export let exit = () => {};
  export let user = null;

  export let logout = () => {};

  let delayAll = 400;

  let optionsHeight;

  $: if ($session.user) goto('order~adress');
  $: navCount = !!$session.user && $session.tokenExists ? 3 : 4;
</script>

<div class="stage-container user-type">
  <div in:fly="{$enter({ delay: 100 })}" out:fly="{$exit()}">
    <h1 class="stage-title">
      {@html $session.tokenExists && user ? 'Beställ som' : `Logga eller bli medlem <br/> för att ta del av erbjudanden!`}
    </h1>
  </div>
  <div class="options-outer" style="min-height:{optionsHeight}px;">
    <ActionOptions bind:height="{optionsHeight}">
      {#if !!$session.user && $session.tokenExists}
        <ActionBtn
          href="order~adress"
          index="{0}"
          count="{navCount}"
          onClick="{() => stageDirection.set('right')}"
        >
          {user.firstName}
          {user.lastName}
        </ActionBtn>
        <ActionBtn
          link="{false}"
          onClick="{() => {
            stageDirection.set('top');
            logout();
          }}"
          primary="{false}"
          index="{1}"
          count="{navCount}"
        >
          Annat konto/gäst
        </ActionBtn>
      {:else}
        <ActionBtn
          link="{false}"
          onClick="{() => modal.set('login')}"
          index="{0}"
          count="{navCount}"
        >
          Logga in
        </ActionBtn>

        <ActionBtn
          link="{false}"
          primary="{false}"
          color="var(--theme-color-pop-primary)"
          onClick="{() => modal.set('register')}"
          index="{1}"
          count="{navCount}"
        >
          Bli medlem
        </ActionBtn>

        <ActionBtn
          href="order~ange-adress"
          primary="{false}"
          index="{2}"
          count="{navCount}"
          onClick="{() => stageDirection.set('right')}"
        >
          Beställ som gäst
        </ActionBtn>
      {/if}
      <ActionBtn
        href="varukorg"
        primary="{false}"
        index="{navCount - 1}"
        count="{navCount}"
        onClick="{() => stageDirection.set('right')}"
        icon="img/icon/arrow-fast-l.svg"
        iconAlt="backwards arrow"
      >
        Varukorgen
      </ActionBtn>
    </ActionOptions>
  </div>
</div>

<style>
  .stage-container {
    /* height: 100%; */
    height: 80%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }

  .options-outer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    min-height: 100vh;
  }

  .container * {
    text-align: center;
  }
</style>
