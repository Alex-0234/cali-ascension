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
    rating: { type:String, default: "" },
    level: { type: Number, default: 0 },
    xp: { type: Number, default: 0 }, 
    ep: { type: Number, default: 0 }, 
    stats: {
        STR: { type: Number, default: 10 },
        END: { type: Number, default: 10 },
        MOB: { type: Number, default: 10 },
        TEC: { type: Number, default: 10 }
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
    workoutHistory: {},

    isConfigured: { type: Boolean, default: false },

}, { minimize: false }); 

const User = mongoose.model('User', UserSchema);

export default User;