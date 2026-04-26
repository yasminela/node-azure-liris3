import express from 'express';
import { analyzeProject } from '../services/aiService.js';
import AIAnalysis from '../models/AIAnalysis.js';
import Project from '../models/Project.js';

const router = express.Router();

router.post('/analyze/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    // Appel à l'IA
    const analysis = await analyzeProject({
      name: project.name,
      description: project.description,
      sector: project.sector,
      teamSize: project.teamSize,
      documents: project.documents // si vous avez des documents
    });

    // Sauvegarde en base
    const savedAnalysis = await AIAnalysis.create({
      projectId,
      projectName: project.name,
      ...analysis
    });

    res.json({ success: true, analysis: savedAnalysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/analysis/:projectId', async (req, res) => {
  const analyses = await AIAnalysis.find({ projectId: req.params.projectId }).sort('-createdAt');
  res.json(analyses);
});

export default router;