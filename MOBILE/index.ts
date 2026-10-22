import 'expo-router/entry';
import { Platform } from 'react-native';

// Android home-screen widget ("Term of the day"). Older app builds don't include its
// native part, so a failure here is ignored instead of stopping the app.
if (Platform.OS === 'android') {
  try {
    require('./widgets/register').register();
  } catch {
    // Widget not available in this build.
  }
}
