/**
 * useDebateStream — SSE Consumer Hook
 * See AGENT.md §7 — POST /debate SSE stream
 * See AGENT.md §14 Rule 4 — SSE over WebSockets
 *
 * Manages an EventSource connection to the /debate endpoint.
 * Parses SSE events (DebateRoundEvent and FinalEvent) and
 * updates React state for each round.
 *
 * AGENT.md §14 Rule 10 — if the stream errors, preserve last valid state.
 */

import { useState, useCallback, useRef } from "react";

export function useDebateStream() {
  // ── State ──
  const [rounds, setRounds] = useState([]);           // Array of DebateRoundEvent
  const [scores, setScores] = useState({});            // Latest scores
  const [dominantAgent, setDominantAgent] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [finalResult, setFinalResult] = useState(null); // FinalEvent or null
  const [error, setError] = useState(null);

  const eventSourceRef = useRef(null);

  /**
   * Start a new debate session.
   *
   * @param {string} dilemma — The user's dilemma text
   * @param {Record<string, number>} biasOverrides — Slider values (0-100 per agent)
   */
  const startDebate = useCallback(async (dilemma, biasOverrides = {}) => {
    // Reset state
    setRounds([]);
    setScores({});
    setDominantAgent("");
    setIsDebating(true);
    setFinalResult(null);
    setError(null);

    // TODO: POST to /debate with { dilemma, bias_overrides: biasOverrides }
    // TODO: Read the response as an SSE stream
    // TODO: On each "data:" event:
    //   - Parse JSON
    //   - If event.type === "final" → setFinalResult(event), setIsDebating(false)
    //   - Otherwise → append to rounds, update scores and dominantAgent
    // TODO: On error → setError, preserve last valid state, setIsDebating(false)
    // TODO: Handle stream close cleanly
  }, []);

  /**
   * Stop an in-progress debate.
   */
  const stopDebate = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsDebating(false);
  }, []);

  return {
    rounds,
    scores,
    dominantAgent,
    isDebating,
    finalResult,
    error,
    startDebate,
    stopDebate,
  };
}
