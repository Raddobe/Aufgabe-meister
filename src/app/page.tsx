'use client';

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ListTodo,
  CalendarDays,
  BarChart3,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Lock,
  BookOpen,
  Clock,
  Check,
  Bell,
  Palette,
  HelpCircle,
  Moon,
  CircleCheckBig,
  Target,
  Zap,
  FileText,
} from 'lucide-react';

/* ═══════════════════════════ Types ═══════════════════════════ */
type Screen =
  | 'splash' | 'login' | 'register' | 'dashboard' | 'tasks' | 'add'
  | 'calendar' | 'stats' | 'profile' | 'personal' | 'appearance'
  | 'notifications' | 'help';

type Priority = 'Hoch' | 'Mittel' | 'Niedrig';

interface Task {
  id: string;
  title: string;
  date: string;
  priority: Priority;
  done: boolean;
}

/* ═══════════════════════════ Context ═══════════════════════════ */
interface AppCtxValue {
  screen: Screen;
  isDark: boolean;
  onColor: string;
  mutedColor: string;
  lineColor: string;
  surface: string;
  surface2: string;
  surface3: string;
  surfaceAlpha: string;
  show: (id: Screen) => void;
  toggleTask: (id: string) => void;
}

const AppCtx = createContext<AppCtxValue>(null!);

function useApp() {
  return useContext(AppCtx);
}

/* ═══════════════════════════ Data ═══════════════════════════ */
const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Lesen: Modelltest 1 abschließen', date: 'Heute · 18:00', priority: 'Hoch', done: false },
  { id: '2', title: 'Hören: Audio B2 Lektion 7', date: 'Morgen · 09:30', priority: 'Mittel', done: false },
  { id: '3', title: 'Schreiben: Beschwerdebrief', date: 'Heute · 20:00', priority: 'Hoch', done: true },
  { id: '4', title: 'Wortschatz: 40 neue Begriffe', date: 'Freitag · 17:00', priority: 'Niedrig', done: false },
  { id: '5', title: 'Sprechen: Präsentation üben', date: 'Samstag · 10:00', priority: 'Mittel', done: false },
  { id: '6', title: 'Grammatik: Konjunktiv II üben', date: 'Heute · 19:00', priority: 'Hoch', done: false },
  { id: '7', title: 'Leseverstehen: Zeitungsartikel', date: 'Morgen · 14:00', priority: 'Mittel', done: false },
  { id: '8', title: 'Hörverstehen: Podcast B2', date: 'Donnerstag · 11:00', priority: 'Niedrig', done: false },
  { id: '9', title: 'Schreiben: Essay Übung', date: 'Freitag · 09:00', priority: 'Hoch', done: false },
  { id: '10', title: 'Wortschatz: Irrtümer korrigieren', date: 'Heute · 21:00', priority: 'Mittel', done: true },
  { id: '11', title: 'Sprechen: Rollenspiel Übung', date: 'Samstag · 15:00', priority: 'Hoch', done: false },
  { id: '12', title: 'Grammatik: Nebensätze wiederholen', date: 'Sonntag · 10:00', priority: 'Niedrig', done: true },
];


const WEEK_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const WEEK_ACTIVITY = [44, 72, 55, 88, 68, 95, 61];

/* ═══════════════════════════ Helpers ═══════════════════════════ */

function priorityClass(p: Priority) {
  if (p === 'Mittel') return 'bg-yellow-100 text-yellow-800';
  if (p === 'Niedrig') return 'bg-green-100 text-green-800';
  return 'bg-red-100 text-red-900';
}

function priorityClassDark(p: Priority) {
  if (p === 'Mittel') return 'dark:bg-yellow-900/40 dark:text-yellow-300';
  if (p === 'Niedrig') return 'dark:bg-green-900/40 dark:text-green-300';
  return 'dark:bg-red-900/40 dark:text-red-300';
}

/* ═══════════════════════════ Shared Components (outside main) ═══════════════════════════ */

function IconBtn({ icon, onClick }: { icon: ReactNode; onClick?: () => void }) {
  const { surface3, isDark } = useApp();
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-[14px] border-0 flex items-center justify-center cursor-pointer"
      style={{ background: surface3, color: isDark ? '#eef5ff' : '#152270' }}
    >
      {icon}
    </button>
  );
}

function AppCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { surfaceAlpha, lineColor } = useApp();
  return (
    <div
      className={`rounded-3xl p-[18px] my-3.5 ${className}`}
      style={{
        background: surfaceAlpha,
        border: `1px solid ${lineColor}`,
        boxShadow: '0 10px 24px rgba(20,38,73,.10)',
      }}
    >
      {children}
    </div>
  );
}

function TaskItem({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const { isDark, onColor, mutedColor, lineColor, surface } = useApp();
  return (
    <div
      className={`flex gap-3 items-start p-3.5 rounded-[22px] border cursor-pointer transition-all duration-200 ${
        isDark ? 'hover:bg-[#1c3049]' : 'hover:bg-blue-50/50'
      }`}
      style={{ background: surface, borderColor: lineColor }}
      onClick={onToggle}
    >
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{
          border: `2px solid ${task.done ? '#00865a' : '#152270'}`,
          background: task.done ? '#00865a' : 'transparent',
        }}
      >
        {task.done && <Check size={14} className="text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`font-bold text-sm leading-tight ${task.done ? 'line-through text-gray-400' : ''}`}
            style={{ color: task.done ? undefined : onColor }}
          >
            {task.title}
          </span>
          <span
            className={`text-[11px] font-bold rounded-full px-2 py-1 shrink-0 ${priorityClass(task.priority)} ${isDark ? priorityClassDark(task.priority) : ''}`}
          >
            {task.priority}
          </span>
        </div>
        <div className="text-xs mt-1.5" style={{ color: mutedColor }}>{task.date}</div>
      </div>
    </div>
  );
}

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      className="w-12 h-7 rounded-full p-[3px] cursor-pointer transition-colors duration-200 flex items-center shrink-0"
      style={{ background: on ? '#152270' : '#cbd2e4' }}
      onClick={onToggle}
    >
      <div
        className="w-[22px] h-[22px] bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: on ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </div>
  );
}

function SettingRow({ icon, title, subtitle, children }: { icon: ReactNode; title: string; subtitle: string; children?: ReactNode }) {
  const { onColor, mutedColor, lineColor, surface3, surface } = useApp();
  return (
    <div className="flex items-center gap-3 py-3.5 border-b last:border-b-0" style={{ borderColor: lineColor }}>
      <div className="w-[34px] h-[34px] rounded-xl grid place-items-center shrink-0" style={{ background: surface3, color: '#152270' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0" style={{ background: surface }}>
        <b className="text-sm" style={{ color: onColor }}>{title}</b>
        <p className="text-xs" style={{ color: mutedColor }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function NavItem({ icon, label, navScreen }: { icon: ReactNode; label: string; navScreen: Screen }) {
  const { screen, mutedColor, show } = useApp();
  const active = screen === navScreen;
  return (
    <button
      onClick={() => show(navScreen)}
      className="flex flex-col items-center gap-1 text-[11px] font-bold border-0 bg-transparent cursor-pointer transition-colors duration-200"
      style={{ color: active ? '#152270' : mutedColor }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ═══════════════════════════ Screen Components ═══════════════════════════ */

function SplashScreen() {
  const { onColor, mutedColor } = useApp();
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center text-center px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="w-[88px] h-[88px] rounded-[28px] grid place-items-center text-white shadow-lg mb-5"
        style={{ background: 'linear-gradient(135deg, #152270, #4edea3)' }}
      >
        <CircleCheckBig size={48} />
      </div>
      <div className="text-[31px] font-black leading-tight" style={{ color: onColor }}>AufgabenMeister</div>
      <p className="text-sm mt-2" style={{ color: mutedColor }}>Dein smarter Lern- und Prüfungsplaner</p>
    </motion.div>
  );
}

function LoginScreen() {
  const { onColor, mutedColor, lineColor, surface, surface3, show } = useApp();
  const [email, setEmail] = useState('student@example.com');
  const [pass, setPass] = useState('123456');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="w-full">
        <div className="w-[88px] h-[88px] rounded-[28px] grid place-items-center text-white shadow-lg mb-5 mx-auto" style={{ background: 'linear-gradient(135deg, #152270, #4edea3)' }}>
          <CircleCheckBig size={48} />
        </div>
        <h1 className="text-[29px] font-extrabold leading-tight text-center" style={{ color: onColor }}>Willkommen zurück</h1>
        <p className="text-sm mt-2 mb-4 text-center" style={{ color: mutedColor }}>Melde dich an und plane deine Prüfungsvorbereitung.</p>
        <AppCard>
          <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
            <Mail size={18} style={{ color: mutedColor, flexShrink: 0 }} />
            <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
          </label>
          <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
            <Lock size={18} style={{ color: mutedColor, flexShrink: 0 }} />
            <input type="password" placeholder="Passwort" value={pass} onChange={(e) => setPass(e.target.value)} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
          </label>
          <button className="w-full rounded-[18px] text-white font-bold py-3.5 mt-3 border-0 cursor-pointer" style={{ background: '#152270', boxShadow: '0 10px 24px rgba(20,38,73,.10)' }} onClick={() => show('dashboard')}>Anmelden</button>
          <button className="w-full rounded-[18px] font-bold py-3.5 mt-2.5 border-0 cursor-pointer" style={{ background: surface3, color: '#152270' }} onClick={() => show('register')}>Konto erstellen</button>
          <p className="mt-3 text-center">
            <button className="font-bold border-0 bg-transparent cursor-pointer" style={{ color: '#152270' }} onClick={() => show('help')}>Passwort vergessen?</button>
          </p>
        </AppCard>
      </div>
    </div>
  );
}

function RegisterScreen() {
  const { onColor, mutedColor, lineColor, surface, show } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <IconBtn icon={<ChevronLeft size={22} />} onClick={() => show('login')} />
      <h1 className="text-[25px] font-extrabold mt-3" style={{ color: onColor }}>Registrierung</h1>
      <p className="text-sm mt-1 mb-3" style={{ color: mutedColor }}>Erstelle dein AufgabenMeister-Konto.</p>
      <AppCard>
        <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <User size={18} style={{ color: mutedColor, flexShrink: 0 }} />
          <input placeholder="Vollständiger Name" value={name} onChange={(e) => setName(e.target.value)} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
        </label>
        <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <Mail size={18} style={{ color: mutedColor, flexShrink: 0 }} />
          <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
        </label>
        <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <Lock size={18} style={{ color: mutedColor, flexShrink: 0 }} />
          <input type="password" placeholder="Passwort" value={pass} onChange={(e) => setPass(e.target.value)} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
        </label>
        <button className="w-full rounded-[18px] text-white font-bold py-3.5 mt-3 border-0 cursor-pointer" style={{ background: '#152270', boxShadow: '0 10px 24px rgba(20,38,73,.10)' }} onClick={() => show('dashboard')}>Registrieren</button>
      </AppCard>
    </div>
  );
}

function DashboardScreen({ tasks }: { tasks: Task[] }) {
  const { isDark, onColor, mutedColor, lineColor, surface, surface2, surface3, show, toggleTask } = useApp();
  const todayCount = tasks.filter((t) => t.date.startsWith('Heute')).length;
  const openCount = tasks.filter((t) => !t.done).length;
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold text-xs" style={{ background: surface2, color: '#152270' }}>
            <BookOpen size={13} /> Deutsch B2
          </span>
          <h1 className="text-[25px] font-extrabold mt-2" style={{ color: onColor }}>Übersicht</h1>
          <p className="text-sm mt-0.5" style={{ color: mutedColor }}>Hallo, Maria! Heute hast du {todayCount} wichtige Aufgaben.</p>
        </div>
        <button onClick={() => show('profile')} className="w-11 h-11 rounded-full grid place-items-center font-extrabold border-0 cursor-pointer shrink-0" style={{ background: 'linear-gradient(135deg, #bbc3ff, #6ffbbe)', color: '#152270' }}>M</button>
      </div>

      <AppCard>
        <div className="flex items-center justify-between gap-3">
          <div>
            <b className="text-sm" style={{ color: onColor }}>Prüfung in 24 Tagen</b>
            <p className="text-sm" style={{ color: mutedColor }}>Fortschritt deiner Vorbereitung</p>
          </div>
          <span className="inline-flex items-center rounded-full px-3 py-1.5 font-bold text-xs shrink-0" style={{ background: surface2, color: '#152270' }}>68%</span>
        </div>
        <div className="h-2.5 rounded-full mt-3 overflow-hidden" style={{ background: isDark ? '#1c3049' : '#dfe5f8' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #152270, #4edea3)' }} initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1, ease: 'easeOut' }} />
        </div>
      </AppCard>

      <div className="grid grid-cols-2 gap-3">
        {[
          { val: openCount, label: 'Offene Aufgaben' },
          { val: doneCount, label: 'Erledigt' },
          { val: todayCount, label: 'Heute fällig' },
          { val: 7, label: 'Lernserie' },
        ].map((s) => (
          <div key={s.label} className="rounded-[22px] p-4" style={{ background: surface, border: `1px solid ${lineColor}` }}>
            <b className="text-[28px]" style={{ color: onColor }}>{s.val}</b>
            <small className="block text-xs mt-1" style={{ color: mutedColor }}>{s.label}</small>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-extrabold mt-5 mb-1" style={{ color: onColor }}>Heute</h2>
      {tasks.filter((t) => t.date.startsWith('Heute') || t.date.startsWith('Morgen')).slice(0, 3).map((t) => (
        <TaskItem key={t.id} task={t} onToggle={() => toggleTask(t.id)} />
      ))}
    </div>
  );
}

function TasksScreen({ tasks, taskFilter, setTaskFilter }: { tasks: Task[]; taskFilter: string; setTaskFilter: (f: string) => void }) {
  const { onColor, mutedColor, surface2, show, toggleTask } = useApp();
  const filtered = tasks.filter((t) => {
    if (taskFilter === 'Heute') return t.date.startsWith('Heute');
    if (taskFilter === 'Wichtig') return t.priority === 'Hoch';
    if (taskFilter === 'Erledigt') return t.done;
    return true;
  });

  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-[25px] font-extrabold" style={{ color: onColor }}>Aufgaben</h1>
          <p className="text-sm mt-0.5" style={{ color: mutedColor }}>Plane, priorisiere und erledige deine Lernziele.</p>
        </div>
        <IconBtn icon={<Plus size={22} />} onClick={() => show('add')} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {['Alle', 'Heute', 'Wichtig', 'Erledigt'].map((tab) => (
          <button
            key={tab}
            className="whitespace-nowrap rounded-full px-3.5 py-2 font-bold text-xs border-0 cursor-pointer transition-all duration-200"
            style={{ background: taskFilter === tab ? '#152270' : surface2, color: taskFilter === tab ? '#fff' : '#152270' }}
            onClick={() => setTaskFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-2 max-h-[60vh] overflow-y-auto">
        {filtered.length === 0 && (
          <div className="text-center py-10"><p className="text-sm" style={{ color: mutedColor }}>Keine Aufgaben gefunden.</p></div>
        )}
        {filtered.map((t) => (
          <TaskItem key={t.id} task={t} onToggle={() => toggleTask(t.id)} />
        ))}
      </div>
    </div>
  );
}

function AddTaskScreen({ newTask, setNewTask, onAdd }: { newTask: { title: string; desc: string; date: string; priority: Priority }; setNewTask: (t: { title: string; desc: string; date: string; priority: Priority }) => void; onAdd: () => void }) {
  const { onColor, mutedColor, lineColor, surface, show } = useApp();
  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <IconBtn icon={<ChevronLeft size={22} />} onClick={() => show('tasks')} />
      <h1 className="text-[25px] font-extrabold mt-3" style={{ color: onColor }}>Neue Aufgabe</h1>
      <AppCard>
        <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <FileText size={18} style={{ color: mutedColor, flexShrink: 0 }} />
          <input placeholder="Titel" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
        </label>
        <label className="flex items-start gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <FileText size={18} className="mt-1" style={{ color: mutedColor, flexShrink: 0 }} />
          <textarea placeholder="Beschreibung" value={newTask.desc} onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })} className="border-0 outline-0 bg-transparent w-full min-h-[80px] resize-none" style={{ color: onColor }} />
        </label>
        <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <CalendarDays size={18} style={{ color: mutedColor, flexShrink: 0 }} />
          <input type="date" value={newTask.date} onChange={(e) => setNewTask({ ...newTask, date: e.target.value })} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
        </label>
        <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <Zap size={18} style={{ color: mutedColor, flexShrink: 0 }} />
          <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })} className="border-0 outline-0 bg-transparent w-full cursor-pointer" style={{ color: onColor }}>
            <option value="Hoch">Hoch</option>
            <option value="Mittel">Mittel</option>
            <option value="Niedrig">Niedrig</option>
          </select>
        </label>
        <button className="w-full rounded-[18px] text-white font-bold py-3.5 mt-3 border-0 cursor-pointer" style={{ background: '#152270', boxShadow: '0 10px 24px rgba(20,38,73,.10)' }} onClick={onAdd}>Speichern</button>
      </AppCard>
    </div>
  );
}

function CalendarScreen() {
  const { isDark, onColor, mutedColor, lineColor, surface, surface3 } = useApp();
  const [currentMonth, setCurrentMonth] = useState(5); // June = 5 (0-indexed)
  const [currentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(1);

  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  const prevMonth = () => setCurrentMonth((p) => (p === 0 ? 11 : p - 1));
  const nextMonth = () => setCurrentMonth((p) => (p === 11 ? 0 : p + 1));

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday=0

  const calendarDays: { day: number; isCurrent: boolean; isEvent: boolean }[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push({ day: 0, isCurrent: false, isEvent: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isEvent = [1, 2, 4, 8, 11, 16, 20].includes(d); // sample event days
    calendarDays.push({ day: d, isCurrent: true, isEvent });
  }

  const eventsForDay: Record<number, { time: string; title: string; hours: string }[]> = {
    1: [{ time: '09', title: 'Lesen Prüfungssimulation', hours: '09:00 – 10:30' }, { time: '18', title: 'Wortschatz wiederholen', hours: '18:00 – 18:45' }],
    4: [{ time: '10', title: 'Hören B2 Test', hours: '10:00 – 11:30' }],
    8: [{ time: '14', title: 'Schreiben: Aufsatz', hours: '14:00 – 15:30' }],
    11: [{ time: '09', title: 'Sprechen Übung', hours: '09:00 – 10:00' }, { time: '16', title: 'Grammatik Wiederholung', hours: '16:00 – 17:00' }],
    16: [{ time: '11', title: 'Modelltest komplett', hours: '11:00 – 13:00' }],
    20: [{ time: '09', title: 'Letzte Wiederholung', hours: '09:00 – 10:30' }],
  };

  const dayEvents = eventsForDay[selectedDay] || [];

  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <div className="flex justify-between items-center mb-4">
        <IconBtn icon={<ChevronLeft size={22} />} onClick={prevMonth} />
        <div className="text-center">
          <h1 className="text-[25px] font-extrabold" style={{ color: onColor }}>{monthNames[currentMonth]} {currentYear}</h1>
          <p className="text-sm" style={{ color: mutedColor }}>Kalender & Fristen</p>
        </div>
        <IconBtn icon={<ChevronRight size={22} />} onClick={nextMonth} />
      </div>

      <AppCard className="p-4">
        <div className="grid grid-cols-7 gap-2 text-center">
          {WEEK_LABELS.map((d) => (
            <div key={d} className="text-xs font-bold py-1" style={{ color: mutedColor }}>{d}</div>
          ))}
          {calendarDays.map((d, i) =>
            !d.isCurrent ? (
              <div key={`empty-${i}`} />
            ) : (
              <button
                key={d.day}
                className="aspect-square rounded-[14px] grid place-items-center font-bold text-sm relative border-0 cursor-pointer transition-all duration-150"
                style={{
                  background: d.day === selectedDay ? '#152270' : surface,
                  border: `1px solid ${lineColor}`,
                  color: d.day === selectedDay ? '#fff' : onColor,
                }}
                onClick={() => setSelectedDay(d.day)}
              >
                {d.day}
                {d.isEvent && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full" style={{ background: '#4edea3' }} />}
              </button>
            )
          )}
        </div>
      </AppCard>

      <AppCard>
        <b className="text-sm" style={{ color: onColor }}>Termine am {selectedDay}. {monthNames[currentMonth]}</b>
        {dayEvents.length === 0 && (
          <p className="text-xs mt-3" style={{ color: mutedColor }}>Keine Termine an diesem Tag.</p>
        )}
        {dayEvents.map((ev) => (
          <div key={ev.time} className="flex gap-3 items-start p-3.5 rounded-[22px] border mt-3" style={{ background: surface, borderColor: lineColor }}>
            <div className="w-[34px] h-[34px] rounded-xl grid place-items-center font-bold shrink-0 text-xs" style={{ background: surface3, color: '#152270' }}>{ev.time}</div>
            <div>
              <div className="font-bold text-sm" style={{ color: onColor }}>{ev.title}</div>
              <div className="text-xs mt-1" style={{ color: mutedColor }}>{ev.hours}</div>
            </div>
          </div>
        ))}
      </AppCard>
    </div>
  );
}

function StatsScreen() {
  const { onColor, mutedColor, lineColor, surface, surface2 } = useApp();
  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <h1 className="text-[25px] font-extrabold" style={{ color: onColor }}>Statistiken</h1>
      <p className="text-sm mt-0.5 mb-4" style={{ color: mutedColor }}>Dein Lernfortschritt diese Woche.</p>

      <AppCard>
        <div className="flex items-center justify-between gap-3 mb-3">
          <b className="text-sm" style={{ color: onColor }}>Wöchentliche Aktivität</b>
          <span className="inline-flex items-center rounded-full px-3 py-1.5 font-bold text-xs shrink-0" style={{ background: surface2, color: '#152270' }}>+14%</span>
        </div>
        <div className="flex items-end gap-3 h-[155px] px-1">
          {WEEK_ACTIVITY.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 min-h-[18px]"
              style={{ background: 'linear-gradient(180deg, #4c58a6, #bbc3ff)', borderRadius: '12px 12px 5px 5px' }}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
            />
          ))}
        </div>
        <div className="flex gap-3 mt-2 px-1">
          {WEEK_LABELS.map((d) => (
            <div key={d} className="flex-1 text-center text-[10px] font-bold" style={{ color: mutedColor }}>{d}</div>
          ))}
        </div>
      </AppCard>

      <div className="grid grid-cols-2 gap-3 mt-2">
        {[
          { val: '9.5h', label: 'Lernzeit' },
          { val: '86%', label: 'Erfolgsquote' },
          { val: '32', label: 'Aufgaben' },
          { val: '5', label: 'Streak' },
        ].map((s) => (
          <div key={s.label} className="rounded-[22px] p-4" style={{ background: surface, border: `1px solid ${lineColor}` }}>
            <b className="text-[28px]" style={{ color: onColor }}>{s.val}</b>
            <small className="block text-xs mt-1" style={{ color: mutedColor }}>{s.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  const { onColor, mutedColor, lineColor, surface, surface3, show } = useApp();
  const menuItems: { icon: ReactNode; label: string; nav: Screen }[] = [
    { icon: <User size={18} />, label: 'Persönliche Informationen', nav: 'personal' },
    { icon: <Palette size={18} />, label: 'Erscheinungsbild', nav: 'appearance' },
    { icon: <Bell size={18} />, label: 'Benachrichtigungen', nav: 'notifications' },
    { icon: <HelpCircle size={18} />, label: 'Hilfe & Support', nav: 'help' },
  ];

  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <AppCard className="text-center py-6 px-6">
        <div className="w-[84px] h-[84px] rounded-[32px] mx-auto mb-3 grid place-items-center text-white text-[36px] font-black" style={{ background: 'linear-gradient(135deg, #152270, #6ffbbe)' }}>M</div>
        <h1 className="text-[25px] font-extrabold" style={{ color: onColor }}>Maria Schmidt</h1>
        <p className="text-sm mt-1" style={{ color: mutedColor }}>Deutsch B2 Prüfung · Juni 2026</p>
      </AppCard>

      {menuItems.map((item) => (
        <button key={item.label} className="w-full flex items-center gap-3.5 p-3.5 rounded-[18px] border-0 cursor-pointer text-left my-2 transition-all duration-200" style={{ background: surface, border: `1px solid ${lineColor}` }} onClick={() => show(item.nav)}>
          <div className="w-[34px] h-[34px] rounded-xl grid place-items-center shrink-0" style={{ background: surface3, color: '#152270' }}>{item.icon}</div>
          <b className="text-sm flex-1" style={{ color: onColor }}>{item.label}</b>
          <span style={{ color: mutedColor }}>›</span>
        </button>
      ))}

      <button className="w-full rounded-[18px] font-bold py-3.5 mt-4 border-0 cursor-pointer" style={{ background: surface3, color: '#152270' }} onClick={() => show('login')}>Abmelden</button>
    </div>
  );
}

function PersonalScreen() {
  const { onColor, mutedColor, lineColor, surface, show } = useApp();
  const [info, setInfo] = useState({ name: 'Maria Schmidt', email: 'maria@example.com', goal: 'Deutsch B2 Prüfung', examDate: '24. Juni 2026' });
  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <IconBtn icon={<ChevronLeft size={22} />} onClick={() => show('profile')} />
      <h1 className="text-[25px] font-extrabold mt-3" style={{ color: onColor }}>Persönliche Informationen</h1>
      <AppCard>
        <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <User size={18} style={{ color: mutedColor, flexShrink: 0 }} />
          <input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
        </label>
        <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <Mail size={18} style={{ color: mutedColor, flexShrink: 0 }} />
          <input value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
        </label>
        <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <Target size={18} style={{ color: mutedColor, flexShrink: 0 }} />
          <input value={info.goal} onChange={(e) => setInfo({ ...info, goal: e.target.value })} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
        </label>
        <label className="flex items-center gap-2.5 border rounded-2xl px-3.5 py-3.5 my-2.5 cursor-pointer" style={{ borderColor: lineColor, background: surface }}>
          <CalendarDays size={18} style={{ color: mutedColor, flexShrink: 0 }} />
          <input value={info.examDate} onChange={(e) => setInfo({ ...info, examDate: e.target.value })} className="border-0 outline-0 bg-transparent w-full" style={{ color: onColor }} />
        </label>
        <button className="w-full rounded-[18px] text-white font-bold py-3.5 mt-3 border-0 cursor-pointer" style={{ background: '#152270', boxShadow: '0 10px 24px rgba(20,38,73,.10)' }}>Änderungen speichern</button>
      </AppCard>
    </div>
  );
}

function AppearanceScreen({ darkMode, toggleDark }: { darkMode: boolean; toggleDark: () => void }) {
  const { onColor, mutedColor, show } = useApp();
  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <IconBtn icon={<ChevronLeft size={22} />} onClick={() => show('profile')} />
      <h1 className="text-[25px] font-extrabold mt-3" style={{ color: onColor }}>Erscheinungsbild</h1>
      <AppCard>
        <SettingRow icon={<Moon size={18} />} title="Dunkler Modus" subtitle="Augenschonende Darstellung">
          <ToggleSwitch on={darkMode} onToggle={toggleDark} />
        </SettingRow>
        <SettingRow icon={<Palette size={18} />} title="Akzentfarbe" subtitle="Blau · AufgabenMeister Standard" />
        <SettingRow icon={<span className="font-bold text-sm">A</span>} title="Schriftgröße" subtitle="Normal" />
      </AppCard>
    </div>
  );
}

function NotificationsScreen({ settings, onToggle }: { settings: { reminders: boolean; daily: boolean; weekly: boolean }; onToggle: (key: 'reminders' | 'daily' | 'weekly') => void }) {
  const { onColor, mutedColor, show } = useApp();
  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <IconBtn icon={<ChevronLeft size={22} />} onClick={() => show('profile')} />
      <h1 className="text-[25px] font-extrabold mt-3" style={{ color: onColor }}>Benachrichtigungen</h1>
      <AppCard>
        <SettingRow icon={<Bell size={18} />} title="Aufgabenerinnerungen" subtitle="Vor Fälligkeit erinnern">
          <ToggleSwitch on={settings.reminders} onToggle={() => onToggle('reminders')} />
        </SettingRow>
        <SettingRow icon={<Clock size={18} />} title="Täglicher Lernplan" subtitle="Jeden Morgen um 08:00">
          <ToggleSwitch on={settings.daily} onToggle={() => onToggle('daily')} />
        </SettingRow>
        <SettingRow icon={<BarChart3 size={18} />} title="Wochenbericht" subtitle="Fortschritt am Sonntag">
          <ToggleSwitch on={settings.weekly} onToggle={() => onToggle('weekly')} />
        </SettingRow>
      </AppCard>
    </div>
  );
}

function HelpScreen() {
  const { isDark, onColor, mutedColor, surface3, show } = useApp();
  return (
    <div className="min-h-screen px-5 pt-5 pb-4">
      <IconBtn icon={<ChevronLeft size={22} />} onClick={() => show('profile')} />
      <h1 className="text-[25px] font-extrabold mt-3" style={{ color: onColor }}>Hilfe & Support</h1>

      <AppCard>
        <b className="text-sm" style={{ color: onColor }}>Wie erstelle ich eine Aufgabe?</b>
        <p className="text-[13px] mt-2 leading-relaxed" style={{ color: isDark ? '#b0b8c8' : '#454651' }}>Tippe auf das Plus-Symbol, trage Titel, Datum und Priorität ein und speichere die Aufgabe.</p>
      </AppCard>

      <AppCard>
        <b className="text-sm" style={{ color: onColor }}>Kontakt</b>
        <p className="text-[13px] mt-2 leading-relaxed" style={{ color: isDark ? '#b0b8c8' : '#454651' }}>support@aufgabenmeister.app<br />Antwort innerhalb von 24 Stunden.</p>
        <button className="w-full rounded-[18px] font-bold py-3.5 mt-3 border-0 cursor-pointer" style={{ background: surface3, color: '#152270' }}>Nachricht schreiben</button>
      </AppCard>
    </div>
  );
}

/* ═══════════════════════════ MAIN APP ═══════════════════════════ */
export default function AufgabenMeister() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [taskFilter, setTaskFilter] = useState('Alle');
  const [newTask, setNewTask] = useState({ title: 'Grammatik: Konjunktiv II üben', desc: '20 Beispielsätze schreiben und korrigieren.', date: '', priority: 'Hoch' as Priority });
  const [notifSettings, setNotifSettings] = useState({ reminders: true, daily: true, weekly: false });

  const isDark = darkMode;

  useEffect(() => {
    const t = setTimeout(() => setScreen('login'), 1200);
    return () => clearTimeout(t);
  }, []);

  const show = useCallback((id: Screen) => {
    setScreen(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const addTask = useCallback(() => {
    const t: Task = {
      id: Date.now().toString(),
      title: newTask.title || 'Neue Aufgabe',
      date: newTask.date ? new Date(newTask.date).toLocaleDateString('de-DE', { weekday: 'long' }) + ' · 19:00' : 'Heute · 19:00',
      priority: newTask.priority,
      done: false,
    };
    setTasks((prev) => [t, ...prev]);
    setNewTask({ title: '', desc: '', date: '', priority: 'Hoch' });
    show('tasks');
  }, [newTask, show]);

  const toggleDark = useCallback(() => setDarkMode((p) => !p), []);

  const toggleNotif = useCallback((key: 'reminders' | 'daily' | 'weekly') => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  /* Computed styles */
  const onColor = isDark ? '#eef5ff' : '#0b1c30';
  const mutedColor = isDark ? '#bdc7d8' : '#626567';
  const lineColor = isDark ? '#314864' : '#d4d8e8';
  const surface = isDark ? '#13263d' : '#fff';
  const surface2 = isDark ? '#1c3049' : '#eaf2ff';
  const surface3 = isDark ? '#213a5b' : '#dce9ff';
  const surfaceAlpha = isDark ? 'rgba(19,38,61,0.86)' : 'rgba(255,255,255,0.86)';
  const bg = isDark ? '#0b1c30' : '#f8f9ff';
  const bgGrad = isDark ? 'linear-gradient(180deg, #0b1c30, #0f2340)' : 'linear-gradient(180deg, #f8f9ff, #eef5ff)';

  const mainScreens: Screen[] = ['dashboard', 'tasks', 'calendar', 'stats', 'profile'];
  const showNav = mainScreens.includes(screen);
  const showFab = ['dashboard', 'tasks', 'calendar', 'stats'].includes(screen);

  const ctxValue: AppCtxValue = { screen, isDark, onColor, mutedColor, lineColor, surface, surface2, surface3, surfaceAlpha, show, toggleTask };

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen />;
      case 'login': return <LoginScreen />;
      case 'register': return <RegisterScreen />;
      case 'dashboard': return <DashboardScreen tasks={tasks} />;
      case 'tasks': return <TasksScreen tasks={tasks} taskFilter={taskFilter} setTaskFilter={setTaskFilter} />;
      case 'add': return <AddTaskScreen newTask={newTask} setNewTask={setNewTask} onAdd={addTask} />;
      case 'calendar': return <CalendarScreen />;
      case 'stats': return <StatsScreen />;
      case 'profile': return <ProfileScreen />;
      case 'personal': return <PersonalScreen />;
      case 'appearance': return <AppearanceScreen darkMode={darkMode} toggleDark={toggleDark} />;
      case 'notifications': return <NotificationsScreen settings={notifSettings} onToggle={toggleNotif} />;
      case 'help': return <HelpScreen />;
      default: return <DashboardScreen tasks={tasks} />;
    }
  };

  return (
    <AppCtx.Provider value={ctxValue}>
      <div
        className="relative overflow-hidden font-[Inter,system-ui,-apple-system,Segoe_UI,Roboto,Arial,sans-serif]"
        style={{ background: bgGrad, maxWidth: 480, margin: '0 auto' }}
      >
        <style dangerouslySetInnerHTML={{ __html: `*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{margin:0;background:${bg}}input,select,textarea{color:${onColor}}` }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            className="min-h-screen"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ padding: showNav ? '0 0 100px 0' : '0 0 20px 0' }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showFab && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed w-14 h-14 rounded-[20px] border-0 flex items-center justify-center cursor-pointer z-[5]"
              style={{ right: 'calc(50% - min(222px, 50vw) + 20px)', bottom: 98, background: '#152270', color: '#fff', boxShadow: '0 10px 24px rgba(20,38,73,.10)' }}
              onClick={() => show('add')}
            >
              <Plus size={28} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNav && (
            <motion.nav
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed left-1/2 -translate-x-1/2 z-[4] flex justify-around items-center h-[72px] border"
              style={{ width: 'min(444px, calc(100% - 24px))', bottom: 14, background: isDark ? 'rgba(19,38,61,0.95)' : 'rgba(255,255,255,0.95)', borderColor: lineColor, borderRadius: 26, boxShadow: '0 16px 34px rgba(17,32,70,.18)' }}
            >
              <NavItem icon={<Home size={22} />} label="Home" navScreen="dashboard" />
              <NavItem icon={<ListTodo size={22} />} label="Aufgaben" navScreen="tasks" />
              <NavItem icon={<CalendarDays size={22} />} label="Kalender" navScreen="calendar" />
              <NavItem icon={<BarChart3 size={22} />} label="Statistik" navScreen="stats" />
              <NavItem icon={<User size={22} />} label="Profil" navScreen="profile" />
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </AppCtx.Provider>
  );
}
