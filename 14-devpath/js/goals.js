/**
 * goals.js
 * Handles goal creation, editing, deletion, milestone toggling,
 * and rendering of goal cards on dashboard and goals page.
 */

// ─── Constants ────────────────────────────────────────────────────────────
const EMOJIS = [
  '🎯','🚀','💻','🌐','📱','⚡','🔬','🧠',
  '🏗️','🎨','📊','🔐','☁️','🤖','📚','🛠️',
  '🔧','💡','🌟','🏆',
];

let selectedEmoji = '🎯';
let goalsFilter   = 'all';

// ─── Emoji Picker ─────────────────────────────────────────────────────────
function initEmojiPicker() {
  const ep = document.getElementById('emojiPicker');
  ep.innerHTML = EMOJIS.map(e =>
    `<span class="emoji-opt${e === selectedEmoji ? ' sel' : ''}"
      onclick="selectEmoji('${e}', this)">${e}</span>`
  ).join('');
}

function selectEmoji(e, el) {
  selectedEmoji = e;
  document.querySelectorAll('.emoji-opt').forEach(x => x.classList.remove('sel'));
  el.classList.add('sel');
}

// ─── Open Goal Modal ──────────────────────────────────────────────────────
function openGoalModal(id = null) {
  selectedEmoji = '🎯';
  document.getElementById('editingId').value = id || '';
  document.getElementById('modalTitle').textContent = id ? 'Edit Goal' : 'New Goal';
  document.getElementById('goalTitle').value   = '';
  document.getElementById('goalDesc').value    = '';
  document.getElementById('goalCategory').value = 'frontend';
  document.getElementById('goalDate').value    = '';
  document.getElementById('milestonesEditor').innerHTML = '';

  if (id) {
    const g = goals.find(x => x.id === id);
    if (g) {
      selectedEmoji = g.emoji || '🎯';
      document.getElementById('goalTitle').value    = g.title;
      document.getElementById('goalDesc').value     = g.desc;
      document.getElementById('goalCategory').value = g.category;
      document.getElementById('goalDate').value     = g.date || '';
      g.milestones.forEach(m => addMilestoneField(m.text));
    }
  } else {
    addMilestoneField(); // start with one empty row
  }

  initEmojiPicker();
  document.getElementById('goalModal').classList.add('show');
}

// ─── Milestone Field ──────────────────────────────────────────────────────
function addMilestoneField(val = '') {
  const row = document.createElement('div');
  row.className = 'milestone-row';
  row.innerHTML = `
    <input class="form-control" placeholder="e.g. Complete 10 exercises" value="${val}">
    <button class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">✕</button>
  `;
  document.getElementById('milestonesEditor').appendChild(row);
}

// ─── Save Goal ────────────────────────────────────────────────────────────
function saveGoal() {
  const title = document.getElementById('goalTitle').value.trim();
  if (!title) { toast('Please enter a goal title', '⚠️'); return; }

  const id    = document.getElementById('editingId').value || Date.now().toString();
  const isNew = !document.getElementById('editingId').value;

  // Collect milestones, preserving done state for edits
  const inputs     = document.querySelectorAll('#milestonesEditor .milestone-row input');
  const milestones = Array.from(inputs)
    .map(inp => inp.value.trim())
    .filter(Boolean)
    .map(text => {
      if (!isNew) {
        const existing = goals.find(g => g.id === id);
        const found    = existing?.milestones.find(m => m.text === text);
        return found || { text, done: false };
      }
      return { text, done: false };
    });

  const goal = {
    id,
    emoji:     selectedEmoji,
    title,
    desc:      document.getElementById('goalDesc').value.trim(),
    category:  document.getElementById('goalCategory').value,
    date:      document.getElementById('goalDate').value,
    milestones,
    completed: false,
    createdAt: isNew ? new Date().toISOString() : (goals.find(g => g.id === id)?.createdAt || new Date().toISOString()),
    updatedAt: new Date().toISOString(),
  };

  if (!isNew) {
    const idx    = goals.findIndex(g => g.id === id);
    goal.completed = goals[idx].completed;
    goals[idx]   = goal;
  } else {
    goals.push(goal);
    addActivity(`Created goal: "${title}"`);
  }

  save();
  closeModal('goalModal');
  renderDashboard();
  renderAllGoals();
  updateSidebar();
  toast(isNew ? 'Goal created! 🎯' : 'Goal updated!', '✅', 'success');
}

// ─── Delete Goal ──────────────────────────────────────────────────────────
function deleteGoal(id) {
  if (!confirm('Delete this goal? This cannot be undone.')) return;
  const g = goals.find(x => x.id === id);
  goals   = goals.filter(x => x.id !== id);
  addActivity(`Deleted goal: "${g?.title}"`);
  save();
  renderDashboard();
  renderAllGoals();
  updateSidebar();
  toast('Goal deleted', '🗑️');
}

// ─── Toggle Milestone ─────────────────────────────────────────────────────
function toggleMilestone(goalId, mIdx) {
  const g = goals.find(x => x.id === goalId);
  if (!g) return;

  g.milestones[mIdx].done = !g.milestones[mIdx].done;

  const doneCount = g.milestones.filter(m => m.done).length;

  if (doneCount === g.milestones.length && g.milestones.length > 0) {
    g.completed = true;
    addActivity(`Completed goal: "${g.title}" 🏆`);
    toast('Goal completed! You\'re amazing! 🏆', '🎉', 'success');
  } else {
    g.completed = false;
  }

  if (g.milestones[mIdx].done) {
    addActivity(`Milestone done: "${g.milestones[mIdx].text}"`);
  }

  save();
  renderDashboard();
  renderAllGoals();
  updateSidebar();
}

// ─── Render Dashboard ─────────────────────────────────────────────────────
function renderDashboard() {
  const total          = goals.length;
  const done           = goals.filter(g => g.completed).length;
  const milestonesDone = goals.reduce((a, g) => a + g.milestones.filter(m => m.done).length, 0);

  document.getElementById('stat-total').textContent      = total;
  document.getElementById('stat-done').textContent       = done;
  document.getElementById('stat-milestones').textContent = milestonesDone;
  document.getElementById('stat-streak').textContent     = streak;

  const active = goals.filter(g => !g.completed);
  const grid   = document.getElementById('dashboard-goals-grid');

  if (total === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🚀</div>
        <p>No goals yet. Start your journey!</p>
        <button class="btn btn-primary" onclick="openGoalModal()">Create First Goal</button>
      </div>`;
  } else if (active.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🏆</div>
        <p>All goals completed! You're incredible!</p>
      </div>`;
  } else {
    grid.innerHTML = active.slice(0, 6).map(goalCardHTML).join('');
  }
}

// ─── Render All Goals ─────────────────────────────────────────────────────
function renderAllGoals() {
  let filtered = [...goals];
  if (goalsFilter === 'active')    filtered = goals.filter(g => !g.completed);
  if (goalsFilter === 'completed') filtered = goals.filter(g =>  g.completed);

  document.getElementById('goalsCount').textContent = goals.length;
  const grid = document.getElementById('all-goals-grid');

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">📋</div>
        <p>${goalsFilter === 'completed' ? 'Complete some goals first!' : 'No goals yet!'}</p>
        ${goalsFilter !== 'completed'
          ? `<button class="btn btn-primary" onclick="openGoalModal()">+ New Goal</button>`
          : ''}
      </div>`;
  } else {
    grid.innerHTML = filtered.map(goalCardHTML).join('');
  }
}

// ─── Filter ───────────────────────────────────────────────────────────────
function filterGoals(filter, el) {
  goalsFilter = filter;
  document.querySelectorAll('#page-goals .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderAllGoals();
}

// ─── Activity Log ─────────────────────────────────────────────────────────
function renderActivity() {
  const tl = document.getElementById('activity-timeline');
  if (activity.length === 0) {
    tl.innerHTML = '<div style="color:var(--muted);font-size:0.75rem">No activity yet. Start working on your goals!</div>';
    return;
  }
  tl.innerHTML = activity.map(a => `
    <div class="timeline-item">
      <div class="timeline-date">${new Date(a.time).toLocaleString('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' })}</div>
      <div class="timeline-text">${a.text}</div>
    </div>
  `).join('');
}
