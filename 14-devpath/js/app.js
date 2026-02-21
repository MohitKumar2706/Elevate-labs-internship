/**
 * app.js
 * Application entry point.
 * Loads persisted data, seeds demo content on first run,
 * and kicks off the initial render.
 */

// ─── Bootstrap ────────────────────────────────────────────────────────────
(function init() {
  load();            // from storage.js
  seedDemoIfEmpty(); // add demo goals for first-time users
  renderDashboard(); // from goals.js
  renderBadges();    // from badges.js (pre-render for sidebar badge count)
  updateSidebar();   // from ui.js
})();

// ─── Demo Data ────────────────────────────────────────────────────────────
function seedDemoIfEmpty() {
  if (goals.length > 0) return; // already has data

  goals = [
    {
      id:        'd1',
      emoji:     '⚛️',
      title:     'Master React & Next.js',
      desc:      'Build production-ready apps with React 18, hooks, context, and Next.js App Router.',
      category:  'frontend',
      date:      '2026-04-30',
      milestones: [
        { text: 'Complete React fundamentals course', done: true  },
        { text: 'Build 3 practice projects',          done: true  },
        { text: 'Learn Next.js App Router',           done: false },
        { text: 'Deploy a full-stack app',            done: false },
      ],
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id:        'd2',
      emoji:     '🔧',
      title:     'Node.js & Express APIs',
      desc:      'Design and build RESTful APIs with Node.js, Express, and MongoDB.',
      category:  'backend',
      date:      '2026-06-15',
      milestones: [
        { text: 'Learn Node.js basics',           done: true  },
        { text: 'Build REST API with Express',    done: false },
        { text: 'Add JWT authentication',         done: false },
        { text: 'Write API documentation',        done: false },
      ],
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id:        'd3',
      emoji:     '☁️',
      title:     'Cloud & DevOps Fundamentals',
      desc:      'Learn Docker, CI/CD pipelines, and deploy to AWS or Vercel.',
      category:  'devops',
      date:      '2026-08-01',
      milestones: [
        { text: 'Docker basics & containerization', done: false },
        { text: 'Set up GitHub Actions CI/CD',      done: false },
        { text: 'Deploy to cloud platform',         done: false },
      ],
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  activity = [
    { text: '🎉 Welcome to DevPath! Your journey starts here.', time: new Date().toISOString() },
    { text: '📦 Demo goals loaded to get you started.',         time: new Date().toISOString() },
  ];

  save();
}
