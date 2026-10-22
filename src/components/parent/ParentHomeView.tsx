import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientSpread } from '@/components/common/GradientSpread';
import { Palette, Breakpoints } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { MOCK_TIMETABLE } from '@/data/mockData';

interface ParentHomeViewProps {
  onNavigateTab: (tab: 'home' | 'academics' | 'updates' | 'more' | 'attendance' | 'homework') => void;
  onOpenLeaveModal?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const ParentHomeView: React.FC<ParentHomeViewProps> = ({
  onNavigateTab,
  onOpenLeaveModal,
  onNotificationPress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < Breakpoints.compact;
  const isTablet = width >= Breakpoints.tablet;
  const isDesktop = width >= Breakpoints.desktop;

  const { selectedStudent, homeworkList, notifications, logout, showAlert, setIsChatModalVisible } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const pendingHw = homeworkList.filter((h) => h.status === 'pending');

  const topPadding = Math.max(insets.top, 14) + 10;

  return (
    <View style={{ flex: 1, backgroundColor: Palette.background }}>
      {/* 1. APP BAR / HEADER (Matching Super Admin & Student) */}
      <View style={styles.appHeader}>
        <View style={styles.headerTop}>
          <View>
            <View style={styles.headerTag}>
              <View style={styles.pulseDot} />
              <Text style={styles.headerTagText}>PARENT PORTAL</Text>
            </View>
            <Text style={styles.headerTitle}>Mrs. Priya Kumar</Text>
            <Text style={styles.headerSub}>
              {selectedStudent.name} • {selectedStudent.grade} - Section {selectedStudent.section}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setIsChatModalVisible(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="School Chat & Faculty Messaging"
              style={styles.chatBtn}>
              <Ionicons name="chatbubbles" size={18} color="#4F46E5" />
              <View style={styles.chatBadgeDot} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNotificationPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Notifications, ${unreadNotifs} unread`}
              style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={20} color="#475569" />
              {unreadNotifs > 0 && <View style={styles.badgeDot} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileBtn}
              activeOpacity={0.8}
              onPress={onProfilePress}
              accessibilityRole="button"
              accessibilityLabel="Switch student profile and account settings">
              <Image
                source={{ uri: selectedStudent.avatar }}
                style={styles.profileAvatarImg}
              />
              <View style={styles.statusOnlineDot} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          isTablet && styles.contentContainerTablet,
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Child Profile Card */}
        <TouchableOpacity
          onPress={onProfilePress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Selected student ${selectedStudent.name}, ${selectedStudent.grade} ${selectedStudent.section}`}
          style={styles.childCard}>
          <Image
            source={{ uri: selectedStudent.avatar }}
            style={styles.childAvatar}
            accessibilityRole="image"
            accessibilityLabel={`${selectedStudent.name} avatar`}
          />
          <View style={styles.childInfoCol}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.childName} numberOfLines={1} ellipsizeMode="tail">
                {selectedStudent.name}
              </Text>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Enrolled</Text>
              </View>
            </View>
            <Text style={styles.childGrade} numberOfLines={1} ellipsizeMode="tail">
              {selectedStudent.grade} • Section {selectedStudent.section} • Roll #{selectedStudent.rollNo}
            </Text>
          </View>
          <View style={styles.switchChildBtn}>
            <Ionicons name="swap-horizontal" size={14} color="#4F46E5" />
            <Text style={styles.switchChildText}>Switch</Text>
          </View>
        </TouchableOpacity>

        {/* 2. CENTER SQUARE SECTION HUBS (Matching Student View) */}
        <View style={styles.centerSquareSection}>
          <View style={styles.squareHeaderRow}>
            <Text style={styles.squareHeaderTitle}>Core Portals</Text>
            <Text style={styles.squareHeaderSubtitle}>Direct Navigation</Text>
          </View>

          <View style={styles.squareGrid}>
            {/* Square 1: Academics */}
            <TouchableOpacity
              style={[styles.squareCard, isDesktop && styles.squareCardDesktop, styles.squareCardAcademics]}
              activeOpacity={0.75}
              onPress={() => onNavigateTab('academics')}>
              <View style={styles.squareTopRow}>
                <View style={[styles.squareIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="school" size={24} color="#2563EB" />
                </View>
                <View style={[styles.squareBadge, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={[styles.squareBadgeText, { color: '#1E40AF' }]}>
                    3 Classes
                  </Text>
                </View>
              </View>
              <View style={styles.squareBottomInfo}>
                <Text style={styles.squareTitle}>Academics</Text>
                <Text style={styles.squareSubtitle} numberOfLines={1}>
                  Timetable & Report
                </Text>
              </View>
            </TouchableOpacity>

            {/* Square 2: Attendance */}
            <TouchableOpacity
              style={[styles.squareCard, isDesktop && styles.squareCardDesktop, styles.squareCardAttendance]}
              activeOpacity={0.75}
              onPress={() => onNavigateTab('attendance')}>
              <View style={styles.squareTopRow}>
                <View style={[styles.squareIconBox, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="pie-chart" size={24} color="#059669" />
                </View>
                <View style={[styles.squareBadge, { backgroundColor: '#D1FAE5' }]}>
                  <Text style={[styles.squareBadgeText, { color: '#047857' }]}>
                    92%
                  </Text>
                </View>
              </View>
              <View style={styles.squareBottomInfo}>
                <Text style={styles.squareTitle}>Attendance</Text>
                <Text style={styles.squareSubtitle} numberOfLines={1}>
                  Good Standing
                </Text>
              </View>
            </TouchableOpacity>

            {/* Square 3: Homework */}
            <TouchableOpacity
              style={[styles.squareCard, isDesktop && styles.squareCardDesktop, styles.squareCardAssignments]}
              activeOpacity={0.75}
              onPress={() => onNavigateTab('homework')}>
              <View style={styles.squareTopRow}>
                <View style={[styles.squareIconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="document-text" size={24} color="#D97706" />
                </View>
                <View style={[styles.squareBadge, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.squareBadgeText, { color: '#DC2626' }]}>
                    {pendingHw.length} Due
                  </Text>
                </View>
              </View>
              <View style={styles.squareBottomInfo}>
                <Text style={styles.squareTitle}>Assignments</Text>
                <Text style={styles.squareSubtitle} numberOfLines={1}>
                  Homework tasks
                </Text>
              </View>
            </TouchableOpacity>

            {/* Square 4: Announcements */}
            <TouchableOpacity
              style={[styles.squareCard, isDesktop && styles.squareCardDesktop, styles.squareCardUpdates]}
              activeOpacity={0.75}
              onPress={() => onNavigateTab('updates')}>
              <View style={styles.squareTopRow}>
                <View style={[styles.squareIconBox, { backgroundColor: '#FDF2F8' }]}>
                  <Ionicons name="megaphone" size={24} color="#DB2777" />
                </View>
                <View style={[styles.squareBadge, { backgroundColor: '#FCE7F3' }]}>
                  <Text style={[styles.squareBadgeText, { color: '#BE185D' }]}>
                    1 New
                  </Text>
                </View>
              </View>
              <View style={styles.squareBottomInfo}>
                <Text style={styles.squareTitle}>Announcements</Text>
                <Text style={styles.squareSubtitle} numberOfLines={1}>
                  Circulars & alerts
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      {/* 3. TODAY'S SCHEDULE SECTION */}
      <View style={styles.sectionWrapper}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <TouchableOpacity
            onPress={() => onNavigateTab('academics')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="View full schedule">
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleList}>
          {MOCK_TIMETABLE.map((slot) => {
            return (
              <TouchableOpacity
                key={slot.id}
                onPress={() => onNavigateTab('academics')}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${slot.time}, ${slot.subject}, ${slot.room}`}
                style={styles.scheduleCard}>
                <Text style={styles.scheduleTime} numberOfLines={1}>
                  {slot.time}
                </Text>
                <View
                  style={[
                    styles.colorIndicatorDot,
                    { backgroundColor: slot.color || '#2F80ED' },
                  ]}
                />
                <View style={styles.scheduleDetailCol}>
                  <Text style={styles.scheduleSubject} numberOfLines={1} ellipsizeMode="tail">
                    {slot.subject}
                  </Text>
                  <Text style={styles.scheduleRoom} numberOfLines={1} ellipsizeMode="tail">
                    {slot.room}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 4. ASSIGNMENTS DUE PREVIEW */}
      <View style={styles.sectionWrapper}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assignments Due</Text>
          <TouchableOpacity
            onPress={() => onNavigateTab('homework')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="View all assignments">
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onNavigateTab('homework')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`${pendingHw.length} assignments pending`}
          style={styles.homeworkBannerCard}>
          <View style={styles.hwIconBox}>
            <Ionicons name="document-text" size={22} color="#4F46E5" />
          </View>
          <View style={styles.hwTextCol}>
            <Text style={styles.hwMainText} numberOfLines={1} ellipsizeMode="tail">
              {pendingHw.length === 0
                ? 'All assignments completed!'
                : `${pendingHw.length} assignment${pendingHw.length === 1 ? '' : 's'} pending`}
            </Text>
            <Text style={styles.hwSubText} numberOfLines={1} ellipsizeMode="tail">
              {pendingHw.length === 0
                ? 'Great job! No pending tasks.'
                : pendingHw.map((h) => h.subject).slice(0, 3).join(' • ')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>
      </View>

      {/* 5. SCHOOL UPDATES PREVIEW */}
      <View style={styles.sectionWrapper}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>School Updates</Text>
          <TouchableOpacity
            onPress={() => onNavigateTab('updates')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="View all school updates">
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onNavigateTab('updates')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Annual Sports Day, 2 hours ago. Sports Day will be held on 28 Nov."
          style={styles.updateCard}>
          <View style={styles.updateIconBox}>
            <Ionicons name="megaphone" size={22} color="#2F80ED" />
          </View>
          <View style={styles.updateTextCol}>
            <View style={styles.updateTopRow}>
              <Text style={styles.updateTitle} numberOfLines={1} ellipsizeMode="tail">
                Annual Sports Day
              </Text>
              <Text style={styles.updateTimestamp}>2h ago</Text>
            </View>
            <Text style={styles.updateSummary} numberOfLines={2}>
              Sports Day will be held on 28 Nov. All students are requested to participate.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  contentContainerTablet: {
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  appHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: Platform.OS === 'ios' ? 48 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  headerTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chatBadgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileBtn: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EEF2FF',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileAvatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  statusOnlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  childCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  childAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#EEF2FF',
  },
  childInfoCol: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 12,
  },
  childName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  childGrade: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  activePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  switchChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  switchChildText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  centerSquareSection: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  squareHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  squareHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  squareHeaderSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  squareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  squareCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 124,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  squareCardDesktop: {
    width: '23%',
  },
  squareCardAcademics: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#2563EB',
  },
  squareCardAttendance: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#059669',
  },
  squareCardAssignments: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#D97706',
  },
  squareCardUpdates: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#DB2777',
  },
  squareTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  squareIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  squareBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  squareBottomInfo: {
    marginTop: 8,
  },
  squareTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  squareSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  sectionWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    minHeight: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17202A',
    letterSpacing: -0.2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2F80ED',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  scheduleList: {
    gap: 8,
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    minHeight: 52,
  },
  scheduleTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    width: 68,
  },
  colorIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  scheduleDetailCol: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  scheduleSubject: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17202A',
  },
  scheduleRoom: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  homeworkBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    minHeight: 56,
  },
  hwIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hwTextCol: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  hwMainText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17202A',
  },
  hwSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  updateIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  updateTextCol: {
    flex: 1,
    minWidth: 0,
  },
  updateTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17202A',
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  updateTimestamp: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  updateSummary: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});
