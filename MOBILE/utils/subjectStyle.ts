import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

// Icon and colour for each subject (volume), matched by its title, used on Home.
// Class names are written out in full so Tailwind generates them.

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface SubjectStyle {
  icon: IconName;
  iconColor: string;     // icon glyph colour
  tile: string;          // classes for the square icon tile
  row: string;           // classes for the subject row background + border
}

const PALETTE: Omit<SubjectStyle, 'icon'>[] = [
  { iconColor: '#e11d48', tile: 'bg-rose-100 dark:bg-rose-950', row: 'bg-rose-50 border-rose-200 dark:bg-slate-900 dark:border-rose-900' },
  { iconColor: '#ea580c', tile: 'bg-orange-100 dark:bg-orange-950', row: 'bg-orange-50 border-orange-200 dark:bg-slate-900 dark:border-orange-900' },
  { iconColor: '#7c3aed', tile: 'bg-violet-100 dark:bg-violet-950', row: 'bg-violet-50 border-violet-200 dark:bg-slate-900 dark:border-violet-900' },
  { iconColor: '#059669', tile: 'bg-emerald-100 dark:bg-emerald-950', row: 'bg-emerald-50 border-emerald-200 dark:bg-slate-900 dark:border-emerald-900' },
  { iconColor: '#db2777', tile: 'bg-pink-100 dark:bg-pink-950', row: 'bg-pink-50 border-pink-200 dark:bg-slate-900 dark:border-pink-900' },
  { iconColor: '#2563eb', tile: 'bg-blue-100 dark:bg-blue-950', row: 'bg-blue-50 border-blue-200 dark:bg-slate-900 dark:border-blue-900' },
  { iconColor: '#9333ea', tile: 'bg-purple-100 dark:bg-purple-950', row: 'bg-purple-50 border-purple-200 dark:bg-slate-900 dark:border-purple-900' },
  { iconColor: '#ca8a04', tile: 'bg-yellow-100 dark:bg-yellow-950', row: 'bg-yellow-50 border-yellow-200 dark:bg-slate-900 dark:border-yellow-900' },
  { iconColor: '#0d9488', tile: 'bg-teal-100 dark:bg-teal-950', row: 'bg-teal-50 border-teal-200 dark:bg-slate-900 dark:border-teal-900' },
  { iconColor: '#0284c7', tile: 'bg-sky-100 dark:bg-sky-950', row: 'bg-sky-50 border-sky-200 dark:bg-slate-900 dark:border-sky-900' },
  { iconColor: '#4f46e5', tile: 'bg-indigo-100 dark:bg-indigo-950', row: 'bg-indigo-50 border-indigo-200 dark:bg-slate-900 dark:border-indigo-900' },
  { iconColor: '#65a30d', tile: 'bg-lime-100 dark:bg-lime-950', row: 'bg-lime-50 border-lime-200 dark:bg-slate-900 dark:border-lime-900' },
  { iconColor: '#0891b2', tile: 'bg-cyan-100 dark:bg-cyan-950', row: 'bg-cyan-50 border-cyan-200 dark:bg-slate-900 dark:border-cyan-900' },
];

// Keyword in the title → icon and palette slot.
const RULES: { match: RegExp; icon: IconName; color: number }[] = [
  { match: /cardio|heart/i, icon: 'heart-pulse', color: 0 },
  { match: /digest|gastro/i, icon: 'stomach', color: 1 },
  { match: /english|translation|language/i, icon: 'book-open-page-variant', color: 2 },
  { match: /immun|lymph/i, icon: 'shield-check', color: 3 },
  { match: /integument|skin/i, icon: 'hand-back-right', color: 4 },
  { match: /joint|articul/i, icon: 'human-handsdown', color: 5 },
  { match: /muscul|muscle/i, icon: 'arm-flex', color: 6 },
  { match: /nerv|neuro|brain/i, icon: 'brain', color: 7 },
  { match: /plane|section|orientation/i, icon: 'layers-triple', color: 8 },
  { match: /reproduct/i, icon: 'human-male-female', color: 4 },
  { match: /respirat|lung/i, icon: 'lungs', color: 9 },
  { match: /sample|example/i, icon: 'file-document-outline', color: 10 },
  { match: /skelet|bone/i, icon: 'bone', color: 11 },
  { match: /urin|renal|kidney/i, icon: 'water', color: 12 },
  { match: /endocrin|hormon/i, icon: 'flask-outline', color: 1 },
  { match: /blood|hemat/i, icon: 'water-outline', color: 0 },
];

export const subjectStyle = (title: string, fallbackIndex = 0): SubjectStyle => {
  const rule = RULES.find((r) => r.match.test(title));
  const palette = PALETTE[(rule ? rule.color : fallbackIndex) % PALETTE.length];
  return { icon: rule?.icon ?? 'book-open-variant', ...palette };
};
