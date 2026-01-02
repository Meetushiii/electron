import mongoose from "mongoose";

const SrcSchema = new mongoose.Schema({
    code: {type: String, unique: true},
    visits: {type: Number, default: 0},
    registrations: {type: Number, default: 0}
})


const Src = mongoose.model('Src', SrcSchema);


export default Src;