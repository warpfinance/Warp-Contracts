import { AccountDataPoints, AccountScoreData } from '../lib/logic/dataHelpers';
import { calculateAccountScores } from '../lib/logic/scoreAccounts';

const addTVLDataPoint = (userScores: AccountDataPoints, block: number, tvl: number) => {
  userScores[block] = {
    tvl: {
      tvl,
      sc: tvl,
      lp: 0,
    },
  };
};

describe('calculateAccountScores', () => {
  test('tvl is added before start of competition', () => {
    const testData: AccountScoreData = {};
    const startBlock = 5;
    const competitionStart = 10;
    const endBlock = 100;

    const user0 = 'kat';
    const user0ExpectedScore = 1000;
    const user0Scores: AccountDataPoints = {};
    addTVLDataPoint(user0Scores, startBlock, user0ExpectedScore);
    testData[user0] = user0Scores;

    const accountScores = calculateAccountScores(testData, competitionStart, endBlock);
    expect(accountScores[user0].weightedScore).toEqual(user0ExpectedScore);
  });

  test('tvl is added midway through', () => {
    const testData: AccountScoreData = {};
    const competitionStart = 0;
    const endBlock = 10;

    const user0 = 'kat';
    const user0ExpectedScore = 500;

    const user0Scores: AccountDataPoints = {};
    addTVLDataPoint(user0Scores, competitionStart + (endBlock - competitionStart) / 2, user0ExpectedScore * 2);
    testData[user0] = user0Scores;

    const accountScores = calculateAccountScores(testData, competitionStart, endBlock);
    expect(accountScores[user0].weightedScore).toEqual(user0ExpectedScore);
  });

  test("tvl doesn't count past the end", () => {
    const testData: AccountScoreData = {};
    const startBlock = 5;
    const competitionStart = 10;
    const endBlock = 100;

    const user0 = 'kat';
    const user0ExpectedScore = 1000;
    const user0Scores: AccountDataPoints = {};
    addTVLDataPoint(user0Scores, startBlock, user0ExpectedScore);
    addTVLDataPoint(user0Scores, endBlock + 1, user0ExpectedScore * 2);
    testData[user0] = user0Scores;

    const accountScores = calculateAccountScores(testData, competitionStart, endBlock);
    expect(accountScores[user0].weightedScore).toEqual(user0ExpectedScore);
  });

  test('tvl changes midway through', () => {
    const testData: AccountScoreData = {};
    const startBlock = 5;
    const competitionStart = 10;
    const endBlock = 100;
    const midway = competitionStart + (endBlock - competitionStart) / 2;

    const user0 = 'kat';

    const user0startScore = 1000;
    const user0midScore = 2000;

    const user0ExpectedScore = user0startScore * 0.5 + user0midScore * 0.5;

    const user0Scores: AccountDataPoints = {};
    addTVLDataPoint(user0Scores, startBlock, user0startScore);
    addTVLDataPoint(user0Scores, midway, user0midScore);
    testData[user0] = user0Scores;

    const accountScores = calculateAccountScores(testData, competitionStart, endBlock);
    expect(accountScores[user0].weightedScore).toEqual(user0ExpectedScore);
  });

  test('tvl added midway through', () => {
    const testData: AccountScoreData = {};

    const competitionStart = 10;
    const endBlock = 100;
    const midway = competitionStart + (endBlock - competitionStart) / 2;

    const user0 = 'kat';

    const user0midScore = 2000;

    const user0ExpectedScore = user0midScore * 0.5;

    const user0Scores: AccountDataPoints = {};
    addTVLDataPoint(user0Scores, midway, user0midScore);
    testData[user0] = user0Scores;

    const accountScores = calculateAccountScores(testData, competitionStart, endBlock);
    expect(accountScores[user0].weightedScore).toEqual(user0ExpectedScore);
  });

  test('tvl added after competition', () => {
    const testData: AccountScoreData = {};

    const competitionStart = 10;
    const endBlock = 100;

    const user0 = 'kat';

    const user0ExpectedScore = 0;

    const user0Scores: AccountDataPoints = {};
    addTVLDataPoint(user0Scores, endBlock + 1, 1000);
    testData[user0] = user0Scores;

    const accountScores = calculateAccountScores(testData, competitionStart, endBlock);
    expect(accountScores[user0].weightedScore).toEqual(user0ExpectedScore);
  });

  test('tvl added at start then removed midway through', () => {
    const testData: AccountScoreData = {};

    const startBlock = 2;
    const competitionStart = 10;
    const endBlock = 100;
    const midway = competitionStart + (endBlock - competitionStart) / 2;

    const user0 = 'kat';

    const user0startScore = 10000;
    const user0midScore = 0;

    const user0ExpectedScore = user0startScore * 0.5;

    const user0Scores: AccountDataPoints = {};
    addTVLDataPoint(user0Scores, startBlock, user0startScore);
    addTVLDataPoint(user0Scores, midway, user0midScore);
    testData[user0] = user0Scores;

    const accountScores = calculateAccountScores(testData, competitionStart, endBlock);
    expect(accountScores[user0].weightedScore).toEqual(user0ExpectedScore);
  });
});
