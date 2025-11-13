/**
 * Transcription Display Component
 * 
 * Exibe transcrição em tempo real
 * Permite correção manual e histórico
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Check, X, Clock } from 'lucide-react';
import './VoiceAssistant.css';

const TranscriptionDisplay = ({
  transcript = '',
  isListening = false,
  onEdit,
  showHistory = true,
  maxHistoryItems = 10
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [history, setHistory] = useState([]);
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (transcript && !isListening) {
      addToHistory(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript, history]);

  const addToHistory = (text) => {
    if (!text.trim()) return;

    setHistory(prev => {
      const newHistory = [
        {
          text,
          timestamp: new Date(),
          id: Date.now()
        },
        ...prev
      ].slice(0, maxHistoryItems);
      
      return newHistory;
    });
  };

  const handleStartEdit = () => {
    setEditedText(transcript);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(editedText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText('');
    setIsEditing(false);
  };

  const highlightKeywords = (text) => {
    const keywords = [
      'adicionar', 'remover', 'alterar', 'mudar', 'total', 'finalizar',
      'serviço', 'peça', 'preço', 'valor', 'quantidade'
    ];

    let highlighted = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="keyword">$&</span>`);
    });

    return highlighted;
  };

  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="transcription-display">
      {/* Current Transcription */}
      <div className="current-transcription">
        <div className="transcription-header">
          <h4>Transcrição</h4>
          {transcript && !isListening && !isEditing && (
            <button
              className="btn-edit"
              onClick={handleStartEdit}
              title="Editar transcrição"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>

        <div className="transcription-content" ref={transcriptRef}>
          {isEditing ? (
            <div className="edit-mode">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="edit-textarea"
                autoFocus
                rows={3}
              />
              <div className="edit-actions">
                <button
                  className="btn-save"
                  onClick={handleSaveEdit}
                >
                  <Check size={16} />
                  Salvar
                </button>
                <button
                  className="btn-cancel"
                  onClick={handleCancelEdit}
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="transcript-text">
              {transcript ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: highlightKeywords(transcript)
                  }}
                />
              ) : (
                <p className="transcript-placeholder">
                  {isListening
                    ? 'Ouvindo...'
                    : 'Clique no microfone para começar'}
                </p>
              )}
              {isListening && (
                <span className="listening-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {showHistory && history.length > 0 && (
        <div className="transcription-history">
          <div className="history-header">
            <Clock size={16} />
            <h5>Histórico</h5>
          </div>
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <span className="history-time">
                  {formatTimestamp(item.timestamp)}
                </span>
                <p className="history-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionDisplay;
