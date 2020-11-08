<script>
  export let address;
  const {
    firstName = '...',
    lastName = '...',
    street = '...',
    zip = '...',
    city = '...',
    notes = '...',
  } = address;

  export let title = null;
  export let titleAlign = 'left';
</script>

<div class="container">
  {#if title}
    <h3 class="table-title" style="text-align:{titleAlign};">{title}</h3>
  {/if}
  <p class="label">Namn</p>
  <p>{firstName} {lastName}</p>
  <p class="label">Adress</p>
  <div class="group">
    <p>{street}</p>
    <p>{zip} {city}</p>
  </div>
  <p class="label">Portkod/ <br />meddelande</p>
  <p class="notes">{notes !== '...' ? `"${notes}"` : '...'}</p>
</div>

<style>
  .container {
    width: 100%;
    /* max-width: 400px; */
    margin: 0 auto;
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 20px 10px;
  }

  .table-title {
    grid-column: 1/-1;
  }

  p,
  .group {
    grid-column: 2;
    margin: 0;
  }

  .label {
    grid-column: 1;
  }

  .notes {
    font-style: italic;
  }
</style>
