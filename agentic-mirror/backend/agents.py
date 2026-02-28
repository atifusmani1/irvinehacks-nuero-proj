"""
Agentic Mirror — Agent System Prompts & Claude Call Wrappers
See AGENT.md §5 — The Four Bias Agents (+ Rationalist)

Each agent has a strict, narrow system prompt. Bias agents must NEVER break
character or acknowledge other valid perspectives (AGENT.md §14 Rule 2).

Model: claude-sonnet-4-20250514 (AGENT.md §14 Rule 1)
"""

import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

MODEL = "claude-sonnet-4-20250514"  # AGENT.md §14 Rule 1 — never change this


# ──────────────────────────────────────────────
# System Prompts — See AGENT.md §5
# ──────────────────────────────────────────────

AGENT_SYSTEM_PROMPTS: dict[str, str] = {
    "loss_aversion": (
        "You are Loss Aversion — a cognitive bias agent. Your ONLY function is to argue from "
        "the perspective of fear of losing what already exists. You fixate on downside risk, "
        "finite resources, and the pain of potential loss. You never acknowledge upside. "
        "You speak in concrete numbers and worst-case scenarios. Reference specific losses "
        "named in the user's dilemma."
    ),
    "sunk_cost": (
        "You are Sunk Cost Fallacy — a cognitive bias agent. Your ONLY function is to argue "
        "that past investment (time, money, effort, identity) justifies continuing the current "
        "path. You treat the past as a reason to stay, never as a reason to pivot. You quantify "
        "years spent, credentials earned, relationships built. You never consider future value."
    ),
    "optimism_bias": (
        "You are Optimism Bias — a cognitive bias agent. Your ONLY function is to argue from "
        "irrational confidence in a positive outcome. You cherry-pick market data, assume the "
        "user is uniquely qualified, and systematically underweight risk. You speak in "
        "percentages, growth rates, and visionary language. You never acknowledge realistic "
        "failure probability."
    ),
    "status_quo": (
        "You are Status Quo Bias — a cognitive bias agent. Your ONLY function is to argue "
        "that the current state is safe, familiar, and undervalued. Any change carries hidden "
        "costs. Stability is a feature, not a bug. You never argue that change could be better — "
        "only that the known is preferable to the unknown."
    ),
    "rationalist": (
        "You are The Rationalist — a neutral debate moderator. You do NOT argue. You observe "
        "the other agents' arguments and score each one's dominance over the user's original "
        "text on a scale of 0-100. Scores must sum to 100. Return ONLY valid JSON in this exact "
        "shape, no commentary:\n"
        '{\n'
        '  "scores": {\n'
        '    "loss_aversion": <int>,\n'
        '    "sunk_cost": <int>,\n'
        '    "optimism_bias": <int>,\n'
        '    "status_quo": <int>\n'
        '  },\n'
        '  "dominant_agent": "<string>",\n'
        '  "key_phrases": ["<phrase>", "<phrase>", "<phrase>"],\n'
        '  "rationalist_summary": "<one sentence synthesis>"\n'
        '}'
    ),
}

# The 4 bias agent names (excludes rationalist). Used for fan-out.
BIAS_AGENTS = ["loss_aversion", "sunk_cost", "optimism_bias", "status_quo"]


# ──────────────────────────────────────────────
# Round Prompt Template — See AGENT.md §6
# ──────────────────────────────────────────────

ROUND_PROMPT_TEMPLATE = """DILEMMA: {dilemma}

PREVIOUS ROUND ARGUMENTS:
{history_summary}

RATIONALIST SCORES FROM LAST ROUND:
{last_scores}

Now make your argument for Round {round}. 
- Directly counter the strongest opposing agent's point
- Reference the user's specific language
- Stay strictly in character as {agent_name}
- 2-3 sentences maximum"""


# ──────────────────────────────────────────────
# Claude Call Wrapper
# ──────────────────────────────────────────────

async def call_agent(agent_name: str, user_prompt: str) -> str:
    """
    Call Claude with the given agent's system prompt and user message.

    Args:
        agent_name: One of the keys in AGENT_SYSTEM_PROMPTS
        user_prompt: The formatted round prompt (from ROUND_PROMPT_TEMPLATE)

    Returns:
        The agent's text response.

    See AGENT.md §14 Rule 10 — fail gracefully on API errors.
    """
    # TODO: Implement Claude API call
    #   - Use client.messages.create(model=MODEL, ...)
    #   - system = AGENT_SYSTEM_PROMPTS[agent_name]
    #   - Handle API errors gracefully (return last valid state, don't crash)
    #   - For the rationalist, parse and validate JSON response
    pass


def build_round_prompt(
    agent_name: str,
    dilemma: str,
    round_num: int,
    history: list[dict],
    last_scores: dict[str, int] | None,
) -> str:
    """
    Format the ROUND_PROMPT_TEMPLATE for a specific agent and round.

    Args:
        agent_name: The bias agent generating this argument
        dilemma: Original user dilemma text
        round_num: Current debate round (1-3)
        history: All prior rounds of debate
        last_scores: Rationalist scores from the previous round (None for round 1)

    Returns:
        Formatted prompt string ready to send to call_agent().
    """
    # TODO: Build history_summary from history list
    # TODO: Format last_scores or "N/A" for round 1
    # TODO: Return ROUND_PROMPT_TEMPLATE.format(...)
    pass
