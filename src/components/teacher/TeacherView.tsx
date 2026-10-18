import React, { useState } from 'react';
import {
  Alert,
  Image,
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
import { AttendanceStatus } from '@/types';

export const TeacherView: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const {
    roster,
    updateStudentAttendance,
    markAllPresent,
    leaveRequests,
    updateLeaveRequestStatus,
    addHomework,
    announcements,
    addAnnouncement,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'attendance' | 'homework' | 'leaves'>('home');

  // Homework creation state
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState('Mathematics');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDueDate, setHwDueDate] = useState('Tomorrow, 08:30 AM');
  const [isHwModalOpen, setHwModalOpen] = useState(false);

  // Announcement composer state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'important' | 'emergency'>('normal');
  const [isAnnModalOpen, setAnnModalOpen] = useState(false);

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');
  const presentCount = roster.filter((r) => r.status === 'present').length;
  const absentCount = roster.filter((r) => r.status === 'absent').length;
  const leaveCount = roster.filter((r) => r.status === 'leave').length;

  const handleSaveAttendance = () => {
    Alert.alert(
      'Attendance Saved',
      `Grade 8-A attendance finalized: ${presentCount} Present, ${absentCount} Absent, ${leaveCount} on Leave.`
    );
  };

  const handlePublishHomework = () => {
    if (!hwTitle) {
      Alert.alert('Required', 'Please enter a homework assignment title.');
      return;
    }
    addHomework({
      classId: 'c_8a',
      className: 'Grade 8-A',
      subject: hwSubject,
      title: hwTitle,
      description: hwDesc,
      dueDate: hwDueDate,
      teacherName: 'Mrs. Sarah Jenkins',
    });
    setHwTitle('');
    setHwDesc('');
    setHwModalOpen(false);
    Alert.alert('Published', 'Homework assigned and instantly visible to Grade 8-A students & parents.');
  };

  const handleBroadcastAnnouncement = () => {
    if (!annTitle || !annContent) {
      Alert.alert('Required', 'Please fill in both title and message.');
      return;
    }
    addAnnouncement({
      title: annTitle,
      content: annContent,
      priority: annPriority,
      audience: ['all'],
      authorName: 'Mrs. Sarah Jenkins (Class Teacher)',
      pinned: annPriority !== 'normal',
    });
    setAnnTitle('');
    setAnnContent('');
    setAnnModalOpen(false);
    Alert.alert('Notice Broadcasted', 'School circular has been posted to parents and students.');
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topTabBar}>
        <View style={styles.topTabInner}>
          <TouchableOpacity
            onPress={() => setActiveTab('home')}
            style={[styles.topTab, activeTab === 'home' && styles.topTabActive]}>
            <Ionicons
              name="grid-outline"
              size={14}
              color={activeTab === 'home' ? Palette.actionBlue : Palette.textSecondary}
            />
            <Text
              style={[styles.topTabText, activeTab === 'home' && styles.topTabTextActive]}
              numberOfLines={1}>
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('attendance')}
            style={[styles.topTab, activeTab === 'attendance' && styles.topTabActive]}>
            <Ionicons
              name="checkbox-outline"
              size={14}
              color={activeTab === 'attendance' ? Palette.actionBlue : Palette.textSecondary}
            />
            <Text
              style={[styles.topTabText, activeTab === 'attendance' && styles.topTabTextActive]}
              numberOfLines={1}>
              {width < 390 ? 'Attend' : 'Attendance'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('homework')}
            style={[styles.topTab, activeTab === 'homework' && styles.topTabActive]}>
            <Ionicons
              name="book-outline"
              size={14}
              color={activeTab === 'homework' ? Palette.actionBlue : Palette.textSecondary}
            />
            <Text
              style={[styles.topTabText, activeTab === 'homework' && styles.topTabTextActive]}
              numberOfLines={1}>
              Homework
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('leaves')}
            style={[styles.topTab, activeTab === 'leaves' && styles.topTabActive]}>
            <Ionicons
              name="mail-unread-outline"
              size={14}
              color={activeTab === 'leaves' ? Palette.actionBlue : Palette.textSecondary}
            />
            <Text
              style={[styles.topTabText, activeTab === 'leaves' && styles.topTabTextActive]}
              numberOfLines={1}>
              Leaves{pendingLeaves.length > 0 ? ` (${pendingLeaves.length})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
        showsVerticalScrollIndicator={false}>
        {/* TAB 1: TEACHER HOME OVERVIEW */}
        {activeTab === 'home' && (
          <View style={[styles.tabContentCol, isDesktop && styles.tabContentColDesktop]}>
            {/* Column 1: Today's Classes */}
            <AppCard style={[styles.teachingCard, isDesktop && { flex: 1.2 }]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.headerTextCol}>
                  <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">Today's Classes</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>Monday • 4 Periods Scheduled</Text>
                </View>
                <StatusPill status="present" label="On Duty" size="sm" />
              </View>

              <View style={styles.teachingPeriodItem}>
                <View style={styles.periodTimeCol}>
                  <Text style={styles.periodTimeText}>08:30 AM</Text>
                  <Text style={styles.periodDur}>50 mins</Text>
                </View>
                <View style={styles.periodDetails}>
                  <View style={styles.periodClassRow}>
                    <Text style={styles.periodClass} numberOfLines={1} ellipsizeMode="tail">
                      Grade 8 - Section A
                    </Text>
                    <View style={styles.nowBadge}>
                      <Text style={styles.nowBadgeText}>ACTIVE</Text>
                    </View>
                  </View>
                  <Text style={styles.periodSub} numberOfLines={1} ellipsizeMode="tail">
                    Mathematics: Quadratic Equations
                  </Text>
                  <Text style={styles.periodRoom} numberOfLines={1}>
                    Room 204
                  </Text>
                </View>
              </View>

              <View style={styles.teachingPeriodItem}>
                <View style={styles.periodTimeCol}>
                  <Text style={styles.periodTimeText}>10:40 AM</Text>
                  <Text style={styles.periodDur}>50 mins</Text>
                </View>
                <View style={styles.periodDetails}>
                  <Text style={styles.periodClass}>Grade 8 - Section B</Text>
                  <Text style={styles.periodSub}>Advanced Algebra Fundamentals</Text>
                  <Text style={styles.periodRoom}>Room 208</Text>
                </View>
              </View>
            </AppCard>

            {/* Column 2: Quick Actions & Pending Leaves */}
            <View style={[styles.subCol, isDesktop && { flex: 1 }]}>
              {/* Quick Actions Grid */}
              <AppCard style={styles.quickCard}>
                <Text style={styles.cardSectionTitle}>Repeated Quick Actions</Text>
                <View style={styles.quickGrid}>
                  <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setActiveTab('attendance')}>
                    <View style={[styles.quickIconBg, { backgroundColor: Palette.blueTint }]}>
                      <Ionicons name="finger-print" size={20} color={Palette.actionBlue} />
                    </View>
                    <Text style={styles.quickText}>Mark Attendance</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setHwModalOpen(true)}>
                    <View style={[styles.quickIconBg, { backgroundColor: Palette.greenTint }]}>
                      <Ionicons name="add-circle" size={20} color={Palette.successGreen} />
                    </View>
                    <Text style={styles.quickText}>Add Homework</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setAnnModalOpen(true)}>
                    <View style={[styles.quickIconBg, { backgroundColor: Palette.orangeTint }]}>
                      <Ionicons name="megaphone" size={20} color={Palette.warningOrange} />
                    </View>
                    <Text style={styles.quickText}>Post Circular</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setActiveTab('leaves')}>
                    <View style={[styles.quickIconBg, { backgroundColor: Palette.navyTint }]}>
                      <Ionicons name="checkmark-done" size={20} color={Palette.primaryNavy} />
                    </View>
                    <Text style={styles.quickText}>Leave Review</Text>
                  </TouchableOpacity>
                </View>
              </AppCard>

              {/* Pending Leave Requests Alert */}
              {pendingLeaves.length > 0 && (
                <AppCard style={styles.alertCard}>
                  <View style={styles.alertHeader}>
                    <Ionicons name="notifications" size={20} color={Palette.warningOrange} />
                    <Text style={styles.alertTitle}>
                      {pendingLeaves.length} Student Leave Pending Review
                    </Text>
                  </View>
                  <Text style={styles.alertDesc}>
                    {pendingLeaves[0].studentName} requested absence for {pendingLeaves[0].startDate}.
                  </Text>
                  <AppButton
                    title="Review Applications"
                    size="sm"
                    variant="action"
                    onPress={() => setActiveTab('leaves')}
                  />
                </AppCard>
              )}
            </View>
          </View>
        )}

        {/* TAB 2: ATTENDANCE ROSTER */}
        {activeTab === 'attendance' && (
          <View style={styles.tabContentCol}>
            {/* Class Info & Summary */}
            <AppCard style={styles.attendanceHeaderCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.headerTextCol}>
                  <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">Grade 8 - Section A</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>Monday, October 18, 2026</Text>
                </View>
                <TouchableOpacity
                  style={styles.markAllBtn}
                  onPress={markAllPresent}>
                  <Ionicons name="checkmark-done-circle" size={16} color={Palette.actionBlue} />
                  <Text style={styles.markAllBtnText}>Mark All Present</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.attendanceCountersRow}>
                <View style={styles.counterBox}>
                  <Text style={[styles.counterVal, { color: Palette.successGreen }]}>
                    {presentCount}
                  </Text>
                  <Text style={styles.counterLabel}>Present</Text>
                </View>
                <View style={styles.counterBox}>
                  <Text style={[styles.counterVal, { color: Palette.errorRed }]}>
                    {absentCount}
                  </Text>
                  <Text style={styles.counterLabel}>Absent</Text>
                </View>
                <View style={styles.counterBox}>
                  <Text style={[styles.counterVal, { color: Palette.warningOrange }]}>
                    {leaveCount}
                  </Text>
                  <Text style={styles.counterLabel}>Leave</Text>
                </View>
              </View>
            </AppCard>

            {/* Student Roster List */}
            <AppCard style={styles.rosterCard}>
              <Text style={styles.rosterTitle}>Class Roster ({roster.length} Students)</Text>

              <View style={[styles.rosterGrid, isDesktop && styles.rosterGridDesktop]}>
                {roster.map((student) => (
                  <View
                    key={student.id}
                    style={[styles.rosterItem, isDesktop && styles.rosterItemDesktop]}>
                    <View style={styles.rosterLeft}>
                      <Text style={styles.rollNo}>#{student.rollNo}</Text>
                      <Image source={{ uri: student.avatar }} style={styles.rosterAvatar} />
                      <Text style={styles.rosterName} numberOfLines={1}>
                        {student.name}
                      </Text>
                    </View>

                    <View style={styles.rosterToggleGroup}>
                      {(['present', 'absent', 'leave'] as AttendanceStatus[]).map((st) => {
                        const isSelected = student.status === st;
                        return (
                          <TouchableOpacity
                            key={st}
                            onPress={() => updateStudentAttendance(student.id, st)}
                            style={[
                              styles.statusBtn,
                              st === 'present' && isSelected && styles.statusBtnPresent,
                              st === 'absent' && isSelected && styles.statusBtnAbsent,
                              st === 'leave' && isSelected && styles.statusBtnLeave,
                            ]}>
                            <Text
                              style={[
                                styles.statusBtnText,
                                isSelected && styles.statusBtnTextActive,
                              ]}>
                              {st === 'present' ? 'P' : st === 'absent' ? 'A' : 'L'}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>

              <AppButton
                title="Save & Submit Attendance"
                variant="primary"
                onPress={handleSaveAttendance}
                style={{ marginTop: 14 }}
              />
            </AppCard>
          </View>
        )}

        {/* TAB 3: HOMEWORK MANAGER */}
        {activeTab === 'homework' && (
          <View style={styles.tabContentCol}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.cardTitle}>Class Assignments</Text>
                <Text style={styles.cardSubtitle}>Active homework for Grade 8-A</Text>
              </View>
              <AppButton
                title="+ Assign Work"
                size="sm"
                variant="action"
                onPress={() => setHwModalOpen(true)}
              />
            </View>

            <AppCard style={styles.hwManagerCard}>
              <Text style={styles.hwManagerDesc}>
                Assignments published here are immediately delivered to both student task boards and parent notifications.
              </Text>
              <AppButton
                title="Create New Homework"
                variant="outline"
                icon={<Ionicons name="document-text-outline" size={18} color={Palette.primaryNavy} />}
                onPress={() => setHwModalOpen(true)}
              />
            </AppCard>
          </View>
        )}

        {/* TAB 4: LEAVE APPROVALS */}
        {activeTab === 'leaves' && (
          <View style={styles.tabContentCol}>
            <Text style={styles.cardTitle}>Leave Review Queue</Text>

            <View style={[styles.leavesGrid, isDesktop && styles.leavesGridDesktop]}>
              {leaveRequests.map((req) => {
                const isPending = req.status === 'pending';
                return (
                  <AppCard
                    key={req.id}
                    style={[styles.leaveAppCard, isDesktop && styles.leaveAppCardDesktop]}>
                    <View style={styles.leaveAppHeader}>
                      <View>
                        <Text style={styles.leaveStudentName}>{req.studentName}</Text>
                        <Text style={styles.leaveGradeSection}>
                          {req.grade} - {req.section}
                        </Text>
                      </View>
                      <StatusPill status={req.status} size="sm" />
                    </View>

                    <View style={styles.dateBlock}>
                      <Ionicons name="calendar-outline" size={14} color={Palette.actionBlue} />
                      <Text style={styles.dateBlockText}>
                        {req.startDate} {req.endDate !== req.startDate ? `to ${req.endDate}` : ''}
                      </Text>
                    </View>

                    <Text style={styles.leaveReasonText}>{req.reason}</Text>

                    {isPending ? (
                      <View style={styles.leaveAppActions}>
                        <AppButton
                          title="Reject"
                          variant="danger"
                          size="sm"
                          style={{ flex: 1 }}
                          onPress={() => updateLeaveRequestStatus(req.id, 'rejected')}
                        />
                        <AppButton
                          title="Approve"
                          variant="primary"
                          size="sm"
                          style={{ flex: 1 }}
                          onPress={() => updateLeaveRequestStatus(req.id, 'approved')}
                        />
                      </View>
                    ) : (
                      <Text style={styles.leaveProcessedText}>
                        Decision recorded: {req.status.toUpperCase()}
                      </Text>
                    )}
                  </AppCard>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* MODAL: ADD HOMEWORK */}
      <Modal visible={isHwModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Homework</Text>
              <TouchableOpacity onPress={() => setHwModalOpen(false)}>
                <Ionicons name="close" size={22} color={Palette.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              value={hwSubject}
              onChangeText={setHwSubject}
              placeholder="Subject (e.g. Mathematics)"
            />

            <Text style={styles.inputLabel}>Homework Title</Text>
            <TextInput
              style={styles.input}
              value={hwTitle}
              onChangeText={setHwTitle}
              placeholder="e.g. Algebra Exercise 4.3"
            />

            <Text style={styles.inputLabel}>Instructions / Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={hwDesc}
              onChangeText={setHwDesc}
              multiline
              numberOfLines={3}
              placeholder="Detailed instructions for students..."
            />

            <Text style={styles.inputLabel}>Due Date</Text>
            <TextInput
              style={styles.input}
              value={hwDueDate}
              onChangeText={setHwDueDate}
              placeholder="e.g. Friday, 08:30 AM"
            />

            <View style={styles.modalActions}>
              <AppButton
                title="Cancel"
                variant="outline"
                style={{ flex: 1 }}
                onPress={() => setHwModalOpen(false)}
              />
              <AppButton
                title="Publish Homework"
                variant="primary"
                style={{ flex: 1.5 }}
                onPress={handlePublishHomework}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: POST CIRCULAR */}
      <Modal visible={isAnnModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post School Circular</Text>
              <TouchableOpacity onPress={() => setAnnModalOpen(false)}>
                <Ionicons name="close" size={22} color={Palette.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              value={annTitle}
              onChangeText={setAnnTitle}
              placeholder="Circular heading..."
            />

            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.priorityPickerRow}>
              {(['normal', 'important', 'emergency'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setAnnPriority(p)}
                  style={[
                    styles.priorityPill,
                    annPriority === p && styles.priorityPillActive,
                  ]}>
                  <Text
                    style={[
                      styles.priorityPillText,
                      annPriority === p && styles.priorityPillTextActive,
                    ]}>
                    {p.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Message Content</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={annContent}
              onChangeText={setAnnContent}
              multiline
              numberOfLines={3}
              placeholder="Announcement text..."
            />

            <View style={styles.modalActions}>
              <AppButton
                title="Cancel"
                variant="outline"
                style={{ flex: 1 }}
                onPress={() => setAnnModalOpen(false)}
              />
              <AppButton
                title="Broadcast"
                variant="primary"
                style={{ flex: 1.5 }}
                onPress={handleBroadcastAnnouncement}
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
    backgroundColor: Palette.background,
  },
  topTabBar: {
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  topTabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  topTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: Radii.pill,
    gap: 4,
    minWidth: 0,
  },
  topTabActive: {
    backgroundColor: Palette.blueTint,
  },
  topTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  topTabTextActive: {
    color: Palette.actionBlue,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContentDesktop: {
    padding: 24,
  },
  tabContentCol: {
    gap: 16,
  },
  tabContentColDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  subCol: {
    gap: 16,
  },
  quickCard: {
    gap: 12,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickButton: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textDark,
    textAlign: 'center',
  },
  teachingCard: {
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    minWidth: 0,
  },
  headerTextCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textDark,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  teachingPeriodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Palette.background,
    borderRadius: Radii.md,
    gap: 12,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  periodTimeCol: {
    alignItems: 'center',
    gap: 2,
    minWidth: 65,
  },
  periodTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primaryNavy,
  },
  periodDur: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  periodDetails: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  periodClassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minWidth: 0,
  },
  periodClass: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textDark,
    flex: 1,
    minWidth: 0,
  },
  periodSub: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  periodRoom: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.actionBlue,
  },
  nowBadge: {
    backgroundColor: Palette.actionBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    flexShrink: 0,
  },
  nowBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  alertCard: {
    backgroundColor: '#FFF9F2',
    borderColor: '#FBD38D',
    gap: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.warningOrange,
  },
  alertDesc: {
    fontSize: 13,
    color: Palette.textDark,
  },
  attendanceHeaderCard: {
    gap: 14,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.blueTint,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.sm,
  },
  markAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  attendanceCountersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 10,
  },
  counterBox: {
    alignItems: 'center',
  },
  counterVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  counterLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  rosterCard: {
    gap: 12,
  },
  rosterTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  rosterGrid: {
    gap: 8,
  },
  rosterGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rosterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Palette.background,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  rosterItemDesktop: {
    width: '48.5%',
  },
  rosterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rollNo: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
    width: 28,
  },
  rosterAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.border,
  },
  rosterName: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textDark,
    flex: 1,
  },
  rosterToggleGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  statusBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  statusBtnPresent: {
    backgroundColor: Palette.successGreen,
    borderColor: Palette.successGreen,
  },
  statusBtnAbsent: {
    backgroundColor: Palette.errorRed,
    borderColor: Palette.errorRed,
  },
  statusBtnLeave: {
    backgroundColor: Palette.warningOrange,
    borderColor: Palette.warningOrange,
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  statusBtnTextActive: {
    color: '#FFFFFF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  hwManagerCard: {
    gap: 12,
    alignItems: 'center',
    paddingVertical: 24,
  },
  hwManagerDesc: {
    fontSize: 13,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  leavesGrid: {
    gap: 10,
  },
  leavesGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  leaveAppCard: {
    gap: 10,
  },
  leaveAppCardDesktop: {
    width: '48.5%',
  },
  leaveAppHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leaveStudentName: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
  },
  leaveGradeSection: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.blueTint,
    padding: 8,
    borderRadius: Radii.sm,
  },
  dateBlockText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.actionBlue,
  },
  leaveReasonText: {
    fontSize: 13,
    color: Palette.textDark,
    lineHeight: 18,
  },
  leaveAppActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  leaveProcessedText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontStyle: 'italic',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: Palette.surface,
    borderRadius: Radii.modal,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textDark,
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
    minHeight: 70,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  priorityPickerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  priorityPillActive: {
    backgroundColor: Palette.primaryNavy,
    borderColor: Palette.primaryNavy,
  },
  priorityPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  priorityPillTextActive: {
    color: '#FFFFFF',
  },
});