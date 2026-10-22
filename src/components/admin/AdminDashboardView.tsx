import React, { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from '@/components/common/AppCard';
import { AppButton } from '@/components/common/AppButton';
import { StatusPill } from '@/components/common/StatusPill';
import { Palette, Radii } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { MOCK_ADMIN_METRICS, MOCK_ROSTER_8A, MOCK_SCHOOL } from '@/data/mockData';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { AttendanceExcelExportView } from '@/components/admin/AttendanceExcelExportView';

import { SchoolEvent } from '@/types';

type AdminTab = 'overview' | 'students' | 'events' | 'communication' | 'fees' | 'reports';

const NAV_ITEMS: { id: AdminTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'overview', label: 'Dashboard', icon: 'speedometer-outline' },
  { id: 'students', label: 'Students', icon: 'school-outline' },
  { id: 'events', label: 'Events Hub', icon: 'calendar-outline' },
  { id: 'communication', label: 'Communication', icon: 'megaphone-outline' },
  { id: 'fees', label: 'Fees & Dues', icon: 'card-outline' },
  { id: 'reports', label: 'Reports', icon: 'document-text-outline' },
];

export const AdminDashboardView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const { announcements, addAnnouncement, events, logout, showAlert, setIsChatModalVisible } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [reportsSubTab, setReportsSubTab] = useState<'attendance' | 'archive'>('attendance');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventCategoryFilter, setEventCategoryFilter] = useState<'all' | SchoolEvent['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleSendEmergencyAlert = () => {
    if (!alertTitle || !alertMessage) {
      showAlert({
        title: 'Required',
        message: 'Please enter an alert title and message.',
        type: 'warning',
      });
      return;
    }
    addAnnouncement({
      title: `[EMERGENCY BROADCAST] ${alertTitle}`,
      content: alertMessage,
      priority: 'emergency',
      audience: ['all'],
      authorName: 'School Principal & Administration',
      pinned: true,
    });
    setAlertTitle('');
    setAlertMessage('');
    setAlertModalOpen(false);
    showAlert({
      title: 'Emergency Broadcast Sent',
      message: 'High-priority SMS and Push Notifications triggered for 1,248 student families and 88 staff members.',
      type: 'success',
      icon: 'radio-outline',
    });
  };

  return (
    <View style={styles.container}>
      {/* DESKTOP SIDEBAR (Visible on screens >= 900px) */}
      {isDesktop && (
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <View style={styles.logoBadge}>
              <Ionicons name="school" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.brandCol}>
              <Text style={styles.brandTitle} numberOfLines={1}>{MOCK_SCHOOL.name}</Text>
              <Text style={styles.brandSub}>School Admin Portal</Text>
            </View>
          </View>

          <View style={styles.sidebarNav}>
            <Text style={styles.sidebarSectionLabel}>MENU</Text>
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setActiveTab(item.id)}
                  style={[styles.sidebarNavItem, isActive && styles.sidebarNavItemActive]}>
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={isActive ? Palette.actionBlue : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.sidebarNavText,
                      isActive && styles.sidebarNavTextActive,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.sidebarFooter}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%' }}>
              <View style={styles.principalAvatar}>
                <Ionicons name="person" size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.principalName}>Dr. Arthur Sterling</Text>
                <Text style={styles.principalRole}>Principal Office</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                showAlert({
                  title: 'Sign Out',
                  message: 'Return to login portal?',
                  type: 'confirm',
                  buttons: [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Sign Out', style: 'destructive', onPress: logout },
                  ],
                });
              }}
              style={styles.sidebarLogoutBtn}>
              <Ionicons name="log-out-outline" size={14} color="#F87171" />
              <Text style={styles.sidebarLogoutText}>Sign Out / Switch Portal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MAIN ADMIN WORKSPACE */}
      <View style={styles.mainWorkspace}>
        {/* APP BAR / HEADER (Matching Student & Parent Portals) */}
        <View
          style={[
            styles.appHeader,
            { paddingTop: isDesktop ? 16 : Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20) + 8 },
          ]}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitleCol}>
              <View style={styles.headerTag}>
                <View style={styles.pulseDot} />
                <Text style={styles.headerTagText}>
                  {activeTab === 'overview'
                    ? 'ADMIN PORTAL'
                    : activeTab === 'students'
                    ? 'ADMIN PORTAL • STUDENTS'
                    : activeTab === 'events'
                    ? 'ADMIN PORTAL • EVENTS'
                    : activeTab === 'communication'
                    ? 'ADMIN PORTAL • BROADCAST'
                    : activeTab === 'fees'
                    ? 'ADMIN PORTAL • FINANCE'
                    : 'ADMIN PORTAL • REPORTS'}
                </Text>
              </View>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {activeTab === 'overview'
                  ? 'Dr. Robert Vance'
                  : activeTab === 'students'
                  ? 'Student Directory'
                  : activeTab === 'events'
                  ? 'Campus Events Hub'
                  : activeTab === 'communication'
                  ? 'Broadcast Center'
                  : activeTab === 'fees'
                  ? 'Fees & Dues Desk'
                  : 'School Reports'}
              </Text>
              <Text style={styles.headerSub} numberOfLines={1}>
                {activeTab === 'overview'
                  ? 'Academic Director • Oakridge Global Academy'
                  : activeTab === 'students'
                  ? 'Class Roster, Enrolment & Status'
                  : activeTab === 'events'
                  ? 'Campus Activities & Event Schedules'
                  : activeTab === 'communication'
                  ? 'Official Circulars & Urgent Alerts'
                  : activeTab === 'fees'
                  ? 'Tuition Collection & Dues Overview'
                  : 'School Metrics & Attendance Export'}
              </Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.chatHeaderBtn}
                activeOpacity={0.8}
                onPress={() => setIsChatModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Open Campus & Faculty Chat">
                <Ionicons name="chatbubbles" size={19} color="#4F46E5" />
                <View style={styles.chatBadgeDot} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.alertHeaderBtn}
                activeOpacity={0.8}
                onPress={() => setAlertModalOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Broadcast Alert">
                <Ionicons name="megaphone-outline" size={18} color="#DC2626" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileBtn}
                activeOpacity={0.8}
                onPress={() => setIsProfileModalOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="View administrator profile and account settings">
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                  }}
                  style={styles.profileAvatarImg}
                />
                <View style={styles.statusOnlineDot} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <View style={styles.tabContent}>
              {/* Responsive 4-Column KPI Grid */}
              <View style={[styles.kpiGrid, isDesktop && styles.kpiGridDesktop]}>
                <AppCard style={styles.kpiCard}>
                  <View style={styles.kpiTopRow}>
                    <Text style={styles.kpiNumber} numberOfLines={1}>{MOCK_ADMIN_METRICS.totalStudents}</Text>
                    <View style={[styles.kpiIcon, { backgroundColor: Palette.blueTint }]}>
                      <Ionicons name="people" size={16} color={Palette.actionBlue} />
                    </View>
                  </View>
                  <Text style={styles.kpiTitle}>Total Students</Text>
                  <Text style={styles.kpiDesc}>32 Sections Enrolled</Text>
                </AppCard>

                <AppCard style={styles.kpiCard}>
                  <View style={styles.kpiTopRow}>
                    <Text style={[styles.kpiNumber, { color: Palette.successGreen }]} numberOfLines={1}>
                      {MOCK_ADMIN_METRICS.studentAttendanceRate}%
                    </Text>
                    <View style={[styles.kpiIcon, { backgroundColor: Palette.greenTint }]}>
                      <Ionicons name="checkmark-circle" size={16} color={Palette.successGreen} />
                    </View>
                  </View>
                  <Text style={styles.kpiTitle}>Daily Attendance</Text>
                  <Text style={styles.kpiDesc}>+1.2% this week</Text>
                </AppCard>

                <AppCard style={styles.kpiCard}>
                  <View style={styles.kpiTopRow}>
                    <Text style={styles.kpiNumber} numberOfLines={1}>
                      {MOCK_ADMIN_METRICS.teachersPresentToday}/{MOCK_ADMIN_METRICS.totalTeachers}
                    </Text>
                    <View style={[styles.kpiIcon, { backgroundColor: Palette.navyTint }]}>
                      <Ionicons name="briefcase" size={16} color={Palette.primaryNavy} />
                    </View>
                  </View>
                  <Text style={styles.kpiTitle}>Staff on Duty</Text>
                  <Text style={styles.kpiDesc}>4 on approved leave</Text>
                </AppCard>

                <AppCard style={styles.kpiCard}>
                  <View style={styles.kpiTopRow}>
                    <Text style={[styles.kpiNumber, { color: Palette.primaryNavy }]} numberOfLines={1}>
                      {MOCK_ADMIN_METRICS.feesCollectedAmount}
                    </Text>
                    <View style={[styles.kpiIcon, { backgroundColor: Palette.orangeTint }]}>
                      <Ionicons name="cash" size={16} color={Palette.warningOrange} />
                    </View>
                  </View>
                  <Text style={styles.kpiTitle}>Fee Revenue YTD</Text>
                  <Text style={styles.kpiDesc}>$32,100 pending</Text>
                </AppCard>
              </View>

              {/* CENTER SQUARE SECTION HUBS */}
              <View style={styles.centerSquareSection}>
                <View style={styles.squareHeaderRow}>
                  <Text style={styles.squareHeaderTitle}>Admin Command Portals</Text>
                  <Text style={styles.squareHeaderSubtitle}>Direct Navigation</Text>
                </View>

                <View style={styles.squareGrid}>
                  {/* Square 1: Students */}
                  <TouchableOpacity
                    style={[styles.squareCard, styles.squareCardStudents]}
                    activeOpacity={0.75}
                    onPress={() => setActiveTab('students')}>
                    <View style={styles.squareTopRow}>
                      <View style={[styles.squareIconBox, { backgroundColor: '#EEF2FF' }]}>
                        <Ionicons name="people" size={24} color="#4F46E5" />
                      </View>
                      <View style={[styles.squareBadge, { backgroundColor: '#E0E7FF' }]}>
                        <Text style={[styles.squareBadgeText, { color: '#4338CA' }]}>
                          {MOCK_ADMIN_METRICS.totalStudents} Enrolled
                        </Text>
                      </View>
                    </View>
                    <View style={styles.squareBottomInfo}>
                      <Text style={styles.squareTitle}>Students</Text>
                      <Text style={styles.squareSubtitle} numberOfLines={1}>
                        Directory & roster
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Square 2: Communication */}
                  <TouchableOpacity
                    style={[styles.squareCard, styles.squareCardComm]}
                    activeOpacity={0.75}
                    onPress={() => setActiveTab('communication')}>
                    <View style={styles.squareTopRow}>
                      <View style={[styles.squareIconBox, { backgroundColor: '#F0FDF4' }]}>
                        <Ionicons name="megaphone" size={24} color="#16A34A" />
                      </View>
                      <View style={[styles.squareBadge, { backgroundColor: '#DCFCE7' }]}>
                        <Text style={[styles.squareBadgeText, { color: '#15803D' }]}>
                          Broadcast
                        </Text>
                      </View>
                    </View>
                    <View style={styles.squareBottomInfo}>
                      <Text style={styles.squareTitle}>Broadcasts</Text>
                      <Text style={styles.squareSubtitle} numberOfLines={1}>
                        Notices & alerts
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Square 3: Fees */}
                  <TouchableOpacity
                    style={[styles.squareCard, styles.squareCardFees]}
                    activeOpacity={0.75}
                    onPress={() => setActiveTab('fees')}>
                    <View style={styles.squareTopRow}>
                      <View style={[styles.squareIconBox, { backgroundColor: '#FFFBEB' }]}>
                        <Ionicons name="cash" size={24} color="#D97706" />
                      </View>
                      <View style={[styles.squareBadge, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={[styles.squareBadgeText, { color: '#B45309' }]}>
                          Revenue
                        </Text>
                      </View>
                    </View>
                    <View style={styles.squareBottomInfo}>
                      <Text style={styles.squareTitle}>Fees & Dues</Text>
                      <Text style={styles.squareSubtitle} numberOfLines={1}>
                        Collections ledger
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Square 4: Reports */}
                  <TouchableOpacity
                    style={[styles.squareCard, styles.squareCardReports]}
                    activeOpacity={0.75}
                    onPress={() => setActiveTab('reports')}>
                    <View style={styles.squareTopRow}>
                      <View style={[styles.squareIconBox, { backgroundColor: '#FAF5FF' }]}>
                        <Ionicons name="stats-chart" size={24} color="#9333EA" />
                      </View>
                      <View style={[styles.squareBadge, { backgroundColor: '#F3E8FF' }]}>
                        <Text style={[styles.squareBadgeText, { color: '#7E22CE' }]}>
                          Exports
                        </Text>
                      </View>
                    </View>
                    <View style={styles.squareBottomInfo}>
                      <Text style={styles.squareTitle}>Reports</Text>
                      <Text style={styles.squareSubtitle} numberOfLines={1}>
                        Audits & analytics
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Responsive Split Section (Desktop 2-column) */}
              <View style={[styles.splitSection, isDesktop && styles.splitSectionDesktop]}>
                {/* Left: Quick Student Directory */}
                <AppCard style={[styles.flexLeft, isDesktop && { flex: 1.4 }]}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.headerTextCol}>
                      <Text style={styles.sectionHeading} numberOfLines={1} ellipsizeMode="tail">Student Roster Preview</Text>
                      <Text style={styles.sectionSub} numberOfLines={1}>Grade 8 - Section A</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.headerPillBtn}
                      activeOpacity={0.7}
                      onPress={() => setActiveTab('students')}>
                      <Text style={styles.headerPillText}>Directory</Text>
                      <Ionicons name="arrow-forward" size={12} color={Palette.actionBlue} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableCol, { width: 44 }]}>Roll</Text>
                    <Text style={[styles.tableCol, { flex: 2 }]}>Student</Text>
                    <Text style={[styles.tableCol, { flex: 1, textAlign: 'center' }]}>Status</Text>
                    <Text style={[styles.tableCol, { flex: 1, textAlign: 'right' }]}>Action</Text>
                  </View>

                  {MOCK_ROSTER_8A.slice(0, 5).map((s) => (
                    <View key={s.id} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { width: 44, fontWeight: '700' }]}>
                        #{s.rollNo}
                      </Text>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.studentNameText}>{s.name}</Text>
                        <Text style={styles.studentGradeText}>Grade 8-A</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <StatusPill status={s.status} size="sm" />
                      </View>
                      <TouchableOpacity
                        style={{ flex: 1, alignItems: 'flex-end' }}
                        onPress={() =>
                          showAlert({
                            title: s.name,
                            message: `Viewing student profile for ${s.name}. Class Roll #${s.rollNo}.`,
                            type: 'info',
                            icon: 'person-outline',
                          })
                        }>
                        <Text style={styles.actionLink}>Profile</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </AppCard>

                {/* Right: Broadcasts & Alerts Feed */}
                <AppCard style={[styles.flexRight, isDesktop && { flex: 1 }]}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.headerTextCol}>
                      <Text style={styles.sectionHeading} numberOfLines={1} ellipsizeMode="tail">Active Circulars</Text>
                      <Text style={styles.sectionSub} numberOfLines={1}>{announcements.length} school notices</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.headerPillBtn}
                      activeOpacity={0.7}
                      onPress={() => setActiveTab('communication')}>
                      <Text style={styles.headerPillText}>Broadcasts</Text>
                      <Ionicons name="arrow-forward" size={12} color={Palette.actionBlue} />
                    </TouchableOpacity>
                  </View>

                  {announcements.map((ann) => (
                    <View key={ann.id} style={styles.announcementItem}>
                      <View style={styles.annMetaRow}>
                        <StatusPill status={ann.priority} size="sm" />
                        <Text style={styles.annDateText}>{ann.date}</Text>
                      </View>
                      <Text style={styles.annTitleText} numberOfLines={2}>
                        {ann.title}
                      </Text>
                      <Text style={styles.annAuthorText}>Target: {ann.audience.join(', ')}</Text>
                    </View>
                  ))}
                </AppCard>
              </View>
            </View>
          )}

          {/* TAB 2: STUDENTS */}
          {activeTab === 'students' && (
            <AppCard style={styles.tabContent}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.headerTextCol}>
                  <Text style={styles.sectionHeading} numberOfLines={1} ellipsizeMode="tail">Student Enrollment Directory</Text>
                  <Text style={styles.sectionSub} numberOfLines={1}>Search and manage student profiles</Text>
                </View>
                <AppButton
                  title="+ Enroll Student"
                  size="sm"
                  variant="primary"
                  onPress={() =>
                    showAlert({
                      title: 'Enroll Student',
                      message: 'Open student enrollment registration form.',
                      type: 'info',
                      icon: 'person-add-outline',
                    })
                  }
                />
              </View>

              <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color={Palette.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by student name or roll number..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <View style={styles.tableHeader}>
                <Text style={[styles.tableCol, { width: 50 }]}>Roll</Text>
                <Text style={[styles.tableCol, { flex: 2 }]}>Student Name</Text>
                <Text style={[styles.tableCol, { flex: 1, textAlign: 'center' }]}>Attendance</Text>
                <Text style={[styles.tableCol, { flex: 1, textAlign: 'right' }]}>Profile</Text>
              </View>

              {MOCK_ROSTER_8A.filter((s) =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((s) => (
                <View key={s.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: 50, fontWeight: '700' }]}>
                    #{s.rollNo}
                  </Text>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.studentNameText}>{s.name}</Text>
                    <Text style={styles.studentGradeText}>Grade 8 - Section A</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <StatusPill status={s.status} size="sm" />
                  </View>
                  <TouchableOpacity
                    style={{ flex: 1, alignItems: 'flex-end' }}
                    onPress={() =>
                      showAlert({
                        title: s.name,
                        message: `Complete student record for ${s.name}. Attendance: 94%. Fee status: Active.`,
                        type: 'info',
                        icon: 'folder-open-outline',
                      })
                    }>
                    <Text style={styles.actionLink}>View File</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </AppCard>
          )}

          {/* TAB 3: EVENTS MANAGEMENT (Requirement 6) */}
          {activeTab === 'events' && (
            <View style={styles.tabContent}>
              <View style={styles.eventHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>Campus Activities & Event Management</Text>
                  <Text style={styles.sectionSubtitle}>
                    {events.length} School Events Scheduled • Manage dates, venues & target participants
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.createEventBtn}
                  activeOpacity={0.85}
                  onPress={() => setIsEventModalOpen(true)}>
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={styles.createEventBtnText}>Create School Event</Text>
                </TouchableOpacity>
              </View>

              {/* Event Category Filters */}
              <View style={styles.eventFiltersRow}>
                {(['all', 'academic', 'sports', 'cultural', 'ptm', 'workshop', 'holiday'] as const).map((cat) => {
                  const isActive = eventCategoryFilter === cat;
                  const count =
                    cat === 'all'
                      ? events.length
                      : events.filter((e) => e.category === cat).length;
                  const label =
                    cat === 'all'
                      ? 'All'
                      : cat === 'ptm'
                      ? 'PTM'
                      : cat.charAt(0).toUpperCase() + cat.slice(1);

                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.eventFilterChip, isActive && styles.eventFilterChipActive]}
                      onPress={() => setEventCategoryFilter(cat)}>
                      <Text style={[styles.eventFilterChipText, isActive && styles.eventFilterChipTextActive]}>
                        {label} ({count})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Events Grid / Cards */}
              <View style={styles.eventsGrid}>
                {events
                  .filter((e) => eventCategoryFilter === 'all' || e.category === eventCategoryFilter)
                  .map((ev) => {
                    return (
                      <AppCard key={ev.id} style={styles.eventCardItem}>
                        <View style={styles.eventCardHeader}>
                          <View style={styles.eventCategoryTag}>
                            <Ionicons
                              name={
                                ev.category === 'sports'
                                  ? 'football'
                                  : ev.category === 'academic'
                                  ? 'school'
                                  : ev.category === 'cultural'
                                  ? 'color-palette'
                                  : ev.category === 'ptm'
                                  ? 'people'
                                  : ev.category === 'workshop'
                                  ? 'bulb'
                                  : 'calendar'
                              }
                              size={13}
                              color="#4F46E5"
                            />
                            <Text style={styles.eventCategoryTagText}>
                              {ev.category.toUpperCase()}
                            </Text>
                          </View>
                          <View style={styles.eventRsvpBadge}>
                            <Ionicons name="people" size={12} color="#059669" />
                            <Text style={styles.eventRsvpBadgeText}>{ev.rsvpCount || 48} Registered</Text>
                          </View>
                        </View>

                        <Text style={styles.eventItemTitle}>{ev.title}</Text>
                        <Text style={styles.eventItemDesc}>{ev.description}</Text>

                        <View style={styles.eventMetaCluster}>
                          <View style={styles.eventMetaLine}>
                            <Ionicons name="calendar-outline" size={14} color="#64748B" />
                            <Text style={styles.eventMetaLineText}>{ev.date} • {ev.time}</Text>
                          </View>
                          <View style={styles.eventMetaLine}>
                            <Ionicons name="location-outline" size={14} color="#64748B" />
                            <Text style={styles.eventMetaLineText}>{ev.venue}</Text>
                          </View>
                        </View>

                        <View style={styles.eventAudienceRow}>
                          <Text style={styles.eventAudienceLabel}>Target Audience:</Text>
                          {ev.targetAudience.map((aud) => (
                            <View key={aud} style={styles.audienceTagSmall}>
                              <Text style={styles.audienceTagSmallText}>{aud.toUpperCase()}</Text>
                            </View>
                          ))}
                        </View>

                        <View style={styles.eventActionsRow}>
                          <TouchableOpacity
                            style={styles.eventActionBtn}
                            activeOpacity={0.8}
                            onPress={() =>
                              showAlert({
                                title: `Event Details: ${ev.title}`,
                                message: `Date: ${ev.date}\nTime: ${ev.time}\nVenue: ${ev.venue}\nOrganizer: ${ev.organizer}\nAudience: ${ev.targetAudience.join(', ')}\n\n${ev.description}`,
                                type: 'info',
                                icon: 'calendar',
                              })
                            }>
                            <Ionicons name="eye-outline" size={14} color="#4F46E5" />
                            <Text style={styles.eventActionBtnText}>View Details & RSVP</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.eventBroadcastBtn}
                            activeOpacity={0.8}
                            onPress={() => {
                              addAnnouncement({
                                title: `[EVENT REMINDER] ${ev.title}`,
                                content: `Upcoming ${ev.category} event on ${ev.date} at ${ev.venue}. Time: ${ev.time}. All designated participants are requested to assemble.`,
                                priority: 'important',
                                audience: ev.targetAudience,
                                authorName: 'School Event Desk',
                              });
                              showAlert({
                                title: 'Reminder Broadcast Dispatched! 📢',
                                message: `Notification sent to ${ev.targetAudience.join(', ')} for "${ev.title}".`,
                                type: 'success',
                              });
                            }}>
                            <Ionicons name="notifications-outline" size={14} color="#059669" />
                            <Text style={styles.eventBroadcastBtnText}>Send Reminder</Text>
                          </TouchableOpacity>
                        </View>
                      </AppCard>
                    );
                  })}
              </View>
            </View>
          )}

          {/* TAB 3: COMMUNICATION */}
          {activeTab === 'communication' && (
            <View style={styles.tabContent}>
              <AppCard style={styles.broadcastBannerCard}>
                <View style={[styles.broadcastBannerRow, isDesktop && styles.broadcastBannerRowDesktop]}>
                  <View style={styles.broadcastBannerTextCol}>
                    <Text style={styles.sectionHeading} numberOfLines={1} ellipsizeMode="tail">
                      Emergency & Circular Broadcaster
                    </Text>
                    <Text style={styles.sectionSub}>
                      Publish official notices to all parents, teachers, and students simultaneously.
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    <AppButton
                      title="Create School Event"
                      variant="primary"
                      size="md"
                      icon={<Ionicons name="calendar-outline" size={16} color="#FFFFFF" />}
                      onPress={() => setIsEventModalOpen(true)}
                    />
                    <AppButton
                      title="Send Emergency Alert"
                      variant="danger"
                      size="md"
                      icon={<Ionicons name="warning" size={16} color="#FFFFFF" />}
                      onPress={() => setAlertModalOpen(true)}
                      style={styles.broadcastActionBtn}
                    />
                  </View>
                </View>
              </AppCard>

              <AppCard style={styles.historyCard}>
                <Text style={styles.sectionHeading}>Broadcast History</Text>
                {announcements.map((ann) => (
                  <View key={ann.id} style={styles.broadcastHistoryItem}>
                    <View style={styles.annMetaRow}>
                      <StatusPill status={ann.priority} size="sm" />
                      <Text style={styles.annDateText}>{ann.date}</Text>
                    </View>
                    <Text style={styles.annTitleText}>{ann.title}</Text>
                    <Text style={styles.annBodyText}>{ann.content}</Text>
                    <Text style={styles.annAuthorText}>Author: {ann.authorName}</Text>
                  </View>
                ))}
              </AppCard>
            </View>
          )}

          {/* TAB 4: FEES & REVENUE */}
          {activeTab === 'fees' && (
            <View style={styles.tabContent}>
              <View style={[styles.kpiGrid, isDesktop && styles.kpiGridDesktop]}>
                <AppCard style={styles.kpiCard}>
                  <Text style={[styles.kpiNumber, { color: Palette.successGreen }]}>$428,500</Text>
                  <Text style={styles.kpiTitle}>Total Fees Collected</Text>
                  <Text style={styles.kpiDesc}>Term 1 & Term 2</Text>
                </AppCard>
                <AppCard style={styles.kpiCard}>
                  <Text style={[styles.kpiNumber, { color: Palette.warningOrange }]}>$32,100</Text>
                  <Text style={styles.kpiTitle}>Pending Balance</Text>
                  <Text style={styles.kpiDesc}>Due before mid-semester</Text>
                </AppCard>
              </View>

              <AppCard style={styles.historyCard}>
                <Text style={styles.sectionHeading}>Fee Accounting & Invoicing</Text>
                <Text style={styles.sectionSub}>Automated invoice generation and payment logs</Text>
                <AppButton
                  title="Download Fee Breakdown (Excel)"
                  variant="outline"
                  icon={<Ionicons name="download-outline" size={18} color={Palette.primaryNavy} />}
                  onPress={() =>
                    showAlert({
                      title: 'Fee Ledger Export',
                      message: 'Exporting institutional fee breakdown ledger (Excel format).',
                      type: 'success',
                      icon: 'download-outline',
                    })
                  }
                  style={{ marginTop: 12 }}
                />
              </AppCard>
            </View>
          )}

          {/* TAB 5: REPORTS */}
          {activeTab === 'reports' && (
            <View style={styles.tabContent}>
              <View style={styles.reportsSubNavRow}>
                <TouchableOpacity
                  style={[
                    styles.reportsSubNavBtn,
                    reportsSubTab === 'attendance' && styles.reportsSubNavBtnActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setReportsSubTab('attendance')}>
                  <Ionicons
                    name="cloud-download"
                    size={15}
                    color={reportsSubTab === 'attendance' ? '#FFFFFF' : '#4F46E5'}
                  />
                  <Text
                    style={[
                      styles.reportsSubNavText,
                      reportsSubTab === 'attendance' && styles.reportsSubNavTextActive,
                    ]}>
                    Class Attendance Excel Export
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.reportsSubNavBtn,
                    reportsSubTab === 'archive' && styles.reportsSubNavBtnActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setReportsSubTab('archive')}>
                  <Ionicons
                    name="folder-open"
                    size={15}
                    color={reportsSubTab === 'archive' ? '#FFFFFF' : '#4F46E5'}
                  />
                  <Text
                    style={[
                      styles.reportsSubNavText,
                      reportsSubTab === 'archive' && styles.reportsSubNavTextActive,
                    ]}>
                    Official Documents & Archives
                  </Text>
                </TouchableOpacity>
              </View>

              {reportsSubTab === 'attendance' ? (
                <AttendanceExcelExportView />
              ) : (
                <AppCard style={styles.tabContent}>
                  <View style={styles.headerTextCol}>
                    <Text style={styles.sectionHeading} numberOfLines={1} ellipsizeMode="tail">Official Academic & Administrative Reports</Text>
                    <Text style={styles.sectionSub} numberOfLines={1}>Generate compliant PDF and spreadsheet reports</Text>
                  </View>

                  <View style={{ gap: 10, marginTop: 14 }}>
                    <AppButton
                      title="Export Attendance Ledger (PDF)"
                      variant="outline"
                      icon={<Ionicons name="document-text-outline" size={18} color={Palette.primaryNavy} />}
                      onPress={() =>
                        showAlert({
                          title: 'Attendance Report',
                          message: 'Exporting Attendance Ledger PDF document.',
                          type: 'success',
                          icon: 'document-text-outline',
                        })
                      }
                    />
                    <AppButton
                      title="Export Academic Score Reports (Excel)"
                      variant="outline"
                      icon={<Ionicons name="stats-chart-outline" size={18} color={Palette.primaryNavy} />}
                      onPress={() =>
                        showAlert({
                          title: 'Score Report',
                          message: 'Exporting Term Academic Grade Report (Excel spreadsheet).',
                          type: 'success',
                          icon: 'stats-chart-outline',
                        })
                      }
                    />
                    <AppButton
                      title="Export Staff Workload & Duty Logs"
                      variant="outline"
                      icon={<Ionicons name="briefcase-outline" size={18} color={Palette.primaryNavy} />}
                      onPress={() =>
                        showAlert({
                          title: 'Staff Duty Log',
                          message: 'Exporting Staff Duty and Faculty Logs PDF.',
                          type: 'success',
                          icon: 'briefcase-outline',
                        })
                      }
                    />
                  </View>
                </AppCard>
              )}
            </View>
          )}
        </ScrollView>

        {/* Modern Bottom Navigation Bar (Matching Demo 4 Parent Portal) */}
        <View style={[styles.bottomBar, isDesktop && styles.bottomBarDesktop]}>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('overview')}>
            <Ionicons
              name={activeTab === 'overview' ? 'grid' : 'grid-outline'}
              size={22}
              color={activeTab === 'overview' ? '#4F46E5' : '#64748B'}
            />
            <Text
              style={[styles.navLabel, activeTab === 'overview' && styles.navLabelActive]}>
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('students')}>
            <Ionicons
              name={activeTab === 'students' ? 'school' : 'school-outline'}
              size={22}
              color={activeTab === 'students' ? '#4F46E5' : '#64748B'}
            />
            <Text
              style={[styles.navLabel, activeTab === 'students' && styles.navLabelActive]}>
              Students
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('events')}>
            <Ionicons
              name={activeTab === 'events' ? 'calendar' : 'calendar-outline'}
              size={22}
              color={activeTab === 'events' ? '#4F46E5' : '#64748B'}
            />
            <Text
              style={[styles.navLabel, activeTab === 'events' && styles.navLabelActive]}>
              Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('communication')}>
            <Ionicons
              name={activeTab === 'communication' ? 'megaphone' : 'megaphone-outline'}
              size={22}
              color={activeTab === 'communication' ? '#4F46E5' : '#64748B'}
            />
            <Text
              style={[styles.navLabel, activeTab === 'communication' && styles.navLabelActive]}>
              Broadcast
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('fees')}>
            <Ionicons
              name={activeTab === 'fees' ? 'card' : 'card-outline'}
              size={22}
              color={activeTab === 'fees' ? '#4F46E5' : '#64748B'}
            />
            <Text
              style={[styles.navLabel, activeTab === 'fees' && styles.navLabelActive]}>
              Fees
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('reports')}>
            <Ionicons
              name={activeTab === 'reports' ? 'document-text' : 'document-text-outline'}
              size={22}
              color={activeTab === 'reports' ? '#4F46E5' : '#64748B'}
            />
            <Text
              style={[styles.navLabel, activeTab === 'reports' && styles.navLabelActive]}>
              Reports
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* EMERGENCY ALERT MODAL */}
      <Modal visible={isAlertModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="warning" size={22} color={Palette.errorRed} />
                <Text style={styles.modalTitle}>Broadcast Emergency Notice</Text>
              </View>
              <TouchableOpacity onPress={() => setAlertModalOpen(false)}>
                <Ionicons name="close" size={22} color={Palette.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Alert Headline</Text>
            <TextInput
              style={styles.input}
              value={alertTitle}
              onChangeText={setAlertTitle}
              placeholder="e.g. Flash Flood Advisory / Early School Dismissal"
            />

            <Text style={styles.inputLabel}>Message Body</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={alertMessage}
              onChangeText={setAlertMessage}
              multiline
              numberOfLines={4}
              placeholder="Provide exact instructions, bus timings, and emergency contacts..."
            />

            <View style={styles.modalActions}>
              <AppButton
                title="Cancel"
                variant="outline"
                style={{ flex: 1 }}
                onPress={() => setAlertModalOpen(false)}
              />
              <AppButton
                title="Broadcast Now"
                variant="danger"
                style={{ flex: 1.5 }}
                onPress={handleSendEmergencyAlert}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* CAMPUS PRINCIPAL & ADMIN PROFILE MODAL */}
      <Modal
        visible={isProfileModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsProfileModalOpen(false)}>
        <View style={styles.profileModalOverlay}>
          <View style={styles.profileModalCard}>
            {/* Modal Header */}
            <View style={styles.profileModalHeader}>
              <View>
                <Text style={styles.profileModalTag}>EXECUTIVE PROFILE</Text>
                <Text style={styles.profileModalTitle}>Administrator Profile</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsProfileModalOpen(false)}
                style={styles.profileCloseBtn}
                activeOpacity={0.7}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.profileModalBody}>
              {/* Profile Hero Card */}
              <View style={styles.profileHeroSection}>
                <View style={styles.profileLargeAvatarContainer}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    }}
                    style={styles.profileLargeAvatar}
                  />
                  <View style={styles.profileLargeStatusDot} />
                </View>

                <Text style={styles.profileHeroName}>Dr. Robert Sterling</Text>
                <Text style={styles.profileHeroSub}>
                  Head Administrator • Oakridge International Academy
                </Text>
                <View style={styles.profileHeroBadge}>
                  <Text style={styles.profileHeroBadgeText}>Authorized Campus Principal</Text>
                </View>
              </View>

              {/* Admin Details Grid */}
              <View style={styles.profileDetailsGrid}>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Admin ID</Text>
                  <Text style={styles.profileDetailVal}>ADM-1002</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Campus</Text>
                  <Text style={styles.profileDetailVal}>Oakridge Main</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Enrolled</Text>
                  <Text style={styles.profileDetailVal}>1,248 Students</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Faculty Staff</Text>
                  <Text style={styles.profileDetailVal} numberOfLines={1}>88 Certified</Text>
                </View>
              </View>

              {/* Quick Navigation */}
              <View style={styles.profileMenuSection}>
                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsProfileModalOpen(false);
                    setActiveTab('students');
                  }}>
                  <View style={[styles.profileMenuIconBox, { backgroundColor: '#EEF2FF' }]}>
                    <Ionicons name="people-outline" size={18} color="#4F46E5" />
                  </View>
                  <View style={styles.profileMenuTextCol}>
                    <Text style={styles.profileMenuTitle}>Student Directory & Roster</Text>
                    <Text style={styles.profileMenuSub}>Inspect student profiles & records</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsProfileModalOpen(false);
                    setActiveTab('fees');
                  }}>
                  <View style={[styles.profileMenuIconBox, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="card-outline" size={18} color="#059669" />
                  </View>
                  <View style={styles.profileMenuTextCol}>
                    <Text style={styles.profileMenuTitle}>Fee Collections & Dues</Text>
                    <Text style={styles.profileMenuSub}>Track tuition records & receipts</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsProfileModalOpen(false);
                    setActiveTab('reports');
                  }}>
                  <View style={[styles.profileMenuIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="document-text-outline" size={18} color="#D97706" />
                  </View>
                  <View style={styles.profileMenuTextCol}>
                    <Text style={styles.profileMenuTitle}>Campus Reports & Audits</Text>
                    <Text style={styles.profileMenuSub}>Academic summaries & analytics</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Sign Out Button (Inside Profile Modal) */}
              <TouchableOpacity
                style={styles.profileSignOutBtn}
                activeOpacity={0.85}
                onPress={() => {
                  setIsProfileModalOpen(false);
                  showAlert({
                    title: 'Sign Out',
                    message: 'Are you sure you want to return to the institutional login?',
                    type: 'confirm',
                    buttons: [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Sign Out', style: 'destructive', onPress: logout },
                    ],
                  });
                }}>
                <Ionicons name="log-out-outline" size={18} color="#DC2626" />
                <Text style={styles.profileSignOutText}>Sign Out of Admin Portal</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* EVENT CREATION MODAL */}
      <CreateEventModal
        visible={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Palette.background,
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
  sidebar: {
    width: 240,
    backgroundColor: Palette.primaryNavy,
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderRightWidth: 1,
    borderRightColor: '#1A334E',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: Palette.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCol: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  brandSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  sidebarNav: {
    flex: 1,
    paddingTop: 20,
    gap: 6,
  },
  sidebarSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radii.sm,
  },
  sidebarNavItemActive: {
    backgroundColor: '#1E3A5F',
  },
  sidebarNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  sidebarNavTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sidebarFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 10,
  },
  sidebarLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: Radii.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  sidebarLogoutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FCA5A5',
  },
  chatHeaderBtn: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBadgeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  reportsSubNavRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  reportsSubNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  reportsSubNavBtnActive: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  reportsSubNavText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  reportsSubNavTextActive: {
    color: '#FFFFFF',
  },
  profileBtn: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: 19,
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
    width: 34,
    height: 34,
    borderRadius: 17,
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
  profileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  profileModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  profileModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  profileModalTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.8,
  },
  profileModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  profileCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileModalBody: {
    padding: 20,
    gap: 16,
  },
  profileHeroSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  profileLargeAvatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileLargeAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#EEF2FF',
  },
  profileLargeStatusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  profileHeroName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileHeroSub: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  profileHeroBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    marginTop: 8,
  },
  profileHeroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  profileDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  profileDetailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileDetailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  profileDetailVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  profileMenuSection: {
    gap: 8,
    marginTop: 4,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    borderRadius: 14,
    gap: 12,
  },
  profileMenuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMenuTextCol: {
    flex: 1,
  },
  profileMenuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  profileMenuSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  profileSignOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  profileSignOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  principalAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  principalName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  principalRole: {
    fontSize: 11,
    color: '#94A3B8',
  },
  mainWorkspace: {
    flex: 1,
    minWidth: 0,
  },
  centerSquareSection: {
    marginVertical: 4,
  },
  squareHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  squareHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  squareHeaderSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  squareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  squareCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    minHeight: 126,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  squareCardStudents: {
    borderColor: '#C7D2FE',
  },
  squareCardComm: {
    borderColor: '#BBF7D0',
  },
  squareCardFees: {
    borderColor: '#FDE68A',
  },
  squareCardReports: {
    borderColor: '#E9D5FF',
  },
  squareTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  squareIconBox: {
    width: 44,
    height: 44,
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
    fontSize: 10,
    fontWeight: '700',
  },
  squareBottomInfo: {
    marginTop: 8,
  },
  squareTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  squareSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  appHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingBottom: 14,
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
    alignItems: 'center',
  },
  headerTitleCol: {
    flex: 1,
    marginRight: 12,
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
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
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
    gap: 8,
  },
  alertHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  tabContent: {
    gap: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiGridDesktop: {
    flexWrap: 'nowrap',
    gap: 14,
  },
  kpiCard: {
    flex: 1,
    minWidth: 135,
    padding: 12,
    gap: 3,
  },
  kpiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 4,
  },
  kpiNumber: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.primaryNavy,
    flex: 1,
    minWidth: 0,
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  kpiTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textDark,
  },
  kpiDesc: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  splitSection: {
    gap: 16,
  },
  splitSectionDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flexLeft: {
    gap: 12,
  },
  flexRight: {
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    minWidth: 0,
    paddingBottom: 4,
  },
  headerTextCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
  },
  sectionSub: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  headerPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.blueTint,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radii.pill,
    flexShrink: 0,
  },
  headerPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  tableCol: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  tableCell: {
    fontSize: 12,
    color: Palette.textDark,
  },
  studentNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textDark,
  },
  studentGradeText: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  actionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  announcementItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    gap: 4,
  },
  annMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  annDateText: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  annTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textDark,
  },
  annAuthorText: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Palette.textDark,
  },
  broadcastBannerCard: {
    backgroundColor: Palette.surface,
  },
  broadcastBannerRow: {
    gap: 12,
  },
  broadcastBannerRowDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  broadcastBannerTextCol: {
    gap: 4,
  },
  broadcastActionBtn: {
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  historyCard: {
    gap: 12,
  },
  broadcastHistoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    gap: 6,
  },
  annBodyText: {
    fontSize: 13,
    color: Palette.textDark,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: Palette.surface,
    borderRadius: Radii.modal,
    padding: 24,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    paddingBottom: 12,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.errorRed,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  input: {
    backgroundColor: Palette.background,
    padding: 12,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    fontSize: 14,
    color: Palette.textDark,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  createEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  createEventBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  eventFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  eventFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  eventFilterChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  eventFilterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  eventFilterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  eventsGrid: {
    gap: 14,
  },
  eventCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventCategoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventCategoryTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  eventRsvpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventRsvpBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  eventItemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  eventItemDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  eventMetaCluster: {
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  eventMetaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventMetaLineText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  eventAudienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  eventAudienceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  audienceTagSmall: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  audienceTagSmallText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  eventActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  eventActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingVertical: 9,
    borderRadius: 8,
  },
  eventActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  eventBroadcastBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 9,
    borderRadius: 8,
  },
  eventBroadcastBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
});
