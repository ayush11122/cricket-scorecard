// types.ts
export type ScoringValues = {
    extra: boolean;
    noball: number;
    wide: number;
    legbye: number;
    bye: number;
    overthrow: number;
    runs: number;
    wicket: number;
    striker: string;
    nonStriker: string;
    bowler: string;
  };
  
  export type Player = {
    _id: string;
    name: string;
    out: string;
    runs: number;
    ballFaced: number;
    runConceeded: number;
    overBowled: number;
    wicketTaken: number;
  };
  
  export type Team = {
    _id: string;
    name: string;
    players: Player[];
  };
  
  export type Inning = {
    extra: {
      Wide: number;
      NoBall: number;
      Dot: number;
      LegBye: number;
      Bye: number;
      OverThrow: number;
    };
    totalRun: number;
    totalWicket: number;
    totalOver: number;
    totalBall: number;
  };
  
  export type MatchDetails = {
    inning1: Inning;
    inning2: Inning;
    _id: string;
    team1: string;
    team2: string;
    createdAt: string;
  };
  
  export type ScorecardData = {
    matchdetails: MatchDetails[];
    teamdetails: Team[];
    teamdetails2: Team[];
  };