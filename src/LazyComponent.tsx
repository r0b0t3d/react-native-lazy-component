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
import Fade from './Fade';

type Props<T extends ComponentType<any>> = {
  visible?: boolean;
  load: () => Promise<{ default: T }>;
  loadingContainerStyle?: StyleProp<ViewStyle>;
  loadingColor?: string;
  placeholder?: ReactElement;
  onReady?: () => void;
  timeout?: number;
  unmountOnHidden?: boolean;
};

export default function LazyComponent<T extends ComponentType<any>>({
  visible = true,
  load,
  loadingContainerStyle,
  loadingColor,
  placeholder,
  onReady,
  timeout = 100,
  unmountOnHidden = true,
  ...props
}: Props<T> & ComponentProps<T>) {
  const [ready, setReady] = useState(false);
  const ref = useRef<any>();
  const savedLoad = useRef<any>(null);

  useEffect(() => {
    savedLoad.current = load;
  }, [load]);

  const loadComponent = useCallback(async () => {
    if (!ref.current) {
      ref.current = await savedLoad.current();
      setTimeout(() => {
        setReady(true);
        if (onReady) {
          onReady();
        }
      }, timeout);
    } else {
      setReady(true);
    }
  }, [onReady, timeout]);

  useEffect(() => {
    if (visible) {
      loadComponent();
    } else if (unmountOnHidden) {
      setReady(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible && unmountOnHidden) {
    return null;
  }
  const Component = ref.current?.default;
  return (
    <>
      {Component && <Component {...props} />}
      <Fade
        style={StyleSheet.absoluteFill}
        visible={ready}
        placeholder={
          placeholder ?? (
            <View style={[styles.loadingContainer, loadingContainerStyle]}>
              <ActivityIndicator color={loadingColor} />
            </View>
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
