import type { Track, Lesson, Module } from "./types";
import { javaTrack } from "./java";
import { goTrack } from "./go";
import { backendTrack } from "./backend";
import { englishTrack } from "./english";
import { aiTrack } from "./ai";

export const tracks: Track[] = [
  javaTrack,
  goTrack,
  backendTrack,
  englishTrack,
  aiTrack,
];

export type LessonLocation = {
  track: Track;
  module: Module;
  lesson: Lesson;
  /** Flat index of this lesson within its track (0-based). */
  indexInTrack: number;
};

// Build flat lookups once at module load.
const lessonById = new Map<string, LessonLocation>();
const orderedLessonIdsByTrack = new Map<string, string[]>();

for (const track of tracks) {
  const ids: string[] = [];
  let i = 0;
  for (const module of track.modules) {
    for (const lesson of module.lessons) {
      if (lessonById.has(lesson.id)) {
        // Surface duplicate ids loudly during dev.
        throw new Error(`Lesson id duplicado: ${lesson.id}`);
      }
      lessonById.set(lesson.id, { track, module, lesson, indexInTrack: i });
      ids.push(lesson.id);
      i++;
    }
  }
  orderedLessonIdsByTrack.set(track.id, ids);
}

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getLesson(id: string): LessonLocation | undefined {
  return lessonById.get(id);
}

export function allLessons(): LessonLocation[] {
  return Array.from(lessonById.values());
}

export function totalLessons(): number {
  return lessonById.size;
}

export function totalXpAvailable(): number {
  let sum = 0;
  for (const { lesson } of lessonById.values()) sum += lesson.xp;
  return sum;
}

/** Next lesson in the same track, or null if it's the last one. */
export function nextLessonId(currentId: string): string | null {
  const loc = lessonById.get(currentId);
  if (!loc) return null;
  const ids = orderedLessonIdsByTrack.get(loc.track.id)!;
  const idx = ids.indexOf(currentId);
  return idx >= 0 && idx + 1 < ids.length ? ids[idx + 1] : null;
}

/**
 * A lesson is unlocked if it's the first of its track or the previous
 * lesson in the track is completed. Keeps progression linear but forgiving.
 */
export function isLessonUnlocked(
  lessonId: string,
  completed: Set<string>,
): boolean {
  const loc = lessonById.get(lessonId);
  if (!loc) return false;
  const ids = orderedLessonIdsByTrack.get(loc.track.id)!;
  const idx = ids.indexOf(lessonId);
  if (idx <= 0) return true;
  return completed.has(ids[idx - 1]);
}

/** A module is unlocked when its first lesson is unlocked. */
export function isModuleUnlocked(
  module: Module,
  completed: Set<string>,
): boolean {
  const first = module.lessons[0];
  return first ? isLessonUnlocked(first.id, completed) : true;
}

export function moduleCompletion(module: Module, completed: Set<string>) {
  const done = module.lessons.filter((l) => completed.has(l.id)).length;
  return { done, total: module.lessons.length };
}

export function trackCompletion(track: Track, completed: Set<string>) {
  const ids = orderedLessonIdsByTrack.get(track.id) ?? [];
  const done = ids.filter((id) => completed.has(id)).length;
  return { done, total: ids.length };
}

export type { Track, Lesson, Module } from "./types";
