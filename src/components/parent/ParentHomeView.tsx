import React from 'react';
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
import { MOCK_TIMETABLE } from '@/data/mockData';

interface ParentHomeViewProps {
  onNavigateTab: (tab: 'home' | 'academics' | 'updates' | 'more') => void;
  onOpenLeaveModal: () => void;
}

export const ParentHomeView: React.FC<ParentHomeViewProps> = ({
  onNavigateTab,
  onOpenLeaveModal,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const { selectedStudent, homeworkList, toggleHomeworkStatus, announcements } = useApp();

  const currentClass = MOCK_TIMETABLE.find((t) => t.isCurrent) || MOCK_TIMETABLE[0];
  const nextClass = MOCK_TIMETABLE.find((t) => t.isNext) || MOCK_TIMETABLE[1];
  const pendingHomework = homeworkList.filter((h) => h.status === 'pending');
  const emergencyAnn = announcements.find((a) => a.priority === 'emergency');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        isDesktop && styles.contentContainerDesktop,
      ]}
      showsVerticalScrollIndicator={false}>
      {/* Emergency Announcement Banner (if any) */}
      {emergencyAnn && (
        <View style={styles.emergencyBanner}>
          <View style={styles.emergencyHeader}>
            <View style={styles.emergencyTag}>
              <Ionicons name="warning" size={14} color="#FFFFFF" />
              <Text style={styles.emergencyTagText}>URGENT NOTICE</Text>
            </View>
            <Text style={styles.emergencyDate}>{emergencyAnn.date}</Text>
          </View>
          <Text style={styles.emergencyTitle}>{emergencyAnn.title}</Text>
          <Text style={styles.emergencyContent}>{emergencyAnn.content}</Text>
        </View>
      )}

      {/* Responsive Grid Container */}
      <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
        {/* COLUMN 1: PRESENCE & SCHEDULE */}
        <View style={[styles.column, isDesktop && styles.columnHalf]}>
          {/* Section 1: Child Status & Attendance Card */}
          <AppCard style={styles.statusCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.headerTextCol}>
                <Text style={styles.eyebrow} numberOfLines={1}>STUDENT DAILY STATUS</Text>
                <Text style={styles.cardTitle} numberOfLines={1}>Today's Presence</Text>
              </View>
              <StatusPill status="present" label="Present Today" />
            </View>

            <View style={styles.attendanceRow}>
              <View style={styles.progressCircleContainer}>
                <View style={styles.circleGraphic}>
                  <Text style={styles.percentageText}>{selectedStudent.attendancePercentage}%</Text>
                  <Text style={styles.percentageLabel}>Attendance</Text>
                </View>
              </View>

              <View style={styles.metricsCol}>
                <View style={styles.metricItem}>
                  <View style={[styles.metricDot, { backgroundColor: Palette.successGreen }]} />
                  <Text style={styles.metricLabel}>Present Days</Text>
                  <Text style={styles.metricValue}>{selectedStudent.presentDays}</Text>
                </View>
                <View style={styles.metricItem}>
                  <View style={[styles.metricDot, { backgroundColor: Palette.errorRed }]} />
                  <Text style={styles.metricLabel}>Absent Days</Text>
                  <Text style={styles.metricValue}>{selectedStudent.absentDays}</Text>
                </View>
                <View style={styles.metricItem}>
                  <View style={[styles.metricDot, { backgroundColor: Palette.warningOrange }]} />
                  <Text style={styles.metricLabel}>Approved Leave</Text>
                  <Text style={styles.metricValue}>{selectedStudent.leaveDays}</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardFooterActions}>
              <TouchableOpacity
                style={styles.cardFooterLink}
                onPress={() => onNavigateTab('more')}>
                <Ionicons name="calendar-outline" size={16} color={Palette.actionBlue} />
                <Text style={styles.cardFooterLinkText}>View Attendance Calendar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cardFooterLink, styles.leaveBtnLink]}
                onPress={onOpenLeaveModal}>
                <Ionicons name="document-text-outline" size={16} color={Palette.primaryNavy} />
                <Text style={[styles.cardFooterLinkText, { color: Palette.primaryNavy }]}>
                  Apply Leave
                </Text>
              </TouchableOpacity>
            </View>
          </AppCard>

          {/* Section 2: Today's Schedule Preview */}
          <AppCard style={styles.scheduleCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.headerTextCol}>
                <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
                  Today's Schedule
                </Text>
                <Text style={styles.sectionSubtitle} numberOfLines={1}>
                  Monday • 6 Periods Scheduled
                </Text>
              </View>
              <TouchableOpacity
                style={styles.seeAllBtn}
                activeOpacity={0.7}
                onPress={() => onNavigateTab('academics')}>
                <Text style={styles.seeAllText}>Full Week</Text>
                <Ionicons name="chevron-forward" size={12} color={Palette.actionBlue} />
              </TouchableOpacity>
            </View>

            {/* Current Class */}
            <View style={styles.activeClassRow}>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>NOW HAPPENING</Text>
              </View>
              <View style={styles.classInfoRow}>
                <View style={styles.classSubjectCol}>
                  <Text style={styles.classSubject}>{currentClass.subject}</Text>
                  <Text style={styles.classTeacher}>{currentClass.teacherName}</Text>
                </View>
                <View style={styles.classMetaCol}>
                  <Text style={styles.classTime}>{currentClass.time}</Text>
                  <Text style={styles.classRoom}>{currentClass.room}</Text>
                </View>
              </View>
            </View>

            {/* Next Class */}
            <View style={styles.nextClassRow}>
              <View style={styles.nextPill}>
                <Text style={styles.nextPillText}>UP NEXT</Text>
              </View>
              <View style={styles.classInfoRow}>
                <View style={styles.classSubjectCol}>
                  <Text style={styles.classSubject}>{nextClass.subject}</Text>
                  <Text style={styles.classTeacher}>{nextClass.teacherName}</Text>
                </View>
                <View style={styles.classMetaCol}>
                  <Text style={styles.classTime}>{nextClass.time}</Text>
                  <Text style={styles.classRoom}>{nextClass.room}</Text>
                </View>
              </View>
            </View>
          </AppCard>
        </View>

        {/* COLUMN 2: QUICK ACTIONS, HOMEWORK & UPDATES */}
        <View style={[styles.column, isDesktop && styles.columnHalf]}>
          {/* Quick Action Grid */}
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.actionTile}
              activeOpacity={0.7}
              onPress={() => onNavigateTab('academics')}>
              <View style={[styles.actionIconBg, { backgroundColor: Palette.blueTint }]}>
                <Ionicons name="time" size={22} color={Palette.actionBlue} />
              </View>
              <Text style={styles.actionTileText}>Timetable</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionTile}
              activeOpacity={0.7}
              onPress={() => onNavigateTab('academics')}>
              <View style={[styles.actionIconBg, { backgroundColor: Palette.greenTint }]}>
                <Ionicons name="school" size={22} color={Palette.successGreen} />
              </View>
              <Text style={styles.actionTileText}>Report Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionTile}
              activeOpacity={0.7}
              onPress={onOpenLeaveModal}>
              <View style={[styles.actionIconBg, { backgroundColor: Palette.orangeTint }]}>
                <Ionicons name="calendar" size={22} color={Palette.warningOrange} />
              </View>
              <Text style={styles.actionTileText}>Apply Leave</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionTile}
              activeOpacity={0.7}
              onPress={() => onNavigateTab('more')}>
              <View style={[styles.actionIconBg, { backgroundColor: Palette.navyTint }]}>
                <Ionicons name="card" size={22} color={Palette.primaryNavy} />
              </View>
              <Text style={styles.actionTileText}>Fee Invoices</Text>
            </TouchableOpacity>
          </View>

          {/* Pending Homework */}
          <AppCard style={styles.homeworkCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.headerTextCol}>
                <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
                  Homework & Assignments
                </Text>
                <Text style={styles.sectionSubtitle} numberOfLines={1}>
                  {pendingHomework.length} Pending Tasks
                </Text>
              </View>
              <TouchableOpacity
                style={styles.seeAllBtn}
                activeOpacity={0.7}
                onPress={() => onNavigateTab('academics')}>
                <Text style={styles.seeAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={12} color={Palette.actionBlue} />
              </TouchableOpacity>
            </View>

            {homeworkList.slice(0, 2).map((hw) => {
              const isPending = hw.status === 'pending';
              return (
                <View key={hw.id} style={styles.homeworkItem}>
                  <View style={styles.hwHeader}>
                    <View style={styles.hwSubjectTag}>
                      <Text style={styles.hwSubjectText}>{hw.subject}</Text>
                    </View>
                    <StatusPill
                      status={hw.status}
                      label={isPending ? `Due ${hw.dueDate}` : 'Completed'}
                      size="sm"
                    />
                  </View>

                  <Text style={styles.hwTitle}>{hw.title}</Text>
                  <Text style={styles.hwDesc} numberOfLines={2}>
                    {hw.description}
                  </Text>

                  <View style={styles.hwFooter}>
                    <Text style={styles.hwTeacher}>Assigned by {hw.teacherName}</Text>
                    <TouchableOpacity
                      style={[styles.hwCompleteBtn, !isPending && styles.hwCompleteBtnActive]}
                      onPress={() => toggleHomeworkStatus(hw.id)}>
                      <Ionicons
                        name={isPending ? 'checkmark-circle-outline' : 'checkmark-circle'}
                        size={16}
                        color={isPending ? Palette.actionBlue : Palette.successGreen}
                      />
                      <Text
                        style={[
                          styles.hwCompleteBtnText,
                          !isPending && { color: Palette.successGreen },
                        ]}>
                        {isPending ? 'Mark Completed' : 'Completed'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </AppCard>

          {/* School Announcements */}
          <AppCard style={styles.announcementsCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.headerTextCol}>
                <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
                  School Updates
                </Text>
                <Text style={styles.sectionSubtitle} numberOfLines={1}>
                  Circulars & notices
                </Text>
              </View>
              <TouchableOpacity
                style={styles.seeAllBtn}
                activeOpacity={0.7}
                onPress={() => onNavigateTab('updates')}>
                <Text style={styles.seeAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={12} color={Palette.actionBlue} />
              </TouchableOpacity>
            </View>

            {announcements.slice(0, 2).map((ann) => (
              <View key={ann.id} style={styles.announcementItem}>
                <View style={styles.annHeaderRow}>
                  <StatusPill status={ann.priority} size="sm" />
                  <Text style={styles.annDate}>{ann.date}</Text>
                </View>
                <Text style={styles.annTitle}>{ann.title}</Text>
                <Text style={styles.annContent} numberOfLines={2}>
                  {ann.content}
                </Text>
              </View>
            ))}
          </AppCard>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  contentContainerDesktop: {
    padding: 24,
  },
  emergencyBanner: {
    backgroundColor: Palette.errorRed,
    borderRadius: Radii.card,
    padding: 16,
    gap: 8,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
    gap: 4,
  },
  emergencyTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emergencyDate: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '500',
  },
  emergencyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emergencyContent: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.95,
  },
  mainLayout: {
    gap: 16,
  },
  mainLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    gap: 16,
  },
  columnHalf: {
    flex: 1,
  },
  statusCard: {
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textDark,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  progressCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleGraphic: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: Palette.navyTint,
    borderWidth: 4,
    borderColor: Palette.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.primaryNavy,
  },
  percentageLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  metricsCol: {
    flex: 1,
    gap: 8,
    minWidth: 120,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  metricLabel: {
    fontSize: 13,
    color: Palette.textSecondary,
    flex: 1,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textDark,
  },
  cardFooterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 12,
    gap: 10,
    flexWrap: 'wrap',
  },
  cardFooterLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardFooterLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.actionBlue,
  },
  leaveBtnLink: {
    backgroundColor: Palette.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionTile: {
    flex: 1,
    minWidth: 68,
    backgroundColor: Palette.surface,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    gap: 6,
  },
  actionIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTileText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textDark,
    textAlign: 'center',
  },
  headerTextCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  scheduleCard: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minWidth: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
    lineHeight: 22,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.blueTint,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radii.pill,
    flexShrink: 0,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  activeClassRow: {
    backgroundColor: Palette.blueTint,
    borderRadius: Radii.md,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: Palette.actionBlue,
    gap: 6,
  },
  activePill: {
    backgroundColor: Palette.actionBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    alignSelf: 'flex-start',
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  nextClassRow: {
    backgroundColor: Palette.background,
    borderRadius: Radii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    gap: 6,
  },
  nextPill: {
    backgroundColor: Palette.textSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    alignSelf: 'flex-start',
  },
  nextPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  classInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  classSubjectCol: {
    gap: 2,
    flex: 1,
    minWidth: 140,
  },
  classSubject: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  classTeacher: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  classMetaCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  classTime: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primaryNavy,
  },
  classRoom: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  homeworkCard: {
    gap: 14,
  },
  homeworkItem: {
    backgroundColor: Palette.background,
    borderRadius: Radii.md,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  hwHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  hwSubjectTag: {
    backgroundColor: Palette.navyTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.xs,
  },
  hwSubjectText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primaryNavy,
  },
  hwTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  hwDesc: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  hwFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 8,
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  hwTeacher: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  hwCompleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.sm,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  hwCompleteBtnActive: {
    borderColor: Palette.successGreen,
    backgroundColor: Palette.greenTint,
  },
  hwCompleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.actionBlue,
  },
  announcementsCard: {
    gap: 14,
  },
  announcementItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    gap: 4,
  },
  annHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  annDate: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  annTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textDark,
  },
  annContent: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
});
