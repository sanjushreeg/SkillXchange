import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Bell, BookOpen, BriefcaseBusiness, Check, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, Clock3, Compass, GraduationCap, LayoutDashboard, ListChecks,
  Menu, MessageCircle, MoreHorizontal, Plus, Search, Settings, SlidersHorizontal, Sparkles,
  Users, X, XCircle,
} from 'lucide-react'
import { categories, initialData, initialStudents } from './data/demoData'
import { findComplementarySkill, getMatchScore } from './utils/matching'
import './App.css'

const STORAGE_KEY = 'skillsync-demo-v1'
const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Discover Skills', icon: Compass },
  { label: 'Find Students', icon: Users },
  { label: 'My Skills', icon: Sparkles },
  { label: 'Exchange Requests', icon: ListChecks },
  { label: 'My Learning', icon: BookOpen },
  { label: 'My Profile', icon: GraduationCap },
  { label: 'Settings', icon: Settings },
]
const shortCategory = (value) => value === 'Artificial Intelligence and Machine Learning' ? 'AI & Machine Learning' : value
const dateLabel = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...initialData, ...JSON.parse(saved) } : initialData
  } catch {
    return initialData
  }
}

function Avatar({ person, size = '' }) {
  const initials = person.avatar || person.name.split(' ').map((part) => part[0]).join('').slice(0, 2)
  return <span className={`avatar avatar-${person.color || 'indigo'} ${size}`} aria-label={person.name}>{initials}</span>
}

function App() {
  const [data, setData] = useState(loadData)
  const [page, setPage] = useState('Dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')
  const people = initialStudents

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }, [data])
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const update = (key, value) => setData((current) => ({ ...current, [key]: typeof value === 'function' ? value(current[key]) : value }))
  const notify = (message) => setToast(message)
  const navigate = (destination) => { setPage(destination); setMobileOpen(false); setQuery('') }
  const sendRequest = (person, skills) => {
    if (data.requests.some((request) => request.studentId === person.id && request.status === 'Sent')) {
      notify('You already have a request with this student.')
      return false
    }
    update('requests', (requests) => [{ id: `r-${Date.now()}`, studentId: person.id, requestedSkill: skills.requested || person.teaches[0], offeredSkill: skills.offered || data.skills.find((skill) => skill.type === 'teach')?.name || 'Skill exchange', date: new Date().toISOString().slice(0, 10), status: 'Sent' }, ...requests])
    notify(`Exchange request sent to ${person.name.split(' ')[0]}.`)
    return true
  }
  const changeRequest = (id, status) => {
    update('requests', (requests) => requests.map((request) => request.id === id ? { ...request, status } : request))
    notify(`Request ${status.toLowerCase()}.`)
  }

  let content
  const shared = { data, update, people, navigate, notify, sendRequest, changeRequest }
  if (page === 'Dashboard') content = <Dashboard {...shared} />
  else if (page === 'Find Students') content = <FindStudents {...shared} />
  else if (page === 'Discover Skills') content = <DiscoverSkills {...shared} />
  else if (page === 'My Skills') content = <MySkills {...shared} />
  else if (page === 'Exchange Requests') content = <Requests {...shared} />
  else if (page === 'My Learning') content = <Learning {...shared} />
  else if (page === 'My Profile') content = <Profile {...shared} />
  else content = <SettingsPage {...shared} />

  const searchResults = query.trim() ? people.filter((person) => `${person.name} ${person.department} ${person.teaches.join(' ')} ${person.wants.join(' ')}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : []

  return <div className={`app-shell ${collapsed ? 'is-collapsed' : ''}`}>
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <button className="brand" onClick={() => navigate('Dashboard')} aria-label="SkillSync home"><span className="brand-mark"><i /><i /><i /></span><span>Skill<span>Sync</span></span></button>
      <span className="side-label">WORKSPACE</span>
      <nav className="side-nav" aria-label="Main navigation">{navigation.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => navigate(label)} title={collapsed ? label : undefined}><Icon size={18} /><span>{label}</span>{label === 'Exchange Requests' && data.requests.filter((request) => request.status === 'Received').length > 0 && <i className="nav-count">{data.requests.filter((request) => request.status === 'Received').length}</i>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-box"><span className="help-icon">?</span><div><b>Need a hand?</b><small>Visit our help center</small></div><ArrowRight size={15} /></div><button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}><ChevronLeft size={16} /><span>Collapse sidebar</span></button></div>
    </aside>
    <main className="main-area"><header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><b>{page}</b></div><div className="top-actions"><div className="global-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students, skills..." aria-label="Search students and skills" /><kbd>⌘ K</kbd>{searchResults.length > 0 && <div className="search-popover">{searchResults.map((person) => <button key={person.id} onClick={() => navigate('Find Students')}><Avatar person={person} size="avatar-sm" /><span><b>{person.name}</b><small>{person.teaches.slice(0, 2).join(' · ')}</small></span><ArrowRight size={14} /></button>)}</div>}</div><button className="icon-button notification-button" onClick={() => navigate('Exchange Requests')} aria-label="Notifications"><Bell size={19} /><i /></button><button className="top-profile" onClick={() => navigate('My Profile')}><Avatar person={{ ...data.profile, color: 'indigo' }} size="avatar-sm" /><span>{data.profile.name}</span><ChevronDown size={14} /></button></div></header>
  <section className="page-wrap" key={page}>{content}</section><footer className="app-footer"><span>SkillSync <b>·</b> Peer learning, made personal</span><span>Frontend demo · Saved in this browser</span></footer></main>
    {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={15} /></button></div>}
  </div>
}

function Heading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function PanelHeading({ title, subtitle, action }) {
  return <div className="panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div>{action}</div>
}

function EmptyState({ icon: Icon, title, message, action, actionText }) {
  return <div className="empty-state"><span><Icon size={21} /></span><strong>{title}</strong><p>{message}</p>{action && <button className="button-outline" onClick={action}>{actionText}</button>}</div>
}

function Dashboard({ data, people, navigate, sendRequest }) {
  const matches = people.map((person) => ({ person, score: getMatchScore(person, data.skills) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score)
  const countReceived = data.requests.filter((request) => request.status === 'Received').length
  const stats = [
    ['Skills offered', data.skills.filter((skill) => skill.type === 'teach').length, Sparkles, 'Your knowledge, shared', 'indigo'],
    ['Skills to learn', data.skills.filter((skill) => skill.type === 'learn').length, BookOpen, 'Keep your curiosity going', 'mint'],
    ['Potential matches', matches.length, Users, 'Based on your skill profile', 'peach'],
    ['Pending requests', countReceived, Clock3, `${countReceived} waiting for your reply`, 'blue'],
  ]
  const activity = [
    [CheckCircle2, 'mint', <><b>Exchange accepted</b> with Rohan Nair</>, 'Today, 9:42 AM'],
    [MessageCircle, 'peach', <><b>Isha Kapoor</b> sent you a request</>, 'Yesterday, 4:18 PM'],
    [Sparkles, 'indigo', <>You added <b>React</b> to skills you teach</>, 'Oct 08, 11:26 AM'],
  ]
  return <><div className="welcome-row"><div><div className="eyebrow">MONDAY, OCTOBER 12, 2026 <i /> YOUR LEARNING SPACE</div><h1>Welcome back, {data.profile.name} <span className="welcome-star">✦</span></h1><p>Small exchanges lead to big things. Here’s what’s happening in your community.</p></div><button className="button-primary" onClick={() => navigate('My Skills')}><Plus size={17} /> Offer a skill</button></div>
    <div className="stat-grid">{stats.map(([title, value, Icon, foot, tone]) => <article className="stat-card" key={title}><span className={`stat-icon ${tone}`}><Icon size={19} /></span><div className="stat-text"><span>{title}</span><strong>{value}</strong></div><small>{foot}</small></article>)}</div>
    <div className="dashboard-grid"><section className="panel matches-panel"><PanelHeading title="Recommended matches" subtitle="Students with skills that complement yours" action={<button className="text-link" onClick={() => navigate('Find Students')}>View all <ArrowRight size={14} /></button>} /><div className="match-list">{matches.slice(0, 3).map(({ person, score }) => <MatchRow key={person.id} person={person} score={score} data={data} sendRequest={sendRequest} />)}{!matches.length && <EmptyState icon={Users} title="Your matches are taking shape" message="Add skills you teach and want to learn to find complementary peers." action={() => navigate('My Skills')} actionText="Add skills" />}</div></section>
      <section className="panel popular-panel"><PanelHeading title="Popular skills" subtitle="Trending in your campus community" action={<button className="more-button" aria-label="More popular skills"><MoreHorizontal size={19} /></button>} /><div className="popular-list">{[['React', 'Web Development', 32, 'blue'], ['Python', 'Programming', 28, 'yellow'], ['UI/UX Design', 'Design', 24, 'lavender'], ['Machine Learning', 'AI & ML', 19, 'mint']].map(([name, group, count, tone], index) => <button className="popular-item" key={name} onClick={() => navigate('Discover Skills')}><span className={`popular-rank ${tone}`}>0{index + 1}</span><span className="popular-info"><b>{name}</b><small>{group}</small></span><span className="popular-people"><Users size={13} /> {count}</span><ArrowRight size={15} className="popular-arrow" /></button>)}</div><button className="popular-browse" onClick={() => navigate('Discover Skills')}>Explore skill marketplace <ArrowRight size={14} /></button></section>
      <section className="panel activity-panel"><PanelHeading title="Recent activity" subtitle="Your latest community updates" action={<button className="more-button" aria-label="More activity"><MoreHorizontal size={19} /></button>} /><div className="activity-list">{activity.map(([Icon, color, text, time], index) => <div className="activity-item" key={index}><span className={`activity-icon ${color}`}><Icon size={15} /></span><div><p>{text}</p><small>{time}</small></div></div>)}</div><button className="activity-link" onClick={() => navigate('Exchange Requests')}>See all activity <ArrowRight size={14} /></button></section>
      <section className="panel sessions-panel"><PanelHeading title="Upcoming sessions" subtitle="Make time for a little knowledge exchange" action={<button className="text-link" onClick={() => navigate('My Learning')}>View schedule <ArrowRight size={14} /></button>} /><div className="session-mini-list">{data.sessions.filter((session) => !session.completed).slice(0, 2).map((session) => { const person = people.find((item) => item.id === session.studentId); return <div className="session-mini" key={session.id}><div className="session-date"><b>{dateLabel(session.date).split(' ')[1]}</b><span>{dateLabel(session.date).split(' ')[0]}</span></div><div className="session-mini-info"><b>{session.title}</b><span>{person?.name} <i /> {session.time}</span></div><button className="icon-button" onClick={() => navigate('My Learning')} aria-label="Open session"><ArrowRight size={16} /></button></div> })}{!data.sessions.some((session) => !session.completed) && <div className="empty-inline">No sessions on your calendar yet.</div>}</div></section></div>
    <div className="dashboard-note"><span><Sparkles size={15} /></span><p><b>Learning is better together.</b> Your profile is <strong>{Math.min(100, 45 + data.skills.length * 12)}% complete</strong>. Add a short bio or a new skill to improve your matches.</p><button onClick={() => navigate('My Profile')}>Complete profile <ArrowRight size={14} /></button></div></>
}

function MatchRow({ person, score, data, sendRequest }) {
  const sent = data.requests.some((request) => request.studentId === person.id && request.status === 'Sent')
  return <div className="match-row"><Avatar person={person} /><div className="match-person"><b>{person.name}</b><span>{person.department} <i /> {person.year}</span><div className="match-skills"><span className="skill-chip teach-chip">Teaches {person.teaches[0]}</span><span className="skill-chip learn-chip">Wants {person.wants[0]}</span></div></div><div className="match-score"><b>{score}%</b><span>match</span></div><button className={`button-outline connect-button ${sent ? 'sent' : ''}`} onClick={() => !sent && sendRequest(person, findComplementarySkill(person, data.skills))}>{sent ? <><Check size={14} /> Sent</> : 'Connect'}</button></div>
}

function Select({ value, onChange, options }) {
  return <label className="select-wrap"><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label>
}

function categoryFor(skill) {
  const lower = skill.toLowerCase()
  if (['react', 'javascript', 'html & css', 'typescript', 'accessibility'].includes(lower)) return 'Web Development'
  if (['python', 'java', 'c++'].includes(lower)) return 'Programming'
  if (['machine learning', 'data analysis'].includes(lower)) return 'Artificial Intelligence and Machine Learning'
  if (['figma', 'ui/ux design', 'prototyping'].includes(lower)) return 'UI/UX Design'
  if (['public speaking', 'communication', 'technical writing'].includes(lower)) return 'Communication'
  if (['sql', 'database design', 'mongodb'].includes(lower)) return 'Database Management'
  return 'Academics'
}

function FindStudents({ data, people, sendRequest }) {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All departments')
  const [year, setYear] = useState('All years')
  const [category, setCategory] = useState('All categories')
  const departments = ['All departments', ...new Set(people.map((person) => person.department))]
  const results = people.map((person) => ({ person, score: getMatchScore(person, data.skills) })).filter(({ person }) => {
    const text = `${person.name} ${person.department} ${person.bio} ${person.teaches.join(' ')} ${person.wants.join(' ')}`.toLowerCase()
    return text.includes(search.toLowerCase()) && (department === 'All departments' || person.department === department) && (year === 'All years' || person.year === year) && (category === 'All categories' || [...person.teaches, ...person.wants].some((skill) => categoryFor(skill) === category))
  }).sort((a, b) => b.score - a.score)
  return <><Heading eyebrow="YOUR CAMPUS COMMUNITY" title="Find your people" description="The best learning happens when both sides bring something to the table." action={<span className="result-count"><Users size={16} /> {results.length} students</span>} /><div className="filter-bar"><label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, skill, or interest" /></label><span className="filter-divider" /><SlidersHorizontal size={16} className="filter-icon" /><Select value={department} onChange={setDepartment} options={departments} /><Select value={year} onChange={setYear} options={['All years', '1st Year', '2nd Year', '3rd Year', '4th Year']} /><Select value={category} onChange={setCategory} options={['All categories', ...categories]} /></div><div className="student-grid">{results.map(({ person, score }) => <StudentCard key={person.id} person={person} score={score} data={data} sendRequest={sendRequest} />)}</div>{!results.length && <EmptyState icon={Search} title="No students found" message="Try another search or clear one of your filters." />}</>
}

function StudentCard({ person, score, data, sendRequest }) {
  const sent = data.requests.some((request) => request.studentId === person.id && request.status === 'Sent')
  const connect = () => sendRequest(person, findComplementarySkill(person, data.skills))
  return <article className="student-card"><div className="student-card-top"><Avatar person={person} size="avatar-lg" /><span className="match-badge"><Sparkles size={12} /> {score}% match</span><button className="more-button" aria-label={`More about ${person.name}`}><MoreHorizontal size={19} /></button></div><h3>{person.name}</h3><div className="student-meta"><BriefcaseBusiness size={13} /> {person.department}<i />{person.year}</div><p className="student-bio">{person.bio}</p><div className="student-skill-group"><small>CAN TEACH</small><div>{person.teaches.slice(0, 3).map((skill) => <span className="skill-pill" key={skill}>{skill}</span>)}</div></div><div className="student-skill-group wants-group"><small>WANTS TO LEARN</small><div>{person.wants.slice(0, 2).map((skill) => <span className="skill-pill wants-pill" key={skill}>{skill}</span>)}</div></div><button className="button-primary student-connect" disabled={sent} onClick={connect}>{sent ? <><Check size={15} /> Request sent</> : <><MessageCircle size={15} /> Connect</>}</button></article>
}

function DiscoverSkills({ data, people, sendRequest }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All skills')
  const [sort, setSort] = useState('Popular first')
  const skills = useMemo(() => {
    const grouped = new Map()
    people.forEach((person) => person.teaches.forEach((name) => {
      const item = grouped.get(name) || { name, category: categoryFor(name), count: 0, people: [] }
      item.count += 1
      item.people.push(person)
      grouped.set(name, item)
    }))
    const list = [...grouped.values()].filter((item) => `${item.name} ${item.category} ${item.people.map((person) => person.name).join(' ')}`.toLowerCase().includes(search.toLowerCase()) && (category === 'All skills' || item.category === category))
    return list.sort((a, b) => sort === 'Name A–Z' ? a.name.localeCompare(b.name) : b.count - a.count || a.name.localeCompare(b.name))
  }, [people, search, category, sort])
  return <><Heading eyebrow="THE SKILL MARKETPLACE" title="Discover skills" description="Browse what students around you are excited to teach." action={<span className="result-count"><Sparkles size={16} /> {skills.length} skills</span>} /><div className="market-hero"><div><span className="market-tag"><Sparkles size={13} /> MADE FOR PEER LEARNING</span><h2>Trade what you know<br />for what you want to learn.</h2><p>Every student has something worth sharing.</p></div><div className="market-art"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="art-core"><BookOpen size={28} /></span><span className="art-dot art-dot-one"><Sparkles size={16} /></span><span className="art-dot art-dot-two"><Users size={16} /></span></div></div><div className="market-toolbar"><label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search skills or students" /></label><Select value={category} onChange={setCategory} options={['All skills', ...categories]} /><Select value={sort} onChange={setSort} options={['Popular first', 'Name A–Z']} /><span className="market-result">Showing {skills.length} skills</span></div><div className="market-grid">{skills.map((skill) => <MarketCard key={skill.name} skill={skill} data={data} sendRequest={sendRequest} />)}</div>{!skills.length && <EmptyState icon={Search} title="No skills match that" message="Adjust your search or category." />}</>
}

function MarketCard({ skill, data, sendRequest }) {
  const [index, setIndex] = useState(0)
  const [sent, setSent] = useState(false)
  const person = skill.people[index % skill.people.length]
  const wantsSkill = data.skills.some((item) => item.type === 'learn' && item.name.toLowerCase() === skill.name.toLowerCase())
  const request = () => {
    const offered = data.skills.find((item) => item.type === 'teach')
    if (offered && sendRequest(person, { requested: skill.name, offered: offered.name })) setSent(true)
  }
  const tone = skill.category.includes('Programming') ? 'category-blue' : skill.category.includes('Artificial') ? 'category-mint' : skill.category.includes('Design') ? 'category-lavender' : skill.category.includes('Communication') ? 'category-peach' : 'category-indigo'
  return <article className="market-card"><div className="market-card-top"><span className={`category-icon ${tone}`}><BookOpen size={17} /></span><span className="skill-category-label">{shortCategory(skill.category)}</span><span className="market-skill-count"><Users size={12} /> {skill.count}</span></div><h3>{skill.name}</h3><p className="market-card-caption">{skill.count} {skill.count === 1 ? 'student is' : 'students are'} ready to exchange knowledge.</p><div className="teacher-strip"><Avatar person={person} size="avatar-sm" /><div><b>{person.name}</b><small>{person.department} · {person.year}</small></div>{skill.people.length > 1 && <button onClick={() => setIndex((index + 1) % skill.people.length)} aria-label="Show another student"><ArrowRight size={14} /></button>}</div><button className="button-outline market-request" disabled={!wantsSkill || sent} onClick={request}>{sent ? <><Check size={14} /> Requested</> : wantsSkill ? 'Request exchange' : 'Add a skill to exchange'}</button></article>
}

function MySkills({ data, update, notify }) {
  const [filter, setFilter] = useState('All skills')
  const [editing, setEditing] = useState(null)
  const visible = data.skills.filter((skill) => filter === 'All skills' || (filter === 'I can teach' ? skill.type === 'teach' : skill.type === 'learn'))
  const save = (form) => {
    if (data.skills.some((skill) => skill.name.toLowerCase() === form.name.trim().toLowerCase() && skill.type === form.type && skill.id !== form.id)) return notify('That skill is already in this list.')
    const skill = { ...form, name: form.name.trim(), id: form.id || `skill-${Date.now()}` }
    update('skills', (skills) => form.id ? skills.map((item) => item.id === form.id ? skill : item) : [...skills, skill])
    setEditing(null)
    notify(form.id ? 'Skill updated.' : 'Skill added to your profile.')
  }
  const remove = (id) => { update('skills', (skills) => skills.filter((skill) => skill.id !== id)); notify('Skill removed.') }
  return <><Heading eyebrow="YOUR PERSONAL SKILLSET" title="My skills" description="Keep your exchange profile current. Every skill can open a new door." action={<button className="button-primary" onClick={() => setEditing({ type: 'teach' })}><Plus size={17} /> Add a skill</button>} /><div className="skill-summary"><div><span className="summary-icon teach-summary"><Sparkles size={17} /></span><div><b>{data.skills.filter((skill) => skill.type === 'teach').length}</b><small>Skills I can teach</small></div></div><div><span className="summary-icon learn-summary"><BookOpen size={17} /></span><div><b>{data.skills.filter((skill) => skill.type === 'learn').length}</b><small>Skills I want to learn</small></div></div><button className="button-outline" onClick={() => setEditing({ type: 'learn' })}><Plus size={15} /> Add learning goal</button></div><div className="list-toolbar"><div className="segmented">{['All skills', 'I can teach', 'I want to learn'].map((item) => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><span>{visible.length} skills in your profile</span></div><div className="my-skills-list">{visible.map((skill) => <article className="my-skill-row" key={skill.id}><span className={`my-skill-icon ${skill.type === 'teach' ? 'teach-summary' : 'learn-summary'}`}>{skill.type === 'teach' ? <Sparkles size={17} /> : <BookOpen size={17} />}</span><div className="my-skill-detail"><div><h3>{skill.name}</h3><span className={`type-label ${skill.type}`}>{skill.type === 'teach' ? 'TEACHING' : 'LEARNING'}</span></div><p>{skill.description}</p><div className="my-skill-meta"><span>{shortCategory(skill.category)}</span><i />{skill.level}</div></div><div className="skill-row-actions"><button className="icon-button" onClick={() => setEditing(skill)} aria-label={`Edit ${skill.name}`}><SlidersHorizontal size={16} /></button><button className="icon-button delete-button" onClick={() => remove(skill.id)} aria-label={`Delete ${skill.name}`}><X size={17} /></button></div></article>)}{!visible.length && <EmptyState icon={Sparkles} title="Nothing here yet" message="Add a skill to start building your exchange profile." action={() => setEditing({ type: filter === 'I want to learn' ? 'learn' : 'teach' })} actionText="Add a skill" />}</div>{editing && <SkillModal skill={editing} onClose={() => setEditing(null)} onSave={save} />}</>
}

function SkillModal({ skill, onClose, onSave }) {
  const [form, setForm] = useState({ id: skill.id, name: skill.name || '', type: skill.type || 'teach', category: skill.category || categories[0], level: skill.level || 'Beginner', description: skill.description || '' })
  const [error, setError] = useState('')
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal" onSubmit={(event) => { event.preventDefault(); if (!form.name.trim()) return setError('Enter a skill name.'); if (!form.description.trim()) return setError('Add a short description.'); onSave(form) }}><div className="modal-heading"><div><span className="eyebrow">YOUR SKILL PROFILE</span><h2>{skill.id ? 'Edit skill' : 'Add a skill'}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div><div className="form-label">I want to <span className="segmented form-segmented"><button type="button" className={form.type === 'teach' ? 'selected' : ''} onClick={() => change('type', 'teach')}>Teach</button><button type="button" className={form.type === 'learn' ? 'selected' : ''} onClick={() => change('type', 'learn')}>Learn</button></span></div><label className="form-label">Skill name<input autoFocus value={form.name} onChange={(event) => change('name', event.target.value)} placeholder="e.g. Product design" maxLength={40} /></label><div className="form-two-col"><label className="form-label">Category<select value={form.category} onChange={(event) => change('category', event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="form-label">{form.type === 'teach' ? 'Proficiency' : 'Current level'}<select value={form.level} onChange={(event) => change('level', event.target.value)}>{['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((item) => <option key={item}>{item}</option>)}</select></label></div><label className="form-label">A short description<textarea value={form.description} onChange={(event) => change('description', event.target.value)} placeholder="What would you like others to know?" rows="3" maxLength={140} /></label>{error && <div className="form-error"><XCircle size={15} /> {error}</div>}<div className="modal-actions"><button type="button" className="button-outline" onClick={onClose}>Cancel</button><button className="button-primary" type="submit">{skill.id ? 'Save changes' : 'Add to profile'}</button></div></form></div>
}

function Requests({ data, people, changeRequest }) {
  const [tab, setTab] = useState('Received')
  const tabs = ['Received', 'Sent', 'Accepted', 'Rejected']
  const requests = data.requests.filter((request) => request.status === tab)
  return <><Heading eyebrow="YOUR EXCHANGE INBOX" title="Exchange requests" description="A good exchange starts with a conversation." action={<span className="result-count"><MessageCircle size={16} /> {data.requests.length} total</span>} /><div className="request-banner"><span className="request-banner-icon"><MessageCircle size={20} /></span><div><b>{data.requests.filter((request) => request.status === 'Received').length} requests need your attention</b><span>Respond to keep the learning momentum going.</span></div><Sparkles className="banner-spark" size={22} /></div><div className="request-tabs">{tabs.map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}<span>{data.requests.filter((request) => request.status === item).length}</span></button>)}</div><div className="request-list">{requests.map((request) => { const person = people.find((item) => item.id === request.studentId); return <article className="request-card" key={request.id}><Avatar person={person || { name: 'Student' }} /><div className="request-main"><div className="request-title"><b>{person?.name || 'Student'}</b><span className={`status-badge status-${request.status.toLowerCase()}`}>{request.status}</span></div><p>{request.status === 'Received' ? 'would like to exchange' : request.status === 'Sent' ? 'You requested an exchange' : `${request.status} exchange`} <b>{request.requestedSkill}</b> for <b>{request.offeredSkill}</b></p><div className="request-meta"><span>{person?.department}</span><i />{person?.year}<i /><span>{dateLabel(request.date)}</span></div></div><div className="request-actions">{request.status === 'Received' && <><button className="button-primary" onClick={() => changeRequest(request.id, 'Accepted')}><Check size={15} /> Accept</button><button className="button-outline" onClick={() => changeRequest(request.id, 'Rejected')}>Decline</button></>}{request.status === 'Sent' && <button className="button-outline" onClick={() => changeRequest(request.id, 'Rejected')}><X size={14} /> Cancel</button>}{request.status === 'Accepted' && <span className="accepted-label"><CheckCircle2 size={15} /> Exchange active</span>}</div></article> })}{!requests.length && <EmptyState icon={tab === 'Rejected' ? XCircle : CheckCircle2} title={`No ${tab.toLowerCase()} requests`} message="Requests in this category will appear here when there are updates." />}</div></>
}

function Learning({ data, update, people, notify }) {
  const finish = (session) => {
    update('sessions', (sessions) => sessions.map((item) => item.id === session.id ? { ...item, progress: Math.min(item.total, item.progress + 1), completed: item.progress + 1 >= item.total } : item))
    notify(session.progress + 1 >= session.total ? 'Learning path completed. Nicely done!' : 'Progress updated.')
  }
  return <><Heading eyebrow="YOUR GROWTH, IN MOTION" title="My learning" description="Every session is a small step toward a skill that’s yours." action={<button className="button-outline" onClick={() => notify('Your calendar is up to date.')}><Clock3 size={15} /> Calendar</button>} /><div className="learning-overview"><div className="learning-total"><span className="learning-overview-icon"><BookOpen size={19} /></span><div><b>{data.sessions.filter((session) => !session.completed).length}</b><span>active learning paths</span></div></div><div className="learning-total"><span className="learning-overview-icon completed-icon"><CheckCircle2 size={19} /></span><div><b>{data.sessions.filter((session) => session.completed).length}</b><span>completed paths</span></div></div><div className="learning-quote"><Sparkles size={18} /><p>“The beautiful thing about learning is that nobody can take it away from you.”<small>Keep showing up for yourself.</small></p></div></div><div className="section-header"><div><h2>Your learning paths</h2><p>Demo sessions with your student partners</p></div><span className="demo-data-label"><i /> SAMPLE DATA</span></div><div className="learning-list">{data.sessions.map((session) => { const person = people.find((item) => item.id === session.studentId); const percent = Math.round(session.progress / session.total * 100); return <article className="learning-card" key={session.id}><div className="learning-card-top"><span className="learning-skill-icon"><BookOpen size={17} /></span><span className={`status-badge ${session.completed ? 'status-accepted' : 'status-in-progress'}`}>{session.completed ? 'Completed' : 'In progress'}</span><button className="more-button" aria-label="More learning options"><MoreHorizontal size={18} /></button></div><h3>{session.title}</h3><p className="learning-with">Learning <b>{session.skill}</b> with <Avatar person={person || { name: 'Student' }} size="avatar-xs" /> <strong>{person?.name}</strong></p><div className="progress-label"><span>Progress</span><b>{session.progress} of {session.total} sessions</b></div><div className="progress-track"><i style={{ width: `${percent}%` }} /></div><div className="learning-card-foot"><span><Clock3 size={14} /> Next session · {dateLabel(session.date)} at {session.time}</span><button className="button-outline" disabled={session.completed} onClick={() => finish(session)}>{session.completed ? <><Check size={14} /> All done</> : <><CheckCircle2 size={14} /> Mark session done</>}</button></div></article> })}{!data.sessions.length && <EmptyState icon={BookOpen} title="Your learning journey starts here" message="Accepted exchanges can be tracked here." />}</div></>
}

function Profile({ data, update, notify }) {
  const [form, setForm] = useState({ ...data.profile, interestsText: data.profile.interests.join(', ') })
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const save = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.bio.trim()) return notify('Name and bio are required.')
    update('profile', { name: form.name.trim(), department: form.department, year: form.year, bio: form.bio.trim(), availability: form.availability, interests: form.interestsText.split(',').map((item) => item.trim()).filter(Boolean) })
    notify('Profile updated.')
  }
  return <><Heading eyebrow="YOUR STUDENT IDENTITY" title="My profile" description="A little about you helps your future learning partners find you." action={<button className="button-primary" form="profile-form" type="submit"><Check size={16} /> Save profile</button>} /><div className="profile-layout"><aside className="profile-preview"><div className="profile-cover"><span className="cover-orbit" /><Sparkles className="cover-spark" size={20} /></div><div className="profile-avatar-wrap"><Avatar person={{ ...data.profile, color: 'indigo' }} size="avatar-xl" /></div><div className="profile-preview-content"><span className="profile-status"><i /> OPEN TO LEARN</span><h2>{data.profile.name}</h2><p>{data.profile.department} · {data.profile.year}</p><div className="profile-bio-preview">{data.profile.bio}</div><div className="profile-preview-section"><small>WANTS TO LEARN</small><div>{data.profile.interests.map((item) => <span className="skill-pill wants-pill" key={item}>{item}</span>)}</div></div><div className="profile-availability"><Clock3 size={14} /><span>Available</span><b>{data.profile.availability}</b></div></div></aside><form id="profile-form" className="profile-form" onSubmit={save}><div className="form-section-heading"><div><h2>Personal details</h2><p>Introduce yourself to the SkillSync community.</p></div></div><label className="form-label">Full name<input value={form.name} onChange={(event) => change('name', event.target.value)} required maxLength={60} /></label><div className="form-two-col"><label className="form-label">Department<select value={form.department} onChange={(event) => change('department', event.target.value)}>{['Computer Science', 'Information Technology', 'Design', 'Electronics', 'Business', 'Other'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="form-label">Year of study<select value={form.year} onChange={(event) => change('year', event.target.value)}>{['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'].map((item) => <option key={item}>{item}</option>)}</select></label></div><label className="form-label">A little about you<textarea value={form.bio} onChange={(event) => change('bio', event.target.value)} rows="4" maxLength={240} required /></label><div className="form-section-heading profile-subhead"><div><h2>Learning preferences</h2><p>Help us find people you’ll click with.</p></div></div><label className="form-label">Availability<select value={form.availability} onChange={(event) => change('availability', event.target.value)}>{['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Weekends', 'Flexible'].map((item) => <option key={item}>{item}</option>)}</select></label><label className="form-label">Skills you’re interested in<input value={form.interestsText} onChange={(event) => change('interestsText', event.target.value)} placeholder="Comma-separated interests" /><small className="field-hint">Separate each interest with a comma.</small></label></form></div></>
}

function SettingsPage({ data, update, notify }) {
  const [settings, setSettings] = useState({ email: true, matches: true, sessions: false, compact: false })
  const [confirmReset, setConfirmReset] = useState(false)
  const toggle = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }))
  const reset = () => {
    update('profile', initialData.profile); update('skills', initialData.skills); update('requests', initialData.requests); update('sessions', initialData.sessions)
    setConfirmReset(false); notify('Demo data restored to its starting state.')
  }
  return <><Heading eyebrow="MAKE SKILLSYNC YOURS" title="Settings" description="Fine-tune your experience and demo data preferences." /><div className="settings-layout"><section className="settings-section"><div className="form-section-heading"><div><h2>Notifications</h2><p>Choose what’s worth a nudge.</p></div></div>{[['email', 'Email updates', 'A weekly digest of your exchange activity.'], ['matches', 'New match suggestions', 'When a student complements your skills.'], ['sessions', 'Session reminders', 'A reminder before upcoming learning sessions.']].map(([key, title, detail]) => <div className="setting-row" key={key}><div><b>{title}</b><span>{detail}</span></div><button role="switch" aria-checked={settings[key]} className={`toggle ${settings[key] ? 'on' : ''}`} onClick={() => toggle(key)} aria-label={title}><i /></button></div>)}<div className="form-section-heading settings-subheading"><div><h2>Display</h2><p>Adjust how information is shown.</p></div></div><div className="setting-row"><div><b>Compact lists</b><span>Show more student and skill rows at once.</span></div><button role="switch" aria-checked={settings.compact} className={`toggle ${settings.compact ? 'on' : ''}`} onClick={() => toggle('compact')} aria-label="Compact lists"><i /></button></div></section><section className="settings-section data-settings"><div className="form-section-heading"><div><h2>Demo data</h2><p>This prototype stores changes in this browser only.</p></div></div><div className="data-info"><span className="data-info-icon"><BriefcaseBusiness size={18} /></span><div><b>Local demo profile</b><p>{data.skills.length} skills · {data.requests.length} requests · {data.sessions.length} learning sessions</p></div></div><button className="button-outline reset-button" onClick={() => setConfirmReset(true)}>Restore sample data</button><p className="privacy-note"><span>i</span> No connection to the C++ program or a backend.</p></section></div>{confirmReset && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setConfirmReset(false)}><div className="modal confirm-modal"><div className="modal-heading"><div><span className="eyebrow">DEMO DATA</span><h2>Restore sample data?</h2></div><button className="icon-button" onClick={() => setConfirmReset(false)} aria-label="Close"><X size={19} /></button></div><p>This replaces saved skills, requests, and sessions with the original fictional examples.</p><div className="modal-actions"><button className="button-outline" onClick={() => setConfirmReset(false)}>Keep my data</button><button className="button-primary" onClick={reset}>Restore data</button></div></div></div>}</>
}

export default App
