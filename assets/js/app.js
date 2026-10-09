/* =====================================================================
   HTB Academy — Apunte de study notes
   Comportamiento de la página. Vanilla JS, sin dependencias.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. Tema claro / oscuro
     Prioridad: elección guardada > preferencia del sistema.
     --------------------------------------------------------------- */
  const THEME_KEY = 'htb-nta-tema';

  const Theme = {
    init() {
      const saved = safeGet(THEME_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.apply(saved || (prefersDark ? 'dark' : 'light'), false);

      document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          this.apply(next, true);
        });
      });

      // Sigue al sistema si la persona nunca eligió manualmente.
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!safeGet(THEME_KEY)) this.apply(e.matches ? 'dark' : 'light', false);
      });
    },
    apply(theme, persist) {
      document.documentElement.setAttribute('data-theme', theme);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', theme === 'dark' ? '#0c0e11' : '#fafafa');
      const nextTheme = theme === 'dark' ? 'claro' : 'oscuro';
      document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.setAttribute('aria-label', `Activar tema ${nextTheme}`);
        btn.setAttribute('title', `Activar tema ${nextTheme}`);
        const label = btn.querySelector('.theme-label');
        if (label) label.textContent = nextTheme[0].toUpperCase() + nextTheme.slice(1);
      });
      if (persist) safeSet(THEME_KEY, theme);
    }
  };

  /* ---------------------------------------------------------------
     2. Utilidades
     --------------------------------------------------------------- */
  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* modo privado */ } }

  /* ---------------------------------------------------------------
     3. Stepper del flujo de trabajo de NTA
     --------------------------------------------------------------- */
  const WORKFLOW = [
    {
      t: 'Ingerir Tráfico',
      ic: 'download',
      d: 'Una vez que hayamos decidido nuestra ubicación, comienza a capturar tráfico. Usa filtros de captura si ya tienes una idea de lo que estás buscando.',
      ask: []
    },
    {
      t: 'Reducir Ruido',
      ic: 'filter',
      d: 'Capturar un enlace, especialmente en producción, es extremadamente ruidoso. Filtrar el tráfico innecesario facilita el análisis — el tráfico de difusión (broadcast) y multidifusión (multicast) son los primeros en irse.',
      ask: []
    },
    {
      t: 'Analizar y Explorar',
      ic: 'search',
      d: 'Es el momento de extraer los datos pertinentes al problema. Observa hosts específicos, protocolos, e incluso cosas como los flags establecidos en la cabecera TCP.',
      ask: [
        '¿El tráfico está cifrado o en texto plano? ¿Debería estarlo?',
        '¿Se ven usuarios intentando acceder a recursos a los que no deberían?',
        '¿Están hosts diferentes hablando entre sí cuando normalmente no lo hacen?'
      ]
    },
    {
      t: 'Detectar y Alertar',
      ic: 'bell',
      d: '¿Vemos algún error? ¿Hay algún dispositivo que no responde y debería hacerlo? Usa tu análisis para decidir si lo que ves es benigno o potencialmente malicioso. Herramientas como IDS e IPS pueden aplicar heurísticas y firmas aquí.',
      ask: []
    },
    {
      t: 'Corregir y Monitorear',
      ic: 'repeat',
      d: 'Este paso NO es parte del bucle, pero debe incluirse en cualquier flujo de trabajo. Si arreglas un problema, hay que seguir monitoreando esa fuente un tiempo para confirmar que se resolvió.',
      ask: [],
      off: true
    }
  ];

  const ICONS = {
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'
  };

  function initWorkflow() {
    const steps = document.getElementById('wsteps');
    const body = document.getElementById('wbody');
    if (!steps || !body) return;

    let current = 0;

    WORKFLOW.forEach((w, i) => {
      const b = document.createElement('button');
      b.className = 'ws';
      b.type = 'button';
      b.setAttribute('aria-label', `Mostrar paso ${i + 1}: ${w.t}`);
      b.innerHTML =
        '<span class="wn">Paso ' + (i + 1) + (w.off ? ' · fuera del bucle' : '') + '</span>' +
        '<span class="wt">' + w.t + '</span>';
      b.addEventListener('click', () => { current = i; draw(); });
      steps.appendChild(b);
    });

    function draw() {
      const w = WORKFLOW[current];
      [...steps.children].forEach((c, i) => c.classList.toggle('on', i === current));
      [...steps.children].forEach((c, i) => c.setAttribute('aria-current', i === current ? 'step' : 'false'));

      let html =
        '<div class="wt2"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[w.ic] + '</svg>' + w.t + '</div>' +
        '<p>' + w.d + '</p>';

      if (w.ask.length) {
        html += '<div class="ask">' + w.ask.map(a => '<div>' + a + '</div>').join('') + '</div>';
        html += '<p style="margin-top:14px;font-size:14px;color:var(--faint)">' +
          'Estas son las tres preguntas que guían el paso 3 del módulo.</p>';
      }
      body.innerHTML = html;
    }

    draw();
  }

  function initBaselineDemo() {
    const demo = document.querySelector('[data-baseline-demo]');
    if (!demo) return;
    const panel = demo.querySelector('[data-baseline-panel]');
    const tabs = [...demo.querySelectorAll('[data-baseline-tab]')];
    const next = demo.querySelector('[data-baseline-next]');
    const reset = demo.querySelector('[data-baseline-reset]');
    const progress = demo.querySelector('[data-baseline-progress]');
    let current = 'normal';
    let revealed = 0;
    const scenarios = {
      normal: {
        kind: 'normal',
        title: 'PC-07 está realizando una tarea normal',
        intro: 'Una persona abre una página web. El equipo necesita consultar el DNS y después conectarse al servidor web.',
        rows: [
          ['1', 'PC-07', 'consulta el nombre', 'DNS interno', 'UDP 53'],
          ['2', 'PC-07', 'solicita la página', 'Servidor web', 'TCP 443']
        ],
        result: 'Esto coincide con la línea base: equipo conocido, servicios conocidos y conexiones que esperamos ver.'
      },
      scan: {
        kind: 'scan',
        title: 'PC-19 está probando muchos puertos',
        intro: 'En solo 30 segundos, el mismo equipo intenta conectarse a puertos diferentes para descubrir qué servicios están disponibles.',
        rows: [
          ['1', 'PC-19', 'intenta conectarse', 'Servidor', 'TCP 21 · FTP'],
          ['2', 'PC-19', 'intenta conectarse', 'Servidor', 'TCP 445 · SMB'],
          ['3', 'PC-19', 'intenta conectarse', 'Servidor', 'TCP 3389 · RDP']
        ],
        result: 'Esto no confirma un ataque por sí solo, pero sí es un patrón que debe investigarse: mismo origen, muchos puertos y poco tiempo.'
      }
    };

    function draw(name) {
      const s = scenarios[name];
      current = name;
      const visible = Math.min(revealed, s.rows.length);
      panel.className = 'baseline-panel ' + s.kind;
      panel.innerHTML =
        '<div class="baseline-panel-head"><span class="case-status ' + (s.kind === 'normal' ? 'normal' : 'suspicious') + '">' +
        (s.kind === 'normal' ? 'Comportamiento esperado' : 'Revisar') + '</span><h3>' + s.title + '</h3><p>' + s.intro + '</p></div>' +
        '<div class="baseline-events">' + s.rows.map((r, i) =>
          '<div class="baseline-event ' + (i < visible ? 'is-visible' : '') + '"><span class="event-number">' + r[0] + '</span><span class="event-host">' + r[1] +
          '</span><span class="event-action">' + r[2] + '</span><span class="event-target">' + r[3] +
          '</span><span class="event-port">' + r[4] + '</span></div>').join('') + '</div>' +
        '<div class="baseline-result ' + (visible === s.rows.length ? 'is-ready' : '') + '"><b>' +
        (visible === s.rows.length ? 'Interpretación:' : 'Observa antes de concluir:') + '</b> ' +
        (visible === s.rows.length ? s.result : 'todavía faltan eventos por observar.') + '</div>';
      tabs.forEach((tab) => {
        const active = tab.dataset.baselineTab === name;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      if (progress) progress.textContent = 'Paso ' + visible + ' de ' + s.rows.length;
      if (next) {
        next.disabled = visible === s.rows.length;
        next.textContent = visible === s.rows.length ? 'Escenario completo' : 'Ver siguiente evento';
      }
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => {
      revealed = 0;
      draw(tab.dataset.baselineTab);
    }));
    if (next) next.addEventListener('click', () => {
      if (revealed < scenarios[current].rows.length) {
        revealed++;
        draw(current);
      }
    });
    if (reset) reset.addEventListener('click', () => {
      revealed = 0;
      draw(current);
    });
    draw('normal');
  }

  /* ---------------------------------------------------------------
     4. Stepper de encapsulación (PDU)
     --------------------------------------------------------------- */
  const ENCAPSULATION = [
    {
      n: 2, name: 'Data Link', tcp: '1 · Enlace', col: 'var(--l2)',
      label: 'Cabecera Ethernet', bytes: 14, flex: 14,
      job: 'Pega la MAC de origen y destino: a qué tarjeta de red de al lado se lo entrego. Añade un checksum de integridad.',
      res: 'La unidad de datos ahora se llama <b>frame</b>. Solo sirve dentro del dominio de difusión.'
    },
    {
      n: 3, name: 'Network', tcp: '2 · Internet', col: 'var(--l3)',
      label: 'Cabecera IP', bytes: 20, flex: 20,
      job: 'Pega las IP de origen y destino, el TTL y el protocolo. Gracias a esto la PDU puede cruzar redes.',
      res: 'Ahora se llama <b>packet</b>. Es aquí donde la IP pasa de estar en tu LAN a poder viajar por el mundo.'
    },
    {
      n: 4, name: 'Transport', tcp: '3 · Transporte', col: 'var(--l4)',
      label: 'Cabecera TCP', bytes: 20, flex: 20,
      job: 'Añade los puertos (443, 53) y la maquinaria de fiabilidad: números de secuencia y acuses de recibo.',
      res: 'Ahora se llama <b>segment</b>. Con UDP sería un <b>datagrama</b>, sin nada de esa maquinaria.'
    },
    {
      n: 7, name: 'Application', tcp: '4 · Aplicación', col: 'var(--l7)',
      label: 'Datos HTTP', bytes: 100, flex: 100,
      job: 'El contenido real: la petición GET, el email, el vídeo. Es la capa que usan tus programas.',
      res: 'PDU completa: sale a la red con las cabeceras de 2, 3 y 4 envolviendo los datos de 7.'
    },
    {
      n: 2, name: 'Data Link', tcp: '1 · Enlace', col: 'var(--l2)',
      label: 'FCS', bytes: 4, flex: 6,
      job: 'El receptor abre la trama, comprueba el checksum y la descarta si llegó corrupta.',
      res: 'Si falla el checksum, la trama se tira. TCP no se entera salvo por la ausencia de su ACK.'
    }
  ];

  function initEncapsulation() {
    const bar = document.getElementById('bar');
    const wire = document.getElementById('wire');
    const box = document.getElementById('stepbox');
    const dots = document.getElementById('dots');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    if (!bar || !wire || !box || !dots || !prev || !next) return;

    let cur = -1;

    ENCAPSULATION.forEach((s) => {
      const seg = document.createElement('div');
      seg.className = 'seg';
      seg.style.background = s.col;
      seg.style.flexGrow = 0.2;
      seg.textContent = s.label;
      bar.appendChild(seg);

      const w = document.createElement('span');
      w.textContent = s.bytes + ' B';
      wire.appendChild(w);

      const dot = document.createElement('div');
      dot.className = 'dot';
      dots.appendChild(dot);
    });

    function draw() {
      const segs = bar.children;
      const ds = dots.children;

      for (let i = 0; i < segs.length; i++) {
        segs[i].classList.toggle('on', i <= cur);
        segs[i].style.flexGrow = i <= cur ? ENCAPSULATION[i].flex : 0.2;
      }
      for (let i = 0; i < ds.length; i++) ds[i].classList.toggle('on', i <= cur);

      if (cur < 0) {
        box.innerHTML =
          '<div class="stepno" style="background:var(--faint)">7</div><div>' +
          '<div class="steptitle"><span class="lay">Application · datos sueltos</span>' +
          '<span class="tag">TCP/IP 4</span></div>' +
          '<div class="jt">Un bloque de bytes sin ninguna etiqueta. Todavía no sabe a dónde va. ' +
          'Pulsa <b>Bajar</b> para empezar a envolverlo.</div></div>' +
          '<p class="interaction-status">Estado: datos de aplicación sin encapsular.</p>';
      } else {
        const s = ENCAPSULATION[cur];
        box.innerHTML =
          '<div class="stepno" style="background:' + s.col + '">' + s.n + '</div><div>' +
          '<div class="steptitle"><span class="lay">' + s.name + '</span>' +
          '<span class="tag">TCP/IP ' + s.tcp + '</span></div>' +
          '<div class="jt">' + s.job + '</div>' +
          '<div class="res">' + s.res + '</div></div>' +
          '<p class="interaction-status">Paso ' + (cur + 1) + ' de ' + ENCAPSULATION.length + ': se ha añadido <b>' + s.label + '</b>.</p>';
      }

      prev.disabled = cur < 0;
      next.disabled = cur >= ENCAPSULATION.length - 1;
      prev.setAttribute('aria-label', cur < 0 ? 'Subir: inicio' : 'Subir a la capa anterior');
      next.setAttribute('aria-label', next.disabled ? 'Bajar: encapsulación completa' : 'Bajar y añadir la siguiente cabecera');
    }

    next.addEventListener('click', () => { if (cur < ENCAPSULATION.length - 1) { cur++; draw(); } });
    prev.addEventListener('click', () => { if (cur >= 0) { cur--; draw(); } });

    // Flechas del teclado dentro del stepper
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowRight' && !next.disabled) { cur++; draw(); }
      if (e.key === 'ArrowLeft' && !prev.disabled) { cur--; draw(); }
    });

    draw();
  }

  /* ---------------------------------------------------------------
     5. Tarjetas de preguntas: modo repaso, progreso y copiar
     La clave de almacenamiento incluye el módulo (data-module en el
     <body>) para que el progreso de un módulo no pise el de otro.
     --------------------------------------------------------------- */
  function initQuestions() {
    const cards = [...document.querySelectorAll('.qb')];
    if (!cards.length) return;

    cards.forEach((card) => {
      const row = card.querySelector('.row');
      const ans = card.querySelector('.ans');

      // Botón "copiar respuesta"
      if (row && ans && !row.querySelector('.copy')) {
        const copy = document.createElement('button');
        copy.className = 'copy';
        copy.type = 'button';
        copy.textContent = 'copiar';
        copy.title = 'Copiar la respuesta al portapapeles';
        row.appendChild(copy);

        copy.addEventListener('click', (ev) => {
          ev.stopPropagation();
          copyText(ans.textContent.trim()).then((ok) => {
            copy.textContent = ok ? '✓ copiado' : 'error';
            copy.classList.toggle('ok', ok);
            setTimeout(() => { copy.textContent = 'copiar'; copy.classList.remove('ok'); }, 1600);
          });
        });
      }

      // Clic en la tarjeta = revelar / ocultar (solo en modo repaso)
      card.addEventListener('click', (ev) => {
        if (ev.target.closest('.copy')) return;
        if (document.body.classList.contains('quiz')) card.classList.toggle('rev');
      });
    });

    // Toggle modo repaso
    const bq = document.getElementById('btnQuiz');
    if (bq) {
      bq.setAttribute('aria-pressed', 'false');
      bq.title = 'Ocultar respuestas para practicar y revelarlas al pulsar cada tarjeta';
      bq.addEventListener('click', () => {
        document.body.classList.toggle('quiz');
        const on = document.body.classList.contains('quiz');
        bq.textContent = on ? 'Mostrar respuestas' : 'Ocultar respuestas';
        bq.setAttribute('aria-pressed', String(on));
        bq.title = on
          ? 'Mostrar de nuevo las respuestas de todas las preguntas'
          : 'Ocultar respuestas para practicar y revelarlas al pulsar cada tarjeta';
        bq.classList.toggle('pri', !on);
        cards.forEach((c) => c.classList.remove('rev'));
      });
    }

  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:absolute;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* ---------------------------------------------------------------
     6. Navegación: enlace activo + botón volver arriba
     --------------------------------------------------------------- */
  function initNav() {
    // Enlaces internos de todas las listas de navegación (barra superior y
    // menú lateral). Se descartan los href="#" —secciones pendientes— porque
    // '#' no es un selector válido.
    const links = [...document.querySelectorAll('.navlinks a, .sidenav a')]
      .filter((a) => {
        const h = a.getAttribute('href');
        return h && h.length > 1 && h.startsWith('#') && document.querySelector(h);
      });

    // Deduplica: un mismo destino puede aparecer en la barra y en el lateral.
    const byHref = new Map();
    links.forEach((a) => {
      const h = a.getAttribute('href');
      if (!byHref.has(h)) byHref.set(h, []);
      byHref.get(h).push(a);
    });

    const pairs = [...byHref.entries()].map(([href, els]) => ({
      href,
      els,
      target: document.querySelector(href)
    }));

    if (pairs.length) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          pairs.forEach((p) => p.els.forEach((el) => el.classList.toggle('on', p.href === '#' + en.target.id)));
        });
      }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
      pairs.forEach((p) => spy.observe(p.target));
    }

    const top = document.getElementById('totop');
    if (top) {
      const onScroll = () => top.classList.toggle('show', window.scrollY > 700);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }

  /* ---------------------------------------------------------------
     6.5 Menú móvil (hamburguesa)
     --------------------------------------------------------------- */
  function initMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.navlinks');
    if (!toggle || !nav) return;

    const open = () => {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú');
    };
    const close = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    };
    const isOpen = () => nav.classList.contains('is-open');

    toggle.addEventListener('click', () => (isOpen() ? close() : open()));

    // Cerrar al tocar un enlace (es un ancla: lleva a la sección)
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => { if (isOpen()) close(); })
    );

    // Cerrar al pulsar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) close();
    });

    // Cerrar al hacer click fuera del menú
    document.addEventListener('click', (e) => {
      if (!isOpen()) return;
      if (e.target.closest('.navlinks') || e.target.closest('.menu-toggle')) return;
      close();
    });

    // Si el viewport crece y deja de ser móvil, asegurar que el menú esté cerrado
    const mq = window.matchMedia('(min-width: 861px)');
    const onChange = (e) => { if (e.matches) close(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange); // Safari viejos
  }

  /* ---------------------------------------------------------------
     6.6 prefers-reduced-motion
     Cambia el scroll de "suave" a "instantáneo" si la persona
     pidió reducir movimiento, y desactiva el "scroll suave" de
     los anchors en HTML.
     --------------------------------------------------------------- */
  function respectMotionPreference() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (e) => {
      document.documentElement.style.scrollBehavior = e.matches ? 'auto' : '';
    };
    apply(mq);
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else mq.addListener(apply);
  }

  /* ---------------------------------------------------------------
     7. Arranque
     --------------------------------------------------------------- */
  function boot() {
    Theme.init();
    initMenu();
    initWorkflow();
    initBaselineDemo();
    initEncapsulation();
    initQuestions();
    initNav();
    respectMotionPreference();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();