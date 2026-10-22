import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParentHomeView } from './ParentHomeView';
import { ParentAcademicsView } from './ParentAcademicsView';
import { ParentAttendanceView } from './ParentAttendanceView';
import { ParentHomeworkView } from './ParentHomeworkView';
import { ParentUpdatesView } from './ParentUpdatesView';
import { ParentMoreView } from './ParentMoreView';
import { SwitchChildModal } from './SwitchChildModal';

type ParentTab = 'home' | 'academics' | 'attendance' | 'homework' | 'updates' | 'more';

export const ParentPortalView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ParentTab>('home');
  const [isChildModalVisible, setChildModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ParentHomeView
            onNavigateTab={(tab) => setActiveTab(tab as ParentTab)}
            onOpenLeaveModal={() => setActiveTab('attendance')}
            onProfilePress={() => setChildModalVisible(true)}
          />
        );
      case 'academics':
        return (
          <ParentAcademicsView
            onNavigateTab={(tab) => setActiveTab(tab as ParentTab)}
          />
        );
      case 'attendance':
        return <ParentAttendanceView />;
      case 'homework':
        return <ParentHomeworkView />;
      case 'updates':
        return <ParentUpdatesView />;
      case 'more':
        return <ParentMoreView />;
      default:
        return (
          <ParentHomeView
            onNavigateTab={(tab) => setActiveTab(tab as ParentTab)}
            onProfilePress={() => setChildModalVisible(true)}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Active Screen Content */}
      <View style={styles.screenWrapper}>{renderActiveScreen()}</View>

      {/* Modern Bottom Navigation Bar */}
      <View style={[styles.bottomBar, isDesktop && styles.bottomBarDesktop]}>
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('home')}>
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'home' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('academics')}>
          <Ionicons
            name={activeTab === 'academics' ? 'school' : 'school-outline'}
            size={22}
            color={activeTab === 'academics' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'academics' && styles.navLabelActive]}>
            Academics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('attendance')}>
          <Ionicons
            name={activeTab === 'attendance' ? 'calendar' : 'calendar-outline'}
            size={22}
            color={activeTab === 'attendance' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'attendance' && styles.navLabelActive]}>
            Attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('homework')}>
          <Ionicons
            name={activeTab === 'homework' ? 'book' : 'book-outline'}
            size={22}
            color={activeTab === 'homework' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'homework' && styles.navLabelActive]}>
            Assignments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('more')}>
          <Ionicons
            name={activeTab === 'more' ? 'grid' : 'grid-outline'}
            size={22}
            color={activeTab === 'more' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'more' && styles.navLabelActive]}>
            More
          </Text>
        </TouchableOpacity>
      </View>

      {/* Switch Child Modal */}
      <SwitchChildModal
        visible={isChildModalVisible}
        onClose={() => setChildModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  screenWrapper: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    paddingBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomBarDesktop: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  navLabelActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
});
