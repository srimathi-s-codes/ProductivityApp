import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaRegCircle, FaTasks, FaClock, FaBook, FaCalendarAlt, FaPlus, FaTimes, FaFire, FaStar } from 'react-icons/fa';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { useMemo, useState, useEffect, useRef } from 'react';
import { habits as initialHabits, tasks as initialTasks, studyEntries } from './data/mockData';
import type { Task } from './data/mockData';

const navItems = [
  { to: '/', label: 'Dashboard', icon: FaTasks },
  { to: '/focus', label: 'Focus', icon: FaClock },
  { to: '/notes', label: 'Notes', icon: FaBook },
  { to: '/planner', label: 'Planner', icon: FaCalendarAlt },
];

// ── shared card style ──────────────────────────────────────────────
const card = 'rounded-3xl bg-white/80 backdrop-blur border border-[#FF97D0]/30 shadow-card p-5';

export default function App() {
  const location = useLocation();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [habits, setHabits] = useState(initialHabits);
  const studyHours = studyEntries.reduce((s, e) => s + e.hours, 0);
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const todayTasks = useMemo(() => tasks.filter(t => !t.completed).slice(0, 3), [tasks]);

  const toggleTask = (id: string) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg,#fdf0ff 0%,#fff5fb 45%,#fffef0 100%)' }}>
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 pb-28 pt-5">

        {/* ── Header ── */}
        <header className="mb-5 flex items-center justify-between rounded-3xl border border-[#FF97D0]/40 bg-white/70 px-5 py-4 shadow-card backdrop-blur">
          <div>
            <p className="text-xs font-800 uppercase tracking-widest" style={{ color: '#B331F1' }}>✨ FocusForge</p>
            <h1 className="text-lg font-extrabold" style={{ color: '#FF62BB' }}>Your cute command center 🌸</h1>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-lg" style={{ background: 'linear-gradient(135deg,#FF62BB,#B331F1)' }}>
            <span>🌟</span>
          </div>
        </header>

        {/* ── Pages ── */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <DashboardPage
                todayTasks={todayTasks}
                completedCount={completedCount}
                pendingCount={pendingCount}
                studyHours={studyHours}
                tasks={tasks}
                habits={habits}
                setHabits={setHabits}
                toggleTask={toggleTask}
                setTasks={setTasks}
              />
            } />
            <Route path="/focus" element={<FocusPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/planner" element={<PlannerPage tasks={tasks} />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-[#FF97D0]/30 bg-white/90 px-3 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-2xl justify-around">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 text-xs font-bold transition-all"
              style={location.pathname === to
                ? { color: '#B331F1', background: 'linear-gradient(135deg,#FF97D0,#B331F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                : { color: '#FF97D0' }}>
              <Icon className="text-base" style={location.pathname === to ? { color: '#B331F1' } : { color: '#FF97D0' }} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ══════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════
function DashboardPage({ todayTasks, completedCount, pendingCount, studyHours, tasks, habits, setHabits, toggleTask, setTasks }: {
  todayTasks: Task[]; completedCount: number; pendingCount: number; studyHours: number;
  tasks: Task[]; habits: typeof initialHabits; setHabits: React.Dispatch<React.SetStateAction<typeof initialHabits>>;
  toggleTask: (id: string) => void; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now().toString(), title: newTask.trim(),
      category: 'Personal', priority: 'Medium', dueDate: '', completed: false, reminder: '', tags: []
    }]);
    setNewTask('');
    setShowAdd(false);
  };

  const toggleHabit = (id: string) =>
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completion: h.completion >= 100 ? 0 : Math.min(100, h.completion + 14) } : h));

  const stats = [
    { label: "Today's Tasks", value: todayTasks.length, icon: '📋', bg: '#FBF5A7' },
    { label: 'Pending', value: pendingCount, icon: '⏳', bg: '#FF97D0' },
    { label: 'Completed', value: completedCount, icon: '✅', bg: '#FF62BB' },
    { label: 'Study hrs', value: `${studyHours.toFixed(1)}h`, icon: '📚', bg: '#B331F1' },
  ];

  return (
    <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">

      {/* Welcome */}
      <div className={card}>
        <p className="text-sm font-semibold" style={{ color: '#FF97D0' }}>Good morning! ☀️</p>
        <h2 className="mt-1 text-xl font-extrabold" style={{ color: '#B331F1' }}>Ready to slay your day? 💜</h2>
        <div className="mt-3 rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg,#FF62BB,#B331F1)' }}>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">✨ Daily Motivation</p>
          <p className="mt-1 text-sm font-bold">"Small consistent actions create extraordinary results."</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-3xl border border-[#FF97D0]/20 bg-white/80 p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: '#FF62BB' }}>{s.label}</span>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className="mt-2 text-3xl font-extrabold" style={{ color: '#B331F1' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Today's Tasks */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-extrabold" style={{ color: '#B331F1' }}>🌸 Today's Focus</h3>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg,#FF62BB,#B331F1)' }}>
            <FaPlus className="text-[10px]" /> Quick Add
          </button>
        </div>

        {/* Add Task Modal */}
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="mb-3 rounded-2xl border border-[#FF97D0]/40 bg-[#FBF5A7]/60 p-3">
              <input value={newTask} onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="What do you want to do? 🌟"
                className="w-full rounded-xl border border-[#FF97D0]/40 bg-white/80 px-3 py-2 text-sm font-semibold outline-none placeholder:text-[#FF97D0]/60"
                style={{ color: '#B331F1' }} autoFocus />
              <div className="mt-2 flex gap-2">
                <button onClick={addTask}
                  className="flex-1 rounded-xl py-1.5 text-sm font-bold text-white transition-transform active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#FF62BB,#B331F1)' }}>Add ✨</button>
                <button onClick={() => setShowAdd(false)}
                  className="rounded-xl px-3 py-1.5 text-sm font-bold transition-transform active:scale-95"
                  style={{ background: '#FF97D0', color: 'white' }}>
                  <FaTimes />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {tasks.slice(0, 5).map(task => (
            <button key={task.id} onClick={() => toggleTask(task.id)}
              className="flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all active:scale-[0.98]"
              style={task.completed
                ? { borderColor: '#FF97D0', background: 'linear-gradient(135deg,#FF97D0,#FF62BB)' }
                : { borderColor: '#FF97D0', background: 'white' }}>
              {task.completed
                ? <FaCheckCircle style={{ color: 'white', flexShrink: 0 }} />
                : <FaRegCircle style={{ color: '#FF97D0', flexShrink: 0 }} />}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${task.completed ? 'line-through' : ''}`}
                  style={{ color: task.completed ? 'white' : '#B331F1' }}>{task.title}</p>
                <p className="text-xs" style={{ color: task.completed ? 'rgba(255,255,255,0.8)' : '#FF97D0' }}>
                  {task.category} · {task.priority}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Habit Pulse */}
      <div className={card}>
        <h3 className="mb-3 font-extrabold" style={{ color: '#B331F1' }}>💫 Habit Pulse</h3>
        <div className="space-y-3">
          {habits.map(habit => (
            <div key={habit.id}>
              <div className="mb-1 flex items-center justify-between">
                <button onClick={() => toggleHabit(habit.id)}
                  className="flex items-center gap-2 text-sm font-bold transition-transform active:scale-95"
                  style={{ color: '#FF62BB' }}>
                  <FaFire style={{ color: '#FF62BB' }} /> {habit.name}
                </button>
                <span className="text-xs font-bold" style={{ color: '#B331F1' }}>{habit.completion}% 🔥</span>
              </div>
              <div className="h-3 w-full rounded-full" style={{ background: '#FBF5A7' }}>
                <motion.div className="h-3 rounded-full" animate={{ width: `${habit.completion}%` }} transition={{ duration: 0.5 }}
                  style={{ background: 'linear-gradient(90deg,#FF97D0,#B331F1)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Snapshot */}
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-extrabold" style={{ color: '#B331F1' }}>📊 Productivity Snapshot</h3>
          <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#FF62BB,#B331F1)' }}>82% weekly 🌟</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Streak', value: '14 days', icon: '🔥', bg: '#FBF5A7' },
            { label: 'Pomodoros', value: '21', icon: '🍅', bg: '#FF97D0' },
            { label: 'Focus hrs', value: '8.5h', icon: '⚡', bg: '#FF62BB' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: s.bg + '33' }}>
              <p className="text-xl">{s.icon}</p>
              <p className="text-lg font-extrabold" style={{ color: '#B331F1' }}>{s.value}</p>
              <p className="text-xs font-semibold" style={{ color: '#FF62BB' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}

// ══════════════════════════════════════════════
// FOCUS PAGE — fully working Pomodoro timer
// ══════════════════════════════════════════════
function FocusPage() {
  const MODES = [
    { label: 'Focus', mins: 25, icon: '🍅' },
    { label: 'Short Break', mins: 5, icon: '☕' },
    { label: 'Long Break', mins: 15, icon: '🌸' },
  ];
  const [modeIdx, setModeIdx] = useState(0);
  const [seconds, setSeconds] = useState(MODES[0].mins * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSeconds(MODES[modeIdx].mins * 60);
    setRunning(false);
  }, [modeIdx]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (modeIdx === 0) setSessions(n => n + 1);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const reset = () => { setRunning(false); setSeconds(MODES[modeIdx].mins * 60); };
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const progress = seconds / (MODES[modeIdx].mins * 60);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">
      <div className={card}>
        <h2 className="text-xl font-extrabold" style={{ color: '#B331F1' }}>🍅 Pomodoro Focus</h2>
        <p className="mt-1 text-sm font-semibold" style={{ color: '#FF97D0' }}>Stay focused, take cute breaks 🌸</p>

        {/* Mode selector */}
        <div className="mt-4 flex gap-2">
          {MODES.map((m, i) => (
            <button key={m.label} onClick={() => setModeIdx(i)}
              className="flex-1 rounded-2xl py-2 text-xs font-bold transition-all active:scale-95"
              style={modeIdx === i
                ? { background: 'linear-gradient(135deg,#FF62BB,#B331F1)', color: 'white' }
                : { background: '#FF97D0' + '33', color: '#FF62BB' }}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* Timer circle */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full"
            style={{ background: `conic-gradient(#FF62BB ${progress * 360}deg, #FBF5A7 0deg)` }}>
            <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white">
              <p className="text-5xl font-extrabold" style={{ color: '#B331F1' }}>{mm}:{ss}</p>
              <p className="text-xs font-bold" style={{ color: '#FF97D0' }}>{MODES[modeIdx].label}</p>
            </div>
          </div>
          <p className="mt-3 text-sm font-bold" style={{ color: '#FF62BB' }}>🍅 Sessions today: {sessions}</p>
        </div>

        {/* Controls */}
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={() => setRunning(r => !r)}
            className="rounded-full px-8 py-3 text-sm font-extrabold text-white shadow-glow transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg,#FF62BB,#B331F1)' }}>
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
          <button onClick={reset}
            className="rounded-full px-5 py-3 text-sm font-extrabold transition-transform active:scale-95"
            style={{ background: '#FBF5A7', color: '#B331F1' }}>
            🔄 Reset
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════
// NOTES PAGE — create, pin, delete notes
// ══════════════════════════════════════════════
interface Note { id: string; text: string; pinned: boolean; }

function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', text: '🌸 Review design system', pinned: true },
    { id: '2', text: '💡 Ideas for new features', pinned: false },
  ]);
  const [input, setInput] = useState('');

  const addNote = () => {
    if (!input.trim()) return;
    setNotes(prev => [{ id: Date.now().toString(), text: input.trim(), pinned: false }, ...prev]);
    setInput('');
  };

  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));
  const togglePin = (id: string) => setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));

  const sorted = [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">
      <div className={card}>
        <h2 className="text-xl font-extrabold" style={{ color: '#B331F1' }}>📝 My Notes</h2>
        <p className="mt-1 text-sm font-semibold" style={{ color: '#FF97D0' }}>Capture your sparks of inspiration ✨</p>

        {/* Input */}
        <div className="mt-4 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addNote()}
            placeholder="Write a note... 🌟"
            className="flex-1 rounded-2xl border border-[#FF97D0]/40 bg-[#FBF5A7]/50 px-4 py-2 text-sm font-semibold outline-none placeholder:text-[#FF97D0]/60"
            style={{ color: '#B331F1' }} />
          <button onClick={addNote}
            className="rounded-2xl px-4 py-2 text-sm font-extrabold text-white transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg,#FF62BB,#B331F1)' }}>
            <FaPlus />
          </button>
        </div>

        {/* Notes list */}
        <div className="mt-4 space-y-2">
          <AnimatePresence>
            {sorted.map(note => (
              <motion.div key={note.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="flex items-start gap-2 rounded-2xl border p-3"
                style={note.pinned
                  ? { borderColor: '#FF62BB', background: 'linear-gradient(135deg,#FF97D0,#FF62BB)' }
                  : { borderColor: '#FF97D0', background: '#FBF5A7' + '66' }}>
                <p className="flex-1 text-sm font-semibold" style={{ color: note.pinned ? 'white' : '#B331F1' }}>{note.text}</p>
                <button onClick={() => togglePin(note.id)} title="Pin"
                  className="transition-transform active:scale-90"
                  style={{ color: note.pinned ? 'white' : '#FF97D0' }}>
                  <FaStar className="text-xs" />
                </button>
                <button onClick={() => deleteNote(note.id)} title="Delete"
                  className="transition-transform active:scale-90"
                  style={{ color: note.pinned ? 'white' : '#FF62BB' }}>
                  <FaTimes className="text-xs" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {notes.length === 0 && (
            <p className="py-6 text-center text-sm font-semibold" style={{ color: '#FF97D0' }}>No notes yet! Add one above 🌸</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════
// PLANNER PAGE — weekly calendar + task list
// ══════════════════════════════════════════════
function PlannerPage({ tasks }: { tasks: Task[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1;
  const [selectedDay, setSelectedDay] = useState(todayIdx);

  // Generate dates for current week
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - todayIdx);

  const weekDates = days.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.getDate();
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">
      <div className={card}>
        <h2 className="text-xl font-extrabold" style={{ color: '#B331F1' }}>📅 Weekly Planner</h2>
        <p className="mt-1 text-sm font-semibold" style={{ color: '#FF97D0' }}>Plan your week with love 💜</p>

        {/* Day picker */}
        <div className="mt-4 grid grid-cols-7 gap-1">
          {days.map((day, i) => (
            <button key={day} onClick={() => setSelectedDay(i)}
              className="flex flex-col items-center rounded-2xl py-2 text-xs font-extrabold transition-all active:scale-95"
              style={selectedDay === i
                ? { background: 'linear-gradient(135deg,#FF62BB,#B331F1)', color: 'white' }
                : i === todayIdx
                  ? { background: '#FBF5A7', color: '#B331F1' }
                  : { background: '#FF97D0' + '22', color: '#FF97D0' }}>
              <span>{day}</span>
              <span className="mt-0.5 text-[10px]">{weekDates[i]}</span>
            </button>
          ))}
        </div>

        {/* Selected day label */}
        <div className="mt-4 rounded-2xl p-3 text-center" style={{ background: 'linear-gradient(135deg,#FF97D0,#FF62BB)' }}>
          <p className="font-extrabold text-white">{days[selectedDay]} — {selectedDay === todayIdx ? "Today 🌟" : "Upcoming 📌"}</p>
        </div>

        {/* Tasks for selected day */}
        <div className="mt-3 space-y-2">
          {tasks.length > 0 ? tasks.slice(0, 4).map(task => (
            <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-[#FF97D0]/30 bg-[#FBF5A7]/50 px-3 py-2">
              <span className="text-sm">{task.completed ? '✅' : '📌'}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: '#B331F1' }}>{task.title}</p>
                <p className="text-xs font-semibold" style={{ color: '#FF97D0' }}>{task.category} · {task.priority}</p>
              </div>
            </div>
          )) : (
            <p className="py-4 text-center text-sm font-semibold" style={{ color: '#FF97D0' }}>No tasks for this day 🌸</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
