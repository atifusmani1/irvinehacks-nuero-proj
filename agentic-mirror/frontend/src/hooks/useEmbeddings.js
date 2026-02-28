/**
 * useEmbeddings — Embeddings Fetch Hook
 * See AGENT.md §7 — POST /embeddings
 * See AGENT.md §9 — The Embeddings Pipeline
 *
 * Called after the debate ends to fetch 2D PCA-reduced coordinates
 * for the Heatmap component.
 */

import { useState, useCallback } from "react";

export function useEmbeddings() {
  const [embeddingData, setEmbeddingData] = useState(null); // EmbeddingsResponse
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch embedding coordinates from the backend.
   *
   * @param {string[]} sentences — Key phrases / agent sentences from the debate
   * @param {string} userInput — The original dilemma text
   */
  const fetchEmbeddings = useCallback(async (sentences, userInput) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: POST to /embeddings with { sentences, user_input: userInput }
      // TODO: Parse response as EmbeddingsResponse
      // TODO: setEmbeddingData(response)
    } catch (err) {
      // TODO: setError(err.message)
      console.error("Failed to fetch embeddings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    embeddingData,
    isLoading,
    error,
    fetchEmbeddings,
  };
}
