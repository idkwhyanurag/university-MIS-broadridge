// Sidebar navigation, grouped by epic.
// Each item can restrict itself to specific roles via `roles`.
// Omitting `roles` means "visible to everyone."
// Roles: 'admin' | 'teacher' | 'student'

export const NAV_GROUPS = [
  {
    id: 'academics',
    label: 'Academics',
    tab: 'academics',
    items: [
      { label: 'Students', path: '/students', roles: ['admin', 'teacher'] },
      { label: 'Admissions', path: '/admissions', roles: ['admin'] },
      { label: 'Attendance', path: '/attendance', roles: ['admin', 'teacher'] },
      { label: 'Courses', path: '/courses' },
      { label: 'Timetable', path: '/timetable' },
      { label: 'Departments', path: '/departments', roles: ['admin', 'teacher'] },
      { label: 'Faculty', path: '/faculty', roles: ['admin', 'teacher'] },
      { label: 'Subjects', path: '/subjects' },
      { label: 'Grades', path: '/grades' },
      { label: 'Examinations', path: '/examinations' },
    ],
  },
  {
    id: 'hostel',
    label: 'Hostel & Fees',
    tab: 'hostel',
    items: [
      { label: 'Hostel', path: '/hostel' },
      { label: 'Rooms', path: '/rooms', roles: ['admin'] },
      { label: 'Fee Management', path: '/fees' },
    ],
  },
  {
    id: 'comms',
    label: 'Communication',
    tab: 'comms',
    items: [
      { label: 'Notifications', path: '/notifications' },
      { label: 'Announcements', path: '/announcements' },
      { label: 'Events', path: '/events' },
      { label: 'Analytics', path: '/analytics', roles: ['admin', 'teacher'] },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    tab: 'admin',
    items: [
      { label: 'Settings', path: '/settings', roles: ['admin'] },
      { label: 'Profile', path: '/profile' },
    ],
  },
];
