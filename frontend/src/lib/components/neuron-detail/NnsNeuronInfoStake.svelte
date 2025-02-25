<script lang="ts">
  import TestIdWrapper from "$lib/components/common/TestIdWrapper.svelte";
  import NnsNeuronAmount from "$lib/components/neurons/NnsNeuronAmount.svelte";
  import type { NeuronInfo } from "@dfinity/nns";
  import { KeyValuePair } from "@dfinity/gix-components";
  import { i18n } from "$lib/stores/i18n";
  import { NeuronState } from "@dfinity/nns";
  import IncreaseDissolveDelayButton from "./actions/IncreaseDissolveDelayButton.svelte";
  import NnsIncreaseStakeButton from "./actions/NnsIncreaseStakeButton.svelte";
  import DissolveActionButton from "./actions/DissolveActionButton.svelte";
  import DisburseButton from "./actions/DisburseButton.svelte";
  import {
    isHotKeyControllable,
    isNeuronControllable,
  } from "$lib/utils/neuron.utils";
  import { accountsStore } from "$lib/stores/accounts.store";
  import { authStore } from "$lib/stores/auth.store";
  import Separator from "$lib/components/ui/Separator.svelte";

  export let neuron: NeuronInfo;

  let isControllable: boolean;
  $: isControllable = isNeuronControllable({
    neuron,
    identity: $authStore.identity,
    accounts: $accountsStore,
  });

  let hotkeyControlled: boolean;
  $: hotkeyControlled = isHotKeyControllable({
    neuron,
    identity: $authStore.identity,
  });
</script>

<TestIdWrapper testId="nns-neuron-info-stake-component">
  <KeyValuePair>
    <h3 slot="key">{$i18n.neurons.ic_stake}</h3>
    <NnsNeuronAmount {neuron} slot="value" />
  </KeyValuePair>

  <div class="buttons">
    {#if isControllable}
      <IncreaseDissolveDelayButton />
    {/if}

    {#if isControllable || hotkeyControlled}
      <NnsIncreaseStakeButton />
    {/if}

    {#if isControllable}
      {#if neuron.state === NeuronState.Dissolved}
        <DisburseButton />
      {:else if neuron.state === NeuronState.Dissolving || neuron.state === NeuronState.Locked}
        <DissolveActionButton neuronState={neuron.state} />
      {/if}
    {/if}
  </div>

  <Separator />
</TestIdWrapper>

<style lang="scss">
  @use "../../themes/mixins/section";

  .buttons {
    @include section.actions;
  }
</style>
