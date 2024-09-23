// CricketContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ScoringValues, ScorecardData } from './type';

const MAX_OVERS = 20;
const MAX_WICKETS = 10;

type CricketContextType = {
  val: ScoringValues;
  setVal: React.Dispatch<React.SetStateAction<ScoringValues>>;
  scorecardData: ScorecardData | null;
  setScorecardData: React.Dispatch<React.SetStateAction<ScorecardData | null>>;
  loading: boolean;
  error: string | null;
  lastDeliveries: string[];
  setLastDeliveries: React.Dispatch<React.SetStateAction<string[]>>;
  currentInning: 'inning1' | 'inning2';
  setCurrentInning: React.Dispatch<React.SetStateAction<'inning1' | 'inning2'>>;
  showOverthrowOptions: boolean;
  setShowOverthrowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  fetchScorecardData: () => Promise<void>;
  handleButtonClick: (type: keyof ScoringValues, value: number | boolean) => void;
  handleOverthrowSelect: (runs: number) => void;
  isAllPlayersSelected: () => boolean;
  resetScore: () => void;
  submitScore: () => Promise<void>;
  updateLastDeliveries: () => void;
  rotateStrike: () => void;
  checkInningCompletion: () => void;
  formatOvers: (totalOver: number, totalBall: number) => string;
  calculateTarget: () => number | null;
  calculateRemainingBalls: () => number;
  calculateRequiredRunRate: () => number;
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

  const [scorecardData, setScorecardData] = useState<ScorecardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDeliveries, setLastDeliveries] = useState<string[]>([]);
  const [currentInning, setCurrentInning] = useState<'inning1' | 'inning2'>('inning1');
  const [showOverthrowOptions, setShowOverthrowOptions] = useState(false);

  useEffect(() => {
    fetchScorecardData();
  }, []);

  const fetchScorecardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://cricket-scorecard-1.onrender.com/api/v1/matches/view');
      setScorecardData(response.data);
      setLoading(false);
      
      if (response.data.matchdetails[0].inning1.totalWicket === MAX_WICKETS || 
          (response.data.matchdetails[0].inning1.totalOver === MAX_OVERS && 
           response.data.matchdetails[0].inning1.totalBall === 0)) {
        setCurrentInning('inning2');
      }
    } catch (err) {
      setError('Failed to fetch scorecard data');
      setLoading(false);
    }
  };

  const handleButtonClick = (type: keyof ScoringValues, value: number | boolean) => {
    setVal(prev => {
      const newVal = { ...prev, [type]: value };
      
      if (type === 'noball' || type === 'wide' || type === 'legbye' || type === 'bye' || type === 'overthrow') {
        newVal.extra = true;
      }
      
      return newVal;
    });

    if (type === 'overthrow') {
      setShowOverthrowOptions(true);
    }
  };

  const handleOverthrowSelect = (runs: number) => {
    setVal(prev => ({ ...prev, overthrow: runs, extra: true }));
    setShowOverthrowOptions(false);
  };

  const isAllPlayersSelected = () => {
    return val.striker !== '' && val.nonStriker !== '' && val.bowler !== '';
  };

  const resetScore = () => {
    setVal({
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
  };

  const submitScore = async () => {
    if (!isAllPlayersSelected()) return;

    try {
      const payload = {
        ...val,
        extra: val.noball > 0 || val.wide > 0 || val.legbye > 0 || val.bye > 0 || val.overthrow > 0
      };

      await axios.post(`https://cricket-scorecard-1.onrender.com/api/v1/matches/66f1350b7d11619154e2ae00/update/${currentInning === 'inning1' ? '1' : '2'}`, payload);
      fetchScorecardData();
      updateLastDeliveries();
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
    } catch (error) {
      console.error('Error updating score:', error);
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
    if ((totalRuns % 2 !== 0 )) {
      setVal(prev => ({
        ...prev,
        striker: prev.nonStriker,
        nonStriker: prev.striker
      }));
    }
    if(scorecardData?.matchdetails[0][currentInning].totalBall ===5){
        setVal(prev => ({
            ...prev,
            striker: prev.nonStriker,
            nonStriker: prev.striker,
            bowler: ''
          }));
    } 
  };

  const checkInningCompletion = () => {
    if (!scorecardData) return;
    const inning = scorecardData.matchdetails[0][currentInning];
    if (inning.totalWicket === MAX_WICKETS || 
        (inning.totalOver === MAX_OVERS && inning.totalBall === 0)) {
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

  const formatOvers = (totalOver: number, totalBall: number) => {
    return `${totalOver}.${totalBall}`;
  };

  const calculateTarget = () => {
    if (!scorecardData) return null;
    const inning1 = scorecardData.matchdetails[0].inning1;
    return inning1.totalRun + 1;
  };

  const calculateRemainingBalls = () => {
    if (!scorecardData) return 0;
    const inning2 = scorecardData.matchdetails[0].inning2;
    return MAX_OVERS * 6 - (inning2.totalOver * 6 + inning2.totalBall);
  };

  const calculateRequiredRunRate = () => {
    if (!scorecardData) return 0;
    const inning1 = scorecardData.matchdetails[0].inning1;
    const inning2 = scorecardData.matchdetails[0].inning2;
    const remainingRuns = inning1.totalRun + 1 - inning2.totalRun;
    const remainingBalls = calculateRemainingBalls();
    return (remainingRuns / remainingBalls) * 6;
  };

  return (
    <CricketContext.Provider value={{
      val,
      setVal,
      scorecardData,
      setScorecardData,
      loading,
      error,
      lastDeliveries,
      setLastDeliveries,
      currentInning,
      setCurrentInning,
      showOverthrowOptions,
      setShowOverthrowOptions,
      fetchScorecardData,
      handleButtonClick,
      handleOverthrowSelect,
      isAllPlayersSelected,
      resetScore,
      submitScore,
      updateLastDeliveries,
      rotateStrike,
      checkInningCompletion,
      formatOvers,
      calculateTarget,
      calculateRemainingBalls,
      calculateRequiredRunRate
    }}>
      {children}
    </CricketContext.Provider>
  );
};