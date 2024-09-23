// ScoreCard.tsx
import React from 'react';
import { useCricketContext } from './CricketContext';

const ScoreCard: React.FC = () => {
  const { 
    scorecardData, 
    currentInning, 
    val, 
    lastDeliveries, 
    formatOvers,
  } = useCricketContext();

  if (!scorecardData) return null;

  const battingTeam = currentInning === 'inning1' ? scorecardData.teamdetails[0] : scorecardData.teamdetails2[0];
  const bowlingTeam = currentInning === 'inning1' ? scorecardData.teamdetails2[0] : scorecardData.teamdetails[0];

  const currentBowler = bowlingTeam.players.find(player => player.name === val.bowler);

  return (
    <div className="md:w-2/3 bg-white shadow-md rounded-lg p-6">
      
      <h2 className="text-xl font-bold mb-4">Current Scorecard</h2>
      <div className="mb-4">
        <h3 className="font-semibold">{battingTeam.name}</h3>
        <p className="font-bold">
          Score: {scorecardData.matchdetails[0][currentInning].totalRun}/
          {scorecardData.matchdetails[0][currentInning].totalWicket} 
          ({formatOvers(scorecardData.matchdetails[0][currentInning].totalOver, scorecardData.matchdetails[0][currentInning].totalBall)} overs)
        </p>
        <p>Striker: {val.striker || 'Not selected'}</p>
        <p>Non-Striker: {val.nonStriker || 'Not selected'}</p>
        <p>Bowler: {val.bowler || 'Not selected'} 
          {currentBowler && ` (${Math.floor(currentBowler.overBowled / 6)}.${currentBowler.overBowled % 6}-${currentBowler.runConceeded}-${currentBowler.wicketTaken})`}
        </p>
        <p>Extras: {
          scorecardData.matchdetails[0][currentInning].extra.Wide +
          scorecardData.matchdetails[0][currentInning].extra.NoBall +
          scorecardData.matchdetails[0][currentInning].extra.LegBye +
          scorecardData.matchdetails[0][currentInning].extra.Bye +
          scorecardData.matchdetails[0][currentInning].extra.OverThrow
        } (Wd {scorecardData.matchdetails[0][currentInning].extra.Wide}, 
           Nb {scorecardData.matchdetails[0][currentInning].extra.NoBall}, 
           Lb {scorecardData.matchdetails[0][currentInning].extra.LegBye}, 
           B {scorecardData.matchdetails[0][currentInning].extra.Bye}, 
           Ot {scorecardData.matchdetails[0][currentInning].extra.OverThrow})
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Last 12 Deliveries</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {lastDeliveries.map((delivery, index) => (
            <span key={index} className="px-2 py-1 bg-gray-200 rounded">{delivery}</span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Innings Scorecard</h3>
        <div className="mt-4">
          <h4 className="font-semibold">Batting</h4>
          <table className="w-full mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Batsman</th>
                <th className="text-right p-2">Runs</th>
                <th className="text-right p-2">Balls</th>
                <th className="text-right p-2">SR</th>
              </tr>
            </thead>
            <tbody>
              {battingTeam.players.map(player => (
                <tr key={player._id} className="border-t">
                  <td className="p-2">{player.name} {player.out === 'yes' ? '(out)' : player.runs === 0 && player.ballFaced === 0 ? '(not batted yet)' : ''}</td>
                  <td className="text-right p-2">{player.runs}</td>
                  <td className="text-right p-2">{player.ballFaced}</td>
                  <td className="text-right p-2">
                    {player.ballFaced > 0 ? ((player.runs / player.ballFaced) * 100).toFixed(2) : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">Bowling</h4>
          <table className="w-full mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Bowler</th>
                <th className="text-right p-2">O</th>
                <th className="text-right p-2">R</th>
                <th className="text-right p-2">W</th>
                <th className="text-right p-2">Econ</th>
              </tr>
            </thead>
            <tbody>
              {bowlingTeam.players.map(player => (
                <tr key={player._id} className="border-t">
                  <td className="p-2">{player.name}</td>
                  <td className="text-right p-2">{Math.floor(player.overBowled / 6)}.{player.overBowled % 6}</td>
                  <td className="text-right p-2">{player.runConceeded}</td>
                  <td className="text-right p-2">{player.wicketTaken}</td>
                  <td className="text-right p-2">
                    {player.overBowled > 0 ? ((player.runConceeded / (player.overBowled)) * 6).toFixed(2) : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    
    </div>
  );
};

export default ScoreCard;