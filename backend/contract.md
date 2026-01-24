# Visual Finance – API Contract (LOCKED)

This file defines the **non-negotiable API contract** between:
- Backend (AI)
- Browser Extension
- Website Frontend

This contract MUST NOT change during the hackathon.

---

## ✅ Analysis Response Format

Every `/analyze` request MUST return JSON in the following format:

```json
{
  "stock_name": "AAPL",
  "trend": "Uptrend",
  "risk": "Medium",
  "confidence": 0.76,
  "explanation": "The chart shows higher highs with increasing volatility, indicating an uptrend with moderate risk of pullback."
}
