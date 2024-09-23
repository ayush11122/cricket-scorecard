import { Request, Response } from "express";
import { Match, Team } from "../DB/DB";

export const createMatch = async (req: Request, res: Response) => {
  const { team1Id, team2Id } = req.body;
  const match = new Match({
    team1: team1Id,
    team2: team2Id,
  });
  try {
    await match.save();
    res.status(201).send(match);
  } catch (error) {
    res.status(400).send({ message: "Error creating match", error });
  }
};

export const viewMatch = async (req: Request, res: Response) => {
  const matchdetails = await Match.find({ _id: "66f1350b7d11619154e2ae00" });
  const teamdetails = await Team.find({name: "India"});
  const teamdetails2 = await Team.find({ name: "Australia"});
  res.status(200).json({ "matchdetails": matchdetails, "teamdetails":teamdetails, "teamdetails2":teamdetails2 });
};

export const updateMatch = async (req: Request, res: Response) => {
  const { matchid, inning } = req.params;
  const {
    extra,
    noball,
    wide,
    legbye,
    bye,
    overthrow,
    runs,
    wicket,
    striker,
    nonStriker,
    bowler,
  } = req.body;

  try {
    const match: any = await Match.findById(matchid);
    if (!match) {
      return res.status(404).send({ message: "Match not found" });
    }

    // Update inning details
    const inningKey = `inning${inning}`;
    if(inning == '1'){
      var t1 = "team1";
      var t2 = "team2";
    }else{
      var t1 = "team2";
      var t2 = "team1";
    }
    // Helper function to update player stats
    const updatePlayerStats = async (teamId: string, playerName: string, stats: any) => {
      await Team.updateOne(
        { _id: teamId },
        { $inc: stats },
        { arrayFilters: [{ "elem.name": playerName }] }
      );
    };

    const updateOverAndBall = async (inningData: any) => {
      if (inningData.totalBall == 5) {
        inningData.totalOver++;
        inningData.totalBall = 0; // Reset ball count
      } else {
        console.log();
        inningData.totalBall++;  // Increment ball count
      }
    };

    if (wicket && !noball) {
      // Increment total wicket count
      match[inningKey].totalWicket++;
      await updateOverAndBall(match[inningKey]);

      await updatePlayerStats(match[t2], bowler, { "players.$[elem].overBowled": 1 });
      await updatePlayerStats(match[t2], bowler, { "players.$[elem].wicketTaken": 1});
      // Update batter stats for facing a ball (no ball adds ball faced)
      await updatePlayerStats(match[t1], striker, { "players.$[elem].ballFaced": 1 });

       // Mark striker as out
      await Team.updateOne(
        { _id: match[t1], "players.name": striker },
        { $set: { "players.$.out": "yes" } }
      );
    
      // Update striker to the next batsman
      const nextStrikerIndex = match[inningKey].totalWicket + 1; // Indexing for next player
      const nextStriker = await Team.findOne(
        { _id: match[t1] },
        { players: { $slice: [nextStrikerIndex, 1] } } // Get the next batsman
      );
      await match.save();
      if (nextStriker && nextStriker.players.length > 0) {
        const newStrikerName = nextStriker.players[0].name;
        // Assign new striker
        await updatePlayerStats(match[t1], newStrikerName, { "players.$[elem].ballFaced": 0 });
      
        res.status(200).json({ "Striker": newStrikerName, "Non-Striker": nonStriker});
      } else {
        res.status(200).send({ message: "No more players available to bat" });
      }
    }else {
         // Handle Extras
    let strikeRun=0;
    if (extra) {
      // Handle NoBall
      
      if (noball > 0) {
        match[inningKey].totalRun++;
        match[inningKey].extra.NoBall++;

        // Update bowler stats for no-ball
        await updatePlayerStats(match[t2], bowler, { "players.$[elem].runConceeded": 1 });
        // Update batter stats for facing a ball (no ball adds ball faced)
        await updatePlayerStats(match[t1], striker, { "players.$[elem].ballFaced": 1 });

        // Handle byes, legbyes, and overthrows with no-ball
        if (bye > 0) {
          match[inningKey].totalRun += bye;
          match[inningKey].extra.Bye += bye;
          strikeRun +=bye;
        }
        if (legbye > 0) {
          match[inningKey].totalRun += legbye;
          match[inningKey].extra.LegBye += legbye;
          strikeRun +=legbye;
        }
        if (overthrow > 0) {
          match[inningKey].totalRun += overthrow;
          match[inningKey].extra.OverThrow += overthrow;
          strikeRun +=overthrow;
        }
        if (runs > 0) {
          match[inningKey].totalRun += runs;
          await updatePlayerStats(match[t1], striker, { "players.$[elem].runs": runs });
          await updatePlayerStats(match[t2], bowler, { "players.$[elem].runConceeded": runs });
          strikeRun += runs;
        }
      }
      
      // Handle Wide
      else if (wide > 0) {
        match[inningKey].totalRun++;
        match[inningKey].extra.Wide++;

        // Update bowler stats for wide
        await updatePlayerStats(match[t2], bowler, { "players.$[elem].runConceeded": 1 });

        // Handle wide with byes or overthrows
        if (bye > 0) {
          match[inningKey].totalRun += bye;
          match[inningKey].extra.Bye += bye;
          strikeRun +=bye;
        }
        if (overthrow > 0) {
          match[inningKey].totalRun += overthrow;
          match[inningKey].extra.OverThrow += overthrow;
          strikeRun +=bye;
        }
      }

      // Handle Byes or LegByes
      else if (bye > 0 || legbye > 0) {
        const extraRuns = bye > 0 ? bye : legbye;
        match[inningKey].totalRun += extraRuns;
        match[inningKey].extra.Bye += bye;
        match[inningKey].extra.LegBye += legbye;
        await updateOverAndBall(match[inningKey]);  // Count as a legitimate delivery
        strikeRun +=extraRuns; 
        // Update bowler and batter stats
        await updatePlayerStats(match[t2], bowler, { "players.$[elem].overBowled": 1 });
        await updatePlayerStats(match[t1], striker, { "players.$[elem].ballFaced": 1 });

        if (overthrow > 0) {
          match[inningKey].totalRun += overthrow;
          match[inningKey].extra.OverThrow += overthrow;
          strikeRun +=overthrow; 
        }
      }

      // Handle Overthrows with runs
      else if (overthrow > 0 && runs > 0) {
        const totalRuns = runs + overthrow;
        match[inningKey].totalRun += totalRuns;
        match[inningKey].extra.OverThrow += overthrow;
        await updateOverAndBall(match[inningKey]);  // Count as a legitimate delivery
        strikeRun +=totalRuns;

        // Update bowler and batter stats for overthrow
        await updatePlayerStats(match[t2], bowler, { "players.$[elem].overBowled": 1 });
        await updatePlayerStats(match[t2], bowler, { "players.$[elem].runConceeded": totalRuns });
        await updatePlayerStats(match[t1], striker, { "players.$[elem].runs": runs });
        await updatePlayerStats(match[t1], striker, { "players.$[elem].ballFaced": 1 });
      }

      await match.save();

      if(strikeRun%2!=0){
        var newStriker= nonStriker;
        var newNonStriker= striker;
      }else{
        var newStriker= striker;
        var newNonStriker= nonStriker;
      }
      return res.status(200).json({"new_Striker": newStriker, "new_NonStriker":newNonStriker});
    } else{
      match[inningKey].totalRun += runs;
      await updateOverAndBall(match[inningKey]);
      strikeRun +=runs;
      // Update bowler stats for no-ball
      await updatePlayerStats(match[t2], bowler, { "players.$[elem].runConceeded": runs });
      await updatePlayerStats(match[t2], bowler, { "players.$[elem].overBowled": 1 });
      // Update batter stats for facing a ball (no ball adds ball faced)
      await updatePlayerStats(match[t1], striker, { "players.$[elem].ballFaced": 1 });
      await updatePlayerStats(match[t1], striker, { "players.$[elem].runs": runs });
      
      await match.save();
      if(strikeRun%2!=0){
        var newStriker= nonStriker;
        var newNonStriker= striker;
      }else{
        var newStriker= striker;
        var newNonStriker= nonStriker;
      }
      return res.status(200).json({"new_Striker": newStriker, "new_NonStriker":newNonStriker});
    }
    }
  } catch (error) {
    return res.status(500).send({ message: "Error updating match", error });
  }
};

