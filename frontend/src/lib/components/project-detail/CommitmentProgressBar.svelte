<script lang="ts">
  import { TokenAmount, ICPToken } from "@dfinity/utils";
  import { i18n } from "$lib/stores/i18n";
  import AmountDisplay from "../ic/AmountDisplay.svelte";
  import { ProgressBar } from "@dfinity/gix-components";

  export let max: bigint;
  export let value: bigint;
  export let minimumIndicator: bigint | undefined = undefined;

  let width: number | undefined;
  let minIndicatorPosition: number | undefined;
  $: minIndicatorPosition =
    minimumIndicator !== undefined && width !== undefined
      ? (Number(minimumIndicator) / Number(max)) * width
      : undefined;
</script>

<ProgressBar max={Number(max)} value={Number(value)} color="warning">
  <div class="info" slot="top">
    <p class="right">
      <span>
        {$i18n.sns_project_detail.max_commitment_goal}
      </span>

      <span data-tid="commitment-max-indicator-value">
        <AmountDisplay
          amount={TokenAmount.fromE8s({ amount: max, token: ICPToken })}
          singleLine
        />
      </span>
    </p>
    <div class="indicator-wrapper">
      <span
        class="max-indicator triangle down"
        data-tid="commitment-max-indicator"
      />
    </div>
  </div>
  <div class="info" bind:clientWidth={width} slot="bottom">
    {#if minimumIndicator !== undefined}
      <div class="indicator-wrapper">
        <span
          class="min-indicator triangle up"
          data-tid="commitment-min-indicator"
          style={`left: calc(${minIndicatorPosition}px - var(--padding));`}
        />
      </div>
      <p>
        <span>
          {$i18n.sns_project_detail.min_commitment_goal}
        </span>
        <!-- TODO: Move with indicator https://dfinity.atlassian.net/browse/L2-768 -->
        <span data-tid="commitment-min-indicator-value">
          <AmountDisplay
            amount={TokenAmount.fromE8s({
              amount: minimumIndicator,
              token: ICPToken,
            })}
            singleLine
          />
        </span>
      </p>
    {/if}
  </div>
</ProgressBar>

<style lang="scss">
  p {
    margin: 0;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--padding-0_5x);
  }

  .right {
    text-align: right;
  }

  .indicator-wrapper {
    height: var(--padding-1_5x);

    position: relative;
  }

  .triangle {
    --triangle-side: var(--padding) solid transparent;

    display: block;

    width: 0;
    height: 0;
    border-left: var(--triangle-side);
    border-right: var(--triangle-side);

    &.up {
      // Borders do not support gradients
      border-bottom: var(--padding-1_5x) solid var(--warning-emphasis);
    }

    &.down {
      // Borders do not support gradients
      border-top: var(--padding-1_5x) solid var(--primary-gradient-fallback);
    }
  }

  .max-indicator {
    position: absolute;
    right: calc(var(--padding) * -1);
  }

  .min-indicator {
    position: absolute;
    left: 0;
  }
</style>
