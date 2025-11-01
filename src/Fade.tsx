import React, { useEffect, useState } from 'react';
import Animated, {
  runOnJS,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

type Props = ViewProps & {
  visible: boolean;
  placeholder?: any;
  style?: StyleProp<ViewStyle>;
  children?: any;
  duration?: number;
};

function Fade({
  visible,
  placeholder = null,
  style,
  children,
  duration = 300,
  ...rest
}: Props) {
  const opacity = useSharedValue(0);
  const [internalVisible, setInternalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      opacity.value = withTiming(1, { duration });
    } else {
      if (!internalVisible) {
        return;
      }
      opacity.value = withTiming(0, { duration }, (finished) => {
        if (finished) {
          runOnJS(setInternalVisible)(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (!internalVisible) {
    if (placeholder) {
      return <View style={StyleSheet.absoluteFill}>{placeholder}</View>;
    }
    return null;
  }

  return (
    <Animated.View style={[animatedStyle, style]} {...rest}>
      {children}
    </Animated.View>
  );
}

export default Fade;
