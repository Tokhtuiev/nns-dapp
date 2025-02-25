/**
 * @jest-environment jsdom
 */

import NnsSelectAccount from "$lib/components/accounts/NnsSelectAccount.svelte";
import { accountsStore } from "$lib/stores/accounts.store";
import {
  mockAccountsStoreSubscribe,
  mockHardwareWalletAccount,
  mockMainAccount,
  mockSubAccount,
} from "$tests/mocks/accounts.store.mock";
import en from "$tests/mocks/i18n.mock";
import { render, waitFor } from "@testing-library/svelte";

describe("NnsSelectAccount", () => {
  beforeEach(() => {
    accountsStore.resetForTesting();
  });

  it("should render a skeleton-card until accounts loaded", () => {
    const { container } = render(NnsSelectAccount);

    expect(
      container.querySelector('[data-tid="skeleton-card"]')
    ).toBeInTheDocument();
  });

  it("should render list of accounts once loaded", () => {
    jest
      .spyOn(accountsStore, "subscribe")
      .mockImplementation(mockAccountsStoreSubscribe());

    const { getByText } = render(NnsSelectAccount);

    expect(
      getByText(mockMainAccount.identifier, { exact: false })
    ).toBeInTheDocument();

    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should not render hardware wallets when prop hideHardwareWalletAccounts is true", () => {
    jest
      .spyOn(accountsStore, "subscribe")
      .mockImplementation(
        mockAccountsStoreSubscribe([], [mockHardwareWalletAccount])
      );

    const { queryByText } = render(NnsSelectAccount, {
      props: { hideHardwareWalletAccounts: true },
    });

    expect(
      queryByText(mockHardwareWalletAccount.name as string, { exact: false })
    ).toBeNull();

    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should render no title per default", () => {
    const { queryByText } = render(NnsSelectAccount);

    expect(queryByText(en.accounts.my_accounts)).not.toBeInTheDocument();
  });

  it("should render a title with subaccount", async () => {
    accountsStore.setForTesting({
      main: mockMainAccount,
      subAccounts: [mockSubAccount],
      hardwareWallets: undefined,
    });

    const { queryByText } = render(NnsSelectAccount, {
      props: {
        displayTitle: true,
      },
    });

    await waitFor(() =>
      expect(queryByText(en.accounts.my_accounts)).toBeInTheDocument()
    );
  });

  it("should render a title with hardware wallet", async () => {
    accountsStore.setForTesting({
      main: mockMainAccount,
      subAccounts: undefined,
      hardwareWallets: [mockSubAccount],
    });

    const { queryByText } = render(NnsSelectAccount, {
      props: {
        displayTitle: true,
      },
    });

    await waitFor(() =>
      expect(queryByText(en.accounts.my_accounts)).toBeInTheDocument()
    );
  });

  it("should not render a title with hardware wallet if these kind of accounts should be hidden", async () => {
    accountsStore.setForTesting({
      main: mockMainAccount,
      subAccounts: undefined,
      hardwareWallets: [mockSubAccount],
    });

    const { queryByText } = render(NnsSelectAccount, {
      props: {
        displayTitle: true,
        hideHardwareWalletAccounts: true,
      },
    });

    expect(queryByText(en.accounts.my_accounts)).not.toBeInTheDocument();
  });

  it("should render no title if no accounts listed", async () => {
    accountsStore.setForTesting({
      main: mockMainAccount,
      subAccounts: undefined,
      hardwareWallets: undefined,
    });

    const { queryByText } = render(NnsSelectAccount, {
      props: {
        displayTitle: true,
      },
    });

    expect(queryByText(en.accounts.my_accounts)).not.toBeInTheDocument();
  });

  it("should filter an account for a given identifier", () => {
    jest
      .spyOn(accountsStore, "subscribe")
      .mockImplementation(mockAccountsStoreSubscribe());

    const { getByText } = render(NnsSelectAccount, {
      props: {
        filterIdentifier: mockMainAccount.identifier,
      },
    });

    expect(() =>
      getByText(mockMainAccount.identifier, { exact: false })
    ).toThrow();
  });
});
