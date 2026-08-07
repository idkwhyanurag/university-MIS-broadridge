// Sidebar navigation, grouped by epic.
// Each group has a `tab` color key matching the CSS variables
// --tab-academics / --tab-admin / --tab-hostel / --tab-comms in tokens.css.

export const NAV_GROUPS = [
  {
    id: 'academics',
    label: 'Academics',
    tab: 'academics',
    items: [
      { label: 'Students', path: '/students' },
      { label: 'Admissions', path: '/admissions' },
      { label: 'Attendance', path: '/attendance' },
      { label: 'Courses', path: '/courses' },
      { label: 'Timetable', path: '/timetable' },
      { label: 'Departments', path: '/departments' },
      { label: 'Faculty', path: '/faculty' },
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
      { label: 'Rooms', path: '/rooms' },
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
      { label: 'Analytics', path: '/analytics' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    tab: 'admin',
    items: [
      { label: 'Settings', path: '/settings' },
      { label: 'Profile', path: '/profile' },
    ],
  },
];
