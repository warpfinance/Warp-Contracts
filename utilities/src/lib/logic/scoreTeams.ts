
import { AccountScores } from './scoreAccounts';
import { convertTeamsToLookup, Team, TeamMember, Teams } from './teamHelpers';

interface ScoredTeamMember extends TeamMember {
  weightedScore: number;
}

interface ScoredTeam extends Team {
  members: ScoredTeamMember[];
}

export interface TeamScore {
  team: ScoredTeam;
  weightedScore: number;
}

export interface TeamScores {
  [teamCode: string]: TeamScore;
}

const addAccountScoreToTeamScore = (teamScores: TeamScores, account: string, weightedScore: number, team: Team): TeamScore => {
  let teamScore = teamScores[team.code];
  if (!teamScore) {
    teamScores[team.code] = {
      team: {
        code: team.code,
        name: team.name,
        members: []
      },
      weightedScore: 0
    }
    teamScore = teamScores[team.code]
  }

  teamScore.team.members.push({
    account,
    weightedScore
  });

  teamScore.weightedScore += weightedScore;

  return teamScore;
}

const addAccountScoreToNullTeam = (teamScores: TeamScores, account: string, weightedScore: number, noTeamCode: string) => {
  const defaultNullTeam = {
    code: noTeamCode,
    name: "No Team",
    members: []
  }

  const teamScore = addAccountScoreToTeamScore(teamScores, account, weightedScore, defaultNullTeam);
  teamScore.team.members.push({account, weightedScore});
}

export const calculateTeamScores = (scores: AccountScores, teams: Teams, noTeamCode="0x0") => {
  const teamScores: TeamScores = {};
  const userToTeam = convertTeamsToLookup(teams);

  for (const [account, score] of Object.entries(scores)) {
    const team = userToTeam[account];
    const weightedScore = score.weightedScore;

    if (team) {
      addAccountScoreToTeamScore(teamScores, account, weightedScore, team);
    } else {
      addAccountScoreToNullTeam(teamScores, account, weightedScore, noTeamCode);
    }
  }

  // Sort team members based on score
  for (const teamScore of Object.values(teamScores)) {
    teamScore.team.members = teamScore.team.members.sort((a: ScoredTeamMember, b: ScoredTeamMember) => {
      return b.weightedScore - a.weightedScore;
    });
  }

  return teamScores;
};
