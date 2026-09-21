const pageTitle = document.getElementById('pageTitle');
const pageLink = document.getElementById('pageLink');
const agentPrompt = document.getElementById('agentPrompt');
const runAgentBtn = document.getElementById('runAgent');
const quickActionBtn = document.getElementById('quickAction');
const simulateClickBtn = document.getElementById('simulateClick');
const planActionBtn = document.getElementById('planAction');
const resetPromptBtn = document.getElementById('resetPrompt');
const resultBox = document.getElementById('resultBox');
const statusBadge = document.getElementById('statusBadge');
const navItems = document.querySelectorAll('.nav-item');
const pageLinkButtons = document.querySelectorAll('.page-link-btn');
const historyList = document.getElementById('historyList');

const sessionHistory = [];
const agentMemory = {
  lastTask: '',
  currentPage: '',
  plan: []
};

function updateStatus(label, tone = 'success') {
  statusBadge.textContent = label;
  statusBadge.style.color = tone === 'warning' ? '#ffd166' : tone === 'danger' ? '#ff7d7d' : '#8ef0b2';
  statusBadge.style.borderColor = tone === 'warning' ? 'rgba(255, 209, 102, 0.3)' : tone === 'danger' ? 'rgba(255, 125, 125, 0.3)' : 'rgba(142, 240, 178, 0.3)';
  statusBadge.style.background = tone === 'warning' ? 'rgba(255, 209, 102, 0.12)' : tone === 'danger' ? 'rgba(255, 125, 125, 0.12)' : 'rgba(142, 240, 178, 0.12)';
}

function addHistory(text) {
  const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  sessionHistory.unshift(`${stamp} • ${text}`);
  if (sessionHistory.length > 8) sessionHistory.pop();
  historyList.innerHTML = sessionHistory.map((entry) => `<li>${entry}</li>`).join('');
}

function getCurrentPageInfo() {
  const title = document.title || 'Untitled page';
  const h1 = document.querySelector('h1')?.textContent?.trim() || 'No H1 found';
  const headings = [...document.querySelectorAll('h1, h2, h3')]
    .map((el) => el.textContent.trim())
    .filter(Boolean)
    .slice(0, 10);
  const paragraphs = [...document.querySelectorAll('p')]
    .map((el) => el.textContent.trim())
    .filter(Boolean)
    .slice(0, 12);
  const links = [...document.querySelectorAll('a[href]')]
    .map((link) => link.textContent.trim())
    .filter(Boolean)
    .slice(0, 20);
  const buttons = [...document.querySelectorAll('button, .button, .cta, .chip')]
    .map((el) => el.textContent.trim())
    .filter(Boolean)
    .slice(0, 20);
  const priceSignals = [...document.querySelectorAll('*')]
    .filter((el) => /€|\$|\d+\s*(€|\$|eur|usd)/i.test(el.textContent || ''))
    .slice(0, 10)
    .map((el) => el.textContent.trim().slice(0, 120));

  const cards = [...document.querySelectorAll('article, .product-card, .feature-panel, .info-card, .product')]
    .map((item) => item.textContent.trim())
    .filter((text) => text.length > 30)
    .slice(0, 10);

  return {
    title,
    h1,
    headings,
    paragraphs,
    links,
    buttons,
    priceSignals,
    cards,
    url: window.location.href
  };
}

function planNextStep() {
  const page = getCurrentPageInfo();
  const plan = [
    `1. Inspect page: ${page.title}`,
    '2. Extract structured product/service data',
    '3. Summarize user intent and conversion path',
    '4. Recommend the safest next action',
    '5. Log the outcome and store the task in memory'
  ];

  agentMemory.plan = plan;
  resultBox.textContent = `Plan:\n${plan.join('\n')}`;
  addHistory('Plan generated');
  updateStatus('Plan ready', 'success');
}

function confirmAction(actionName) {
  const allowed = ['readPage', 'summary', 'extractData', 'audit', 'clickCTA', 'fillForm', 'navigate'];
  if (!allowed.includes(actionName)) {
    resultBox.textContent = `confirm()\nAction not allowed: ${actionName}`;
    addHistory(`Blocked action: ${actionName}`);
    updateStatus('Blocked', 'danger');
    return;
  }

  resultBox.textContent = `confirm()\nAction approved: ${actionName}\nReason: safe local browser tool / limited scope / no destructive state change.`;
  addHistory(`Confirmed: ${actionName}`);
  updateStatus('Confirmed', 'success');
}

function toolReadPage() {
  const page = getCurrentPageInfo();
  return `readPage()\n- Title: ${page.title}\n- H1: ${page.h1}\n- Links: ${page.links.join(', ') || 'none'}\n- Buttons: ${page.buttons.join(', ') || 'none'}\n- Price markers: ${page.priceSignals.join(' | ') || 'none'}`;
}

function toolExtractData() {
  const page = getCurrentPageInfo();
  const dataItems = page.cards.length ? page.cards : page.headings;
  return `extractData()\n- Detected items: ${dataItems.slice(0, 6).join(' | ') || 'No structured item data found'}\n- Pricing data: ${page.priceSignals.join(' | ') || 'No pricing markers found'}\n- URL: ${page.url}`;
}

function toolSummarize() {
  const page = getCurrentPageInfo();
  return `summarize()\n${page.h1}\n\nThe page is focused on "${page.title}" and contains ${page.links.length} link targets, ${page.buttons.length} action labels, and ${page.priceSignals.length} price/value markers. It is suitable for product research, service explanation, and conversion-related prompts.`;
}

function toolAudit() {
  const page = getCurrentPageInfo();
  return `audit()\n- Title present: yes\n- H1 present: ${page.h1 !== 'No H1 found' ? 'yes' : 'no'}\n- CTA buttons: ${page.buttons.length > 0 ? 'yes' : 'no'}\n- Price cues: ${page.priceSignals.length > 0 ? 'yes' : 'no'}\n- Recommended improvements: add stronger semantic sections, improve form labels, and clarify primary calls to action.`;
}

function toolClickCTA() {
  const selectors = ['a[href]', 'button', '.button', '.cta', '.chip'];
  let target = null;

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) {
      target = el;
      break;
    }
  }

  if (!target) {
    return 'clickCTA()\n- No actionable element found on this page.';
  }

  const label = target.textContent?.trim() || target.getAttribute('aria-label') || 'CTA';
  const href = target.getAttribute('href') || 'no href';
  target.click();

  return `clickCTA()\n- Selected: ${label}\n- Target: ${href}\n- Action performed locally in the browser context.`;
}

function toolFillForm() {
  const form = document.querySelector('form');
  if (!form) {
    return 'fillForm()\n- No form found on the current page.';
  }

  const nameField = form.querySelector('input[name="name"], input[type="text"], input[placeholder*="Nimi"], input[placeholder*="name"]');
  const emailField = form.querySelector('input[name="email"], input[type="email"]');
  const messageField = form.querySelector('textarea, textarea[name="message"]');

  if (nameField) nameField.value = 'Nova User';
  if (emailField) emailField.value = 'user@novaagent.fi';
  if (messageField) messageField.value = 'This message was generated by the browser agent prototype.';

  return `fillForm()\n- Form populated with safe sample values\n- Fields updated: ${[nameField ? 'name' : '', emailField ? 'email' : '', messageField ? 'message' : ''].filter(Boolean).join(', ') || 'none'}`;
}

function toolNavigate(target) {
  const normalized = String(target || '').trim().toLowerCase();
  const map = {
    home: 'index.html',
    agent: 'index.html',
    catalog: 'catalog.html',
    autot: 'catalog.html',
    tuning: 'tuning.html',
    energia: 'solar.html',
    energy: 'solar.html',
    solar: 'solar.html',
    contact: 'contact.html',
    yhteys: 'contact.html'
  };

  const destination = map[normalized] || target || 'index.html';
  window.location.href = destination;
  return `navigate()\n- Redirecting to ${destination}`;
}

function runLocalAgent(task) {
  const lower = task.toLowerCase();

  if (/(plan|suunnitelma|next step|seuraava)/.test(lower)) {
    planNextStep();
    return `plan()\nPlan created. The agent recommends the next step sequence based on the current page context.`;
  }

  if (/(confirm|varmista|approve|hyväksy)/.test(lower)) {
    confirmAction('readPage');
    return `confirm()\nApproval path established. This prototype only allows safe, local browser-side actions.`;
  }

  if (/(navigate|go to|open page|avaa|siirry|sivulle)/.test(lower)) {
    const targetMatch = lower.match(/(home|agent|catalog|autot|tuning|energia|energy|solar|contact|yhteys)/i);
    const target = targetMatch ? targetMatch[1] : 'index.html';
    return toolNavigate(target);
  }

  if (/(click|cta|button|napit|paina)/.test(lower)) {
    return toolClickCTA();
  }

  if (/(fill|form|submit|lisaa|lähet|viesti|message)/.test(lower)) {
    return toolFillForm();
  }

  if (/(extract|data|poimi|tuotteet|autot|lista)/.test(lower)) {
    return toolExtractData();
  }

  if (/(audit|arvio|review|check)/.test(lower)) {
    return toolAudit();
  }

  if (/(read|page|scan|sivun|selvitä|tarkista)/.test(lower) || /^(scan|selvitä|tutki)/.test(lower)) {
    return toolReadPage();
  }

  return toolSummarize();
}

async function runAgent() {
  const task = agentPrompt.value.trim();
  if (!task) {
    updateStatus('No task', 'warning');
    resultBox.innerHTML = '<p>Write a task before running the agent.</p>';
    return;
  }

  agentMemory.lastTask = task;
  agentMemory.currentPage = window.location.href;
  updateStatus('Analyzing…', 'warning');

  const apiKey = document.getElementById('apiKey').value.trim();
  if (apiKey) {
    try {
      const payload = {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a browser agent operating in the local DOM. Use strict, concise output and prefer useful structured summaries.' },
          { role: 'user', content: `${task}\n\nPage context:\n${getCurrentPageInfo().paragraphs.slice(0, 10).join('\n')}` }
        ]
      };

      const responseFromApi = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (responseFromApi.ok) {
        const data = await responseFromApi.json();
        const answer = data.choices?.[0]?.message?.content;
        if (answer) {
          resultBox.innerHTML = `<strong>AI response:</strong>\n${answer}`;
          addHistory(`AI task: ${task}`);
          updateStatus('AI active', 'success');
          return;
        }
      }
    } catch (error) {
      console.warn('OpenAI call failed. Using local agent instead.', error);
    }
  }

  const localResult = runLocalAgent(task);
  resultBox.textContent = localResult;
  addHistory(task);
  updateStatus('Local agent ready', 'success');
}

function quickInspect() {
  const page = getCurrentPageInfo();
  const content = `Quick inspection\n- Page: ${page.title}\n- H1: ${page.h1}\n- Link count: ${page.links.length}\n- CTA labels: ${page.buttons.join(', ') || 'none'}\n- Value markers: ${page.priceSignals.join(' | ') || 'none'}`;
  resultBox.textContent = content;
  addHistory('Quick inspect');
  updateStatus('Quick scan', 'success');
}

function setPromptFromTemplate(templateName) {
  const templates = {
    scan: 'Scan the current page and summarize the page goal, main sections, and likely user intent.',
    summarize: 'Summarize the main purpose of this page in 3 bullets.',
    extract: 'Extract the product names, pricing markers, and navigation labels from this page.',
    audit: 'Audit the page for clarity, conversion cues, accessibility risks, and recommended improvements.'
  };

  agentPrompt.value = templates[templateName] || templates.scan;
}

function hydratePage() {
  const page = getCurrentPageInfo();
  pageTitle.textContent = page.title;
  pageLink.href = page.url;
  pageLink.textContent = 'Open page';
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((btn) => btn.classList.toggle('active', btn === item));
    setPromptFromTemplate(item.dataset.template);
  });
});

pageLinkButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    if (target) {
      window.location.href = target;
    }
  });
});

runAgentBtn.addEventListener('click', runAgent);
quickActionBtn.addEventListener('click', quickInspect);
simulateClickBtn.addEventListener('click', () => {
  const localResult = toolClickCTA();
  resultBox.textContent = localResult;
  addHistory('Simulated CTA click');
  updateStatus('CTA action', 'success');
});
planActionBtn.addEventListener('click', () => {
  planNextStep();
});
resetPromptBtn.addEventListener('click', () => {
  agentPrompt.value = '';
  resultBox.innerHTML = '<p>Prompt reset. Ask the agent to inspect the page or perform a safe local action.</p>';
  updateStatus('Ready', 'success');
});

hydratePage();
setPromptFromTemplate('scan');
addHistory('Session initialized');
