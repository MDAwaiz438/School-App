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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { Homework } from '@/types';
import { SupportDeskView } from '@/components/support/SupportDeskView';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { PopQuizModal } from '@/components/quiz/PopQuizModal';
import { AttendanceExcelExportView } from '@/components/admin/AttendanceExcelExportView';

type TeacherTab = 'command' | 'attendance' | 'gradebook' | 'assignments' | 'leaves' | 'support';

interface StudentGradeRecord {
  id: string;
  name: string;
  rollNumber: string;
  mathScore: number;
  scienceScore: number;
  englishScore: number;
}

const INITIAL_STUDENT_GRADES: StudentGradeRecord[] = [
  { id: 'std_01', name: 'Aarav Sharma', rollNumber: '01', mathScore: 94, scienceScore: 89, englishScore: 88 },
  { id: 'std_02', name: 'Chloe Chen', rollNumber: '02', mathScore: 88, scienceScore: 92, englishScore: 95 },
  { id: 'std_03', name: 'Ethan Wright', rollNumber: '03', mathScore: 81, scienceScore: 84, englishScore: 82 },
  { id: 'std_04', name: 'Fatima Al-Sayed', rollNumber: '04', mathScore: 97, scienceScore: 98, englishScore: 93 },
  { id: 'std_05', name: 'Grace Hopper', rollNumber: '05', mathScore: 92, scienceScore: 95, englishScore: 90 },
  { id: 'std_06', name: 'Kabir Mehta', rollNumber: '06', mathScore: 86, scienceScore: 80, englishScore: 85 },
];

export const TeacherView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const {
    roster,
    updateStudentAttendance,
    markAllPresent,
    leaveRequests,
    updateLeaveRequestStatus,
    submitLeaveRequest,
    homeworkList,
    addHomework,
    logout,
    showAlert,
    setIsChatModalVisible,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TeacherTab>('command');
  const [attendanceSubTab, setAttendanceSubTab] = useState<'rollcall' | 'export'>('rollcall');
  const [grades, setGrades] = useState<StudentGradeRecord[]>(INITIAL_STUDENT_GRADES);

  // Student Leave Management state (Requirement 3)
  const [isTeacherApplyLeaveOpen, setIsTeacherApplyLeaveOpen] = useState(false);
  const [leaveStudentId, setLeaveStudentId] = useState(roster[0]?.id || 'std_01');
  const [teacherLeaveStart, setTeacherLeaveStart] = useState('2026-10-24');
  const [teacherLeaveEnd, setTeacherLeaveEnd] = useState('2026-10-25');
  const [teacherLeaveReason, setTeacherLeaveReason] = useState('');
  const [teacherLeaveCategory, setTeacherLeaveCategory] = useState('Medical / Doctor Visit');
  const [leavesTabFilter, setLeavesTabFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Event & Quiz Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Assignment Modal
  const [isHwModalOpen, setHwModalOpen] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState('Mathematics');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDueDate, setHwDueDate] = useState('Tomorrow, 08:30 AM');
  const [viewingSubmissionsHw, setViewingSubmissionsHw] = useState<Homework | null>(null);

  // Edit Grade Modal
  const [editingStudent, setEditingStudent] = useState<StudentGradeRecord | null>(null);
  const [mathInput, setMathInput] = useState('');
  const [sciInput, setSciInput] = useState('');
  const [engInput, setEngInput] = useState('');

  const presentCount = roster.filter((r) => r.status === 'present').length;
  const absentCount = roster.filter((r) => r.status === 'absent').length;
  const leaveCount = roster.filter((r) => r.status === 'leave').length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');

  const filteredTeacherLeaves = leaveRequests.filter((l) => {
    if (leavesTabFilter === 'all') return true;
    return l.status === leavesTabFilter;
  });

  const handleTeacherApplyLeave = () => {
    const student = roster.find((s) => s.id === leaveStudentId) || roster[0];
    if (!teacherLeaveReason.trim()) {
      showAlert({
        title: 'Reason Required',
        message: 'Please provide the absence reason for the student.',
        type: 'warning',
      });
      return;
    }

    submitLeaveRequest({
      studentId: student.id,
      studentName: student.name,
      grade: 'Grade 8',
      section: 'A',
      startDate: teacherLeaveStart,
      endDate: teacherLeaveEnd,
      reason: `[${teacherLeaveCategory}] ${teacherLeaveReason.trim()} (Applied by Class Teacher)`,
      appliedBy: 'teacher',
      initialStatus: 'approved',
    });

    setIsTeacherApplyLeaveOpen(false);
    setTeacherLeaveReason('');
    showAlert({
      title: 'Student Leave Recorded',
      message: `Authorized leave for ${student.name} (${teacherLeaveStart} to ${teacherLeaveEnd}) successfully logged and approved.`,
      type: 'success',
      icon: 'checkmark-circle',
    });
  };

  const handleSaveAttendance = () => {
    showAlert({
      title: 'Attendance Verified',
      message: `Grade 8-A attendance finalized: ${presentCount} Present, ${absentCount} Absent, ${leaveCount} Authorized Leave.`,
      type: 'success',
      icon: 'checkmark-circle',
    });
  };

  const handleCreateAssignment = () => {
    if (!hwTitle.trim()) {
      showAlert({
        title: 'Required',
        message: 'Please enter an assignment title.',
        type: 'warning',
      });
      return;
    }
    addHomework({
      classId: 'c_8a',
      className: 'Grade 8-A',
      subject: hwSubject,
      title: hwTitle,
      description: hwDesc || 'Complete exercises and prepare questions for class review.',
      dueDate: hwDueDate,
      teacherName: 'Mrs. Sarah Jenkins',
    });
    setHwTitle('');
    setHwDesc('');
    setHwModalOpen(false);
    showAlert({
      title: 'Assignment Published',
      message: 'Task dispatched to Grade 8-A student & parent portals.',
      type: 'success',
      icon: 'checkmark-circle',
    });
  };

  const handleSaveGrade = () => {
    if (!editingStudent) return;
    const updated = grades.map((g) =>
      g.id === editingStudent.id
        ? {
            ...g,
            mathScore: Number(mathInput) || g.mathScore,
            scienceScore: Number(sciInput) || g.scienceScore,
            englishScore: Number(engInput) || g.englishScore,
          }
        : g
    );
    setGrades(updated);
    setEditingStudent(null);
    showAlert({
      title: 'Scorecard Updated',
      message: `Assessment scores saved for ${editingStudent.name}.`,
      type: 'success',
      icon: 'checkmark-circle',
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.appHeader}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <View style={styles.headerTag}>
              <View style={styles.liveIndicator} />
              <Text style={styles.headerTagText}>
                {activeTab === 'command'
                  ? 'FACULTY DESK'
                  : activeTab === 'attendance'
                  ? 'FACULTY DESK • ATTENDANCE'
                  : activeTab === 'gradebook'
                  ? 'FACULTY DESK • GRADEBOOK'
                  : activeTab === 'assignments'
                  ? 'FACULTY DESK • TASKS'
                  : 'FACULTY DESK • LEAVES'}
              </Text>
            </View>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {activeTab === 'command'
                ? 'Mrs. Sarah Jenkins'
                : activeTab === 'attendance'
                ? 'Attendance Desk'
                : activeTab === 'gradebook'
                ? 'Official Gradebook'
                : activeTab === 'assignments'
                ? 'Assignments & Tasks'
                : activeTab === 'leaves'
                ? 'Leave Approvals'
                : 'Helpdesk & Support'}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {activeTab === 'command'
                ? 'Class Lead • Grade 8-A • STEM & Maths'
                : activeTab === 'attendance'
                ? `Grade 8-A • ${presentCount}/${roster.length} Present Today`
                : activeTab === 'gradebook'
                ? 'Term 1 Mid-Term Assessments • 6 Enrolled'
                : activeTab === 'assignments'
                ? `${homeworkList.length} Active Tasks Published`
                : activeTab === 'leaves'
                ? `${pendingLeaves.length} Parent Absence Notes Pending`
                : 'Faculty Support Tickets & Institutional FAQs'}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.chatHeaderBtn}
              activeOpacity={0.8}
              onPress={() => setIsChatModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Open Faculty & Campus Chat">
              <Ionicons name="chatbubbles" size={18} color="#4F46E5" />
              <View style={styles.chatBadgeDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileBtn}
              activeOpacity={0.8}
              onPress={() => setIsProfileModalOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="View faculty profile and account settings">
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                }}
                style={styles.profileAvatarImg}
              />
              <View style={styles.statusOnlineDot} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 60 }]}
        showsVerticalScrollIndicator={false}>

        {/* TAB 1: COMMAND CENTER */}
        {activeTab === 'command' && (
          <View style={styles.tabSection}>
            {/* Class Summary KPI */}
            <View style={styles.kpiRow}>
              <View style={[styles.kpiBox, { borderLeftColor: '#4F46E5' }]}>
                <Text style={styles.kpiBoxNumber}>{roster.length}</Text>
                <Text style={styles.kpiBoxLabel}>Class Enrolled</Text>
              </View>
              <View style={[styles.kpiBox, { borderLeftColor: '#10B981' }]}>
                <Text style={styles.kpiBoxNumber}>{presentCount}</Text>
                <Text style={styles.kpiBoxLabel}>Present Today</Text>
              </View>
              <View style={[styles.kpiBox, { borderLeftColor: '#F59E0B' }]}>
                <Text style={styles.kpiBoxNumber}>{pendingLeaves.length}</Text>
                <Text style={styles.kpiBoxLabel}>Pending Leaves</Text>
              </View>
            </View>

            {/* CENTER SQUARE SECTION HUBS */}
            <View style={styles.centerSquareSection}>
              <View style={styles.squareHeaderRow}>
                <Text style={styles.squareHeaderTitle}>Core Portals</Text>
                <Text style={styles.squareHeaderSubtitle}>Direct Navigation</Text>
              </View>

              <View style={styles.squareGrid}>
                {/* Square 1: Attendance */}
                <TouchableOpacity
                  style={[styles.squareCard, styles.squareCardAttendance]}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab('attendance')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#ECFDF5' }]}>
                      <Ionicons name="checkbox" size={24} color="#059669" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#047857' }]}>
                        {presentCount}/{roster.length} Present
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Attendance</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Roll call check
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Square 2: Gradebook */}
                <TouchableOpacity
                  style={[styles.squareCard, styles.squareCardGradebook]}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab('gradebook')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#EEF2FF' }]}>
                      <Ionicons name="school" size={24} color="#4F46E5" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#E0E7FF' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#4338CA' }]}>
                        Mid-Term
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Gradebook</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Record grades
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Square 3: Assignments */}
                <TouchableOpacity
                  style={[styles.squareCard, styles.squareCardAssignments]}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab('assignments')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#FEF3C7' }]}>
                      <Ionicons name="document-text" size={24} color="#D97706" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#B45309' }]}>
                        {homeworkList.length} Active
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Assignments</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Homework & grading
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Square 4: Absence Requests */}
                <TouchableOpacity
                  style={[styles.squareCard, styles.squareCardLeaves]}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab('leaves')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#FDF2F8' }]}>
                      <Ionicons name="time" size={24} color="#DB2777" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#FCE7F3' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#BE185D' }]}>
                        {pendingLeaves.length} Pending
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Leave Requests</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Absence approvals
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* LIVE ASSIGNMENT TURN-IN QUEUE WIDGET */}
            <View style={styles.dashboardAssignmentQueue}>
              <View style={styles.assignmentQueueTop}>
                <View style={styles.assignmentQueueIconBox}>
                  <Ionicons name="document-text" size={20} color="#4F46E5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.assignmentQueueTitle}>Today’s Assignment Turn-in Queue</Text>
                  <Text style={styles.assignmentQueueSub}>Grade 8-A • 28 of 32 Submissions Received</Text>
                </View>
                <View style={styles.assignmentRateChip}>
                  <Text style={styles.assignmentRateChipText}>87.5%</Text>
                </View>
              </View>

              <View style={styles.queueProgressBarBg}>
                <View style={[styles.queueProgressBarFill, { width: '87.5%' }]} />
              </View>

              <View style={styles.queueActionsRow}>
                <TouchableOpacity
                  style={styles.queueActionPrimary}
                  activeOpacity={0.85}
                  onPress={() => setActiveTab('assignments')}>
                  <Ionicons name="eye-outline" size={14} color="#FFFFFF" />
                  <Text style={styles.queueActionPrimaryText}>Review Submissions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.queueActionSecondary}
                  activeOpacity={0.85}
                  onPress={() => setHwModalOpen(true)}>
                  <Ionicons name="add" size={14} color="#4F46E5" />
                  <Text style={styles.queueActionSecondaryText}>New Task</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* FACULTY SHORTCUT ACTIONS */}
            <View style={styles.quickOpsRow}>
              <TouchableOpacity
                style={styles.quickOpQuizBtn}
                activeOpacity={0.85}
                onPress={() => setIsQuizModalOpen(true)}>
                <View style={styles.quickOpQuizIcon}>
                  <Ionicons name="flash" size={18} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickOpQuizTitle}>AI Pop Quiz Studio</Text>
                  <Text style={styles.quickOpQuizSub}>Launch interactive classroom quiz</Text>
                </View>
                <Ionicons name="play-circle" size={20} color="#D97706" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickOpEventBtn}
                activeOpacity={0.85}
                onPress={() => setIsEventModalOpen(true)}>
                <View style={styles.quickOpEventIcon}>
                  <Ionicons name="calendar" size={18} color="#4F46E5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickOpEventTitle}>Create School Event</Text>
                  <Text style={styles.quickOpEventSub}>Publish to students & parents</Text>
                </View>
                <Ionicons name="add-circle" size={20} color="#4F46E5" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <View style={styles.tabSection}>
            <View style={styles.attendanceSubNavRow}>
              <TouchableOpacity
                style={[
                  styles.attendanceSubNavBtn,
                  attendanceSubTab === 'rollcall' && styles.attendanceSubNavBtnActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setAttendanceSubTab('rollcall')}>
                <Ionicons
                  name="checkbox"
                  size={15}
                  color={attendanceSubTab === 'rollcall' ? '#FFFFFF' : '#4F46E5'}
                />
                <Text
                  style={[
                    styles.attendanceSubNavText,
                    attendanceSubTab === 'rollcall' && styles.attendanceSubNavTextActive,
                  ]}>
                  Roll Call (Grade 8-A)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.attendanceSubNavBtn,
                  attendanceSubTab === 'export' && styles.attendanceSubNavBtnActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setAttendanceSubTab('export')}>
                <Ionicons
                  name="cloud-download"
                  size={15}
                  color={attendanceSubTab === 'export' ? '#FFFFFF' : '#4F46E5'}
                />
                <Text
                  style={[
                    styles.attendanceSubNavText,
                    attendanceSubTab === 'export' && styles.attendanceSubNavTextActive,
                  ]}>
                  Download Excel & Filters
                </Text>
              </TouchableOpacity>
            </View>

            {attendanceSubTab === 'export' ? (
              <AttendanceExcelExportView />
            ) : (
              <>
                <View style={styles.attendanceHeaderRow}>
                  <View>
                    <Text style={styles.sectionTitle}>Grade 8-A Roll Call</Text>
                    <Text style={styles.sectionSubtitle}>
                      {presentCount} Present • {absentCount} Absent • {leaveCount} On Leave
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.markAllButton}
                    activeOpacity={0.8}
                    onPress={markAllPresent}>
                    <Ionicons name="checkmark-done" size={14} color="#10B981" />
                    <Text style={styles.markAllButtonText}>Mark All Present</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.rosterCardList}>
                  {roster.map((student) => (
                    <View key={student.id} style={styles.rosterCardItem}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.rosterCardHeaderRow}>
                          <View style={styles.studentMetaCol}>
                            <Text style={styles.studentRollText}>Roll #{student.rollNo}</Text>
                            <Text style={styles.studentNameText}>{student.name}</Text>
                          </View>

                          {/* ATTENDANCE PERCENTAGE BADGE (Requirement 4) */}
                          <View style={styles.attendancePercentBadge}>
                            <Text style={styles.attendancePercentText}>
                              {student.attendancePercentage ?? 94.2}%
                            </Text>
                            <Text style={styles.attendancePercentSub}>Attendance</Text>
                          </View>
                        </View>

                        {/* STATS METRIC ROW: Present, Absent, Approved Leave (Requirement 4 & 3) */}
                        <View style={styles.studentMetricsRow}>
                          <View style={[styles.miniMetricTag, styles.miniMetricPresent]}>
                            <Ionicons name="checkmark-circle" size={11} color="#059669" />
                            <Text style={styles.miniMetricPresentText}>
                              Present: {student.presentDays ?? 42}d
                            </Text>
                          </View>

                          <View style={[styles.miniMetricTag, styles.miniMetricAbsent]}>
                            <Ionicons name="close-circle" size={11} color="#DC2626" />
                            <Text style={styles.miniMetricAbsentText}>
                              Absent: {student.absentDays ?? 1}d
                            </Text>
                          </View>

                          <View style={[styles.miniMetricTag, styles.miniMetricLeave]}>
                            <Ionicons name="calendar" size={11} color="#D97706" />
                            <Text style={styles.miniMetricLeaveText}>
                              Approved Leave: {student.leaveDays ?? 2}d
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.togglePillGroup}>
                        <TouchableOpacity
                          style={[
                            styles.statusPillBtn,
                            student.status === 'present' && styles.statusPillPresent,
                          ]}
                          onPress={() => updateStudentAttendance(student.id, 'present')}>
                          <Text
                            style={[
                              styles.statusPillBtnText,
                              student.status === 'present' && styles.statusPillBtnTextActive,
                            ]}>
                            P
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.statusPillBtn,
                            student.status === 'absent' && styles.statusPillAbsent,
                          ]}
                          onPress={() => updateStudentAttendance(student.id, 'absent')}>
                          <Text
                            style={[
                              styles.statusPillBtnText,
                              student.status === 'absent' && styles.statusPillBtnTextActive,
                            ]}>
                            A
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.statusPillBtn,
                            student.status === 'leave' && styles.statusPillLeave,
                          ]}
                          onPress={() => updateStudentAttendance(student.id, 'leave')}>
                          <Text
                            style={[
                              styles.statusPillBtnText,
                              student.status === 'leave' && styles.statusPillBtnTextActive,
                            ]}>
                            L
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.saveAttendanceBtn}
                  activeOpacity={0.85}
                  onPress={handleSaveAttendance}>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.saveAttendanceBtnText}>Finalize & Submit Roll Call</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* TAB 3: GRADEBOOK */}
        {activeTab === 'gradebook' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Mid-Term Academic Gradebook</Text>
                <Text style={styles.sectionSubtitle}>Grade 8-A Scores (Scale 0 – 100)</Text>
              </View>
            </View>

            <View style={styles.gradesListCard}>
              {grades.map((st) => (
                <View key={st.id} style={styles.gradeItemRow}>
                  <View style={styles.gradeStudentMeta}>
                    <Text style={styles.gradeStudentName}>{st.name}</Text>
                    <Text style={styles.gradeStudentRoll}>Roll #{st.rollNumber}</Text>
                  </View>

                  <View style={styles.scoresCluster}>
                    <View style={styles.scoreTag}>
                      <Text style={styles.scoreTagSubject}>Math</Text>
                      <Text style={styles.scoreTagNumber}>{st.mathScore}</Text>
                    </View>
                    <View style={styles.scoreTag}>
                      <Text style={styles.scoreTagSubject}>Sci</Text>
                      <Text style={styles.scoreTagNumber}>{st.scienceScore}</Text>
                    </View>
                    <View style={styles.scoreTag}>
                      <Text style={styles.scoreTagSubject}>Eng</Text>
                      <Text style={styles.scoreTagNumber}>{st.englishScore}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.editGradeIconBtn}
                    activeOpacity={0.7}
                    onPress={() => {
                      setEditingStudent(st);
                      setMathInput(String(st.mathScore));
                      setSciInput(String(st.scienceScore));
                      setEngInput(String(st.englishScore));
                    }}>
                    <Ionicons name="pencil" size={14} color="#4F46E5" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 4: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <View style={styles.tabSection}>
            <View style={styles.attendanceHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Classroom Assignments</Text>
                <Text style={styles.sectionSubtitle}>Grade 8-A Active Tasks</Text>
              </View>
              <TouchableOpacity
                style={styles.newHwBtn}
                activeOpacity={0.85}
                onPress={() => setHwModalOpen(true)}>
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.newHwBtnText}>New Task</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.assignmentsStack}>
              {homeworkList.map((hw) => (
                <View key={hw.id} style={styles.assignmentCard}>
                  <View style={styles.assignmentCardTop}>
                    <View style={styles.subjectPill}>
                      <Text style={styles.subjectPillText}>{hw.subject}</Text>
                    </View>
                    <Text style={styles.dueDateText}>Due: {hw.dueDate}</Text>
                  </View>

                  <Text style={styles.assignmentTitle}>{hw.title}</Text>
                  <Text style={styles.assignmentDesc}>{hw.description}</Text>

                  <View style={styles.assignmentCardFooter}>
                    <Text style={styles.assignedByText}>{hw.teacherName}</Text>
                    <View
                      style={[
                        styles.hwBadge,
                        hw.status === 'completed' ? styles.hwBadgeDone : styles.hwBadgePending,
                      ]}>
                      <Text style={styles.hwBadgeText}>{hw.status.toUpperCase()}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.reviewSubmissionsBtn}
                    activeOpacity={0.8}
                    onPress={() => setViewingSubmissionsHw(hw)}>
                    <Ionicons name="list-outline" size={15} color="#4F46E5" />
                    <Text style={styles.reviewSubmissionsBtnText}>View Student Submissions (28/32)</Text>
                    <Ionicons name="chevron-forward" size={14} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 5: LEAVES */}
        {activeTab === 'leaves' && (
          <View style={styles.tabSection}>
            <View style={styles.leaveHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Student Leave Management</Text>
                <Text style={styles.sectionSubtitle}>
                  Grade 8-A • Apply on student behalf & authorize guardian absence notes
                </Text>
              </View>

              <TouchableOpacity
                style={styles.applyOnBehalfBtn}
                activeOpacity={0.85}
                onPress={() => setIsTeacherApplyLeaveOpen(true)}>
                <Ionicons name="person-add" size={15} color="#FFFFFF" />
                <Text style={styles.applyOnBehalfBtnText}>Apply on Behalf</Text>
              </TouchableOpacity>
            </View>

            {/* APPROVED LEAVE SEPARATE FROM ATTENDANCE NOTICE (Requirement 3) */}
            <View style={styles.excusedLeaveCallout}>
              <View style={styles.excusedIconBox}>
                <Ionicons name="information-circle" size={20} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.excusedTitle}>Approved Leaves Separate From Attendance</Text>
                <Text style={styles.excusedDesc}>
                  Approved student leaves are formally tracked as excused absences under official school policy. They are displayed distinctly in the attendance roster and do not lower term examination eligibility.
                </Text>
              </View>
            </View>

            {/* FILTER PILLS */}
            <View style={styles.leavesFilterRow}>
              {(['all', 'pending', 'approved', 'rejected'] as const).map((flt) => {
                const isActive = leavesTabFilter === flt;
                const count =
                  flt === 'all'
                    ? leaveRequests.length
                    : leaveRequests.filter((l) => l.status === flt).length;
                const label =
                  flt === 'all'
                    ? 'All Requests'
                    : flt === 'pending'
                    ? 'Pending Approvals'
                    : flt === 'approved'
                    ? 'Approved History'
                    : 'Declined';

                return (
                  <TouchableOpacity
                    key={flt}
                    style={[styles.leaveFilterPill, isActive && styles.leaveFilterPillActive]}
                    onPress={() => setLeavesTabFilter(flt)}
                    activeOpacity={0.75}>
                    <Text
                      style={[
                        styles.leaveFilterPillText,
                        isActive && styles.leaveFilterPillTextActive,
                      ]}>
                      {label} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.leavesStack}>
              {filteredTeacherLeaves.length === 0 ? (
                <View style={styles.emptyLeavesCard}>
                  <Ionicons name="calendar-outline" size={38} color="#94A3B8" />
                  <Text style={styles.emptyLeavesTitle}>No leave applications in this view</Text>
                  <Text style={styles.emptyLeavesSub}>
                    Applications submitted by parents or applied by teachers will appear here.
                  </Text>
                </View>
              ) : (
                filteredTeacherLeaves.map((leave) => {
                  const isApproved = leave.status === 'approved';
                  const isPending = leave.status === 'pending';

                  return (
                    <View key={leave.id} style={styles.leaveItemCard}>
                      <View style={styles.leaveItemTop}>
                        <View>
                          <View style={styles.studentNameTagRow}>
                            <Text style={styles.leaveStudent}>{leave.studentName}</Text>
                            <View style={styles.gradePill}>
                              <Text style={styles.gradePillText}>{leave.grade}-{leave.section}</Text>
                            </View>
                          </View>
                          <Text style={styles.leaveDuration}>
                            📅 {leave.startDate} to {leave.endDate}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.leaveBadge,
                            isApproved
                              ? styles.leaveBadgeApproved
                              : leave.status === 'rejected'
                              ? styles.leaveBadgeRejected
                              : styles.leaveBadgePending,
                          ]}>
                          <Text style={styles.leaveBadgeText}>{leave.status.toUpperCase()}</Text>
                        </View>
                      </View>

                      <Text style={styles.leaveReason}>{`"${leave.reason}"`}</Text>

                      <View style={styles.leaveItemFooter}>
                        <Text style={styles.leaveMetaNote}>
                          Applied: {leave.appliedAt} {leave.approvedBy ? `• Approved by ${leave.approvedBy}` : ''}
                        </Text>

                        {isPending && (
                          <View style={styles.leaveDecisionRow}>
                            <TouchableOpacity
                              style={styles.btnApprove}
                              activeOpacity={0.8}
                              onPress={() => updateLeaveRequestStatus(leave.id, 'approved')}>
                              <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                              <Text style={styles.btnApproveText}>Authorize</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.btnReject}
                              activeOpacity={0.8}
                              onPress={() => updateLeaveRequestStatus(leave.id, 'rejected')}>
                              <Ionicons name="close" size={15} color="#EF4444" />
                              <Text style={styles.btnRejectText}>Decline</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}

        {/* TAB 6: SUPPORT */}
        {activeTab === 'support' && (
          <View style={styles.tabSection}>
            <SupportDeskView roleMode="teacher" />
          </View>
        )}

        {/* FOOTER SECTION WITH SAFE AREA */}
        <View style={styles.pageFooter}>
          <View style={styles.footerBrandRow}>
            <Ionicons name="school-outline" size={16} color="#475569" />
            <Text style={styles.footerBrandText}>Oakridge International Academy</Text>
          </View>
          <Text style={styles.footerSubText}>
            Academic Year 2026-27 • Faculty Portal • Version 2.4.0
          </Text>
          <View style={styles.footerStatusRow}>
            <View style={styles.footerStatusDot} />
            <Text style={styles.footerStatusText}>Connected Securely (TLS 1.3)</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modern Bottom Navigation Bar (Matching Demo 4 Parent Portal) */}
      <View style={[styles.bottomBar, isDesktop && styles.bottomBarDesktop]}>
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('command')}>
          <Ionicons
            name={activeTab === 'command' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'command' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'command' && styles.navLabelActive]}>
            Desk
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('attendance')}>
          <Ionicons
            name={activeTab === 'attendance' ? 'checkbox' : 'checkbox-outline'}
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
          onPress={() => setActiveTab('gradebook')}>
          <Ionicons
            name={activeTab === 'gradebook' ? 'clipboard' : 'clipboard-outline'}
            size={22}
            color={activeTab === 'gradebook' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'gradebook' && styles.navLabelActive]}>
            Gradebook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('assignments')}>
          <Ionicons
            name={activeTab === 'assignments' ? 'book' : 'book-outline'}
            size={22}
            color={activeTab === 'assignments' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'assignments' && styles.navLabelActive]}>
            Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('leaves')}>
          <Ionicons
            name={activeTab === 'leaves' ? 'calendar' : 'calendar-outline'}
            size={22}
            color={activeTab === 'leaves' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'leaves' && styles.navLabelActive]}>
            Leaves
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('support')}>
          <Ionicons
            name={activeTab === 'support' ? 'headset' : 'headset-outline'}
            size={22}
            color={activeTab === 'support' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'support' && styles.navLabelActive]}>
            Support
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL: ASSIGN HOMEWORK */}
      <Modal
        visible={isHwModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setHwModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publish Assignment</Text>
              <TouchableOpacity onPress={() => setHwModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Subject</Text>
                <TextInput
                  style={styles.formInput}
                  value={hwSubject}
                  onChangeText={setHwSubject}
                  placeholder="e.g. Mathematics"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Assignment Title *</Text>
                <TextInput
                  style={styles.formInput}
                  value={hwTitle}
                  onChangeText={setHwTitle}
                  placeholder="e.g. Quadratic Equations Practice"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Instructions</Text>
                <TextInput
                  style={[styles.formInput, { height: 75, textAlignVertical: 'top' }]}
                  value={hwDesc}
                  onChangeText={setHwDesc}
                  placeholder="Details, exercise numbers, submission guidelines…"
                  multiline
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Submission Deadline</Text>
                <TextInput
                  style={styles.formInput}
                  value={hwDueDate}
                  onChangeText={setHwDueDate}
                  placeholder="e.g. Tomorrow, 08:30 AM"
                />
              </View>

              <TouchableOpacity
                style={styles.publishBtn}
                activeOpacity={0.85}
                onPress={handleCreateAssignment}>
                <Text style={styles.publishBtnText}>Publish to Grade 8-A</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL: EDIT GRADES */}
      <Modal
        visible={!!editingStudent}
        animationType="fade"
        transparent
        onRequestClose={() => setEditingStudent(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardSmall}>
            <Text style={styles.modalTitle}>Scores: {editingStudent?.name}</Text>
            <Text style={styles.modalSubtitle}>Grade 8-A Mid-Term Assessment</Text>

            <View style={styles.scoreInputRow}>
              <Text style={styles.scoreInputLabel}>Mathematics</Text>
              <TextInput
                style={styles.scoreTextInput}
                value={mathInput}
                onChangeText={setMathInput}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.scoreInputRow}>
              <Text style={styles.scoreInputLabel}>Science</Text>
              <TextInput
                style={styles.scoreTextInput}
                value={sciInput}
                onChangeText={setSciInput}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.scoreInputRow}>
              <Text style={styles.scoreInputLabel}>English</Text>
              <TextInput
                style={styles.scoreTextInput}
                value={engInput}
                onChangeText={setEngInput}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setEditingStudent(null)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSave}
                onPress={handleSaveGrade}>
                <Text style={styles.btnSaveText}>Save Scores</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: VIEW STUDENT SUBMISSIONS */}
      <Modal
        visible={Boolean(viewingSubmissionsHw)}
        animationType="slide"
        transparent
        onRequestClose={() => setViewingSubmissionsHw(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardLarge}>
            <View style={styles.submissionsModalHeader}>
              <View>
                <Text style={styles.modalSubjectTag}>{viewingSubmissionsHw?.subject}</Text>
                <Text style={styles.submissionsModalTitle} numberOfLines={1}>
                  Submissions: {viewingSubmissionsHw?.title}
                </Text>
                <Text style={styles.submissionsModalSub}>
                  Grade 8-A • Deadline: {viewingSubmissionsHw?.dueDate}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setViewingSubmissionsHw(null)}
                style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Submission Rate Meter */}
            <View style={styles.submissionProgressBanner}>
              <View style={styles.progressTopRow}>
                <Text style={styles.progressRateLabel}>Class Turn-in Progress</Text>
                <Text style={styles.progressRateVal}>28 / 32 Submitted (87.5%)</Text>
              </View>
              <View style={styles.submissionProgressBarBg}>
                <View style={[styles.submissionProgressBarFill, { width: '87.5%' }]} />
              </View>
            </View>

            <ScrollView style={styles.submissionsModalBody} showsVerticalScrollIndicator={false}>
              {roster.map((student, idx) => {
                const isSubmitted = idx !== 2 && idx !== 5;
                return (
                  <View key={student.id} style={styles.studentSubmissionRow}>
                    <View style={styles.studentInfoCol}>
                      <Text style={styles.studentRosterName}>{student.name}</Text>
                      <Text style={styles.studentRosterRoll}>Roll #{student.rollNo}</Text>
                    </View>

                    <View style={styles.submissionActionCol}>
                      {isSubmitted ? (
                        <TouchableOpacity
                          style={styles.submittedPill}
                          activeOpacity={0.7}
                          onPress={() =>
                            showAlert({
                              title: `Submission: ${student.name}`,
                              message: `Status: Turned in online\nDocument: Solution_Worksheet.pdf\nEvaluation: Grade A (Verified)\nTurned in on: Today, 08:15 AM`,
                              type: 'success',
                              icon: 'document-attach',
                            })
                          }>
                          <Ionicons name="checkmark-circle" size={14} color="#059669" />
                          <Text style={styles.submittedPillText}>Turned In • Grade A</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.pendingPill}>
                          <Ionicons name="time" size={14} color="#D97706" />
                          <Text style={styles.pendingPillText}>Pending</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.fullCloseBtn}
                onPress={() => setViewingSubmissionsHw(null)}>
                <Text style={styles.fullCloseBtnText}>Close Submissions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FACULTY PROFILE & ACCOUNT MODAL */}
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
                <Text style={styles.profileModalTag}>FACULTY CREDENTIALS</Text>
                <Text style={styles.profileModalTitle}>Teacher Profile</Text>
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
                      uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                    }}
                    style={styles.profileLargeAvatar}
                  />
                  <View style={styles.profileLargeStatusDot} />
                </View>

                <Text style={styles.profileHeroName}>Mrs. Sarah Jenkins</Text>
                <Text style={styles.profileHeroSub}>
                  Class Lead • Grade 8-A • Faculty ID: FAC-8921
                </Text>
                <View style={styles.profileHeroBadge}>
                  <Text style={styles.profileHeroBadgeText}>Verified Senior Faculty</Text>
                </View>
              </View>

              {/* Faculty Details Grid */}
              <View style={styles.profileDetailsGrid}>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Department</Text>
                  <Text style={styles.profileDetailVal}>Science & Maths</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Assigned Class</Text>
                  <Text style={styles.profileDetailVal}>Grade 8-A</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Students</Text>
                  <Text style={styles.profileDetailVal}>32 Enrolled</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Office</Text>
                  <Text style={styles.profileDetailVal} numberOfLines={1}>Room 204 Main</Text>
                </View>
              </View>

              {/* Quick Navigation */}
              <View style={styles.profileMenuSection}>
                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsProfileModalOpen(false);
                    setActiveTab('attendance');
                  }}>
                  <View style={[styles.profileMenuIconBox, { backgroundColor: '#EEF2FF' }]}>
                    <Ionicons name="checkbox-outline" size={18} color="#4F46E5" />
                  </View>
                  <View style={styles.profileMenuTextCol}>
                    <Text style={styles.profileMenuTitle}>Class Attendance Desk</Text>
                    <Text style={styles.profileMenuSub}>Daily check-ins & roll call verification</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsProfileModalOpen(false);
                    setActiveTab('assignments');
                  }}>
                  <View style={[styles.profileMenuIconBox, { backgroundColor: '#F0FDF4' }]}>
                    <Ionicons name="document-text-outline" size={18} color="#059669" />
                  </View>
                  <View style={styles.profileMenuTextCol}>
                    <Text style={styles.profileMenuTitle}>Assignments & Submissions</Text>
                    <Text style={styles.profileMenuSub}>Review homework & publish tasks</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsProfileModalOpen(false);
                    setActiveTab('gradebook');
                  }}>
                  <View style={[styles.profileMenuIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="ribbon-outline" size={18} color="#D97706" />
                  </View>
                  <View style={styles.profileMenuTextCol}>
                    <Text style={styles.profileMenuTitle}>Official Gradebook</Text>
                    <Text style={styles.profileMenuSub}>Subject score sheets & marks entry</Text>
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
                <Text style={styles.profileSignOutText}>Sign Out of Faculty Portal</Text>
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

      {/* POP QUIZ AI MODAL */}
      <PopQuizModal
        visible={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      {/* MODAL: TEACHER APPLY LEAVE ON BEHALF (Requirement 3) */}
      <Modal
        visible={isTeacherApplyLeaveOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsTeacherApplyLeaveOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Apply Leave on Student’s Behalf</Text>
                <Text style={styles.modalSubHeader}>Select student from Grade 8-A and record excused leave</Text>
              </View>
              <TouchableOpacity onPress={() => setIsTeacherApplyLeaveOpen(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* SELECT STUDENT */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Select Student *</Text>
                <View style={styles.studentChipsGrid}>
                  {roster.map((s) => {
                    const isSelected = leaveStudentId === s.id;
                    return (
                      <TouchableOpacity
                        key={s.id}
                        style={[styles.studentChip, isSelected && styles.studentChipActive]}
                        onPress={() => setLeaveStudentId(s.id)}>
                        <Text style={[styles.studentChipText, isSelected && styles.studentChipTextActive]}>
                          #{s.rollNo} {s.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* LEAVE CATEGORY */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Absence Category</Text>
                <View style={styles.categoryPillsRow}>
                  {['Medical / Doctor Visit', 'Family Function', 'Interschool Competition', 'Emergency'].map((cat) => {
                    const isSelected = teacherLeaveCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                        onPress={() => setTeacherLeaveCategory(cat)}>
                        <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* DATES */}
              <View style={styles.formRowTwo}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Start Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={teacherLeaveStart}
                    onChangeText={setTeacherLeaveStart}
                    placeholder="2026-10-24"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>End Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={teacherLeaveEnd}
                    onChangeText={setTeacherLeaveEnd}
                    placeholder="2026-10-25"
                  />
                </View>
              </View>

              {/* REASON */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Reason / Guardian Phone Communication Note *</Text>
                <TextInput
                  style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
                  value={teacherLeaveReason}
                  onChangeText={setTeacherLeaveReason}
                  placeholder="e.g. Parent informed of fever; prescription forwarded..."
                  multiline
                />
              </View>

              <TouchableOpacity
                style={styles.publishBtn}
                activeOpacity={0.85}
                onPress={handleTeacherApplyLeave}>
                <Ionicons name="checkmark-done" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.publishBtnText}>Authorize & Record Student Leave</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  appHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: Platform.OS === 'ios' ? 48 : 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F46E5',
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
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  backNavBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  centerSquareSection: {
    marginBottom: 16,
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
  squareCardAttendance: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#059669',
  },
  squareCardGradebook: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#4F46E5',
  },
  squareCardAssignments: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#D97706',
  },
  squareCardLeaves: {
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
  switchRolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  switchRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
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
  quickOpsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  quickOpQuizBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  quickOpQuizIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickOpQuizTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  quickOpQuizSub: {
    fontSize: 10,
    color: '#B45309',
    marginTop: 1,
  },
  quickOpEventBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  quickOpEventIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickOpEventTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3730A3',
  },
  quickOpEventSub: {
    fontSize: 10,
    color: '#4338CA',
    marginTop: 1,
  },
  attendanceSubNavRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  attendanceSubNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  attendanceSubNavBtnActive: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  attendanceSubNavText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  attendanceSubNavTextActive: {
    color: '#FFFFFF',
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
    borderRadius: 999,
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

  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10,
    paddingRight: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabButtonActive: {
    backgroundColor: '#4F46E5',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  pageFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 6,
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerBrandText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  footerSubText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
  footerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 4,
  },
  footerStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  footerStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  tabSection: {
    gap: 16,
  },

  // KPI
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  kpiBoxNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  kpiBoxLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  // ATTENDANCE
  attendanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  markAllButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
  },
  rosterCardList: {
    gap: 8,
  },
  rosterCardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  studentMetaCol: {
    flex: 1,
  },
  studentRollText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  studentNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  togglePillGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  statusPillBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  statusPillPresent: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  statusPillAbsent: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  statusPillLeave: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  statusPillBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  statusPillBtnTextActive: {
    color: '#FFFFFF',
  },
  saveAttendanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
  },
  saveAttendanceBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // GRADEBOOK
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradesListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  gradeItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  gradeStudentMeta: {
    flex: 1,
  },
  gradeStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  gradeStudentRoll: {
    fontSize: 10,
    color: '#64748B',
  },
  scoresCluster: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 10,
  },
  scoreTag: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignItems: 'center',
  },
  scoreTagSubject: {
    fontSize: 8,
    color: '#64748B',
    fontWeight: '600',
  },
  scoreTagNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  editGradeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ASSIGNMENTS
  newHwBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newHwBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  assignmentsStack: {
    gap: 10,
  },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  assignmentCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subjectPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
  },
  dueDateText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '700',
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  assignmentDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  assignmentCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  assignedByText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  hwBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hwBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  hwBadgeDone: {
    backgroundColor: '#DCFCE7',
  },
  hwBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },

  // LEAVES
  leavesStack: {
    gap: 10,
  },
  leaveItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leaveItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leaveStudent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  leaveDuration: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  leaveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  leaveBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  leaveBadgeApproved: {
    backgroundColor: '#DCFCE7',
  },
  leaveBadgeRejected: {
    backgroundColor: '#FEE2E2',
  },
  leaveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#334155',
  },
  leaveReason: {
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
    marginVertical: 10,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  leaveDecisionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  btnApprove: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 8,
  },
  btnApproveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnReject: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingVertical: 8,
  },
  btnRejectText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },

  // MODALS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalCardSmall: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  formGroup: {
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  formInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  publishBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  publishBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scoreInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreInputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  scoreTextInput: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    width: 60,
    height: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  btnCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  btnSave: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  btnSaveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // SUBMISSIONS REVIEW STYLES
  reviewSubmissionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  reviewSubmissionsBtnText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  submissionsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalSubjectTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  modalCardLarge: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
  },
  submissionsModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
    maxWidth: 260,
  },
  submissionsModalSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  submissionProgressBanner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 12,
    gap: 6,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressRateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  progressRateVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  submissionProgressBarBg: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  submissionProgressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  submissionsModalBody: {
    maxHeight: 300,
    paddingVertical: 6,
  },
  studentSubmissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  studentInfoCol: {
    flex: 1,
  },
  studentRosterName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentRosterRoll: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  submissionActionCol: {
    alignItems: 'flex-end',
  },
  submittedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  submittedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pendingPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  fullCloseBtn: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  fullCloseBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  dashboardAssignmentQueue: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 14,
    gap: 12,
  },
  assignmentQueueTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assignmentQueueIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignmentQueueTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  assignmentQueueSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  assignmentRateChip: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  assignmentRateChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  queueProgressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  queueProgressBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 3,
  },
  queueActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  queueActionPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingVertical: 9,
    borderRadius: 10,
  },
  queueActionPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  queueActionSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingVertical: 9,
    borderRadius: 10,
  },
  queueActionSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  rosterCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  attendancePercentBadge: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
  },
  attendancePercentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  attendancePercentSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6366F1',
    textTransform: 'uppercase',
  },
  studentMetricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  miniMetricTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniMetricPresent: {
    backgroundColor: '#ECFDF5',
  },
  miniMetricAbsent: {
    backgroundColor: '#FEF2F2',
  },
  miniMetricLeave: {
    backgroundColor: '#FFFBEB',
  },
  miniMetricPresentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  miniMetricAbsentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  miniMetricLeaveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  leaveHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  applyOnBehalfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  applyOnBehalfBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  excusedLeaveCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  excusedIconBox: {
    marginTop: 1,
  },
  excusedTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 2,
  },
  excusedDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: '#0C4A6E',
  },
  leavesFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  leaveFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leaveFilterPillActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  leaveFilterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  leaveFilterPillTextActive: {
    color: '#FFFFFF',
  },
  emptyLeavesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyLeavesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  emptyLeavesSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 280,
  },
  studentNameTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gradePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  leaveItemFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  leaveMetaNote: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  studentChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  studentChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  studentChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  studentChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  studentChipTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  categoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  categoryPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formRowTwo: {
    flexDirection: 'row',
    gap: 10,
  },
  modalSubHeader: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});