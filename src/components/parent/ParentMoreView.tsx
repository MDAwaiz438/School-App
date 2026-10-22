import React, { useState } from 'react';
import {
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
import { HeaderBar } from '@/components/common/HeaderBar';
import { StatusPill } from '@/components/common/StatusPill';
import { Palette, Radii } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { MOCK_FEES } from '@/data/mockData';

interface ParentMoreViewProps {
  onBack?: () => void;
}

export const ParentMoreView: React.FC<ParentMoreViewProps> = ({ onBack }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const {
    selectedStudent,
    allStudents,
    setSelectedStudentId,
    leaveRequests,
    submitLeaveRequest,
    attendanceCalendar,
    logout,
    showAlert,
    setIsChatModalVisible,
  } = useApp();

  const [isLeaveModalVisible, setLeaveModalVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);

  const handleApplyLeave = () => {
    if (!startDate || !reason) {
      showAlert({
        title: 'Required Fields',
        message: 'Please specify a start date and reason for leave.',
        type: 'warning',
      });
      return;
    }

    submitLeaveRequest({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      grade: selectedStudent.grade,
      section: selectedStudent.section,
      startDate: startDate,
      endDate: endDate || startDate,
      reason: reason,
    });

    setStartDate('');
    setEndDate('');
    setReason('');
    setLeaveModalVisible(false);
    showAlert({
      title: 'Request Submitted',
      message: 'Your leave request has been forwarded to the class teacher.',
      type: 'success',
      icon: 'checkmark-circle',
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Palette.background }}>
      {/* Screen Header */}
      <HeaderBar
        title="More"
        onBack={onBack}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          isDesktop && styles.contentContainerDesktop,
        ]}
        showsVerticalScrollIndicator={false}>
      <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
        {/* COLUMN 1: PROFILE & ATTENDANCE CALENDAR */}
        <View style={[styles.column, isDesktop && styles.columnHalf]}>
          {/* 1. Student Profile Card */}
          <AppCard style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarInitials}>
                  {selectedStudent.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{selectedStudent.name}</Text>
                <Text style={styles.profileGrade}>
                  {selectedStudent.grade} - {selectedStudent.section} • Roll #{selectedStudent.rollNo}
                </Text>
                <Text style={styles.profileSchool}>Oakridge International Academy</Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Blood Group</Text>
                <Text style={styles.detailVal}>{selectedStudent.bloodGroup}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Date of Birth</Text>
                <Text style={styles.detailVal}>{selectedStudent.dob}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Emergency Contact</Text>
                <Text style={styles.detailVal}>{selectedStudent.emergencyContact}</Text>
              </View>
            </View>
          </AppCard>

          {/* 2. Attendance Calendar Breakdown */}
          <AppCard style={styles.calendarCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.headerTextCol}>
                <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">Attendance Record</Text>
                <Text style={styles.sectionSubtitle} numberOfLines={1}>October 2026 Monthly Log</Text>
              </View>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeText}>{selectedStudent.attendancePercentage}%</Text>
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Palette.successGreen }]} />
                <Text style={styles.legendText}>Present ({selectedStudent.presentDays})</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Palette.errorRed }]} />
                <Text style={styles.legendText}>Absent ({selectedStudent.absentDays})</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Palette.warningOrange }]} />
                <Text style={styles.legendText}>Leave ({selectedStudent.leaveDays})</Text>
              </View>
            </View>

            {/* Calendar days grid */}
            <View style={styles.daysGrid}>
              {attendanceCalendar.map((rec) => {
                const dayNum = rec.date.split('-')[2];
                const isPresent = rec.status === 'present';
                const isAbsent = rec.status === 'absent';
                const isLeave = rec.status === 'leave';

                return (
                  <TouchableOpacity
                    key={rec.date}
                    onPress={() =>
                      setSelectedDayDetail(
                        `${rec.date}: ${rec.status.toUpperCase()}${rec.note ? ` (${rec.note})` : ''}`
                      )
                    }
                    style={[
                      styles.dayTile,
                      isPresent && styles.dayTilePresent,
                      isAbsent && styles.dayTileAbsent,
                      isLeave && styles.dayTileLeave,
                    ]}>
                    <Text
                      style={[
                        styles.dayTileNum,
                        isPresent && { color: Palette.successGreen },
                        isAbsent && { color: Palette.errorRed },
                        isLeave && { color: Palette.warningOrange },
                      ]}>
                      {dayNum}
                    </Text>
                    <View
                      style={[
                        styles.statusDot,
                        isPresent && { backgroundColor: Palette.successGreen },
                        isAbsent && { backgroundColor: Palette.errorRed },
                        isLeave && { backgroundColor: Palette.warningOrange },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedDayDetail && (
              <View style={styles.dayDetailBox}>
                <Ionicons name="information-circle-outline" size={16} color={Palette.actionBlue} />
                <Text style={styles.dayDetailText}>{selectedDayDetail}</Text>
              </View>
            )}
          </AppCard>
        </View>

        {/* COLUMN 2: LEAVE REQUESTS & FEES */}
        <View style={[styles.column, isDesktop && styles.columnHalf]}>
          {/* 3. Leave Requests Center */}
          <AppCard style={styles.leaveCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.headerTextCol}>
                <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">Leave Applications</Text>
                <Text style={styles.sectionSubtitle} numberOfLines={1}>History & approval tracking</Text>
              </View>
              <AppButton
                title="+ Apply Leave"
                size="sm"
                variant="action"
                onPress={() => setLeaveModalVisible(true)}
              />
            </View>

            {leaveRequests.map((req) => (
              <View key={req.id} style={styles.leaveHistoryItem}>
                <View style={styles.leaveHistoryHeader}>
                  <Text style={styles.leaveDateRange}>
                    {req.startDate} {req.endDate !== req.startDate ? `to ${req.endDate}` : ''}
                  </Text>
                  <StatusPill status={req.status} size="sm" />
                </View>
                <Text style={styles.leaveReason}>{req.reason}</Text>
                <View style={styles.leaveFooter}>
                  <Text style={styles.leaveMeta}>Applied on {req.appliedAt}</Text>
                  {req.approvedBy && (
                    <Text style={styles.leaveApprovedBy}>Approved by {req.approvedBy}</Text>
                  )}
                </View>
              </View>
            ))}
          </AppCard>

          {/* 4. Fees & Dues Overview */}
          <AppCard style={styles.feeCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.headerTextCol}>
                <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">Fee Invoices</Text>
                <Text style={styles.sectionSubtitle} numberOfLines={1}>Academic year dues</Text>
              </View>
            </View>

            {MOCK_FEES.map((fee) => (
              <View key={fee.id} style={styles.feeItem}>
                <View style={styles.feeLeft}>
                  <Text style={styles.feeTitle} numberOfLines={2}>
                    {fee.title}
                  </Text>
                  <Text style={styles.feeInvoice} numberOfLines={1}>
                    {fee.invoiceNo} • Due {fee.dueDate}
                  </Text>
                </View>
                <View style={styles.feeRight}>
                  <Text style={styles.feeAmount}>${fee.amount}</Text>
                  <StatusPill status={fee.status} size="sm" />
                </View>
              </View>
            ))}
          </AppCard>

          {/* Direct Communication & Helpdesk */}
          <AppCard style={styles.feeCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.headerTextCol}>
                <Text style={styles.sectionTitle} numberOfLines={1}>Support & Communication</Text>
                <Text style={styles.sectionSubtitle} numberOfLines={1}>Direct contact with faculty & admin</Text>
              </View>
            </View>

            <View style={{ gap: 10, marginTop: 8 }}>
              <AppButton
                title="Open Campus & Faculty Chat"
                variant="primary"
                icon={<Ionicons name="chatbubbles-outline" size={18} color="#FFFFFF" />}
                onPress={() => setIsChatModalVisible(true)}
              />
              <AppButton
                title="School Helpdesk & FAQs"
                variant="outline"
                icon={<Ionicons name="help-buoy-outline" size={18} color={Palette.primaryNavy} />}
                onPress={() =>
                  showAlert({
                    title: 'Oakridge Campus Helpdesk',
                    message: 'Official Support Desk is active 8:00 AM – 4:30 PM.\nEmail: support@oakridge.edu\nDirect Helpline: +1 (800) 555-0199',
                    type: 'info',
                    icon: 'headset-outline',
                  })
                }
              />
            </View>
          </AppCard>

          {/* 5. Switch Student or Logout */}
          <View style={styles.actionSection}>
            {allStudents.length > 1 && (
              <AppButton
                title={`Switch to ${allStudents.find((s) => s.id !== selectedStudent.id)?.name}`}
                variant="outline"
                icon={<Ionicons name="swap-horizontal" size={18} color={Palette.primaryNavy} />}
                onPress={() => {
                  const other = allStudents.find((s) => s.id !== selectedStudent.id);
                  if (other) setSelectedStudentId(other.id);
                }}
              />
            )}

            <AppButton
              title="Sign Out"
              variant="danger"
              icon={<Ionicons name="log-out-outline" size={18} color="#FFFFFF" />}
              onPress={() => {
                showAlert({
                  title: 'Sign Out',
                  message: 'Are you sure you want to log out of the parent portal?',
                  type: 'confirm',
                  buttons: [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log Out', style: 'destructive', onPress: logout },
                  ],
                });
              }}
            />
          </View>
        </View>
      </View>

      {/* LEAVE APPLICATION MODAL */}
      <Modal visible={isLeaveModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Student Leave</Text>
              <TouchableOpacity onPress={() => setLeaveModalVisible(false)}>
                <Ionicons name="close" size={22} color={Palette.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Student</Text>
            <View style={styles.staticField}>
              <Text style={styles.staticFieldText}>
                {selectedStudent.name} ({selectedStudent.grade}-{selectedStudent.section})
              </Text>
            </View>

            <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2026-10-24"
              value={startDate}
              onChangeText={setStartDate}
            />

            <Text style={styles.inputLabel}>End Date (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2026-10-25"
              value={endDate}
              onChangeText={setEndDate}
            />

            <Text style={styles.inputLabel}>Reason for Absence</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the reason (medical, personal, family event)..."
              multiline
              numberOfLines={3}
              value={reason}
              onChangeText={setReason}
            />

            <View style={styles.modalActions}>
              <AppButton
                title="Cancel"
                variant="outline"
                style={{ flex: 1 }}
                onPress={() => setLeaveModalVisible(false)}
              />
              <AppButton
                title="Submit Application"
                variant="primary"
                style={{ flex: 1.5 }}
                onPress={handleApplyLeave}
              />
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>
    </View>
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
  profileCard: {
    gap: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarLarge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Palette.primaryNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textDark,
  },
  profileGrade: {
    fontSize: 13,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  profileSchool: {
    fontSize: 12,
    color: Palette.actionBlue,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  detailBox: {
    minWidth: 80,
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textDark,
  },
  calendarCard: {
    gap: 14,
  },
  sectionHeaderRow: {
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textDark,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  summaryBadge: {
    backgroundColor: Palette.greenTint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  summaryBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.successGreen,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Palette.background,
    padding: 8,
    borderRadius: Radii.sm,
    flexWrap: 'wrap',
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-start',
  },
  dayTile: {
    minWidth: 36,
    flexGrow: 1,
    maxWidth: 44,
    height: 46,
    borderRadius: Radii.sm,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    gap: 3,
  },
  dayTilePresent: {
    backgroundColor: Palette.greenTint,
    borderColor: '#C6F0D3',
  },
  dayTileAbsent: {
    backgroundColor: Palette.redTint,
    borderColor: '#FACCCC',
  },
  dayTileLeave: {
    backgroundColor: Palette.orangeTint,
    borderColor: '#FEE0C2',
  },
  dayTileNum: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textDark,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dayDetailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.blueTint,
    padding: 10,
    borderRadius: Radii.sm,
  },
  dayDetailText: {
    fontSize: 12,
    color: Palette.primaryNavy,
    fontWeight: '600',
  },
  leaveCard: {
    gap: 14,
  },
  leaveHistoryItem: {
    padding: 12,
    backgroundColor: Palette.background,
    borderRadius: Radii.md,
    gap: 6,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  leaveHistoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minWidth: 0,
  },
  leaveDateRange: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textDark,
    flex: 1,
    minWidth: 0,
  },
  leaveReason: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  leaveFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 6,
    marginTop: 2,
  },
  leaveMeta: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  leaveApprovedBy: {
    fontSize: 11,
    color: Palette.successGreen,
    fontWeight: '600',
  },
  feeCard: {
    gap: 12,
  },
  feeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    gap: 12,
  },
  feeLeft: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  feeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textDark,
    lineHeight: 19,
  },
  feeInvoice: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  feeRight: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
  },
  feeAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.primaryNavy,
  },
  actionSection: {
    gap: 12,
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
  staticField: {
    backgroundColor: Palette.background,
    padding: 12,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  staticFieldText: {
    fontSize: 14,
    color: Palette.textDark,
    fontWeight: '600',
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
});
