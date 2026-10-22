import {
  Achievement,
  Announcement,
  AppNotification,
  ChatChannel,
  ChatMessage,
  ClassCommunityPost,
  DailyAttendanceRecord,
  FeeItem,
  Homework,
  LeaveRequest,
  Parent,
  PopQuiz,
  ReportCard,
  SchoolEvent,
  Student,
  StudentRosterItem,
  SupportTicket,
  Teacher,
  TimetableSlot,
} from '@/types';

export const MOCK_SCHOOL = {
  id: 'sch_01',
  name: 'Oakridge International Academy',
  tagline: 'Inspiring Excellence • Fostering Character',
  academicYear: '2026 – 2027',
  code: 'OIA-9042',
  principal: 'Dr. Arthur Sterling',
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'std_01',
    name: 'Arjun Kumar',
    rollNo: '14',
    grade: 'Grade 5',
    section: 'Section A',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
    parentId: 'par_01',
    attendancePercentage: 92,
    presentDays: 18,
    absentDays: 1,
    leaveDays: 1,
    bloodGroup: 'O+',
    dob: '2015-08-14',
    emergencyContact: '+1 (555) 234-5678',
  },
  {
    id: 'std_02',
    name: 'Ananya Kumar',
    rollNo: '06',
    grade: 'Grade 3',
    section: 'Section B',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    parentId: 'par_01',
    attendancePercentage: 96,
    presentDays: 19,
    absentDays: 1,
    leaveDays: 0,
    bloodGroup: 'B+',
    dob: '2017-03-22',
    emergencyContact: '+1 (555) 234-5678',
  },
];

export const MOCK_PARENT: Parent = {
  id: 'par_01',
  name: 'Priya',
  phone: '+1 (555) 234-5678',
  email: 'priya.kumar@example.com',
  studentIds: ['std_01', 'std_02'],
};

export const MOCK_TEACHER: Teacher = {
  id: 'tch_01',
  name: 'Mrs. Sarah Jenkins',
  email: 'sarah.jenkins@oakridge.edu',
  phone: '+1 (555) 432-8765',
  subjects: ['Mathematics', 'Science'],
  assignedClasses: ['Grade 5-A', 'Grade 5-B'],
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  status: 'active',
};

export const MOCK_TIMETABLE: TimetableSlot[] = [
  {
    id: 'tt_1',
    day: 'Monday',
    time: '08:00 AM',
    subject: 'Mathematics',
    room: 'Room 101',
    teacherName: 'Mrs. Sarah Jenkins',
    color: '#22C55E',
    isCurrent: true,
  },
  {
    id: 'tt_2',
    day: 'Monday',
    time: '09:00 AM',
    subject: 'Science',
    room: 'Room 102',
    teacherName: 'Dr. David Miller',
    color: '#3B82F6',
    isNext: true,
  },
  {
    id: 'tt_3',
    day: 'Monday',
    time: '10:00 AM',
    subject: 'English',
    room: 'Room 103',
    teacherName: 'Ms. Elena Rostova',
    color: '#A855F7',
  },
];

export const MOCK_ATTENDANCE_CALENDAR: DailyAttendanceRecord[] = [
  { date: '2024-11-04', status: 'present' },
  { date: '2024-11-05', status: 'present' },
  { date: '2024-11-06', status: 'present' },
  { date: '2024-11-07', status: 'present' },
  { date: '2024-11-08', status: 'present' },
  { date: '2024-11-11', status: 'present' },
  { date: '2024-11-12', status: 'present', note: 'Marked by School' },
  { date: '2024-11-13', status: 'present' },
  { date: '2024-11-14', status: 'present' },
  { date: '2024-11-15', status: 'absent', note: 'Unreported absence' },
  { date: '2024-11-18', status: 'present' },
  { date: '2024-11-19', status: 'present' },
  { date: '2024-11-20', status: 'present' },
  { date: '2024-11-21', status: 'leave', note: 'Approved medical leave' },
  { date: '2024-11-25', status: 'present' },
  { date: '2024-11-26', status: 'present' },
  { date: '2024-11-27', status: 'present' },
  { date: '2024-11-29', status: 'present' },
];

export const MOCK_HOMEWORK: Homework[] = [
  {
    id: 'hw_01',
    classId: 'c_5a',
    className: 'Grade 5-A',
    subject: 'Mathematics',
    title: 'Chapter 5 – Practice Questions',
    description: 'Complete questions 1 to 10 from the workbook.',
    dueDate: 'Due 14 Nov 2024',
    assignedDate: '10 Nov 2024',
    teacherName: 'Mrs. Sarah Jenkins',
    status: 'pending',
  },
  {
    id: 'hw_02',
    classId: 'c_5a',
    className: 'Grade 5-A',
    subject: 'Science',
    title: 'Lab Report',
    description: 'Write a short report on the plant cell observation.',
    dueDate: 'Due 15 Nov 2024',
    assignedDate: '11 Nov 2024',
    teacherName: 'Dr. David Miller',
    status: 'pending',
  },
  {
    id: 'hw_03',
    classId: 'c_5a',
    className: 'Grade 5-A',
    subject: 'English',
    title: 'Reading Comprehension',
    description: 'Read the chapter and answer the questions.',
    dueDate: 'Due 18 Nov 2024',
    assignedDate: '09 Nov 2024',
    teacherName: 'Ms. Elena Rostova',
    status: 'completed',
    completedDate: '12 Nov 2024',
  },
  {
    id: 'hw_04',
    classId: 'c_5a',
    className: 'Grade 5-A',
    subject: 'Social Studies',
    title: 'Map Work',
    description: 'Complete the map work in your notebook.',
    dueDate: 'Due 20 Nov 2024',
    assignedDate: '12 Nov 2024',
    teacherName: 'Mrs. Linda Davis',
    status: 'pending',
  },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr_01',
    studentId: 'std_01',
    studentName: 'Aarav Sharma',
    grade: 'Grade 8',
    section: 'A',
    startDate: '2026-10-25',
    endDate: '2026-10-26',
    reason: 'Family wedding event in hometown. Prior permission requested.',
    status: 'pending',
    appliedAt: '2026-10-18',
  },
  {
    id: 'lr_02',
    studentId: 'std_01',
    studentName: 'Aarav Sharma',
    grade: 'Grade 8',
    section: 'A',
    startDate: '2026-10-08',
    endDate: '2026-10-08',
    reason: 'Dental checkup and minor extraction.',
    status: 'approved',
    appliedAt: '2026-10-06',
    approvedBy: 'Mrs. Sarah Jenkins',
  },
];

export const MOCK_REPORT_CARD: ReportCard = {
  id: 'rc_01',
  term: 'Mid-Term',
  academicYear: '2026 – 2027',
  studentId: 'std_01',
  subjects: [
    { name: 'Mathematics', score: 96, maxScore: 100, grade: 'A+', remarks: 'Exceptional analytical capability.' },
    { name: 'Science & Physics', score: 92, maxScore: 100, grade: 'A', remarks: 'Very inquisitive in lab experiments.' },
    { name: 'English Literature', score: 88, maxScore: 100, grade: 'A', remarks: 'Great vocabulary and written flair.' },
    { name: 'Computer Science', score: 98, maxScore: 100, grade: 'A+', remarks: 'Outstanding problem solving.' },
    { name: 'Social Studies', score: 85, maxScore: 100, grade: 'B+', remarks: 'Good grasp of historical events.' },
    { name: 'French Language', score: 90, maxScore: 100, grade: 'A', remarks: 'Pronunciation steadily improving.' },
  ],
  totalScore: 549,
  maxTotal: 600,
  percentage: 91.5,
  grade: 'A+',
  rank: 3,
  totalStudents: 36,
  publishedDate: '12 Oct 2026',
  teacherRemarks: 'Aarav is an outstanding, respectful student with strong consistency across STEM and humanities subjects.',
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_01',
    studentId: 'std_01',
    title: 'Regional Science Olympiad',
    event: 'Inter-School Science Fair 2026',
    result: 'Gold Medalist (1st Place)',
    date: '15 Sep 2026',
    category: 'academics',
    description: 'Awarded 1st position among 45 regional schools for autonomous solar-tracking plant irrigator prototype.',
    badgeIcon: 'medal',
  },
  {
    id: 'ach_02',
    studentId: 'std_01',
    title: 'Under-14 Football Tournament',
    event: 'District Interschool Cup',
    result: 'Champions & Best Midfielder',
    date: '28 Aug 2026',
    category: 'sports',
    description: 'Led the school midfield to championship victory in the district final match (3-1).',
    badgeIcon: 'trophy',
  },
  {
    id: 'ach_03',
    studentId: 'std_01',
    title: 'Model United Nations Delegate',
    event: 'State Youth MUN',
    result: 'Honorable Mention',
    date: '10 Jul 2026',
    category: 'leadership',
    description: 'Represented Japan in UNESCO committee discussing climate education accessibility.',
    badgeIcon: 'ribbon',
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_01',
    title: 'Emergency: Severe Weather Advisory — School Early Dismissal',
    content: 'Due to severe storm warnings issued by meteorological department, school will conclude today at 01:00 PM. School buses will depart at 01:15 PM.',
    date: 'Today, 10:15 AM',
    priority: 'emergency',
    audience: ['all'],
    authorName: 'School Principal Office',
    pinned: true,
  },
  {
    id: 'ann_02',
    title: 'Parent-Teacher Meeting (PTM) for Term 1',
    content: 'The first term PTM will be held on Saturday, Oct 28 from 09:00 AM to 01:30 PM. Parents can book 10-minute slots with class teachers through the portal.',
    date: '17 Oct 2026',
    priority: 'important',
    audience: ['parents'],
    authorName: 'Academic Coordinator',
    pinned: true,
  },
  {
    id: 'ann_03',
    title: 'Annual Sports Day 2026 Registrations Open',
    content: 'Track and field tryouts begin next Tuesday. Students can sign up with their respective house captains.',
    date: '16 Oct 2026',
    priority: 'normal',
    audience: ['students', 'parents'],
    authorName: 'Sports Department',
  },
];

export const MOCK_COMMUNITY_POSTS: ClassCommunityPost[] = [
  {
    id: 'cp_01',
    teacherName: 'Mrs. Sarah Jenkins',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    className: 'Grade 8-A Community',
    timestamp: '2 hours ago',
    content: 'Congratulations to our Grade 8-A students for 100% submission rate in the Math exploratory project! Special praise to Aarav and Maya for innovative graph representations.',
    likes: 18,
    commentsCount: 4,
    allowReplies: true,
  },
  {
    id: 'cp_02',
    teacherName: 'Dr. David Miller',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    className: 'Science Club',
    timestamp: 'Yesterday',
    content: 'Reminder: Bring your safety goggles for tomorrow’s optics experiment. Protective aprons will be supplied at the laboratory entrance.',
    likes: 12,
    commentsCount: 2,
    allowReplies: true,
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    title: 'Emergency Weather Notice',
    message: 'Early dismissal today at 01:00 PM due to storm advisory.',
    timestamp: '15m ago',
    category: 'emergency',
    read: false,
  },
  {
    id: 'notif_02',
    title: 'Attendance Confirmed',
    message: 'Aarav Sharma marked Present for Monday, Oct 18.',
    timestamp: '2h ago',
    category: 'attendance',
    read: false,
  },
  {
    id: 'notif_03',
    title: 'New Homework Assigned',
    message: 'Mathematics: Quadratic Equations Ex 4.2 due tomorrow.',
    timestamp: '3h ago',
    category: 'academic',
    read: true,
  },
  {
    id: 'notif_04',
    title: 'Term 2 Tuition Due',
    message: 'Term 2 fee payment invoice #INV-8821 generated.',
    timestamp: '2 days ago',
    category: 'fees',
    read: true,
  },
];

export const MOCK_FEES: FeeItem[] = [
  {
    id: 'fee_01',
    studentId: 'std_01',
    title: 'Term 1 Tuition & Laboratory Fee',
    term: 'Term 1 (Jul - Oct)',
    amount: 1450,
    dueDate: '15 Jul 2026',
    status: 'paid',
    paidDate: '10 Jul 2026',
    invoiceNo: 'INV-2026-7812',
  },
  {
    id: 'fee_02',
    studentId: 'std_01',
    title: 'Term 2 Tuition & Sports Facility Fee',
    term: 'Term 2 (Nov - Feb)',
    amount: 1450,
    dueDate: '05 Nov 2026',
    status: 'pending',
    invoiceNo: 'INV-2026-8821',
  },
];

export const MOCK_ROSTER_8A: StudentRosterItem[] = [
  { id: 'std_01', rollNo: '01', name: 'Aarav Sharma', avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150', status: 'present', attendancePercentage: 94.2, presentDays: 42, absentDays: 1, leaveDays: 2 },
  { id: 'std_03', rollNo: '02', name: 'Chloe Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', status: 'present', attendancePercentage: 97.8, presentDays: 44, absentDays: 1, leaveDays: 0 },
  { id: 'std_04', rollNo: '03', name: 'Ethan Wright', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', status: 'present', attendancePercentage: 88.9, presentDays: 40, absentDays: 3, leaveDays: 2 },
  { id: 'std_05', rollNo: '04', name: 'Fatima Al-Sayed', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'absent', attendancePercentage: 91.1, presentDays: 41, absentDays: 3, leaveDays: 1 },
  { id: 'std_06', rollNo: '05', name: 'Grace Hopper', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', status: 'leave', attendancePercentage: 93.3, presentDays: 42, absentDays: 0, leaveDays: 3 },
  { id: 'std_07', rollNo: '06', name: 'Kabir Mehta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'present', attendancePercentage: 95.6, presentDays: 43, absentDays: 1, leaveDays: 1 },
  { id: 'std_08', rollNo: '07', name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'present', attendancePercentage: 97.8, presentDays: 44, absentDays: 1, leaveDays: 0 },
  { id: 'std_09', rollNo: '08', name: 'Noah Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'present', attendancePercentage: 86.7, presentDays: 39, absentDays: 4, leaveDays: 2 },
];

export const MOCK_ADMIN_METRICS = {
  totalStudents: 1248,
  totalTeachers: 88,
  teachersPresentToday: 84,
  studentAttendanceRate: 94.6,
  feesCollectedAmount: '$428,500',
  feesPendingAmount: '$32,100',
  pendingLeaveApprovals: 5,
  recentAnnouncementsCount: 3,
};

export const MOCK_EVENTS: SchoolEvent[] = [
  {
    id: 'evt_01',
    title: 'Annual Inter-House Sports Gala 2026',
    category: 'sports',
    date: '2026-10-28',
    time: '08:30 AM – 03:30 PM',
    venue: 'Main Athletics Stadium & Oval Field',
    targetAudience: ['all'],
    description: 'Track and field championships, relay sprints, tug of war, and gymnastics demonstrations. Parents are warmly invited.',
    organizer: 'Physical Education Dept.',
    rsvpCount: 420,
  },
  {
    id: 'evt_02',
    title: 'Term 1 Parent-Teacher Consultations (PTM)',
    category: 'ptm',
    date: '2026-11-04',
    time: '09:00 AM – 01:00 PM',
    venue: 'Auditorium & Classrooms (Block B)',
    targetAudience: ['parents', 'teachers'],
    description: 'One-on-one academic performance discussions for Term 1 progress reports. Prior slot booking recommended.',
    organizer: 'Academic Council',
    rsvpCount: 285,
  },
  {
    id: 'evt_03',
    title: 'AI & Robotics Innovation Expo 2026',
    category: 'academic',
    date: '2026-11-12',
    time: '10:00 AM – 04:00 PM',
    venue: 'STEM Hub & Computer Labs',
    targetAudience: ['students', 'parents', 'teachers'],
    description: 'Student exhibits featuring autonomous line-follower bots, machine learning projects, and scratch coding games.',
    organizer: 'STEM & Robotics Club',
    rsvpCount: 310,
  },
  {
    id: 'evt_04',
    title: 'Diwali & Autumn Festive Break',
    category: 'holiday',
    date: '2026-11-15',
    time: 'All Day',
    venue: 'Campus Closed',
    targetAudience: ['all'],
    description: 'School campus remains closed in celebration of the festive holidays. Classes resume on Monday, Nov 23.',
    organizer: 'Administration Office',
  },
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_01',
    ticketNumber: 'TKT-2026-1082',
    senderId: 'std_01',
    senderName: 'Aarav Sharma',
    senderRole: 'student',
    category: 'Academic Help',
    subject: 'Request for Physics Lab makeup session',
    description: 'I missed the refraction practical due to sick leave on Tuesday. Can I join the session with Section B?',
    priority: 'normal',
    status: 'in_progress',
    createdAt: 'Yesterday, 04:15 PM',
    updatedAt: 'Today, 09:20 AM',
    response: 'Approved by Mr. Reynolds. Please attend Lab 2 on Friday at 2:00 PM.',
  },
  {
    id: 'tkt_02',
    ticketNumber: 'TKT-2026-1049',
    senderId: 'tch_01',
    senderName: 'Mrs. Sarah Jenkins',
    senderRole: 'teacher',
    category: 'Classroom Tech',
    subject: 'Interactive SmartBoard HDMI audio issue in Room 204',
    description: 'The projector display works fine but the audio output cuts out after 10 minutes of video playback.',
    priority: 'high',
    status: 'open',
    createdAt: 'Today, 08:10 AM',
    updatedAt: 'Today, 08:10 AM',
  },
  {
    id: 'tkt_03',
    ticketNumber: 'TKT-2026-0994',
    senderId: 'std_01',
    senderName: 'Aarav Sharma',
    senderRole: 'student',
    category: 'Library',
    subject: 'Digital Library RFID Card Activation',
    description: 'My new student RFID card is not scanning at the e-library kiosk turnstile.',
    priority: 'low',
    status: 'resolved',
    createdAt: '18 Oct 2026',
    updatedAt: '19 Oct 2026',
    response: 'Card re-encoded at central IT desk. It is now active and operational.',
  },
];

export const MOCK_CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'chn_teacher_jenkins',
    name: 'Mrs. Sarah Jenkins (Class Teacher)',
    subtitle: 'Grade 8-A Mentor • Mathematics Faculty',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    type: 'direct',
    unreadCount: 1,
    lastMessage: 'Great progress in today’s algebra pop quiz! Keep it up.',
    lastMessageTime: '10:35 AM',
    allowedRoles: ['student', 'parent', 'teacher', 'admin'],
  },
  {
    id: 'chn_class_8a',
    name: 'Grade 8-A Notice & Discussion Hub',
    subtitle: 'Official class group • 28 students, 4 teachers',
    avatar: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=150',
    type: 'group',
    unreadCount: 3,
    lastMessage: 'Reminder: Bring your lab coat tomorrow for chemistry experiments.',
    lastMessageTime: '09:12 AM',
    allowedRoles: ['student', 'teacher', 'admin'],
  },
  {
    id: 'chn_parent_desk',
    name: 'Parent-Teacher Communication Desk',
    subtitle: 'Direct line for guardians & homeroom teachers',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    type: 'direct',
    unreadCount: 0,
    lastMessage: 'The Term 1 report card has been published. Let us know if you have questions.',
    lastMessageTime: 'Yesterday',
    allowedRoles: ['parent', 'teacher', 'admin'],
  },
  {
    id: 'chn_school_admin',
    name: 'Oakridge Helpdesk & Admin Office',
    subtitle: 'Campus administration, transport & fee office',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    type: 'helpdesk',
    unreadCount: 0,
    lastMessage: 'School bus route 14 will depart 15 minutes early today due to road repair.',
    lastMessageTime: 'Oct 18',
    allowedRoles: ['student', 'parent', 'teacher', 'admin'],
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    channelId: 'chn_teacher_jenkins',
    senderId: 'tch_01',
    senderName: 'Mrs. Sarah Jenkins',
    senderRole: 'teacher',
    content: 'Hello Aarav! Just checking in — how did you find today’s homework on quadratic equations?',
    timestamp: '10:15 AM',
    isSelf: false,
  },
  {
    id: 'msg_02',
    channelId: 'chn_teacher_jenkins',
    senderId: 'std_01',
    senderName: 'Aarav Sharma',
    senderRole: 'student',
    content: 'Good morning Mrs. Jenkins! I completed questions 1 to 8. I had a slight doubt on question 9 with negative roots.',
    timestamp: '10:22 AM',
    isSelf: true,
  },
  {
    id: 'msg_03',
    channelId: 'chn_teacher_jenkins',
    senderId: 'tch_01',
    senderName: 'Mrs. Sarah Jenkins',
    senderRole: 'teacher',
    content: 'Great progress in today’s algebra pop quiz! Keep it up. We will cover negative discriminant roots at the start of tomorrow’s class.',
    timestamp: '10:35 AM',
    isSelf: false,
  },
  {
    id: 'msg_04',
    channelId: 'chn_class_8a',
    senderId: 'tch_02',
    senderName: 'Mr. David Reynolds',
    senderRole: 'teacher',
    content: 'Reminder: Bring your lab coat tomorrow for chemistry experiments.',
    timestamp: '09:12 AM',
    isSelf: false,
  },
  {
    id: 'msg_05',
    channelId: 'chn_parent_desk',
    senderId: 'tch_01',
    senderName: 'Mrs. Sarah Jenkins',
    senderRole: 'teacher',
    content: 'Dear Parents, Term 1 report card has been published. Let us know if you have questions.',
    timestamp: 'Yesterday',
    isSelf: false,
  },
];

export const MOCK_POP_QUIZZES: PopQuiz[] = [
  {
    id: 'quiz_01',
    title: 'Photosynthesis & Plant Cellular Biology',
    subject: 'General Science',
    topic: 'Plant Nutrition & Chloroplasts',
    difficulty: 'Medium',
    className: 'Grade 8-A',
    createdAt: 'Today, 09:00 AM',
    createdBy: 'Mrs. Sarah Jenkins',
    questions: [
      {
        id: 'q1',
        question: 'Which gas is absorbed by green plants from the atmosphere during photosynthesis?',
        options: ['Oxygen (O2)', 'Carbon Dioxide (CO2)', 'Nitrogen (N2)', 'Hydrogen (H2)'],
        correctIndex: 1,
        explanation: 'Plants take in Carbon Dioxide (CO2) through tiny openings called stomata and release Oxygen as a byproduct.',
      },
      {
        id: 'q2',
        question: 'What is the green pigment in plant leaves responsible for absorbing sunlight?',
        options: ['Hemoglobin', 'Melanin', 'Chlorophyll', 'Carotene'],
        correctIndex: 2,
        explanation: 'Chlorophyll, located inside chloroplasts, traps light energy needed to drive photosynthesis.',
      },
      {
        id: 'q3',
        question: 'What is the primary sugar synthesized by plants during photosynthesis?',
        options: ['Sucrose', 'Glucose (C6H12O6)', 'Lactose', 'Fructose'],
        correctIndex: 1,
        explanation: 'Glucose is the primary simple carbohydrate synthesized to provide chemical energy for cellular respiration.',
      },
      {
        id: 'q4',
        question: 'Which organelle in plant cells is the primary site of photosynthesis?',
        options: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Golgi Body'],
        correctIndex: 1,
        explanation: 'Chloroplasts contain the thylakoids and stroma where the light-dependent and Calvin cycle reactions occur.',
      },
      {
        id: 'q5',
        question: 'During which part of the day does the light-dependent reaction primarily occur?',
        options: ['Midnight', 'Daylight hours', 'During heavy rain only', 'Continuously without light'],
        correctIndex: 1,
        explanation: 'Light-dependent reactions require active photons from sunlight to split water molecules and generate ATP/NADPH.',
      },
    ],
  },
  {
    id: 'quiz_02',
    title: 'Algebra: Linear Equations & Expressions',
    subject: 'Mathematics',
    topic: 'Solving for Variable X',
    difficulty: 'Easy',
    className: 'Grade 8-A',
    createdAt: 'Yesterday',
    createdBy: 'Mrs. Sarah Jenkins',
    questions: [
      {
        id: 'q2_1',
        question: 'If 3x + 7 = 22, what is the value of x?',
        options: ['3', '5', '7', '15'],
        correctIndex: 1,
        explanation: 'Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5.',
      },
      {
        id: 'q2_2',
        question: 'What is the slope (m) of the line represented by y = 4x - 9?',
        options: ['-9', '4', '9', '-4'],
        correctIndex: 1,
        explanation: 'In the slope-intercept form y = mx + b, m is the slope, which equals 4.',
      },
      {
        id: 'q2_3',
        question: 'Simplify the expression: 4(2x - 3) + 5x',
        options: ['13x - 12', '13x - 3', '8x - 12', '11x - 7'],
        correctIndex: 0,
        explanation: 'Distribute: 8x - 12 + 5x = (8x + 5x) - 12 = 13x - 12.',
      },
    ],
  },
];

export interface MultiClassStudentRecord {
  id: string;
  rollNo: string;
  name: string;
  className: string;
  section: string;
  status: 'present' | 'absent' | 'leave';
  attendanceRate: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  contact: string;
  gender: 'M' | 'F';
}

export const MOCK_MULTI_CLASS_ATTENDANCE: MultiClassStudentRecord[] = [
  // Grade 8-A
  { id: 'std_01', rollNo: '8A-01', name: 'Aarav Sharma', className: 'Grade 8', section: 'A', status: 'present', attendanceRate: 94.2, totalDays: 45, presentDays: 42, absentDays: 1, leaveDays: 2, contact: '+91 98201 11001', gender: 'M' },
  { id: 'std_02', rollNo: '8A-02', name: 'Chloe Chen', className: 'Grade 8', section: 'A', status: 'present', attendanceRate: 97.8, totalDays: 45, presentDays: 44, absentDays: 1, leaveDays: 0, contact: '+91 98201 11002', gender: 'F' },
  { id: 'std_03', rollNo: '8A-03', name: 'Ethan Wright', className: 'Grade 8', section: 'A', status: 'present', attendanceRate: 88.9, totalDays: 45, presentDays: 40, absentDays: 3, leaveDays: 2, contact: '+91 98201 11003', gender: 'M' },
  { id: 'std_04', rollNo: '8A-04', name: 'Fatima Al-Sayed', className: 'Grade 8', section: 'A', status: 'absent', attendanceRate: 91.1, totalDays: 45, presentDays: 41, absentDays: 3, leaveDays: 1, contact: '+91 98201 11004', gender: 'F' },
  { id: 'std_05', rollNo: '8A-05', name: 'Grace Hopper', className: 'Grade 8', section: 'A', status: 'leave', attendanceRate: 93.3, totalDays: 45, presentDays: 42, absentDays: 0, leaveDays: 3, contact: '+91 98201 11005', gender: 'F' },
  { id: 'std_06', rollNo: '8A-06', name: 'Kabir Mehta', className: 'Grade 8', section: 'A', status: 'present', attendanceRate: 95.6, totalDays: 45, presentDays: 43, absentDays: 1, leaveDays: 1, contact: '+91 98201 11006', gender: 'M' },
  { id: 'std_07', rollNo: '8A-07', name: 'Maya Lin', className: 'Grade 8', section: 'A', status: 'present', attendanceRate: 97.8, totalDays: 45, presentDays: 44, absentDays: 1, leaveDays: 0, contact: '+91 98201 11007', gender: 'F' },
  { id: 'std_08', rollNo: '8A-08', name: 'Noah Patel', className: 'Grade 8', section: 'A', status: 'present', attendanceRate: 86.7, totalDays: 45, presentDays: 39, absentDays: 4, leaveDays: 2, contact: '+91 98201 11008', gender: 'M' },

  // Grade 8-B
  { id: 'std_11', rollNo: '8B-01', name: 'Devansh Kulkarni', className: 'Grade 8', section: 'B', status: 'present', attendanceRate: 95.5, totalDays: 45, presentDays: 43, absentDays: 1, leaveDays: 1, contact: '+91 98202 22001', gender: 'M' },
  { id: 'std_12', rollNo: '8B-02', name: 'Diya Sengupta', className: 'Grade 8', section: 'B', status: 'present', attendanceRate: 93.3, totalDays: 45, presentDays: 42, absentDays: 2, leaveDays: 1, contact: '+91 98202 22002', gender: 'F' },
  { id: 'std_13', rollNo: '8B-03', name: 'Lucas Rossi', className: 'Grade 8', section: 'B', status: 'absent', attendanceRate: 82.2, totalDays: 45, presentDays: 37, absentDays: 6, leaveDays: 2, contact: '+91 98202 22003', gender: 'M' },
  { id: 'std_14', rollNo: '8B-04', name: 'Meera Nambiar', className: 'Grade 8', section: 'B', status: 'present', attendanceRate: 97.8, totalDays: 45, presentDays: 44, absentDays: 1, leaveDays: 0, contact: '+91 98202 22004', gender: 'F' },
  { id: 'std_15', rollNo: '8B-05', name: 'Ryan Murphy', className: 'Grade 8', section: 'B', status: 'leave', attendanceRate: 88.9, totalDays: 45, presentDays: 40, absentDays: 2, leaveDays: 3, contact: '+91 98202 22005', gender: 'M' },

  // Grade 9-A
  { id: 'std_21', rollNo: '9A-01', name: 'Aditya Deshmukh', className: 'Grade 9', section: 'A', status: 'present', attendanceRate: 98.0, totalDays: 50, presentDays: 49, absentDays: 1, leaveDays: 0, contact: '+91 98203 33001', gender: 'M' },
  { id: 'std_22', rollNo: '9A-02', name: 'Ananya Roy', className: 'Grade 9', section: 'A', status: 'present', attendanceRate: 96.0, totalDays: 50, presentDays: 48, absentDays: 1, leaveDays: 1, contact: '+91 98203 33002', gender: 'F' },
  { id: 'std_23', rollNo: '9A-03', name: 'Benjamin Hayes', className: 'Grade 9', section: 'A', status: 'leave', attendanceRate: 90.0, totalDays: 50, presentDays: 45, absentDays: 2, leaveDays: 3, contact: '+91 98203 33003', gender: 'M' },
  { id: 'std_24', rollNo: '9A-04', name: 'Zara Khan', className: 'Grade 9', section: 'A', status: 'absent', attendanceRate: 84.0, totalDays: 50, presentDays: 42, absentDays: 6, leaveDays: 2, contact: '+91 98203 33004', gender: 'F' },

  // Grade 9-B
  { id: 'std_31', rollNo: '9B-01', name: 'Ishaan Verma', className: 'Grade 9', section: 'B', status: 'present', attendanceRate: 96.0, totalDays: 50, presentDays: 48, absentDays: 1, leaveDays: 1, contact: '+91 98204 44001', gender: 'M' },
  { id: 'std_32', rollNo: '9B-02', name: 'Pooja Hegde', className: 'Grade 9', section: 'B', status: 'present', attendanceRate: 94.0, totalDays: 50, presentDays: 47, absentDays: 2, leaveDays: 1, contact: '+91 98204 44002', gender: 'F' },
  { id: 'std_33', rollNo: '9B-03', name: 'Samuel Taylor', className: 'Grade 9', section: 'B', status: 'present', attendanceRate: 92.0, totalDays: 50, presentDays: 46, absentDays: 3, leaveDays: 1, contact: '+91 98204 44003', gender: 'M' },

  // Grade 10-A
  { id: 'std_41', rollNo: '10A-01', name: 'Rohan Joshi', className: 'Grade 10', section: 'A', status: 'present', attendanceRate: 98.2, totalDays: 55, presentDays: 54, absentDays: 1, leaveDays: 0, contact: '+91 98205 55001', gender: 'M' },
  { id: 'std_42', rollNo: '10A-02', name: 'Sanvi Reddy', className: 'Grade 10', section: 'A', status: 'present', attendanceRate: 96.4, totalDays: 55, presentDays: 53, absentDays: 1, leaveDays: 1, contact: '+91 98205 55002', gender: 'F' },
  { id: 'std_43', rollNo: '10A-03', name: 'Tariq Mansoor', className: 'Grade 10', section: 'A', status: 'absent', attendanceRate: 85.5, totalDays: 55, presentDays: 47, absentDays: 6, leaveDays: 2, contact: '+91 98205 55003', gender: 'M' },
  { id: 'std_44', rollNo: '10A-04', name: 'Victoria Brooks', className: 'Grade 10', section: 'A', status: 'present', attendanceRate: 94.5, totalDays: 55, presentDays: 52, absentDays: 2, leaveDays: 1, contact: '+91 98205 55004', gender: 'F' },
];


