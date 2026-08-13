import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // essentials
    userId: { type: String, unique: true }, 
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // select:false keeps the hash out of every query result by default, so it can
    // never be sent to the client by accident. The login check opts back in with
    // .select('+password').
    password: { type: String, required: true, select: false },
    dateCreated: { type: Date, required: true },
    
    // user specified
    userInfo: {
        visibleName: { type: String, default: null },
        age:         { type: Number, default: null },
        gender:      { type: String, default: null },
        weight:      { type: Number, default: null },
        height:      { type: Number, default: null },
    },
    title: { type: String, default: null },
    color: { type: String, default: 'lightblue' },
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
        BAL: { type: Number, default: 10 }, 
        AP: { type: Number, default: 10 }, 
    },

    exerciseProgress: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    customTrackers: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    customWorkouts: [],
    workoutHistory: {},

    isConfigured: { type: Boolean, default: false },

}, { minimize: false }); 

const User = mongoose.model('User', UserSchema);

export default User;