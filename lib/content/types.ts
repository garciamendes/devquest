export type CodeLang = "java" | "go" | "sql" | "yaml" | "bash" | "text";
export type RunLang = "java" | "go";

export type Example = {
  title: string;
  lang: CodeLang;
  code: string;
  note?: string;
};

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number; // 0-based index of the correct option
  explain?: string;
};

export type Exercise = {
  prompt: string; // markdown
  lang: RunLang;
  starter: string;
  stdin?: string;
  /** Expected stdout (compared after trimming + collapsing trailing spaces). */
  expectedOutput: string;
  hint?: string;
  solution: string;
};

export type Lesson = {
  id: string; // globally unique slug
  title: string;
  minutes: number;
  xp: number;
  theory: string; // markdown
  examples?: Example[];
  quiz?: QuizQuestion[];
  exercise?: Exercise;
};

export type Module = {
  id: string;
  step?: number; // staircase step (Java track)
  title: string;
  icon: string; // emoji
  summary: string;
  lessons: Lesson[];
};

export type Accent = "java" | "go" | "english" | "backend" | "ai";

export type Track = {
  id: string;
  title: string;
  subtitle: string;
  accent: Accent;
  icon: string;
  modules: Module[];
};
