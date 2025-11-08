import React from 'react';
import {
  ReactElement,
  ComponentType,
  ComponentProps,
  lazy,
  Suspense,
  useMemo,
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
  unmountOnHidden?: boolean;
};

export default function LazyComponent<T extends ComponentType<any>>({
  visible = true,
  load,
  loadingContainerStyle,
  loadingColor,
  placeholder,
  unmountOnHidden = true,
  ...props
}: Props<T> & ComponentProps<T>) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Component = useMemo(() => lazy(() => load()), []);

  if (!visible && unmountOnHidden) {
    return null;
  }

  return (
    <Suspense
      fallback={
        placeholder ? (
          <View style={styles.loadingContainer}>{placeholder}</View>
        ) : (
          <View style={[styles.loadingContainer, loadingContainerStyle]}>
            <ActivityIndicator color={loadingColor} />
          </View>
        )
      }
    >
      {Component && <Component {...props} />}
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
