import React, { useState } from 'react';
import {
  Alert,
  Modal,
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
import { useApp } from '@/context/AppContext';
import { MOCK_ADMIN_METRICS, MOCK_ROSTER_8A, MOCK_SCHOOL } from '@/data/mockData';

type AdminTab = 'overview' | 'students' | 'communication' | 'fees' | 'reports';

const NAV_ITEMS: { id: AdminTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'overview', label: 'Dashboard', icon: 'speedometer-outline' },
  { id: 'students', label: 'Students', icon: 'school-outline' },
  { id: 'communication', label: 'Communication', icon: 'megaphone-outline' },
  { id: 'fees', label: 'Fees & Dues', icon: 'card-outline' },
  { id: 'reports', label: 'Reports', icon: 'document-text-outline' },
];

export const AdminDashboardView: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const { announcements, addAnnouncement } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleSendEmergencyAlert = () => {
    if (!alertTitle || !alertMessage) {
      Alert.alert('Required', 'Please enter an alert title and message.');
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
    Alert.alert(
      'Emergency Broadcast Sent',
      'High-priority SMS and Push Notifications triggered for 1,248 student families and 88 staff members.'
    );
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
            <View style={styles.principalAvatar}>
              <Ionicons name="person" size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.principalName}>Dr. Arthur Sterling</Text>
              <Text style={styles.principalRole}>Principal Office</Text>
            </View>
          </View>
        </View>
      )}

      {/* MAIN ADMIN WORKSPACE */}
      <View style={styles.mainWorkspace}>
        {/* MOBILE / TABLET NAV TABS (When width < 900px) */}
        {!isDesktop && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.mobileNavBar}
            contentContainerStyle={styles.mobileNavContent}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setActiveTab(item.id)}
                  style={[styles.mobileNavBtn, isActive && styles.mobileNavBtnActive]}>
                  <Ionicons
                    name={item.icon}
                    size={14}
                    color={isActive ? Palette.actionBlue : Palette.textSecondary}
                  />
                  <Text
                    style={[
                      styles.mobileNavBtnText,
                      isActive && styles.mobileNavBtnTextActive,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* WORKSPACE HEADER BAR */}
        <View style={styles.workspaceHeader}>
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
              {activeTab === 'overview' && 'Administrative Overview'}
              {activeTab === 'students' && 'Student Management & Roster'}
              {activeTab === 'communication' && 'Communication & Broadcast Center'}
              {activeTab === 'fees' && 'Fees & Revenue Dashboard'}
              {activeTab === 'reports' && 'Exportable School Reports'}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1} ellipsizeMode="tail">
              Academic Year 2026–2027 • Oakridge International Academy
            </Text>
          </View>

          <AppButton
            title="Broadcast Alert"
            variant="danger"
            size="sm"
            icon={<Ionicons name="warning" size={14} color="#FFFFFF" />}
            onPress={() => setAlertModalOpen(true)}
            style={styles.broadcastHeaderBtn}
          />
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
                          Alert.alert(s.name, `Viewing student profile for ${s.name}.`)
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
                  onPress={() => Alert.alert('Enroll', 'Open student enrollment form.')}
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
                      Alert.alert(
                        s.name,
                        `Complete student record for ${s.name}. Attendance: 94%. Fee status: Active.`
                      )
                    }>
                    <Text style={styles.actionLink}>View File</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </AppCard>
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
                  <AppButton
                    title="Send Emergency Alert"
                    variant="danger"
                    size="md"
                    icon={<Ionicons name="warning" size={16} color="#FFFFFF" />}
                    onPress={() => setAlertModalOpen(true)}
                    style={styles.broadcastActionBtn}
                  />
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
                  onPress={() => Alert.alert('Export', 'Downloading financial fee ledger.')}
                  style={{ marginTop: 12 }}
                />
              </AppCard>
            </View>
          )}

          {/* TAB 5: REPORTS */}
          {activeTab === 'reports' && (
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
                  onPress={() => Alert.alert('Report', 'Exporting Attendance Ledger PDF.')}
                />
                <AppButton
                  title="Export Academic Score Reports (Excel)"
                  variant="outline"
                  icon={<Ionicons name="stats-chart-outline" size={18} color={Palette.primaryNavy} />}
                  onPress={() => Alert.alert('Report', 'Exporting Term Grade Report Excel.')}
                />
                <AppButton
                  title="Export Staff Workload & Duty Logs"
                  variant="outline"
                  icon={<Ionicons name="briefcase-outline" size={18} color={Palette.primaryNavy} />}
                  onPress={() => Alert.alert('Report', 'Exporting Staff Duty Logs.')}
                />
              </View>
            </AppCard>
          )}
        </ScrollView>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Palette.background,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
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
  mobileNavBar: {
    flexGrow: 0,
    flexShrink: 0,
    height: 52,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  mobileNavContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  mobileNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: Radii.pill,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    flexShrink: 0,
  },
  mobileNavBtnActive: {
    backgroundColor: Palette.blueTint,
    borderColor: Palette.actionBlue,
  },
  mobileNavBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  mobileNavBtnTextActive: {
    color: Palette.actionBlue,
    fontWeight: '700',
  },
  workspaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textDark,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  broadcastHeaderBtn: {
    flexShrink: 0,
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
});
