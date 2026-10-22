import { registerWidgetTaskHandler, WidgetTaskHandlerProps } from 'react-native-android-widget';
import { loadShuffle, loadSnapshot, saveShuffle, viewFrom } from './data';
import { renderTermWidget } from './TermWidget';

// Runs in the background when Android asks the widget to draw: added, resized (it picks a
// layout for the new size), every 30 minutes, and when "Another" / "Today" is tapped.
async function widgetTaskHandler({ widgetInfo, widgetAction, clickAction, renderWidget }: WidgetTaskHandlerProps) {
  if (widgetAction === 'WIDGET_DELETED') return;

  let shuffle = await loadShuffle();
  if (widgetAction === 'WIDGET_CLICK') {
    if (clickAction === 'NEXT_TERM') shuffle += 1;
    else if (clickAction === 'TODAY_TERM') shuffle = 0;
    else return;
    await saveShuffle(shuffle);
  }

  renderWidget(renderTermWidget(viewFrom(await loadSnapshot(), shuffle), widgetInfo));
}

export const register = () => registerWidgetTaskHandler(widgetTaskHandler);
