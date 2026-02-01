import mongoose from "mongoose";

const ResetCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expires: { type: Date, required: true },
});

export default mongoose.models.ResetCode || mongoose.model("ResetCode", ResetCodeSchema);
