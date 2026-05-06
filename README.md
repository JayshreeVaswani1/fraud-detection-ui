# Fraud Detection Dashboard

![Dashboard Demo](<Dashboard Demo.png>)

Real-time fraud detection dashboard powered by machine learning.

## Features

- 🔒 Real-time fraud detection
- 📊 Visual risk score indicators
- ⚡ <5ms ML inference latency
- 🎨 Clean, intuitive interface
- 📱 Responsive design

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** CSS3
- **API:** Fetch API
- **ML Backend:** FastAPI with Isolation Forest

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser
open http://localhost:3000
```

## Prerequisites

- Node.js 18+
- ML Service running on port 8000

## Integration

This dashboard connects to:
- [loan-ai-service](https://github.com/JayshreeVaswani1/loan-ai-service) - ML fraud detection API
- [loan-origination-system](https://github.com/JayshreeVaswani1/loan-origination-system) - Main backend (future)

## How It Works

1. User enters transaction details
2. Frontend calls ML service
3. Model analyzes transaction (95% accuracy)
4. Dashboard displays:
   - ✅ APPROVE (low risk)
   - ⚠️ REVIEW (medium risk)
   - 🚫 BLOCK (high risk)

## Development

Built as part of a complete fraud detection platform.

**Author:** Jayshree Vaswani  
**LinkedIn:** [linkedin.com/in/jayshree-vaswani-854081102](https://www.linkedin.com/in/jayshree-vaswani-854081102/)
