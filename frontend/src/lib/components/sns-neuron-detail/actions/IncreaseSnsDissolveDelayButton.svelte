<script lang="ts">
  import { i18n } from "$lib/stores/i18n";
  import { openSnsNeuronModal } from "$lib/utils/modals.utils";
  import { isVesting } from "$lib/utils/sns-neuron.utils";
  import type { SnsNeuron } from "@dfinity/sns";
  import VestingTooltipWrapper from "../VestingTooltipWrapper.svelte";

  export let neuron: SnsNeuron;
</script>

<VestingTooltipWrapper {neuron}>
  <button
    class="primary"
    disabled={isVesting(neuron)}
    data-tid="sns-increase-dissolve-delay"
    on:click={() => openSnsNeuronModal({ type: "increase-dissolve-delay" })}
    >{$i18n.neuron_detail.increase_dissolve_delay}</button
  >
</VestingTooltipWrapper>
