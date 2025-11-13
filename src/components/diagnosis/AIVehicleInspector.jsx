/**
 * AI Vehicle Inspector Component
 * 
 * Componente para inspeção visual de veículos usando IA (YOLOv8)
 * Permite upload de imagens e detecta danos automaticamente
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  AlertCircle, 
  CheckCircle, 
  Loader, 
  X,
  ZoomIn,
  Download,
  RefreshCw
} from 'lucide-react';
import './AIVehicleInspector.css';

const AIVehicleInspector = ({ onDetectionComplete, vehicleId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detections, setDetections] = useState(null);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Damage type translations
  const damageTranslations = {
    broken_glass: 'Vidro Quebrado',
    broken_light: 'Farol/Lanterna Quebrado',
    bumper_damage: 'Dano no Para-choque',
    dent: 'Amassado',
    scratch: 'Arranhão',
    rust: 'Ferrugem',
    paint_damage: 'Dano na Pintura',
    flat_tire: 'Pneu Furado',
    tire_wear: 'Desgaste de Pneu',
    mirror_damage: 'Dano no Retrovisor',
    door_damage: 'Dano na Porta',
    hood_damage: 'Dano no Capô',
    trunk_damage: 'Dano no Porta-malas',
    wheel_damage: 'Dano na Roda'
  };

  // Severity levels based on damage type
  const getSeverity = (damageType) => {
    const critical = ['broken_glass', 'broken_light', 'flat_tire'];
    const high = ['bumper_damage', 'dent', 'rust', 'wheel_damage'];
    const medium = ['scratch', 'paint_damage', 'door_damage', 'hood_damage', 'trunk_damage'];
    const low = ['tire_wear', 'mirror_damage'];

    if (critical.includes(damageType)) return { level: 'critical', color: '#ef4444', label: 'Crítico' };
    if (high.includes(damageType)) return { level: 'high', color: '#f97316', label: 'Alto' };
    if (medium.includes(damageType)) return { level: 'medium', color: '#eab308', label: 'Médio' };
    if (low.includes(damageType)) return { level: 'low', color: '#22c55e', label: 'Baixo' };
    return { level: 'unknown', color: '#6b7280', label: 'Desconhecido' };
  };

  // Handle file selection
  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError(null);
      setDetections(null);
      setShowResults(false);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Por favor, selecione uma imagem válida');
    }
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = { target: { files: [file] } };
      handleFileSelect(fakeEvent);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  // Analyze image with AI
  const analyzeImage = async () => {
    if (!selectedImage) {
      setError('Selecione uma imagem primeiro');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];

        // Call YOLOv8 API
        const response = await fetch('/api/detect-damage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image,
            vehicleId: vehicleId,
            confidence_threshold: 0.45
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao analisar imagem');
        }

        const data = await response.json();
        
        setDetections(data);
        setShowResults(true);
        
        // Draw detections on canvas
        if (data.detections && data.detections.length > 0) {
          drawDetections(data.detections);
        }

        // Callback with results
        if (onDetectionComplete) {
          onDetectionComplete(data);
        }
      };
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Erro ao analisar imagem. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Draw bounding boxes on canvas
  const drawDetections = (detectionsList) => {
    const canvas = canvasRef.current;
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Draw each detection
      detectionsList.forEach((detection) => {
        const [x, y, w, h] = detection.bbox;
        const severity = getSeverity(detection.label);

        // Draw bounding box
        ctx.strokeStyle = severity.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        // Draw label background
        const label = `${damageTranslations[detection.label] || detection.label} (${(detection.confidence * 100).toFixed(0)}%)`;
        ctx.font = 'bold 14px Arial';
        const textWidth = ctx.measureText(label).width;
        
        ctx.fillStyle = severity.color;
        ctx.fillRect(x, y - 25, textWidth + 10, 25);

        // Draw label text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, x + 5, y - 7);
      });
    };

    img.src = imagePreview;
  };

  // Reset component
  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDetections(null);
    setError(null);
    setShowResults(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download annotated image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `inspecao-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="ai-vehicle-inspector">
      <div className="inspector-header">
        <div className="header-content">
          <Camera className="header-icon" />
          <div>
            <h2>Inspeção Visual com IA</h2>
            <p>Detecte danos automaticamente usando inteligência artificial</p>
          </div>
        </div>
      </div>

      <div className="inspector-body">
        {/* Upload Area */}
        {!imagePreview && (
          <div
            className="upload-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="upload-icon" />
            <h3>Arraste uma imagem ou clique para selecionar</h3>
            <p>Formatos suportados: JPG, PNG, WEBP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && !showResults && (
          <div className="image-preview-container">
            <div className="preview-header">
              <h3>Imagem Selecionada</h3>
              <button onClick={handleReset} className="btn-icon">
                <X size={20} />
              </button>
            </div>
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
            <div className="preview-actions">
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="btn-primary"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="spinner" size={20} />
                    Analisando...
                  </>
                ) : (
                  <>
                    <ZoomIn size={20} />
                    Analisar Imagem
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && detections && (
          <div className="results-container">
            <div className="results-header">
              <h3>Resultados da Análise</h3>
              <div className="results-actions">
                <button onClick={handleDownload} className="btn-secondary">
                  <Download size={18} />
                  Baixar
                </button>
                <button onClick={handleReset} className="btn-secondary">
                  <RefreshCw size={18} />
                  Nova Análise
                </button>
              </div>
            </div>

            {/* Annotated Image */}
            <div className="annotated-image">
              <canvas ref={canvasRef} />
            </div>

            {/* Detection Summary */}
            <div className="detection-summary">
              <div className="summary-header">
                <h4>Danos Detectados</h4>
                <span className="detection-count">
                  {detections.detections?.length || 0} {detections.detections?.length === 1 ? 'dano' : 'danos'}
                </span>
              </div>

              {detections.detections && detections.detections.length > 0 ? (
                <div className="detections-list">
                  {detections.detections.map((detection, index) => {
                    const severity = getSeverity(detection.label);
                    return (
                      <div key={index} className="detection-item">
                        <div className="detection-icon" style={{ backgroundColor: severity.color }}>
                          <AlertCircle size={20} />
                        </div>
                        <div className="detection-info">
                          <h5>{damageTranslations[detection.label] || detection.label}</h5>
                          <div className="detection-meta">
                            <span className="confidence">
                              Confiança: {(detection.confidence * 100).toFixed(1)}%
                            </span>
                            <span className="severity" style={{ color: severity.color }}>
                              {severity.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-detections">
                  <CheckCircle size={48} color="#22c55e" />
                  <h4>Nenhum dano detectado</h4>
                  <p>A IA não identificou danos visíveis nesta imagem</p>
                </div>
              )}
            </div>

            {/* Processing Info */}
            <div className="processing-info">
              <div className="info-item">
                <span className="info-label">Tempo de Processamento:</span>
                <span className="info-value">{detections.processing_time_ms?.toFixed(0)}ms</span>
              </div>
              <div className="info-item">
                <span className="info-label">Resolução:</span>
                <span className="info-value">
                  {detections.image_size?.[0]} x {detections.image_size?.[1]}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Modelo:</span>
                <span className="info-value">{detections.model_version || 'YOLOv8'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVehicleInspector;
