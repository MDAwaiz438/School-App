import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBar } from '@/components/common/HeaderBar';
import { AppCard } from '@/components/common/AppCard';
import { AppButton } from '@/components/common/AppButton';
import { StatusPill } from '@/components/common/StatusPill';
import { Palette, Radii } from '@/constants/theme';
import { MOCK_ACHIEVEMENTS, MOCK_REPORT_CARD, MOCK_TIMETABLE } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
type DayType = typeof DAYS[number];

interface ParentAcademicsViewProps {
  onNavigateTab?: (tab: 'home' | 'academics' | 'updates' | 'more' | 'attendance' | 'homework') => void;
  onBack?: () => void;
}

export const ParentAcademicsView: React.FC<ParentAcademicsViewProps> = ({ onNavigateTab, onBack }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const { selectedStudent, homeworkList, toggleHomeworkStatus, showAlert } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'hub' | 'timetable' | 'assignments' | 'report_card' | 'achievements'>('hub');
  const [selectedDay, setSelectedDay] = useState<DayType>('Monday');
  const [selectedTerm, setSelectedTerm] = useState<'Mid-Term' | 'Term 1' | 'Annual'>('Mid-Term');

  const handleDownloadReport = () => {
    showAlert({
      title: 'Report Card Download',
      message: `Downloading official certified Report Card for ${selectedStudent.name} (${selectedTerm}).`,
      type: 'success',
      icon: 'download-outline',
    });
  };

  const handleBack = onBack || (onNavigateTab ? () => onNavigateTab('home') : undefined);

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <HeaderBar
        title={
          activeSubTab === 'hub'
            ? 'Academic Hub'
            : activeSubTab === 'timetable'
            ? 'Class Timetable'
            : activeSubTab === 'assignments'
            ? 'Assignments'
            : activeSubTab === 'report_card'
            ? 'Report Card'
            : 'Achievements'
        }
        onBack={activeSubTab === 'hub' ? undefined : () => setActiveSubTab('hub')}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
        showsVerticalScrollIndicator={false}>
        {/* SUBTAB 0: ACADEMIC HUB */}
        {activeSubTab === 'hub' && (
          <View style={styles.tabContent}>
            {/* Student Academic Standing Banner */}
            <AppCard style={styles.academicHeroCard}>
              <View style={styles.academicHeroRow}>
                <View style={styles.academicHeroTextCol}>
                  <Text style={styles.academicHeroTag}>ENROLLED STUDENT</Text>
                  <Text style={styles.academicHeroName}>{selectedStudent.name}</Text>
                  <Text style={styles.academicHeroSub}>Grade 8 - Section A • Roll #{selectedStudent.rollNo}</Text>
                </View>
                <View style={styles.standingBadge}>
                  <Text style={styles.standingGrade}>A+</Text>
                  <Text style={styles.standingLabel}>Standing</Text>
                </View>
              </View>
            </AppCard>

            {/* CENTER SQUARE SECTION HUBS */}
            <View style={styles.centerSquareSection}>
              <View style={styles.squareHeaderRow}>
                <Text style={styles.squareHeaderTitle}>Academic Portals</Text>
                <Text style={styles.squareHeaderSubtitle}>Direct Navigation</Text>
              </View>

              <View style={styles.squareGrid}>
                {/* Square 1: Timetable */}
                <TouchableOpacity
                  style={[styles.squareCard, styles.squareCardTimetable]}
                  activeOpacity={0.75}
                  onPress={() => setActiveSubTab('timetable')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#EEF2FF' }]}>
                      <Ionicons name="calendar" size={24} color="#4F46E5" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#E0E7FF' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#4338CA' }]}>
                        Schedule
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Timetable</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Daily periods & classes
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Square 2: Assignments */}
                <TouchableOpacity
                  style={[styles.squareCard, styles.squareCardAssignments]}
                  activeOpacity={0.75}
                  onPress={() => setActiveSubTab('assignments')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#ECFDF5' }]}>
                      <Ionicons name="book" size={24} color="#059669" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#D1FAE5' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#047857' }]}>
                        {homeworkList.length} Tasks
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Assignments</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Homework & submissions
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Square 3: Report Card */}
                <TouchableOpacity
                  style={[styles.squareCard, styles.squareCardReports]}
                  activeOpacity={0.75}
                  onPress={() => setActiveSubTab('report_card')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#FAF5FF' }]}>
                      <Ionicons name="document-text" size={24} color="#9333EA" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#F3E8FF' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#7E22CE' }]}>
                        {MOCK_REPORT_CARD.percentage}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Report Card</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Term marks & remarks
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Square 4: Achievements */}
                <TouchableOpacity
                  style={[styles.squareCard, styles.squareCardAwards]}
                  activeOpacity={0.75}
                  onPress={() => setActiveSubTab('achievements')}>
                  <View style={styles.squareTopRow}>
                    <View style={[styles.squareIconBox, { backgroundColor: '#FFFBEB' }]}>
                      <Ionicons name="trophy" size={24} color="#D97706" />
                    </View>
                    <View style={[styles.squareBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.squareBadgeText, { color: '#B45309' }]}>
                        Honors
                      </Text>
                    </View>
                  </View>
                  <View style={styles.squareBottomInfo}>
                    <Text style={styles.squareTitle}>Awards</Text>
                    <Text style={styles.squareSubtitle} numberOfLines={1}>
                      Certificates & badges
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* SUBTAB 1: TIMETABLE */}
        {activeSubTab === 'timetable' && (
          <View style={styles.tabContent}>
            {/* Day Selector */}
            <View style={styles.dayPicker}>
              {DAYS.map((d) => {
                const isSelected = selectedDay === d;
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setSelectedDay(d)}
                    style={[styles.dayButton, isSelected && styles.dayButtonActive]}>
                    <Text
                      style={[styles.dayButtonText, isSelected && styles.dayButtonTextActive]}>
                      {d.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.dayInfoRow}>
              <Text style={styles.dayInfoTitle}>{selectedDay}'s Schedule</Text>
              <Text style={styles.dayInfoSubtitle}>Grade 8 - Section A</Text>
            </View>

            {/* Class Cards Grid */}
            <View style={[styles.scheduleList, isDesktop && styles.scheduleListDesktop]}>
              {MOCK_TIMETABLE.map((slot, index) => (
                <AppCard
                  key={slot.id}
                  style={[
                    styles.slotCard,
                    isDesktop && styles.slotCardDesktop,
                    slot.isCurrent && styles.slotCardCurrent,
                  ]}>
                  <View style={styles.slotPeriodBadge}>
                    <Text style={styles.periodNumber}>P{index + 1}</Text>
                  </View>

                  <View style={styles.slotDetails}>
                    <View style={styles.slotHeader}>
                      <Text style={styles.slotSubject} numberOfLines={1} ellipsizeMode="tail">
                        {slot.subject}
                      </Text>
                      {slot.isCurrent && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>IN PROGRESS</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.slotTeacher} numberOfLines={1} ellipsizeMode="tail">
                      {slot.teacherName}
                    </Text>

                    <View style={styles.slotFooter}>
                      <View style={styles.timeTag}>
                        <Ionicons name="time-outline" size={13} color={Palette.textSecondary} />
                        <Text style={styles.slotTime}>{slot.time}</Text>
                      </View>
                      <View style={styles.roomTag}>
                        <Ionicons name="location-outline" size={13} color={Palette.actionBlue} />
                        <Text style={styles.slotRoom} numberOfLines={1} ellipsizeMode="tail">
                          {slot.room}
                        </Text>
                      </View>
                    </View>
                  </View>
                </AppCard>
              ))}
            </View>
          </View>
        )}

        {/* SUBTAB 2: REPORT CARD */}
        {activeSubTab === 'report_card' && (
          <View style={styles.tabContent}>
            {/* Term Selector */}
            <View style={styles.termPicker}>
              {(['Mid-Term', 'Term 1', 'Annual'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedTerm(t)}
                  style={[styles.termButton, selectedTerm === t && styles.termButtonActive]}>
                  <Text
                    style={[
                      styles.termButtonText,
                      selectedTerm === t && styles.termButtonTextActive,
                    ]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.reportLayout, isDesktop && styles.reportLayoutDesktop]}>
              {/* Overall Score Highlight */}
              <AppCard style={[styles.scoreHighlightCard, isDesktop && { flex: 1 }]}>
                <View style={styles.scoreHighlightRow}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.highlightTerm}>{MOCK_REPORT_CARD.term} Results</Text>
                    <Text style={styles.highlightYear}>
                      Academic Year {MOCK_REPORT_CARD.academicYear}
                    </Text>
                  </View>
                  <View style={styles.gradeBadge}>
                    <Text style={styles.gradeBadgeText}>{MOCK_REPORT_CARD.grade}</Text>
                  </View>
                </View>

                <View style={styles.statsSummaryRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Percentage</Text>
                    <Text style={styles.statVal}>{MOCK_REPORT_CARD.percentage}%</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Class Rank</Text>
                    <Text style={styles.statVal}>
                      #{MOCK_REPORT_CARD.rank}{' '}
                      <Text style={styles.statSub}>/ {MOCK_REPORT_CARD.totalStudents}</Text>
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total Marks</Text>
                    <Text style={styles.statVal}>
                      {MOCK_REPORT_CARD.totalScore}/{MOCK_REPORT_CARD.maxTotal}
                    </Text>
                  </View>
                </View>

                <View style={styles.teacherRemarksBox}>
                  <Text style={styles.remarksLabel}>Teacher Remarks:</Text>
                  <Text style={styles.remarksBody}>{MOCK_REPORT_CARD.teacherRemarks}</Text>
                </View>

                <AppButton
                  title="Download Report (PDF)"
                  variant="outline"
                  icon={<Ionicons name="download-outline" size={18} color={Palette.primaryNavy} />}
                  onPress={handleDownloadReport}
                  style={{ marginTop: 12 }}
                />
              </AppCard>

              {/* Subject-Wise Performance Table */}
              <AppCard style={[styles.tableCard, isDesktop && { flex: 1.5 }]}>
                <Text style={styles.tableTitle}>Subject Breakdown</Text>
                <View style={styles.tableHeader}>
                  <Text style={[styles.colHeader, { flex: 2 }]}>Subject</Text>
                  <Text style={[styles.colHeader, { flex: 1, textAlign: 'center' }]}>Score</Text>
                  <Text style={[styles.colHeader, { flex: 1, textAlign: 'right' }]}>Grade</Text>
                </View>

                {MOCK_REPORT_CARD.subjects.map((sub, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.subjectName}>{sub.name}</Text>
                      {sub.remarks && <Text style={styles.subRemarks}>{sub.remarks}</Text>}
                    </View>
                    <Text style={styles.subjectScore}>
                      {sub.score}/{sub.maxScore}
                    </Text>
                    <View style={styles.gradePillContainer}>
                      <Text style={styles.gradeLetter}>{sub.grade}</Text>
                    </View>
                  </View>
                ))}
              </AppCard>
            </View>
          </View>
        )}

        {/* SUBTAB: ASSIGNMENTS & HOMEWORK MONITOR */}
        {activeSubTab === 'assignments' && (
          <View style={styles.tabContent}>
            <View style={styles.dayInfoRow}>
              <View>
                <Text style={styles.dayInfoTitle}>Child Coursework & Tasks</Text>
                <Text style={styles.dayInfoSubtitle}>
                  {homeworkList.filter((h) => h.status === 'completed').length} of {homeworkList.length} assignments turned in
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewHubBtn}
                activeOpacity={0.8}
                onPress={() => onNavigateTab?.('homework')}>
                <Text style={styles.viewHubBtnText}>Full Hub</Text>
                <Ionicons name="arrow-forward" size={13} color="#4F46E5" />
              </TouchableOpacity>
            </View>

            <View style={styles.assignmentsListStack}>
              {homeworkList.map((hw) => {
                const isCompleted = hw.status === 'completed';
                return (
                  <AppCard key={hw.id} style={styles.academicHwCard}>
                    <View style={styles.academicHwTop}>
                      <View style={styles.hwSubjectPill}>
                        <Text style={styles.hwSubjectPillText}>{hw.subject}</Text>
                      </View>
                      <Text style={styles.hwDueCountdown}>Due: {hw.dueDate}</Text>
                    </View>

                    <Text style={styles.academicHwTitle}>{hw.title}</Text>
                    <Text style={styles.academicHwDesc}>{hw.description}</Text>

                    <View style={styles.academicHwFooter}>
                      <Text style={styles.academicHwTeacher}>Assigned by {hw.teacherName}</Text>
                      <TouchableOpacity
                        style={[
                          styles.parentVerifyBtn,
                          isCompleted && styles.parentVerifyBtnDone,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => toggleHomeworkStatus(hw.id)}>
                        <Ionicons
                          name={isCompleted ? 'checkmark-circle' : 'time-outline'}
                          size={14}
                          color={isCompleted ? '#059669' : '#D97706'}
                        />
                        <Text
                          style={[
                            styles.parentVerifyBtnText,
                            isCompleted && styles.parentVerifyBtnTextDone,
                          ]}>
                          {isCompleted ? 'Turned In' : 'Pending Turn-in'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </AppCard>
                );
              })}
            </View>
          </View>
        )}

        {/* SUBTAB 3: ACHIEVEMENTS */}
        {activeSubTab === 'achievements' && (
          <View style={styles.tabContent}>
            <View style={styles.dayInfoRow}>
              <Text style={styles.dayInfoTitle}>Honors & Co-Curricular</Text>
              <Text style={styles.dayInfoSubtitle}>Verified student accolades</Text>
            </View>

            <View style={[styles.achGrid, isDesktop && styles.achGridDesktop]}>
              {MOCK_ACHIEVEMENTS.map((ach) => (
                <AppCard
                  key={ach.id}
                  style={[styles.achievementCard, isDesktop && styles.achievementCardDesktop]}>
                  <View style={styles.achHeader}>
                    <View style={styles.achIconBg}>
                      <Ionicons
                        name={
                          ach.category === 'sports'
                            ? 'football'
                            : ach.category === 'academics'
                            ? 'medal'
                            : 'ribbon'
                        }
                        size={24}
                        color={Palette.primaryNavy}
                      />
                    </View>
                    <View style={styles.achMeta}>
                      <Text style={styles.achResult}>{ach.result}</Text>
                      <Text style={styles.achTitle}>{ach.title}</Text>
                      <Text style={styles.achEvent}>{ach.event}</Text>
                    </View>
                  </View>
                  <Text style={styles.achDesc}>{ach.description}</Text>
                  <View style={styles.achFooter}>
                    <Text style={styles.achDate}>Issued: {ach.date}</Text>
                    <TouchableOpacity
                      style={styles.certLink}
                      onPress={() =>
                        showAlert({
                          title: 'Certificate Preview',
                          message: `Viewing digital certificate for ${ach.title}. Issued on ${ach.date}.`,
                          type: 'info',
                          icon: 'trophy-outline',
                        })
                      }>
                      <Ionicons name="eye-outline" size={14} color={Palette.actionBlue} />
                      <Text style={styles.certLinkText}>View Certificate</Text>
                    </TouchableOpacity>
                  </View>
                </AppCard>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  academicHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  academicHeroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  academicHeroTextCol: {
    flex: 1,
  },
  academicHeroTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  academicHeroName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  academicHeroSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  standingBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  standingGrade: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4F46E5',
  },
  standingLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
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
  squareCardTimetable: {
    borderColor: '#C7D2FE',
  },
  squareCardAssignments: {
    borderColor: '#BBF7D0',
  },
  squareCardReports: {
    borderColor: '#E9D5FF',
  },
  squareCardAwards: {
    borderColor: '#FDE68A',
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
  tabContent: {
    gap: 16,
  },
  dayPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.surface,
    padding: 4,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radii.sm,
  },
  dayButtonActive: {
    backgroundColor: Palette.primaryNavy,
  },
  dayButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayInfoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  dayInfoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textDark,
  },
  dayInfoSubtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  scheduleList: {
    gap: 10,
  },
  scheduleListDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  slotCardDesktop: {
    width: '48.5%',
  },
  slotCardCurrent: {
    borderColor: Palette.actionBlue,
    borderWidth: 1.5,
    backgroundColor: Palette.blueTint,
  },
  slotPeriodBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.navyTint,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  periodNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.primaryNavy,
  },
  slotDetails: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    minWidth: 0,
  },
  slotSubject: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
    flex: 1,
    minWidth: 0,
  },
  currentBadge: {
    backgroundColor: Palette.actionBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    flexShrink: 0,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  slotTeacher: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  slotFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 4,
    marginTop: 3,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  slotTime: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  roomTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
    minWidth: 0,
  },
  slotRoom: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.actionBlue,
  },
  termPicker: {
    flexDirection: 'row',
    gap: 8,
  },
  termButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  termButtonActive: {
    backgroundColor: Palette.primaryNavy,
    borderColor: Palette.primaryNavy,
  },
  termButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  termButtonTextActive: {
    color: '#FFFFFF',
  },
  reportLayout: {
    gap: 16,
  },
  reportLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  scoreHighlightCard: {
    gap: 14,
  },
  scoreHighlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightTerm: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textDark,
  },
  highlightYear: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  gradeBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.greenTint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Palette.successGreen,
  },
  gradeBadgeText: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.successGreen,
  },
  statsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textDark,
    marginTop: 2,
  },
  statSub: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Palette.borderSubtle,
  },
  tableCard: {
    gap: 12,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  colHeader: {
    fontSize: 12,
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
  subjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textDark,
  },
  subRemarks: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  subjectScore: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textDark,
    textAlign: 'center',
  },
  gradePillContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  gradeLetter: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.actionBlue,
    backgroundColor: Palette.blueTint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.xs,
  },
  teacherRemarksBox: {
    backgroundColor: Palette.background,
    padding: 12,
    borderRadius: Radii.sm,
    gap: 4,
    marginTop: 6,
  },
  remarksLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
    textTransform: 'uppercase',
  },
  remarksBody: {
    fontSize: 13,
    color: Palette.textDark,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  achGrid: {
    gap: 12,
  },
  achGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievementCard: {
    gap: 10,
  },
  achievementCardDesktop: {
    width: '48.5%',
  },
  achHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  achIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.navyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achMeta: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  achResult: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  achTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  achEvent: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  achDesc: {
    fontSize: 13,
    color: Palette.textDark,
    lineHeight: 18,
  },
  achFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  achDate: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  certLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.actionBlue,
  },

  // Academic Assignment SubTab Styles
  viewHubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  viewHubBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  assignmentsListStack: {
    gap: 12,
    marginTop: 8,
  },
  academicHwCard: {
    padding: 16,
    gap: 8,
  },
  academicHwTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hwSubjectPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hwSubjectPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  hwDueCountdown: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
  academicHwTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textDark,
  },
  academicHwDesc: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  academicHwFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 10,
    marginTop: 4,
  },
  academicHwTeacher: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  parentVerifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  parentVerifyBtnDone: {
    backgroundColor: '#ECFDF5',
  },
  parentVerifyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  parentVerifyBtnTextDone: {
    color: '#059669',
  },
});
