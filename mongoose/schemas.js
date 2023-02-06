import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LogSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  service: String,
  calendar: String,
  json: Object,
  obtained: Boolean,
});



export const LogModel = mongoose.model("Log", LogSchema);