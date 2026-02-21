/**
 * ui.js
 * Handles UI utilities: navigation, modals, toast notifications,
 * sidebar updates, and shared rendering helpers.
 */

// ─── Navigation ───────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item[data-page]').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    el.classList.add('active');
    document.getElementById('page-' + el.dataset.page).classList.add('active');

    // Page-specific init
    switch (el.dataset.page) {
      case 'roadmap':  setTimeout(renderRoadmap, 100); break;
      case 'badges':   renderBadges();   break;
      case 'activity': renderActivity(); break;
      case 'mentor':   renderFeedback(); break;
      case 'goals':    renderAllGoals(); break;
      case 'profile':  loadProfileForm();break;
    }
  });
});

// ─── Modal ────────────────────────────────────────────────────────────────
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// ─── Toast ────────────────────────────────────────────────────────────────
function toast(msg, icon = 'ℹ️', type = 'info') {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span>${icon}</span> ${msg}`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─── Sidebar ──────────────────────────────────────────────────────────────
function updateSidebar() {
  document.getElementById('sidebarUsername').textContent  = profile.name;
  document.getElementById('avatarInitial').textContent    = profile.name.charAt(0).toUpperCase();
  document.getElementById('streakCount').textContent      = streak;
  document.getElementById('goalsCount').textContent       = goals.length;

  const level = Math.floor(goals.filter(g => g.completed).length / 2) + 1;
  document.getElementById('sidebarLevel').textContent = `Lv.${level} — ${profile.role}`;
}

// ─── Profile Form ─────────────────────────────────────────────────────────
function loadProfileForm() {
  document.getElementById('profile-name').value   = profile.name;
  document.getElementById('profile-role').value   = profile.role;
  document.getElementById('profile-target').value = profile.target;
}

function saveProfile() {
  profile.name   = document.getElementById('profile-name').value.trim()   || profile.name;
  profile.role   = document.getElementById('profile-role').value.trim()   || profile.role;
  profile.target = document.getElementById('profile-target').value.trim() || profile.target;
  save();
  updateSidebar();
  toast('Profile saved!', '👤', 'success');
}

// ─── Goal Card HTML ───────────────────────────────────────────────────────
function goalCardHTML(g) {
  const done  = g.milestones.filter(m => m.done).length;
  const total = g.milestones.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  const milestonesHTML = g.milestones.slice(0, 4).map((m, i) => `
    <div class="milestone-mini ${m.done ? 'done' : ''}">
      <button class="milestone-toggle ${m.done ? 'checked' : ''}"
        onclick="event.stopPropagation(); toggleMilestone('${g.id}', ${i})">
        ${m.done ? '✓' : ''}
      </button>
      <span>${m.text}</span>
    </div>
  `).join('');

  const dateStr = g.date
    ? new Date(g.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
    : 'No deadline';

  return `
    <div class="goal-card ${g.completed ? 'completed' : ''}">
      <div class="goal-header">
        <div class="goal-emoji">${g.emoji || '🎯'}</div>
        <div class="goal-title-wrap">
          <div class="goal-title">${g.title}</div>
          <span class="goal-category cat-${g.category}">${g.category}</span>
        </div>
      </div>
      ${g.desc ? `<div class="goal-desc">${g.desc}</div>` : ''}
      <div class="progress-wrap">
        <div class="progress-header">
          <span>Progress</span>
          <span>${done}/${total} milestones · ${pct}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
      <div class="milestones-mini">${milestonesHTML}</div>
      ${g.milestones.length > 4
        ? `<div style="font-size:0.62rem;color:var(--muted);margin-bottom:10px">+${g.milestones.length - 4} more milestones</div>`
        : ''}
      <div class="goal-footer">
        <span>📅 ${dateStr}</span>
        <div class="goal-actions">
          <button class="btn btn-secondary btn-sm" onclick="openGoalModal('${g.id}')">Edit</button>
          <button class="btn btn-danger btn-sm"    onclick="deleteGoal('${g.id}')">Del</button>
        </div>
      </div>
    </div>
  `;
}
