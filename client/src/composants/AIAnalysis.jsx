import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function AIAnalysis({ projectId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/ai/analyze/${projectId}`);
      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'analyse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-primary/20">
      <h2 className="text-xl font-bold mb-4"> Analyse IA du projet</h2>
      
      <button
        onClick={runAnalysis}
        disabled={loading}
        className="btn-primary w-full mb-4"
      >
        {loading ? ' Analyse en cours...' : ' Lancer l\'analyse prédictive'}
      </button>

      {error && (
        <div className="bg-danger/20 border border-danger rounded-lg p-3 text-danger">
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold">{analysis.viabilityScore}%</div>
              <div className="text-sm text-muted">Viabilité</div>
            </div>
            <div className="text-center p-3 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold">{analysis.marketScore}%</div>
              <div className="text-sm text-muted">Marché</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2"> Risques identifiés</h3>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.risks?.map((risk, i) => <li key={i}>{risk}</li>)}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2"> Recommandations</h3>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.recommendations?.map((rec, i) => <li key={i}>{rec}</li>)}
            </ul>
          </div>
          
          <p className="text-muted italic">{analysis.summary}</p>
        </div>
      )}
    </div>
  );
}