<script>
  import { goto, stores } from '@sapper/app';
  import { hasEmptyFields } from '../../utils/helpers';
  import AddressOverview from '../../components/AddressOverview.svelte';
  import ActionOptions from '../../components/ActionOptions.svelte';
  import ActionBtn from '../../components/ActionBtn.svelte';
  import StepNavSpace from '../../components/StepNavSpace.svelte';
  import { stageDirection } from '../../store';
  import Varukorg from '../../routes/varukorg.svelte';
  import UserOverview from '../../components/UserOverview.svelte';
  import Address from './AddressInput.svelte';

  const { session } = stores();

  export let currentUser;
  export let currentAddress;
  export let fly;
  export let enter;
  export let exit;
  export let user;
  export let logout = () => {};

  const submit = async () => {
    if (user) {
      const fetched = await fetch('fetch/post', {
        method: 'POST',
        headers: {
          _action: 'updateUser',
          _url: $session.BACKEND_URL,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newUser: {
            ...user,
            ...$currentUser,
            mainAddress: { ...$currentAddress },
          },
          prevUser: user,
        }),
      });

      const res = await fetched.json();

      // console.log('update user res status', res.status);

      if (res.status !== 200) {
        return console.log('Could not save current address to DB');
      }

      // console.log('saved current address to DB!');
    }

    stageDirection.set('right');
    goto('order~betalningsmetod');
  };

  let optionsHeight;

  $: checkFields = {
    user: {
      firstName: $currentUser.firstName,
      lastName: $currentUser.lastName,
      email: $currentUser.email,
    },
    address: {
      firstName: $currentAddress.firstName,
      lastName: $currentAddress.lastName,
      street: $currentAddress.street,
      zip: $currentAddress.zip,
      city: $currentAddress.city,
    },
  };

  $: validUser = !hasEmptyFields(checkFields.user);
  $: validAddress = !hasEmptyFields(checkFields.address);

  $: (!validUser || !validAddress) && goto('order~ange-adress');
</script>

<div class="address-confirm stage-container">
  {#if $currentAddress}
    {#if validAddress}
      <div
        class="address"
        in:fly="{$enter({ delay: 200 })}"
        out:fly="{$exit()}"
      >
        <h2 class="stage-title">Vos informations sont-elles correctes ?</h2>
        <UserOverview user="{$currentUser}" title="Acheteur" />
        <AddressOverview address="{$currentAddress}" title="Adresse de livraison" />
      </div>
    {/if}
    <div
      class="options-outer"
      style="min-height:{optionsHeight}px; margin:{validAddress ? 'auto' : '40px auto'};"
    >
      <ActionOptions bind:height="{optionsHeight}">
        <!-- {#if validAddress} -->
        <ActionBtn
          href="order~betalningsmetod"
          onClick="{$session.tokenExists && user ? submit : () => {
                stageDirection.set('right');
              }}"
          index="{0}"
          count="{4}"
        >
        Oui, continuer
        </ActionBtn>
        <!-- {/if} -->

        <ActionBtn
          href="order~ange-adress"
          primary="{false}"
          index="{1}"
          count="{4}"
          onClick="{() => stageDirection.set('top')}"
        >
          {validAddress ? 'Ändra' : 'Ange address'}
        </ActionBtn>

        <ActionBtn
          link="{false}"
          onClick="{() => {
            stageDirection.set('top');
            logout(() => {
              goto('order~vem');
            });
          }}"
          primary="{false}"
          index="{2}"
          count="{4}"
          icon="img/icon/arrow-l.svg"
        >
        Autre compte/client invité
        </ActionBtn>

        <ActionBtn
          href="varukorg"
          primary="{false}"
          index="{3}"
          count="{4}"
          onClick="{() => stageDirection.set('left')}"
          icon="img/icon/arrow-fast-l.svg"
        >
        Panier
        </ActionBtn>
      </ActionOptions>
    </div>
  {:else}
    <p in:fly="{$enter({ delay: 200 })}" out:fly="{$exit()}">
      Aucune adresse de livraison spécifiée
    </p>
  {/if}
  <StepNavSpace />
  <StepNavSpace />
</div>

<style>
  .stage-container {
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stage-title {
    justify-content: flex-start;
    margin: 0;
  }

  .address {
    margin-bottom: 20px;
    width: 100%;
    max-width: 600px;
  }

  .options-outer {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;
  }
</style>
