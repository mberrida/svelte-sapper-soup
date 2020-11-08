<script>
  import { stores, goto } from '@sapper/app';
  import iconsLib from '../constants/icons-lib';
  import { modal, stageDirection, viewport } from '../store';
  import Icon from './Icon.svelte';

  export let segment;

  const { session } = stores();

  let isAdmin = false;

  $: if ($session.user) {
    if (Array.isArray($session.user.roles)) {
      isAdmin = !!$session.user.roles.some((r) => r === 'admin');
    }
  }

  const modalSetup = (name) => {
    stageDirection.set('top');
    modal.set(name);
  };

  $: iconSize = $viewport.height > 480 ? 50 : 30;
</script>

<nav class:white-bg="{!segment}">
  <a
    href="/"
    class:active="{segment === undefined && !$modal}"
    on:click="{() => {
      stageDirection.set('top');
    }}"
  >
    <Icon label="Soppor" icon="img/icon/soup.svg" size="{iconSize}" />
  </a>

  {#if $session.user && $session.tokenExists}
    <button
      on:click="{() => modalSetup('user')}"
      class:active="{$modal === 'user'}"
    >
      <Icon
        label="{$session.user.firstName}"
        icon="img/icon/user.svg"
        size="{iconSize}"
      />
    </button>

    {#if isAdmin}
      <a
        class:active="{segment === 'admin'}"
        href="admin"
        rel="prefetch"
        on:click="{() => stageDirection.set('bottom')}"
      ><Icon label="Admin" icon="img/icon/admin.svg" size="{iconSize}" />
      </a>
    {/if}
  {:else}
    <button
      class:active="{$modal === 'login'}"
      on:click="{() => modalSetup('login')}"
    >
      <Icon label="Logga in" icon="img/icon/login.svg" size="{iconSize}" />
    </button>
    <button
      class:active="{$modal === 'register'}"
      on:click="{() => modalSetup('register')}"
    ><Icon label="Bli medlem" icon="img/icon/register.svg" size="{iconSize}" />
    </button>
  {/if}

  <a
    href="/om-oss"
    class:active="{segment === 'om-oss' && !$modal}"
    on:click="{() => {
      stageDirection.set('bottom');
    }}"
  >
    <Icon label="Om oss" icon="img/icon/info.svg" size="{iconSize}" />
  </a>
</nav>

<style>
  nav {
    display: flex;
    align-items: center;
    height: var(--theme-footer-height);

    width: 100%;
    max-width: 1000px;
    height: 100%;

    background: var(--theme-background-primary);
    box-shadow: 0px -8px 10px -15px #000;
  }

  .white-bg {
    background: #fff;
  }
  nav > * {
    flex: 1;
    outline: none;
    border: none;
    font-size: 20px;
    text-decoration: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: var(--theme-color_primary);
    background: none;
  }

  nav > *:hover {
    filter: contrast(1.2);
    transition: all 200ms;
  }

  @media all and (max-width: 480px) {
    nav > * {
      font-size: 3.5vw;
    }
  }

  .active {
    opacity: 1;
    transition: all 300ms;
    box-shadow: 0px 19px 7px -21px black;
  }
</style>
