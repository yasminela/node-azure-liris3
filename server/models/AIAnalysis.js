import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  projectName: { type: String },
  viabilityScore: { type: Number, min: 0, max: 100 },
  marketScore: { type: Number, min: 0, max: 100 },
  teamScore: { type: Number, min: 0, max: 100 },
  feasibilityScore: { type: Number, min: 0, max: 100 },
  risks: [{ type: String }],
  recommendations: [{ type: String }],
  summary: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('AIAnalysis', aiAnalysisSchema);