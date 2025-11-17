/**
 * Guide Viewer Component
 * Visualizador completo de guias técnicos
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Clock, 
  Wrench, 
  Package, 
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Heart,
  Eye,
  Share2,
  Download,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import mechanicGuideService from '../../services/mechanicGuideService';

const GuideViewer = ({ guideId, onClose }) => {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    loadGuide();
  }, [guideId]);

  const loadGuide = async () => {
    setLoading(true);
    try {
      const data = await mechanicGuideService.getGuide(guideId);
      setGuide(data);
    } catch (error) {
      console.error('Error loading guide:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const handleLike = async () => {
    try {
      const isLiked = await mechanicGuideService.likeGuide(guideId, 'current-user');
      setLiked(isLiked);
    } catch (error) {
      console.error('Error liking guide:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      facil: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
      medio: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
      dificil: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
    };
    return colors[difficulty] || colors.medio;
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      facil: 'Fácil',
      medio: 'Médio',
      dificil: 'Difícil'
    };
    return labels[difficulty] || 'Médio';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Guia não encontrado
          </h2>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const progress = guide.steps?.length > 0 
    ? (completedSteps.size / guide.steps.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ← Voltar
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-lg transition-colors ${
                  liked 
                    ? 'text-red-600 bg-red-100 dark:bg-red-900/30' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {guide.title}
          </h1>
          
          {guide.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {guide.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className={`px-3 py-1 rounded-full ${getDifficultyColor(guide.difficulty)}`}>
              {getDifficultyLabel(guide.difficulty)}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {guide.duration} min
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Eye className="w-4 h-4 mr-1" />
              {guide.views || 0} visualizações
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Heart className="w-4 h-4 mr-1" />
              {guide.likes || 0} curtidas
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Progresso: {completedSteps.size} de {guide.steps?.length || 0} passos
              </span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Steps */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Book className="w-5 h-5 mr-2" />
                Passos do Procedimento
              </h2>
              
              <div className="space-y-4">
                {guide.steps?.map((step, index) => (
                  <div 
                    key={index}
                    className={`border-l-4 pl-4 py-3 transition-all ${
                      completedSteps.has(index)
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : currentStep === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                            Passo {step.order || index + 1}
                          </span>
                          {completedSteps.has(index) && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {step.description}
                        </p>
                        
                        {step.warnings && step.warnings.length > 0 && (
                          <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="flex items-start">
                              <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                                {step.warnings.map((warning, i) => (
                                  <p key={i}>{warning}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {step.image && (
                          <img 
                            src={step.image} 
                            alt={step.title}
                            className="mt-3 rounded-lg w-full"
                          />
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleStepComplete(index)}
                        className={`ml-4 p-2 rounded-lg transition-colors ${
                          completedSteps.has(index)
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {guide.tips && guide.tips.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Dicas Profissionais
                </h3>
                <ul className="space-y-2">
                  {guide.tips.map((tip, index) => (
                    <li key={index} className="flex items-start text-blue-800 dark:text-blue-300 text-sm">
                      <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* References */}
            {guide.references && guide.references.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Referências
                </h3>
                <div className="space-y-2">
                  {guide.references.map((ref, index) => (
                    <a
                      key={index}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {ref.source}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {ref.type}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tools */}
            {guide.tools && guide.tools.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Wrench className="w-5 h-5 mr-2" />
                  Ferramentas Necessárias
                </h3>
                <ul className="space-y-2">
                  {guide.tools.map((tool, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${
                        tool.required 
                          ? 'text-red-600' 
                          : 'text-gray-400'
                      }`} />
                      <span className="text-gray-700 dark:text-gray-300">
                        {tool.name}
                        {tool.required && (
                          <span className="text-red-600 ml-1">*</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  * Obrigatório
                </p>
              </div>
            )}

            {/* Parts */}
            {guide.parts && guide.parts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Peças Necessárias
                </h3>
                <ul className="space-y-3">
                  {guide.parts.map((part, index) => (
                    <li key={index} className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {part.name}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {part.quantity} {part.unit}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {guide.tags && guide.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {guide.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideViewer;
