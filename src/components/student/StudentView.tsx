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
import { AppCard } from '@/components/common/AppCard';
import { StatusPill } from '@/components/common/StatusPill';
import { Palette, Radii } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { MOCK_ACHIEVEMENTS, MOCK_REPORT_CARD, MOCK_TIMETABLE } from '@/data/mockData';

export const StudentView: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const { selectedStudent, homeworkList, toggleHomeworkStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'academics' | 'tasks'>('home');

  const nextClass = MOCK_TIMETABLE.find((t) => t.isCurrent) || MOCK_TIMETABLE[0];
  const pendingTasks = homeworkList.filter((h) => h.status === 'pending');
  const completedTasks = homeworkList.filter((h) => h.status === 'completed');

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.navBar}>
        <View style={styles.navInner}>
          <TouchableOpacity
            onPress={() => setActiveTab('home')}
            style={[styles.navItem, activeTab === 'home' && styles.navItemActive]}>
            <Ionicons
              name="home"
              size={18}
              color={activeTab === 'home' ? Palette.actionBlue : Palette.textSecondary}
            />
            <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('academics')}
            style={[styles.navItem, activeTab === 'academics' && styles.navItemActive]}>
            <Ionicons
              name="school"
              size={18}
              color={activeTab === 'academics' ? Palette.actionBlue : Palette.textSecondary}
            />
            <Text style={[styles.navText, activeTab === 'academics' && styles.navTextActive]}>
              Academics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('tasks')}
            style={[styles.navItem, activeTab === 'tasks' && styles.navItemActive]}>
            <Ionicons
              name="checkbox"
              size={18}
              color={activeTab === 'tasks' ? Palette.actionBlue : Palette.textSecondary}
            />
            <Text style={[styles.navText, activeTab === 'tasks' && styles.navTextActive]}>
              Tasks ({pendingTasks.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
        showsVerticalScrollIndicator={false}>
        {/* STUDENT TAB 1: HOME OVERVIEW */}
        {activeTab === 'home' && (
          <View style={[styles.sectionCol, isDesktop && styles.sectionColDesktop]}>
            {/* Column 1: Hero & Next Class */}
            <View style={[styles.subCol, isDesktop && { flex: 1.2 }]}>
              {/* Greeting Header */}
              <AppCard style={styles.heroCard}>
                <View style={styles.heroRow}>
                  <View style={styles.heroTextCol}>
                    <Text style={styles.heroGreeting}>Hey, {selectedStudent.name.split(' ')[0]}! 👋</Text>
                    <Text style={styles.heroSub}>
                      Ready for your next class? You have {pendingTasks.length} tasks due soon.
                    </Text>
                  </View>
                  <View style={styles.attendanceMini}>
                    <Text style={styles.miniPercent}>{selectedStudent.attendancePercentage}%</Text>
                    <Text style={styles.miniLabel}>Present</Text>
                  </View>
                </View>
              </AppCard>

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

            {/* Column 2: Daily Tasks Checklist */}
            <View style={[styles.subCol, isDesktop && { flex: 1 }]}>
              <AppCard style={styles.tasksCard}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                    Today's Assignments
                  </Text>
                  <TouchableOpacity
                    style={styles.seeAllBtn}
                    activeOpacity={0.7}
                    onPress={() => setActiveTab('tasks')}>
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
          </View>
        )}

        {/* STUDENT TAB 3: TASKS LIST */}
        {activeTab === 'tasks' && (
          <View style={[styles.sectionCol, isDesktop && styles.sectionColDesktop]}>
            <View style={[styles.tasksSection, isDesktop && { flex: 1 }]}>
              <Text style={styles.tasksGroupTitle}>
                Pending Tasks ({pendingTasks.length})
              </Text>
              {pendingTasks.map((hw) => (
                <AppCard key={hw.id} style={styles.taskCardItem}>
                  <View style={styles.taskCardHeader}>
                    <View style={styles.hwTag}>
                      <Text style={styles.hwTagText}>{hw.subject}</Text>
                    </View>
                    <Text style={styles.dueDateText}>Due: {hw.dueDate}</Text>
                  </View>
                  <Text style={styles.hwCardTitle}>{hw.title}</Text>
                  <Text style={styles.hwCardDesc}>{hw.description}</Text>

                  <TouchableOpacity
                    style={styles.markDoneBtn}
                    onPress={() => toggleHomeworkStatus(hw.id)}>
                    <Ionicons name="checkmark-circle-outline" size={18} color={Palette.actionBlue} />
                    <Text style={styles.markDoneBtnText}>Tap to Mark Completed</Text>
                  </TouchableOpacity>
                </AppCard>
              ))}
            </View>

            {completedTasks.length > 0 && (
              <View style={[styles.tasksSection, isDesktop && { flex: 1 }]}>
                <Text style={styles.tasksGroupTitle}>
                  Completed ({completedTasks.length})
                </Text>
                {completedTasks.map((hw) => (
                  <AppCard key={hw.id} style={[styles.taskCardItem, { opacity: 0.8 }]}>
                    <View style={styles.taskCardHeader}>
                      <Text style={styles.hwCardTitleCompleted}>{hw.title}</Text>
                      <StatusPill status="completed" size="sm" />
                    </View>
                    <Text style={styles.completedSub}>{hw.subject} • Done</Text>
                  </AppCard>
                ))}
              </View>
            )}
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
  navBar: {
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  navInner: {
    flexDirection: 'row',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  navItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: Radii.sm,
    gap: 6,
  },
  navItemActive: {
    backgroundColor: Palette.blueTint,
  },
  navText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  navTextActive: {
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
    backgroundColor: Palette.primaryNavy,
    borderColor: '#1D3B5C',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroTextCol: {
    flex: 1,
    minWidth: 150,
    gap: 4,
  },
  heroGreeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: 13,
    color: '#B0C8E8',
    lineHeight: 18,
  },
  attendanceMini: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.md,
    alignItems: 'center',
  },
  miniPercent: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  miniLabel: {
    fontSize: 10,
    color: '#B0C8E8',
    fontWeight: '600',
  },
  nextClassCard: {
    backgroundColor: Palette.blueTint,
    borderColor: '#CFE2FE',
    gap: 6,
  },
  nextClassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
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
    backgroundColor: Palette.actionBlue,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.actionBlue,
    letterSpacing: 0.5,
  },
  roomBadge: {
    backgroundColor: Palette.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primaryNavy,
  },
  nextClassName: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.primaryNavy,
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
    fontWeight: '600',
    color: Palette.actionBlue,
  },
  tasksCard: {
    gap: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Palette.blueTint,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: Radii.pill,
    flexShrink: 0,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  taskRowCompleted: {
    opacity: 0.6,
  },
  taskTextCol: {
    flex: 1,
    gap: 2,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textDark,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Palette.textSecondary,
  },
  taskMeta: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  achCard: {
    gap: 10,
  },
  achRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trophyBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achInfo: {
    flex: 1,
    gap: 2,
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
  },
  achResult: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  academicSummaryCard: {
    backgroundColor: Palette.navyTint,
    gap: 12,
  },
  academicTerm: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.primaryNavy,
  },
  academicStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  academicStat: {
    alignItems: 'center',
  },
  academicStatVal: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.primaryNavy,
  },
  academicStatLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  subjectListCard: {
    gap: 12,
  },
  studentSubjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    gap: 12,
  },
  subLeft: {
    flex: 1,
    gap: 6,
  },
  subTitleText: {
    fontSize: 14,
    fontWeight: '700',
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
  tasksSection: {
    gap: 10,
  },
  tasksGroupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  taskCardItem: {
    gap: 8,
  },
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hwTag: {
    backgroundColor: Palette.navyTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.xs,
  },
  hwTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primaryNavy,
  },
  dueDateText: {
    fontSize: 12,
    color: Palette.errorRed,
    fontWeight: '600',
  },
  hwCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  hwCardTitleCompleted: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.textSecondary,
    textDecorationLine: 'line-through',
  },
  hwCardDesc: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  markDoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.blueTint,
    padding: 10,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    marginTop: 4,
  },
  markDoneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  completedSub: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
});
