// Student Information Types
export interface StudentInfo {
  name?: string;
  massarCode?: string;
  establishment?: string;
  level?: string;
  class?: string;
  academicYear?: string;
}

// Attendance Types
export interface AttendanceRecord {
  date?: string;
  subject?: string;
  type?: string; // Absence, Late, etc.
  justified?: boolean;
  reason?: string;
}

export interface AttendanceData {
  totalAbsences?: number;
  justifiedAbsences?: number;
  unjustifiedAbsences?: number;
  records?: AttendanceRecord[];
}

// Schedule Types
export interface ScheduleItem {
  time?: string;
  subject?: string;
  teacher?: string;
  room?: string;
  day?: string;
}

export interface Schedule {
  week?: ScheduleItem[][];
  items?: ScheduleItem[];
}

// Announcements Types
export interface Announcement {
  date?: string;
  title?: string;
  content?: string;
  author?: string;
  priority?: string;
}

// Homework Types
export interface HomeworkItem {
  subject?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  assignedDate?: string;
  status?: string;
}

// Communications Types
export interface Communication {
  date?: string;
  from?: string;
  to?: string;
  subject?: string;
  content?: string;
  type?: string; // Email, Message, etc.
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  rawHTML?: string;
  error?: string;
}

// Form Types
export interface MoutamadrisCredentials {
  username: string;
  password: string;
  year?: string;
  semester?: string;
}