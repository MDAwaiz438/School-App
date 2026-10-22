export type Role = 'admin' | 'teacher' | 'parent' | 'student';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  grade: string;
  section: string;
  avatar: string;
  parentId: string;
  attendancePercentage: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  bloodGroup: string;
  dob: string;
  emergencyContact: string;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  studentIds: string[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  assignedClasses: string[];
  avatar: string;
  status: 'active' | 'on_leave';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'principal' | 'staff' | 'admin';
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  subject: string;
  room: string;
  teacherName: string;
  color?: string;
  isCurrent?: boolean;
  isNext?: boolean;
}

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface DailyAttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
}

export interface StudentRosterItem {
  id: string;
  rollNo: string;
  name: string;
  avatar: string;
  status: AttendanceStatus;
  attendancePercentage?: number;
  presentDays?: number;
  absentDays?: number;
  leaveDays?: number;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  approvedBy?: string;
  rejectionReason?: string;
  appliedBy?: 'student' | 'parent' | 'teacher';
}

export interface Homework {
  id: string;
  classId: string;
  className: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  teacherName: string;
  status: 'pending' | 'completed';
  completedDate?: string;
  attachments?: string[];
}

export interface SubjectScore {
  name: string;
  score: number;
  maxScore: number;
  grade: string;
  remarks?: string;
}

export interface ReportCard {
  id: string;
  term: 'Term 1' | 'Mid-Term' | 'Annual Examination';
  academicYear: string;
  studentId: string;
  subjects: SubjectScore[];
  totalScore: number;
  maxTotal: number;
  percentage: number;
  grade: string;
  rank: number;
  totalStudents: number;
  publishedDate: string;
  teacherRemarks: string;
}

export interface Achievement {
  id: string;
  studentId: string;
  title: string;
  event: string;
  result: string; // e.g. "1st Place", "Gold Medal", "Certificate of Merit"
  date: string;
  category: 'sports' | 'academics' | 'arts' | 'leadership';
  description: string;
  badgeIcon: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'normal' | 'important' | 'emergency';
  audience: ('all' | 'parents' | 'teachers' | 'students')[];
  authorName: string;
  pinned?: boolean;
  department?: string;
}

export interface ClassCommunityPost {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  className: string;
  timestamp: string;
  content: string;
  likes: number;
  commentsCount: number;
  allowReplies: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'academic' | 'attendance' | 'school' | 'fees' | 'emergency';
  read: boolean;
}

export interface FeeItem {
  id: string;
  studentId: string;
  title: string;
  term: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  invoiceNo: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  category: 'academic' | 'sports' | 'cultural' | 'holiday' | 'ptm' | 'workshop';
  date: string;
  time: string;
  venue: string;
  targetAudience: ('all' | 'students' | 'parents' | 'teachers')[];
  description: string;
  organizer: string;
  rsvpCount?: number;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher' | 'parent';
  category: string;
  subject: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  response?: string;
  reopenedAt?: string;
  reopenReason?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  content: string;
  timestamp: string;
  isSelf?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  subtitle: string;
  avatar?: string;
  type: 'direct' | 'group' | 'helpdesk';
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  allowedRoles: Role[];
}

export interface PopQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PopQuiz {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  className: string;
  questions: PopQuizQuestion[];
  createdAt: string;
  createdBy: string;
}

