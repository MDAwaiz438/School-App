import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LoginView } from '@/components/auth/LoginView';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';
import { TeacherView } from '@/components/teacher/TeacherView';
import { StudentView } from '@/components/student/StudentView';
import { ParentPortalView } from '@/components/parent/ParentPortalView';
import { ChatModal } from '@/components/chat/ChatModal';
import { useApp } from '@/context/AppContext';

export default function MainAppScreen() {
  const { role, isLoggedIn, isChatModalVisible, setIsChatModalVisible } = useApp();

  // 1. If not authenticated, show the Login Screen
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safeAreaLogin} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="dark" />
        <LoginView />
      </SafeAreaView>
    );
  }

  // 2. Authenticated Screen: Render portal based on role
  // demo -> admin, demo2 -> teacher, demo3 -> student, demo4 -> parent
  const renderActivePortal = () => {
    switch (role) {
      case 'teacher':
        return <TeacherView />;
      case 'student':
        return <StudentView />;
      case 'parent':
        return <ParentPortalView />;
      case 'admin':
      default:
        return <AdminDashboardView />;
    }
  };

  return (
    <SafeAreaView style={styles.appContainer} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="dark" />
      <View style={styles.contentContainer}>
        {renderActivePortal()}
      </View>
      <ChatModal
        visible={isChatModalVisible}
        onClose={() => setIsChatModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaLogin: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    backgroundColor: '#f8fafc',
  },
});
