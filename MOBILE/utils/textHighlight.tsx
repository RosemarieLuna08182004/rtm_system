import React from 'react';
import * as S from '@/styles';

const normalize = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

/**
 * Generates highlighted text by matching and styling the query within the display text.
 * Returns JSX elements with matching portions highlighted in yellow.
 * 
 * @param displayText - The original text to display
 * @param highlightQuery - The search query to match and highlight
 * @returns JSX element with highlighted sections
 */
export const getHighlightedText = (displayText: string, highlightQuery: string) => {
  if (!highlightQuery.trim()) {
    return <S.Text>{displayText}</S.Text>;
  }

  const normalizedText = normalize(displayText);
  const normalizedQuery = normalize(highlightQuery.trim());

  if (!normalizedQuery || !normalizedText.includes(normalizedQuery)) {
    return <S.Text>{displayText}</S.Text>;
  }

  const parts = [];
  let currentIndex = 0;
  const queryLen = normalizedQuery.length;
  let matchIndex = normalizedText.indexOf(normalizedQuery, currentIndex);

  while (matchIndex !== -1) {
    // Add non-matching part
    if (matchIndex > currentIndex) {
      parts.push(displayText.substring(currentIndex, matchIndex));
    }

    // Add matching part with highlight
    parts.push(
      <S.Text key={`highlight-${matchIndex}`} className="bg-yellow-200 text-black">
        {displayText.substring(matchIndex, matchIndex + queryLen)}
      </S.Text>
    );

    currentIndex = matchIndex + queryLen;
    matchIndex = normalizedText.indexOf(normalizedQuery, currentIndex);
  }

  // Add remaining part
  if (currentIndex < displayText.length) {
    parts.push(displayText.substring(currentIndex));
  }

  return <>{parts}</>;
};
