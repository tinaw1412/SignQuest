import React, { createContext, useState, useContext, ReactNode } from 'react';

type LessonProgressContextType = {
  // Greetings
  greetingsWatched: boolean[];
  setGreetingsWatched: (watched: boolean[]) => void;
  greetingsQuizIndex: number;
  setGreetingsQuizIndex: (index: number) => void;
  greetingsQuizScore: number;
  setGreetingsQuizScore: (score: number) => void;
  greetingsQuizCompleted: boolean;
  setGreetingsQuizCompleted: (completed: boolean) => void;
  // Animals
  animalsWatched: boolean[];
  setAnimalsWatched: (watched: boolean[]) => void;
  animalsQuizIndex: number;
  setAnimalsQuizIndex: (index: number) => void;
  animalsQuizScore: number;
  setAnimalsQuizScore: (score: number) => void;
  animalsQuizCompleted: boolean;
  setAnimalsQuizCompleted: (completed: boolean) => void;
};

const LessonProgressContext = createContext<LessonProgressContextType | undefined>(undefined);

export function LessonProgressProvider({ children }: { children: ReactNode }) {
  // Greetings
  const [greetingsWatched, setGreetingsWatched] = useState<boolean[]>([false, false, false]);
  const [greetingsQuizIndex, setGreetingsQuizIndex] = useState(0);
  const [greetingsQuizScore, setGreetingsQuizScore] = useState(0);
  const [greetingsQuizCompleted, setGreetingsQuizCompleted] = useState(false);
  // Animals
  const [animalsWatched, setAnimalsWatched] = useState<boolean[]>([false, false, false, false]);
  const [animalsQuizIndex, setAnimalsQuizIndex] = useState(0);
  const [animalsQuizScore, setAnimalsQuizScore] = useState(0);
  const [animalsQuizCompleted, setAnimalsQuizCompleted] = useState(false);

  return (
    <LessonProgressContext.Provider
      value={{
        greetingsWatched,
        setGreetingsWatched,
        greetingsQuizIndex,
        setGreetingsQuizIndex,
        greetingsQuizScore,
        setGreetingsQuizScore,
        greetingsQuizCompleted,
        setGreetingsQuizCompleted,
        animalsWatched,
        setAnimalsWatched,
        animalsQuizIndex,
        setAnimalsQuizIndex,
        animalsQuizScore,
        setAnimalsQuizScore,
        animalsQuizCompleted,
        setAnimalsQuizCompleted,
      }}
    >
      {children}
    </LessonProgressContext.Provider>
  );
}

export function useLessonProgress() {
  const context = useContext(LessonProgressContext);
  if (!context) {
    throw new Error('useLessonProgress must be used within LessonProgressProvider');
  }
  return context;
}
