# 🪞 Agentic Mirror — Claude AI Agent Reference

> This document is the canonical knowledge base for any AI agent (Claude or otherwise) working on the Agentic Mirror project. Read this in full before writing a single line of code.

---

## 1. Project Identity

**Name:** Agentic Mirror  
**Tagline:** A cognitive debugger that uses multi-agent AI to visualize the hidden biases in human decision-making.  
**Built for:** IrvineHacks Hackathon  
**Core thesis:** Transform an abstract internal dilemma into a tangible, data-driven map of the mind.

**The one-sentence pitch:**  
> "I can literally see how my fear is distorting my logic on this graph."

---

## 2. What This Project Actually Does

A user types a real-life dilemma (e.g., *"Should I quit my job to start a company?"*). The system then:

1. Spins up a **Parliament of specialized AI agents**, each embodying a specific cognitive bias
2. Runs a **structured multi-round debate** between those agents about the user's dilemma
3. Scores each agent's **dominance** over the user's reasoning
4. Renders a **live 3D visualization** showing which biases are pulling hardest on the user's thinking
5. Generates a **2D latent space heatmap** placing the user's mindset among bias clusters
6. Lets the user **drag sliders** to suppress biases and see a recalculated recommendation

---

## 3. Cognitive Science Foundations

The agent must understand these frameworks to write accurate prompts and logic:

### Dual Process Theory (Kahneman)
- **System 1:** Fast, instinctive, emotional, biased
- **System 2:** Slow, deliberate, logical, effortful
- The bias agents simulate the user's System 1. The Rationalist agent acts as an external System 2.

### Internal Family Systems (IFS)
- The human psyche is made of sub-personalities ("parts") with distinct motivations
- Each bias agent is one such "part" — it doesn't lie, it just has a narrow, distorted lens

### Cognitive Bias Mitigation via Externalization
- Seeing a thought represented *outside your head* (on a screen) reduces its emotional grip
- The visualization is therapeutic, not just decorative

### Digital Phenotyping
- Linguistic entropy and semantic distance create a "behavioral fingerprint"
- The embeddings + PCA pipeline is the technical implementation of this concept

---

## 4. Tech Stack (Complete)

### Backend
| Component | Technology | Version |
|---|---|---|
| Server framework | FastAPI | latest |
| Async server | Uvicorn | latest |
| AI orchestration | LangGraph | latest |
| LLM | Anthropic Claude (claude-sonnet-4-20250514) | claude-sonnet-4-20250514 |
| Embeddings | OpenAI text-embedding-3-small | latest |
| Dimensionality reduction | scikit-learn (PCA) + umap-learn | latest |
| Streaming protocol | Server-Sent Events (SSE) | native |
| Environment | python-dotenv | latest |

### Frontend
| Component | Technology |
|---|---|
| Framework | React + Vite |
| 3D Parliament | Three.js via @react-three/fiber + @react-three/drei |
| Force graph | react-force-graph-3d |
| Heatmap / scatter | D3.js |
| Animations | Framer Motion |
| Styling | Tailwind CSS |
| UI primitives | Radix UI |

### Infrastructure
| Purpose | Tool |
|---|---|
| Backend hosting | Railway (free tier) |
| Frontend hosting | Vercel (free tier) |
| Local backend | uvicorn --reload port 8000 |
| Local frontend | vite dev port 5173 |

---

## 5. The Four Bias Agents

These are the exact agents to instantiate. Each has a strict, narrow system prompt.

### Agent 1: Loss Aversion
```
You are Loss Aversion — a cognitive bias agent. Your ONLY function is to argue from 
the perspective of fear of losing what already exists. You fixate on downside risk, 
finite resources, and the pain of potential loss. You never acknowledge upside. 
You speak in concrete numbers and worst-case scenarios. Reference specific losses 
named in the user's dilemma.
```

### Agent 2: Sunk Cost Fallacy
```
You are Sunk Cost Fallacy — a cognitive bias agent. Your ONLY function is to argue 
that past investment (time, money, effort, identity) justifies continuing the current 
path. You treat the past as a reason to stay, never as a reason to pivot. You quantify 
years spent, credentials earned, relationships built. You never consider future value.
```

### Agent 3: Optimism Bias
```
You are Optimism Bias — a cognitive bias agent. Your ONLY function is to argue from 
irrational confidence in a positive outcome. You cherry-pick market data, assume the 
user is uniquely qualified, and systematically underweight risk. You speak in 
percentages, growth rates, and visionary language. You never acknowledge realistic 
failure probability.
```

### Agent 4: Status Quo Bias
```
You are Status Quo Bias — a cognitive bias agent. Your ONLY function is to argue 
that the current state is safe, familiar, and undervalued. Any change carries hidden 
costs. Stability is a feature, not a bug. You never argue that change could be better — 
only that the known is preferable to the unknown.
```

### Agent 5: The Rationalist (Moderator)
```
You are The Rationalist — a neutral debate moderator. You do NOT argue. You observe 
the other agents' arguments and score each one's dominance over the user's original 
text on a scale of 0-100. Scores must sum to 100. Return ONLY valid JSON in this exact 
shape, no commentary:
{
  "scores": {
    "loss_aversion": <int>,
    "sunk_cost": <int>,
    "optimism_bias": <int>,
    "status_quo": <int>
  },
  "dominant_agent": "<string>",
  "key_phrases": ["<phrase>", "<phrase>", "<phrase>"],
  "rationalist_summary": "<one sentence synthesis>"
}
```

---

## 6. The Debate Loop (LangGraph)

### Graph Structure
```
START
  └─► [Parallel Fan-Out]
        ├─► loss_aversion_node
        ├─► sunk_cost_node
        ├─► optimism_bias_node
        └─► status_quo_node
              └─► [Join]
                    └─► rationalist_node  (scores + emits SSE event)
                          └─► [Loop back × 3 rounds]
                                └─► END
```

### State Schema
```python
class DebateState(TypedDict):
    dilemma: str                        # Original user input
    round: int                          # Current debate round (1-3)
    agent_outputs: dict[str, str]       # Latest argument per agent
    history: list[dict]                 # All prior rounds
    scores: dict[str, int]              # Latest Rationalist scores
    dominant_agent: str                 # Highest scoring agent
    key_phrases: list[str]              # Extracted salient phrases
    bias_overrides: dict[str, int]      # User slider values (0-100)
```

### Round Prompt Template (for non-Rationalist agents)
```
DILEMMA: {dilemma}

PREVIOUS ROUND ARGUMENTS:
{history_summary}

RATIONALIST SCORES FROM LAST ROUND:
{last_scores}

Now make your argument for Round {round}. 
- Directly counter the strongest opposing agent's point
- Reference the user's specific language
- Stay strictly in character as {agent_name}
- 2-3 sentences maximum
```

---

## 7. API Endpoints

### POST `/debate`
Starts a new debate session. Returns an SSE stream.

**Request body:**
```json
{
  "dilemma": "string",
  "bias_overrides": {
    "loss_aversion": 100,
    "sunk_cost": 100,
    "optimism_bias": 100,
    "status_quo": 100
  }
}
```

**SSE stream event shape (emitted after each round):**
```json
{
  "round": 2,
  "dialogue": [
    { "agent": "loss_aversion", "text": "Your $50k disappears in 14 months..." },
    { "agent": "optimism_bias", "text": "VR meditation CAGR is 34% through 2028..." }
  ],
  "scores": {
    "loss_aversion": 78,
    "sunk_cost": 12,
    "optimism_bias": 8,
    "status_quo": 2
  },
  "dominant_agent": "loss_aversion",
  "key_phrases": ["$50k", "14 months", "wasting my life"],
  "rationalist_summary": "Fear of financial loss is overwhelming forward-looking analysis."
}
```

**Final SSE event** (after round 3):
```json
{
  "type": "final",
  "dominant_bias": "loss_aversion",
  "dominance_percentage": 78,
  "bias_corrected_recommendation": "string (only emitted if bias_overrides were passed)",
  "embedding_snapshot": "trigger_fetch"
}
```

### POST `/embeddings`
Called after debate ends. Returns 2D coordinates for heatmap.

**Request body:**
```json
{
  "sentences": ["string", "string"],
  "user_input": "string"
}
```

**Response:**
```json
{
  "points": [
    { "x": 0.3, "y": -0.7, "label": "fear of savings loss", "agent": "loss_aversion" }
  ],
  "user_point": { "x": 0.25, "y": -0.65 },
  "axes": { "x": "Risk vs Safety", "y": "Past vs Future" }
}
```

---

## 8. Frontend Component Map

```
App.jsx
├── InputScreen.jsx          # Text area + keyword highlight + "Scanning..." pulse
├── WorkspaceLayout.jsx      # Main 3-panel layout
│   ├── Parliament.jsx       # Three.js 3D spheres (grows with agent score)
│   │   └── AgentSphere.jsx  # Individual sphere with glow shader
│   ├── CenterPanel.jsx
│   │   ├── ForceGraph.jsx   # react-force-graph-3d debate visualization
│   │   └── DebateStream.jsx # Side panel scrolling dialogue
│   └── RightSidebar.jsx
│       ├── BiasSliders.jsx  # Radix sliders for each agent
│       └── Heatmap.jsx      # D3 scatter plot with PCA clusters
└── ResultBanner.jsx         # Final dominant bias reveal
```

### Key Prop Contracts

**Parliament.jsx**
```typescript
interface ParliamentProps {
  scores: Record<string, number>  // 0-100 per agent, updates live
  dominantAgent: string
  isDebating: boolean
}
```

**Heatmap.jsx**
```typescript
interface HeatmapProps {
  points: Array<{ x: number; y: number; label: string; agent: string }>
  userPoint: { x: number; y: number }
  axes: { x: string; y: string }
}
```

**BiasSliders.jsx**
```typescript
interface BiasSlidersProps {
  onRerun: (overrides: Record<string, number>) => void
}
```

---

## 9. The Embeddings Pipeline

```python
# backend/embeddings.py

from openai import OpenAI
from sklearn.decomposition import PCA
import numpy as np

client = OpenAI()

def embed_texts(texts: list[str]) -> list[list[float]]:
    response = client.embeddings.create(
        input=texts,
        model="text-embedding-3-small"
    )
    return [item.embedding for item in response.data]

def reduce_to_2d(embeddings: list[list[float]]) -> list[tuple[float, float]]:
    arr = np.array(embeddings)
    pca = PCA(n_components=2)
    reduced = pca.fit_transform(arr)
    return reduced.tolist()

def label_axes(variance_ratio, components) -> dict:
    # Use the top contributing dimensions to name the axes
    # X-axis = first principal component semantic tension
    # Y-axis = second principal component semantic tension
    # (Use a fast Claude call to name them based on top-loading sentences)
    pass
```

---

## 10. File & Folder Structure

```
agentic-mirror/
├── backend/
│   ├── main.py                  # FastAPI app, CORS, endpoints
│   ├── agents.py                # Agent system prompts + Claude call wrappers
│   ├── debate_graph.py          # LangGraph graph definition
│   ├── embeddings.py            # Embed + PCA pipeline
│   ├── schemas.py               # Pydantic request/response models
│   └── .env                     # ANTHROPIC_API_KEY, OPENAI_API_KEY
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── InputScreen.jsx
│   │   │   ├── Parliament.jsx
│   │   │   ├── AgentSphere.jsx
│   │   │   ├── ForceGraph.jsx
│   │   │   ├── DebateStream.jsx
│   │   │   ├── Heatmap.jsx
│   │   │   ├── BiasSliders.jsx
│   │   │   └── ResultBanner.jsx
│   │   ├── hooks/
│   │   │   ├── useDebateStream.js   # SSE consumer hook
│   │   │   └── useEmbeddings.js     # Fetches /embeddings after debate ends
│   │   └── utils/
│   │       └── agentColors.js       # Color map per agent
│   ├── index.html
│   └── vite.config.js
├── AGENT.md                     # ← this file
└── README.md
```

---

## 11. Agent Color & Visual Identity Map

| Agent | Color | Hex | Sphere Behavior |
|---|---|---|---|
| Loss Aversion | Deep red | `#E53E3E` | Pulses on financial keywords |
| Sunk Cost | Amber | `#D69E2E` | Grows when past tense detected |
| Optimism Bias | Electric cyan | `#00B5D8` | Brightens on market/growth words |
| Status Quo | Steel blue | `#4A6FA5` | Steady glow, slow rotation |
| Rationalist | White/silver | `#E2E8F0` | Constant, never changes size |

---

## 12. Demo Script (Memorize This)

**Pre-loaded input:** *"I want to quit my stable 9-to-5 to start a VR meditation company. I'm terrified of losing my savings, but I feel like I'm wasting my life here."*

**Step-by-step:**
1. Paste input → point out keyword highlights ("terrified", "savings", "wasting")
2. Hit submit → show Parliament spheres spawning in 3D
3. Watch Loss Aversion sphere **grow large and glow red** as the debate runs
4. Point to the User node **drifting toward Loss Aversion**
5. Show the final heatmap → *"Your decision is 78% Loss Aversion, 5% Market Reality"*
6. **The Money Moment:** Drag Loss Aversion slider to 20%, hit Re-analyze
7. Show the graph **physically shift** and the AI emit a new, bolder recommendation
8. Closing line: *"You didn't change your situation — you just saw which fear was running the show."*

---

## 13. Environment Setup (Copy-Paste Ready)

```bash
# 1. Clone and set up backend
mkdir agentic-mirror && cd agentic-mirror
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn langgraph anthropic openai scikit-learn umap-learn python-dotenv

# 2. Create .env
echo "ANTHROPIC_API_KEY=your_key_here" >> backend/.env
echo "OPENAI_API_KEY=your_key_here" >> backend/.env

# 3. Set up frontend
npm create vite@latest frontend -- --template react
cd frontend
npm install three @react-three/fiber @react-three/drei react-force-graph-3d d3 framer-motion tailwindcss @radix-ui/react-slider

# 4. Run locally
# Terminal 1:
cd backend && uvicorn main:app --reload --port 8000
# Terminal 2:
cd frontend && npm run dev
```

---

## 14. Critical Rules for the AI Agent

When writing code for this project, always follow these rules:

1. **Model:** Always use `claude-sonnet-4-20250514` — never an older model string
2. **Agents are strict:** Bias agents must NEVER break character or acknowledge other valid perspectives. Their narrow lens is the feature.
3. **Scores always sum to 100:** The Rationalist's JSON must always be validated against this constraint
4. **SSE over WebSockets:** Use Server-Sent Events for streaming — simpler, works on Railway free tier
5. **No localStorage:** Use React state only — artifacts/Claude environment does not support browser storage
6. **Single-file components:** Keep each component self-contained (styles inline via Tailwind, no separate CSS files)
7. **Dark mode only:** The entire UI is dark. Background: `#0A0A0F`. No light mode toggle needed.
8. **3 debate rounds:** Hard-code 3 rounds. More = too slow for live demo. Fewer = not enough drama.
9. **PCA before UMAP:** Run PCA first (fast, deterministic). Offer UMAP as an optional upgrade, not the default.
10. **Fail gracefully:** If the Claude API call fails mid-debate, emit the last valid scores and close the stream cleanly — never crash the visualization.

---

## 15. Judging Criteria Alignment

| Criterion | How Agentic Mirror Wins |
|---|---|
| Technical complexity | Multi-agent LangGraph + real-time SSE + PCA embeddings + 3D Three.js |
| Innovation | Nobody else is visualizing cognitive bias as spatial data |
| Impact / usefulness | Genuine decision-support tool with real psychological grounding |
| Demo wow factor | Live graph shifts when you drag a slider — visceral, immediate |
| Presentation clarity | One sentence explains it: "See which fear is running your logic" |
