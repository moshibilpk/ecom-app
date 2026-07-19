import { createNavigationContainerRef } from "@react-navigation/native";
import { ScreenName } from "@constants";

/** Exported ref for imperative navigation outside of components */
export const navigationRef = createNavigationContainerRef<Record<ScreenName, undefined>>();

/** Reset navigation stack to a single target route */
export function resetRoot(routeName: ScreenName, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    });
  }
}

/** Imperatively navigate to a screen */
export function navigate(routeName: ScreenName, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(routeName, params);
  }
}
