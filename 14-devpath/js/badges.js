/**
 * badges.js
 * Defines and renders the badge/achievement system.
 * Badges are computed from current goals and streak state.
 */

// ─── Badge Definitions ────────────────────────────────────────────────────
const BADGES_DEF = [
  {
    id:   'first_goal',
    icon: '🌱',
    name: 'First Steps',
    desc: 'Create your very first goal',
  },
  {
    id:   'three_goals',
    icon: '🎯',
    name: 'Focused',
    desc: 'Have 3 or more active goals',
  },
  {
    id:   'five_goals',
    icon: '🏆',
    name: 'Overachiever',
    desc: 'Create 5 or more goals',
  },
  {
    id:   'first_complete',
    icon: '✅',
    name: 'Achiever',
    desc: 'Complete your first goal',
  },
  {
    id:   'all_complete',
    icon: '👑',
    name: 'Completionist',
    desc: 'Complete every single goal',
  },
  {
    id:   'streak_3',
    icon: '🔥',
    name: 'On Fire',
    desc: 'Maintain a 3-day streak',
  },
  {
    id:   'streak_7',
    icon: '💥',
    name: 'Week Warrior',
    desc: 'Maintain a 7-day streak',
  },
  {
    id:   'five_milestones',
    icon: '🏁',
    name: 'Milestone Master',
    desc: 'Complete 5 or more milestones',
  },
];

// ─── Compute Earned Badges ────────────────────────────────────────────────
function computeEarnedBadges() {
  const earned         = new Set();
  const milestonesDone = goals.reduce((a, g) => a + g.milestones.filter(m => m.done).length, 0);

  if (goals.length >= 1)                            earned.add('first_goal');
  if (goals.length >= 3)                            earned.add('three_goals');
  if (goals.length >= 5)                            earned.add('five_goals');
  if (goals.some(g => g.completed))                 earned.add('first_complete');
  if (goals.length > 0 && goals.every(g => g.completed)) earned.add('all_complete');
  if (streak >= 3)                                  earned.add('streak_3');
  if (streak >= 7)                                  earned.add('streak_7');
  if (milestonesDone >= 5)                          earned.add('five_milestones');

  return earned;
}

// ─── Render Badges ────────────────────────────────────────────────────────
function renderBadges() {
  const earned = computeEarnedBadges();
  const grid   = document.getElementById('badges-grid');

  grid.innerHTML = BADGES_DEF.map(b => `
    <div class="badge-card ${earned.has(b.id) ? 'earned' : ''}">
      ${earned.has(b.id) ? '<span class="badge-earned-label">✓ Earned</span>' : ''}
      <span class="badge-icon">${b.icon}</span>
      <div class="badge-name">${b.name}</div>
      <div class="badge-desc">${b.desc}</div>
    </div>
  `).join('');
}
