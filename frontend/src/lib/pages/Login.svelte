<script lang="ts">
  import { authStore } from "$lib/stores/auth.store";
  import type { AuthStoreData } from "$lib/stores/auth.store";
  import { isSignedIn } from "$lib/utils/auth.utils";
  import { OWN_CANISTER_ID_TEXT } from "$lib/constants/canister-ids.constants";
  import SignIn from "$lib/components/common/SignIn.svelte";
  import { buildAccountsUrl } from "$lib/utils/navigation.utils";
  import { goto } from "$app/navigation";
  import LoginLinks from "$lib/components/login/LoginLinks.svelte";
  import LoginTitle from "$lib/components/login/LoginTitle.svelte";

  const redirectWhenSignedIn = async ({
    identity,
  }: AuthStoreData): Promise<void> => {
    if (!isSignedIn(identity)) {
      return;
    }

    await goto(buildAccountsUrl({ universe: OWN_CANISTER_ID_TEXT }), {
      replaceState: true,
    });
  };

  $: redirectWhenSignedIn($authStore);
</script>

<LoginTitle />

<LoginLinks />

<div class="sign-in">
  <div class="sign-in-container">
    <SignIn />
  </div>
</div>

<style lang="scss">
  @use "@dfinity/gix-components/dist/styles/mixins/media";
  @use "@dfinity/gix-components/dist/styles/mixins/fonts";
  @use "../themes/mixins/login";

  .sign-in {
    width: 100%;
    @include login.hero-max-width;
    align-self: center;

    padding: var(--padding-3x) 0;
    margin: 0;

    :global(button) {
      width: 100%;
      padding: var(--padding) var(--padding-4x);
    }

    @include media.min-width(medium) {
      width: auto;
    }

    @include media.min-width(large) {
      padding: 0 0 var(--padding-3x);
    }

    @include login.min-size(xlarge) {
      padding: var(--padding-3x) 0;
      margin: var(--padding) 0 0;
    }
  }

  .sign-in-container {
    box-shadow: 0 0 70px rgba(255, 255, 255, 0.3);
    border-radius: var(--border-radius);
  }

  @include media.light-theme {
    .sign-in-container {
      box-shadow: 0 0 70px rgba(255, 255, 255, 0.7);
    }
  }
</style>
