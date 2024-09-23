import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

type Player = {
  _id: string;
  name: string;
  out: string;
  runs: number;
  ballFaced: number;
  runConceeded: number;
  overBowled: number;
  wicketTaken: number;
};

type Team = {
  _id: string;
  name: string;
  players: Player[];
};

type Inning = {
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

type MatchDetails = {
  inning1: Inning;
  inning2: Inning;
  _id: string;
  team1: string;
  team2: string;
  createdAt: string;
};

type ScorecardData = {
  matchdetails: MatchDetails[];
  teamdetails: Team[];
  teamdetails2: Team[];
};

type ScoringValues = {
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

type CricketContextType = {
  scorecardData: ScorecardData | null;
  setScorecardData: React.Dispatch<React.SetStateAction<ScorecardData | null>>;
  val: ScoringValues;
  setVal: React.Dispatch<React.SetStateAction<ScoringValues>>;
  currentInning: 'inning1' | 'inning2';
  setCurrentInning: React.Dispatch<React.SetStateAction<'inning1' | 'inning2'>>;
  lastDeliveries: string[];
  setLastDeliveries: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchScorecardData: () => Promise<void>;
  submitScore: () => Promise<void>;
};

const CricketContext = createContext<CricketContextType | undefined>(undefined);

export const useCricketContext = () => {
  const context = useContext(CricketContext);
  if (!context) {
    throw new Error('useCricketContext must be used within a CricketProvider');
  }
  return context;
};

export const CricketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scorecardData, setScorecardData] = useState<ScorecardData | null>(null);
  const [val, setVal] = useState<ScoringValues>({
    extra: false,
    noball: 0,
    wide: 0,
    legbye: 0,
    bye: 0,
    overthrow: 0,
    runs: 0,
    wicket: 0,
    striker: '',
    nonStriker: '',
    bowler: ''
  });
  const [currentInning, setCurrentInning] = useState<'inning1' | 'inning2'>('inning1');
  const [lastDeliveries, setLastDeliveries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScorecardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/v1/matches/view');
      setScorecardData(response.data);
      setLoading(false);
      
      if (response.data.matchdetails[0].inning1.totalWicket === 10 || 
          (response.data.matchdetails[0].inning1.totalOver === 20 && 
           response.data.matchdetails[0].inning1.totalBall === 0)) {
        setCurrentInning('inning2');
      }
    } catch (err) {
      setError('Failed to fetch scorecard data');
      setLoading(false);
    }
  };

  const submitScore = async () => {
    if (!scorecardData) return;

    const payload = {
      ...val,
      extra: val.noball > 0 || val.wide > 0 || val.legbye > 0 || val.bye > 0 || val.overthrow > 0
    };

    // Optimistic update
    const updatedScorecardData = { ...scorecardData };
    const currentInningData = updatedScorecardData.matchdetails[0][currentInning];
    
    currentInningData.totalRun += val.runs + val.overthrow + val.legbye + val.bye + (val.wide ? 1 : 0) + (val.noball ? 1 : 0);
    currentInningData.totalWicket += val.wicket;
    currentInningData.totalBall += 1;
    if (currentInningData.totalBall === 6) {
      currentInningData.totalOver += 1;
      currentInningData.totalBall = 0;
    }
    
    currentInningData.extra.Wide += val.wide;
    currentInningData.extra.NoBall += val.noball;
    currentInningData.extra.LegBye += val.legbye;
    currentInningData.extra.Bye += val.bye;
    currentInningData.extra.OverThrow += val.overthrow;

    setScorecardData(updatedScorecardData);
    updateLastDeliveries();

    try {
      await axios.post(`http://localhost:3000/api/v1/matches/66f1350b7d11619154e2ae00/update/${currentInning === 'inning1' ? '1' : '2'}`, payload);
      // If the API call is successful, we don't need to do anything else as we've already updated the UI
    } catch (error) {
      console.error('Error updating score:', error);
      // If there's an error, we should revert our optimistic update
      fetchScorecardData();
    }

    rotateStrike();
    checkInningCompletion();
    
    if (val.wicket) {
      setVal(prev => ({
        ...prev,
        striker: '',
        extra: false,
        noball: 0,
        wide: 0,
        legbye: 0,
        bye: 0,
        overthrow: 0,
        runs: 0,
        wicket: 0
      }));
    } else {
      setVal(prev => ({
        ...prev,
        extra: false,
        noball: 0,
        wide: 0,
        legbye: 0,
        bye: 0,
        overthrow: 0,
        runs: 0,
        wicket: 0
      }));
    }
  };

  const updateLastDeliveries = () => {
    let newDelivery = val.wicket ? 'W' : val.runs.toString();
    if (val.wide) newDelivery = `Wd${val.runs > 0 ? '+' + val.runs : ''}`;
    if (val.noball) newDelivery = `NB${val.runs > 0 ? '+' + val.runs : ''}`;
    if (val.legbye) newDelivery = `Lb${val.legbye}`;
    if (val.bye) newDelivery = `B${val.bye}`;
    if (val.overthrow) newDelivery += `+${val.overthrow}`;
    setLastDeliveries(prev => {
      const updated = [newDelivery, ...prev];
      return updated.slice(0, 12);
    });
  };

  const rotateStrike = () => {
    const totalRuns = val.runs + val.overthrow + val.legbye + val.bye;
    if(val.wicket) {
      setVal(prev => ({
        ...prev,
        striker: ''
      }))
    }
    if ((totalRuns % 2 !== 0 && !val.extra)) {
      setVal(prev => ({
        ...prev,
        striker: prev.nonStriker,
        nonStriker: prev.striker
      }));
    }
    if(scorecardData?.matchdetails[0][currentInning].totalBall === 5){
      setVal(prev => ({
        ...prev,
        striker: prev.nonStriker,
        nonStriker: prev.striker
      }));
    } 
  };

  const checkInningCompletion = () => {
    if (!scorecardData) return;
    const inning = scorecardData.matchdetails[0][currentInning];
    if (inning.totalWicket === 10 || 
        (inning.totalOver === 20 && inning.totalBall === 0)) {
      if (currentInning === 'inning1') {
        setCurrentInning('inning2');
        setVal(prev => ({
          ...prev,
          striker: '',
          nonStriker: '',
          bowler: ''
        }));
      } else {
        console.log('Match completed');
      }
    }
  };

  useEffect(() => {
    fetchScorecardData();
  }, []);

  return (
    <CricketContext.Provider value={{
      scorecardData,
      setScorecardData,
      val,
      setVal,
      currentInning,
      setCurrentInning,
      lastDeliveries,
      setLastDeliveries,
      loading,
      setLoading,
      error,
      setError,
      fetchScorecardData,
      submitScore
    }}>
      {children}
    </CricketContext.Provider>
  );
};