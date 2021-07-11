import React, {
  useEffect,
  useState,
  ReactElement,
  useRef,
  ComponentType,
  useCallback,
  ComponentProps,
} from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

type Props<T extends ComponentType<any>> = {
  visible?: boolean;
  load: () => Promise<{ default: T }>;
  loadingContainerStyle?: StyleProp<ViewStyle>;
  loadingColor?: string;
  placeholder?: ReactElement;
  onReady?: () => void;
};

export default function LazyComponent<T extends ComponentType<any>>({
  visible = true,
  load,
  loadingContainerStyle,
  loadingColor,
  placeholder,
  onReady,
  ...props
}: Props<T> & ComponentProps<T>) {
  const [ready, setReady] = useState(false);
  const ref = useRef<any>();
  const savedLoad = useRef<any>();

  useEffect(() => {
    savedLoad.current = load;
  }, [load]);

  const loadComponent = useCallback(async () => {
    if (!ref.current) {
      ref.current = await savedLoad.current();
    }
    setReady(true);
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  useEffect(() => {
    if (visible) {
      loadComponent();
    } else {
      setReady(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) {
    return null;
  }
  if (!ready) {
    if (placeholder) {
      return placeholder;
    }
    return (
      <View style={[styles.loadingContainer, loadingContainerStyle]}>
        <ActivityIndicator color={loadingColor} />
      </View>
    );
  }
  const Component = ref.current?.default;

  if (Component) {
    return <Component {...props} />;
  }
  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
});
