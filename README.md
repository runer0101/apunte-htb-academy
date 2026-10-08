<div align="center">

# apunte-htb-academy

**Apunte en español del módulo _Intro to Network Traffic Analysis_ de HTB Academy.**

Cada pregunta del quiz aparece en **inglés**, con su **traducción**, la **respuesta**
y la **explicación de por qué** esa respuesta es la correcta.

[Ver la página](https://runer0101.github.io/apunte-htb-academy/) · [Ver el código](.)

</div>

---

## Qué es esto

Un cuaderno de estudio construido para acompañar el módulo **Intro to Network Traffic
Analysis** de HTB Academy (15 secciones). La idea que organiza todo el contenido es una:

> Para detectar algo raro necesitas primero saber qué es lo normal.

Por eso el módulo empieza —y este apunte también— estableciendo una **línea base** de
tráfico, y todo lo demás (BPF, TCP/IP, protocolos de aplicación) se explica en función de
detectar la desviación respecto a esa referencia.

### Estado actual

| | |
|---|---|
| Progreso del módulo | **3 de 15 secciones** (20 %) |
| Preguntas documentadas | **17** (9 en la sección 2 · 8 en la sección 3) |
| Secciones sin quiz | 1 (la sección 1 es solo teoría) |

| Sección | Tema | Apartados | Preguntas |
|---|---|---|---|
| 1 | Fundamentos de NTA | 6 | — |
| 2 | Manual básico: capas 1-4 | 6 | 9 |
| 3 | Manual básico: capas 5-7 | 4 | 8 |
| 4-15 | *Pendiente* | — | — |

---

## Cómo usar la página

| Acción | Cómo |
|---|---|
| **Repaso** | Pulsa **Ocultar respuestas**. Las respuestas se ocultan y se revelan una a una al hacer clic en cada tarjeta. |
| **Copiar** | El botón `copiar` de cada tarjeta pone la respuesta en el portapapeles, lista para pegarla en el formulario de HTB. |
| **Progreso** | El botón `dominada` marca cada pregunta como aprendida. El progreso se guarda en `localStorage`, en tu navegador y en ese dispositivo. |
| **Tema claro/oscuro** | El botón de la luna en la barra superior. Sigue la preferencia del sistema hasta que elijas manualmente. |
| **Imprimir** | `Ctrl+P` — el CSS de impresión despliega todas las respuestas y oculta los controles. |
| **Navegar** | `←` y `→` mueven el stepper de encapsulación. |

### Cómo está escrita cada pregunta

Las tarjetas de preguntas usan siempre la misma estructura, pensada para que alguien que
empieza entienda no solo *qué* responder sino *por qué*:

```
┌─────────────────────────────────────────────────┐
│  Q3   Question · Traducción                      │
│                                                 │
│  True or False: Routers operate at layer 2...?  │  ← como aparece en HTB
│  ¿Los routers operan en la capa 2 del OSI?      │  ← en el idioma en que lees
│                                                 │
│  Answer                              [False]    │  ← en inglés y sin tildes
│  ─────────────────────────────────────────────  │
│  Por qué                                         │
│  Un router decide mirando la cabecera IP...     │  ← el motivo, no solo la respuesta
└─────────────────────────────────────────────────┘
```

---

## Estructura del proyecto

```
apunte-htb-academy/
├── index.html              # Todo el contenido de las 3 secciones
├── assets/
│   ├── css/style.css       # Design tokens, modo oscuro, responsive, impresión
│   ├── js/app.js           # Stepper NTA, encapsulación, quiz, tema, scrollspy
│   └── favicon.svg
├── .github/workflows/
│   └── pages.yml           # Publicación automática en GitHub Pages
├── .nojekyll               # Evita que Jekyll procese los archivos
├── README.md
├── LICENSE
├── .editorconfig
└── .gitignore
```

**Sin dependencias, sin build, sin framework.** Es HTML, CSS y JavaScript planos: se abre
`index.html` en el navegador y funciona. Las únicas peticiones externas son las fuentes
Google Fonts, y si no hay conexión el sitio cae a las tipografías del sistema sin romperse.

---

## Añadir una sección nueva

El contenido está pensado para crecer. Para sumar la sección 4 (o la que toque):

1. **Añade el encabezado de sección**, copiando el patrón existente:

   ```html
   <div class="part" id="sec4">Sección 4 <span>Título de la sección</span></div>

   <section>
     <h2>Primer apartado</h2>
     <p class="sub">Explicación del apartado…</p>
   </section>
   ```

2. **Registra el enlace** en la barra superior y en el índice, para que no se queden
   desincronizados:

   ```html
   <!-- barra superior -->
   <a href="#sec4">Sección 4</a>

   <!-- índice -->
   <a class="toc-item" href="#sec4">
     <span class="tn">Sección 4</span>
     <span class="tt">Título de la sección</span>
     <span class="ts">Descripción breve…</span>
     <span class="tc">N apartados · M preguntas</span>
   </a>
   ```

3. **Añade las preguntas** dentro de un `<div class="qblock">`, con el mismo orden
   Question → Traducción → Answer → Por qué:

   ```html
   <div class="qb" id="q4-1">
     <div class="qtop">
       <span class="qnum">Q1</span>
       <span class="qlab l-en">Question</span>
       <span class="qlab l-es">Traducción</span>
     </div>
     <p class="qen">…en inglés, tal cual aparece en HTB…</p>
     <p class="qes">…traducción al español…</p>
     <div class="row">
       <span class="qlab l-an">Answer</span>
       <span class="ans">…respuesta…</span>
     </div>
     <div class="why-wrap">
       <span class="qlab l-wy">Por qué</span>
       <div class="why">…la explicación de por qué esa respuesta…</div>
     </div>
   </div>
   ```

4. **Actualiza los contadores** que están en tres sitios: el `rbcount` inicial
   (`0 / 17`), la barra de progreso del módulo (`.track`) y las filas de la tabla de este
   README.

> **Regla de oro de las respuestas:** van **en inglés**, **sin tildes**, y los números
> **solos**, sin palabras ni unidades. Algunas preguntas exigen un formato exacto
> (`MAC-addressing` con guion, `20 21` con espacio) — está anotado en cada caso.

---

## Publicarlo

El sitio se publica en GitHub Pages con GitHub Actions: cada `push` a `main` dispara
`.github/workflows/pages.yml`, que sube el contenido sin ningún paso de build.

```bash
git add .
git commit -m "Añade la sección 4 al apunte"
git push
```

El sitio queda en <https://runer0101.github.io/apunte-htb-academy/> en unos segundos.
Puedes seguir el progreso en la pestaña **Actions** del repo, y relanzar el despliegue a
mano con el botón *Run workflow*.

> **Habilitar Pages (una sola vez):** ve a **Settings → Pages → Build and deployment →
> Source** y ponlo en **GitHub Actions**. Sin ese ajuste el workflow falla con
> `Resource not accessible by integration`, porque el token del workflow puede publicar
> en un sitio existente pero no tiene permiso para crearlo.
>
> La fuente de Pages y el workflow son excluyentes: si en algún momento cambias la fuente
> en *Settings → Pages*, el workflow deja de ejecutarse, y viceversa.

---

## Convenciones

- **Idioma:** la interfaz, las explicaciones y los comentarios van en español. Los
  enunciados y las respuestas del quiz van en inglés, tal cual los pide HTB.
- **Estilos:** todo pasa por los design tokens del bloque `:root` (y su equivalente
  `[data-theme="dark"]`). No pongas colores sueltos en el HTML: si añades un color, añádelo
  como variable para que el modo oscuro siga funcionando.
- **Interacciones:** vanilla JS en `assets/js/app.js`, agrupadas en funciones `init*()`.
- **Tipografía:** `Outfit` para texto, `JetBrains Mono` para puertos, IPs, flags y
  comandos.

---

## Sobre el quiz de HTB

El formulario de HTB Academy tiene bugs conocidos: rechaza respuestas que son correctas.
Si te pasa, la respuesta está en la sección **«Si una respuesta correcta te sale como
incorrecta»** de la página. Resumen rápido: escríbela a mano en vez de pegarla, sin espacios
ni punto final, y prueba en minúscula.

---

## Licencia

MIT — ver [LICENSE](LICENSE).

El contenido procede del material del módulo de HTB Academy y de las especificaciones
públicas citadas (RFC 2616, 2246 y 959, y `pcap-filter(7)`). Este apunte es material de
estudio no oficial y no está afiliado a Hack The Box.

---

<div align="center">
  <sub>Hecho con HTML, CSS y JavaScript planos. Sin rastreadores, sin cookies, sin dependencias.</sub>
</div>