export const categories = [
  'Programming', 'Artificial Intelligence and Machine Learning', 'Web Development',
  'UI/UX Design', 'Communication', 'Academics', 'Database Management',
]

export const initialStudents = [
  { id: 's1', name: 'Aarav Mehta', department: 'Computer Science', year: '3rd Year', avatar: 'AM', color: 'coral', bio: 'Building thoughtful interfaces and always up for a good problem-solving session.', teaches: ['React', 'JavaScript', 'Figma'], wants: ['Python', 'Machine Learning'] },
  { id: 's2', name: 'Isha Kapoor', department: 'Information Technology', year: '2nd Year', avatar: 'IK', color: 'mint', bio: 'Curious about data, design systems, and making complex things feel simple.', teaches: ['Python', 'Data Analysis', 'SQL'], wants: ['UI/UX Design', 'Public Speaking'] },
  { id: 's3', name: 'Rohan Nair', department: 'Computer Science', year: '4th Year', avatar: 'RN', color: 'blue', bio: 'I enjoy mentoring on backend fundamentals and exploring applied AI.', teaches: ['Java', 'Machine Learning', 'MongoDB'], wants: ['React', 'Communication'] },
  { id: 's4', name: 'Mira Shah', department: 'Design', year: '3rd Year', avatar: 'MS', color: 'lavender', bio: 'Product designer who loves turning research into clear, useful experiences.', teaches: ['UI/UX Design', 'Figma', 'Prototyping'], wants: ['HTML & CSS', 'Python'] },
  { id: 's5', name: 'Kabir Rao', department: 'Electronics', year: '2nd Year', avatar: 'KR', color: 'yellow', bio: 'Electronics student learning full-stack development one project at a time.', teaches: ['C++', 'Arduino', 'Mathematics'], wants: ['JavaScript', 'React'] },
  { id: 's6', name: 'Ananya Das', department: 'Computer Science', year: '3rd Year', avatar: 'AD', color: 'pink', bio: 'I can help with databases and love learning how to communicate ideas better.', teaches: ['SQL', 'Database Design', 'Technical Writing'], wants: ['Figma', 'Public Speaking'] },
  { id: 's7', name: 'Dev Patel', department: 'Information Technology', year: '4th Year', avatar: 'DP', color: 'green', bio: 'Frontend developer interested in accessible web apps and clean architecture.', teaches: ['HTML & CSS', 'TypeScript', 'Accessibility'], wants: ['Machine Learning', 'Java'] },
  { id: 's8', name: 'Zoya Fernandes', department: 'Business', year: '2nd Year', avatar: 'ZF', color: 'peach', bio: 'Presentation coach and aspiring product manager; happy to practice together.', teaches: ['Public Speaking', 'Communication', 'Excel'], wants: ['SQL', 'UI/UX Design'] },
]

export const initialData = {
  profile: { name: 'Sanju', department: 'Computer Science', year: '3rd Year', bio: 'Computer science student exploring product design and intelligent applications. Always happy to learn together.', availability: 'Weekday evenings', interests: ['Machine Learning', 'UI/UX Design', 'Public Speaking'] },
  skills: [
    { id: 'skill-1', name: 'JavaScript', type: 'teach', category: 'Programming', level: 'Advanced', description: 'Modern JavaScript, DOM, and asynchronous patterns.' },
    { id: 'skill-2', name: 'React', type: 'teach', category: 'Web Development', level: 'Intermediate', description: 'Component-driven interfaces and practical React patterns.' },
    { id: 'skill-3', name: 'Machine Learning', type: 'learn', category: 'Artificial Intelligence and Machine Learning', level: 'Beginner', description: 'Looking for a practical introduction to model building.' },
    { id: 'skill-4', name: 'UI/UX Design', type: 'learn', category: 'UI/UX Design', level: 'Beginner', description: 'Want to learn user research and interface fundamentals.' },
  ],
  requests: [
    { id: 'r1', studentId: 's2', requestedSkill: 'JavaScript', offeredSkill: 'Python', date: '2026-10-10', status: 'Received' },
    { id: 'r2', studentId: 's4', requestedSkill: 'React', offeredSkill: 'UI/UX Design', date: '2026-10-09', status: 'Received' },
    { id: 'r3', studentId: 's1', requestedSkill: 'Machine Learning', offeredSkill: 'Figma', date: '2026-10-08', status: 'Sent' },
    { id: 'r4', studentId: 's3', requestedSkill: 'React', offeredSkill: 'Machine Learning', date: '2026-10-04', status: 'Accepted' },
    { id: 'r5', studentId: 's8', requestedSkill: 'JavaScript', offeredSkill: 'Public Speaking', date: '2026-10-02', status: 'Rejected' },
  ],
  sessions: [
    { id: 'session-1', studentId: 's3', title: 'React patterns for real projects', skill: 'React', date: '2026-10-14', time: '4:00 PM', progress: 2, total: 4, completed: false },
    { id: 'session-2', studentId: 's2', title: 'Python foundations, together', skill: 'Python', date: '2026-10-16', time: '5:30 PM', progress: 1, total: 3, completed: false },
    { id: 'session-3', studentId: 's1', title: 'First steps in machine learning', skill: 'Machine Learning', date: '2026-10-18', time: '2:00 PM', progress: 0, total: 5, completed: false },
  ],
}