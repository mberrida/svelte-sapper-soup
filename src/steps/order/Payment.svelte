<script>
  import { goto, stores } from '@sapper/app';
  import { hasEmptyFields, timeStamp, clone } from '../../utils/helpers';
  import {
    currentAddress,
    currentCard,
    cartSoups,
    cartSides,
    cartDrinks,
    cartMeta,
    emptyCart,
    delivered,
    stageDirection,
    currentUser,
    tempConfirmationCart,
  } from '../../store';
  import CardForm from '../../components/CardForm.svelte';
  import ActionOptions from '../../components/ActionOptions.svelte';
  import ActionBtn from '../../components/ActionBtn.svelte';
  import StepNavSpace from '../../components/StepNavSpace.svelte';
  import { orderStages } from '../../constants/preset';

  const { session } = stores();
  export let user;
  export let fly;
  export let enter;
  export let exit;

  let submitting = false,
    error = null,
    msg = '',
    optionsHeight;

  const updateOrder = async (order) => {
    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'updateOrder',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    const res = await fetched.json();

    // console.log('update user res status', res.status);

    if (res.status === 200) {
      // temp-save cartItems (for non-members)
      tempConfirmationCart.set(order);
      console.log('set tempCart', $tempConfirmationCart);

      // console.log('Order-status uppdaterad i DB');
      stageDirection.set('right');
      goto('kvitto');

      // empty cart
      setTimeout(() => emptyCart, 3000);
    }

    error = res.error;
    msg = res.msg || 'Ordern kunde inte tas emot';
    return;
  };

  const submit = async () => {
    console.log('Processing payment...');
    error = null;
    msg = null;
    submitting = true;

    if (hasEmptyFields($currentCard)) {
      error = 'Input fail';
      msg = 'Du måste fylla i alla fält';
      return console.log(error, msg);
    }

    if (!$currentAddress.street) {
      error = 'Input fail';
      msg = 'No current address provided.';
      return console.log(error, msg);
    }
    /* if (!user) {
      error = 'Input fail';
      msg = 'No user found in session';
      return console.log(error, msg);
    } */

    const items = {
      soups: $cartSoups,
      sides: $cartSides,
      drinks: $cartDrinks,
      meta: $cartMeta,
      created: timeStamp(),
      updated: timeStamp(),
    };

    let orderUser = { ...$currentUser, id: 'guest' };
    if (user) orderUser.id = user.id;

    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'newOrder',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        address: $currentAddress,
        paymentMethod: 'card',
        user: orderUser,
      }),
    });

    const res = await fetched.json();

    // console.log('new order res status', res.status);

    if (res.status === 200) {
      $session.user = res.user;
      msg = 'Köpet lyckades!';

      delivered.set(false);

      const newOrder = { ...res.order, status: orderStages[1] };

      updateOrder(newOrder);
    } else {
      error = res.error;

      msg = 'Något gick fel';

      submitting = false;

      console.error('login error', error, res.msg);
    }
  };
</script>

<div
  class="stage-container payment"
  in:fly="{$enter({ delay: 400 })}"
  out:fly="{$exit()}"
>
  <h1>Kortbetalning</h1>
  <h2>Att betala: {$cartMeta.price.total}kr</h2>
  {#if submitting}
    <p>Bearbetar betalning...</p>
  {:else}
    <div
      class="form-container"
      in:fly="{$enter({ delay: 400 })}"
      out:fly="{$exit()}"
    >
      <CardForm onSubmit="{submit}" />
    </div>

    {#if error || msg}
      <p class="info error">{msg || error}</p>
    {/if}
  {/if}

  <div class="options-container">
    <ActionOptions bind:height="{optionsHeight}">
      <ActionBtn
        href="order~betalningsmetod"
        onClick="{() => {
          stageDirection.set('left');
        }}"
        primary="{false}"
        index="{0}"
        count="{2}"
        icon="img/icon/arrow-l.svg"
      >
        Betalningsmetod
      </ActionBtn>

      <ActionBtn
        href="varukorg"
        onClick="{() => {
          stageDirection.set('left');
        }}"
        primary="{false}"
        index="{1}"
        count="{2}"
        icon="img/icon/arrow-fast-l.svg"
      >
        Varukorgen
      </ActionBtn>
    </ActionOptions>

    <StepNavSpace />
  </div>
</div>

<style>
  .stage-container {
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;
  }

  .form-container {
    width: 100%;
  }

  .options-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    min-height: 150px;
  }
</style>
