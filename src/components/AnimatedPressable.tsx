import { ReactNode, useRef } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  WithTimingConfig,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends Omit<PressableProps, "style"> {
  children: ReactNode;
  /**
   * Scale value when pressed (0.0 - 1.0)
   * @default 0.97
   */
  scaleValue?: number;
  /**
   * Opacity value when pressed (0.0 - 1.0)
   * @default 0.8
   */
  opacityValue?: number;
  /**
   * Enable scale animation
   * @default true
   */
  enableScale?: boolean;
  /**
   * Enable opacity animation
   * @default false
   */
  enableOpacity?: boolean;
  /**
   * Custom timing configuration
   */
  timingConfig?: WithTimingConfig;
  /**
   * Minimum milliseconds between successive onPress firings.
   * Prevents double-tap / rapid-tap from triggering the handler multiple times.
   * @default 500
   */
  throttleMs?: number;
  /**
   * Style for the pressable container
   */
  style?: StyleProp<ViewStyle>;
}

const defaultTimingConfig: WithTimingConfig = {
  duration: 80,
};

export const AnimatedPressable = ({
  children,
  scaleValue = 0.95,
  opacityValue = 0.8,
  enableScale = true,
  enableOpacity = false,
  timingConfig = defaultTimingConfig,
  throttleMs = 500,
  style,
  onPressIn,
  onPressOut,
  onPress,
  disabled,
  ...pressableProps
}: AnimatedPressableProps) => {
  const lastPressRef = useRef<number>(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: enableScale ? scale.get() : 1 }],
      opacity: enableOpacity ? opacity.get() : 1,
    };
  });

  const handlePressIn = (event: any) => {
    if (enableScale) {
      scale.set(withTiming(scaleValue, timingConfig));
    }
    if (enableOpacity) {
      opacity.set(withTiming(opacityValue, timingConfig));
    }
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    if (enableScale) {
      scale.set(withTiming(1, timingConfig));
    }
    if (enableOpacity) {
      opacity.set(withTiming(1, timingConfig));
    }
    onPressOut?.(event);
  };

  const handlePress = (event: any) => {
    const now = Date.now();
    if (now - lastPressRef.current < throttleMs) return;
    lastPressRef.current = now;
    onPress?.(event);
  };

  return (
    <AnimatedPressableComponent
      {...pressableProps}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      style={[animatedStyle, style]}>
      {children}
    </AnimatedPressableComponent>
  );
};
