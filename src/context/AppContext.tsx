import React, { createContext, useContext, useState } from 'react';
import {
  Announcement,
  DailyAttendanceRecord,
  Homework,
  LeaveRequest,
  Role,
  Student,
  StudentRosterItem,
} from '@/types';
import {
  MOCK_ANNOUNCEMENTS,
  MOCK_ATTENDANCE_CALENDAR,
  MOCK_HOMEWORK,
  MOCK_LEAVE_REQUESTS,
  MOCK_NOTIFICATIONS,
  MOCK_ROSTER_8A,
  MOCK_STUDENTS,
} from '@/data/mockData';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  isLoggedIn: boolean;
  login: (phone: string, otp: string) => boolean;
  logout: () => void;
  selectedStudent: Student;
  setSelectedStudentId: (id: string) => void;
  allStudents: Student[];
  leaveRequests: LeaveRequest[];
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('parent');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS[0].id);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [homeworkList, setHomeworkList] = useState<Homework[]>(MOCK_HOMEWORK);
  const [roster, setRoster] = useState<StudentRosterItem[]>(MOCK_ROSTER_8A);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [attendanceCalendar, setAttendanceCalendar] = useState<DailyAttendanceRecord[]>(MOCK_ATTENDANCE_CALENDAR);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const selectedStudent =
    MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0];

  const login = (phone: string, otp: string) => {
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `lr_${Date.now()}`,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setLeaveRequests((prev) => [newReq, ...prev]);

    // Add a notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Leave Request Submitted',
        message: `Request for ${req.studentName} (${req.startDate} to ${req.endDate}) is pending approval.`,
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

    // Notify parent
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

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isLoggedIn,
        login,
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
      }}>
      {children}
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
