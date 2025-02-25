/**
 * @jest-environment jsdom
 */

import { snsProjectSelectedStore } from "$lib/derived/sns/sns-selected-project.derived";
import {
  sortedSnsCFNeuronsStore,
  sortedSnsUserNeuronsStore,
} from "$lib/derived/sns/sns-sorted-neurons.derived";
import SnsNeurons from "$lib/pages/SnsNeurons.svelte";
import { syncSnsAccounts } from "$lib/services/sns-accounts.services";
import { syncSnsNeurons } from "$lib/services/sns-neurons.services";
import { authStore } from "$lib/stores/auth.store";
import { snsParametersStore } from "$lib/stores/sns-parameters.store";
import { snsQueryStore } from "$lib/stores/sns.store";
import { replacePlaceholders } from "$lib/utils/i18n.utils";
import { page } from "$mocks/$app/stores";
import { mockAuthStoreSubscribe } from "$tests/mocks/auth.store.mock";
import { mockStoreSubscribe } from "$tests/mocks/commont.mock";
import en from "$tests/mocks/i18n.mock";
import {
  buildMockSnsParametersStore,
  buildMockSortedSnsNeuronsStoreSubscribe,
  createMockSnsNeuron,
} from "$tests/mocks/sns-neurons.mock";
import { mockSnsFullProject } from "$tests/mocks/sns-projects.mock";
import { snsResponseFor } from "$tests/mocks/sns-response.mock";
import { rootCanisterIdMock } from "$tests/mocks/sns.api.mock";
import type { SnsNeuron } from "@dfinity/sns";
import { SnsSwapLifecycle } from "@dfinity/sns";
import { render, waitFor } from "@testing-library/svelte";

jest.mock("$lib/services/sns-neurons.services", () => {
  return {
    syncSnsNeurons: jest.fn().mockReturnValue(undefined),
  };
});

jest.mock("$lib/services/sns-accounts.services", () => {
  return {
    syncSnsAccounts: jest.fn().mockReturnValue(undefined),
  };
});

jest.mock("$lib/services/sns-parameters.services", () => {
  return {
    loadSnsParameters: jest.fn().mockResolvedValue(undefined),
  };
});

describe("SnsNeurons", () => {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  let authStoreMock: jest.MockedFunction<any>;

  beforeEach(() => {
    page.mock({ data: { universe: rootCanisterIdMock.toText() } });
    authStoreMock = jest
      .spyOn(authStore, "subscribe")
      .mockImplementation(mockAuthStoreSubscribe);

    snsQueryStore.setData(
      snsResponseFor({
        principal: rootCanisterIdMock,
        lifecycle: SnsSwapLifecycle.Committed,
      })
    );
  });

  afterEach(() => jest.clearAllMocks());

  describe("without neurons from CF", () => {
    beforeEach(() => {
      const neuron1 = createMockSnsNeuron({
        id: [1, 2, 3],
      });
      const neuron2 = createMockSnsNeuron({
        id: [1, 2, 4],
      });
      jest
        .spyOn(sortedSnsUserNeuronsStore, "subscribe")
        .mockImplementation(
          buildMockSortedSnsNeuronsStoreSubscribe([neuron1, neuron2])
        );
      jest
        .spyOn(sortedSnsCFNeuronsStore, "subscribe")
        .mockImplementation(buildMockSortedSnsNeuronsStoreSubscribe([]));
      jest
        .spyOn(snsParametersStore, "subscribe")
        .mockImplementation(buildMockSnsParametersStore());
    });

    afterEach(() => jest.clearAllMocks());

    it("should subscribe to store and call services to set up data", async () => {
      render(SnsNeurons);
      await waitFor(() => expect(authStoreMock).toHaveBeenCalled());
      await waitFor(() => expect(syncSnsAccounts).toBeCalled());
      await waitFor(() => expect(syncSnsNeurons).toBeCalled());
    });

    it("should render SnsNeuronCards for each neuron", async () => {
      const { queryAllByTestId } = render(SnsNeurons);

      await waitFor(() =>
        expect(queryAllByTestId("sns-neuron-card-title").length).toBe(2)
      );
    });

    it("should render one grids", async () => {
      const { container } = render(SnsNeurons);

      await waitFor(() =>
        expect(container.querySelectorAll(".card-grid").length).toBe(1)
      );
    });
  });

  describe("with neurons from CF", () => {
    beforeEach(() => {
      const neuron1 = createMockSnsNeuron({
        id: [1, 2, 3],
      });
      const neuron2: SnsNeuron = {
        ...createMockSnsNeuron({
          id: [1, 2, 4],
        }),
        source_nns_neuron_id: [BigInt(123)],
      };
      jest
        .spyOn(sortedSnsUserNeuronsStore, "subscribe")
        .mockImplementation(buildMockSortedSnsNeuronsStoreSubscribe([neuron1]));
      jest
        .spyOn(sortedSnsCFNeuronsStore, "subscribe")
        .mockImplementation(buildMockSortedSnsNeuronsStoreSubscribe([neuron2]));
    });

    afterEach(() => jest.clearAllMocks());

    it("should render SnsNeuronCards for each neuron", async () => {
      const { queryAllByTestId } = render(SnsNeurons);

      await waitFor(() =>
        expect(queryAllByTestId("sns-neuron-card-title").length).toBe(2)
      );
    });

    it("should render Community Fund title", async () => {
      const { queryByTestId } = render(SnsNeurons);

      await waitFor(() =>
        expect(queryByTestId("community-fund-title")).toBeInTheDocument()
      );
    });

    it("should render Community Fund neurons text", async () => {
      const { queryByTestId } = render(SnsNeurons);

      const div = document.createElement("div");
      div.innerHTML = en.sns_neuron_detail.community_fund_section_description;

      await waitFor(() =>
        expect(
          queryByTestId("community-fund-description").textContent.trim()
        ).toBe(div.textContent.trim())
      );
    });

    it("should render two grids", async () => {
      const { container } = render(SnsNeurons);

      await waitFor(() =>
        expect(container.querySelectorAll(".card-grid").length).toBe(2)
      );
    });
  });

  describe("with only neurons from CF", () => {
    beforeEach(() => {
      const neuron2: SnsNeuron = {
        ...createMockSnsNeuron({
          id: [1, 2, 4],
        }),
        source_nns_neuron_id: [BigInt(123)],
      };
      jest
        .spyOn(sortedSnsUserNeuronsStore, "subscribe")
        .mockImplementation(buildMockSortedSnsNeuronsStoreSubscribe([]));
      jest
        .spyOn(sortedSnsCFNeuronsStore, "subscribe")
        .mockImplementation(buildMockSortedSnsNeuronsStoreSubscribe([neuron2]));
    });

    afterEach(() => jest.clearAllMocks());

    it("should render Community Fund title", async () => {
      const { queryByTestId } = render(SnsNeurons);

      await waitFor(() =>
        expect(queryByTestId("community-fund-title")).toBeInTheDocument()
      );
    });

    it("should render one grid", async () => {
      const { container } = render(SnsNeurons);

      await waitFor(() =>
        expect(container.querySelectorAll(".card-grid").length).toBe(1)
      );
    });
  });

  describe("no neurons", () => {
    jest
      .spyOn(snsProjectSelectedStore, "subscribe")
      .mockImplementation(mockStoreSubscribe(mockSnsFullProject));

    beforeAll(() => {
      jest
        .spyOn(sortedSnsUserNeuronsStore, "subscribe")
        .mockImplementation(buildMockSortedSnsNeuronsStoreSubscribe([]));
      jest
        .spyOn(sortedSnsCFNeuronsStore, "subscribe")
        .mockImplementation(buildMockSortedSnsNeuronsStoreSubscribe([]));
    });

    afterAll(() => jest.clearAllMocks());

    it("should render empty text if no neurons", async () => {
      const { getByText } = render(SnsNeurons);

      const expectedText = replacePlaceholders(en.sns_neurons.text, {
        $project: mockSnsFullProject.summary.metadata.name,
      });

      await waitFor(() => expect(getByText(expectedText)).toBeInTheDocument());
    });
  });
});
