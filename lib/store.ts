import { create } from "zustand";

export type ForgeStep = "input" | "interview" | "generating" | "output";

interface Question {
  id: string;
  text: string;
  type: "select" | "multiselect" | "text";
  options?: string[];
}

interface ForgeState {
  step: ForgeStep;
  idea: string;
  category: string;
  questions: Question[];
  answers: Record<string, string | string[]>;
  generatedPrompt: string;
  provider: string;
  model: string;
  tokens: number;
  isLoading: boolean;
  error: string | null;

  setStep: (step: ForgeStep) => void;
  setIdea: (idea: string) => void;
  setCategory: (category: string) => void;
  setQuestions: (questions: Question[]) => void;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  setGeneratedPrompt: (prompt: string) => void;
  setProviderInfo: (provider: string, model: string, tokens: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  step: "input" as ForgeStep,
  idea: "",
  category: "",
  questions: [] as Question[],
  answers: {} as Record<string, string | string[]>,
  generatedPrompt: "",
  provider: "",
  model: "",
  tokens: 0,
  isLoading: false,
  error: null as string | null,
};

export const useForgeStore = create<ForgeState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setIdea: (idea) => set({ idea }),
  setCategory: (category) => set({ category }),
  setQuestions: (questions) => set({ questions }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  setGeneratedPrompt: (prompt) => set({ generatedPrompt: prompt }),
  setProviderInfo: (provider, model, tokens) =>
    set({ provider, model, tokens }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
