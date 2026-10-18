import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { Palette, Radii, Shadows } from '@/constants/theme';

interface AppCardProps extends ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined' | 'tintNavy';
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  variant = 'default',
  ...rest
}) => {
  return (
    <View
      style={[
        styles.card,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        variant === 'tintNavy' && styles.tintNavy,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.surface,
    borderRadius: Radii.card,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    ...Shadows.card,
  },
  elevated: {
    ...Shadows.elevated,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: Palette.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  tintNavy: {
    backgroundColor: Palette.navyTint,
    borderColor: '#D4DCED',
  },
});
