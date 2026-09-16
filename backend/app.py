"""
Kokoro TTS Backend for Senbon Webshop
Integrates Kokoro text-to-speech with the React frontend
"""

import os
import logging
import time
import io
from pathlib import Path
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import soundfile as sf
import torch
import numpy as np
from dotenv import load_dotenv
import requests
from huggingface_hub import hf_hub_download, HfFolder

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
AUDIO_OUTPUT_DIR = Path(os.getenv('AUDIO_OUTPUT_DIR', './audio_output'))
AUDIO_OUTPUT_DIR.mkdir(exist_ok=True)

ALLOWED_VOICES = {
    'af_heart': 'Female - Warm, friendly',
    'af_sky': 'Female - Bright, energetic',
    'am_adam': 'Male - American, neutral',
    'am_michael': 'Male - American, professional',
    'bf_emma': 'Female - British, calm',
    'bf_isabella': 'Female - British, warm',
    'bm_george': 'Male - British, warm',
    'bm_lewis': 'Male - British, calm'
}

ALLOWED_LANGUAGES = {
    'a': 'American English',
    'b': 'British English',
    'e': 'Spanish',
    'f': 'French',
    'h': 'Hindi',
    'i': 'Italian',
    'j': 'Japanese',
    'p': 'Portuguese',
    'z': 'Mandarin Chinese'
}

# Global pipeline instance (lazy loaded)
pipeline = None


def get_pipeline(lang_code='a'):
    """Get or initialize the Kokoro pipeline with proxy handling"""
    global pipeline

    if pipeline is not None:
        return pipeline

    logger.info("Initializing Kokoro pipeline...")

    try:
        # Set up proxy handling for Hugging Face
        setup_huggingface_proxy()

        from kokoro import KPipeline
        pipeline = KPipeline(lang_code=lang_code)
        logger.info("Pipeline initialized successfully")
        return pipeline
    except Exception as e:
        logger.error(f"Failed to initialize pipeline: {str(e)}")
        raise


def setup_huggingface_proxy():
    """Configure Hugging Face to work through proxy if needed"""

    # Check if we're behind a proxy
    proxy_url = os.getenv('HTTPS_PROXY') or os.getenv('https_proxy')

    if proxy_url:
        logger.info(f"Configuring Hugging Face with proxy: {proxy_url}")

        # Set environment variables for huggingface_hub
        os.environ['HF_DATASETS_OFFLINE'] = '0'

        # Try to download model with proxy configuration
        try:
            # Attempt to set up HF token if available
            hf_token = os.getenv('HUGGINGFACE_TOKEN')
            if hf_token:
                HfFolder.save_token(hf_token)
                logger.info("Hugging Face token configured")
        except Exception as e:
            logger.warning(f"Could not configure HF token: {str(e)}")

    # Alternative: Use local cache if model is pre-downloaded
    cache_dir = os.getenv('HF_HOME', os.path.expanduser('~/.cache/huggingface'))
    os.environ['HF_HOME'] = cache_dir
    logger.info(f"Using HF cache directory: {cache_dir}")


def download_model_alternative():
    """Alternative approach: pre-download model if proxy fails"""
    model_name = "hexgrad/Kokoro-82M"
    cache_dir = os.path.expanduser('~/.cache/huggingface/hub')

    logger.info(f"Attempting to download {model_name} to cache...")

    try:
        config_path = hf_hub_download(
            repo_id=model_name,
            filename='config.json',
            cache_dir=cache_dir
        )
        logger.info(f"Model config downloaded to: {config_path}")
        return True
    except Exception as e:
        logger.warning(f"Could not download model: {str(e)}")
        logger.info("Model will be downloaded on first use (requires internet)")
        return False


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'kokoro-tts'})


@app.route('/api/voices', methods=['GET'])
def get_voices():
    """Get available voices and languages"""
    return jsonify({
        'voices': ALLOWED_VOICES,
        'languages': ALLOWED_LANGUAGES
    })


@app.route('/api/generate', methods=['POST'])
def generate_audio():
    """
    Generate audio from text

    Request JSON:
    {
        "text": "Text to convert to speech",
        "voice": "af_heart",
        "lang_code": "a",
        "speed": 1.0
    }
    """
    try:
        data = request.get_json()

        # Validate input
        text = data.get('text', '').strip()
        voice = data.get('voice', 'af_heart')
        lang_code = data.get('lang_code', 'a')
        speed = float(data.get('speed', 1.0))

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        if len(text) > 5000:
            return jsonify({'error': 'Text too long (max 5000 characters)'}), 400

        if voice not in ALLOWED_VOICES:
            return jsonify({'error': f'Invalid voice: {voice}'}), 400

        if lang_code not in ALLOWED_LANGUAGES:
            return jsonify({'error': f'Invalid language code: {lang_code}'}), 400

        if not (0.5 <= speed <= 2.0):
            return jsonify({'error': 'Speed must be between 0.5 and 2.0'}), 400

        logger.info(f"Generating audio: voice={voice}, lang={lang_code}, speed={speed}")

        # Get pipeline
        tts_pipeline = get_pipeline(lang_code)

        # Generate audio
        generator = tts_pipeline(text, voice=voice, speed=speed)

        # Collect audio chunks
        audio_data = None
        for graphemes, phonemes, audio in generator:
            if audio_data is None:
                audio_data = audio
            else:
                audio_data = np.concatenate([audio_data, audio])

        if audio_data is None:
            return jsonify({'error': 'Failed to generate audio'}), 500

        # Save audio to bytes
        audio_bytes = io.BytesIO()
        sf.write(audio_bytes, audio_data, 24000, format='WAV')
        audio_bytes.seek(0)

        return send_file(
            audio_bytes,
            mimetype='audio/wav',
            as_attachment=True,
            download_name=f'audio_{int(time.time())}.wav'
        )

    except Exception as e:
        logger.error(f"Error generating audio: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/generate-file', methods=['POST'])
def generate_audio_file():
    """
    Generate audio and save to file, return path

    Request JSON:
    {
        "text": "Text to convert",
        "name": "product_name",
        "voice": "af_heart",
        "lang_code": "a"
    }
    """
    try:
        data = request.get_json()

        text = data.get('text', '').strip()
        name = data.get('name', 'audio').replace(' ', '_').lower()
        voice = data.get('voice', 'af_heart')
        lang_code = data.get('lang_code', 'a')
        speed = float(data.get('speed', 1.0))

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        # Validate
        if voice not in ALLOWED_VOICES:
            return jsonify({'error': f'Invalid voice: {voice}'}), 400

        if lang_code not in ALLOWED_LANGUAGES:
            return jsonify({'error': f'Invalid language code: {lang_code}'}), 400

        logger.info(f"Generating audio file: {name}")

        # Get pipeline
        tts_pipeline = get_pipeline(lang_code)

        # Generate audio
        generator = tts_pipeline(text, voice=voice, speed=speed)

        # Collect chunks
        audio_data = None
        for graphemes, phonemes, audio in generator:
            if audio_data is None:
                audio_data = audio
            else:
                audio_data = np.concatenate([audio_data, audio])

        # Save to file
        timestamp = int(time.time())
        filename = f"{name}_{timestamp}.wav"
        filepath = AUDIO_OUTPUT_DIR / filename

        sf.write(str(filepath), audio_data, 24000)

        return jsonify({
            'success': True,
            'filename': filename,
            'path': str(filepath),
            'url': f'/audio/{filename}'
        })

    except Exception as e:
        logger.error(f"Error generating audio file: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/audio/<filename>', methods=['GET'])
def serve_audio(filename):
    """Serve generated audio file"""
    try:
        filepath = AUDIO_OUTPUT_DIR / filename

        # Security: prevent directory traversal
        if '..' in filename or not filepath.parent == AUDIO_OUTPUT_DIR:
            return jsonify({'error': 'Invalid filename'}), 400

        if not filepath.exists():
            return jsonify({'error': 'File not found'}), 404

        return send_file(str(filepath), mimetype='audio/wav')

    except Exception as e:
        logger.error(f"Error serving audio: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Pre-download model if possible
    download_model_alternative()

    # Run server
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('FLASK_PORT', 5000))

    app.run(host='0.0.0.0', port=port, debug=debug)
