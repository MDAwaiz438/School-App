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
import { Palette, Breakpoints } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface ParentAttendanceViewProps {
  onBack?: () => void;
}

export const ParentAttendanceView: React.FC<ParentAttendanceViewProps> = ({ onBack }) => {
  const { width } = useWindowDimensions();
  const isCompact = width < Breakpoints.compact; // < 360
  const isTablet = width >= Breakpoints.tablet;

  const { selectedStudent } = useApp();

  // November 2024 calendar data
  const [selectedDay, setSelectedDay] = useState<number>(12);

  const presentCount = selectedStudent.presentDays || 18;
  const absentCount = selectedStudent.absentDays || 1;
  const leaveCount = selectedStudent.leaveDays || 1;
  const workingDays = presentCount + absentCount + leaveCount; // 20
  const attendanceRate = selectedStudent.attendancePercentage || 92;

  // Calendar structure for November 2024 (starts on Friday Nov 1st)
  // Calendar row headers: Sun Mon Tue Wed Thu Fri Sat
  const calendarCells = [
    { day: 27, isPrevMonth: true },
    { day: 28, isPrevMonth: true },
    { day: 29, isPrevMonth: true },
    { day: 30, isPrevMonth: true },
    { day: 31, isPrevMonth: true },
    { day: 1, isPrevMonth: false, status: 'none' },
    { day: 2, isPrevMonth: false, status: 'none' },
    { day: 3, isPrevMonth: false, status: 'none' },
    { day: 4, isPrevMonth: false, status: 'present' },
    { day: 5, isPrevMonth: false, status: 'present' },
    { day: 6, isPrevMonth: false, status: 'present' },
    { day: 7, isPrevMonth: false, status: 'present' },
    { day: 8, isPrevMonth: false, status: 'present' },
    { day: 9, isPrevMonth: false, status: 'none' },
    { day: 10, isPrevMonth: false, status: 'none' },
    { day: 11, isPrevMonth: false, status: 'present' },
    { day: 12, isPrevMonth: false, status: 'present', isTarget: true },
    { day: 13, isPrevMonth: false, status: 'present' },
    { day: 14, isPrevMonth: false, status: 'present' },
    { day: 15, isPrevMonth: false, status: 'absent' },
    { day: 16, isPrevMonth: false, status: 'none' },
    { day: 17, isPrevMonth: false, status: 'none' },
    { day: 18, isPrevMonth: false, status: 'present' },
    { day: 19, isPrevMonth: false, status: 'present' },
    { day: 20, isPrevMonth: false, status: 'present' },
    { day: 21, isPrevMonth: false, status: 'leave' },
    { day: 22, isPrevMonth: false, status: 'none' },
    { day: 23, isPrevMonth: false, status: 'none' },
    { day: 24, isPrevMonth: false, status: 'none' },
    { day: 25, isPrevMonth: false, status: 'present' },
    { day: 26, isPrevMonth: false, status: 'present' },
    { day: 27, isPrevMonth: false, status: 'present' },
    { day: 28, isPrevMonth: false, status: 'none' },
    { day: 29, isPrevMonth: false, status: 'present' },
    { day: 30, isPrevMonth: false, status: 'none' },
  ];

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <HeaderBar
        title="Attendance"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          isTablet && styles.contentContainerTablet,
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Month Navigation */}
        <View style={styles.monthSelector}>
          <TouchableOpacity
            style={styles.monthNavBtn}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel="Previous month">
            <Ionicons name="chevron-back" size={18} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.monthText}>November 2024</Text>
          <TouchableOpacity
            style={styles.monthNavBtn}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel="Next month">
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Attendance Summary Card (Stacks on compact < 360, row on standard) */}
        <View style={styles.card}>
          <View style={[styles.summaryRow, isCompact && styles.summaryRowCompact]}>
            {/* Donut Chart Representation */}
            <View style={styles.donutWrapper}>
              <View style={styles.donutOuter}>
                <View style={styles.donutInner}>
                  <Text style={styles.donutPercentage}>{attendanceRate}%</Text>
                  <Text style={styles.donutLabel}>Attendance</Text>
                </View>
              </View>
            </View>

            {/* Metrics Breakdown */}
            <View style={[styles.metricsCol, isCompact && styles.metricsColCompact]}>
              <View style={styles.metricItem}>
                <View style={[styles.statusDot, { backgroundColor: '#27AE60' }]} />
                <Text style={styles.metricName}>Present</Text>
                <Text style={styles.metricCount}>{presentCount}</Text>
              </View>

              <View style={styles.metricItem}>
                <View style={[styles.statusDot, { backgroundColor: '#EB5757' }]} />
                <Text style={styles.metricName}>Absent</Text>
                <Text style={styles.metricCount}>{absentCount}</Text>
              </View>

              <View style={styles.metricItem}>
                <View style={[styles.statusDot, { backgroundColor: '#F2994A' }]} />
                <Text style={styles.metricName}>Leave</Text>
                <Text style={styles.metricCount}>{leaveCount}</Text>
              </View>

              <View style={styles.metricItem}>
                <View style={[styles.statusDot, { backgroundColor: '#94A3B8' }]} />
                <Text style={styles.metricName}>Working Days</Text>
                <Text style={styles.metricCount}>{workingDays}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Interactive Calendar Card */}
        <View style={styles.card}>
          {/* Day of Week Headers */}
          <View style={styles.calendarWeekHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <Text key={d} style={styles.calendarDayHeaderLabel}>
                {d}
              </Text>
            ))}
          </View>

          {/* Days Grid - 7 Columns calculated dynamically */}
          <View style={styles.calendarGrid}>
            {calendarCells.map((item, idx) => {
              const isSelected = !item.isPrevMonth && selectedDay === item.day;
              const statusDesc =
                item.status === 'present'
                  ? 'Present'
                  : item.status === 'absent'
                  ? 'Absent'
                  : item.status === 'leave'
                  ? 'Leave'
                  : 'No class';

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    if (!item.isPrevMonth) setSelectedDay(item.day);
                  }}
                  activeOpacity={item.isPrevMonth ? 1 : 0.7}
                  accessibilityRole="button"
                  accessibilityLabel={
                    item.isPrevMonth
                      ? `October ${item.day}`
                      : `November ${item.day}, ${statusDesc}`
                  }
                  style={styles.dayCell}>
                  {item.isPrevMonth ? (
                    <Text style={styles.prevMonthText}>{item.day}</Text>
                  ) : item.status === 'present' ? (
                    <View
                      style={[
                        styles.bubble,
                        { backgroundColor: '#27AE60' },
                        isSelected && styles.bubbleSelected,
                      ]}>
                      <Text style={styles.bubbleTextWhite}>{item.day}</Text>
                    </View>
                  ) : item.status === 'absent' ? (
                    <View
                      style={[
                        styles.bubble,
                        { backgroundColor: '#EB5757' },
                        isSelected && styles.bubbleSelected,
                      ]}>
                      <Text style={styles.bubbleTextWhite}>{item.day}</Text>
                    </View>
                  ) : item.status === 'leave' ? (
                    <View
                      style={[
                        styles.bubble,
                        { backgroundColor: '#F2994A' },
                        isSelected && styles.bubbleSelected,
                      ]}>
                      <Text style={styles.bubbleTextWhite}>{item.day}</Text>
                    </View>
                  ) : isSelected ? (
                    <View style={styles.ringSelected}>
                      <Text style={styles.ringText}>{item.day}</Text>
                    </View>
                  ) : (
                    <Text style={styles.normalDayText}>{item.day}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Day Status Card */}
        <View style={[styles.card, styles.selectedDayCard]}>
          <View style={styles.selectedDayHeader}>
            <Text style={styles.selectedDayTitle} numberOfLines={1}>
              Tue, {selectedDay} Nov 2024
            </Text>
            <View style={styles.presentBadge}>
              <Text style={styles.presentBadgeText}>Present</Text>
            </View>
          </View>
          <View style={styles.selectedDayMeta}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.selectedDaySub}>Full Day</Text>
          </View>
          <Text style={styles.markedByText}>Marked by School</Text>
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
  headerBar: {
    backgroundColor: '#102A43',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    minHeight: 56,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  contentContainerTablet: {
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  monthNavBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17202A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
    gap: 12,
  },
  summaryRowCompact: {
    flexDirection: 'column',
    gap: 16,
  },
  donutWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutOuter: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 9,
    borderColor: '#27AE60',
    borderLeftColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  donutInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercentage: {
    fontSize: 22,
    fontWeight: '800',
    color: '#17202A',
  },
  donutLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  metricsCol: {
    gap: 10,
    minWidth: 130,
  },
  metricsColCompact: {
    width: '100%',
    paddingHorizontal: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  metricName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
  },
  metricCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17202A',
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  calendarDayHeaderLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10,
  },
  dayCell: {
    width: '14.28%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevMonthText: {
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  normalDayText: {
    fontSize: 14,
    color: '#17202A',
    fontWeight: '600',
  },
  bubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleSelected: {
    borderWidth: 2.5,
    borderColor: '#2F80ED',
  },
  bubbleTextWhite: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ringSelected: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2F80ED',
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2F80ED',
  },
  selectedDayCard: {
    gap: 8,
  },
  selectedDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedDayTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#17202A',
  },
  presentBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  presentBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  selectedDayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  selectedDaySub: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  markedByText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 22,
  },
});
