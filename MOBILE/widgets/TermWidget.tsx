import React from 'react';
import { FlexWidget, TextWidget, WidgetInfo } from 'react-native-android-widget';
import { BOOKMARKS_LINK, SEARCH_LINK, termLink, ViewTerm, WidgetView } from './data';

// Home-screen widget. It changes layout with its size, so you can resize it freely:
//   small  (2×1, 3×1)  – today's term
//   square (2×2)       – term, volume and "Another term"
//   medium (4×2)       – + word parts, streak and "Continue"
//   large  (4×3 and up) – + meaning, progress bar, recent terms and quick actions

const WHITE = '#ffffff';
const SOFT = '#dbeafe';
const CHIP = 'rgba(255, 255, 255, 0.18)' as const;
const PAD = 14;

type Size = { width: number; height: number };

const partsLine = (view: WidgetView) =>
  view.daily?.parts?.parts.map(([text, meaning]) => (meaning ? `${text} (${meaning})` : text)).join('  +  ') ?? '';

function Chip({ text, uri, action, label, flex }: { text: string; uri?: string; action?: string; label: string; flex?: number }) {
  return (
    <FlexWidget
      clickAction={uri ? 'OPEN_URI' : action}
      clickActionData={uri ? { uri } : undefined}
      accessibilityLabel={label}
      style={{ flex, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 7, paddingHorizontal: 10, borderRadius: 12, backgroundColor: CHIP }}
    >
      <TextWidget text={text} style={{ fontSize: 12, fontWeight: 'bold', color: WHITE }} maxLines={1} truncate="END" />
    </FlexWidget>
  );
}

function Header({ view, showStreak }: { view: WidgetView; showStreak: boolean }) {
  const label = view.daily?.isToday === false ? 'ANOTHER TERM' : 'TERM OF THE DAY';
  return (
    <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <TextWidget text={label} style={{ fontSize: 10, fontWeight: 'bold', color: SOFT, letterSpacing: 0.1 }} />
      {showStreak ? (
        <TextWidget
          text={view.streak > 0 ? `🔥 ${view.streak} day${view.streak === 1 ? '' : 's'}` : '🔥 Start a streak'}
          style={{ fontSize: 11, fontWeight: 'bold', color: WHITE }}
        />
      ) : (
        <TextWidget text="R&M" style={{ fontSize: 10, fontWeight: 'bold', color: SOFT }} />
      )}
    </FlexWidget>
  );
}

function DailyTerm({ term, big, lines }: { term: ViewTerm; big: boolean; lines: number }) {
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: termLink(term) }}
      accessibilityLabel={`${term.Term}. Tap to open.`}
      style={{ width: 'match_parent', flexDirection: 'column', marginTop: 2 }}
    >
      <TextWidget text={term.Term} style={{ fontSize: big ? 24 : 18, fontWeight: 'bold', color: WHITE }} maxLines={lines} truncate="END" />
      {!!term.volume && <TextWidget text={term.volume} style={{ fontSize: 12, color: SOFT }} maxLines={1} truncate="END" />}
    </FlexWidget>
  );
}

function Progress({ view, width }: { view: WidgetView; width: number }) {
  const fraction = view.total ? view.viewed / view.total : 0;
  const fill = Math.round(fraction * width);
  return (
    <FlexWidget style={{ width: 'match_parent', flexDirection: 'column', marginTop: 10 }}>
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextWidget text="Your progress" style={{ fontSize: 11, color: SOFT }} />
        <TextWidget text={`${view.viewed} / ${view.total} terms  •  ${Math.round(fraction * 100)}%`} style={{ fontSize: 11, fontWeight: 'bold', color: WHITE }} />
      </FlexWidget>
      <FlexWidget style={{ width, height: 6, marginTop: 4, borderRadius: 3, backgroundColor: CHIP, flexDirection: 'row' }}>
        {fill > 0 ? <FlexWidget style={{ width: fill, height: 6, borderRadius: 3, backgroundColor: '#67e8f9' }} /> : <FlexWidget style={{ width: 1, height: 6 }} />}
      </FlexWidget>
    </FlexWidget>
  );
}

function RecentList({ terms }: { terms: ViewTerm[] }) {
  return (
    <FlexWidget style={{ width: 'match_parent', flexDirection: 'column', marginTop: 10 }}>
      <TextWidget text="RECENTLY VIEWED" style={{ fontSize: 10, fontWeight: 'bold', color: SOFT, letterSpacing: 0.1 }} />
      {terms.map((t) => (
        <FlexWidget
          key={t.TermId}
          clickAction="OPEN_URI"
          clickActionData={{ uri: termLink(t) }}
          accessibilityLabel={`Open ${t.Term}`}
          style={{ width: 'match_parent', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: CHIP }}
        >
          <TextWidget text={t.Term} style={{ fontSize: 13, fontWeight: 'bold', color: WHITE }} maxLines={1} truncate="END" />
          <TextWidget text="›" style={{ fontSize: 15, fontWeight: 'bold', color: WHITE }} />
        </FlexWidget>
      ))}
    </FlexWidget>
  );
}

function EmptyWidget({ size }: { size: Size }) {
  const small = size.height < 90;
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      accessibilityLabel="Roots and Morphology. Open the app to load your terms."
      style={{ height: 'match_parent', width: 'match_parent', borderRadius: 22, padding: PAD, justifyContent: 'center' }}
    >
      {!small && <TextWidget text="ROOTS & MORPHOLOGY" style={{ fontSize: 10, fontWeight: 'bold', color: SOFT, letterSpacing: 0.1 }} />}
      <TextWidget text="Open the app to load your terms" style={{ fontSize: small ? 14 : 16, fontWeight: 'bold', color: WHITE, marginTop: small ? 0 : 4 }} maxLines={2} truncate="END" />
    </FlexWidget>
  );
}

export function TermWidget({ view, size }: { view: WidgetView | null; size: Size }) {
  if (!view?.daily) return <EmptyWidget size={size} />;
  const { daily, recent } = view;
  const { width, height } = size;
  const inner = Math.max(40, width - PAD * 2);
  const last = recent.find((t) => t.TermId !== daily.TermId);
  const parts = partsLine(view);
  const another = <Chip text="🎲 Another" action="NEXT_TERM" label="Show another term" flex={1} />;
  const backToToday = !daily.isToday && <Chip text="↺ Today" action="TODAY_TERM" label="Back to today's term" flex={1} />;
  const root = { height: 'match_parent' as const, width: 'match_parent' as const, borderRadius: 22, padding: PAD, flexDirection: 'column' as const };

  // 2×1 / 3×1: one line.
  if (height < 90) {
    return (
      <FlexWidget style={{ ...root, justifyContent: 'center' }}>
        <TextWidget text={daily.isToday ? 'TERM OF THE DAY' : 'ANOTHER TERM'} style={{ fontSize: 9, fontWeight: 'bold', color: SOFT, letterSpacing: 0.1 }} />
        <DailyTerm term={{ ...daily, volume: width >= 250 ? daily.volume : '' }} big={false} lines={1} />
      </FlexWidget>
    );
  }

  // 2×2 and other narrow sizes.
  if (width < 230) {
    return (
      <FlexWidget style={root}>
        <Header view={view} showStreak={false} />
        <DailyTerm term={daily} big={false} lines={height >= 170 ? 3 : 2} />
        {height >= 170 && !!parts && <TextWidget text={parts} style={{ fontSize: 12, color: WHITE, marginTop: 6 }} maxLines={3} truncate="END" />}
        <FlexWidget style={{ flex: 1 }} />
        <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', flexGap: 6 }}>{another}</FlexWidget>
      </FlexWidget>
    );
  }

  // 4×2: term, word parts, streak and actions.
  if (height < 170) {
    return (
      <FlexWidget style={root}>
        <Header view={view} showStreak />
        <DailyTerm term={daily} big lines={1} />
        {!!parts && height >= 120 && <TextWidget text={parts} style={{ fontSize: 12, color: WHITE, marginTop: 4 }} maxLines={1} truncate="END" />}
        <FlexWidget style={{ flex: 1 }} />
        <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', flexGap: 6 }}>
          {another}
          {backToToday || (last
            ? <Chip text={`▶ ${last.Term}`} uri={termLink(last)} label={`Continue with ${last.Term}`} flex={2} />
            : <Chip text="🔍 Search" uri={SEARCH_LINK} label="Search terms" flex={1} />)}
        </FlexWidget>
      </FlexWidget>
    );
  }

  // 4×3 and bigger: everything, as much as fits.
  const recentRows = Math.max(0, Math.min(4, Math.floor((height - 270) / 34)));
  return (
    <FlexWidget style={root}>
      <Header view={view} showStreak />
      <DailyTerm term={daily} big lines={2} />
      {!!parts && <TextWidget text={parts} style={{ fontSize: 13, color: WHITE, marginTop: 6 }} maxLines={2} truncate="END" />}
      {!!daily.parts?.literal && height >= 230 && (
        <TextWidget text={`“${daily.parts.literal}”`} style={{ fontSize: 12, fontStyle: 'italic', color: SOFT, marginTop: 2 }} maxLines={2} truncate="END" />
      )}
      {!parts && <TextWidget text="Tap the term to see its word parts" style={{ fontSize: 12, color: SOFT, marginTop: 6 }} maxLines={1} />}
      {height >= 210 && <Progress view={view} width={inner} />}
      {recentRows > 0 && recent.length > 0 && <RecentList terms={recent.slice(0, recentRows)} />}
      <FlexWidget style={{ flex: 1 }} />
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', flexGap: 6 }}>
        <Chip text="🔍 Search" uri={SEARCH_LINK} label="Search terms" flex={1} />
        <Chip text="🔖 Saved" uri={BOOKMARKS_LINK} label="Open bookmarks" flex={1} />
        {backToToday || another}
      </FlexWidget>
    </FlexWidget>
  );
}

// Light and dark versions; the background is a blue gradient in both.
export const renderTermWidget = (view: WidgetView | null, info: Pick<WidgetInfo, 'width' | 'height'>) => {
  const size = { width: info.width || 250, height: info.height || 110 };
  const wrap = (from: `#${string}`, to: `#${string}`) => (
    <FlexWidget style={{ height: 'match_parent', width: 'match_parent', borderRadius: 22, backgroundGradient: { from, to, orientation: 'TL_BR' } }}>
      <TermWidget view={view} size={size} />
    </FlexWidget>
  );
  return { light: wrap('#1e3a8a', '#3b82f6'), dark: wrap('#0f172a', '#1e3a8a') };
};
