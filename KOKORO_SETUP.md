# Kokoro TTS Integration Setup

This guide explains how to set up and run the Kokoro Text-to-Speech backend with your Senbon Webshop.

## 📋 What's Included

- **Backend**: Flask API server with Kokoro TTS
- **Frontend**: React components for TTS UI
- **Docker**: Ready-to-deploy containerized setup
- **Proxy Support**: Built-in Hugging Face proxy handling

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone/navigate to project
cd senbon-webshop

# Copy environment file
cp backend/.env.example backend/.env

# Build and run
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Navigate to backend
cd senbon-webshop/backend

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run backend
python app.py

# Server runs on http://localhost:5000
```

#### Frontend Setup

```bash
# In project root
cd senbon-webshop

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run development server
npm run dev

# Access at http://localhost:5173 (or shown in terminal)
```

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```bash
# Flask
FLASK_ENV=production          # or 'development'
FLASK_DEBUG=False             # Set to True for debugging
FLASK_PORT=5000              # API port

# Audio Output
AUDIO_OUTPUT_DIR=./audio_output

# Hugging Face Configuration
HUGGINGFACE_TOKEN=hf_...     # Get from https://huggingface.co/settings/tokens

# Proxy Settings (if behind corporate proxy)
HTTPS_PROXY=http://proxy.example.com:8080
HTTP_PROXY=http://proxy.example.com:8080
HF_HOME=/path/to/cache       # Optional: custom cache directory
```

### Frontend Environment Variables

Edit `.env`:

```bash
VITE_API_URL=http://localhost:5000
```

## 🌐 Handling Hugging Face Proxy Issues

The Kokoro model is hosted on Hugging Face. If you encounter proxy errors:

### 1. **Using Hugging Face Token**
```bash
# Get token from https://huggingface.co/settings/tokens
# Add to backend/.env
HUGGINGFACE_TOKEN=hf_your_token_here
```

### 2. **Configure Proxy**
```bash
# In backend/.env
HTTPS_PROXY=http://your-proxy:8080
HTTP_PROXY=http://your-proxy:8080
```

### 3. **Pre-Download Model** (Best for restricted networks)
```bash
# Download model first (requires internet):
python -c "from huggingface_hub import snapshot_download; snapshot_download('hexgrad/Kokoro-82M')"

# Then set offline mode:
# HF_DATASETS_OFFLINE=1
# HF_HOME=/path/to/cache
```

### 4. **Alternative: Model Caching**

The backend automatically caches models in `~/.cache/huggingface`. First download with internet access will be cached for offline use.

## 📡 API Endpoints

### Health Check
```
GET /health
```
Response:
```json
{"status": "ok", "service": "kokoro-tts"}
```

### Get Available Voices and Languages
```
GET /api/voices
```
Response:
```json
{
  "voices": {
    "af_heart": "Female - Warm, friendly",
    "af_sky": "Female - Bright, energetic",
    ...
  },
  "languages": {
    "a": "American English",
    "b": "British English",
    ...
  }
}
```

### Generate Audio (Stream)
```
POST /api/generate
Content-Type: application/json

{
  "text": "Text to convert",
  "voice": "af_heart",
  "lang_code": "a",
  "speed": 1.0
}
```
Returns: WAV audio file (audio/wav)

### Generate Audio File
```
POST /api/generate-file
Content-Type: application/json

{
  "text": "Text to convert",
  "name": "product_name",
  "voice": "af_heart",
  "lang_code": "a",
  "speed": 1.0
}
```
Response:
```json
{
  "success": true,
  "filename": "product_name_1234567890.wav",
  "path": "/path/to/audio_output/...",
  "url": "/audio/product_name_1234567890.wav"
}
```

### Serve Audio File
```
GET /audio/{filename}
```

## 🎨 Using the TTS Component

Import and use in your React app:

```jsx
import TextToSpeech from './components/TextToSpeech';

function App() {
  return (
    <div>
      <TextToSpeech />
    </div>
  );
}
```

## 📚 Using the TTS Hook

```jsx
import { useTTS } from './hooks/useTTS';

function MyComponent() {
  const { generateAudio, playAudio, downloadAudio, voices, languages } = useTTS();

  const handleGenerateSpeech = async () => {
    try {
      const audioUrl = await generateAudio(
        "Hello world",
        "af_heart",  // voice
        "a",         // language code
        1.0          // speed
      );
      playAudio(audioUrl);
    } catch (error) {
      console.error('Failed to generate audio:', error);
    }
  };

  return <button onClick={handleGenerateSpeech}>Generate Speech</button>;
}
```

## 🗣️ Voices Available

### Female Voices
- `af_heart` - American, warm & friendly
- `af_sky` - American, bright & energetic
- `bf_emma` - British, calm
- `bf_isabella` - British, warm

### Male Voices
- `am_adam` - American, neutral
- `am_michael` - American, professional
- `bm_george` - British, warm
- `bm_lewis` - British, calm

## 🌍 Language Codes

| Code | Language |
|------|----------|
| `a` | American English |
| `b` | British English |
| `e` | Spanish |
| `f` | French |
| `h` | Hindi |
| `i` | Italian |
| `j` | Japanese |
| `p` | Portuguese |
| `z` | Mandarin Chinese |

## 🐛 Troubleshooting

### "Failed to download model from Hugging Face"

**Solution:**
1. Check internet connection
2. Add HUGGINGFACE_TOKEN to `.env`
3. Check proxy settings if behind corporate network
4. Try pre-downloading model manually

### "CORS error when calling API"

**Solution:**
Frontend and backend must run on same machine for CORS to work. Update `VITE_API_URL` in `.env` if backend is on different machine.

### "Audio not playing in browser"

**Solution:**
- Check browser console for errors
- Ensure audio format is WAV (24kHz)
- Check speaker volume
- Try downloading file instead

### "Out of memory error"

**Solution:**
- Reduce text length (max 5000 characters)
- Restart backend server
- Check available RAM
- Use GPU if available (automatic with PyTorch)

## 📊 Performance Notes

- **First run**: ~30-60 seconds (downloads model)
- **Subsequent runs**: ~1-2 seconds per 100 words
- **Audio quality**: 24kHz sample rate (professional TTS standard)
- **Output format**: WAV (uncompressed, high quality)
- **Concurrent requests**: Single queue (processed sequentially)

## 🔐 Security Considerations

- Audio files stored in `audio_output/` directory
- Implement authentication if exposed to internet
- Sanitize user input (already done in backend)
- Keep dependencies updated
- Use HTTPS in production

## 📦 Production Deployment

### Using Docker
```bash
docker-compose -f docker-compose.yml up -d

# Check status
docker-compose ps
docker-compose logs kokoro-backend
```

### Manual Deployment
```bash
# Use gunicorn for production
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📝 Integration Examples

### Product Audio Descriptions
```jsx
const generateProductAudio = async (productName, description) => {
  const result = await generateAudioFile(
    description,
    productName,
    'af_heart',
    'a'
  );
  return result.url;
};
```

### Live Product Preview
```jsx
<AudioPlayer
  audioUrl={productAudioUrl}
  onPlay={() => console.log('Playing product description')}
/>
```

## 🆘 Getting Help

- GitHub Issues: https://github.com/hexgrad/kokoro/issues
- Hugging Face: https://huggingface.co/hexgrad/Kokoro-82M
- Discord: https://discord.gg/QuGxSWBfQy

## 📄 License

Kokoro is Apache-licensed. See: https://github.com/hexgrad/kokoro/blob/main/LICENSE
