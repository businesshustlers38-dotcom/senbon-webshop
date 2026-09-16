import React, { useEffect, useState } from 'react';
import { useTTS } from '../hooks/useTTS';
import './TextToSpeech.css';

export const TextToSpeech = () => {
  const {
    loading,
    error,
    voices,
    languages,
    audioUrl,
    fetchVoices,
    generateAudio,
    playAudio,
    downloadAudio,
  } = useTTS();

  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('af_heart');
  const [selectedLanguage, setSelectedLanguage] = useState('a');
  const [speed, setSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);

  const handleGenerate = async () => {
    try {
      await generateAudio(text, selectedVoice, selectedLanguage, speed);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  const handlePlay = () => {
    if (audioUrl) {
      setIsPlaying(true);
      playAudio(audioUrl);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      downloadAudio(audioUrl, `audio_${Date.now()}.wav`);
    }
  };

  const voiceEntries = Object.entries(voices);
  const languageEntries = Object.entries(languages);

  return (
    <div className="tts-container">
      <div className="tts-card">
        <h2>🎤 Text-to-Speech Generator</h2>
        <p className="tts-subtitle">Convert your text to natural-sounding speech</p>

        <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
          {/* Text Input */}
          <div className="form-group">
            <label htmlFor="text">Text to Convert</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              maxLength={5000}
              rows={5}
              disabled={loading}
            />
            <small>{text.length}/5000 characters</small>
          </div>

          {/* Language Selection */}
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={loading}
            >
              {languageEntries.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Selection */}
          <div className="form-group">
            <label htmlFor="voice">Voice</label>
            <select
              id="voice"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              disabled={loading}
            >
              {voiceEntries.map(([id, description]) => (
                <option key={id} value={id}>
                  {description}
                </option>
              ))}
            </select>
          </div>

          {/* Speed Control */}
          <div className="form-group">
            <label htmlFor="speed">
              Speed: {speed.toFixed(1)}x
            </label>
            <input
              id="speed"
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              disabled={loading}
            />
            <small>0.5x (slower) to 2.0x (faster)</small>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={!text || loading}
          >
            {loading ? '🔄 Generating...' : '✨ Generate Speech'}
          </button>
        </form>

        {/* Audio Player */}
        {audioUrl && (
          <div className="audio-section">
            <h3>Generated Audio</h3>
            <audio
              key={audioUrl}
              controls
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <div className="button-group">
              <button
                className="btn-secondary"
                onClick={handlePlay}
                disabled={loading}
              >
                {isPlaying ? '⏸️ Playing...' : '▶️ Play'}
              </button>
              <button
                className="btn-secondary"
                onClick={handleDownload}
                disabled={loading}
              >
                ⬇️ Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;
