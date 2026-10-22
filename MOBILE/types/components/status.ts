export enum TermStatus {
    lock = 'Lock',
    unlock = 'Unlock',
    bookmark = 'Bookmark',
    unbookmark = 'Unbookmark',
    play = 'Play'
}

export const mapStatus = (status: string, isChapterList?: boolean) => {
  if (isChapterList) {
    switch (status) {
      case 'Lock': return TermStatus.lock;
      case 'Unlock': return TermStatus.play;
      default: return TermStatus.lock;
    }
  } else {
    switch (status) {
      case 'Unbookmark': return TermStatus.unbookmark;
      case 'Bookmark': return TermStatus.bookmark;
      default: return TermStatus.lock;
    }
  }
}