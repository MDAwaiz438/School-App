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
import { AppCard } from '@/components/common/AppCard';
import { Palette, Radii, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { MOCK_ACHIEVEMENTS, MOCK_REPORT_CARD, MOCK_TIMETABLE } from '@/data/mockData';
import { Homework } from '@/types';
import { StudentLeaveView } from '@/components/student/StudentLeaveView';
import { SupportDeskView } from '@/components/support/SupportDeskView';
import { PopQuizModal } from '@/components/quiz/PopQuizModal';
import { LinearGradient } from 'expo-linear-gradient';

export const StudentView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const {
    selectedStudent,
    homeworkList,
    toggleHomeworkStatus,
    showAlert,
    logout,
    setIsChatModalVisible,
  } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'academics' | 'assignments' | 'leaves' | 'support'>('home');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Submit Modal state
  const [submittingHw, setSubmittingHw] = useState<Homework | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [hasFileAttached, setHasFileAttached] = useState(false);

  const nextClass = MOCK_TIMETABLE.find((t) => t.isCurrent) || MOCK_TIMETABLE[0];
  const pendingTasks = homeworkList.filter((h) => h.status === 'pending');
  const completedTasks = homeworkList.filter((h) => h.status === 'completed');

  const filteredAssignments = homeworkList.filter((h) => {
    if (assignmentFilter === 'pending') return h.status === 'pending';
    if (assignmentFilter === 'completed') return h.status === 'completed';
    return true;
  });

  const handleSubmitAssignment = () => {
    if (!submittingHw) return;
    if (!submissionNotes.trim() && !hasFileAttached) {
      showAlert({
        title: 'Submission Required',
        message: 'Please provide your solution notes or attach your worksheet document.',
        type: 'warning',
      });
      return;
    }
    toggleHomeworkStatus(submittingHw.id);
    showAlert({
      title: 'Assignment Submitted! 🎉',
      message: `Your work for ${submittingHw.subject} (${submittingHw.title}) has been uploaded and sent to ${submittingHw.teacherName} for review.`,
      type: 'success',
      icon: 'checkmark-circle',
    });
    setSubmittingHw(null);
    setSubmissionNotes('');
    setHasFileAttached(false);
  };

  return (
    <View style={styles.container}>
      {/* APP BAR / HEADER (Matching Super Admin Premium Layout & Padding) */}
      <View style={styles.appHeader}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleCol}>
            <View style={styles.headerTag}>
              <View style={styles.pulseDot} />
              <Text style={styles.headerTagText}>
                {activeTab === 'home'
                  ? 'STUDENT PORTAL'
                  : activeTab === 'academics'
                  ? 'STUDENT PORTAL • GRADES'
                  : activeTab === 'assignments'
                  ? 'STUDENT PORTAL • TASKS'
                  : activeTab === 'leaves'
                  ? 'STUDENT PORTAL • LEAVE'
                  : 'STUDENT PORTAL • SUPPORT'}
              </Text>
            </View>
            <Text style={styles.headerTitle}>
              {activeTab === 'home'
                ? 'Student Hub'
                : activeTab === 'academics'
                ? 'Academics'
                : activeTab === 'assignments'
                ? 'Assignments'
                : activeTab === 'leaves'
                ? 'Leave Management'
                : 'Help & Support'}
            </Text>
            <Text style={styles.headerSub}>
              {activeTab === 'home'
                ? `Grade 8-A • ${selectedStudent.name}`
                : activeTab === 'academics'
                ? 'Term Report & Academic Standing'
                : activeTab === 'assignments'
                ? 'Coursework & Submission Queue'
                : activeTab === 'leaves'
                ? 'Leave Balance & Absence Requests'
                : 'Student Helpdesk & FAQ Support'}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.chatHeaderBtn}
              activeOpacity={0.8}
              onPress={() => setIsChatModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Open school chat">
              <Ionicons name="chatbubbles" size={19} color="#4F46E5" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileBtn}
              activeOpacity={0.8}
              onPress={() => setIsProfileModalOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="View student profile">
              {selectedStudent.avatar ? (
                <Image
                  source={{ uri: selectedStudent.avatar }}
                  style={styles.profileAvatarImg}
                />
              ) : (
                <View style={styles.profileFallback}>
                  <Ionicons name="person" size={18} color="#4F46E5" />
                </View>
              )}
              <View style={styles.statusOnlineDot} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
          isDesktop && styles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}>
        {/* STUDENT TAB 1: HOME OVERVIEW */}
        {activeTab === 'home' && (
          <View style={styles.homeContainer}>
            {/* Greeting Header */}
            <AppCard style={styles.heroCard}>
              <View style={styles.heroRow}>
                <View style={styles.heroTextCol}>
                  <Text style={styles.heroGreeting}>Hey, {selectedStudent.name.split(' ')[0]}! 👋</Text>
                  <Text style={styles.heroSub}>
                    Ready for your next class? You have {pendingTasks.length} assignments due soon.
                  </Text>
                </View>
                <View style={styles.attendanceMini}>
                  <Text style={styles.miniPercent}>{selectedStudent.attendancePercentage}%</Text>
                  <Text style={styles.miniLabel}>Present</Text>
                </View>
              </View>
            </AppCard>

            {/* AI POP QUIZ LIVE BANNER */}
            <TouchableOpacity
              style={styles.popQuizBanner}
              activeOpacity={0.88}
              onPress={() => setIsQuizModalOpen(true)}>
              <LinearGradient
                colors={['#4338CA', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.popQuizGradient}>
                <View style={styles.popQuizLeft}>
                  <View style={styles.popQuizIconBadge}>
                    <Ionicons name="sparkles" size={20} color="#FDE047" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.popQuizTagRow}>
                      <Text style={styles.popQuizTag}>AI POP QUIZ READY</Text>
                      <View style={styles.popQuizLiveDot} />
                    </View>
                    <Text style={styles.popQuizTitle}>Photosynthesis & Plant Biology</Text>
                    <Text style={styles.popQuizSub}>5 quick MCQs • Instant AI explanations & points</Text>
                  </View>
                </View>
                <View style={styles.popQuizPlayBtn}>
                  <Text style={styles.popQuizPlayBtnText}>Play</Text>
                  <Ionicons name="play" size={14} color="#4338CA" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* CENTER SQUARE SECTION HUBS */}
            <View style={styles.centerSquareSection}>
              <View style={styles.squareHeaderRow}>
                <Text style={styles.squareHeaderTitle}>Core Portals</Text>
                <Text style={styles.squareHeaderSubtitle}>Direct Navigation</Text>
              </View>

              <View style={styles.squareGrid}>
                {/* Square 1: Assignments */}
                <TouchableOpacity
                  style={[styles.squareCard, isDesktop && styles.squareCardDesktop, styles.squareCardAssignments]}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab('assignments')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#EEF2FF' }]}>
                      <Ionicons name="document-text" size={24} color="#4F46E5" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#FEE2E2' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#DC2626' }]}>
                        {pendingTasks.length} Due
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Assignments</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Turn in coursework
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Square 2: Academics */}
                <TouchableOpacity
                  style={[styles.squareCard, isDesktop && styles.squareCardDesktop, styles.squareCardAcademics]}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab('academics')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#ECFDF5' }]}>
                      <Ionicons name="school" size={24} color="#059669" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#047857' }]}>
                        {MOCK_REPORT_CARD.percentage}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Academics</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Report & Grades
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Square 3: Leaves */}
                <TouchableOpacity
                  style={[styles.squareCard, isDesktop && styles.squareCardDesktop, styles.squareCardSchedule]}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab('leaves')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#F0F9FF' }]}>
                      <Ionicons name="calendar" size={24} color="#0284C7" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#E0F2FE' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#0369A1' }]}>
                        12 Days Left
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Leave Desk</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Apply & Track
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Square 4: Support */}
                <TouchableOpacity
                  style={[styles.squareCard, isDesktop && styles.squareCardDesktop, styles.squareCardAccolades]}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab('support')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#FEF3C7' }]}>
                      <Ionicons name="help-buoy" size={24} color="#D97706" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#B45309' }]}>
                        Helpdesk
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Help & FAQs</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Student Support
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Main Content Columns: Next Class & Today's Assignments */}
            <View style={[styles.sectionCol, isDesktop && styles.sectionColDesktop]}>
              {/* Column 1: Next Class & Latest Accolade */}
              <View style={[styles.subCol, isDesktop && { flex: 1.2 }]}>
                {/* Next Class Banner */}
                <AppCard style={styles.nextClassCard}>
                  <View style={styles.nextClassHeader}>
                    <View style={styles.liveIndicator}>
                      <View style={styles.livePulse} />
                      <Text style={styles.liveText}>CURRENT PERIOD</Text>
                    </View>
                    <Text style={styles.roomBadge}>{nextClass.room}</Text>
                  </View>

                  <Text style={styles.nextClassName}>{nextClass.subject}</Text>
                  <Text style={styles.nextClassTeacher}>Teacher: {nextClass.teacherName}</Text>
                  <View style={styles.nextClassTimeRow}>
                    <Ionicons name="time-outline" size={14} color={Palette.actionBlue} />
                    <Text style={styles.nextClassTime}>{nextClass.time}</Text>
                  </View>
                </AppCard>

                {/* Latest Achievement */}
                <AppCard style={styles.achCard}>
                  <View style={styles.achRow}>
                    <View style={styles.trophyBg}>
                      <Ionicons name="trophy" size={24} color="#D97706" />
                    </View>
                    <View style={styles.achInfo}>
                      <Text style={styles.achTag}>LATEST ACCOLADE</Text>
                      <Text style={styles.achTitle}>{MOCK_ACHIEVEMENTS[0].title}</Text>
                      <Text style={styles.achResult}>{MOCK_ACHIEVEMENTS[0].result}</Text>
                    </View>
                  </View>
                </AppCard>
              </View>

              {/* Column 2: Quick Assignments Preview */}
              <View style={[styles.subCol, isDesktop && { flex: 1 }]}>
              <AppCard style={styles.tasksCard}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                    Today’s Assignments
                  </Text>
                  <TouchableOpacity
                    style={styles.seeAllBtn}
                    activeOpacity={0.7}
                    onPress={() => setActiveTab('assignments')}>
                    <Text style={styles.seeAllText}>View All ({homeworkList.length})</Text>
                    <Ionicons name="chevron-forward" size={12} color={Palette.actionBlue} />
                  </TouchableOpacity>
                </View>

                {homeworkList.map((hw) => {
                  const isCompleted = hw.status === 'completed';
                  return (
                    <TouchableOpacity
                      key={hw.id}
                      onPress={() => toggleHomeworkStatus(hw.id)}
                      style={[styles.taskRow, isCompleted && styles.taskRowCompleted]}>
                      <Ionicons
                        name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                        size={22}
                        color={isCompleted ? Palette.successGreen : Palette.actionBlue}
                      />
                      <View style={styles.taskTextCol}>
                        <Text
                          style={[
                            styles.taskTitle,
                            isCompleted && styles.taskTitleCompleted,
                          ]}>
                          {hw.title}
                        </Text>
                        <Text style={styles.taskMeta}>
                          {hw.subject} • Due {hw.dueDate}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </AppCard>
            </View>
          </View>
        </View>
      )}

        {/* STUDENT TAB 2: ACADEMICS */}
        {activeTab === 'academics' && (
          <View style={[styles.sectionCol, isDesktop && styles.sectionColDesktop]}>
            <AppCard style={[styles.academicSummaryCard, isDesktop && { flex: 1 }]}>
              <Text style={styles.academicTerm}>{MOCK_REPORT_CARD.term} Overall</Text>
              <View style={styles.academicStatsRow}>
                <View style={styles.academicStat}>
                  <Text style={styles.academicStatVal}>{MOCK_REPORT_CARD.percentage}%</Text>
                  <Text style={styles.academicStatLabel}>Average</Text>
                </View>
                <View style={styles.academicStat}>
                  <Text style={styles.academicStatVal}>{MOCK_REPORT_CARD.grade}</Text>
                  <Text style={styles.academicStatLabel}>Overall Grade</Text>
                </View>
                <View style={styles.academicStat}>
                  <Text style={styles.academicStatVal}>#{MOCK_REPORT_CARD.rank}</Text>
                  <Text style={styles.academicStatLabel}>Class Standing</Text>
                </View>
              </View>
            </AppCard>

            <AppCard style={[styles.subjectListCard, isDesktop && { flex: 1.5 }]}>
              <Text style={styles.cardTitle}>My Subjects</Text>
              {MOCK_REPORT_CARD.subjects.map((sub, idx) => (
                <View key={idx} style={styles.studentSubjectItem}>
                  <View style={styles.subLeft}>
                    <Text style={styles.subTitleText}>{sub.name}</Text>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${(sub.score / sub.maxScore) * 100}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.subRight}>
                    <Text style={styles.subScoreText}>{sub.score}/{sub.maxScore}</Text>
                    <Text style={styles.subGradeBadge}>{sub.grade}</Text>
                  </View>
                </View>
              ))}
            </AppCard>

            {/* Subject Assignment Turn-in Progress */}
            <AppCard style={[styles.academicAssignmentsCard, isDesktop && { flex: 1.5 }]}>
              <View style={styles.cardTitleRow}>
                <View>
                  <Text style={styles.cardTitle}>Coursework & Assignment Standing</Text>
                  <Text style={styles.assignmentQueueSub}>Term submission rate: 94%</Text>
                </View>
                <TouchableOpacity
                  style={styles.seeAllBtn}
                  activeOpacity={0.7}
                  onPress={() => setActiveTab('assignments')}>
                  <Text style={styles.seeAllText}>Open Assignments</Text>
                  <Ionicons name="chevron-forward" size={12} color={Palette.actionBlue} />
                </TouchableOpacity>
              </View>

              <View style={styles.subjectAssignmentGrid}>
                {homeworkList.map((hw) => {
                  const isDone = hw.status === 'completed';
                  return (
                    <View key={hw.id} style={styles.subjectAssignmentItem}>
                      <View style={styles.subLeft}>
                        <View style={styles.subItemSubjectRow}>
                          <Text style={styles.hwSubjectSmall}>{hw.subject}</Text>
                          <Text style={styles.hwDueSmall}>Due {hw.dueDate}</Text>
                        </View>
                        <Text style={styles.hwTitleSmall} numberOfLines={1}>{hw.title}</Text>
                      </View>
                      <View style={[styles.statusSmallBadge, isDone ? styles.badgeDoneSmall : styles.badgePendingSmall]}>
                        <Ionicons
                          name={isDone ? 'checkmark-circle' : 'time-outline'}
                          size={12}
                          color={isDone ? '#059669' : '#D97706'}
                        />
                        <Text style={[styles.badgeTextSmall, isDone ? styles.textDoneSmall : styles.textPendingSmall]}>
                          {isDone ? 'Turned In' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </AppCard>

            {/* AI Pop Quiz Practice in Academics */}
            <AppCard style={[styles.academicAssignmentsCard, isDesktop && { flex: 1.5 }]}>
              <View style={styles.cardTitleRow}>
                <View>
                  <Text style={styles.cardTitle}>AI Pop Quiz & Knowledge Tests</Text>
                  <Text style={styles.assignmentQueueSub}>Instant practice with AI explanations</Text>
                </View>
                <TouchableOpacity
                  style={styles.seeAllBtn}
                  activeOpacity={0.7}
                  onPress={() => setIsQuizModalOpen(true)}>
                  <Ionicons name="sparkles" size={14} color="#4F46E5" />
                  <Text style={styles.seeAllText}>Launch Quiz</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.popQuizBanner}
                activeOpacity={0.88}
                onPress={() => setIsQuizModalOpen(true)}>
                <LinearGradient
                  colors={['#4338CA', '#6366F1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.popQuizGradient}>
                  <View style={styles.popQuizLeft}>
                    <View style={styles.popQuizIconBadge}>
                      <Ionicons name="sparkles" size={20} color="#FDE047" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.popQuizTagRow}>
                        <Text style={styles.popQuizTag}>AI POP QUIZ READY</Text>
                        <View style={styles.popQuizLiveDot} />
                      </View>
                      <Text style={styles.popQuizTitle}>Photosynthesis & Plant Biology</Text>
                      <Text style={styles.popQuizSub}>5 quick MCQs • Instant AI explanations & points</Text>
                    </View>
                  </View>
                  <View style={styles.popQuizPlayBtn}>
                    <Text style={styles.popQuizPlayBtnText}>Play</Text>
                    <Ionicons name="play" size={14} color="#4338CA" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </AppCard>
          </View>
        )}

        {/* STUDENT TAB 3: COMPLETE ASSIGNMENTS MODULE */}
        {activeTab === 'assignments' && (
          <View style={[styles.sectionCol, isDesktop && styles.sectionColDesktop]}>
            {/* Filter Pills */}
            <View style={styles.assignmentFilterRow}>
              {(['all', 'pending', 'completed'] as const).map((filter) => {
                const isActive = assignmentFilter === filter;
                const count =
                  filter === 'all'
                    ? homeworkList.length
                    : filter === 'pending'
                    ? pendingTasks.length
                    : completedTasks.length;
                const label =
                  filter === 'all' ? 'All' : filter === 'pending' ? 'Pending' : 'Submitted';

                return (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterTabPill,
                      isActive && styles.filterTabPillActive,
                    ]}
                    onPress={() => setAssignmentFilter(filter)}>
                    <Text
                      style={[
                        styles.filterTabPillText,
                        isActive && styles.filterTabPillTextActive,
                      ]}>
                      {label} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Assignments List */}
            <View style={styles.assignmentsListContainer}>
              {filteredAssignments.length === 0 ? (
                <AppCard style={styles.emptyCard}>
                  <Ionicons name="checkmark-done-circle-outline" size={44} color="#10B981" />
                  <Text style={styles.emptyTitle}>All Caught Up!</Text>
                  <Text style={styles.emptySub}>No {assignmentFilter} assignments found.</Text>
                </AppCard>
              ) : (
                filteredAssignments.map((hw) => {
                  const isSubmitted = hw.status === 'completed';
                  return (
                    <AppCard key={hw.id} style={styles.assignmentFullCard}>
                      <View style={styles.hwCardHeaderRow}>
                        <View style={styles.subjectChip}>
                          <Text style={styles.subjectChipText}>{hw.subject}</Text>
                        </View>
                        <View style={styles.dueDateBadge}>
                          <Ionicons name="time-outline" size={13} color="#DC2626" />
                          <Text style={styles.dueDateBadgeText}>Due: {hw.dueDate}</Text>
                        </View>
                      </View>

                      <Text style={styles.hwTitleText}>{hw.title}</Text>
                      <Text style={styles.hwDescText}>{hw.description}</Text>

                      <View style={styles.hwMetaFooter}>
                        <View style={styles.teacherAuthorRow}>
                          <Ionicons name="person-circle-outline" size={16} color="#64748B" />
                          <Text style={styles.teacherAuthorText}>{hw.teacherName}</Text>
                        </View>

                        {isSubmitted ? (
                          <View style={styles.submittedTag}>
                            <Ionicons name="checkmark-circle" size={14} color="#059669" />
                            <Text style={styles.submittedTagText}>Submitted</Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.submitActionBtn}
                            activeOpacity={0.85}
                            onPress={() => setSubmittingHw(hw)}>
                            <Ionicons name="cloud-upload-outline" size={15} color="#FFFFFF" />
                            <Text style={styles.submitActionBtnText}>Submit Online</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </AppCard>
                  );
                })
              )}
            </View>
          </View>
        )}

        {/* STUDENT TAB 4: LEAVE APPLICATION & HISTORY */}
        {activeTab === 'leaves' && (
          <View style={styles.tabContentSection}>
            <StudentLeaveView />
          </View>
        )}

        {/* STUDENT TAB 5: SUPPORT & HELPDESK */}
        {activeTab === 'support' && (
          <View style={styles.tabContentSection}>
            <SupportDeskView roleMode="student" />
          </View>
        )}

        {/* FOOTER SECTION WITH SAFE AREA */}
        <View style={styles.pageFooter}>
          <View style={styles.footerBrandRow}>
            <Ionicons name="school-outline" size={16} color="#475569" />
            <Text style={styles.footerBrandText}>Oakridge International Academy</Text>
          </View>
          <Text style={styles.footerSubText}>
            Academic Year 2026-27 • Student Portal • Version 2.4.0
          </Text>
          <View style={styles.footerStatusRow}>
            <View style={styles.footerStatusDot} />
            <Text style={styles.footerStatusText}>Connected Securely (TLS 1.3)</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modern Bottom Navigation Bar */}
      <View style={[styles.bottomBar, isDesktop && styles.bottomBarDesktop]}>
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('home')}>
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={20}
            color={activeTab === 'home' ? '#4F46E5' : '#64748B'}
          />
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('academics')}>
          <Ionicons
            name={activeTab === 'academics' ? 'school' : 'school-outline'}
            size={20}
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
          onPress={() => setActiveTab('assignments')}>
          <Ionicons
            name={activeTab === 'assignments' ? 'book' : 'book-outline'}
            size={20}
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
            size={20}
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
            name={activeTab === 'support' ? 'help-buoy' : 'help-buoy-outline'}
            size={20}
            color={activeTab === 'support' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[styles.navLabel, activeTab === 'support' && styles.navLabelActive]}>
            Support
          </Text>
        </TouchableOpacity>
      </View>

      {/* POP QUIZ AI MODAL */}
      <PopQuizModal
        visible={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      {/* SUBMISSION MODAL */}
      <Modal visible={Boolean(submittingHw)} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSubjectTag}>{submittingHw?.subject}</Text>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  Submit: {submittingHw?.title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSubmittingHw(null)}
                style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.taskInstructionsBox}>
                <Text style={styles.instructionsLabel}>Teacher Instructions:</Text>
                <Text style={styles.instructionsText}>{submittingHw?.description}</Text>
                <Text style={styles.dueHighlight}>Deadline: {submittingHw?.dueDate}</Text>
              </View>

              <Text style={styles.formSectionLabel}>Student Work Notes / Solution Text:</Text>
              <TextInput
                style={styles.solutionInput}
                value={submissionNotes}
                onChangeText={setSubmissionNotes}
                placeholder="Type your answer, references, or completion notes here..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
              />

              <Text style={styles.formSectionLabel}>Attach Document / Worksheet:</Text>
              <TouchableOpacity
                style={[styles.attachFileBox, hasFileAttached && styles.attachFileBoxSelected]}
                activeOpacity={0.8}
                onPress={() => setHasFileAttached(!hasFileAttached)}>
                <Ionicons
                  name={hasFileAttached ? 'document-attach' : 'attach-outline'}
                  size={20}
                  color={hasFileAttached ? '#059669' : '#4F46E5'}
                />
                <Text
                  style={[
                    styles.attachFileText,
                    hasFileAttached && { color: '#059669', fontWeight: '700' },
                  ]}>
                  {hasFileAttached
                    ? '✓ Worksheet_Solution_Final.pdf (Attached)'
                    : 'Tap to attach PDF, DOCX, or Image'}
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setSubmittingHw(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmSubmitBtn}
                activeOpacity={0.85}
                onPress={handleSubmitAssignment}>
                <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                <Text style={styles.confirmSubmitBtnText}>Turn In Assignment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* STUDENT PROFILE SHEET MODAL */}
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
                <Text style={styles.profileModalTag}>STUDENT ACCOUNT</Text>
                <Text style={styles.profileModalTitle}>Student Profile</Text>
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
                  {selectedStudent.avatar ? (
                    <Image source={{ uri: selectedStudent.avatar }} style={styles.profileLargeAvatar} />
                  ) : (
                    <View style={styles.profileLargeFallback}>
                      <Ionicons name="person" size={36} color="#4F46E5" />
                    </View>
                  )}
                  <View style={styles.profileLargeStatusDot} />
                </View>

                <Text style={styles.profileHeroName}>{selectedStudent.name}</Text>
                <Text style={styles.profileHeroSub}>
                  Grade 8-A • Section A • Roll #{selectedStudent.rollNo}
                </Text>
                <View style={styles.profileHeroBadge}>
                  <Text style={styles.profileHeroBadgeText}>Active Enrolled Student</Text>
                </View>
              </View>

              {/* Student Details Grid */}
              <View style={styles.profileDetailsGrid}>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Student ID</Text>
                  <Text style={styles.profileDetailVal}>{selectedStudent.id.toUpperCase()}</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Attendance</Text>
                  <Text style={styles.profileDetailVal}>{selectedStudent.attendancePercentage}%</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Blood Group</Text>
                  <Text style={styles.profileDetailVal}>{selectedStudent.bloodGroup}</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <Text style={styles.profileDetailLabel}>Emergency</Text>
                  <Text style={styles.profileDetailVal} numberOfLines={1}>{selectedStudent.emergencyContact}</Text>
                </View>
              </View>

              {/* Quick Actions / Navigation */}
              <View style={styles.profileMenuSection}>
                <TouchableOpacity
                  style={styles.profileMenuItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsProfileModalOpen(false);
                    setActiveTab('academics');
                  }}>
                  <View style={[styles.profileMenuIconBox, { backgroundColor: '#EEF2FF' }]}>
                    <Ionicons name="school-outline" size={18} color="#4F46E5" />
                  </View>
                  <View style={styles.profileMenuTextCol}>
                    <Text style={styles.profileMenuTitle}>Academic Report Card</Text>
                    <Text style={styles.profileMenuSub}>Grades, Term standing & Subjects</Text>
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
                    <Text style={styles.profileMenuTitle}>Assignments & Homework</Text>
                    <Text style={styles.profileMenuSub}>{pendingTasks.length} pending tasks</Text>
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
                <Text style={styles.profileSignOutText}>Sign Out of School Portal</Text>
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
  homeContainer: {
    gap: 16,
  },
  centerSquareSection: {
    gap: 10,
    marginVertical: 4,
  },
  squareHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  squareHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
  },
  squareHeaderSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textSecondary,
  },
  squareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  squareCard: {
    width: '48%',
    aspectRatio: 1,
    minHeight: 140,
    backgroundColor: Palette.surface,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 14,
    justifyContent: 'space-between',
    ...Shadows.card,
  },
  squareCardDesktop: {
    width: '23.5%',
    aspectRatio: 1.1,
  },
  squareCardAssignments: {
    borderColor: '#E0E7FF',
  },
  squareCardAcademics: {
    borderColor: '#D1FAE5',
  },
  squareCardSchedule: {
    borderColor: '#BAE6FD',
  },
  squareCardAccolades: {
    borderColor: '#FDE68A',
  },
  squareTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  squareBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  squareBottomInfo: {
    gap: 3,
  },
  squareTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  squareSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 16,
  },
  backToHubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.blueTint,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radii.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 4,
  },
  backToHubText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  appHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: Platform.OS === 'ios' ? 14 : 14,
    paddingBottom: 14,
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
    backgroundColor: '#4F46E5',
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
  backNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  backNavBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
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
  profileFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
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
  profileLargeFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E0E7FF',
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
    borderRadius: Radii.pill,
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
  scrollContentDesktop: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  sectionCol: {
    gap: 16,
  },
  sectionColDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  subCol: {
    gap: 16,
  },
  heroCard: {
    padding: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextCol: {
    flex: 1,
    marginRight: 12,
  },
  heroGreeting: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textDark,
  },
  heroSub: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  attendanceMini: {
    backgroundColor: Palette.blueTint,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.sm,
    alignItems: 'center',
  },
  miniPercent: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.actionBlue,
  },
  miniLabel: {
    fontSize: 10,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  nextClassCard: {
    padding: 16,
    gap: 8,
  },
  nextClassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.successGreen,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.successGreen,
    letterSpacing: 0.5,
  },
  roomBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
    backgroundColor: Palette.borderSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.xs,
  },
  nextClassName: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textDark,
  },
  nextClassTeacher: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  nextClassTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  nextClassTime: {
    fontSize: 12,
    color: Palette.actionBlue,
    fontWeight: '600',
  },
  achCard: {
    padding: 16,
  },
  achRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trophyBg: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achInfo: {
    flex: 1,
  },
  achTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  achTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textDark,
    marginTop: 2,
  },
  achResult: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  tasksCard: {
    padding: 16,
    gap: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.actionBlue,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  taskRowCompleted: {
    opacity: 0.6,
  },
  taskTextCol: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textDark,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Palette.textSecondary,
  },
  taskMeta: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  academicSummaryCard: {
    padding: 16,
    gap: 12,
  },
  academicTerm: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
  },
  academicStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  academicStat: {
    alignItems: 'center',
    gap: 4,
  },
  academicStatVal: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.actionBlue,
  },
  academicStatLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  subjectListCard: {
    padding: 16,
    gap: 12,
  },
  studentSubjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  subLeft: {
    flex: 1,
    marginRight: 16,
    gap: 6,
  },
  subTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textDark,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Palette.borderSubtle,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Palette.actionBlue,
    borderRadius: 3,
  },
  subRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  subScoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textDark,
  },
  subGradeBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.actionBlue,
    backgroundColor: Palette.blueTint,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radii.xs,
  },

  // ASSIGNMENTS MODULE STYLES
  assignmentFilterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.sm,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  filterTabPillActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterTabPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  filterTabPillTextActive: {
    color: '#FFFFFF',
  },

  assignmentsListContainer: {
    gap: 12,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textDark,
  },
  emptySub: {
    fontSize: 12,
    color: Palette.textSecondary,
  },

  assignmentFullCard: {
    padding: 16,
    gap: 10,
  },
  hwCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dueDateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  hwTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textDark,
  },
  hwDescText: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  hwMetaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  teacherAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  teacherAuthorText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  submittedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  submittedTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  submitActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  submitActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // SUBMIT MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
    maxWidth: 260,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalBody: {
    paddingVertical: 14,
  },
  taskInstructionsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    gap: 4,
  },
  instructionsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  instructionsText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
  },
  dueHighlight: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 4,
  },
  formSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  solutionInput: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
  },
  attachFileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C7D2FE',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#EEF2FF',
    marginBottom: 16,
  },
  attachFileBoxSelected: {
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
  },
  attachFileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmSubmitBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
  },
  confirmSubmitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Academics Coursework Card Styles
  academicAssignmentsCard: {
    padding: 16,
    gap: 12,
  },
  assignmentQueueSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  subjectAssignmentGrid: {
    gap: 10,
    marginTop: 4,
  },
  subjectAssignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  subItemSubjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hwSubjectSmall: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  hwDueSmall: {
    fontSize: 11,
    color: '#94A3B8',
  },
  hwTitleSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textDark,
    marginTop: 2,
  },
  statusSmallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeDoneSmall: {
    backgroundColor: '#ECFDF5',
  },
  badgePendingSmall: {
    backgroundColor: '#FEF3C7',
  },
  badgeTextSmall: {
    fontSize: 11,
    fontWeight: '700',
  },
  textDoneSmall: {
    color: '#059669',
  },
  textPendingSmall: {
    color: '#D97706',
  },

  chatHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  popQuizBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 14,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  popQuizGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  popQuizLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  popQuizIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popQuizTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  popQuizTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FDE047',
    letterSpacing: 0.6,
  },
  popQuizLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  popQuizTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  popQuizSub: {
    fontSize: 11,
    color: '#E0E7FF',
    marginTop: 2,
  },
  popQuizPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  popQuizPlayBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4338CA',
  },
  tabContentSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

