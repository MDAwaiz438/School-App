import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientSpread } from './GradientSpread';
import { useApp } from '@/context/AppContext';

export interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  onNotificationPress?: () => void;
  onChildPress?: () => void;
  rightAction?: React.ReactNode;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  onBack,
  showBack,
  onNotificationPress,
  onChildPress,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();
  const { role, selectedStudent, notifications, logout, showAlert } = useApp();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const hasBack = Boolean(onBack || showBack);

  // Fallback title if none provided
  const headerTitle =
    title ||
    (role === 'parent'
      ? 'Oakridge Academy'
      : role === 'student'
      ? 'Student Hub'
      : role === 'teacher'
      ? 'Faculty Portal'
      : 'Admin Dashboard');

  // Generous safe area padding below punch-hole / dynamic island
  const topPadding = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 38) + 8;

  return (
    <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20) + 4 }]}>
      <View style={styles.contentRow}>
        {/* 1. LEFT: Back Chevron '<' or Avatar or Spacer */}
        <View style={styles.leftContainer}>
          {hasBack ? (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={styles.backButton}>
              <Ionicons name="chevron-back" size={22} color="#0F172A" />
            </TouchableOpacity>
          ) : onChildPress && role === 'parent' ? (
            <TouchableOpacity
              onPress={onChildPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Switch student profile"
              style={styles.childAvatarBtn}>
              <Image source={{ uri: selectedStudent.avatar }} style={styles.childMiniAvatar} />
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>

        {/* 2. CENTER: Section Title (Centered) */}
        <View style={styles.centerContainer} pointerEvents="none">
          <Text style={styles.headerTitle} numberOfLines={1}>
            {headerTitle}
          </Text>
          {subtitle ? (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* 3. RIGHT: Custom action, or Notification bell & Logout, or Spacer */}
        <View style={styles.rightContainer}>
          {rightAction ? (
            rightAction
          ) : onNotificationPress ? (
            <View style={styles.rightActionsRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onNotificationPress}
                accessibilityRole="button"
                accessibilityLabel={`Notifications, ${unreadCount} unread`}
                style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={20} color="#475569" />
                {unreadCount > 0 && <View style={styles.badgeDot} />}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={
                  onChildPress
                    ? onChildPress
                    : () => {
                        showAlert({
                          title: 'User Profile & Security',
                          message: `Institutional Portal Active • Role: ${role ? role.toUpperCase() : 'Active User'}\nCampus: Oakridge Global System`,
                          type: 'confirm',
                          buttons: [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Sign Out', style: 'destructive', onPress: logout },
                          ],
                        });
                      }
                }
                accessibilityRole="button"
                accessibilityLabel="User profile and account settings"
                style={[styles.iconButton, styles.profileButton]}>
                <Ionicons name="person-circle-outline" size={24} color="#4F46E5" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    width: '100%',
    paddingBottom: 14,
    zIndex: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  contentRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'relative',
  },
  leftContainer: {
    minWidth: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 2,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  childAvatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  childMiniAvatar: {
    width: '100%',
    height: '100%',
  },
  centerContainer: {
    position: 'absolute',
    left: 56,
    right: 56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
    textAlign: 'center',
  },
  rightContainer: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 2,
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileButton: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  badgeDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  spacer: {
    width: 44,
    height: 44,
  },
});
