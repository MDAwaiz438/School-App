import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';

export const StudentLeaveView: React.FC = () => {
  const { leaveRequests, submitLeaveRequest, selectedStudent, showAlert } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Modal form state
  const [startDate, setStartDate] = useState('2026-10-24');
  const [endDate, setEndDate] = useState('2026-10-25');
  const [leaveType, setLeaveType] = useState<'Medical / Sick' | 'Family Function' | 'Emergency' | 'Academic Event'>('Medical / Sick');
  const [reason, setReason] = useState('');
  const [hasCertificate, setHasCertificate] = useState(false);

  // Student's leave requests
  const studentLeaves = leaveRequests.filter(
    (l) => l.studentId === selectedStudent.id || l.studentName.toLowerCase().includes(selectedStudent.name.toLowerCase().split(' ')[0])
  );

  const filteredLeaves = studentLeaves.filter((l) => {
    if (filter === 'all') return true;
    return l.status === filter;
  });

  const totalLeavesUsed = studentLeaves.filter((l) => l.status === 'approved').length * 2 || 3;
  const pendingCount = studentLeaves.filter((l) => l.status === 'pending').length;

  const handleApply = () => {
    if (!reason.trim()) {
      showAlert({
        title: 'Reason Required',
        message: 'Please explain the reason for your absence.',
        type: 'warning',
      });
      return;
    }

    submitLeaveRequest({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      grade: selectedStudent.grade || '8',
      section: selectedStudent.section || 'A',
      startDate,
      endDate,
      reason: `[${leaveType}] ${reason.trim()}${hasCertificate ? ' (Medical Note Attached)' : ''}`,
    });

    setIsApplyModalOpen(false);
    setReason('');
    setHasCertificate(false);

    showAlert({
      title: 'Leave Application Filed! 📝',
      message: `Your request for ${startDate} to ${endDate} has been forwarded to your class teacher (Mrs. Sarah Jenkins) for authorization.`,
      type: 'success',
      icon: 'checkmark-circle',
    });
  };

  return (
    <View style={styles.container}>
      {/* LEAVE STATS SUMMARY */}
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <View>
            <Text style={styles.statsTitle}>Annual Leave Balance</Text>
            <Text style={styles.statsSubtitle}>Academic Session 2026–2027</Text>
          </View>
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => setIsApplyModalOpen(true)}
            activeOpacity={0.85}>
            <Ionicons name="add-circle" size={17} color="#FFFFFF" />
            <Text style={styles.applyBtnText}>Apply for Leave</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Total Quota</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#059669' }]}>
              {15 - totalLeavesUsed}
            </Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#D97706' }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#DC2626' }]}>{totalLeavesUsed}</Text>
            <Text style={styles.statLabel}>Used Days</Text>
          </View>
        </View>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterRow}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => {
          const isActive = filter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setFilter(tab)}>
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* LEAVE REQUESTS LIST */}
      <View style={styles.listContainer}>
        {filteredLeaves.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={38} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No leave records in this category</Text>
            <Text style={styles.emptySub}>
              {'Tap "Apply for Leave" above whenever you need absence authorization.'}
            </Text>
          </View>
        ) : (
          filteredLeaves.map((item) => {
            const isApproved = item.status === 'approved';
            const isPending = item.status === 'pending';
            const isRejected = item.status === 'rejected';

            return (
              <View key={item.id} style={styles.leaveCard}>
                <View style={styles.leaveCardTop}>
                  <View style={styles.dateBadge}>
                    <Ionicons name="calendar" size={14} color="#4F46E5" />
                    <Text style={styles.dateBadgeText}>
                      {item.startDate} {item.endDate !== item.startDate ? `to ${item.endDate}` : ''}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      isApproved
                        ? styles.pillApproved
                        : isPending
                        ? styles.pillPending
                        : styles.pillRejected,
                    ]}>
                    <Ionicons
                      name={
                        isApproved
                          ? 'checkmark-circle'
                          : isPending
                          ? 'time'
                          : 'close-circle'
                      }
                      size={13}
                      color={
                        isApproved ? '#059669' : isPending ? '#D97706' : '#DC2626'
                      }
                    />
                    <Text
                      style={[
                        styles.statusPillText,
                        isApproved
                          ? { color: '#065F46' }
                          : isPending
                          ? { color: '#92400E' }
                          : { color: '#991B1B' },
                      ]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.reasonText}>{item.reason}</Text>

                <View style={styles.leaveCardFooter}>
                  <Text style={styles.appliedAtText}>Applied on {item.appliedAt}</Text>
                  {isApproved && (
                    <Text style={styles.approverText}>
                      Verified by {item.approvedBy || 'Mrs. Sarah Jenkins'}
                    </Text>
                  )}
                  {isPending && (
                    <Text style={styles.pendingText}>Awaiting Class Teacher Approval</Text>
                  )}
                  {isRejected && (
                    <Text style={styles.rejectedText}>
                      {item.rejectionReason || 'Declined due to exams'}
                    </Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* APPLY LEAVE MODAL */}
      <Modal
        visible={isApplyModalOpen}
        animationType="slide"
        onRequestClose={() => setIsApplyModalOpen(false)}>
        <View style={styles.modalScreen}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Apply for Absence Leave</Text>
              <Text style={styles.modalSub}>
                Formal submission to homeroom teacher & attendance register
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsApplyModalOpen(false)}
              style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#475569" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
            {/* LEAVE TYPE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Leave Reason Category</Text>
              <View style={styles.chipsWrap}>
                {(['Medical / Sick', 'Family Function', 'Emergency', 'Academic Event'] as const).map(
                  (type) => {
                    const isSelected = leaveType === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.typeChip, isSelected && styles.typeChipActive]}
                        onPress={() => setLeaveType(type)}>
                        <Text
                          style={[
                            styles.typeChipText,
                            isSelected && styles.typeChipTextActive,
                          ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
            </View>

            {/* DATES */}
            <View style={styles.datesRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>From Date</Text>
                <View style={styles.dateInputBox}>
                  <Ionicons name="calendar-outline" size={16} color="#64748B" />
                  <TextInput
                    style={styles.dateInput}
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>To Date</Text>
                <View style={styles.dateInputBox}>
                  <Ionicons name="calendar-outline" size={16} color="#64748B" />
                  <TextInput
                    style={styles.dateInput}
                    value={endDate}
                    onChangeText={setEndDate}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </View>
            </View>

            {/* REASON DESCRIPTION */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Detailed Explanation *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="State the reason for absence, doctor recommendation, or family circumstances..."
                placeholderTextColor="#94A3B8"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* MEDICAL CERTIFICATE TOGGLE */}
            <TouchableOpacity
              style={styles.certCheckRow}
              activeOpacity={0.7}
              onPress={() => setHasCertificate(!hasCertificate)}>
              <View style={[styles.checkbox, hasCertificate && styles.checkboxChecked]}>
                {hasCertificate && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
              </View>
              <Text style={styles.certText}>
                {"I have a doctor's certificate / medical prescription slip"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleApply} activeOpacity={0.85}>
              <Ionicons name="paper-plane" size={17} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Submit Leave Request</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statsSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  leaveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  leaveCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillApproved: {
    backgroundColor: '#ECFDF5',
  },
  pillPending: {
    backgroundColor: '#FFFBEB',
  },
  pillRejected: {
    backgroundColor: '#FEF2F2',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  reasonText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
    fontWeight: '500',
  },
  leaveCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  appliedAtText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  approverText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  rejectedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  modalScreen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  typeChipActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  typeChipTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  datesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
    height: 48,
  },
  dateInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  certCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  certText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
