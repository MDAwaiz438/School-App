import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Palette, Radii } from '@/constants/theme';
import { MOCK_SCHOOL } from '@/data/mockData';

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

const STATUS_MESSAGES = [
  'Initializing Secure Campus Mesh...',
  'Synchronizing Multi-Role Cloud Ecosystem...',
  'Verifying Institutional Security Protocols...',
  'Oakridge Unified Portal Ready.',
];

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onFinish }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isCompact = width < 500;

  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 36) + 12;
  const bottomInset = Math.max(insets.bottom, 20) + 10;

  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(-15)).current;
  const pulseRing1 = useRef(new Animated.Value(0.8)).current;
  const pulseRing1Opacity = useRef(new Animated.Value(0.7)).current;
  const pulseRing2 = useRef(new Animated.Value(0.6)).current;
  const pulseRing2Opacity = useRef(new Animated.Value(0.5)).current;
  const titleTranslateY = useRef(new Animated.Value(28)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(14)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const exitScale = useRef(new Animated.Value(1)).current;

  // Floating breathing oscillation for logo
  const floatAnim = useRef(new Animated.Value(0)).current;

  const [statusText, setStatusText] = useState(STATUS_MESSAGES[0]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Entrance sequence: Logo pop + rotation + fade in
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      // Badge pop
      Animated.spring(badgeScale, {
        toValue: 1,
        friction: 7,
        tension: 50,
        delay: 300,
        useNativeDriver: true,
      }),
      // Title slide up
      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 700,
          delay: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 700,
          delay: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2. Continuous pulse rings loop
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseRing1, {
            toValue: 1.45,
            duration: 2200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(pulseRing1, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseRing1Opacity, {
            toValue: 0,
            duration: 2200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseRing1Opacity, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseRing2, {
            toValue: 1.6,
            duration: 2600,
            delay: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(pulseRing2, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseRing2Opacity, {
            toValue: 0,
            duration: 2600,
            delay: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseRing2Opacity, {
            toValue: 0.5,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // 3. Gentle floating breathing motion
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 4. Progress bar fill over 2.6s
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2600,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // 5. Status message updates
    const t1 = setTimeout(() => setStatusText(STATUS_MESSAGES[1]), 700);
    const t2 = setTimeout(() => setStatusText(STATUS_MESSAGES[2]), 1500);
    const t3 = setTimeout(() => {
      setStatusText(STATUS_MESSAGES[3]);
      setIsReady(true);
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(buttonTranslateY, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2400);

    // 6. Auto-finish after 3.2s
    const tAuto = setTimeout(() => {
      handleComplete();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tAuto);
    };
  }, []);

  const handleComplete = () => {
    Animated.parallel([
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 450,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(exitScale, {
        toValue: 1.08,
        duration: 450,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  };

  const spin = logoRotate.interpolate({
    inputRange: [-15, 0],
    outputRange: ['-15deg', '0deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          paddingTop: topInset,
          paddingBottom: bottomInset,
          opacity: exitOpacity,
          transform: [{ scale: exitScale }],
        },
      ]}>
      <StatusBar style="light" />
      {/* Ambient background glow orbs */}
      <View style={[styles.ambientOrbTop, { width: width * 0.9, height: width * 0.9 }]} />
      <View style={[styles.ambientOrbBottom, { width: width * 0.8, height: width * 0.8 }]} />

      {/* Top Bar with Skip Chip */}
      <View style={styles.topHeader}>
        <View style={styles.sessionStatusPill}>
          <View style={styles.livePulseDot} />
          <Text style={styles.sessionStatusText}>OAKRIDGE CLOUD v2.4</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleComplete}
          style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip Intro</Text>
          <Ionicons name="arrow-forward" size={13} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Center Hook Animation Section */}
      <View style={styles.centerContainer}>
        {/* Crest & Concentric Aura Rings */}
        <View style={styles.emblemWrapper}>
          {/* Outer Pulsing Ring 2 */}
          <Animated.View
            style={[
              styles.pulseRing,
              styles.pulseRingOuter,
              {
                transform: [{ scale: pulseRing2 }],
                opacity: pulseRing2Opacity,
              },
            ]}
          />

          {/* Inner Pulsing Ring 1 */}
          <Animated.View
            style={[
              styles.pulseRing,
              styles.pulseRingInner,
              {
                transform: [{ scale: pulseRing1 }],
                opacity: pulseRing1Opacity,
              },
            ]}
          />

          {/* Ambient Glow Disk */}
          <View style={styles.glowDisk} />

          {/* Main Crest Badge */}
          <Animated.View
            style={[
              styles.crestContainer,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { rotate: spin },
                  { translateY: floatAnim },
                ],
              },
            ]}>
            <View style={styles.crestBorder}>
              <View style={styles.crestInner}>
                <Ionicons name="school" size={50} color="#FFFFFF" />
                <View style={styles.crestGoldStar}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Staggered Branding Text */}
        <Animated.View
          style={[
            styles.brandingCol,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}>
          {/* Institutional Badge */}
          <Animated.View style={{ transform: [{ scale: badgeScale }] }}>
            <View style={styles.prestigeBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#60A5FA" />
              <Text style={styles.prestigeBadgeText}>UNIFIED ACADEMIC ECOSYSTEM</Text>
            </View>
          </Animated.View>

          {/* School Title */}
          <Text style={styles.schoolNameFirst}>OAKRIDGE</Text>
          <Text style={styles.schoolNameSub}>INTERNATIONAL ACADEMY</Text>

          <View style={styles.dividerAccent} />

          {/* Tagline */}
          <Text style={styles.tagline}>{MOCK_SCHOOL.tagline}</Text>
        </Animated.View>

        {/* Dynamic Progress & Hook Ticker */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>

          <View style={styles.statusRow}>
            <Ionicons
              name={isReady ? 'checkmark-circle' : 'sync'}
              size={13}
              color={isReady ? '#10B981' : '#60A5FA'}
            />
            <Text style={styles.statusLabel} numberOfLines={1}>
              {statusText}
            </Text>
          </View>
        </View>

        {/* Interactive CTA to dive into Login */}
        <Animated.View
          style={[
            styles.ctaWrapper,
            {
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }],
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleComplete}
            style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Enter Unified Portal</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Bottom Footer */}
      <View style={styles.footerArea}>
        <Text style={styles.footerSecurityText}>
          🔒 256-Bit SSL Secured Institutional Access • Session 2026–2027
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#071324',
    zIndex: 9999,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  ambientOrbTop: {
    position: 'absolute',
    top: -120,
    alignSelf: 'center',
    borderRadius: 9999,
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
  },
  ambientOrbBottom: {
    position: 'absolute',
    bottom: -150,
    alignSelf: 'center',
    borderRadius: 9999,
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  sessionStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 7,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  sessionStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  skipButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    gap: 20,
    paddingVertical: 10,
  },
  emblemWrapper: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1.5,
  },
  pulseRingOuter: {
    width: 160,
    height: 160,
    borderColor: 'rgba(96, 165, 250, 0.45)',
  },
  pulseRingInner: {
    width: 130,
    height: 130,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  glowDisk: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(37, 99, 235, 0.45)',
  },
  crestContainer: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  crestBorder: {
    width: 100,
    height: 100,
    borderRadius: 30,
    padding: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.7)',
  },
  crestInner: {
    flex: 1,
    borderRadius: 27,
    backgroundColor: '#0F2744',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestGoldStar: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandingCol: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  prestigeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.35)',
    marginBottom: 4,
  },
  prestigeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 1.2,
  },
  schoolNameFirst: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    textAlign: 'center',
  },
  schoolNameSub: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 2,
    textAlign: 'center',
  },
  dividerAccent: {
    width: 48,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#2563EB',
    marginVertical: 4,
  },
  tagline: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  progressSection: {
    width: '100%',
    maxWidth: 320,
    gap: 8,
    marginTop: 10,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusLabel: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  ctaWrapper: {
    width: '100%',
    maxWidth: 280,
    marginTop: 6,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: Radii.pill,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  footerArea: {
    alignItems: 'center',
    paddingTop: 10,
  },
  footerSecurityText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
});
