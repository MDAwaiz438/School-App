import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBar } from '@/components/common/HeaderBar';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { NotificationsModal } from '@/components/common/NotificationsModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { ParentHomeView } from '@/components/parent/ParentHomeView';
import { ParentAcademicsView } from '@/components/parent/ParentAcademicsView';
import { ParentUpdatesView } from '@/components/parent/ParentUpdatesView';
import { ParentMoreView } from '@/components/parent/ParentMoreView';
import { StudentView } from '@/components/student/StudentView';
import { TeacherView } from '@/components/teacher/TeacherView';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';
import { Palette, Radii } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function MainAppScreen() {
  const { role, isLoggedIn } = useApp();
  const insets = useSafeAreaInsets();
  const [parentTab, setParentTab] = useState<'home' | 'academics' | 'updates' | 'more'>('home');
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(!isLoggedIn);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar style="light" backgroundColor="#0B1B2B" translucent={true} />

      {/* 1. Global Role Switcher */}
      <RoleSwitcher />

      {/* 2. Admin Role uses full-screen desktop layout with sidebar */}
      {role === 'admin' ? (
        <View style={[styles.adminContainer, { paddingBottom: insets.bottom }]}>
          <AdminDashboardView />
        </View>
      ) : (
        /* 3. Mobile Portals (Parent, Student, Teacher) in responsive container */
        <View style={styles.portalContainer}>
          <View style={styles.portalInner}>
            {/* Header Bar */}
            <HeaderBar
              onNotificationPress={() => setNotifOpen(true)}
              onChildPress={() => setAuthModalOpen(true)}
            />

            {/* Portal Content */}
            <View style={styles.contentArea}>
              {role === 'parent' && (
                <View style={styles.roleContainer}>
                  {parentTab === 'home' && (
                    <ParentHomeView
                      onNavigateTab={(tab) => setParentTab(tab)}
                      onOpenLeaveModal={() => setParentTab('more')}
                    />
                  )}
                  {parentTab === 'academics' && <ParentAcademicsView />}
                  {parentTab === 'updates' && <ParentUpdatesView />}
                  {parentTab === 'more' && <ParentMoreView />}
                </View>
              )}

              {role === 'student' && <StudentView />}
              {role === 'teacher' && <TeacherView />}
            </View>

            {/* Parent Role Bottom Navigation Bar */}
            {role === 'parent' && (
              <View style={styles.bottomTabBarWrapper}>
                <View
                  style={[
                    styles.bottomTabBarInner,
                    { paddingBottom: Math.max(insets.bottom, 10) },
                  ]}>
                  <TouchableOpacity
                    onPress={() => setParentTab('home')}
                    style={styles.tabItem}
                    activeOpacity={0.7}>
                    <Ionicons
                      name={parentTab === 'home' ? 'home' : 'home-outline'}
                      size={22}
                      color={parentTab === 'home' ? Palette.actionBlue : Palette.textSecondary}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        parentTab === 'home' && styles.tabLabelActive,
                      ]}>
                      Home
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setParentTab('academics')}
                    style={styles.tabItem}
                    activeOpacity={0.7}>
                    <Ionicons
                      name={parentTab === 'academics' ? 'school' : 'school-outline'}
                      size={22}
                      color={parentTab === 'academics' ? Palette.actionBlue : Palette.textSecondary}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        parentTab === 'academics' && styles.tabLabelActive,
                      ]}>
                      Academics
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setParentTab('updates')}
                    style={styles.tabItem}
                    activeOpacity={0.7}>
                    <Ionicons
                      name={parentTab === 'updates' ? 'megaphone' : 'megaphone-outline'}
                      size={22}
                      color={parentTab === 'updates' ? Palette.actionBlue : Palette.textSecondary}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        parentTab === 'updates' && styles.tabLabelActive,
                      ]}>
                      Updates
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setParentTab('more')}
                    style={styles.tabItem}
                    activeOpacity={0.7}>
                    <Ionicons
                      name={parentTab === 'more' ? 'grid' : 'grid-outline'}
                      size={22}
                      color={parentTab === 'more' ? Palette.actionBlue : Palette.textSecondary}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        parentTab === 'more' && styles.tabLabelActive,
                      ]}>
                      More
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {/* 4. Notification Drawer */}
      <NotificationsModal
        visible={isNotifOpen}
        onClose={() => setNotifOpen(false)}
      />

      {/* 5. Auth Modal */}
      <AuthModal
        visible={isAuthModalOpen}
        onDismiss={() => setAuthModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1B2B',
  },
  adminContainer: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  portalContainer: {
    flex: 1,
    backgroundColor: Palette.background,
    width: '100%',
  },
  portalInner: {
    flex: 1,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Palette.background,
  },
  contentArea: {
    flex: 1,
  },
  roleContainer: {
    flex: 1,
  },
  bottomTabBarWrapper: {
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomTabBarInner: {
    flexDirection: 'row',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  tabLabelActive: {
    color: Palette.actionBlue,
    fontWeight: '700',
  },
});
