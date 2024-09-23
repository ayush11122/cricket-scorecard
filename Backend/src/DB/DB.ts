import mongoose from 'mongoose';

const url ='mongodb+srv://adminayush:ayushayu@cluster0.ldeh2qv.mongodb.net/cricket';


mongoose.connect(url)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  const matchSchema = new mongoose.Schema({
    team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    inning1: {
      totalRun: { type: Number, default: 0 },
      totalWicket: { type: Number, default: 0 },
      totalOver: { type: Number, default: 0 },
      totalBall: { type: Number, default: 0 },
      extra: {
        Wide: { type: Number, default: 0 },
        NoBall: { type: Number, default: 0 },
        Dot: { type: Number, default: 0 },
        LegBye: { type: Number, default: 0 },
        Bye: { type: Number, default: 0 },
        OverThrow: {type: Number, default: 0 }
       }
    },
    inning2: {
      totalRun: { type: Number, default: 0 },
      totalWicket: { type: Number, default: 0 },
      totalOver: { type: Number, default: 0 },
      totalBall: { type: Number, default: 0 },
      extra: {
        Wide: { type: Number, default: 0 },
        NoBall: { type: Number, default: 0 },
        Dot: { type: Number, default: 0 },
        LegBye: { type: Number, default: 0 },
        Bye: { type: Number, default: 0 },
        OverThrow: {type: Number, default: 0 }
       }
    },
    createdAt: { type: Date, default: Date.now },
  })

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    players: [{
      name: { type: String, required: true },
      out: { type: String, enum: ['yes', 'no'], default: 'no' },
      runs: { type: Number, default: 0 },
      ballFaced: { type: Number, default: 0 },
      runConceeded: { type: Number, default: 0 },
      overBowled: { type: Number, default: 0 },
      wicketTaken: { type: Number, default: 0 }
    }],
  });
  
export const Team = mongoose.model('Team', teamSchema);
export const Match = mongoose.model('Match', matchSchema);
