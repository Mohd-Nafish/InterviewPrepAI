import { useCallback, useEffect, useRef, useState } from 'react';

import { isMockModeEnabled } from '@/config/env';
import { getErrorMessage } from '@/services/errors';
import { generateInterviewPrep, type GenerateSource } from '@/services/interviewService';
import { getLastApiCallAt, setLastApiCallAt } from '@/services/apiUsageStorage';
import { saveSession } from '@/services/sessionStorage';
import type { InterviewPrepResult, InterviewRole } from '@/types/interview';
import { buildPrepCacheKey } from '@/utils/hashInput';
import { GENERATE_COOLDOWN_MS } from '@/constants/api';

type LoadingPhase = 'idle' | 'checking' | 'generating';

type State = {
  loading: boolean;
  loadingPhase: LoadingPhase;
  error: string | null;
  notice: string | null;
  result: InterviewPrepResult | null;
  lastSource: GenerateSource | null;
  cooldownRemainingMs: number;
};

export type GenerateResponse = {
  result: InterviewPrepResult;
  notice?: string;
};

const inFlightRequests = new Map<string, Promise<GenerateResponse | null>>();

function getCooldownRemainingMs(lastApiCallAt: number | null): number {
  if (!lastApiCallAt) return 0;
  const elapsed = Date.now() - lastApiCallAt;
  return Math.max(0, GENERATE_COOLDOWN_MS - elapsed);
}

export function useInterviewPrep() {
  const [state, setState] = useState<State>({
    loading: false,
    loadingPhase: 'idle',
    error: null,
    notice: null,
    result: null,
    lastSource: null,
    cooldownRemainingMs: 0,
  });

  const isGeneratingRef = useRef(false);

  const refreshCooldown = useCallback(async () => {
    if (isMockModeEnabled()) {
      setState((prev) => ({ ...prev, cooldownRemainingMs: 0 }));
      return;
    }

    const lastApiCallAt = await getLastApiCallAt();
    setState((prev) => ({
      ...prev,
      cooldownRemainingMs: getCooldownRemainingMs(lastApiCallAt),
    }));
  }, []);

  useEffect(() => {
    refreshCooldown();
  }, [refreshCooldown]);

  useEffect(() => {
    if (state.cooldownRemainingMs <= 0) return;

    const intervalId = setInterval(() => {
      refreshCooldown();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [refreshCooldown, state.cooldownRemainingMs]);

  const generate = useCallback(async (jobDescription: string, role: InterviewRole | null) => {
    const trimmed = jobDescription.trim();

    if (!trimmed) {
      setState((prev) => ({
        ...prev,
        error: 'Please paste a job description to continue.',
      }));
      return null;
    }

    if (!role) {
      setState((prev) => ({
        ...prev,
        error: 'Please select a target role.',
      }));
      return null;
    }

    if (isGeneratingRef.current) {
      return null;
    }

    const requestKey = buildPrepCacheKey(trimmed, role);
    const existingRequest = inFlightRequests.get(requestKey);
    if (existingRequest) {
      setState((prev) => ({
        ...prev,
        loading: true,
        loadingPhase: 'checking',
        error: null,
      }));
      return existingRequest;
    }

    isGeneratingRef.current = true;

    const run = async (): Promise<GenerateResponse | null> => {
      setState((prev) => ({
        ...prev,
        loading: true,
        loadingPhase: 'checking',
        error: null,
        notice: null,
        result: null,
        lastSource: null,
      }));

      try {
        const { result, source, notice } = await generateInterviewPrep({
          jobDescription: trimmed,
          role,
        });

        if (source === 'api') {
          await setLastApiCallAt();
        }

        await saveSession({ jobDescription: trimmed, result }).catch(() => null);

        const lastApiCallAt = isMockModeEnabled() ? null : await getLastApiCallAt();

        setState({
          loading: false,
          loadingPhase: 'idle',
          error: null,
          notice: notice ?? null,
          result,
          lastSource: source,
          cooldownRemainingMs: getCooldownRemainingMs(lastApiCallAt),
        });

        return { result, notice: notice ?? undefined };
      } catch (error) {
        const lastApiCallAt = await getLastApiCallAt();

        setState({
          loading: false,
          loadingPhase: 'idle',
          error: getErrorMessage(error),
          notice: null,
          result: null,
          lastSource: null,
          cooldownRemainingMs: getCooldownRemainingMs(lastApiCallAt),
        });
        return null;
      }
    };

    const promise = run().finally(() => {
      isGeneratingRef.current = false;
      inFlightRequests.delete(requestKey);
    });

    inFlightRequests.set(requestKey, promise);
    return promise;
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, notice: null }));
  }, []);

  const isCooldown = !isMockModeEnabled() && state.cooldownRemainingMs > 0;

  return {
    loading: state.loading,
    loadingPhase: state.loadingPhase,
    error: state.error,
    notice: state.notice,
    result: state.result,
    lastSource: state.lastSource,
    cooldownRemainingMs: state.cooldownRemainingMs,
    isCooldown,
    isMockMode: isMockModeEnabled(),
    generate,
    clearError,
  };
}
