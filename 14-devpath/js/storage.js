/**
 * storage.js
 * Handles all data persistence via localStorage.
 * In a production app, replace localStorage calls with Firebase Firestore.
 *
 * Firebase equivalent:
 *   import { db } from './firebase.js';
 *   import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
 */

// ─── State ────────────────────────────────────────────────────────────────
let goals    = [];
let feedback = [];
let activity = [];
let streak   = 0;
let profile  = {
  name:   'Alex Chen',
  role:   'Full Stack Dev',
  target: 'Senior Software Engineer',
  focus:  'Full Stack Development',
};

// ─── Keys ─────────────────────────────────────────────────────────────────
const KEYS = {
  goals:     'devpath_goals',
  feedback:  'devpath_feedback',
  activity:  'devpath_activity',
  streak:    'devpath_streak',
  profile:   'devpath_profile',
  lastVisit: 'devpath_lastVisit',
};

// ─── Load ──────────────────────────────────────────────────────────────────
function load() {
  goals    = JSON.parse(localStorage.getItem(KEYS.goals)    || '[]');
  feedback = JSON.parse(localStorage.getItem(KEYS.feedback) || '[]');
  activity = JSON.parse(localStorage.getItem(KEYS.activity) || '[]');
  streak   = parseInt(localStorage.getItem(KEYS.streak)     || '0');
  profile  = JSON.parse(localStorage.getItem(KEYS.profile)  || JSON.stringify(profile));

  // Streak logic
  const today     = new Date().toDateString();
  const lastVisit = localStorage.getItem(KEYS.lastVisit);

  if (!lastVisit) {
    streak = 1;
  } else if (lastVisit !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    streak = (lastVisit === yesterday) ? streak + 1 : 1;
  }

  localStorage.setItem(KEYS.streak,    streak);
  localStorage.setItem(KEYS.lastVisit, today);
}

// ─── Save ──────────────────────────────────────────────────────────────────
function save() {
  localStorage.setItem(KEYS.goals,    JSON.stringify(goals));
  localStorage.setItem(KEYS.feedback, JSON.stringify(feedback));
  localStorage.setItem(KEYS.activity, JSON.stringify(activity));
  localStorage.setItem(KEYS.streak,   streak);
  localStorage.setItem(KEYS.profile,  JSON.stringify(profile));
}

// ─── Activity Helper ───────────────────────────────────────────────────────
function addActivity(text) {
  activity.unshift({ text, time: new Date().toISOString() });
  if (activity.length > 50) activity.pop();
}
