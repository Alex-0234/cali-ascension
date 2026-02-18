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
    
    rank: { type:String, default: "" },
    title: { type:String, default: "" },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 }, 
    
    stats: {
        STR: { type: Number, default: 10 },
        AGI: { type: Number, default: 10 },
        VIT: { type: Number, default: 10 },
        DEX: { type: Number, default: 10 }
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

    weightHistory: [{ date: { type: Date, default: Date.now },
                weight: Number,
                unit: String }],
                
    exerciseHistory: [{ date: { type: Date, default: Date.now },
                exerciseId: String,
                reps: Number}]

}, { minimize: false }); 

const User = mongoose.model('User', UserSchema);

export default User;