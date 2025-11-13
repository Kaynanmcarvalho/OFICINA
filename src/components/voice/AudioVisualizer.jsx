/**
 * Audio Visualizer Component
 * 
 * Visualização de ondas sonoras em tempo real
 * Mostra feedback visual do áudio capturado
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useEffect, useRef, useState } from 'react';
import './VoiceAssistant.css';

const AudioVisualizer = ({
  isActive = false,
  audioStream = null,
  height = 60,
  barCount = 20,
  color = '#667eea'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!isActive || !audioStream) {
      stopVisualization();
      return;
    }

    startVisualization();

    return () => stopVisualization();
  }, [isActive, audioStream]);

  const startVisualization = () => {
    if (!audioStream) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(audioStream);
      
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      draw();
    } catch (error) {
      console.error('Error starting visualization:', error);
    }
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (analyserRef.current) {
      analyserRef.current = null;
    }

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawFrame = () => {
      animationRef.current = requestAnimationFrame(drawFrame);

      analyser.getByteFrequencyData(dataArray);

      // Calculate average volume
      const avgVolume = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      setVolume(Math.round((avgVolume / 255) * 100));

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bars
      const barWidth = canvas.width / barCount;
      const barGap = 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const barHeight = (dataArray[dataIndex] / 255) * canvas.height;

        const x = i * barWidth;
        const y = canvas.height - barHeight;

        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, `${color}80`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - barGap, barHeight);
      }
    };

    drawFrame();
  };

  return (
    <div className="audio-visualizer">
      <canvas
        ref={canvasRef}
        width={400}
        height={height}
        className="visualizer-canvas"
      />
      {isActive && (
        <div className="volume-indicator">
          <span className="volume-label">Volume:</span>
          <div className="volume-bar">
            <div 
              className="volume-fill" 
              style={{ width: `${volume}%`, backgroundColor: color }}
            />
          </div>
          <span className="volume-value">{volume}%</span>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
