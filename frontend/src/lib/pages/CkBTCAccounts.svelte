<script lang="ts">
  import { icrcAccountsStore } from "$lib/stores/icrc-accounts.store";
  import { syncCkBTCAccounts } from "$lib/services/ckbtc-accounts.services";
  import SkeletonCard from "$lib/components/ui/SkeletonCard.svelte";
  import AccountCard from "$lib/components/accounts/AccountCard.svelte";
  import { i18n } from "$lib/stores/i18n";
  import type { Account } from "$lib/types/account";
  import { hasAccounts } from "$lib/utils/accounts.utils";
  import type { UniverseCanisterId } from "$lib/types/universe";
  import { isNullish, nonNullish } from "@dfinity/utils";
  import { selectedCkBTCUniverseIdStore } from "$lib/derived/selected-universe.derived";
  import CkBTCWithdrawalAccount from "$lib/components/accounts/CkBTCWithdrawalAccount.svelte";
  import type { TokensStoreUniverseData } from "$lib/stores/tokens.store";
  import { ckBTCTokenStore } from "$lib/derived/universes-tokens.derived";
  import type { CkBTCAdditionalCanisters } from "$lib/types/ckbtc-canisters";
  import { CKBTC_ADDITIONAL_CANISTERS } from "$lib/constants/ckbtc-additional-canister-ids.constants";
  import { loadCkBTCInfo } from "$lib/services/ckbtc-info.services";
  import CkBTCBalancesObserver from "$lib/components/accounts/CkBTCBalancesObserver.svelte";

  export let goToWallet: (account: Account) => Promise<void>;

  let loading = false;

  const syncAccounts = async (
    selectedCkBTCUniverseId: UniverseCanisterId | undefined
  ) => {
    if (isNullish(selectedCkBTCUniverseId)) {
      return;
    }

    if (
      hasAccounts(
        $icrcAccountsStore[selectedCkBTCUniverseId.toText()]?.accounts ?? []
      )
    ) {
      // At the moment, we load only once the entire accounts per session.
      // If user performs related actions, accounts are updated.
      return;
    }

    loading = true;
    await syncCkBTCAccounts({ universeId: selectedCkBTCUniverseId });
    loading = false;
  };

  $: (async () => syncAccounts($selectedCkBTCUniverseIdStore))();

  let accounts: Account[] = [];
  $: accounts = nonNullish($selectedCkBTCUniverseIdStore)
    ? $icrcAccountsStore[$selectedCkBTCUniverseIdStore.toText()]?.accounts ?? []
    : [];

  let token: TokensStoreUniverseData | undefined = undefined;
  $: token = nonNullish($selectedCkBTCUniverseIdStore)
    ? $ckBTCTokenStore[$selectedCkBTCUniverseIdStore.toText()]
    : undefined;

  let canisters: CkBTCAdditionalCanisters | undefined = undefined;
  $: canisters = nonNullish($selectedCkBTCUniverseIdStore)
    ? CKBTC_ADDITIONAL_CANISTERS[$selectedCkBTCUniverseIdStore.toText()]
    : undefined;

  $: (async () =>
    await loadCkBTCInfo({
      universeId: $selectedCkBTCUniverseIdStore,
      minterCanisterId: canisters?.minterCanisterId,
    }))();
</script>

<div class="card-grid" data-tid="ckbtc-accounts-body">
  {#if loading}
    <SkeletonCard size="medium" />
  {:else if nonNullish($selectedCkBTCUniverseIdStore)}
    <CkBTCBalancesObserver
      {accounts}
      universeId={$selectedCkBTCUniverseIdStore}
    >
      {#each accounts as account}
        <AccountCard
          role="link"
          on:click={() => goToWallet(account)}
          hash
          {account}
          token={token?.token}
          >{account.name ?? $i18n.accounts.main}</AccountCard
        >
      {/each}

      <CkBTCWithdrawalAccount />
    </CkBTCBalancesObserver>
  {/if}
</div>
