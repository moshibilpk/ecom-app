import { createNavigationContainerRef } from "@react-navigation/native";
import { ScreenName } from "@constants";

/** Exported ref for imperative navigation outside of components */
export const navigationRef = createNavigationContainerRef<Record<ScreenName, unknown>>();

/** Reset navigation stack to a single target route */
export function resetRoot(routeName: ScreenName, params?: Record<string, unknown>) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    });
  }
}

/** Imperatively navigate to a screen */
export function navigate(routeName: ScreenName, params?: Record<string, unknown>) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(routeName, params);
  }
}
