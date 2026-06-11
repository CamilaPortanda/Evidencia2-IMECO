import { useState, useEffect, useRef } from "react";
import "./App.css";

/* ============================================================
   DATA
   ============================================================ */

const PIPELINE = [
  {
    id: "prompt",
    label: "PROMPT",
    title: "¿Qué lenguaje entiende la IA?",
    body: [
      "Aunque parece entender español, inglés o cualquier lenguaje humano, la IA realmente no comprende palabras como lo hacemos las personas. Lo que recibe es una secuencia de símbolos que después transforma en representaciones matemáticas.",
      "El verdadero lenguaje de una IA moderna son los vectores numéricos y las relaciones estadísticas aprendidas durante su entrenamiento.",
    ],
    visual: "tokens-to-numbers",
    conclusion: "La IA no piensa en palabras. Piensa en patrones matemáticos.",
  },
  {
    id: "lexico",
    label: "LÉXICO",
    title: "Análisis léxico",
    detonator: "¿Se relaciona con el análisis léxico que aprendimos?",
    body: [
      "Sí. Al igual que un compilador divide un programa en tokens, la IA divide el texto en unidades llamadas tokens.",
    ],
    visual: "lexico-compare",
    conclusion:
      "El análisis léxico sigue existiendo; simplemente se aplica a lenguaje natural en lugar de código.",
  },
  {
    id: "sintaxis",
    label: "SINTAXIS",
    title: "Análisis sintáctico",
    detonator: "¿La IA analiza sintaxis?",
    body: [
      "Sí, aunque de una forma distinta a los compiladores tradicionales. Un compilador valida reglas estrictas:",
    ],
    visual: "sintaxis-tree",
    conclusion:
      "No utiliza gramáticas formales estrictas para comprender texto, pero sí aprende patrones sintácticos complejos.",
  },
  {
    id: "semantica",
    label: "SEMÁNTICA",
    title: "Semántica",
    detonator: "¿Cómo obtiene significado?",
    body: [
      "La IA no conoce definiciones como un diccionario. Aprende significado observando relaciones entre palabras.",
    ],
    visual: "semantica-graph",
    conclusion: "La semántica emerge de las relaciones estadísticas entre conceptos.",
  },
  {
    id: "modelo",
    label: "MODELO DE LENGUAJE",
    title: "Modelo de lenguaje",
    detonator: "¿Qué modelo está detrás de toda la aplicación?",
    body: [
      "Los Large Language Models (LLMs) son redes neuronales entrenadas para predecir el siguiente token más probable.",
      "Sorprendentemente, gran parte de la inteligencia aparente surge de repetir este proceso miles de veces.",
    ],
    visual: "next-token",
    conclusion: null,
  },
];

const EXTRA_BLOCKS = [
  {
    id: "pensar",
    title: "¿Puede pensar como nosotros?",
    detonator: "¿Puede utilizar métodos de solución de problemas aprendidos en el curso?",
    intro: "Puede imitarlos extraordinariamente bien.",
    yes: [
      "Generar autómatas",
      "Diseñar gramáticas",
      "Programar en paradigmas funcionales",
      "Programar en lógica",
      "Programar orientado a objetos",
      "Resolver ejercicios",
    ],
    but: "No razona exactamente igual que un humano. Reconoce patrones aprendidos y los reutiliza.",
  },
  {
    id: "metalenguaje",
    title: "¿Es un metalenguaje?",
    answer: "No estrictamente.",
    body: [
      "Metalenguaje: lenguaje que describe otros lenguajes.",
      "La IA no describe únicamente lenguajes. Puede hablar sobre cualquier dominio.",
    ],
    conclusion:
      "Se parece a un metalenguaje por su capacidad de representar otros sistemas simbólicos, pero técnicamente no lo es.",
  },
  {
    id: "inventar",
    title: "¿Puede inventar lenguajes?",
    answer: "Sí.",
    code: ["Move(Forward, 3)", "Turn(Left)", "Pick(Object)"],
    body: ["La IA puede diseñar sintaxis completamente nuevas."],
    but: "Un lenguaje solo es útil si resuelve un problema real mejor que las alternativas existentes.",
    conclusion: "Crear un lenguaje es fácil. Lograr que sea útil es el verdadero desafío.",
  },
];

/* ============================================================
   PARTICLES BACKGROUND
   ============================================================ */

function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function init() {
      resize();
      const count = Math.floor((canvas.width * canvas.height) / 22000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.6 + 0.4,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(124, 255, 178, 0.35)";
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />;
}

/* ============================================================
   SCREEN 0 — INTRO
   ============================================================ */

function IntroScreen({ onStart }) {
  const [phase, setPhase] = useState("boot"); // boot -> ready -> processing
  const [prompt, setPrompt] = useState("");
  const fullPrompt = "Explícame cómo funcionas";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("typing"), 1400);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setPrompt(fullPrompt.slice(0, i));
      if (i >= fullPrompt.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("ready"), 400);
      }
    }, 38);
    return () => clearInterval(interval);
  }, [phase]);

  function handleProcess() {
    setPhase("processing");
    setTimeout(() => onStart(), 1100);
  }

  return (
    <section className={`screen intro-screen ${phase === "processing" ? "zooming" : ""}`}>
      <Particles />
      <div className="intro-content">
        {phase === "boot" && <div className="boot-line">INITIALIZING GENERATIVE AI...</div>}

        {phase !== "boot" && (
          <>
            <div className="boot-line dim">INITIALIZING GENERATIVE AI... OK</div>
            <h1 className="intro-title">Inside the Prompt</h1>
            <p className="intro-subtitle">
              Explorando cómo la IA entiende el lenguaje, transforma la profesión y redefine el
              aprendizaje
            </p>
            <p className="intro-byline">
              Una experiencia interactiva sobre el impacto de la IA generativa desde la
              perspectiva de una futura ingeniera en tecnologías computacionales.
            </p>

            <div className="prompt-shell">
              <div className="prompt-shell-label">Ingrese un prompt para iniciar</div>
              <div className="prompt-box">
                <span className="prompt-caret">&gt;</span>
                <span className="prompt-text">{prompt}</span>
                <span className="cursor-blink">▍</span>
              </div>
              <button
                className="btn-process"
                onClick={handleProcess}
                disabled={phase !== "ready"}
              >
                Procesar
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   VISUALS for pipeline blocks
   ============================================================ */

function VisualTokensToNumbers() {
  const tokens = ["Explícame", "recursión"];
  const nums = ["2451", "182", "992", "712"];
  return (
    <div className="visual tokens-visual">
      <div className="row">
        <span className="chip text-chip">"Explícame recursión"</span>
      </div>
      <div className="arrow">↓</div>
      <div className="row wrap">
        {nums.map((n) => (
          <span key={n} className="chip num-chip">
            [{n}]
          </span>
        ))}
      </div>
      <p className="visual-caption">
        Antes de entender algo, la IA convierte el lenguaje humano en números.
      </p>
    </div>
  );
}

function VisualLexico() {
  return (
    <div className="visual lexico-visual">
      <div className="compare-grid">
        <div className="compare-col">
          <div className="compare-label">Compilador</div>
          <div className="code-line">if(x&gt;0)</div>
          <div className="arrow">↓</div>
          <div className="token-row">
            {["if", "(", "x", ">", "0", ")"].map((t, i) => (
              <span key={i} className="chip code-chip">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="compare-col">
          <div className="compare-label">IA</div>
          <div className="code-line">Explícame recursión en Prolog</div>
          <div className="arrow">↓</div>
          <div className="token-row">
            {["Explícame", "recursión", "en", "Prolog"].map((t, i) => (
              <span key={i} className="chip text-chip-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualSintaxis() {
  return (
    <div className="visual sintaxis-visual">
      <div className="compare-grid">
        <div className="compare-col">
          <div className="compare-label valid">Válido</div>
          <div className="code-line">if(x &gt; 0){"{"}</div>
        </div>
        <div className="compare-col">
          <div className="compare-label invalid">No válido</div>
          <div className="code-line">if x &gt; 0 {"{"}</div>
        </div>
      </div>
      <div className="tree">
        <div className="tree-node root">Explícame</div>
        <div className="tree-line" />
        <div className="tree-node">recursión</div>
        <div className="tree-line" />
        <div className="tree-node">en Prolog</div>
      </div>
    </div>
  );
}

function VisualSemantica() {
  return (
    <div className="visual semantica-visual">
      <svg viewBox="0 0 320 160" className="semantica-svg" role="img" aria-label="Red de relaciones semánticas">
        <line x1="80" y1="40" x2="80" y2="120" stroke="var(--accent-cyan)" strokeWidth="1.5" opacity="0.6" />
        <line x1="240" y1="40" x2="240" y2="120" stroke="var(--accent-cyan)" strokeWidth="1.5" opacity="0.6" />
        <line x1="80" y1="120" x2="240" y2="120" stroke="var(--accent-green)" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="80" cy="40" r="6" fill="var(--accent-amber)" />
        <circle cx="240" cy="40" r="6" fill="var(--accent-amber)" />
        <circle cx="80" cy="120" r="6" fill="var(--accent-green)" />
        <circle cx="240" cy="120" r="6" fill="var(--accent-green)" />
        <text x="80" y="32" textAnchor="middle" className="svg-label">mascota</text>
        <text x="240" y="32" textAnchor="middle" className="svg-label">mascota</text>
        <text x="80" y="142" textAnchor="middle" className="svg-label">Perro</text>
        <text x="240" y="142" textAnchor="middle" className="svg-label">Gato</text>
        <text x="160" y="112" textAnchor="middle" className="svg-label accent">≈</text>
      </svg>
    </div>
  );
}

function VisualNextToken() {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="visual nexttoken-visual">
      <div className="code-line">La recursión es una técnica de programación que...</div>
      <div className="arrow">↓</div>
      <div className={`next-token-prompt ${revealed ? "revealed" : ""}`}>
        ¿cuál palabra sigue?
      </div>
    </div>
  );
}

function PipelineVisual({ name }) {
  switch (name) {
    case "tokens-to-numbers":
      return <VisualTokensToNumbers />;
    case "lexico-compare":
      return <VisualLexico />;
    case "sintaxis-tree":
      return <VisualSintaxis />;
    case "semantica-graph":
      return <VisualSemantica />;
    case "next-token":
      return <VisualNextToken />;
    default:
      return null;
  }
}

/* ============================================================
   SCREEN 1 — PIPELINE / LANGUAGE UNDERSTANDING
   ============================================================ */

function PipelineScreen({ onContinue }) {
  const [openId, setOpenId] = useState(null);
  const [visited, setVisited] = useState(new Set());

  function openBlock(id) {
    setOpenId(id);
    setVisited((prev) => new Set(prev).add(id));
  }

  const allVisited = visited.size === PIPELINE.length;
  const active = PIPELINE.find((b) => b.id === openId);

  return (
    <section className="screen pipeline-screen">
      <div className="section-header">
        <span className="section-eyebrow">01</span>
        <h2>¿Cómo entiende una IA el lenguaje?</h2>
        <p className="section-hint">
          Toca cada bloque del flujo para revelar qué ocurre dentro.
        </p>
      </div>

      <div className={`pipeline-layout ${active ? "with-panel" : ""}`}>
        <div className="pipeline-flow">
          {PIPELINE.map((block, i) => (
            <div key={block.id} className="pipeline-step">
              <button
                className={`pipeline-node ${openId === block.id ? "active" : ""} ${
                  visited.has(block.id) ? "visited" : ""
                }`}
                onClick={() => openBlock(block.id)}
              >
                <span className="node-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="node-label">{block.label}</span>
              </button>
              {i < PIPELINE.length - 1 && <div className="pipeline-connector">↓</div>}
            </div>
          ))}
        </div>

        {active && (
          <aside className="side-panel">
            <button className="panel-close" onClick={() => setOpenId(null)} aria-label="Cerrar">
              ×
            </button>
            {active.detonator && <div className="panel-detonator">{active.detonator}</div>}
            <h3 className="panel-title">{active.title}</h3>
            {active.body.map((p, i) => (
              <p key={i} className="panel-text">
                {p}
              </p>
            ))}
            {active.id === "sintaxis" && (
              <>
                <div className="code-line valid-line">if(x &gt; 0){"{"}</div>
                <div className="panel-text">es válido.</div>
                <div className="code-line invalid-line">if x &gt; 0 {"{"}</div>
                <div className="panel-text">no lo es.</div>
                <div className="panel-text">
                  Mientras que la IA aprende estructuras observando millones de ejemplos.
                </div>
              </>
            )}
            {active.id === "semantica" && (
              <div className="panel-text mono">
                Perro → mascota
                <br />
                Gato → mascota
                <br />
                Perro ≈ Gato
              </div>
            )}
            <PipelineVisual name={active.visual} />
            {active.conclusion && <div className="panel-conclusion">{active.conclusion}</div>}
          </aside>
        )}
      </div>

      <button className={`btn-continue ${allVisited ? "ready" : ""}`} onClick={onContinue}>
        {allVisited ? "Continuar →" : `Explorado: ${visited.size} / ${PIPELINE.length}`}
      </button>
    </section>
  );
}

/* ============================================================
   SCREEN 1.5 — EXTRA BLOCKS (puede pensar / metalenguaje / inventar)
   ============================================================ */

function ExtraBlocksScreen({ onContinue }) {
  return (
    <section className="screen extra-screen">
      <div className="section-header">
        <span className="section-eyebrow">01.5</span>
        <h2>Más allá del lenguaje</h2>
      </div>

      <div className="extra-grid">
        {/* Block: ¿Puede pensar como nosotros? */}
        <div className="extra-card">
          <div className="panel-detonator">{EXTRA_BLOCKS[0].detonator}</div>
          <h3 className="panel-title">{EXTRA_BLOCKS[0].title}</h3>
          <p className="panel-text">{EXTRA_BLOCKS[0].intro}</p>
          <div className="split-panel">
            <div className="split-col yes">
              <div className="split-label">Sí puede</div>
              <ul className="check-list">
                {EXTRA_BLOCKS[0].yes.map((y) => (
                  <li key={y}>
                    <span className="check">✓</span> {y}
                  </li>
                ))}
              </ul>
            </div>
            <div className="split-col but">
              <div className="split-label">Pero</div>
              <p className="panel-text">{EXTRA_BLOCKS[0].but}</p>
            </div>
          </div>
        </div>

        {/* Block: ¿Es un metalenguaje? */}
        <div className="extra-card">
          <h3 className="panel-title">{EXTRA_BLOCKS[1].title}</h3>
          <div className="panel-answer">{EXTRA_BLOCKS[1].answer}</div>
          {EXTRA_BLOCKS[1].body.map((p, i) => (
            <p key={i} className="panel-text">
              {p}
            </p>
          ))}
          <div className="panel-conclusion">{EXTRA_BLOCKS[1].conclusion}</div>
        </div>

        {/* Block: ¿Puede inventar lenguajes? */}
        <div className="extra-card">
          <h3 className="panel-title">{EXTRA_BLOCKS[2].title}</h3>
          <div className="panel-answer">{EXTRA_BLOCKS[2].answer}</div>
          <div className="code-block">
            {EXTRA_BLOCKS[2].code.map((line, i) => (
              <div key={i} className="code-line">
                {line}
              </div>
            ))}
          </div>
          {EXTRA_BLOCKS[2].body.map((p, i) => (
            <p key={i} className="panel-text">
              {p}
            </p>
          ))}
          <p className="panel-text but-text">{EXTRA_BLOCKS[2].but}</p>
          <div className="panel-conclusion">{EXTRA_BLOCKS[2].conclusion}</div>
        </div>
      </div>

      <button className="btn-continue ready" onClick={onContinue}>
        Continuar →
      </button>
    </section>
  );
}

/* ============================================================
   TRANSITION SCREEN
   ============================================================ */

function TransitionScreen({ onSelect }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 2000);
    const t3 = setTimeout(() => setStage(3), 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section className="screen transition-screen">
      {stage >= 1 && (
        <p className="transition-line fade-in">Comprender el lenguaje fue solo el comienzo.</p>
      )}
      {stage >= 2 && (
        <p className="transition-question fade-in">¿Cómo cambiará esto nuestra profesión?</p>
      )}
      {stage >= 3 && (
        <div className="transition-nodes fade-in">
          <button className="transition-node profesion" onClick={() => onSelect("profesion")}>
            PROFESIÓN
          </button>
          <button className="transition-node educacion" onClick={() => onSelect("educacion")}>
            EDUCACIÓN
          </button>
          <button className="transition-node etica" onClick={() => onSelect("etica")}>
            ÉTICA
          </button>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   PROFESION SCREEN
   ============================================================ */

function ProfesionScreen({ onContinue, onBack }) {
  const [showHuman, setShowHuman] = useState(false);

  return (
    <section className="screen profesion-screen">
      <div className="section-header">
        <span className="section-eyebrow node-tag profesion-tag">PROFESIÓN</span>
        <h2>IA y desarrollo de software</h2>
      </div>

      <div className="card-stack">
        <article className="reflection-card">
          <h3>IA y desarrollo de software</h3>
          <p>
            Hoy ya es posible construir aplicaciones completas utilizando IA generativa. He visto
            cómo páginas web, APIs y sistemas funcionales pueden desarrollarse casi por completo
            mediante herramientas inteligentes.
          </p>
          <p>
            Sin embargo, esto plantea una nueva preocupación: la seguridad. Muchas aplicaciones
            son creadas por personas sin experiencia técnica suficiente para evaluar riesgos,
            vulnerabilidades o buenas prácticas de ingeniería.
          </p>
        </article>

        <article className="reflection-card">
          <h3>Agentes de IA</h3>
          <p>Los agentes representan una evolución natural de la ingeniería de software.</p>
          <p>
            Ya son capaces de escribir código, probarlo, corregir errores y volver a intentarlo
            de manera iterativa.
          </p>
          <p>
            Este ciclo recuerda a la <em>"programación recursiva"</em> descrita por Juan Enríquez
            Cabot: sistemas que construyen y mejoran otros sistemas.
          </p>
          <p>Es razonable esperar que esta capacidad aumente significativamente durante los próximos años.</p>
        </article>

        <button className="toggle-card" onClick={() => setShowHuman((s) => !s)}>
          {showHuman ? "− Ocultar" : "+ Lo que sigue siendo humano"}
        </button>

        {showHuman && (
          <div className="human-grid fade-in">
            {["Observación física", "Contexto humano", "Responsabilidad", "Toma de decisiones críticas"].map(
              (item) => (
                <div key={item} className="human-chip">
                  {item}
                </div>
              )
            )}
            <p className="panel-text human-note">
              En robótica, un sistema puede calcular trayectorias óptimas, pero observar un
              entorno físico real, interpretar contexto humano y asumir responsabilidad ante una
              decisión crítica sigue requiriendo juicio humano.
            </p>
          </div>
        )}

        <article className="reflection-card">
          <h3>Nuevas competencias</h3>
          <ul className="check-list plain">
            {["Detectar errores invisibles", "Evaluar riesgos", "Tomar decisiones éticas", "Diseñar sistemas complejos", "Supervisar agentes IA"].map(
              (c) => (
                <li key={c}>{c}</li>
              )
            )}
          </ul>
        </article>

        <article className="final-question-card">
          <h3>¿Desapareceremos?</h3>
          <div className="big-answer">
            <span className="no">NO</span>
            <span className="evolve">EVOLUCIONAREMOS</span>
          </div>
          <p className="panel-text">
            La ingeniería no desaparece cuando cambia su herramienta principal; cambia su forma.
            Lo que antes era escribir cada línea ahora es decidir qué construir, por qué, y bajo
            qué responsabilidad.
          </p>
        </article>
      </div>

      <div className="nav-row">
        <button className="btn-secondary" onClick={onBack}>
          ← Volver
        </button>
        <button className="btn-continue ready" onClick={onContinue}>
          Continuar →
        </button>
      </div>
    </section>
  );
}

/* ============================================================
   EDUCACION SCREEN
   ============================================================ */

function EducacionScreen({ onContinue, onBack }) {
  return (
    <section className="screen educacion-screen">
      <div className="section-header">
        <span className="section-eyebrow node-tag educacion-tag">EDUCACIÓN</span>
        <h2>Mi experiencia durante el curso</h2>
      </div>

      <div className="card-stack">
        <article className="reflection-card">
          <h3>IA como segundo maestro</h3>
          <p>
            Durante el curso, la IA generativa funcionó como un segundo maestro disponible en
            cualquier momento: explicaba conceptos de Prolog, paradigmas de programación y
            estructuras de lenguajes desde ángulos distintos a los de clase, lo que ayudó a
            consolidar ideas que de otra forma habrían quedado a medias.
          </p>
        </article>

        <article className="reflection-card highlight">
          <h3>Lo que me negué a delegar</h3>
          <div className="contrast-pair">
            <div className="contrast-line dim">La IA podía resolverlo.</div>
            <div className="contrast-line strong">Yo decidí entenderlo.</div>
          </div>
          <p>
            Hubo ejercicios que la IA habría resuelto en segundos. Pero usarla solo para obtener
            la respuesta habría significado entregar el ejercicio sin entregar el aprendizaje.
            Nunca quise que la IA me reemplazara en el proceso de pensar; quería que lo
            acompañara.
          </p>
        </article>

        <article className="reflection-card">
          <h3>¿Aprendí más?</h3>
          <div className="panel-answer">Sí.</div>
          <p>
            Comparar mis propias soluciones de Prolog, autómatas y gramáticas con las
            explicaciones generadas por la IA me permitió ver los mismos paradigmas desde
            múltiples perspectivas, lo cual reforzó la comprensión en lugar de sustituirla.
          </p>
        </article>

        <article className="danger-card">
          <h3>El peligro</h3>
          <p className="danger-line">La IA puede ayudarte a aprender.</p>
          <p className="danger-line strong">También puede ayudarte a dejar de pensar.</p>
          <p>
            La diferencia depende completamente de cómo se use: como atajo para evitar el
            esfuerzo, o como herramienta para profundizar en él.
          </p>
        </article>
      </div>

      <div className="nav-row">
        <button className="btn-secondary" onClick={onBack}>
          ← Volver
        </button>
        <button className="btn-continue ready" onClick={onContinue}>
          Continuar →
        </button>
      </div>
    </section>
  );
}

/* ============================================================
   ETICA SCREEN
   ============================================================ */

function EticaScreen({ onContinue, onBack }) {
  const [side, setSide] = useState(null); // 'responsable' | 'dependencia'

  return (
    <section className="screen etica-screen">
      <div className="section-header">
        <span className="section-eyebrow node-tag etica-tag">ÉTICA</span>
        <h2>La balanza</h2>
      </div>

      <div className="balance-wrap">
        <div className={`balance ${side ? `tilt-${side}` : ""}`}>
          <div className="balance-bar" />
          <button
            className={`balance-pan left ${side === "responsable" ? "active" : ""}`}
            onClick={() => setSide("responsable")}
          >
            Uso responsable
          </button>
          <button
            className={`balance-pan right ${side === "dependencia" ? "active" : ""}`}
            onClick={() => setSide("dependencia")}
          >
            Dependencia
          </button>
          <div className="balance-pivot" />
        </div>
      </div>

      {side && (
        <div className="ethics-quote fade-in">
          <p>
            "Si la IA genera un código que funciona pero yo no puedo explicarlo, entonces todavía
            no tengo el conocimiento necesario para asumir la responsabilidad de utilizarlo."
          </p>
        </div>
      )}

      <div className="nav-row">
        <button className="btn-secondary" onClick={onBack}>
          ← Volver
        </button>
        <button className={`btn-continue ${side ? "ready" : ""}`} onClick={onContinue} disabled={!side}>
          Continuar →
        </button>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL SCREEN
   ============================================================ */

function FinalScreen({ onRestart }) {
  const fullText = "El futuro no será definido por la IA.";
  const [typed, setTyped] = useState("");
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowIncomplete(true), 500);
        setTimeout(() => setShowRest(true), 2200);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="screen final-screen">
      <Particles />
      <div className="final-content">
        <div className="prompt-shell">
          <div className="prompt-shell-label">¿Cómo será el futuro de la computación?</div>
          <div className="prompt-box">
            <span className="prompt-caret">&gt;</span>
            <span className="prompt-text">{typed}</span>
            {!showIncomplete && <span className="cursor-blink">▍</span>}
          </div>
          {showIncomplete && <div className="incomplete-tag fade-in">Respuesta incompleta.</div>}
        </div>

        {showRest && (
          <div className="final-message fade-in">
            <p className="final-line">
              Será definido por las personas que aprendan a utilizarla responsablemente.
            </p>
            <p className="final-author">— Inside the Prompt</p>
            <button className="btn-restart" onClick={onRestart}>
              ↺ Volver a empezar
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */

const STAGES = [
  "intro",
  "pipeline",
  "extra",
  "transition",
  "profesion",
  "educacion",
  "etica",
  "final",
];

export default function App() {
  const [stage, setStage] = useState("intro");
  const [order, setOrder] = useState(["profesion", "educacion", "etica"]);
  const [orderIndex, setOrderIndex] = useState(0);

  // Allow user to pick order via transition nodes
  function handleTransitionSelect(choice) {
    const remaining = order.filter((o) => o !== choice);
    setOrder([choice, ...remaining]);
    setOrderIndex(0);
    setStage(choice);
  }

  function goNextAfterCard() {
    const nextIndex = orderIndex + 1;
    if (nextIndex < order.length) {
      setOrderIndex(nextIndex);
      setStage(order[nextIndex]);
    } else {
      setStage("final");
    }
  }

  function goBackToTransition() {
    setStage("transition");
  }

  function handleRestart() {
    setOrder(["profesion", "educacion", "etica"]);
    setOrderIndex(0);
    setStage("intro");
  }

  return (
    <div className="app-root">
      {stage === "intro" && <IntroScreen key="intro" onStart={() => setStage("pipeline")} />}
      {stage === "pipeline" && <PipelineScreen onContinue={() => setStage("extra")} />}
      {stage === "extra" && <ExtraBlocksScreen onContinue={() => setStage("transition")} />}
      {stage === "transition" && <TransitionScreen onSelect={handleTransitionSelect} />}
      {stage === "profesion" && (
        <ProfesionScreen onContinue={goNextAfterCard} onBack={goBackToTransition} />
      )}
      {stage === "educacion" && (
        <EducacionScreen onContinue={goNextAfterCard} onBack={goBackToTransition} />
      )}
      {stage === "etica" && (
        <EticaScreen onContinue={goNextAfterCard} onBack={goBackToTransition} />
      )}
      {stage === "final" && <FinalScreen key="final" onRestart={handleRestart} />}
    </div>
  );
}