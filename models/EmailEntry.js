import mongoose from "mongoose";

const EmailEntrySchema = new mongoose.Schema({
    email: String,
    time: Date,
    ip: String,
    locationCode: String,
    src: String    
}, {timestamps: true})

const EmailEntry = new mongoose.model('EmailEntry', EmailEntrySchema);

export default EmailEntry;