
import { AccountScores } from './scoreAccounts';
import { convertTeamsToLookup, Team, Teams } from './teamHelpers';


export interface TeamScore {
  team: Team;
  weightedScore: number;
}

export interface TeamScores {
  [teamCode: string]: TeamScore;
}

const addAccountScoreToTeamScore = (teamScores: TeamScores, weightedScore: number, team: Team): TeamScore => {
  let teamScore = teamScores[team.code];
  if (!teamScore) {
    teamScores[team.code] = {
      team: team,
      weightedScore: 0
    }
    teamScore = teamScores[team.code]
  }

  teamScore.weightedScore += weightedScore;

  return teamScore;
}

const addAccountScoreToNullTeam = (teamScores: TeamScores, account: string, weightedScore: number, noTeamCode: string) => {
  const defaultNullTeam = {
    code: noTeamCode,
    name: "No Team",
    members: []
  }

  const teamScore = addAccountScoreToTeamScore(teamScores, weightedScore, defaultNullTeam);
  teamScore.team.members.push({account});
}

export const calculateTeamScores = (scores: AccountScores, teams: Teams, noTeamCode="0x0") => {
  const teamScores: TeamScores = {};
  const userToTeam = convertTeamsToLookup(teams);

  for (const [account, score] of Object.entries(scores)) {
    const team = userToTeam[account];
    const weightedScore = score.weightedScore;

    if (team) {
      addAccountScoreToTeamScore(teamScores, weightedScore, team);
    } else {
      addAccountScoreToNullTeam(teamScores, account, weightedScore, noTeamCode);
    }
  }

  return teamScores;
};
