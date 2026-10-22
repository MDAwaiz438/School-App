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
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/context/AppContext';
import { SupportTicket } from '@/types';
import { StudentLeaveView } from '@/components/student/StudentLeaveView';

interface SupportDeskViewProps {
  roleMode: 'student' | 'teacher';
}

const FAQS_STUDENT = [
  {
    q: 'How do I submit late assignments with medical reasons?',
    a: 'Apply for medical leave under your Leave Portal first. Once approved by your class teacher, submission deadlines are automatically extended by 48 hours without penalty.',
  },
  {
    q: 'Where do I collect my new RFID Student ID Card?',
    a: 'Student ID cards are distributed at Central IT Desk (Block A, Ground Floor, Room 102) between 10:00 AM and 03:00 PM.',
  },
  {
    q: 'How can I schedule a 1-on-1 session with the School Counselor?',
    a: 'Raise a ticket below under "Counseling & Wellbeing" or message directly through the school chat feature for private scheduling.',
  },
];

const FAQS_TEACHER = [
  {
    q: 'How do I report interactive smartboard or projector issues in classrooms?',
    a: 'Raise a High Priority ticket below selecting "Classroom Tech". On-campus IT dispatch responds within 15 minutes during school hours.',
  },
  {
    q: 'What is the procedure for requesting a substitute teacher?',
    a: 'Log your leave request at least 24 hours in advance in the Faculty Portal. The Academic Coordinator will auto-assign duty coverage.',
  },
  {
    q: 'How do I generate class-wide attendance report in Excel format?',
    a: 'Navigate to your Attendance tab or School Reports and click "Download Attendance (Excel)" with your selected grade filter.',
  },
];

export const SupportDeskView: React.FC<SupportDeskViewProps> = ({ roleMode }) => {
  const {
    supportTickets,
    createSupportTicket,
    resolveSupportTicket,
    reopenSupportTicket,
    selectedStudent,
    roster,
    leaveRequests,
    submitLeaveRequest,
    updateLeaveRequestStatus,
    showAlert,
    setIsChatModalVisible,
  } = useApp();

  // Top Sub-Tab Navigation: Support Tickets vs Leave Management
  const [activeSubTab, setActiveSubTab] = useState<'tickets' | 'leave'>('tickets');

  // Ticket filters & modals
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState(
    roleMode === 'student' ? 'Academic Help' : 'Classroom Tech'
  );
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('normal');
  const [ticketDesc, setTicketDesc] = useState('');

  // Reopening Ticket Modal state
  const [reopeningTicket, setReopeningTicket] = useState<SupportTicket | null>(null);
  const [reopenReasonText, setReopenReasonText] = useState('');

  // Resolving modal state (for teachers resolving student tickets)
  const [resolvingTicket, setResolvingTicket] = useState<SupportTicket | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Teacher Student Leave Management state
  const [teacherLeaveFilter, setTeacherLeaveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isTeacherApplyModalOpen, setIsTeacherApplyModalOpen] = useState(false);
  const [selectedStudentForLeave, setSelectedStudentForLeave] = useState(roster[0]?.id || 'std_01');
  const [teacherLeaveStart, setTeacherLeaveStart] = useState('2026-10-24');
  const [teacherLeaveEnd, setTeacherLeaveEnd] = useState('2026-10-25');
  const [teacherLeaveReason, setTeacherLeaveReason] = useState('');
  const [teacherLeaveType, setTeacherLeaveType] = useState('Medical / Doctor Visit');

  // Filter tickets based on roleMode
  const myTickets = supportTickets.filter((t) =>
    roleMode === 'student' ? t.senderRole === 'student' : true
  );

  const filteredTickets = myTickets.filter((t) => {
    if (ticketStatusFilter === 'all') return true;
    return t.status === ticketStatusFilter;
  });

  const categories =
    roleMode === 'student'
      ? ['Academic Help', 'IT & SmartCard', 'Library', 'Transport & Bus', 'Counseling', 'Fees']
      : ['Classroom Tech', 'Stationery & Supplies', 'Facility Maintenance', 'Substitute Coverage', 'HR & Payroll'];

  const faqs = roleMode === 'student' ? FAQS_STUDENT : FAQS_TEACHER;

  const handleCreateTicket = () => {
    if (!ticketSubject.trim() || !ticketDesc.trim()) {
      showAlert({
        title: 'Required Information',
        message: 'Please provide both a ticket subject and description.',
        type: 'warning',
      });
      return;
    }

    createSupportTicket({
      senderId: roleMode === 'student' ? selectedStudent.id : 'tch_01',
      senderName: roleMode === 'student' ? selectedStudent.name : 'Mrs. Sarah Jenkins',
      senderRole: roleMode,
      category: ticketCategory,
      subject: ticketSubject.trim(),
      description: ticketDesc.trim(),
      priority: ticketPriority,
    });

    setIsModalOpen(false);
    setTicketSubject('');
    setTicketDesc('');
    showAlert({
      title: 'Ticket Submitted 🎉',
      message: 'Your help request has been routed to institutional support. You will receive real-time updates.',
      type: 'success',
      icon: 'checkmark-circle',
    });
  };

  const handleResolveTicket = () => {
    if (!resolvingTicket) return;
    if (!resolutionText.trim()) {
      showAlert({
        title: 'Response Required',
        message: 'Please enter a resolution note or response for the student.',
        type: 'warning',
      });
      return;
    }

    resolveSupportTicket(resolvingTicket.id, resolutionText.trim());
    setResolvingTicket(null);
    setResolutionText('');
    showAlert({
      title: 'Ticket Resolved',
      message: 'Resolution update dispatched to student.',
      type: 'success',
      icon: 'checkmark-circle',
    });
  };

  const handleConfirmReopen = () => {
    if (!reopeningTicket) return;
    reopenSupportTicket(reopeningTicket.id, reopenReasonText.trim());
    const ticketNum = reopeningTicket.ticketNumber;
    setReopeningTicket(null);
    setReopenReasonText('');
    showAlert({
      title: 'Ticket Reopened',
      message: `Ticket #${ticketNum} status is now Open again for priority team review.`,
      type: 'info',
      icon: 'refresh-circle',
    });
  };

  const handleTeacherApplyOnBehalf = () => {
    const student = roster.find((s) => s.id === selectedStudentForLeave) || roster[0];
    if (!teacherLeaveReason.trim()) {
      showAlert({
        title: 'Reason Required',
        message: 'Please provide the reason for the student leave.',
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
      reason: `[${teacherLeaveType}] ${teacherLeaveReason.trim()} (Applied by Class Teacher)`,
      appliedBy: 'teacher',
      initialStatus: 'approved',
    });

    setIsTeacherApplyModalOpen(false);
    setTeacherLeaveReason('');
    showAlert({
      title: 'Student Leave Recorded',
      message: `Authorized leave for ${student.name} (${teacherLeaveStart} to ${teacherLeaveEnd}) successfully logged and approved.`,
      type: 'success',
      icon: 'checkmark-circle',
    });
  };

  // Filtered leaves for teacher
  const filteredTeacherLeaves = leaveRequests.filter((l) => {
    if (teacherLeaveFilter === 'all') return true;
    return l.status === teacherLeaveFilter;
  });

  return (
    <View style={styles.container}>
      {/* SUB-TAB NAVIGATOR: TICKETS VS LEAVE */}
      <View style={styles.subTabNavRow}>
        <TouchableOpacity
          style={[styles.subTabBtn, activeSubTab === 'tickets' && styles.subTabBtnActive]}
          activeOpacity={0.8}
          onPress={() => setActiveSubTab('tickets')}>
          <Ionicons
            name="ticket"
            size={16}
            color={activeSubTab === 'tickets' ? '#FFFFFF' : '#4F46E5'}
          />
          <Text style={[styles.subTabText, activeSubTab === 'tickets' && styles.subTabTextActive]}>
            Support Tickets ({myTickets.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabBtn, activeSubTab === 'leave' && styles.subTabBtnActive]}
          activeOpacity={0.8}
          onPress={() => setActiveSubTab('leave')}>
          <Ionicons
            name="calendar"
            size={16}
            color={activeSubTab === 'leave' ? '#FFFFFF' : '#4F46E5'}
          />
          <Text style={[styles.subTabText, activeSubTab === 'leave' && styles.subTabTextActive]}>
            Leave Management
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECTION 1: SUPPORT TICKETS */}
      {activeSubTab === 'tickets' && (
        <>
          {/* HERO BANNER */}
          <LinearGradient
            colors={['#1E1B4B', '#312E81']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}>
            <View style={styles.heroRow}>
              <View style={styles.heroTextCol}>
                <View style={styles.heroTag}>
                  <Ionicons name="help-buoy" size={14} color="#A5B4FC" />
                  <Text style={styles.heroTagText}>
                    {roleMode === 'student' ? 'STUDENT HELPDESK' : 'FACULTY COMMAND SUPPORT'}
                  </Text>
                </View>
                <Text style={styles.heroTitle}>
                  {roleMode === 'student' ? 'How can we assist you today?' : 'Faculty & Classroom Helpdesk'}
                </Text>
                <Text style={styles.heroSubtitle}>
                  {roleMode === 'student'
                    ? 'Get academic guidance, resolve card/IT bugs, or connect with counseling.'
                    : 'Report classroom tech issues, facility requests, and manage student queries.'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.raiseBtn}
                onPress={() => setIsModalOpen(true)}
                activeOpacity={0.85}>
                <Ionicons name="add-circle" size={18} color="#4F46E5" />
                <Text style={styles.raiseBtnText}>Raise Ticket</Text>
              </TouchableOpacity>
            </View>

            {/* QUICK STATS PILLS */}
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatNumber}>{myTickets.length}</Text>
                <Text style={styles.heroStatLabel}>Total Tickets</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={[styles.heroStatNumber, { color: '#FCD34D' }]}>
                  {myTickets.filter((t) => t.status === 'open').length}
                </Text>
                <Text style={styles.heroStatLabel}>Open</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={[styles.heroStatNumber, { color: '#60A5FA' }]}>
                  {myTickets.filter((t) => t.status === 'in_progress').length}
                </Text>
                <Text style={styles.heroStatLabel}>In Progress</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={[styles.heroStatNumber, { color: '#6EE7B7' }]}>
                  {myTickets.filter((t) => t.status === 'resolved').length}
                </Text>
                <Text style={styles.heroStatLabel}>Resolved</Text>
              </View>
            </View>
          </LinearGradient>

          {/* QUICK CHAT SHORTCUT BANNER */}
          <TouchableOpacity
            style={styles.chatShortcutCard}
            onPress={() => setIsChatModalVisible(true)}
            activeOpacity={0.8}>
            <View style={styles.chatShortcutLeft}>
              <View style={styles.chatShortcutIcon}>
                <Ionicons name="chatbubbles" size={22} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.chatShortcutTitle}>Live School Chat Feature</Text>
                <Text style={styles.chatShortcutSub}>Zoho-style instant messaging with teachers, students & admin</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* STATUS FILTER PILLS */}
          <View style={styles.ticketFilterRow}>
            {(['all', 'open', 'in_progress', 'resolved'] as const).map((st) => {
              const isActive = ticketStatusFilter === st;
              const count =
                st === 'all'
                  ? myTickets.length
                  : myTickets.filter((t) => t.status === st).length;
              const label =
                st === 'all'
                  ? 'All'
                  : st === 'open'
                  ? 'Open'
                  : st === 'in_progress'
                  ? 'In Progress'
                  : 'Resolved';
              return (
                <TouchableOpacity
                  key={st}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setTicketStatusFilter(st)}
                  activeOpacity={0.75}>
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {label} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ACTIVE TICKETS LIST */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Support History & Active Tickets</Text>
              <Text style={styles.sectionCount}>{filteredTickets.length} Displayed</Text>
            </View>

            {filteredTickets.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="checkmark-done-circle-outline" size={44} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No tickets found in this view</Text>
                <Text style={styles.emptySub}>Raise a support ticket whenever you encounter any issue.</Text>
              </View>
            ) : (
              <View style={styles.ticketsList}>
                {filteredTickets.map((t) => {
                  const isOpen = t.status === 'open';
                  const isResolved = t.status === 'resolved';

                  return (
                    <View key={t.id} style={styles.ticketCard}>
                      <View style={styles.ticketHeader}>
                        <View style={styles.ticketTagRow}>
                          <View style={styles.ticketNumBadge}>
                            <Text style={styles.ticketNumText}>{t.ticketNumber}</Text>
                          </View>
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{t.category}</Text>
                          </View>
                          {t.priority === 'high' && (
                            <View style={styles.urgentBadge}>
                              <Text style={styles.urgentBadgeText}>URGENT</Text>
                            </View>
                          )}
                        </View>

                        <View
                          style={[
                            styles.statusPill,
                            isResolved
                              ? styles.statusPillResolved
                              : isOpen
                              ? styles.statusPillOpen
                              : styles.statusPillProgress,
                          ]}>
                          <View
                            style={[
                              styles.statusDot,
                              isResolved
                                ? { backgroundColor: '#10B981' }
                                : isOpen
                                ? { backgroundColor: '#EF4444' }
                                : { backgroundColor: '#F59E0B' },
                            ]}
                          />
                          <Text
                            style={[
                              styles.statusText,
                              isResolved
                                ? { color: '#065F46' }
                                : isOpen
                                ? { color: '#991B1B' }
                                : { color: '#92400E' },
                            ]}>
                            {isResolved ? 'Resolved' : isOpen ? 'Open' : 'In Progress'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.ticketSubject}>{t.subject}</Text>
                      <Text style={styles.ticketDesc}>{t.description}</Text>

                      <View style={styles.ticketMetaRow}>
                        <Text style={styles.ticketMetaText}>
                          By {t.senderName} • {t.createdAt}
                        </Text>

                        {/* REOPEN RESOLVED TICKET BUTTON */}
                        {isResolved && (
                          <TouchableOpacity
                            style={styles.reopenBtn}
                            activeOpacity={0.8}
                            onPress={() => {
                              setReopeningTicket(t);
                              setReopenReasonText('');
                            }}>
                            <Ionicons name="refresh-circle" size={16} color="#4F46E5" />
                            <Text style={styles.reopenBtnText}>Reopen Ticket</Text>
                          </TouchableOpacity>
                        )}

                        {/* Teacher can resolve student tickets */}
                        {roleMode === 'teacher' && !isResolved && (
                          <TouchableOpacity
                            style={styles.resolveBtn}
                            onPress={() => setResolvingTicket(t)}>
                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                            <Text style={styles.resolveBtnText}>Respond / Resolve</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Resolution Response Box */}
                      {t.response && (
                        <View style={styles.resolutionBox}>
                          <View style={styles.resolutionHeader}>
                            <Ionicons name="chatbubble-ellipses" size={14} color="#059669" />
                            <Text style={styles.resolutionTitle}>Institutional Response:</Text>
                          </View>
                          <Text style={styles.resolutionBody}>{t.response}</Text>
                          {t.reopenReason && (
                            <View style={styles.reopenNoteBox}>
                              <Text style={styles.reopenNoteTitle}>Reopen Note:</Text>
                              <Text style={styles.reopenNoteBody}>{t.reopenReason}</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* FREQUENTLY ASKED QUESTIONS */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions (FAQs)</Text>
            <View style={styles.faqsList}>
              {faqs.map((faq, idx) => (
                <View key={idx} style={styles.faqCard}>
                  <View style={styles.faqQuestionRow}>
                    <Ionicons name="help-circle" size={18} color="#4F46E5" />
                    <Text style={styles.faqQuestionText}>{faq.q}</Text>
                  </View>
                  <Text style={styles.faqAnswerText}>{faq.a}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* EMERGENCY CONTACTS */}
          <View style={[styles.sectionBlock, { marginBottom: 30 }]}>
            <Text style={styles.sectionTitle}>Emergency Campus Helplines</Text>
            <View style={styles.contactsGrid}>
              <View style={styles.contactCard}>
                <Ionicons name="medkit" size={20} color="#EF4444" />
                <Text style={styles.contactName}>Campus Health & Clinic</Text>
                <Text style={styles.contactPhone}>Ext. 104 • 24/7 Available</Text>
              </View>
              <View style={styles.contactCard}>
                <Ionicons name="shield" size={20} color="#3B82F6" />
                <Text style={styles.contactName}>Campus Safety & Security</Text>
                <Text style={styles.contactPhone}>Ext. 100 • Main Gate</Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* SECTION 2: LEAVE MANAGEMENT */}
      {activeSubTab === 'leave' && (
        <View style={styles.leaveSectionContainer}>
          {roleMode === 'student' ? (
            /* Student Leave View */
            <StudentLeaveView />
          ) : (
            /* Teacher Student Leave Management View */
            <View style={styles.teacherLeaveContainer}>
              {/* Teacher Leave Header Card */}
              <View style={styles.teacherLeaveHeaderCard}>
                <View style={styles.teacherLeaveHeaderLeft}>
                  <Text style={styles.teacherLeaveMainTitle}>Grade 8-A Student Leave Management</Text>
                  <Text style={styles.teacherLeaveMainSub}>
                    Review absence applications, apply on student behalf & verify excused leaves
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.teacherApplyBtn}
                  activeOpacity={0.85}
                  onPress={() => setIsTeacherApplyModalOpen(true)}>
                  <Ionicons name="person-add" size={16} color="#FFFFFF" />
                  <Text style={styles.teacherApplyBtnText}>Apply on Behalf</Text>
                </TouchableOpacity>
              </View>

              {/* SEPARATE APPROVED LEAVE DISPLAY CALLOUT (Requirement 3) */}
              <View style={styles.excusedLeaveCallout}>
                <View style={styles.excusedIconBox}>
                  <Ionicons name="information-circle" size={22} color="#0284C7" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.excusedTitle}>Approved Leave vs Regular Attendance</Text>
                  <Text style={styles.excusedDesc}>
                    Authorized student leaves are formally tracked as excused absences under official school policy. They are displayed separately from daily attendance roll calls and do not penalize term examination eligibility.
                  </Text>
                </View>
              </View>

              {/* FILTER PILLS */}
              <View style={styles.ticketFilterRow}>
                {(['all', 'pending', 'approved', 'rejected'] as const).map((flt) => {
                  const isActive = teacherLeaveFilter === flt;
                  const count =
                    flt === 'all'
                      ? leaveRequests.length
                      : leaveRequests.filter((l) => l.status === flt).length;
                  const label =
                    flt === 'all'
                      ? 'All'
                      : flt === 'pending'
                      ? 'Pending Approval'
                      : flt === 'approved'
                      ? 'Approved History'
                      : 'Declined';

                  return (
                    <TouchableOpacity
                      key={flt}
                      style={[styles.filterChip, isActive && styles.filterChipActive]}
                      onPress={() => setTeacherLeaveFilter(flt)}
                      activeOpacity={0.75}>
                      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                        {label} ({count})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* LEAVE APPLICATIONS STACK */}
              <View style={styles.leavesList}>
                {filteredTeacherLeaves.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Ionicons name="calendar-outline" size={44} color="#94A3B8" />
                    <Text style={styles.emptyTitle}>No leave applications in this view</Text>
                    <Text style={styles.emptySub}>Applications submitted by parents or teachers will appear here.</Text>
                  </View>
                ) : (
                  filteredTeacherLeaves.map((leave) => {
                    const isPending = leave.status === 'pending';
                    const isApproved = leave.status === 'approved';

                    return (
                      <View key={leave.id} style={styles.teacherLeaveCard}>
                        <View style={styles.teacherLeaveTop}>
                          <View>
                            <View style={styles.studentNameTagRow}>
                              <Text style={styles.teacherLeaveStudent}>{leave.studentName}</Text>
                              <View style={styles.classPill}>
                                <Text style={styles.classPillText}>{leave.grade}-{leave.section}</Text>
                              </View>
                            </View>
                            <Text style={styles.teacherLeaveDates}>
                              📅 {leave.startDate} to {leave.endDate}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.leaveStatusPill,
                              isApproved
                                ? styles.leaveApproved
                                : isPending
                                ? styles.leavePending
                                : styles.leaveRejected,
                            ]}>
                            <Text style={styles.leaveStatusText}>
                              {leave.status.toUpperCase()}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.teacherLeaveReason}>{`"${leave.reason}"`}</Text>

                        <View style={styles.teacherLeaveFooter}>
                          <Text style={styles.appliedAtText}>
                            Applied: {leave.appliedAt} {leave.approvedBy ? `• Approved by ${leave.approvedBy}` : ''}
                          </Text>

                          {isPending && (
                            <View style={styles.decisionBtnsRow}>
                              <TouchableOpacity
                                style={styles.authBtn}
                                activeOpacity={0.8}
                                onPress={() => updateLeaveRequestStatus(leave.id, 'approved')}>
                                <Ionicons name="checkmark-circle" size={15} color="#FFFFFF" />
                                <Text style={styles.authBtnText}>Authorize</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.declineBtn}
                                activeOpacity={0.8}
                                onPress={() => updateLeaveRequestStatus(leave.id, 'rejected')}>
                                <Ionicons name="close-circle" size={15} color="#EF4444" />
                                <Text style={styles.declineBtnText}>Decline</Text>
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
        </View>
      )}

      {/* MODAL: TEACHER APPLY LEAVE ON STUDENT BEHALF (Requirement 3) */}
      <Modal visible={isTeacherApplyModalOpen} animationType="slide" onRequestClose={() => setIsTeacherApplyModalOpen(false)}>
        <View style={styles.modalScreen}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Apply Leave on Student’s Behalf</Text>
              <Text style={styles.modalSub}>Select a student from Grade 8-A and log authorized absence</Text>
            </View>
            <TouchableOpacity onPress={() => setIsTeacherApplyModalOpen(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#475569" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
            {/* SELECT STUDENT */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Student *</Text>
              <View style={styles.studentPickerWrap}>
                {roster.map((s) => {
                  const isSelected = selectedStudentForLeave === s.id;
                  return (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.studentPickerChip, isSelected && styles.studentPickerChipActive]}
                      onPress={() => setSelectedStudentForLeave(s.id)}>
                      <Text style={[styles.studentPickerChipText, isSelected && styles.studentPickerChipTextActive]}>
                        #{s.rollNo} {s.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* LEAVE TYPE */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Absence Category</Text>
              <View style={styles.catWrap}>
                {['Medical / Doctor Visit', 'Family Function', 'Interschool Competition', 'Personal Emergency'].map((tp) => {
                  const isSelected = teacherLeaveType === tp;
                  return (
                    <TouchableOpacity
                      key={tp}
                      style={[styles.catChip, isSelected && styles.catChipActive]}
                      onPress={() => setTeacherLeaveType(tp)}>
                      <Text style={[styles.catText, isSelected && styles.catTextActive]}>{tp}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* DATES */}
            <View style={styles.datesRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.textInput}
                  value={teacherLeaveStart}
                  onChangeText={setTeacherLeaveStart}
                  placeholder="2026-10-24"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>End Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.textInput}
                  value={teacherLeaveEnd}
                  onChangeText={setTeacherLeaveEnd}
                  placeholder="2026-10-25"
                />
              </View>
            </View>

            {/* REASON */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reason / Guardian Communication Note *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="e.g. Guardian phoned morning desk regarding acute fever..."
                placeholderTextColor="#94A3B8"
                value={teacherLeaveReason}
                onChangeText={setTeacherLeaveReason}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleTeacherApplyOnBehalf} activeOpacity={0.85}>
              <Ionicons name="checkmark-done" size={17} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Submit & Auto-Authorize Leave</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* CREATE TICKET MODAL */}
      <Modal visible={isModalOpen} animationType="slide" onRequestClose={() => setIsModalOpen(false)}>
        <View style={styles.modalScreen}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Submit Support Request</Text>
              <Text style={styles.modalSub}>Our administrative & faculty desks review tickets within 24h</Text>
            </View>
            <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#475569" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
            {/* CATEGORY */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.catWrap}>
                {categories.map((c) => {
                  const isSelected = ticketCategory === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[styles.catChip, isSelected && styles.catChipActive]}
                      onPress={() => setTicketCategory(c)}>
                      <Text style={[styles.catText, isSelected && styles.catTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* PRIORITY */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Urgency</Text>
              <View style={styles.priorityRow}>
                <TouchableOpacity
                  style={[styles.priorityChip, ticketPriority === 'normal' && styles.priorityChipNormal]}
                  onPress={() => setTicketPriority('normal')}>
                  <Text style={[styles.priorityText, ticketPriority === 'normal' && styles.priorityTextActive]}>
                    Standard / Normal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.priorityChip, ticketPriority === 'high' && styles.priorityChipUrgent]}
                  onPress={() => setTicketPriority('high')}>
                  <Ionicons name="warning" size={14} color={ticketPriority === 'high' ? '#EF4444' : '#64748B'} />
                  <Text style={[styles.priorityText, ticketPriority === 'high' && { color: '#EF4444', fontWeight: '800' }]}>
                    Urgent / High
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* SUBJECT */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subject Summary *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Brief summary of the issue or inquiry"
                placeholderTextColor="#94A3B8"
                value={ticketSubject}
                onChangeText={setTicketSubject}
              />
            </View>

            {/* DESCRIPTION */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Detailed Description *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Provide room numbers, error codes, dates or context..."
                placeholderTextColor="#94A3B8"
                value={ticketDesc}
                onChangeText={setTicketDesc}
                multiline
                numberOfLines={5}
              />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreateTicket} activeOpacity={0.85}>
              <Ionicons name="send" size={16} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Submit Support Ticket</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* RESOLVE TICKET MODAL */}
      <Modal visible={!!resolvingTicket} animationType="fade" transparent onRequestClose={() => setResolvingTicket(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.resolveDialog}>
            <Text style={styles.resolveDialogTitle}>Respond to Ticket</Text>
            <Text style={styles.resolveDialogSub}>
              {`${resolvingTicket?.senderName}: "${resolvingTicket?.subject}"`}
            </Text>

            <TextInput
              style={[styles.textInput, styles.textArea, { marginTop: 12 }]}
              placeholder="Type your resolution, guidance, or next steps..."
              placeholderTextColor="#94A3B8"
              value={resolutionText}
              onChangeText={setResolutionText}
              multiline
              numberOfLines={4}
            />

            <View style={styles.dialogActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setResolvingTicket(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmBtn} onPress={handleResolveTicket}>
                <Text style={styles.confirmBtnText}>Resolve & Notify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* REOPEN TICKET MODAL (Requirement 2) */}
      <Modal visible={!!reopeningTicket} animationType="fade" transparent onRequestClose={() => setReopeningTicket(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.resolveDialog}>
            <View style={styles.reopenHeaderRow}>
              <Ionicons name="refresh-circle" size={24} color="#4F46E5" />
              <View style={{ flex: 1 }}>
                <Text style={styles.resolveDialogTitle}>Reopen Support Ticket</Text>
                <Text style={styles.resolveDialogSub}>
                  Ticket #{reopeningTicket?.ticketNumber} • {reopeningTicket?.subject}
                </Text>
              </View>
            </View>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>
              Reason for Reopening:
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { marginTop: 6 }]}
              placeholder="Explain why this ticket is being reopened (e.g. issue recurs, need follow-up)..."
              placeholderTextColor="#94A3B8"
              value={reopenReasonText}
              onChangeText={setReopenReasonText}
              multiline
              numberOfLines={4}
            />

            <View style={styles.dialogActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setReopeningTicket(null)}>
                <Text style={styles.cancelBtnText}>Keep Resolved</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: '#4F46E5' }]} onPress={handleConfirmReopen}>
                <Text style={styles.confirmBtnText}>Confirm Reopen</Text>
              </TouchableOpacity>
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
  },
  subTabNavRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  subTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  subTabBtnActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  subTabTextActive: {
    color: '#FFFFFF',
  },
  ticketFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  heroBanner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  heroTextCol: {
    flex: 1,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  heroTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C7D2FE',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  raiseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  raiseBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: 11,
    color: '#A5B4FC',
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  chatShortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  chatShortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  chatShortcutIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatShortcutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  chatShortcutSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionCount: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  ticketsList: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticketTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  ticketNumBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ticketNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  urgentBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillOpen: {
    backgroundColor: '#FEF2F2',
  },
  statusPillProgress: {
    backgroundColor: '#FEF3C7',
  },
  statusPillResolved: {
    backgroundColor: '#ECFDF5',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  ticketSubject: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  ticketDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  ticketMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  ticketMetaText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  reopenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  reopenBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  resolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  resolveBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resolutionBox: {
    marginTop: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 10,
  },
  resolutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  resolutionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  resolutionBody: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 16,
  },
  reopenNoteBox: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
  },
  reopenNoteTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  reopenNoteBody: {
    fontSize: 11,
    color: '#3730A3',
  },
  faqsList: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  faqQuestionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  faqAnswerText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    paddingLeft: 26,
  },
  contactsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 6,
  },
  contactPhone: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  // LEAVE SECTION STYLES
  leaveSectionContainer: {
    flex: 1,
  },
  teacherLeaveContainer: {
    gap: 14,
  },
  teacherLeaveHeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teacherLeaveHeaderLeft: {
    flex: 1,
    marginRight: 10,
  },
  teacherLeaveMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  teacherLeaveMainSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  teacherApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  teacherApplyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  excusedLeaveCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: 14,
    padding: 14,
  },
  excusedIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  excusedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 2,
  },
  excusedDesc: {
    fontSize: 11,
    color: '#0284C7',
    lineHeight: 16,
  },
  leavesList: {
    gap: 10,
  },
  teacherLeaveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teacherLeaveTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  studentNameTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teacherLeaveStudent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  classPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  classPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  teacherLeaveDates: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 2,
  },
  leaveStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  leaveApproved: {
    backgroundColor: '#D1FAE5',
  },
  leavePending: {
    backgroundColor: '#FEF3C7',
  },
  leaveRejected: {
    backgroundColor: '#FEE2E2',
  },
  leaveStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
  },
  teacherLeaveReason: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 17,
    marginBottom: 10,
  },
  teacherLeaveFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    flexWrap: 'wrap',
    gap: 8,
  },
  appliedAtText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  decisionBtnsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  authBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  declineBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },

  // MODAL STYLES
  modalScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
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
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  catWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  catText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  catTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  studentPickerWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  studentPickerChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  studentPickerChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  studentPickerChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  studentPickerChipTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  priorityChipNormal: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  priorityChipUrgent: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  priorityTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resolveDialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 480,
  },
  reopenHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resolveDialogTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  resolveDialogSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#10B981',
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
