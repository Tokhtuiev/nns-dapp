<script lang="ts">
  import { getContext } from "svelte";
  import type { CanisterDetails } from "$lib/canisters/ic-management/ic-management.canister.types";
  import { i18n } from "$lib/stores/i18n";
  import {
    CANISTER_DETAILS_CONTEXT_KEY,
    type CanisterDetailsContext,
  } from "$lib/types/canister-detail.context";
  import CardInfo from "$lib/components/ui/CardInfo.svelte";
  import { Value } from "@dfinity/gix-components";
  import AddCanisterControllerButton from "./AddCanisterControllerButton.svelte";
  import RemoveCanisterControllerButton from "./RemoveCanisterControllerButton.svelte";

  const { store }: CanisterDetailsContext = getContext<CanisterDetailsContext>(
    CANISTER_DETAILS_CONTEXT_KEY
  );
  let canisterDetails: CanisterDetails | undefined;
  $: canisterDetails = $store.details;
  let controllers: string[];
  $: controllers = canisterDetails?.settings.controllers ?? [];
</script>

<CardInfo testId="canister-controllers-card">
  <h4 slot="start">{$i18n.canister_detail.controllers}</h4>
  <ul>
    {#each controllers as controller (controller)}
      <li>
        <Value>{controller}</Value>
        <RemoveCanisterControllerButton {controller} />
      </li>
    {/each}
  </ul>
  <div class="actions">
    <AddCanisterControllerButton />
  </div>
</CardInfo>

<style lang="scss">
  @use "@dfinity/gix-components/dist/styles/mixins/card";

  .actions {
    display: flex;
    justify-content: flex-end;
  }

  ul {
    @include card.list;
  }

  li {
    @include card.list-item;
  }
</style>
