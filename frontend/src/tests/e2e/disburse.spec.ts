import { AppPo } from "$tests/page-objects/App.page-object";
import { PlaywrightPageObjectElement } from "$tests/page-objects/playwright.page-object";
import { signInWithNewUser, step } from "$tests/utils/e2e.test-utils";
import { expect, test } from "@playwright/test";

test("Test disburse neuron", async ({ page, context }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("NNS Dapp");
  await signInWithNewUser({ page, context });

  const pageElement = PlaywrightPageObjectElement.fromPage(page);
  const appPo = new AppPo(pageElement);

  step("Get some ICP");
  // We need an account before we can get ICP.
  await appPo
    .getAccountsPo()
    .getNnsAccountsPo()
    .getMainAccountCardPo()
    .waitFor();
  await appPo.getTokens(10);

  step("Go to the neurons tab");
  await appPo.goToNeurons();

  step("Stake a neuron");
  const stake = 3;
  await appPo
    .getNeuronsPo()
    .getNnsNeuronsFooterPo()
    .stakeNeuron({ amount: stake, dissolveDelayDays: 0 });

  step("Check account balance before disburse");
  await appPo.goToAccounts();
  const mainAccountBalanceBeforeDisburse = Number(
    await appPo
      .getAccountsPo()
      .getNnsAccountsPo()
      .getMainAccountCardPo()
      .getBalance()
  );

  step("Open the neuron details");
  await appPo.goToNeurons();
  const neuronCards = await appPo
    .getNeuronsPo()
    .getNnsNeuronsPo()
    .getNeuronCardPos();
  expect(neuronCards.length).toBe(1);
  neuronCards[0].click();

  step("Disburse the neuron");
  await appPo.getNeuronDetailPo().getNnsNeuronDetailPo().disburseNeuron();

  step("Check account balance after disburse");
  await appPo.goToAccounts();
  const mainAccountBalanceAfterDisburse = Number(
    await appPo
      .getAccountsPo()
      .getNnsAccountsPo()
      .getMainAccountCardPo()
      .getBalance()
  );

  // Actually there is a difference equal to the transaction fee, but it's
  // rounded away in the UI.
  expect(mainAccountBalanceAfterDisburse).toBe(
    mainAccountBalanceBeforeDisburse + stake
  );
});
