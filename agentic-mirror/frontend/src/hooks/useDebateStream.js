/**
 * useDebateStream — SSE Consumer Hook
 * See AGENT.md §7 — POST /debate SSE stream
 * See AGENT.md §14 Rule 4 — SSE over WebSockets
 *
 * Manages a fetch-based SSE connection to the /debate endpoint.
 * Parses SSE events (DebateRoundEvent and FinalEvent) and
 * updates React state for each round.
 *
 * AGENT.md §14 Rule 10 — if the stream errors, preserve last valid state.
 */

import { useState, useCallback, useRef } from "react";

const API_BASE = "http://localhost:8000";

export function useDebateStream() {
  // ── State ──
  const [rounds, setRounds] = useState([]);
  const [scores, setScores] = useState({});
  const [dominantAgent, setDominantAgent] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState(null);

  const readerRef = useRef(null);

  /**
   * Start a new debate session.
   *
   * @param {string} dilemma — The user's dilemma text
   * @param {string|null} primaryConcern — Primary concern category
   * @param {Record<string, number>} biasOverrides — Slider values (0-100 per agent)
   */
  const startDebate = useCallback(async (dilemma, primaryConcern = null, biasOverrides = {}) => {
    // Reset state
    setRounds([]);
    setScores({});
    setDominantAgent("");
    setCurrentSpeaker("");
    setIsDebating(true);
    setFinalResult(null);
    setError(null);

    try {
      const body = { dilemma, bias_overrides: biasOverrides };
      if (primaryConcern) body.primary_concern = primaryConcern;

      const res = await fetch(`${API_BASE}/debate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No response body (streaming not supported)");

      const reader = res.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Split on double-newline (SSE frame boundary)
        const frames = buffer.split("\n\n");
        buffer = frames.pop() || "";

        for (const frame of frames) {
          const dataLine = frame
            .split("\n")
            .find((l) => l.startsWith("data:"));
          if (!dataLine) continue;

          const jsonStr = dataLine.replace(/^data:\s*/, "");
          let event;
          try {
            event = JSON.parse(jsonStr);
          } catch {
            continue;
          }

          if (event.type === "error") {
            setError(event.message || "Stream error");
            setIsDebating(false);
            setCurrentSpeaker("");
            readerRef.current = null;
            return;
          }

          if (event.type === "final") {
            setFinalResult(event);
            setIsDebating(false);
            setCurrentSpeaker("");
            readerRef.current = null;
            return;
          }

          if (event.type === "round") {
            setRounds((prev) => [...prev, event]);
            setScores(event.scores || {});
            setDominantAgent(event.dominant_agent || "");

            // Drip-feed dialogue — highlight each speaker briefly
            if (event.dialogue) {
              for (const turn of event.dialogue) {
                setCurrentSpeaker(turn.agent);
                await new Promise((r) => setTimeout(r, 600));
              }
              setCurrentSpeaker("");
            }
          }
        }
      }

      setIsDebating(false);
      setCurrentSpeaker("");
      readerRef.current = null;
    } catch (e) {
      setError(String(e));
      setIsDebating(false);
      setCurrentSpeaker("");
      readerRef.current = null;
    }
  }, []);

  /**
   * Stop an in-progress debate.
   */
  const stopDebate = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.cancel();
      readerRef.current = null;
    }
    setIsDebating(false);
    setCurrentSpeaker("");
  }, []);

  return {
    rounds,
    scores,
    dominantAgent,
    currentSpeaker,
    isDebating,
    finalResult,
    error,
    startDebate,
    stopDebate,
  };
}
