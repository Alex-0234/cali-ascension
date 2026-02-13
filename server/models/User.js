import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userId: { type: String, unique: true }, 
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    age: Number,
    gender: String,
    weight: Number,
    height: Number,
    
    rank: { type:String, default: "" },
    title: { type:String, default: "" },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 }, 
    
    stats: {
        strength: { type: Number, default: 10 },
        agility: { type: Number, default: 10 },
        intelligence: { type: Number, default: 10 },
        vitality: { type: Number, default: 10 },
    },

    userEvaluation: {
        type: mongoose.Schema.Types.Mixed, 
        default: {}
    },
    awakened: {
        type: mongoose.Schema.Types.Mixed, 
        default: {}
    },

    isConfigured: { type: Boolean, default: false },

    skillProgress: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { minimize: false }); 

const User = mongoose.model('User', UserSchema);

export default User;