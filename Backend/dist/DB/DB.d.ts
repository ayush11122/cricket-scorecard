import mongoose from 'mongoose';
export declare const Team: mongoose.Model<{
    name: string;
    players: mongoose.Types.DocumentArray<{
        name: string;
        out: "yes" | "no";
        runs: number;
        ballFaced: number;
        runConceeded: number;
        overBowled: number;
        wicketTaken: number;
    }>;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    players: mongoose.Types.DocumentArray<{
        name: string;
        out: "yes" | "no";
        runs: number;
        ballFaced: number;
        runConceeded: number;
        overBowled: number;
        wicketTaken: number;
    }>;
}> & {
    name: string;
    players: mongoose.Types.DocumentArray<{
        name: string;
        out: "yes" | "no";
        runs: number;
        ballFaced: number;
        runConceeded: number;
        overBowled: number;
        wicketTaken: number;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    players: mongoose.Types.DocumentArray<{
        name: string;
        out: "yes" | "no";
        runs: number;
        ballFaced: number;
        runConceeded: number;
        overBowled: number;
        wicketTaken: number;
    }>;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    players: mongoose.Types.DocumentArray<{
        name: string;
        out: "yes" | "no";
        runs: number;
        ballFaced: number;
        runConceeded: number;
        overBowled: number;
        wicketTaken: number;
    }>;
}>> & mongoose.FlatRecord<{
    name: string;
    players: mongoose.Types.DocumentArray<{
        name: string;
        out: "yes" | "no";
        runs: number;
        ballFaced: number;
        runConceeded: number;
        overBowled: number;
        wicketTaken: number;
    }>;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare const Match: mongoose.Model<{
    team1: mongoose.Types.ObjectId;
    team2: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    inning1?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
    inning2?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    team1: mongoose.Types.ObjectId;
    team2: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    inning1?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
    inning2?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
}> & {
    team1: mongoose.Types.ObjectId;
    team2: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    inning1?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
    inning2?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    team1: mongoose.Types.ObjectId;
    team2: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    inning1?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
    inning2?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    team1: mongoose.Types.ObjectId;
    team2: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    inning1?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
    inning2?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
}>> & mongoose.FlatRecord<{
    team1: mongoose.Types.ObjectId;
    team2: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    inning1?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
    inning2?: {
        totalRun: number;
        totalWicket: number;
        totalOver: number;
        totalBall: number;
        extra?: {
            Wide: number;
            NoBall: number;
            Dot: number;
            LegBye: number;
            Bye: number;
            OverThrow: number;
        } | null | undefined;
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
