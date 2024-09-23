"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = exports.Team = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const url = 'mongodb+srv://adminayush:ayushayu@cluster0.ldeh2qv.mongodb.net/cricket';
mongoose_1.default.connect(url)
    .then(() => {
    console.log('MongoDB connected successfully');
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
const matchSchema = new mongoose_1.default.Schema({
    team1: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Team', required: true },
    team2: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Team', required: true },
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
            OverThrow: { type: Number, default: 0 }
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
            OverThrow: { type: Number, default: 0 }
        }
    },
    createdAt: { type: Date, default: Date.now },
});
const teamSchema = new mongoose_1.default.Schema({
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
exports.Team = mongoose_1.default.model('Team', teamSchema);
exports.Match = mongoose_1.default.model('Match', matchSchema);
