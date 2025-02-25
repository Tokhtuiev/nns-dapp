import { SECONDS_IN_HALF_YEAR } from "$lib/constants/constants";
import { enumValues } from "$lib/utils/enum.utils";
import { Topic } from "@dfinity/nns";
import { E8S_PER_ICP } from "./icp.constants";

export const MAX_NEURONS_MERGED = 2;
export const MIN_NEURON_STAKE = E8S_PER_ICP;
export const MAX_CONCURRENCY = 10;
export const SPAWN_VARIANCE_PERCENTAGE = 0.95;

export const DISSOLVE_DELAY_MULTIPLIER = 1;
export const AGE_MULTIPLIER = 0.25;
export const NNS_MINIMUM_DISSOLVE_DELAY_TO_VOTE = SECONDS_IN_HALF_YEAR;

const FIRST_TOPICS = [
  Topic.Unspecified,
  Topic.Governance,
  Topic.SnsAndCommunityFund,
];
const LAST_TOPICS = [Topic.ExchangeRate];
// This list should include ALL topics ordered as we want.
// Filtering out topics is done in the utils.
export const TOPICS_TO_FOLLOW_NNS = [
  ...FIRST_TOPICS,
  // We add all the topics that are not in the first or last topics
  ...enumValues(Topic).filter(
    (topic) => ![...FIRST_TOPICS, ...LAST_TOPICS].includes(topic)
  ),
  ...LAST_TOPICS,
];
