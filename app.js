:root {
  --bg: #0d1323;
  --bg-strong: #09111d;
  --panel: #121b2d;
  --panel-2: #17233e;
  --line: rgba(255, 255, 255, 0.08);
  --text: #edf3ff;
  --muted: #9bb0d0;
  --primary: #75d7ff;
  --primary-strong: #36b5ff;
  --success: #8ef0b2;
  --warning: #ffd166;
  --danger: #ff7d7d;
  --shadow: rgba(0, 0, 0, 0.28);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: Inter, "Segoe UI", sans-serif;
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-strong) 100%);
  color: var(--text);
}

body {
  min-height: 100vh;
}

button,
input,
textarea {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: 290px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: rgba(12, 18, 30, 0.9);
  border-right: 1px solid var(--line);
  padding: 24px 20px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 30px;
}

.brand-mark {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: #07111d;
  font-weight: 900;
  font-size: 1.3rem;
}

.eyebrow {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--primary);
}

.eyebrow.muted {
  color: var(--muted);
}

h1, h2, h3, h4, p {
  margin: 0;
}

.nav {
  display: grid;
  gap: 10px;
  margin-bottom: 24px;
}

.nav-item,
.page-link-btn,
.ghost-button {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--text);
  padding: 12px 14px;
  text-align: left;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s ease;
}

.nav-item:hover,
.nav-item.active,
.page-link-btn:hover,
.ghost-button:hover {
  background: rgba(117, 215, 255, 0.08);
  border-color: rgba(117, 215, 255, 0.4);
}

.mini-panel,
.settings-card,
.tool-stack,
.history-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 14px;
}

.mini-panel,
.tool-stack,
.history-panel {
  margin-bottom: 18px;
}

.mini-label {
  color: var(--muted);
  font-size: 0.8rem;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.page-links,
.tool-list,
.history-list {
  display: grid;
  gap: 8px;
}

.tool-list span {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 999px;
  background: rgba(117, 215, 255, 0.08);
  border: 1px solid rgba(117, 215, 255, 0.16);
  color: var(--primary);
  padding: 6px 10px;
  font-size: 0.74rem;
  font-weight: 700;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
}

.history-list li {
  background: rgba(8, 13, 24, 0.7);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--muted);
  line-height: 1.5;
  font-size: 0.82rem;
}

.memory-box {
  border-top: 1px solid var(--line);
  padding-top: 12px;
}

.memory-box h4 {
  color: var(--text);
  margin-bottom: 8px;
}

.memory-content {
  color: var(--muted);
  line-height: 1.6;
  white-space: pre-wrap;
  font-size: 0.84rem;
}

.settings-card {
  display: grid;
  gap: 10px;
}

.settings-card label {
  color: var(--muted);
  font-size: 0.9rem;
}

.settings-card input {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--text);
  padding: 10px 12px;
}

.settings-card small {
  color: var(--muted);
  line-height: 1.5;
}

.workspace {
  padding: 28px;
  display: grid;
  gap: 22px;
}

.topbar,
.result-header,
.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.page-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 700;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.7fr);
  gap: 20px;
}

.prompt-panel,
.result-panel,
.history-panel {
  background: rgba(18, 27, 45, 0.9);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 40px var(--shadow);
}

.prompt-panel {
  display: grid;
  gap: 12px;
}

.prompt-panel label {
  color: var(--muted);
  font-weight: 600;
}

textarea {
  width: 100%;
  background: rgba(8, 13, 24, 0.8);
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--text);
  resize: vertical;
  min-height: 110px;
  padding: 14px;
}

.primary-button,
.secondary-button,
.ghost-button {
  border-radius: 12px;
  padding: 11px 16px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 700;
}

.primary-button {
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: #06141f;
}

.secondary-button {
  background: transparent;
  color: var(--text);
  border-color: var(--line);
}

.ghost-button {
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  border-color: var(--line);
}

.result-panel {
  display: grid;
  gap: 12px;
}

.history-header {
  margin-bottom: 12px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(142, 240, 178, 0.12);
  color: var(--success);
  border: 1px solid rgba(142, 240, 178, 0.3);
  font-size: 0.78rem;
  font-weight: 700;
}

.result-box {
  background: rgba(8, 13, 24, 0.7);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px;
  min-height: 260px;
  color: var(--muted);
  line-height: 1.7;
  white-space: pre-wrap;
}

.result-box strong {
  color: var(--text);
}

@media (max-width: 980px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid var(--line);
  }

  .topbar,
  .actions-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
