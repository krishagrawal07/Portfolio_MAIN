// ═══════════════════════════════════════════════
// KRISH AGRAWAL — PORTFOLIO ENGINE
// Liquid Obsidian Design System
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initSpotlightCards();
  initTypewriter();
  initTerminal();
  initPipelineSimulator();
  initNavigation();
  initContactCopy();
  initScrollReveal();
});

// ─────────────────────────────────────────────
// 2. CARD SPOTLIGHT (mouse-tracking glow)
// ─────────────────────────────────────────────
function initSpotlightCards() {
  document.addEventListener('mousemove', e => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });
}

// ─────────────────────────────────────────────
// 3. TYPEWRITER
// ─────────────────────────────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const words = [
    'Data Pipeline Architect',
    'ML Model Builder',
    'Backend Engineer',
    'B.Tech CSE AI/ML Student',
  ];
  let wi = 0, ci = 0, deleting = false, speed = 100;

  function tick() {
    const word = words[wi];
    if (deleting) {
      el.textContent = word.substring(0, --ci);
      speed = 40;
    } else {
      el.textContent = word.substring(0, ++ci);
      speed = 90;
    }
    if (!deleting && ci === word.length) { speed = 2200; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; speed = 400; }
    setTimeout(tick, speed);
  }
  tick();
}

// ─────────────────────────────────────────────
// 4. TERMINAL
// ─────────────────────────────────────────────
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  function print(html, cls = '') {
    const d = document.createElement('div');
    d.className = 'terminal-line ' + cls;
    d.innerHTML = html;
    output.appendChild(d);
    d.closest('.terminal-body').scrollTop = 999999;
  }

  print('Portfolio shell initialized.');
  print('Welcome to <span class="text-primary">krish.dev()</span> — type <span class="text-primary">help</span> for commands.');

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    input.value = '';
    print(`<span class="prompt">❯</span> ${esc(cmd)}`);
    if (!cmd) return;

    const commands = {
      help: () => {
        print('Commands:');
        ['about','education','skills','projects','contact','resume','clear'].forEach(c =>
          print(`  <span class="text-primary">${c}</span>`)
        );
      },
      about: () => {
        print('<strong>Krish Agrawal</strong>');
        print('B.Tech CSE (AI/ML) — GLA University, 2nd Year');
        print('Passionate about data pipelines, ML, and system design.');
      },
      education: () => {
        print('<strong>GLA University, Mathura</strong>');
        print('B.Tech — CSE AI/ML (2nd Year) | CGPA: 8.4 / 10');
      },
      skills: () => {
        print('Languages  : Python, SQL, Go, Java');
        print('Data Eng   : Spark, Kafka, Airflow, dbt');
        print('Databases  : PostgreSQL, Snowflake, Redis, MongoDB');
        print('Backend    : FastAPI, REST, Pydantic, pytest');
        print('Cloud      : AWS, Docker, K8s, Terraform, CI/CD');
      },
      projects: () => {
        print('1. <span class="text-primary">Signal Stock Forecast Desk</span> — ML price prediction');
        print('2. <span class="text-primary">AI Resume Parser</span> — NLP document extraction');
        print('3. <span class="text-primary">Tranzio Sales Dashboard</span> — Analytics visualization');
      },
      contact: () => {
        print('Email   : <a href="mailto:krishagrawal706krish07@gmail.com" style="color:var(--accent-1);text-decoration:underline">krishagrawal706krish07@gmail.com</a>');
        print('GitHub  : <a href="https://github.com/krishagrawal07" target="_blank" style="color:var(--accent-1);text-decoration:underline">github.com/krishagrawal07</a>');
        print('LinkedIn: <a href="https://linkedin.com/in/krish-agrawal-0309152a8" target="_blank" style="color:var(--accent-1);text-decoration:underline">linkedin.com/in/krish-agrawal</a>');
      },
      resume: () => { print('Opening resume…'); window.open('Krish_Agrawal_Resume.pdf','_blank'); },
      clear: () => { output.innerHTML = ''; print('Shell cleared.'); },
    };

    if (commands[cmd]) commands[cmd]();
    else print(`Command not found: ${esc(cmd)}. Type <span class="text-primary">help</span>.`);
  });
}

// ─────────────────────────────────────────────
// 5. PIPELINE SIMULATOR
// ─────────────────────────────────────────────
function initPipelineSimulator() {
  const btn = document.getElementById('start-sim-btn');
  const status = document.getElementById('pipeline-status');
  const board = document.getElementById('pipeline-board');
  if (!btn || !status || !board) return;

  const stages = [
    { id:'sim-source', log:'Generating clickstream events (page views, clicks) as JSON...' },
    { id:'sim-kafka',  log:'Buffering events in Kafka topic on Redpanda broker...' },
    { id:'sim-spark',  log:'PySpark Structured Streaming: tumbling window aggregations...' },
    { id:'sim-db',     log:'Upserting aggregated counts to PostgreSQL with watermarks...' },
    { id:'sim-api',    log:'FastAPI serving cached views — Redis response < 10ms!' },
  ];

  let running = false;

  btn.addEventListener('click', async () => {
    if (running) return;
    running = true;
    btn.disabled = true;
    btn.style.opacity = '0.5';

    stages.forEach(s => document.getElementById(s.id)?.classList.remove('active'));
    status.textContent = 'Initializing stream…';

    for (let i = 0; i < stages.length; i++) {
      const el = document.getElementById(stages[i].id);
      if (el) el.classList.add('active');
      status.innerHTML = `<span class="prompt">[${i+1}/5]</span> ${stages[i].log}`;

      if (i < stages.length - 1) {
        const next = document.getElementById(stages[i+1].id);
        if (el && next && window.innerWidth > 968) await animatePacket(el, next);
        else await delay(1400);
      } else {
        await delay(1600);
      }
    }

    status.innerHTML = '✓ <strong style="color:var(--accent-4)">Pipeline complete.</strong> Data synced & APIs cached.';

    const apiNode = document.getElementById('sim-api');
    if (apiNode) {
      apiNode.style.boxShadow = '0 0 40px rgba(192,132,252,0.6)';
      setTimeout(() => { apiNode.style.boxShadow = ''; }, 1200);
    }

    running = false;
    btn.disabled = false;
    btn.style.opacity = '1';
  });

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  function animatePacket(from, to) {
    return new Promise(resolve => {
      const pkt = document.createElement('div');
      pkt.className = 'data-packet';
      board.appendChild(pkt);

      const br = board.getBoundingClientRect();
      const fr = from.getBoundingClientRect();
      const tr = to.getBoundingClientRect();

      const sx = fr.left + fr.width/2 - br.left;
      const sy = fr.top + fr.height/2 - br.top;
      const ex = tr.left + tr.width/2 - br.left;
      const ey = tr.top + tr.height/2 - br.top;

      pkt.style.left = sx + 'px';
      pkt.style.top = sy + 'px';
      pkt.offsetHeight; // force reflow

      pkt.style.transition = 'left 1.3s cubic-bezier(0.4,0,0.2,1), top 1.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease';
      pkt.style.left = ex + 'px';
      pkt.style.top = ey + 'px';

      setTimeout(() => { pkt.style.opacity = '0'; }, 1100);
      setTimeout(() => { pkt.remove(); resolve(); }, 1300);
    });
  }
}

// ─────────────────────────────────────────────
// 6. NAVIGATION
// ─────────────────────────────────────────────
function initNavigation() {
  const header = document.querySelector('header');
  const toggle = document.querySelector('.menu-toggle');
  const navUl = document.querySelector('nav ul');
  const links = document.querySelectorAll('nav ul a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);

    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) cur = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
    });
  });

  if (toggle && navUl) {
    toggle.addEventListener('click', () => {
      navUl.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      if (navUl.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(4px,4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
      }
    });
    links.forEach(l => l.addEventListener('click', () => {
      navUl.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => { s.style.transform='none'; s.style.opacity='1'; });
    }));
  }
}

// ─────────────────────────────────────────────
// 7. CONTACT COPY
// ─────────────────────────────────────────────
function initContactCopy() {
  document.querySelectorAll('.contact-card[data-copy]').forEach(card => {
    card.addEventListener('click', () => {
      const text = card.getAttribute('data-copy');
      const tip = card.querySelector('.copy-tooltip');
      navigator.clipboard.writeText(text).then(() => {
        if (tip) { tip.textContent = 'Copied!'; tip.classList.add('show'); setTimeout(() => tip.classList.remove('show'), 2000); }
      }).catch(() => {
        if (tip) { tip.textContent = 'Failed'; tip.classList.add('show'); setTimeout(() => tip.classList.remove('show'), 2000); }
      });
    });
  });
}

// ─────────────────────────────────────────────
// 8. SCROLL REVEAL (IntersectionObserver)
// ─────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach(el => observer.observe(el));
}
