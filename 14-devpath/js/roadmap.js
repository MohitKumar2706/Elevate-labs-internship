/**
 * roadmap.js
 * Generates and renders the Mermaid.js roadmap diagram
 * and the goal timeline view.
 */

// ─── Mermaid Configuration ────────────────────────────────────────────────
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    background:        '#111118',
    primaryColor:      '#7c3aed',
    primaryTextColor:  '#e8e8f0',
    primaryBorderColor:'#252535',
    lineColor:         '#6b6b88',
    secondaryColor:    '#1a1a24',
    tertiaryColor:     '#0a0a0f',
    fontSize:          '13px',
  },
  flowchart: { curve: 'basis', nodeSpacing: 60, rankSpacing: 80 },
});

// ─── Build Mermaid Diagram ────────────────────────────────────────────────
function buildDiagram() {
  if (goals.length === 0) {
    return 'graph LR\n  A["🚀 Add goals to see your roadmap"] --> B["🎯 Start here"]\n';
  }

  let diagram = 'graph LR\n';

  goals.forEach((g, i) => {
    const pct   = g.milestones.length
      ? Math.round((g.milestones.filter(m => m.done).length / g.milestones.length) * 100)
      : 0;
    const label = `${g.emoji} ${g.title.substring(0, 22)}${g.title.length > 22 ? '...' : ''}\\n${pct}% complete`;
    diagram += `  G${i}["${label}"]\n`;
    if (i > 0) diagram += `  G${i - 1} --> G${i}\n`;
  });

  // Style nodes by completion state
  goals.forEach((g, i) => {
    const pct = g.milestones.length
      ? g.milestones.filter(m => m.done).length / g.milestones.length
      : 0;

    if (g.completed) {
      diagram += `  style G${i} fill:#10b981,color:#fff,stroke:#10b981\n`;
    } else if (pct > 0) {
      diagram += `  style G${i} fill:#7c3aed,color:#fff,stroke:#7c3aed\n`;
    } else {
      diagram += `  style G${i} fill:#1a1a24,color:#e8e8f0,stroke:#252535\n`;
    }
  });

  return diagram;
}

// ─── Render Roadmap ───────────────────────────────────────────────────────
function renderRoadmap() {
  const container = document.getElementById('roadmap-chart');
  const diagram   = buildDiagram();

  container.innerHTML = diagram;
  container.removeAttribute('data-processed');

  try {
    mermaid.run({ nodes: [container] });
  } catch (e) {
    // fallback for older mermaid versions
    mermaid.init(undefined, container);
  }

  renderTimeline();
}

// ─── Render Timeline ──────────────────────────────────────────────────────
function renderTimeline() {
  const timeline = document.getElementById('roadmap-timeline');

  if (goals.length === 0) {
    timeline.innerHTML = '<div style="color:var(--muted);font-size:0.75rem">Add goals to see your timeline.</div>';
    return;
  }

  const sorted = [...goals].sort((a, b) => {
    const da = a.date || '9999-12-31';
    const db = b.date || '9999-12-31';
    return da < db ? -1 : 1;
  });

  timeline.innerHTML = sorted.map(g => {
    const doneMilestones = g.milestones.filter(m => m.done).length;
    const totalMilestones = g.milestones.length;
    const dateStr = g.date
      ? new Date(g.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'No deadline';

    return `
      <div class="timeline-item">
        <div class="timeline-date">${dateStr}</div>
        <div class="timeline-text">
          ${g.emoji} <strong>${g.title}</strong>
          — ${g.completed
              ? '✅ Completed'
              : `${doneMilestones}/${totalMilestones} milestones`}
        </div>
      </div>
    `;
  }).join('');
}
