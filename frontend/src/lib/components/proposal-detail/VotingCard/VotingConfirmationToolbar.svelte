<script lang="ts">
  import { Vote } from "@dfinity/nns";
  import { createEventDispatcher } from "svelte";
  import VoteConfirmationModal from "$lib/modals/proposals/VoteConfirmationModal.svelte";
  import { i18n } from "$lib/stores/i18n";
  import { selectedNeuronsVotingPower } from "$lib/utils/proposals.utils";
  import { Spinner, busy } from "@dfinity/gix-components";
  import type { VoteRegistrationStoreEntry } from "$lib/stores/vote-registration.store";
  import { votingNeuronSelectStore } from "$lib/stores/vote-registration.store";

  const dispatch = createEventDispatcher();

  export let voteRegistration: VoteRegistrationStoreEntry | undefined =
    undefined;

  let total: bigint;
  let disabled = true;
  let showConfirmationModal = false;
  let selectedVoteType: Vote = Vote.Yes;

  $: total = selectedNeuronsVotingPower({
    neurons: $votingNeuronSelectStore.neurons,
    selectedIds: $votingNeuronSelectStore.selectedIds,
  });
  $: disabled =
    $votingNeuronSelectStore.selectedIds.length === 0 ||
    $busy ||
    voteRegistration !== undefined;

  const showAdoptConfirmation = () => {
    selectedVoteType = Vote.Yes;
    showConfirmationModal = true;
  };
  const showRejectConfirmation = () => {
    selectedVoteType = Vote.No;
    showConfirmationModal = true;
  };
  const cancel = () => (showConfirmationModal = false);
  const confirm = () => {
    showConfirmationModal = false;
    dispatch("nnsConfirm", {
      voteType: selectedVoteType,
    });
  };
</script>

<div role="toolbar" data-tid="voting-confirmation-toolbar">
  <button
    data-tid="vote-yes"
    {disabled}
    on:click={showAdoptConfirmation}
    class="success"
  >
    {#if voteRegistration?.vote === Vote.Yes}
      <Spinner size="small" />
    {:else}
      {$i18n.proposal_detail__vote.adopt}
    {/if}
  </button>
  <button
    data-tid="vote-no"
    {disabled}
    on:click={showRejectConfirmation}
    class="danger"
  >
    {#if voteRegistration?.vote === Vote.No}
      <Spinner size="small" />
    {:else}
      {$i18n.proposal_detail__vote.reject}
    {/if}
  </button>
</div>

{#if showConfirmationModal}
  <VoteConfirmationModal
    on:nnsClose={cancel}
    on:nnsConfirm={confirm}
    voteType={selectedVoteType}
    votingPower={total}
  />
{/if}

<style lang="scss">
  @use "@dfinity/gix-components/dist/styles/mixins/media";

  [role="toolbar"] {
    display: flex;

    padding: var(--padding-2x) var(--padding-2x) 0;
    justify-content: center;
    gap: var(--padding-2x);

    @include media.min-width(large) {
      padding: 0;
      justify-content: flex-start;
      gap: var(--padding);
    }
  }

  button {
    min-width: calc(48px + (2 * var(--padding-2x)));
    width: calc(100% - (2 * var(--padding)));

    @include media.min-width(small) {
      width: inherit;
    }
  }
</style>
