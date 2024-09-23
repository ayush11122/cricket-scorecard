// ControlPanel.tsx
import React from 'react';
import { useCricketContext } from './CricketContext';

const ControlPanel: React.FC = () => {
  const { 
    scorecardData, 
    val, 
    setVal, 
    currentInning, 
    showOverthrowOptions,
    handleButtonClick,
    handleOverthrowSelect,
    isAllPlayersSelected,
    resetScore,
    submitScore,
    calculateTarget,
    calculateRemainingBalls,
    calculateRequiredRunRate
  } = useCricketContext();

  if (!scorecardData) return null;

  const battingTeam = currentInning === 'inning1' ? scorecardData.teamdetails[0] : scorecardData.teamdetails2[0];
  const bowlingTeam = currentInning === 'inning1' ? scorecardData.teamdetails2[0] : scorecardData.teamdetails[0];

  return (
    <div className="md:w-1/3 bg-white shadow-md rounded-lg p-6">
        {/* Team B wins by chasing the target */}
        {
  currentInning === 'inning2' && (
    <>
      {/* Team B wins by chasing the target */}
      {scorecardData.matchdetails[0].inning2.totalRun >= calculateTarget() ? (
        <div>
          {scorecardData.teamdetails2[0].name} won by {10 - scorecardData.matchdetails[0].inning2.totalWicket} wickets
        </div>
      ) : (
        /* Team A wins if Team B loses all wickets or cannot reach the target in the remaining balls */
        scorecardData.matchdetails[0].inning2.totalWicket === 10 ||
        calculateRemainingBalls() === 0 ? (
          <div>
            Team B won by {calculateTarget() - scorecardData.matchdetails[0].inning2.totalRun} runs
          </div>
        ) : (
          /* If no team has won yet, show the target information */
          <div className="mb-4 p-4 bg-blue-100 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Target Information</h3>
            <p>Target: {calculateTarget()}</p>
            <p>Balls Remaining: {calculateRemainingBalls()}</p>
            <p>Wickets in Hand: {10 - scorecardData.matchdetails[0].inning2.totalWicket}</p>
            <p>Required Run Rate: {calculateRequiredRunRate().toFixed(2)}</p>
            <p>
              {scorecardData.teamdetails2[0].name} needs {calculateTarget() - scorecardData.matchdetails[0].inning2.totalRun} runs 
              in {calculateRemainingBalls()} balls to win
            </p>
          </div>
        )
      )}
    </>
  )
}
      <h2 className="text-xl font-bold mb-4">Control Panel</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Striker</label>
          <div className="mt-1 relative">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={val.striker}
              onChange={(e) => setVal(prev => ({ ...prev, striker: e.target.value }))}
            >
              <option value="">Select Striker</option>
              {battingTeam.players.map(player => (
                <option key={player._id} value={player.name} disabled={player.out === 'yes'}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Non-Striker</label>
          <div className="mt-1 relative">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={val.nonStriker}
              onChange={(e) => setVal(prev => ({ ...prev, nonStriker: e.target.value }))}
            >
              <option value="">Select Non-Striker</option>
              {battingTeam.players.map(player => (
                <option key={player._id} value={player.name} disabled={player.out === 'yes'}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Bowler</label>
        <div className="mt-1 relative">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={val.bowler}
            onChange={(e) => setVal(prev => ({ ...prev, bowler: e.target.value }))}
          >
            <option value="">Select Bowler</option>
            {bowlingTeam.players.map(player => (
              <option key={player._id} value={player.name}>{player.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          className={`bg-green-600 text-white font-bold py-2 px-4 rounded ${val.runs === 0 ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleButtonClick('runs', 0)}
        >
          Dot Ball
        </button>
        {[1, 2, 3, 4, 6].map((run) => (
          <button
            key={run}
            className={`bg-blue-600 text-white font-bold py-2 px-4 rounded ${val.runs === run ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleButtonClick('runs', run)}
          >
            {run}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          className={`bg-red-600 text-white font-bold py-2 px-4 rounded ${val.wicket ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleButtonClick('wicket', val.wicket ? 0 : 1)}
        >
          Wicket
        </button>
        <button
          className={`bg-yellow-500 text-white font-bold py-2 px-4 rounded ${val.extra ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleButtonClick('extra', !val.extra)}
        >
          Extra
        </button>
        <button
          className={`bg-purple-600 text-white font-bold py-2 px-4 rounded ${val.wide > 0 ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleButtonClick('wide', 1)}
        >
          Wide 
        </button>
        <button
          className={`bg-orange-500 text-white font-bold py-2 px-4 rounded ${val.noball > 0 ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleButtonClick('noball', 1)}
        >
          No Ball
        </button>
      </div>
      {val.extra && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            className={`bg-teal-600 text-white font-bold py-2 px-4 rounded ${val.legbye > 0 ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleButtonClick('legbye', val.legbye + 1)}
          >
            Leg Bye {val.legbye > 0 ? val.legbye : ''}
          </button>
          <button
            className={`bg-indigo-600 text-white font-bold py-2 px-4 rounded ${val.bye > 0 ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleButtonClick('bye', val.bye + 1)}
          >
            Bye {val.bye > 0 ? val.bye : ''}
          </button>
        </div>
      )}
      <div className="mb-4">
        <button
          className={`bg-pink-600 text-white font-bold py-2 px-4 rounded w-full ${val.overthrow > 0 ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleButtonClick('overthrow', 1)}
        >
          Overthrow 
        </button>
        {showOverthrowOptions && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((runs) => (
              <button
                key={runs}
                className="bg-pink-400 text-white font-bold py-1 px-2 rounded"
                onClick={() => handleOverthrowSelect(runs)}
              >
                {runs}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        className={`w-full font-bold py-2 px-4 rounded ${
          isAllPlayersSelected()
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        onClick={submitScore}
        disabled={!isAllPlayersSelected()}
      >
        Submit Score
      </button>
      <button
        className={`w-full font-bold my-2 py-2 px-4 rounded ${
          isAllPlayersSelected()
            ? 'bg-red-900 text-white hover:bg-red-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        onClick={resetScore}
        disabled={!isAllPlayersSelected()}
      >
        Reset
      </button>
      {!isAllPlayersSelected() && (
        <p className="text-red-500 text-sm mt-2">Please select all players before submitting.</p>
      )}
    </div>
  );
};

export default ControlPanel;