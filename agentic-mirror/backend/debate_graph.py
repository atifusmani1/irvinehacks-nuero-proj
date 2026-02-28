"""
Agentic Mirror — LangGraph Debate Graph Definition
See AGENT.md §6 — The Debate Loop

Graph Structure (AGENT.md §6):
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

Hard-coded to 3 rounds (AGENT.md §14 Rule 8).
"""

from typing import TypedDict
from langgraph.graph import StateGraph, END

from agents import BIAS_AGENTS, call_agent, build_round_prompt


# ──────────────────────────────────────────────
# State Schema — See AGENT.md §6
# ──────────────────────────────────────────────

class DebateState(TypedDict):
    dilemma: str                        # Original user input
    round: int                          # Current debate round (1-3)
    agent_outputs: dict[str, str]       # Latest argument per agent
    history: list[dict]                 # All prior rounds
    scores: dict[str, int]             # Latest Rationalist scores
    dominant_agent: str                 # Highest scoring agent
    key_phrases: list[str]             # Extracted salient phrases
    bias_overrides: dict[str, int]     # User slider values (0-100)


MAX_ROUNDS = 3  # AGENT.md §14 Rule 8 — exactly 3 rounds


# ──────────────────────────────────────────────
# Node Functions
# ──────────────────────────────────────────────

async def bias_agent_node(state: DebateState, agent_name: str) -> dict:
    """
    Node for a single bias agent. Builds the round prompt, calls Claude,
    and returns the agent's argument.

    This runs in parallel with the other 3 bias agents during fan-out.
    """
    # TODO: Build prompt with build_round_prompt()
    # TODO: Apply bias_overrides — if override < 100, scale down this agent's influence
    # TODO: Call call_agent(agent_name, prompt)
    # TODO: Return updated agent_outputs
    pass


async def rationalist_node(state: DebateState) -> dict:
    """
    The Rationalist moderator node. Receives all 4 bias agent outputs,
    scores their dominance, and emits an SSE event.

    Runs after the parallel fan-out join.
    See AGENT.md §5 (Agent 5) for the expected JSON output shape.
    See AGENT.md §14 Rule 3 — scores must sum to 100.
    """
    # TODO: Format all agent outputs into a single prompt for the Rationalist
    # TODO: Call call_agent("rationalist", prompt)
    # TODO: Parse JSON response, validate scores sum to 100
    # TODO: Update state with scores, dominant_agent, key_phrases
    # TODO: Emit SSE event (DebateRoundEvent) via callback
    # TODO: Increment round counter
    pass


def should_continue(state: DebateState) -> str:
    """
    Conditional edge: loop back for another round or end.
    Returns "continue" if round < MAX_ROUNDS, "end" otherwise.
    """
    # TODO: Check state["round"] against MAX_ROUNDS
    # TODO: Return "continue" or "end"
    pass


# ──────────────────────────────────────────────
# Graph Construction
# ──────────────────────────────────────────────

def build_debate_graph() -> StateGraph:
    """
    Constructs the LangGraph StateGraph for the multi-agent debate.

    Structure:
        - 4 bias agent nodes run in parallel (fan-out)
        - Rationalist node joins and scores (fan-in)
        - Conditional edge loops back for 3 total rounds
        - After round 3, transitions to END

    Returns:
        Compiled LangGraph StateGraph ready to invoke.
    """
    # TODO: Create StateGraph(DebateState)
    # TODO: Add bias agent nodes (parallel fan-out)
    # TODO: Add rationalist node (fan-in / join)
    # TODO: Add conditional edge (should_continue)
    # TODO: Set entry point
    # TODO: Compile and return graph
    pass
