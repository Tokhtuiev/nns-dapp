<script lang="ts">
  import { i18n } from "$lib/stores/i18n";
  import { formatNumber } from "$lib/utils/format.utils";
  import ProposalContentCell from "./ProposalContentCell.svelte";

  export let yes: number;
  export let no: number;
  export let total: number;
</script>

<ProposalContentCell testId="votes-results-component">
  <h2 slot="start" class="title">{$i18n.proposal_detail.voting_results}</h2>
  <div class="latest-tally">
    <h4 class="label yes">
      {$i18n.proposal_detail.adopt}<span data-tid="adopt"
        >{formatNumber(yes)}</span
      >
    </h4>
    <div
      class="progressbar"
      role="progressbar"
      data-tid="votes-progressbar"
      aria-label={$i18n.proposal_detail__vote.vote_progress}
      aria-valuenow={yes}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <div class="progressbar-value" style="width: {(yes / total) * 100}%" />
    </div>
    <h4 class="label no">
      {$i18n.proposal_detail.reject}<span data-tid="reject"
        >{formatNumber(no)}</span
      >
    </h4>
  </div>
</ProposalContentCell>

<style lang="scss">
  @use "@dfinity/gix-components/dist/styles/mixins/media";

  .latest-tally {
    display: grid;

    grid-template-columns: 110px 1fr 110px;
    align-items: center;
    height: var(--header-height);

    @include media.min-width(medium) {
      grid-template-columns: 130px 1fr 130px;
    }

    h4 {
      line-height: var(--line-height-standard);
      text-align: center;

      &.yes {
        color: var(--positive-emphasis);
      }

      &.no {
        color: var(--negative-emphasis);
      }

      span {
        display: block;
        text-align: center;
        font-size: var(--font-size-small);
        font-weight: initial;

        @include media.min-width(medium) {
          font-size: var(--font-size-h5);
        }
      }
    }

    .progressbar {
      position: relative;
      height: 10px;
      background: var(--negative-emphasis);

      border-radius: var(--border-radius);
      overflow: hidden;

      .progressbar-value {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;

        // TODO(L2-931): delete legacy style
        --positive-emphasis-gradient: linear-gradient(
          99.27deg,
          var(--positive-emphasis) -0.11%,
          #026500 100.63%
        );
        --positive-emphasis-gradient-fallback: var(--positive-emphasis);
        --positive-emphasis-gradient-contrast: var(
          --positive-emphasis-contrast
        );

        background: var(--positive-emphasis-gradient-fallback);
        background: var(--positive-emphasis-gradient);
      }
    }
  }

  .title {
    padding-bottom: var(--padding);
  }
</style>
