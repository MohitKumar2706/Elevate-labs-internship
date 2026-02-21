/**
 * feedback.js
 * Handles mentor feedback: opening the modal, saving entries,
 * and rendering the feedback list. This is the collaboration/
 * mentor-feedback feature described in the project spec.
 */

// ─── Open Feedback Modal ──────────────────────────────────────────────────
function openFeedbackModal() {
  document.getElementById('fb-mentor').value = '';
  document.getElementById('fb-text').value   = '';

  // Populate goal selector
  const sel     = document.getElementById('fb-goal');
  sel.innerHTML = '<option value="">General feedback</option>' +
    goals.map(g => `<option value="${g.id}">${g.emoji} ${g.title}</option>`).join('');

  document.getElementById('feedbackModal').classList.add('show');
}

// ─── Save Feedback ────────────────────────────────────────────────────────
function saveFeedback() {
  const mentor = document.getElementById('fb-mentor').value.trim();
  const text   = document.getElementById('fb-text').value.trim();

  if (!mentor || !text) {
    toast('Please fill in all fields', '⚠️');
    return;
  }

  const goalId    = document.getElementById('fb-goal').value;
  const goal      = goals.find(g => g.id === goalId);

  const entry = {
    id:        Date.now().toString(),
    mentor,
    text,
    goalId,
    goalTitle: goal?.title || '',
    time:      new Date().toISOString(),
  };

  feedback.unshift(entry);
  addActivity(`Mentor feedback received from ${mentor}`);

  save();
  closeModal('feedbackModal');
  renderFeedback();
  toast('Feedback saved!', '💬', 'success');
}

// ─── Render Feedback List ─────────────────────────────────────────────────
function renderFeedback() {
  const list = document.getElementById('feedback-list');

  if (feedback.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💬</div>
        <p>No feedback yet. Ask a mentor to review your goals!</p>
      </div>`;
    return;
  }

  list.innerHTML = feedback.map(f => `
    <div class="feedback-card">
      <div class="feedback-avatar">${f.mentor.charAt(0).toUpperCase()}</div>
      <div class="feedback-content">
        <div class="feedback-header">
          <span class="feedback-name">${f.mentor}</span>
          <span class="feedback-time">
            ${new Date(f.time).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
          </span>
        </div>
        <div class="feedback-text">${f.text}</div>
        ${f.goalTitle
          ? `<div class="feedback-goal">📎 re: ${f.goalTitle}</div>`
          : ''}
      </div>
    </div>
  `).join('');
}
