import React, { createContext, useContext, useState } from 'react';
import {
  Announcement,
  ChatChannel,
  ChatMessage,
  DailyAttendanceRecord,
  Homework,
  LeaveRequest,
  PopQuiz,
  Role,
  SchoolEvent,
  Student,
  StudentRosterItem,
  SupportTicket,
} from '@/types';
import {
  MOCK_ANNOUNCEMENTS,
  MOCK_ATTENDANCE_CALENDAR,
  MOCK_CHAT_CHANNELS,
  MOCK_CHAT_MESSAGES,
  MOCK_EVENTS,
  MOCK_HOMEWORK,
  MOCK_LEAVE_REQUESTS,
  MOCK_NOTIFICATIONS,
  MOCK_POP_QUIZZES,
  MOCK_ROSTER_8A,
  MOCK_STUDENTS,
  MOCK_SUPPORT_TICKETS,
} from '@/data/mockData';
import {
  CustomAlertModal,
  CustomAlertConfig,
  AlertButton,
} from '@/components/common/CustomAlertModal';

export type { CustomAlertConfig, AlertButton };

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  isLoggedIn: boolean;
  login: (phone?: string, otp?: string) => boolean;
  loginWithRole: (targetRole: Role, credentials?: { identifier?: string; password?: string }) => void;
  logout: () => void;
  selectedStudent: Student;
  setSelectedStudentId: (id: string) => void;
  allStudents: Student[];
  leaveRequests: LeaveRequest[];
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'> & { initialStatus?: 'pending' | 'approved' }) => void;
  updateLeaveRequestStatus: (id: string, status: 'approved' | 'rejected') => void;
  homeworkList: Homework[];
  toggleHomeworkStatus: (id: string) => void;
  addHomework: (hw: Omit<Homework, 'id' | 'assignedDate' | 'status'>) => void;
  roster: StudentRosterItem[];
  updateStudentAttendance: (studentId: string, status: 'present' | 'absent' | 'leave') => void;
  markAllPresent: () => void;
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => void;
  attendanceCalendar: DailyAttendanceRecord[];
  notifications: typeof MOCK_NOTIFICATIONS;
  markAllNotificationsRead: () => void;
  showAlert: (config: CustomAlertConfig) => void;
  hideAlert: () => void;

  // New features: Events, Support, Chat, Pop Quizzes
  events: SchoolEvent[];
  createEvent: (event: Omit<SchoolEvent, 'id'>) => void;
  supportTickets: SupportTicket[];
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  resolveSupportTicket: (id: string, response: string) => void;
  reopenSupportTicket: (id: string, reason?: string) => void;
  chatChannels: ChatChannel[];
  createChatChannel: (channel: Omit<ChatChannel, 'id' | 'lastMessage' | 'lastMessageTime' | 'unreadCount'>) => string;
  chatMessages: ChatMessage[];
  sendChatMessage: (channelId: string, content: string) => void;
  isChatModalVisible: boolean;
  setIsChatModalVisible: (visible: boolean) => void;
  activeChatChannelId: string | null;
  setActiveChatChannelId: (id: string | null) => void;
  popQuizzes: PopQuiz[];
  createPopQuiz: (quiz: Omit<PopQuiz, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('admin');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS[0].id);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [homeworkList, setHomeworkList] = useState<Homework[]>(MOCK_HOMEWORK);
  const [roster, setRoster] = useState<StudentRosterItem[]>(MOCK_ROSTER_8A);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [attendanceCalendar] = useState<DailyAttendanceRecord[]>(MOCK_ATTENDANCE_CALENDAR);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [customAlert, setCustomAlert] = useState<CustomAlertConfig | null>(null);

  // New states
  const [events, setEvents] = useState<SchoolEvent[]>(MOCK_EVENTS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>(MOCK_CHAT_CHANNELS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [activeChatChannelId, setActiveChatChannelId] = useState<string | null>('chn_teacher_jenkins');
  const [popQuizzes, setPopQuizzes] = useState<PopQuiz[]>(MOCK_POP_QUIZZES);

  const showAlert = (config: CustomAlertConfig) => {
    setCustomAlert(config);
  };

  const hideAlert = () => {
    setCustomAlert(null);
  };

  const selectedStudent =
    MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0];

  const login = (phone?: string, otp?: string) => {
    setIsLoggedIn(true);
    return true;
  };

  const loginWithRole = (targetRole: Role, credentials?: { identifier?: string; password?: string }) => {
    setRole(targetRole);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'> & { initialStatus?: 'pending' | 'approved' }) => {
    const isApproved = req.initialStatus === 'approved';
    const newReq: LeaveRequest = {
      ...req,
      id: `lr_${Date.now()}`,
      appliedAt: new Date().toISOString().split('T')[0],
      status: isApproved ? 'approved' : 'pending',
      approvedBy: isApproved ? 'Mrs. Sarah Jenkins (Class Lead)' : undefined,
    };
    setLeaveRequests((prev) => [newReq, ...prev]);

    // Add a notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: isApproved ? 'Student Leave Recorded' : 'Leave Request Submitted',
        message: isApproved
          ? `Authorized leave for ${req.studentName} (${req.startDate} to ${req.endDate}) entered by teacher.`
          : `Request for ${req.studentName} (${req.startDate} to ${req.endDate}) is pending approval.`,
        timestamp: 'Just now',
        category: 'attendance',
        read: false,
      },
      ...prev,
    ]);
  };

  const updateLeaveRequestStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, approvedBy: 'Mrs. Sarah Jenkins' } : r))
    );

    // Notify parent & student
    const target = leaveRequests.find((r) => r.id === id);
    if (target) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: `Leave ${status === 'approved' ? 'Approved' : 'Declined'}`,
          message: `Leave for ${target.studentName} has been ${status} by class teacher.`,
          timestamp: 'Just now',
          category: 'attendance',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const toggleHomeworkStatus = (id: string) => {
    setHomeworkList((prev) =>
      prev.map((hw) => {
        if (hw.id === id) {
          const newStatus = hw.status === 'completed' ? 'pending' : 'completed';
          return {
            ...hw,
            status: newStatus,
            completedDate: newStatus === 'completed' ? 'Just now' : undefined,
          };
        }
        return hw;
      })
    );
  };

  const addHomework = (hw: Omit<Homework, 'id' | 'assignedDate' | 'status'>) => {
    const newHw: Homework = {
      ...hw,
      id: `hw_${Date.now()}`,
      assignedDate: 'Today',
      status: 'pending',
    };
    setHomeworkList((prev) => [newHw, ...prev]);
  };

  const updateStudentAttendance = (studentId: string, status: 'present' | 'absent' | 'leave') => {
    setRoster((prev) =>
      prev.map((item) => (item.id === studentId ? { ...item, status } : item))
    );
  };

  const markAllPresent = () => {
    setRoster((prev) => prev.map((item) => ({ ...item, status: 'present' })));
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann_${Date.now()}`,
      date: 'Just now',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const createEvent = (evt: Omit<SchoolEvent, 'id'>) => {
    const newEvt: SchoolEvent = {
      ...evt,
      id: `evt_${Date.now()}`,
      rsvpCount: 0,
    };
    setEvents((prev) => [newEvt, ...prev]);

    // Send broadcast notification for this event
    setNotifications((prev) => [
      {
        id: `notif_evt_${Date.now()}`,
        title: `New Event: ${evt.title}`,
        message: `${evt.date} • ${evt.time} at ${evt.venue}`,
        timestamp: 'Just now',
        category: 'school',
        read: false,
      },
      ...prev,
    ]);
  };

  const createSupportTicket = (
    ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'status'>
  ) => {
    const id = `tkt_${Date.now()}`;
    const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      ...ticket,
      id,
      ticketNumber,
      status: 'open',
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };
    setSupportTickets((prev) => [newTicket, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Support Ticket Raised',
        message: `Ticket #${ticketNumber} has been logged and assigned to helpdesk staff.`,
        timestamp: 'Just now',
        category: 'school',
        read: false,
      },
      ...prev,
    ]);
  };

  const resolveSupportTicket = (id: string, response: string) => {
    setSupportTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'resolved', response, updatedAt: 'Just now' } : t
      )
    );
  };

  const reopenSupportTicket = (id: string, reason?: string) => {
    setSupportTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'open',
              updatedAt: 'Just now',
              reopenedAt: 'Just now',
              reopenReason: reason || 'User requested further clarification / reopened ticket.',
            }
          : t
      )
    );

    const ticket = supportTickets.find((t) => t.id === id);
    if (ticket) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: `Ticket #${ticket.ticketNumber} Reopened`,
          message: reason || 'Ticket status changed back to Open for further review.',
          timestamp: 'Just now',
          category: 'school',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const sendChatMessage = (channelId: string, content: string) => {
    const senderRole = role === 'admin' ? 'admin' : role;
    const senderName =
      role === 'student'
        ? selectedStudent.name
        : role === 'teacher'
        ? 'Mrs. Sarah Jenkins'
        : role === 'parent'
        ? `${selectedStudent.name.split(' ')[0]}'s Guardian`
        : 'School Administration';

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      senderId: `usr_${Date.now()}`,
      senderName,
      senderRole,
      content,
      timestamp: 'Just now',
      isSelf: true,
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Update last message in channels
    setChatChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? { ...c, lastMessage: content, lastMessageTime: 'Just now' }
          : c
      )
    );

    // Realistic auto-reply simulation after 1.2s to make the chat feel alive and responsive!
    setTimeout(() => {
      let replyContent = "Thank you for reaching out! I've noted this down and will get back to you shortly.";
      let responderName = "Mrs. Sarah Jenkins";
      let responderRole: 'student' | 'teacher' | 'parent' | 'admin' = 'teacher';

      if (channelId === 'chn_school_admin') {
        replyContent = "Oakridge Helpdesk received your message. Our administrative desk is currently reviewing your query.";
        responderName = "Central Administration";
        responderRole = "admin";
      } else if (channelId === 'chn_class_8a') {
        replyContent = "Got it! Thanks for sharing with Grade 8-A group.";
        responderName = "Class Representative";
        responderRole = "student";
      }

      const autoReply: ChatMessage = {
        id: `reply_${Date.now()}`,
        channelId,
        senderId: 'bot_reply',
        senderName: responderName,
        senderRole: responderRole,
        content: replyContent,
        timestamp: 'Just now',
        isSelf: false,
      };

      setChatMessages((prev) => [...prev, autoReply]);
      setChatChannels((prev) =>
        prev.map((c) =>
          c.id === channelId
            ? { ...c, lastMessage: replyContent, lastMessageTime: 'Just now' }
            : c
        )
      );
    }, 1200);
  };

  const createChatChannel = (
    channel: Omit<ChatChannel, 'id' | 'lastMessage' | 'lastMessageTime' | 'unreadCount'>
  ) => {
    const newId = `chn_${Date.now()}`;
    const newChan: ChatChannel = {
      ...channel,
      id: newId,
      lastMessage: 'Conversation started',
      lastMessageTime: 'Just now',
      unreadCount: 0,
    };
    setChatChannels((prev) => [newChan, ...prev]);
    setActiveChatChannelId(newId);
    return newId;
  };

  const createPopQuiz = (quiz: Omit<PopQuiz, 'id' | 'createdAt'>) => {
    const newQuiz: PopQuiz = {
      ...quiz,
      id: `quiz_${Date.now()}`,
      createdAt: 'Just now',
    };
    setPopQuizzes((prev) => [newQuiz, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif_quiz_${Date.now()}`,
        title: `⚡ Live Pop Quiz: ${quiz.title}`,
        message: `${quiz.subject} • ${quiz.questions.length} Questions dispatched to ${quiz.className}.`,
        timestamp: 'Just now',
        category: 'academic',
        read: false,
      },
      ...prev,
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isLoggedIn,
        login,
        loginWithRole,
        logout,
        selectedStudent,
        setSelectedStudentId,
        allStudents: MOCK_STUDENTS,
        leaveRequests,
        submitLeaveRequest,
        updateLeaveRequestStatus,
        homeworkList,
        toggleHomeworkStatus,
        addHomework,
        roster,
        updateStudentAttendance,
        markAllPresent,
        announcements,
        addAnnouncement,
        attendanceCalendar,
        notifications,
        markAllNotificationsRead,
        showAlert,
        hideAlert,
        events,
        createEvent,
        supportTickets,
        createSupportTicket,
        resolveSupportTicket,
        reopenSupportTicket,
        chatChannels,
        createChatChannel,
        chatMessages,
        sendChatMessage,
        isChatModalVisible,
        setIsChatModalVisible,
        activeChatChannelId,
        setActiveChatChannelId,
        popQuizzes,
        createPopQuiz,
      }}>
      {children}
      <CustomAlertModal alert={customAlert} onClose={hideAlert} />
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
