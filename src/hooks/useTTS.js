import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useTTS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voices, setVoices] = useState({});
  const [languages, setLanguages] = useState({});
  const [audioUrl, setAudioUrl] = useState(null);

  // Fetch available voices and languages
  const fetchVoices = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/voices`);
      if (!response.ok) throw new Error('Failed to fetch voices');

      const data = await response.json();
      setVoices(data.voices);
      setLanguages(data.languages);
    } catch (err) {
      setError(`Failed to load voices: ${err.message}`);
    }
  }, []);

  // Generate audio stream
  const generateAudio = useCallback(async (text, voice = 'af_heart', langCode = 'a', speed = 1.0) => {
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          lang_code: langCode,
          speed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      // Create blob URL for audio playback
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      return url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate and save audio file
  const generateAudioFile = useCallback(async (text, name, voice = 'af_heart', langCode = 'a', speed = 1.0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/generate-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          name,
          voice,
          lang_code: langCode,
          speed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Play audio
  const playAudio = useCallback((url) => {
    if (!url) return;

    const audio = new Audio(url);
    audio.play().catch((err) => {
      setError(`Failed to play audio: ${err.message}`);
    });
  }, []);

  // Download audio
  const downloadAudio = useCallback((url, filename = 'audio.wav') => {
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    loading,
    error,
    voices,
    languages,
    audioUrl,
    fetchVoices,
    generateAudio,
    generateAudioFile,
    playAudio,
    downloadAudio,
  };
};
