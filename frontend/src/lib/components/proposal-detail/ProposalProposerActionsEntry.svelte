<script lang="ts">
  import Json from "../common/Json.svelte";

  export let actionKey: string | undefined;
  export let actionData: unknown | undefined;
</script>

<div
  class="content-cell-island"
  data-tid="proposal-proposer-actions-entry-component"
>
  <h2
    class="content-cell-title"
    data-tid="proposal-proposer-actions-entry-title"
  >
    {actionKey ?? ""}
  </h2>

  <div
    class="content-cell-details"
    data-tid="proposal-proposer-actions-entry-fields"
  >
    <Json json={actionData} />
  </div>
</div>

<style lang="scss">
  .content-cell-details {
    overflow-x: auto;
    // get rid of vertical scroll
    padding-bottom: 1px;
  }
</style>
