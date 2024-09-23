import React from 'react';
import { CricketProvider } from './Components/CricketContext';
import ScoreCard from './Components/ScoreCard';
import ControlPanel from './Components/ControlPanel';

const App: React.FC = () => {
  return (
    <CricketProvider>
      <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
        <div className="flex flex-col md:flex-row gap-4">
          <ScoreCard />
          <ControlPanel />
        </div>
      </div>
    </CricketProvider>
  );
};

export default App;