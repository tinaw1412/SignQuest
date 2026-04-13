import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  // Colors
  colorsWatched: boolean[];
  setColorsWatched: (watched: boolean[]) => void;
  colorsQuizIndex: number;
  setColorsQuizIndex: (index: number) => void;
  colorsQuizScore: number;
  setColorsQuizScore: (score: number) => void;
  colorsQuizCompleted: boolean;
  setColorsQuizCompleted: (completed: boolean) => void;
  // Feelings
  feelingsWatched: boolean[];
  setFeelingsWatched: (watched: boolean[]) => void;
  feelingsQuizIndex: number;
  setFeelingsQuizIndex: (index: number) => void;
  feelingsQuizScore: number;
  setFeelingsQuizScore: (score: number) => void;
  feelingsQuizCompleted: boolean;
  setFeelingsQuizCompleted: (completed: boolean) => void;
  // Daily Quiz
  dailyQuizCompletedDate: string | null;
  setDailyQuizCompletedDate: (date: string | null) => void;
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
  // Colors
  const [colorsWatched, setColorsWatched] = useState<boolean[]>([false, false, false, false, false]);
  const [colorsQuizIndex, setColorsQuizIndex] = useState(0);
  const [colorsQuizScore, setColorsQuizScore] = useState(0);
  const [colorsQuizCompleted, setColorsQuizCompleted] = useState(false);
  // Feelings
  const [feelingsWatched, setFeelingsWatched] = useState<boolean[]>([false, false, false, false]);
  const [feelingsQuizIndex, setFeelingsQuizIndex] = useState(0);
  const [feelingsQuizScore, setFeelingsQuizScore] = useState(0);
  const [feelingsQuizCompleted, setFeelingsQuizCompleted] = useState(false);
  // Daily Quiz
  const [dailyQuizCompletedDate, setDailyQuizCompletedDateState] = useState<string | null>(null);
  const [dailyDateLoaded, setDailyDateLoaded] = useState(false);

  // Load daily completion date from AsyncStorage on mount
  useEffect(() => {
    const loadDailyDate = async () => {
      try {
        const saved = await AsyncStorage.getItem('dailyQuizCompletedDate');
        setDailyQuizCompletedDateState(saved);
      } catch (e) {
        console.error('Failed to load daily quiz date:', e);
      } finally {
        setDailyDateLoaded(true);
      }
    };
    loadDailyDate();
  }, []);

  // Persist daily completion date whenever it changes
  const setDailyQuizCompletedDate = async (date: string | null) => {
    setDailyQuizCompletedDateState(date);
    try {
      if (date) {
        await AsyncStorage.setItem('dailyQuizCompletedDate', date);
      } else {
        await AsyncStorage.removeItem('dailyQuizCompletedDate');
      }
    } catch (e) {
      console.error('Failed to save daily quiz date:', e);
    }
  };

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
        colorsWatched,
        setColorsWatched,
        colorsQuizIndex,
        setColorsQuizIndex,
        colorsQuizScore,
        setColorsQuizScore,
        colorsQuizCompleted,
        setColorsQuizCompleted,
        feelingsWatched,
        setFeelingsWatched,
        feelingsQuizIndex,
        setFeelingsQuizIndex,
        feelingsQuizScore,
        setFeelingsQuizScore,
        feelingsQuizCompleted,
        setFeelingsQuizCompleted,
        dailyQuizCompletedDate,
        setDailyQuizCompletedDate,
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
