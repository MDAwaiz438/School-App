import React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

const HEADER_GRADIENT = require('@/assets/images/header-gradient.png');
const HERO_GRADIENT = require('@/assets/images/hero-gradient.png');

interface GradientSpreadProps {
  style?: StyleProp<ViewStyle>;
  type?: 'header' | 'hero';
  children?: React.ReactNode;
}

export const GradientSpread: React.FC<GradientSpreadProps> = ({
  style,
  type = 'header',
  children,
}) => {
  const source = type === 'hero' ? HERO_GRADIENT : HEADER_GRADIENT;

  return (
    <View style={[styles.container, style]}>
      {/* 1. Base dark fallback */}
      <View style={[StyleSheet.absoluteFill, styles.fallback]} />
      {/* 2. Deep dark navy gradient spread image */}
      <Image
        source={source}
        style={StyleSheet.absoluteFill as StyleProp<ImageStyle>}
        resizeMode="cover"
      />
      {/* 3. Subtle bottom hairline divider */}
      <View style={styles.bottomBorder} />
      {/* 4. Content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  fallback: {
    backgroundColor: '#071324',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
