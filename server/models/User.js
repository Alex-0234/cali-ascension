import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // essentials
    userId: { type: String, unique: true }, 
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // user specified
    userInfo: {
        visibleName: String,
        age: Number,
        gender: String,
        weight: Number,
        height: Number,
    },
    title: { type:String, default: "" },
    color: { type:String, default: 'lightblue'},
    bioStatus: String,
    streak: {
        current: { type: Number, default: 0},
        highest: { type: Number, default: 0},
        lastActive: { type: Date }
    },

    // default stats
    rating: { type:Number, default: 100 },
    level: { type: Number, default: 0 },
    prestige: { type: Number, default: 0 },
    prestigeXPConsumed:{ type: Number, default: 0 },
    xp: { type: Number, default: 0 }, 
    ep: { type: Number, default: 0 }, 
    stats: {
        STR: { type: Number, default: 10 }, // REP RANGE: 1-4
        HYP: { type: Number, default: 10 }, // REP RANGE: 5-12
        END: { type: Number, default: 10 }, // REP RANGE: 12-25+
        POW: { type: Number, default: 10 }, // EXPLOSIVE REPS
        // MAYBE DELETE
        MOB: { type: Number, default: 10 }, // STRETCHING ??
        TEC: { type: Number, default: 10 }, // INCREASE WITH PROFICIENCY ??
    },

    exerciseProgress: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
     weightHistory: [{
        id: { type: Number, default: Date.now },
        date: { type: Date, default: Date.now },
        weight: Number 
    }],
    customWorkouts: [],
    workoutHistory: {},

    isConfigured: { type: Boolean, default: false },

}, { minimize: false }); 

const User = mongoose.model('User', UserSchema);

export default User;