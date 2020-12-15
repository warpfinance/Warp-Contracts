import { Team } from '../../datapoints';
import { getLogger } from '../util';
import { AccountScores } from './scoreAccounts';
import { Teams } from './teamHelpers';

const logger = getLogger('Logic::scoreTeams');

export interface TeamScore {
    team: Team;
    tvl: number;
}

export interface TeamScores {
    [teamCode: string]: TeamScore;
}

export const calculateTeamScores = (scores: AccountScores, teams: Teams) => {};
