import { FETCH_ROOT_KEY, HOST } from "$lib/constants/environment.constants";
import { initCyclesWorker } from "$lib/services/worker-cycles.services";
import { mockCanisterId } from "$tests/mocks/canisters.mock";

jest.mock("$lib/workers/cycles.worker?worker");

describe("initCyclesWorker", () => {
  const postMessage = jest.fn();
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await import("$lib/workers/cycles.worker?worker");
    module.default = jest.fn().mockReturnValue({
      postMessage,
    });
  });

  it("starting sends post message with host and fetchRootKey", async () => {
    const cyclesWorker = initCyclesWorker();

    const callback = jest.fn();

    (await cyclesWorker).startCyclesTimer({
      callback,
      canisterId: mockCanisterId.toText(),
    });

    expect(postMessage).toBeCalledWith({
      msg: "nnsStartCyclesTimer",
      data: {
        canisterId: mockCanisterId.toText(),
        host: HOST,
        fetchRootKey: FETCH_ROOT_KEY,
      },
    });
  });
});
