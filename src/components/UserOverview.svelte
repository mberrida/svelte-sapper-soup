<script>
  export let user = {
    firstName: '...',
    lastName: '...',
    email: '...',
  };

  export let title = null;
  export let alignTitle = 'left';
</script>

<div class="user-overview">
  {#if title}
    <h3 class="table-title" style="text-align:{alignTitle};">{title}</h3>
  {/if}
  <p class="label">Namn</p>
  <p>{user.firstName} {user.lastName}</p>
  <p class="label">Epost</p>
  <p class="email">{user.email}</p>
</div>

<style>
  .user-overview {
    width: 100%;
    /* max-width: 400px; */
    margin: 0 auto;
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 0px 10px;
  }

  .table-title {
    grid-column: 1 / -1;
  }

  p {
    grid-column: 2;
  }

  .label {
    grid-column: 1;
  }
</style>
