import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userId: { type: String, unique: true }, 
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    shownName: String,
    age: Number,
    gender: String,
    weight: Number,
    height: Number,
    currentProgram: { 
        split: {type: String, default: "Full Body" },
        currentDayIndex: {type: Number, default: 0 },
        date: Date,
    },
    bioStatus: String,
    
    rank: { type:String, default: "" },
    title: { type:String, default: "" },
    color: { type:String, default: 'blue'},
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 }, 
    ep: { type: Number, default: 0 }, 
    streak: {
        current: { type: Number, default: 0},
        highest: { type: Number, default: 0},
        lastActive: { type: Date }
    },
    
    stats: {
        STR: { type: Number, default: 10 },
        END: { type: Number, default: 10 },
        MOB: { type: Number, default: 10 },
        TEC: { type: Number, default: 10 }
    },

    userEvaluation: {
        type: mongoose.Schema.Types.Mixed, 
        default: {}
    },

    isConfigured: { type: Boolean, default: false },


    exerciseProgress: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    weightHistory: [{
        id: { type: Number, default: Date.now },
        date: { type: Date, default: Date.now },
                    weight: Number }],
                
    workoutHistory: {},

}, { minimize: false }); 

const User = mongoose.model('User', UserSchema);

export default User;