import { requireOptionalNativeModule } from 'expo';

// Text-to-speech, loaded only when the installed app build includes it.
// Older development builds don't have the native module; importing expo-speech there
// would crash the whole app, so pronunciation is simply hidden instead.

type SpeechModule = typeof import('expo-speech');

let speech: SpeechModule | null | undefined;

const loadSpeech = (): SpeechModule | null => {
  if (speech !== undefined) return speech;
  try {
    speech = requireOptionalNativeModule('ExpoSpeech') ? (require('expo-speech') as SpeechModule) : null;
  } catch {
    speech = null;
  }
  return speech;
};

export const isSpeechAvailable = (): boolean => loadSpeech() !== null;

export const speakText = (text: string, onDone?: () => void): void => {
  const module = loadSpeech();
  if (!module) {
    onDone?.();
    return;
  }
  module.stop();
  module.speak(text, { language: 'en-US', rate: 0.85, onDone, onStopped: onDone, onError: onDone });
};

export const stopSpeaking = (): void => {
  loadSpeech()?.stop();
};
