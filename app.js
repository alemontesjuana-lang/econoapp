// ═══════════════════════════════════════
// ECONOAPP — LÓGICA PRINCIPAL
// Conecta con Google Apps Script como backend
// ═══════════════════════════════════════

// ⚠️ REEMPLAZAR con tu URL de Apps Script desplegado
// ── BACKEND: Firebase Realtime Database ────────────
const FIREBASE_URL = 'https://econoapp2026-default-rtdb.firebaseio.com';

// ─── ESTADO ───────────────────────────────────────
let currentUser = null;
let progress = {
  readSections: {},   // { sectionId: true }
  quizScores: {},     // { quizId: { score, total, answers, date } }
  newsRead: {},       // { newsId: true }
  newsQuiz: {}        // { newsId: { score, total } }
};
let currentSection = 'home';

// ─── NIVELES GAMER ─────────────────────────────────
const LEVELS = [
  { pct: 0,   label: '🎮 Principiante',   name: 'Principiante' },
  { pct: 20,  label: '📖 Lector Activo',  name: 'Lector Activo' },
  { pct: 40,  label: '💡 Analista',       name: 'Analista' },
  { pct: 60,  label: '🚀 Economista Jr.', name: 'Economista Jr.' },
  { pct: 80,  label: '🏅 Experto',        name: 'Experto' },
  { pct: 95,  label: '🏆 Maestro Máximo', name: 'Maestro Máximo' },
];

// ─── CONTENIDO ─────────────────────────────────────
// ─── CONTENIDO COMPLETO Y EXHAUSTIVO ──────────────────────────────────────────
const CURRICULUM = [
  // ══════════════════════════════════════════════════════════════════
  // UNIDAD INTRODUCTORIA
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'ui',
    title: 'Unidad Introductoria',
    icon: '🌐',
    sections: [
      {
        id: 'ui-1',
        title: 'Definiciones y corrientes de la Economía',
        content: `
<h3>¿Qué es la Economía?</h3>
<p>La palabra <strong>Economía</strong> proviene del griego <em>oikos</em> (casa) y <em>nomos</em> (ley, norma, administración). En su origen designaba el arte de administrar el hogar. Con el tiempo, su significado se amplió hasta convertirse en una ciencia social que abarca el comportamiento de individuos, empresas, gobiernos y naciones enteras.</p>
<p>La economía no estudia el dinero en sí mismo, ni la riqueza como fin último. Estudia algo más profundo: <strong>cómo los seres humanos toman decisiones cuando los recursos disponibles son limitados y las necesidades son prácticamente ilimitadas</strong>. Esa tensión entre escasez y necesidad es el corazón de toda la ciencia económica.</p>

<div class="highlight-box">
💡 <strong>El problema económico fundamental:</strong> Los recursos son escasos (tiempo, dinero, materias primas, tierra, trabajo) pero las necesidades y deseos humanos son prácticamente ilimitados. Toda decisión económica implica elegir entre usos alternativos de esos recursos escasos, lo que siempre supone un <em>costo de oportunidad</em>: lo que se sacrifica al optar por una alternativa en lugar de otra.
</div>

<h4>Las tres preguntas básicas de toda economía</h4>
<p>Todo sistema económico, independientemente de su organización política o social, debe responder tres preguntas fundamentales:</p>
<ul>
<li><strong>¿QUÉ producir?</strong> ¿Qué bienes y servicios se deben producir, y en qué cantidades? ¿Más alimentos o más tecnología? ¿Bienes de consumo o de inversión? Esta decisión implica determinar la composición del producto social.</li>
<li><strong>¿CÓMO producirlo?</strong> ¿Con qué técnicas, con qué combinación de factores productivos? ¿Mucho trabajo y poco capital (producción intensiva en mano de obra) o al revés? La eficiencia técnica y económica está en juego.</li>
<li><strong>¿PARA QUIÉN producirlo?</strong> ¿Cómo se distribuye lo producido entre los miembros de la sociedad? ¿Según el trabajo aportado, el capital poseído, las necesidades de cada uno? La distribución del ingreso y la equidad social dependen de esta respuesta.</li>
</ul>

<h3>Principales corrientes y definiciones</h3>
<p>A lo largo de la historia, economistas de distintas épocas y escuelas han definido a la economía desde perspectivas diferentes. Conocer estas definiciones permite comprender cómo fue evolucionando la disciplina:</p>

<div class="concept-box">
<strong>Adam Smith (1776) — "La riqueza de las naciones":</strong><br>
Para Smith, la economía estudia la naturaleza y causas de la riqueza de las naciones. El <em>trabajo</em> es la fuente principal del valor. Introdujo el concepto de <strong>"mano invisible"</strong>: los individuos, al perseguir su propio interés, promueven el bienestar general sin proponérselo. Defendió el libre mercado y la división del trabajo como motores del crecimiento económico.
</div>

<div class="concept-box">
<strong>David Ricardo (1817) — Teoría del valor trabajo y distribución:</strong><br>
Ricardo profundizó el análisis de Smith. Estudió cómo se distribuye la renta (lo producido) entre los tres factores productivos: trabajadores (salarios), capitalistas (ganancias) y terratenientes (renta). Su análisis de las <em>ventajas comparativas</em> en el comercio internacional sigue siendo vigente hoy.
</div>

<div class="concept-box">
<strong>Alfred Marshall (1890) — Principios de Economía:</strong><br>
Marshall definió la economía como "el estudio de la humanidad en los negocios ordinarios de la vida". Es el padre de la <em>microeconomía moderna</em>: introdujo las curvas de oferta y demanda, el equilibrio de mercado, la elasticidad y los conceptos de corto y largo plazo. Su enfoque matemático y gráfico sentó las bases del análisis económico actual.
</div>

<div class="concept-box">
<strong>Lionel Robbins (1932) — Ensayo sobre la naturaleza y significación de la ciencia económica:</strong><br>
Robbins dio la definición más influyente del siglo XX: <em>"La economía es la ciencia que estudia el comportamiento humano como una relación entre fines dados y medios escasos que tienen usos alternativos."</em> Esta definición destaca tres elementos clave: (1) los fines son múltiples, (2) los medios son escasos, y (3) esos medios tienen usos alternativos. Elegir implica siempre sacrificar algo.
</div>

<div class="concept-box">
<strong>Paul Samuelson (1948) — Economía:</strong><br>
Samuelson, premio Nobel 1970, popularizó la economía moderna con su célebre manual. La definió como "el estudio de cómo los hombres y la sociedad deciden, con o sin dinero, emplear recursos productivos escasos para producir diversas mercancías a lo largo del tiempo y distribuirlas para su consumo presente o futuro entre las distintas personas y grupos que componen la sociedad."
</div>

<h4>El costo de oportunidad</h4>
<p>Uno de los conceptos más importantes de la economía es el <strong>costo de oportunidad</strong>: el valor de la mejor alternativa a la que se renuncia cuando se toma una decisión.</p>
<ul>
<li><em>Ejemplo personal:</em> Si decidís estudiar en vez de trabajar los fines de semana, el costo de oportunidad de estudiar es el salario que dejás de ganar.</li>
<li><em>Ejemplo empresarial:</em> Si una empresa usa su capital para producir autos en vez de motos, el costo de oportunidad es la ganancia que hubiera obtenido produciendo motos.</li>
<li><em>Ejemplo estatal:</em> Si el gobierno invierte en educación en vez de en hospitales, el costo de oportunidad son los servicios de salud no prestados.</li>
</ul>
<p>El costo de oportunidad explica por qué <strong>ningún recurso escaso es gratuito desde el punto de vista económico</strong>, aunque no tenga precio de mercado.</p>

<h4>Bienes económicos vs. bienes libres</h4>
<ul>
<li><strong>Bienes económicos:</strong> son escasos en relación a la demanda que existe de ellos. Tienen precio porque requieren sacrificio para obtenerlos. Ej: alimentos, vivienda, automóviles.</li>
<li><strong>Bienes libres:</strong> son abundantes en relación a la demanda. No tienen precio de mercado porque no requieren sacrificio para obtenerlos en condiciones normales. Ej: el aire puro (aunque la contaminación los está convirtiendo en escasos en muchos lugares).</li>
</ul>
`
      },
      {
        id: 'ui-2',
        title: 'Metodología económica',
        content: `
<h3>El método científico en Economía</h3>
<p>La economía es una <strong>ciencia social</strong>. Como toda ciencia, construye su conocimiento a través del método científico: observación de la realidad, formulación de hipótesis, elaboración de teorías, y contrastación empírica. Sin embargo, a diferencia de las ciencias naturales, la economía no puede realizar experimentos de laboratorio con facilidad: trabaja con seres humanos que toman decisiones en contextos sociales complejos.</p>

<h4>Análisis positivo y análisis normativo</h4>
<p>Una de las distinciones más importantes en metodología económica es la que separa los juicios de hecho de los juicios de valor:</p>

<div class="highlight-box">
🔵 <strong>Economía Positiva:</strong> Describe la realidad tal como <em>es</em>. Formula afirmaciones que pueden ser verificadas o refutadas con datos empíricos. No emite juicios de valor sobre si algo es bueno o malo.<br><br>
Ejemplos: "La tasa de desempleo en Argentina fue del 7,6% en el cuarto trimestre de 2024." / "Cuando sube el precio de la nafta, la cantidad demandada de autos disminuye." / "El PBI argentino creció un 4,4% en 2025."
</div>

<div class="highlight-box">
🟡 <strong>Economía Normativa:</strong> Establece juicios de valor sobre cómo <em>debería ser</em> la realidad económica. Incorpora criterios éticos, políticos y filosóficos. No puede ser verificada ni refutada con datos empíricos solamente.<br><br>
Ejemplos: "El gobierno debería aumentar el salario mínimo para reducir la pobreza." / "La distribución del ingreso es injusta y debe corregirse con impuestos progresivos." / "Argentina debería proteger su industria nacional con aranceles a la importación."
</div>

<p>Esta distinción es crucial: muchos debates económicos que parecen técnicos son en realidad debates normativos disfrazados de positivos. Identificar cuándo un economista describe y cuándo prescribe es fundamental para el pensamiento crítico.</p>

<h4>Los modelos económicos</h4>
<p>Un <strong>modelo económico</strong> es una simplificación abstracta de la realidad diseñada para analizar relaciones entre variables económicas. Ningún modelo puede capturar toda la complejidad del mundo real — ni falta que hace. Un buen modelo es aquel que, con los supuestos adecuados, explica y predice los fenómenos que le interesan.</p>

<div class="concept-box">
<strong>El supuesto "ceteris paribus" (todo lo demás constante):</strong><br>
Para analizar la relación entre dos variables, los economistas mantienen todas las demás variables constantes. Esto permite aislar el efecto de una variable sobre otra.<br><br>
Ejemplo: "Si sube el precio del pan, la cantidad demandada disminuye, <em>ceteris paribus</em>" (manteniendo constantes el ingreso, los precios de otros bienes, los gustos, etc.).
</div>

<h4>Variables económicas clave</h4>
<ul>
<li><strong>Variables endógenas:</strong> son explicadas dentro del modelo (ej: el precio y la cantidad de equilibrio en un mercado).</li>
<li><strong>Variables exógenas:</strong> se determinan fuera del modelo y lo afectan desde afuera (ej: el ingreso de los consumidores en un modelo de demanda).</li>
<li><strong>Variables de flujo:</strong> se miden en un período de tiempo (ej: el ingreso mensual, la producción anual).</li>
<li><strong>Variables de stock:</strong> se miden en un momento determinado (ej: la riqueza acumulada, el stock de capital).</li>
</ul>

<h4>Micro y Macro: dos niveles de análisis</h4>
<p>La economía se divide en dos grandes ramas complementarias:</p>

<div class="concept-box">
<strong>Microeconomía:</strong> estudia las decisiones de los agentes económicos individuales — consumidores, empresas, trabajadores — y cómo interactúan en mercados específicos para determinar precios y cantidades. Es el análisis del árbol.<br><br>
Temas: teoría del consumidor, teoría de la empresa, teoría de los precios, estructuras de mercado, demanda y oferta.
</div>

<div class="concept-box">
<strong>Macroeconomía:</strong> estudia la economía como un todo — el nivel general de precios (inflación), el empleo total, el crecimiento económico, las políticas fiscal y monetaria. Es el análisis del bosque.<br><br>
Temas: PBI, inflación, desempleo, balanza de pagos, política económica, ciclos económicos.
</div>

<p>Aunque son ramas distintas, están profundamente vinculadas. La macroeconomía emerge del comportamiento agregado de millones de decisiones microeconómicas. Si todos los consumidores de un país reducen su consumo al mismo tiempo, eso genera una recesión macroeconómica. Y a la inversa: una crisis macroeconómica (como una hiperinflación) afecta las decisiones microeconómicas de cada hogar y empresa.</p>
`
      },
      {
        id: 'ui-3',
        title: 'El sistema económico',
        content: `
<h3>¿Qué es un sistema económico?</h3>
<p>Un <strong>sistema económico</strong> es el conjunto de instituciones, normas, relaciones sociales y mecanismos que una sociedad establece para organizar la actividad económica: qué se produce, cómo se produce, cómo se distribuye y cómo se consume. Todo sistema económico da respuesta —explícita o implícita— a las tres preguntas fundamentales vistas anteriormente.</p>

<h4>Elementos constitutivos de un sistema económico</h4>
<ul>
<li><strong>Los agentes económicos:</strong> son los actores que toman decisiones económicas. Los tres principales son:
  <ul>
  <li><em>Las familias (hogares):</em> son propietarias de los factores productivos (trabajo, capital, tierra). Ofrecen esos factores a las empresas y con los ingresos obtenidos (salarios, rentas, intereses) demandan bienes y servicios. Son la unidad básica de consumo.</li>
  <li><em>Las empresas:</em> son las unidades de producción. Combinan factores productivos para elaborar bienes y servicios que luego venden en el mercado, buscando obtener ganancias.</li>
  <li><em>El Estado:</em> regula la actividad económica, provee bienes públicos (defensa, justicia, educación, salud), redistribuye el ingreso mediante impuestos y transferencias, y aplica políticas económicas para estabilizar la economía.</li>
  </ul>
</li>
<li><strong>Los mercados:</strong> son los espacios (físicos o virtuales) donde se encuentran compradores y vendedores para intercambiar bienes, servicios o factores productivos. El precio es la señal que coordina este intercambio.</li>
<li><strong>Las instituciones:</strong> reglas formales (leyes, contratos, derechos de propiedad) e informales (costumbres, tradiciones) que estructuran la actividad económica y reducen la incertidumbre.</li>
</ul>

<h4>El flujo circular de la economía</h4>
<p>El <strong>flujo circular</strong> es un modelo que muestra cómo circulan los bienes, servicios, factores productivos y el dinero entre los agentes económicos. En su versión más simple (dos sectores: familias y empresas):</p>

<div class="highlight-box">
🔄 <strong>Flujo real (de arriba hacia abajo):</strong><br>
Las <em>familias</em> ofrecen factores productivos (trabajo, capital, tierra) en el <em>mercado de factores</em> → las <em>empresas</em> los utilizan para producir bienes y servicios → los ofrecen en el <em>mercado de bienes</em> → las <em>familias</em> los demandan y consumen.<br><br>
🔄 <strong>Flujo monetario (en sentido opuesto):</strong><br>
Las <em>empresas</em> pagan salarios, intereses y rentas a las <em>familias</em> → las <em>familias</em> usan esos ingresos para comprar bienes y servicios → ese dinero vuelve a las empresas como ingresos → el ciclo se repite.
</div>

<p>En la realidad, el flujo circular es mucho más complejo: incluye al Estado (que recauda impuestos y gasta), al sector externo (exportaciones e importaciones) y al sector financiero (ahorro e inversión).</p>

<h4>Tipos de sistemas económicos</h4>
<p>Los sistemas económicos se clasifican según quién toma las decisiones económicas fundamentales y a través de qué mecanismos:</p>

<div class="concept-box">
<strong>1. Economía de mercado (capitalismo):</strong><br>
Las decisiones económicas se toman de forma descentralizada por millones de consumidores y empresas, coordinadas a través del mecanismo de <em>precios</em>. La propiedad privada de los medios de producción es el fundamento institucional. El mercado asigna los recursos.<br><br>
<strong>Ventajas:</strong> eficiencia en la asignación de recursos, incentivos a la innovación, libertad individual.<br>
<strong>Limitaciones:</strong> puede generar desigualdad, fallas de mercado (bienes públicos, externalidades, monopolios), ciclos de auge y recesión.
</div>

<div class="concept-box">
<strong>2. Economía planificada (socialismo o economía de comando):</strong><br>
El Estado decide centralmente qué producir, cómo producirlo y cómo distribuirlo. Los medios de producción son de propiedad estatal o social. El plan económico reemplaza al mercado como mecanismo coordinador.<br><br>
<strong>Ventajas:</strong> puede orientar recursos hacia objetivos sociales (salud, educación), reduce la desigualdad formal.<br>
<strong>Limitaciones:</strong> problemas de información (el Estado no puede conocer todas las preferencias individuales), falta de incentivos a la eficiencia y la innovación, tendencia al desabastecimiento.
</div>

<div class="concept-box">
<strong>3. Economía mixta:</strong><br>
Combina el mecanismo de mercado con la intervención estatal. Es el modelo predominante en el mundo actual. El mercado asigna la mayoría de los recursos, pero el Estado interviene para corregir fallas de mercado, redistribuir el ingreso, proveer bienes públicos y estabilizar la economía.<br><br>
<strong>Ejemplos:</strong> todos los países desarrollados tienen economías mixtas, con diferentes grados de intervención estatal (desde los países escandinavos con fuerte Estado de bienestar, hasta economías más liberales como Estados Unidos).
</div>

<h4>Argentina como economía mixta</h4>
<p>Argentina es un ejemplo paradigmático de economía mixta, con una historia de oscilaciones entre mayor y menor intervención estatal. El debate entre qué debe decidir el mercado y qué debe regular el Estado es uno de los ejes centrales de la política económica argentina desde el siglo XX hasta hoy. Esta tensión explica muchas de las políticas que vemos en las noticias económicas actuales.</p>
`
      }
    ],
    quizzes: [
      {
        id: 'quiz-ui',
        title: 'Ejercitación — Unidad Introductoria',
        questions: [
          {
            text: 'El "costo de oportunidad" de estudiar para un examen el sábado es:',
            options: [
              'El precio de los libros y materiales de estudio',
              'El valor de la mejor alternativa a la que se renuncia (ej: trabajar, salir con amigos)',
              'El tiempo total que se dedica al estudio',
              'El costo del transporte hasta la biblioteca'
            ],
            correct: 1,
            feedback: '¡Correcto! El costo de oportunidad es el valor de la mejor alternativa sacrificada. Al elegir estudiar, renunciás a lo mejor que podrías haber hecho en ese tiempo. Toda decisión tiene un costo de oportunidad.'
          },
          {
            text: 'La afirmación "la tasa de desempleo en Argentina subió al 7,6% en el último trimestre" es un ejemplo de:',
            options: [
              'Economía normativa, porque implica un juicio de valor',
              'Economía positiva, porque describe un hecho verificable empíricamente',
              'Un modelo económico simplificado',
              'Una afirmación sobre política económica'
            ],
            correct: 1,
            feedback: '¡Exacto! La economía positiva describe la realidad tal como es, con afirmaciones verificables. "La tasa fue del 7,6%" es un dato empírico medible, no una opinión sobre si ese número es bueno o malo.'
          },
          {
            text: '"El gobierno debería bajar los impuestos para estimular la inversión privada" es un ejemplo de:',
            options: [
              'Economía positiva porque habla de inversión',
              'Un modelo econométrico',
              'Economía normativa porque emite un juicio de valor sobre lo que debería hacerse',
              'Una afirmación ceteris paribus'
            ],
            correct: 2,
            feedback: '¡Muy bien! La palabra "debería" delata que es economía normativa. Incorpora un juicio de valor: que bajar impuestos sería deseable. Ese juicio no puede probarse solo con datos — depende de criterios políticos y éticos.'
          },
          {
            text: 'En el flujo circular de la economía (modelo de dos sectores), ¿qué pagan las empresas a las familias a cambio de los factores productivos?',
            options: [
              'Bienes y servicios de consumo',
              'Impuestos y tasas',
              'Salarios, rentas e intereses',
              'Exportaciones e importaciones'
            ],
            correct: 2,
            feedback: '¡Correcto! Las empresas pagan a las familias por sus factores productivos: salarios (por el trabajo), rentas (por la tierra) e intereses/dividendos (por el capital). Esos ingresos son los que las familias usan para consumir.'
          },
          {
            text: 'La principal diferencia entre microeconomía y macroeconomía es que:',
            options: [
              'La microeconomía estudia países ricos y la macro estudia países pobres',
              'La microeconomía analiza decisiones individuales y mercados específicos; la macroeconomía estudia la economía como un todo',
              'La microeconomía usa matemáticas y la macro no',
              'La microeconomía es positiva y la macroeconomía es normativa'
            ],
            correct: 1,
            feedback: '¡Perfecto! La micro estudia el árbol (el consumidor, la empresa, el mercado del trigo), la macro estudia el bosque (el PBI total, la inflación general, el empleo total). Ambas son complementarias y necesitan matemáticas.'
          },
          {
            text: 'El supuesto "ceteris paribus" en economía significa:',
            options: [
              'Todo cambia al mismo tiempo',
              'Mantener todas las demás variables constantes para analizar el efecto de una sola variable',
              'Los mercados siempre alcanzan el equilibrio',
              'Los precios no varían en el corto plazo'
            ],
            correct: 1,
            feedback: '¡Correcto! Ceteris paribus (del latín: "todo lo demás constante") permite aislar la relación entre dos variables. Por ejemplo, para estudiar cómo el precio afecta la demanda, asumimos que el ingreso, los precios de otros bienes y los gustos no cambian.'
          }
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // UNIDAD 1 — MICROECONOMÍA
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'u1',
    title: 'Unidad 1 — La Microeconomía',
    icon: '🏭',
    sections: [
      {
        id: 'u1-1',
        title: 'Nociones sobre Economía y Empresas',
        content: `
<h3>La empresa como agente económico central</h3>
<p>La <strong>empresa</strong> es la unidad básica de producción en una economía de mercado. Su función esencial es transformar factores productivos (insumos) en bienes y servicios (productos) que satisfacen necesidades y se ofrecen en el mercado. La empresa no es solo un agente económico: es también una organización social con estructura, jerarquía, cultura y relaciones laborales.</p>

<p>Desde el punto de vista económico, la empresa persigue (en primera instancia) la <strong>maximización del beneficio</strong>, aunque en la realidad también puede perseguir otros objetivos: crecimiento, participación de mercado, responsabilidad social, etc.</p>

<h4>Los factores de producción</h4>
<p>Para producir, toda empresa necesita combinar los <strong>factores productivos</strong>, que son los recursos que entran en el proceso de producción:</p>

<div class="concept-box">
<strong>1. TIERRA (recursos naturales):</strong><br>
Comprende todos los recursos que provee la naturaleza: suelo agrícola, minerales, petróleo, gas, agua, bosques, pesca. La remuneración que reciben los propietarios de estos recursos se llama <em>renta</em>. En sentido económico amplio, "tierra" incluye todos los recursos naturales, no solo el suelo.
</div>

<div class="concept-box">
<strong>2. TRABAJO:</strong><br>
El esfuerzo físico e intelectual que los seres humanos aplican al proceso productivo. La remuneración del trabajo es el <em>salario</em>. El trabajo no es homogéneo: se diferencia por calificación, experiencia, especialización. El capital humano (educación, formación) aumenta la productividad del trabajo.
</div>

<div class="concept-box">
<strong>3. CAPITAL:</strong><br>
Bienes producidos que se utilizan para producir otros bienes. Se divide en:<br>
• <em>Capital físico:</em> máquinas, equipos, edificios, herramientas, infraestructura.<br>
• <em>Capital financiero:</em> el dinero y los activos financieros que permiten financiar la producción.<br>
La remuneración del capital es el <em>interés</em> o <em>dividendo</em>. El capital se deprecia con el uso y el tiempo, por lo que requiere inversión continua.
</div>

<div class="concept-box">
<strong>4. CAPACIDAD EMPRESARIAL (Entrepreneurship / Tecnología):</strong><br>
La habilidad de combinar los otros factores de manera eficiente, asumir riesgos, innovar y organizar la producción. El empresario es quien toma las decisiones estratégicas. Su remuneración es el <em>beneficio o ganancia</em>. La tecnología determina la función de producción: cómo los factores se combinan para obtener producto.
</div>

<h4>Clasificación de las empresas</h4>
<p>Las empresas pueden clasificarse según múltiples criterios:</p>

<p><strong>Según su actividad económica:</strong></p>
<ul>
<li><strong>Sector primario:</strong> Extraen recursos de la naturaleza sin transformarlos (agropecuario, minería, pesca, silvicultura). Argentina tiene enorme peso en este sector: soja, maíz, trigo, petróleo, litio.</li>
<li><strong>Sector secundario:</strong> Transforman materias primas en productos elaborados (industria manufacturera, construcción, electricidad). Ej: fabricar autos, textiles, alimentos procesados.</li>
<li><strong>Sector terciario:</strong> Prestan servicios (comercio, transporte, educación, salud, finanzas, turismo, comunicaciones). Es el sector de mayor crecimiento en las economías modernas.</li>
</ul>

<p><strong>Según su tamaño:</strong></p>
<ul>
<li><strong>Microempresas:</strong> hasta 10 empleados. Predominan en Argentina (almacenes, talleres, profesionales independientes).</li>
<li><strong>Pequeñas empresas (PyME pequeña):</strong> entre 11 y 50 empleados.</li>
<li><strong>Medianas empresas (PyME mediana):</strong> entre 51 y 200 empleados.</li>
<li><strong>Grandes empresas:</strong> más de 200 empleados. Pueden ser nacionales o multinacionales.</li>
</ul>

<p><strong>Según su propiedad:</strong></p>
<ul>
<li><strong>Privadas:</strong> propiedad de particulares. Buscan ganancias.</li>
<li><strong>Públicas:</strong> propiedad del Estado. Pueden tener objetivos sociales además de rentabilidad (ej: YPF, Aerolíneas Argentinas).</li>
<li><strong>Mixtas:</strong> capital compartido entre el Estado y privados.</li>
</ul>

<h4>El mercado como espacio de interacción</h4>
<p>Las empresas no operan en el vacío: interactúan en <strong>mercados</strong>. Un mercado no es necesariamente un lugar físico — es cualquier mecanismo que permite a compradores y vendedores intercambiar bienes, servicios o factores productivos. El precio es la señal central que coordina estas interacciones.</p>

<div class="highlight-box">
💡 <strong>La administración de los bienes escasos:</strong> Las empresas, al igual que los hogares y el Estado, enfrentan el problema de la escasez. Tienen recursos limitados (capital, tiempo, personal calificado) y deben decidir cómo asignarlos entre usos alternativos para maximizar su eficiencia. La microeconomía estudia exactamente estas decisiones de asignación.
</div>
`
      },
      {
        id: 'u1-2',
        title: 'El consumidor: utilidad y curvas de indiferencia',
        content: `
<h3>La teoría del consumidor</h3>
<p>La <strong>teoría del consumidor</strong> es una de las piedras angulares de la microeconomía. Estudia cómo los individuos toman decisiones de consumo cuando tienen un ingreso limitado y se enfrentan a precios dados por el mercado. El supuesto fundamental es que el consumidor actúa de manera <em>racional</em>: busca maximizar su satisfacción o bienestar (utilidad) con los recursos disponibles.</p>

<h4>El concepto de Utilidad</h4>
<p>En economía, la <strong>utilidad</strong> es la satisfacción o bienestar subjetivo que un consumidor obtiene al consumir un bien o servicio. No mide placer físico sino preferencia: un bien tiene más utilidad para alguien si esa persona lo prefiere sobre otras opciones.</p>

<ul>
<li><strong>Utilidad total (UT):</strong> es la satisfacción total que obtiene el consumidor al consumir una cantidad dada de un bien. Generalmente aumenta al consumir más unidades, pero a un ritmo decreciente.</li>
<li><strong>Utilidad marginal (UMg):</strong> es el incremento en la utilidad total que se obtiene al consumir una unidad adicional del bien. Es la "utilidad de la última unidad consumida".</li>
</ul>

<div class="highlight-box">
📉 <strong>Ley de la Utilidad Marginal Decreciente (Gossen, 1854):</strong><br><br>
A medida que aumenta el consumo de un bien (manteniendo constante el consumo de otros bienes), la utilidad marginal de ese bien tiende a disminuir.<br><br>
<strong>Ejemplo numérico:</strong><br>
🍕 1° pizza: UMg = 50 (tenés mucha hambre, la satisfacción es enorme)<br>
🍕 2° pizza: UMg = 30 (todavía tenés hambre, pero ya no tanta)<br>
🍕 3° pizza: UMg = 10 (estás bastante lleno, poca satisfacción adicional)<br>
🍕 4° pizza: UMg = 0 (ya estás satisfecho, no agrega nada)<br>
🍕 5° pizza: UMg = -5 (te sentís mal, la utilidad marginal es negativa)<br><br>
La utilidad total sigue aumentando mientras la UMg sea positiva, pero a ritmo decreciente. Cuando la UMg = 0, la UT es máxima.
</div>

<h4>Las curvas de indiferencia</h4>
<p>La teoría moderna del consumidor va más allá de la utilidad medible (cardinal) y trabaja con <em>preferencias ordinales</em>: el consumidor puede ordenar sus preferencias (prefiere A sobre B, B sobre C) sin necesidad de cuantificarlas exactamente. El instrumento central de este análisis son las <strong>curvas de indiferencia</strong>.</p>

<p>Una <strong>curva de indiferencia</strong> es el lugar geométrico de todas las combinaciones de dos bienes (X e Y) que le proporcionan al consumidor el mismo nivel de satisfacción o utilidad. Sobre una misma curva de indiferencia, el consumidor es <em>indiferente</em> entre cualquiera de los puntos, porque todos le reportan la misma utilidad.</p>

<p><strong>Propiedades de las curvas de indiferencia:</strong></p>
<ul>
<li><strong>Pendiente negativa:</strong> Si el consumidor quiere mantener el mismo nivel de utilidad y consume más de X, debe consumir menos de Y (y viceversa). Hay un trade-off entre los bienes.</li>
<li><strong>Convexas hacia el origen:</strong> Reflejan la utilidad marginal decreciente. Cuando un bien es muy escaso en la cesta del consumidor, su utilidad marginal relativa es alta y el consumidor está dispuesto a ceder mucho del otro bien para obtener una unidad más. A medida que tiene más de ese bien, su disponibilidad a ceder el otro disminuye.</li>
<li><strong>No se cortan entre sí:</strong> Si dos curvas se cruzaran, se violaría el principio de transitividad de las preferencias (si A es igual a B, y B es igual a C, entonces A es igual a C).</li>
<li><strong>Curvas más alejadas del origen = mayor utilidad:</strong> Un mapa de indiferencia es un conjunto de curvas de indiferencia paralelas. Las más alejadas del origen representan niveles de utilidad más altos.</li>
</ul>

<h4>La Tasa Marginal de Sustitución (TMS)</h4>
<p>La <strong>Tasa Marginal de Sustitución (TMS)</strong> es la cantidad del bien Y a la que el consumidor está dispuesto a renunciar para obtener una unidad adicional del bien X, manteniendo constante su nivel de utilidad. Es la pendiente (en valor absoluto) de la curva de indiferencia en cada punto.</p>

<div class="concept-box">
<strong>TMS = ΔY / ΔX</strong> (en valor absoluto)<br><br>
La TMS <em>decrece</em> a lo largo de la curva de indiferencia (de izquierda a derecha): cuando el consumidor tiene mucho de X y poco de Y, está dispuesto a ceder mucha X por una Y (TMS alta). Cuando tiene mucho de Y y poca X, la TMS es baja. Esto explica la forma convexa de la curva.
</div>

<h4>La restricción presupuestaria</h4>
<p>El consumidor no puede elegir libremente cualquier combinación de bienes: está limitado por su <strong>ingreso</strong> y por los <strong>precios</strong> de los bienes. La <strong>restricción presupuestaria</strong> (o línea de presupuesto) representa todas las combinaciones de dos bienes X e Y que el consumidor puede adquirir gastando exactamente su ingreso disponible.</p>

<div class="highlight-box">
📊 <strong>Ecuación de la restricción presupuestaria:</strong><br><br>
<strong>I = Px · X + Py · Y</strong><br><br>
Donde I = ingreso disponible, Px = precio del bien X, Py = precio del bien Y.<br><br>
<strong>Pendiente de la restricción = -Px/Py</strong><br><br>
La pendiente indica la tasa a la que el <em>mercado</em> permite sustituir Y por X: cuántas unidades de Y hay que sacrificar para obtener una más de X a los precios vigentes.
</div>

<p><strong>Desplazamientos de la restricción presupuestaria:</strong></p>
<ul>
<li>Si el ingreso <strong>aumenta</strong> → la restricción se desplaza paralelamente hacia la <em>derecha</em> (puede comprar más de ambos bienes).</li>
<li>Si el ingreso <strong>disminuye</strong> → se desplaza paralelamente hacia la <em>izquierda</em>.</li>
<li>Si sube el precio de X → la restricción rota pivotando sobre el eje Y (el consumidor puede comprar menos X con el mismo ingreso).</li>
<li>Si sube el precio de Y → la restricción rota pivotando sobre el eje X.</li>
</ul>
`
      },
      {
        id: 'u1-3',
        title: 'El equilibrio del consumidor',
        content: `
<h3>El punto de equilibrio del consumidor</h3>
<p>El consumidor maximiza su utilidad cuando alcanza la curva de indiferencia más alta posible dada su restricción presupuestaria. Geométricamente, esto ocurre en el <strong>punto de tangencia</strong> entre la restricción presupuestaria y la curva de indiferencia más elevada que puede alcanzar.</p>

<div class="highlight-box">
⚖️ <strong>Condición de equilibrio del consumidor:</strong><br><br>
<strong>TMS = Px / Py</strong><br><br>
En el equilibrio, la Tasa Marginal de Sustitución (pendiente de la curva de indiferencia) debe ser igual a la relación de precios (pendiente de la restricción presupuestaria).<br><br>
Interpretación: el consumidor está en equilibrio cuando su <em>disposición subjetiva a sustituir un bien por otro</em> (TMS) coincide con la <em>tasa a la que el mercado le permite hacerlo</em> (Px/Py).
</div>

<h4>¿Por qué en el punto de tangencia y no en cualquier otro?</h4>
<p>Si la TMS > Px/Py: el consumidor valora X más que el mercado. Conviene comprar más X y menos Y → se mueve a lo largo de la restricción hasta que TMS = Px/Py.</p>
<p>Si la TMS < Px/Py: el consumidor valora X menos que el mercado. Conviene comprar menos X y más Y → ídem hasta equilibrio.</p>
<p>Solo cuando TMS = Px/Py no hay incentivo a cambiar la combinación elegida: el consumidor está maximizando su utilidad.</p>

<h4>Otra forma de expresar el equilibrio</h4>
<p>El equilibrio también puede expresarse en términos de utilidades marginales:</p>
<div class="concept-box">
<strong>UMgX / Px = UMgY / Py</strong><br><br>
El consumidor maximiza su utilidad cuando la utilidad marginal obtenida por el último peso gastado en X es igual a la utilidad marginal obtenida por el último peso gastado en Y.<br><br>
Si UMgX/Px > UMgY/Py → conviene gastar más en X (da más utilidad por peso).<br>
Si UMgX/Px < UMgY/Py → conviene gastar más en Y.<br>
Si son iguales → equilibrio: no hay reasignación beneficiosa del gasto.
</div>

<h4>Efectos sobre el equilibrio: variaciones en el ingreso y los precios</h4>
<p><strong>Efecto de un aumento del ingreso:</strong> La restricción presupuestaria se desplaza hacia la derecha de forma paralela. El consumidor puede alcanzar una curva de indiferencia más alta. Generalmente consume más de ambos bienes (si son bienes normales). La curva que une los puntos de equilibrio a medida que varía el ingreso se llama <em>curva de Engel</em> o <em>senda de expansión del ingreso</em>.</p>

<p><strong>Efecto de una variación en el precio de X (curva precio-consumo):</strong> Al variar el precio de X, la restricción presupuestaria rota. El nuevo punto de tangencia determina la nueva cantidad demandada de X. Si se trazan los puntos de equilibrio para distintos precios de X, se obtiene la <strong>curva de demanda de X</strong>. Así es como la teoría del consumidor deriva la curva de demanda.</p>

<h4>Efectos ingreso y sustitución</h4>
<p>Cuando baja el precio de X, se producen dos efectos simultáneos:</p>
<ul>
<li><strong>Efecto sustitución:</strong> X se vuelve relativamente más barata que Y → el consumidor sustituye Y por X (efecto siempre en sentido contrario al precio: si baja el precio, aumenta el consumo).</li>
<li><strong>Efecto ingreso:</strong> la baja de precio de X equivale a un aumento del ingreso real del consumidor (puede comprar lo mismo que antes y le sobra dinero). Si X es un bien normal, esto también aumenta su consumo.</li>
</ul>
<p>Para bienes normales, ambos efectos van en la misma dirección: la demanda sube cuando baja el precio. Para bienes inferiores, el efecto ingreso actúa en sentido contrario al efecto sustitución.</p>
`
      },
      {
        id: 'u1-4',
        title: 'Teoría de la demanda y elasticidades',
        content: `
<h3>La demanda y la curva de demanda</h3>
<p>La <strong>demanda de un bien</strong> es la cantidad que los consumidores están dispuestos y en condiciones de comprar de ese bien a cada precio posible, durante un período determinado y manteniendo constantes los demás factores.</p>

<p>La <strong>tabla de demanda</strong> muestra, para cada precio posible, la cantidad demandada. Al representarla gráficamente, obtenemos la <strong>curva de demanda</strong>, que tiene pendiente negativa: ilustra la relación inversa entre precio y cantidad.</p>

<div class="concept-box">
<strong>Ley de la Demanda:</strong> Manteniendo constantes todos los demás factores (ceteris paribus), cuando el precio de un bien sube, la cantidad demandada disminuye; cuando el precio baja, la cantidad demandada aumenta.<br><br>
Esta ley tiene tres fundamentos:<br>
1. <em>Efecto sustitución:</em> al subir el precio de X, Y se vuelve relativamente más barata → se sustituye X por Y.<br>
2. <em>Efecto ingreso:</em> al subir el precio de X, el ingreso real cae → se puede comprar menos de todo.<br>
3. <em>Utilidad marginal decreciente:</em> para que el consumidor quiera comprar más unidades, el precio debe bajar (porque la utilidad marginal de cada unidad adicional es menor).
</div>

<h4>Movimientos sobre la curva vs. desplazamientos de la curva</h4>
<p>Es fundamental distinguir entre:</p>
<ul>
<li><strong>Cambio en la cantidad demandada:</strong> ocurre cuando varía el precio del bien. Se mueve un punto sobre la misma curva de demanda.</li>
<li><strong>Cambio en la demanda (desplazamiento de la curva):</strong> ocurre cuando varía cualquier otro factor distinto al precio del bien. Toda la curva se desplaza.</li>
</ul>

<p><strong>Factores que desplazan la curva de demanda (determinantes de la demanda):</strong></p>
<ul>
<li><strong>Ingreso de los consumidores:</strong> si sube el ingreso → aumenta la demanda de bienes normales (desplazamiento a la derecha) → disminuye la demanda de bienes inferiores (desplazamiento a la izquierda).</li>
<li><strong>Precios de bienes relacionados:</strong>
  <ul>
  <li><em>Bienes sustitutos:</em> si sube el precio del bien A, aumenta la demanda del bien B (que lo sustituye). Ej: si sube el precio de la Coca-Cola, sube la demanda de Pepsi.</li>
  <li><em>Bienes complementarios:</em> si sube el precio del bien A, disminuye la demanda del bien B (que lo acompaña). Ej: si sube el precio de las impresoras, baja la demanda de cartuchos de tinta.</li>
  </ul>
</li>
<li><strong>Gustos y preferencias:</strong> cambios en las modas, tendencias culturales o hábitos de consumo desplazan la demanda.</li>
<li><strong>Expectativas de los consumidores:</strong> si se espera que el precio suba, la demanda sube hoy (se anticipa la compra). Si se espera una recesión, la demanda cae.</li>
<li><strong>Número de compradores:</strong> a mayor población o mayor número de consumidores en el mercado, mayor la demanda de mercado.</li>
</ul>

<h3>Elasticidad de la demanda</h3>
<p>La <strong>elasticidad</strong> mide la sensibilidad de la cantidad demandada ante variaciones en sus determinantes. Es un número puro (sin unidades) que permite comparar la respuesta de la demanda en distintos mercados.</p>

<h4>Elasticidad-precio de la demanda (Ed)</h4>

<div class="highlight-box">
📊 <strong>Fórmula:</strong><br><br>
<strong>Ed = (% cambio en cantidad demandada) / (% cambio en precio)</strong><br><br>
Ed = (ΔQ/Q) / (ΔP/P)<br><br>
Como la relación es inversa (si P sube, Q baja), Ed siempre es negativa. Usamos el valor absoluto |Ed|.
</div>

<p><strong>Clasificación según el valor de |Ed|:</strong></p>
<ul>
<li><strong>|Ed| > 1 → Demanda elástica:</strong> la cantidad reacciona más que proporcionalmente al precio. Un 1% de aumento en el precio genera más de 1% de caída en la cantidad. Ej: bienes de lujo (viajes, joyas), bienes con muchos sustitutos.</li>
<li><strong>|Ed| < 1 → Demanda inelástica:</strong> la cantidad reacciona menos que proporcionalmente. Un 1% de aumento en el precio genera menos de 1% de caída en la cantidad. Ej: bienes de primera necesidad (sal, agua, medicamentos urgentes).</li>
<li><strong>|Ed| = 1 → Demanda unitaria:</strong> la cantidad reacciona exactamente en la misma proporción que el precio.</li>
<li><strong>|Ed| = 0 → Perfectamente inelástica:</strong> la cantidad no reacciona ante variaciones del precio (curva de demanda vertical). Ej: insulina para diabéticos.</li>
<li><strong>|Ed| → ∞ → Perfectamente elástica:</strong> ante cualquier aumento del precio, la cantidad demandada cae a cero (curva de demanda horizontal). Ocurre en mercados de competencia perfecta.</li>
</ul>

<p><strong>Factores que determinan la elasticidad-precio:</strong></p>
<ul>
<li><em>Disponibilidad de sustitutos:</em> más sustitutos → más elástica.</li>
<li><em>Necesidad del bien:</em> más necesario → más inelástico.</li>
<li><em>Proporción del ingreso que representa:</em> mayor proporción → más elástica.</li>
<li><em>Horizonte temporal:</em> en el largo plazo la demanda tiende a ser más elástica (los consumidores tienen más tiempo para ajustarse).</li>
</ul>

<h4>Elasticidad-ingreso de la demanda (Ey)</h4>

<div class="highlight-box">
📊 <strong>Fórmula:</strong><br><br>
<strong>Ey = (% cambio en cantidad demandada) / (% cambio en ingreso)</strong><br><br>
Ey = (ΔQ/Q) / (ΔI/I)
</div>

<ul>
<li><strong>Ey > 0 → Bien normal:</strong> la demanda aumenta cuando sube el ingreso.</li>
<li><strong>Ey > 1 → Bien de lujo (normal superior):</strong> la demanda aumenta más que proporcionalmente al ingreso. Ej: viajes internacionales, autos de alta gama.</li>
<li><strong>0 < Ey < 1 → Bien normal básico:</strong> la demanda aumenta pero menos que el ingreso. Ej: alimentos básicos.</li>
<li><strong>Ey < 0 → Bien inferior:</strong> la demanda disminuye cuando sube el ingreso. El consumidor sustituye este bien por bienes de mayor calidad. Ej: transporte público muy básico, cortes de carne baratos.</li>
</ul>

<h4>Elasticidad cruzada de la demanda (Exy)</h4>

<div class="highlight-box">
📊 <strong>Fórmula:</strong><br><br>
<strong>Exy = (% cambio en Qx) / (% cambio en Py)</strong><br><br>
Mide cuánto varía la demanda del bien X cuando varía el precio del bien Y.
</div>

<ul>
<li><strong>Exy > 0 → bienes sustitutos:</strong> cuando sube el precio de Y, aumenta la demanda de X (se sustituye Y por X).</li>
<li><strong>Exy < 0 → bienes complementarios:</strong> cuando sube el precio de Y, disminuye la demanda de X (se consumen juntos).</li>
<li><strong>Exy = 0 → bienes independientes:</strong> el precio de Y no afecta la demanda de X.</li>
</ul>
`
      },
      {
        id: 'u1-5',
        title: 'Teoría de la producción',
        content: `
<h3>La función de producción</h3>
<p>La <strong>teoría de la producción</strong> estudia la relación técnica entre los factores productivos que utiliza una empresa (insumos) y la cantidad de producto que obtiene (output). Esta relación se expresa a través de la <strong>función de producción</strong>.</p>

<div class="concept-box">
<strong>Función de producción: Q = f(L, K)</strong><br><br>
Q = cantidad producida por unidad de tiempo<br>
L = cantidad de trabajo (horas-hombre, número de trabajadores)<br>
K = cantidad de capital (maquinaria, equipo, infraestructura)<br><br>
La función de producción indica la máxima cantidad de producto que puede obtenerse con cada combinación posible de factores, dado el estado de la tecnología.
</div>

<h4>Corto plazo y largo plazo en la producción</h4>
<ul>
<li><strong>Corto plazo:</strong> período en el que al menos un factor de producción es fijo. Generalmente el capital (planta, maquinaria) es el factor fijo, y el trabajo el variable. La empresa puede ajustar la producción variando la cantidad de trabajo, pero no puede expandir su capacidad instalada.</li>
<li><strong>Largo plazo:</strong> período suficientemente largo como para que todos los factores productivos sean variables. La empresa puede ajustar tanto el trabajo como el capital: cambiar de planta, comprar más máquinas, adoptar nueva tecnología.</li>
</ul>

<h4>Productividad del trabajo en el corto plazo</h4>
<p>Con capital fijo (K̄), al agregar sucesivas unidades de trabajo (L), obtenemos:</p>
<ul>
<li><strong>Producto Total (PT o Q):</strong> la cantidad total producida con L trabajadores y K̄ capital.</li>
<li><strong>Producto Medio del Trabajo (PMe o PMeL):</strong> PMe = Q / L → la producción promedio por trabajador.</li>
<li><strong>Producto Marginal del Trabajo (PMg o PMgL):</strong> PMg = ΔQ / ΔL → el incremento en la producción total al agregar un trabajador adicional.</li>
</ul>

<div class="highlight-box">
⚙️ <strong>Ley de los Rendimientos Marginales Decrecientes (o Ley de la Productividad Marginal Decreciente):</strong><br><br>
A medida que se agregan unidades adicionales de un factor variable (trabajo) a un factor fijo (capital), el producto marginal de ese factor variable tiende a decrecer a partir de cierto punto.<br><br>
Intuitivamente: la primera persona que contratás en una fábrica con 10 máquinas aporta mucho (opera todas las máquinas). La décima persona ya tiene pocas máquinas disponibles y su aporte marginal es menor. La vigésima persona ya no tiene máquinas que operar y puede hasta entorpecer la producción.
</div>

<h4>Las tres etapas de la producción</h4>
<p>Al analizar la relación entre el producto total, el producto medio y el producto marginal, se identifican tres etapas bien diferenciadas:</p>

<div class="concept-box">
<strong>ETAPA I — Rendimientos crecientes:</strong><br>
El PMg aumenta (y es mayor que el PMe). La empresa está subutilizando su capital: agregar trabajadores aumenta la eficiencia porque se aprovechan mejor las máquinas y se puede especializar el trabajo. El PT crece a ritmo creciente.<br>
→ <em>No es racional detenerse aquí: agregar más trabajadores siempre aumenta la eficiencia promedio.</em>
</div>

<div class="concept-box">
<strong>ETAPA II — Rendimientos decrecientes (REGIÓN ECONÓMICA):</strong><br>
El PMg es positivo pero decrece (y es menor que el PMe). El PT sigue creciendo pero a ritmo decreciente. Cada trabajador adicional agrega producción, pero menos que el anterior.<br>
→ <em>Esta es la región racional de producción: la empresa produce en esta etapa porque sigue siendo rentable agregar trabajo.</em>
</div>

<div class="concept-box">
<strong>ETAPA III — Rendimientos negativos:</strong><br>
El PMg se vuelve negativo. El PT comienza a decrecer: agregar más trabajadores con el capital fijo dado reduce la producción total (congestionamiento, interferencias, desorganización).<br>
→ <em>Ninguna empresa racional produce aquí voluntariamente.</em>
</div>

<h4>Relación entre PMg y PMe</h4>
<ul>
<li>Cuando PMg > PMe → el PMe está creciendo.</li>
<li>Cuando PMg < PMe → el PMe está decreciendo.</li>
<li>Cuando PMg = PMe → el PMe está en su valor máximo.</li>
</ul>
<p>Esta relación es análoga a la de promedios: si el último examen que rendiste (marginal) es mejor que tu promedio, tu promedio sube; si es peor, tu promedio baja.</p>

<h4>La producción en el largo plazo: economías de escala</h4>
<p>En el largo plazo, cuando todos los factores son variables, la empresa puede cambiar su escala de producción. Las <strong>economías de escala</strong> describen qué ocurre con los costos medios cuando aumenta la escala:</p>
<ul>
<li><strong>Economías de escala (rendimientos crecientes a escala):</strong> al aumentar todos los factores en un mismo porcentaje, la producción aumenta en un porcentaje mayor. Los costos medios bajan. Favorecen la concentración en grandes empresas.</li>
<li><strong>Deseconomías de escala (rendimientos decrecientes a escala):</strong> la producción aumenta en menor proporción que los factores. Los costos medios suben (problemas de coordinación, burocracia).</li>
<li><strong>Rendimientos constantes a escala:</strong> la producción aumenta en la misma proporción que los factores.</li>
</ul>
`
      },
      {
        id: 'u1-6',
        title: 'Los costos de producción',
        content: `
<h3>De la producción a los costos</h3>
<p>La teoría de los costos es el complemento monetario de la teoría de la producción. Mientras la función de producción describe la relación técnica entre insumos y producto, la teoría de los costos traduce esa relación a términos monetarios. Las decisiones de producción de las empresas se basan fundamentalmente en el análisis de sus costos.</p>

<h4>Costos en el corto plazo</h4>
<p>En el corto plazo, con al menos un factor fijo, los costos se dividen en:</p>

<div class="concept-box">
<strong>COSTO FIJO (CF):</strong><br>
Son los costos que no varían con el nivel de producción, aunque la empresa produzca cero unidades. Se pagan independientemente de si se produce o no.<br><br>
Ejemplos: alquiler de la planta, seguros, amortización de maquinaria, salarios de personal de dirección, intereses de préstamos.<br><br>
CF = constante para todo nivel de Q. Gráficamente es una línea horizontal.
</div>

<div class="concept-box">
<strong>COSTO VARIABLE (CV):</strong><br>
Son los costos que varían con el nivel de producción. A mayor producción, mayores costos variables.<br><br>
Ejemplos: materias primas, mano de obra directa, energía eléctrica ligada al proceso productivo, combustible de las máquinas.<br><br>
CV aumenta con Q. Al principio puede crecer a ritmo decreciente (rendimientos crecientes), luego a ritmo creciente (rendimientos decrecientes).
</div>

<div class="highlight-box">
📐 <strong>Relaciones fundamentales de los costos:</strong><br><br>
<strong>CT = CF + CV</strong> (Costo Total = Costo Fijo + Costo Variable)<br><br>
<strong>CMe = CT / Q</strong> (Costo Medio Total = Costo Total / Cantidad producida)<br><br>
<strong>CFMe = CF / Q</strong> (Costo Fijo Medio = Costo Fijo / Cantidad)<br>
→ El CFMe siempre decrece al aumentar Q (los costos fijos se "diluyen" entre más unidades)<br><br>
<strong>CVMe = CV / Q</strong> (Costo Variable Medio = Costo Variable / Cantidad)<br><br>
<strong>CMg = ΔCT / ΔQ</strong> (Costo Marginal = cambio en CT por cada unidad adicional producida)<br>
→ Como CF no cambia, CMg = ΔCV / ΔQ
</div>

<h4>El costo marginal (CMg) y su relación con el costo medio</h4>
<p>El <strong>costo marginal</strong> es el costo de producir una unidad adicional. Es el concepto más importante para las decisiones de producción de la empresa.</p>
<ul>
<li>El CMg tiene forma de U: primero decrece (al aumentar la producción, la empresa opera de forma más eficiente) y luego crece (al entrar en la zona de rendimientos decrecientes).</li>
<li>La curva de CMg corta a la curva de CMe en el mínimo del CMe (igual que con PMe y PMg: el margen siempre "tira" al promedio hacia donde está el margen).</li>
<li>Cuando CMg < CMe → el CMe está disminuyendo.</li>
<li>Cuando CMg > CMe → el CMe está aumentando.</li>
<li>Cuando CMg = CMe → el CMe está en su mínimo (punto óptimo técnico).</li>
</ul>

<h4>Ejemplo numérico completo</h4>
<div class="concept-box">
<strong>Una panadería con CF = $10.000:</strong><br><br>
Q=0: CF=10.000, CV=0, CT=10.000, CMg=—, CMe=—<br>
Q=100: CF=10.000, CV=4.000, CT=14.000, CMg=40, CMe=140<br>
Q=200: CF=10.000, CV=7.000, CT=17.000, CMg=30, CMe=85<br>
Q=300: CF=10.000, CV=9.600, CT=19.600, CMg=26, CMe=65,3<br>
Q=400: CF=10.000, CV=13.000, CT=23.000, CMg=34, CMe=57,5<br>
Q=500: CF=10.000, CV=18.000, CT=28.000, CMg=50, CMe=56<br>
Q=600: CF=10.000, CV=25.000, CT=35.000, CMg=70, CMe=58,3<br><br>
Observar: el CMe cae hasta Q=500 (mínimo ≈ $56) y luego sube. El CMg es mínimo en Q≈300 y corta al CMe en su mínimo.
</div>

<h4>Costos en el largo plazo</h4>
<p>En el largo plazo, todos los factores son variables. La empresa puede elegir su escala de planta óptima. El <strong>costo total de largo plazo</strong> es la envolvente de todas las curvas de costo de corto plazo: para cada nivel de producción, el costo de largo plazo es el mínimo posible eligiendo la escala óptima.</p>

<ul>
<li>En el largo plazo <strong>no existen costos fijos</strong>: todo costo es variable porque todos los factores pueden ajustarse.</li>
<li>La curva de <strong>Costo Medio de Largo Plazo (CMLP)</strong> también tiene forma de U, pero más suave: refleja las economías y deseconomías de escala.</li>
<li>La <strong>escala mínima eficiente</strong> es el nivel de producción a partir del cual se agotan las economías de escala (CMLP en su mínimo).</li>
</ul>
`
      },
      {
        id: 'u1-7',
        title: 'Maximización del beneficio',
        content: `
<h3>El objetivo de la empresa: maximizar el beneficio</h3>
<p>El objetivo central que asigna la microeconomía a la empresa es la <strong>maximización del beneficio económico</strong>. El beneficio económico (π) difiere del beneficio contable porque incluye el <em>costo de oportunidad</em> de todos los recursos utilizados, incluyendo el capital propio del empresario.</p>

<div class="highlight-box">
📐 <strong>Beneficio económico:</strong><br><br>
<strong>π = IT - CT</strong><br><br>
Donde:<br>
<strong>IT = Ingreso Total = P × Q</strong> (precio de venta × cantidad vendida)<br>
<strong>CT = Costo Total</strong> (incluye todos los costos, fijos y variables)<br><br>
Si π > 0 → beneficio positivo (superbeneficios)<br>
Si π = 0 → beneficio normal (cubre todos los costos incluyendo el costo de oportunidad)<br>
Si π < 0 → pérdida
</div>

<h4>El ingreso marginal (IMg)</h4>
<p>El <strong>ingreso marginal (IMg)</strong> es el ingreso adicional que obtiene la empresa al vender una unidad más de producto:</p>

<div class="concept-box">
<strong>IMg = ΔIT / ΔQ</strong><br><br>
En mercados de competencia perfecta (donde la empresa es "tomadora de precios"): IMg = P (el precio de mercado es constante).<br><br>
En mercados con poder de mercado (monopolio, oligopolio): el IMg < P porque para vender más la empresa debe bajar el precio a todas las unidades.
</div>

<h4>La condición de maximización del beneficio: IMg = CMg</h4>
<p>La empresa maximiza su beneficio produciendo la cantidad donde el <strong>ingreso marginal es igual al costo marginal</strong>:</p>

<div class="highlight-box">
⚖️ <strong>Regla de oro: IMg = CMg</strong><br><br>
Lógica de la decisión:<br><br>
→ Si IMg > CMg: la última unidad producida genera más ingreso que costo → conviene producir más.<br>
→ Si IMg < CMg: la última unidad producida cuesta más de lo que genera → conviene producir menos.<br>
→ Si IMg = CMg: se alcanza el punto óptimo. No hay incentivo a cambiar la cantidad producida.<br><br>
Esta regla aplica independientemente de la estructura de mercado.
</div>

<h4>Análisis gráfico de la maximización del beneficio</h4>
<p>Gráficamente, el beneficio se maximiza donde las curvas de IMg y CMg se cortan. En la curva de IT y CT:</p>
<ul>
<li>La empresa tiene beneficio positivo cuando IT > CT (el segmento vertical entre ambas curvas mide el beneficio).</li>
<li>El beneficio es máximo donde la pendiente de IT (= IMg) es igual a la pendiente de CT (= CMg).</li>
<li>El punto de cierre (shutdown point) ocurre cuando P < CVMe: la empresa no cubre ni sus costos variables y conviene cerrar en el corto plazo.</li>
</ul>

<h4>Ejemplo numérico de maximización del beneficio</h4>
<div class="concept-box">
<strong>Una empresa con P = $100 (competencia perfecta, IMg = $100) y CF = $500:</strong><br><br>
Q=1: IT=100, CT=550, π=-450, CMg=50<br>
Q=2: IT=200, CT=590, π=-390, CMg=40<br>
Q=3: IT=300, CT=620, π=-320, CMg=30<br>
Q=4: IT=400, CT=660, π=-260, CMg=40<br>
Q=5: IT=500, CT=720, π=-220, CMg=60<br>
Q=6: IT=600, CT=800, π=-200, CMg=80<br>
Q=7: IT=700, CT=900, π=-200, CMg=100 ← <strong>IMg=CMg: máximo beneficio (menor pérdida)</strong><br>
Q=8: IT=800, CT=1.020, π=-220, CMg=120<br><br>
Con CF muy alto, la empresa igual opera en Q=7 en el corto plazo porque π=-200 > pérdida si cierra (-500). Cierra cuando π < -CF.
</div>

<h4>La decisión de corto plazo vs. largo plazo</h4>
<ul>
<li><strong>Corto plazo:</strong> la empresa opera si P ≥ CVMe (cubre sus costos variables). Aunque tenga pérdidas, es mejor que cerrar porque los costos fijos igual se pagan. Solo cierra si P < CVMe.</li>
<li><strong>Largo plazo:</strong> la empresa permanece en el mercado solo si P ≥ CMe (cubre todos sus costos). Si hay pérdidas en el largo plazo, sale del mercado (porque puede liquidar todos sus factores).</li>
<li><strong>Ganancias extraordinarias en el largo plazo:</strong> en mercados competitivos, las ganancias extraordinarias atraen nuevas empresas, aumenta la oferta, baja el precio hasta que π = 0 (equilibrio de largo plazo con beneficio normal).</li>
</ul>
`
      }
    ],
    quizzes: [
      {
        id: 'quiz-u1a',
        title: 'Ejercitación — Consumidor, Utilidad y Equilibrio',
        questions: [
          {
            text: 'Un consumidor tiene UMg del bien X = 40 y precio de X = $8. UMg del bien Y = 30 y precio de Y = $5. Para maximizar su utilidad debería:',
            options: [
              'Comprar más de Y y menos de X, porque UMg/P de Y (6) > UMg/P de X (5)',
              'Comprar más de X y menos de Y, porque UMg/P de X (5) > UMg/P de Y (6)',
              'Mantener el mismo consumo porque está en equilibrio',
              'Solo comprar el bien más barato'
            ],
            correct: 0,
            feedback: '¡Exacto! La condición de equilibrio es UMgX/Px = UMgY/Py. Aquí UMgX/Px = 40/8 = 5 y UMgY/Py = 30/5 = 6. Como Y da más utilidad por peso gastado, conviene comprar más Y y menos X hasta que ambas razones se igualen.'
          },
          {
            text: 'En el mapa de curvas de indiferencia de un consumidor, una curva más alejada del origen representa:',
            options: [
              'Un nivel más bajo de utilidad',
              'Menor ingreso disponible',
              'Un nivel más alto de utilidad o satisfacción',
              'Precios más altos de los bienes'
            ],
            correct: 2,
            feedback: '¡Correcto! En un mapa de indiferencia, cuanto más alejada del origen se encuentre la curva, más alto es el nivel de utilidad que representa. El consumidor siempre prefiere estar en la curva más alejada posible del origen, dentro de su restricción presupuestaria.'
          },
          {
            text: 'Si la Tasa Marginal de Sustitución (TMS) entre X e Y es 3 (el consumidor cede 3 unidades de Y por 1 de X) y la relación de precios Px/Py = 2, el consumidor está:',
            options: [
              'En equilibrio óptimo',
              'Fuera de la restricción presupuestaria',
              'Dispuesto a pagar más por X de lo que el mercado pide: conviene comprar más X y menos Y',
              'Pagando más de lo que vale X en el mercado: conviene comprar menos X'
            ],
            correct: 2,
            feedback: '¡Muy bien! TMS=3 significa que el consumidor está dispuesto a ceder 3 unidades de Y por 1 de X. Pero el mercado solo le pide ceder 2 (Px/Py=2). El "precio subjetivo" de X para este consumidor es mayor que el precio de mercado, por lo que conviene comprar más X.'
          },
          {
            text: 'Si sube el precio del bien X, y X e Y son bienes complementarios, la demanda del bien Y:',
            options: [
              'Sube, porque son complementarios',
              'Baja, porque al subir el precio de X se consume menos X y por tanto menos Y también',
              'No cambia, porque el precio de Y no varió',
              'Sube si Y es bien inferior'
            ],
            correct: 1,
            feedback: '¡Correcto! Los bienes complementarios se consumen juntos (auto y nafta, impresora y cartucho). Si sube el precio de X y se consume menos X, también se consume menos Y. La elasticidad cruzada entre complementarios es negativa.'
          },
          {
            text: 'La Ley de la Utilidad Marginal Decreciente implica que la curva de demanda tiene pendiente negativa porque:',
            options: [
              'Los consumidores siempre prefieren bienes más baratos',
              'Para que el consumidor quiera comprar una unidad adicional (cuya UMg es menor), el precio debe bajar',
              'Las empresas bajan el precio cuando producen más',
              'El ingreso real aumenta cuando baja el precio'
            ],
            correct: 1,
            feedback: '¡Perfecto! La UMg decreciente explica la pendiente negativa de la demanda: cada unidad adicional de un bien satisface menos que la anterior. Para que el consumidor esté dispuesto a comprar esa unidad adicional (de menor UMg), debe ofrecérsele a un precio menor.'
          }
        ]
      },
      {
        id: 'quiz-u1b',
        title: 'Ejercitación — Demanda y Elasticidades',
        questions: [
          {
            text: 'El precio de las entradas al cine sube de $1.000 a $1.200 (20%) y la cantidad de espectadores cae de 500 a 400 (20%). La elasticidad-precio de la demanda es:',
            options: [
              '|Ed| = 0,5 → inelástica',
              '|Ed| = 1 → unitaria',
              '|Ed| = 2 → elástica',
              '|Ed| = 0 → perfectamente inelástica'
            ],
            correct: 1,
            feedback: '¡Correcto! Ed = (% cambio en Q) / (% cambio en P) = (-20%) / (20%) = -1. El valor absoluto es 1: demanda unitaria. La caída porcentual en cantidad es exactamente igual al aumento porcentual en precio.'
          },
          {
            text: 'Una empresa sube el precio de su producto un 10% y sus ingresos totales suben. Esto indica que la demanda es:',
            options: [
              'Elástica: la cantidad cayó mucho y los ingresos bajaron',
              'Inelástica: la cantidad cayó poco, y el efecto precio dominó, aumentando los ingresos totales',
              'Unitaria: los ingresos no cambian',
              'Perfectamente elástica'
            ],
            correct: 1,
            feedback: '¡Exacto! Con demanda inelástica (|Ed|<1), al subir el precio los ingresos totales (P×Q) aumentan porque la caída en Q es proporcionalmente menor al aumento en P. Con demanda elástica ocurre lo contrario: al subir P, Q cae mucho y los ingresos bajan.'
          },
          {
            text: 'El ingreso de los consumidores sube un 15% y la cantidad demandada de viajes internacionales sube un 30%. La elasticidad-ingreso es 2. Este bien es:',
            options: [
              'Un bien inferior',
              'Un bien normal básico',
              'Un bien de lujo (normal superior)',
              'Un bien inelástico al ingreso'
            ],
            correct: 2,
            feedback: '¡Muy bien! Ey = 30%/15% = 2 > 1: bien de lujo. Su demanda crece más que proporcionalmente al ingreso. Los viajes internacionales son un ejemplo clásico: cuando las personas se enriquecen, destinan una proporción cada vez mayor de su mayor ingreso a bienes y experiencias de lujo.'
          },
          {
            text: 'En Argentina, si sube el precio del gas natural (bien con demanda inelástica), el impacto en el presupuesto familiar de los hogares de menores ingresos será:',
            options: [
              'Menor, porque pueden reducir fácilmente su consumo',
              'Mayor, porque gastan una mayor proporción de su ingreso en este bien esencial y no pueden reducir fácilmente su consumo',
              'Nulo, porque el Estado siempre subsidia los aumentos',
              'Igual al de los hogares de altos ingresos'
            ],
            correct: 1,
            feedback: '¡Correcto! Los bienes inelásticos son especialmente gravosos para los hogares pobres porque: (a) gastan una mayor proporción de su ingreso en ellos, y (b) no pueden reducir su consumo porque son esenciales. Esta es la razón económica detrás de los subsidios tarifarios en Argentina.'
          },
          {
            text: '¿Cuál de las siguientes afirmaciones es INCORRECTA sobre la curva de demanda?',
            options: [
              'Se desplaza cuando cambia el ingreso del consumidor',
              'Se desplaza cuando cambia el precio del bien complementario',
              'Se desplaza cuando cambia el precio del propio bien',
              'Se desplaza cuando cambian los gustos y preferencias'
            ],
            correct: 2,
            feedback: '¡Correcto que esta es la incorrecta! Cuando cambia el precio del propio bien, NO se desplaza la curva: simplemente nos movemos a lo largo de la misma curva (cambio en la cantidad demandada, no en la demanda). La curva solo se desplaza cuando cambian los demás determinantes (ingreso, precios de otros bienes, gustos, expectativas).'
          }
        ]
      },
      {
        id: 'quiz-u1c',
        title: 'Ejercitación — Producción, Costos y Beneficio',
        questions: [
          {
            text: 'Una fábrica tiene K fijo = 5 máquinas. Con 3 trabajadores produce 120 unidades; con 4 trabajadores produce 148 unidades; con 5 trabajadores produce 170 unidades. El producto marginal del 5° trabajador es:',
            options: ['22 unidades', '34 unidades', '17 unidades', '170 unidades'],
            correct: 0,
            feedback: '¡Exacto! PMg del 5° trabajador = PT(5) - PT(4) = 170 - 148 = 22 unidades. Notá que el PMg del 4° trabajador era 148-120=28 > 22: el PMg está disminuyendo, lo que ilustra la Ley de Rendimientos Decrecientes.'
          },
          {
            text: 'Una empresa tiene CF = $20.000, CVMe = $50 y produce 400 unidades. El precio de venta es $80. ¿Cuál es el beneficio?',
            options: [
              'π = $12.000 positivo',
              'π = -$8.000 (pérdida)',
              'π = $32.000 positivo',
              'π = $0 (punto de equilibrio)'
            ],
            correct: 0,
            feedback: 'IT = P×Q = 80×400 = $32.000. CV = CVMe×Q = 50×400 = $20.000. CT = CF+CV = 20.000+20.000 = $40.000. π = IT-CT = 32.000-40.000 = -$8.000. ¡Cuidado, es pérdida! Pero la empresa igualmente produce porque IT ($32.000) > CV ($20.000): cubre sus costos variables y algo de los fijos.'
          },
          {
            text: 'Una empresa produce donde IMg = CMg = $60. El CMe en ese punto es $55 y el P = $60. ¿Cuál es la situación de la empresa?',
            options: [
              'Pérdida, porque CMg = CMe',
              'Beneficio positivo, porque P ($60) > CMe ($55): cada unidad vendida deja $5 de ganancia',
              'Beneficio normal (π=0)',
              'Insuficiente información para determinarlo'
            ],
            correct: 1,
            feedback: '¡Perfecto! El beneficio por unidad = P - CMe = 60 - 55 = $5. Como IMg=CMg=P, está en el punto de maximización del beneficio. El beneficio total = (P-CMe)×Q = $5×Q > 0. La empresa tiene superbeneficios porque P > CMe.'
          },
          {
            text: 'En el corto plazo, ¿cuándo debería cerrar una empresa aunque esté teniendo pérdidas?',
            options: [
              'Cuando P < CMe (no cubre el costo medio total)',
              'Cuando P < CVMe (no cubre ni siquiera los costos variables)',
              'Cuando CF > CV',
              'Cuando el PMg < PMe'
            ],
            correct: 1,
            feedback: '¡Correcto! En el corto plazo la empresa cierra solo cuando P < CVMe, porque en ese caso las pérdidas de operar son mayores que las pérdidas de cerrar (que serían iguales al CF). Si P ≥ CVMe, la empresa opera aunque tenga pérdidas, porque al menos cubre sus costos variables y parte de los fijos.'
          },
          {
            text: 'En el largo plazo, en un mercado de competencia perfecta con superbeneficios, ¿qué ocurrirá?',
            options: [
              'Las empresas existentes producirán más y los precios subirán aún más',
              'Nuevas empresas entrarán al mercado, la oferta aumentará, el precio bajará hasta que el beneficio sea normal (π=0)',
              'El Estado intervendrá para regular los beneficios excesivos',
              'Los consumidores pagarán más porque valoran el producto'
            ],
            correct: 1,
            feedback: '¡Excelente! Este es el mecanismo de ajuste de largo plazo en competencia perfecta: las ganancias extraordinarias son una señal que atrae nuevas empresas. La entrada de nuevas firmas aumenta la oferta total del mercado, lo que presiona el precio a la baja, hasta que las ganancias se reducen a la normalidad (beneficio económico = 0).'
          }
        ]
      }
    ]
  }
];
// ─── NOTICIAS ──────────────────────────────────────
const NEWS = [
  {
    id: 'news-1',
    tag: 'Microeconomía · Argentina',
    title: 'Inflación y el poder adquisitivo de los consumidores argentinos',
    date: 'Marzo 2025',
    desc: 'La escalada de precios en Argentina plantea un desafío concreto para analizar la teoría del consumidor: ¿cómo cambian las curvas de indiferencia y las restricciones presupuestarias cuando la inflación erosiona el ingreso real?',
    content: `
<p>En 2024, Argentina atravesó una de las inflaciones más altas del mundo, superando el 200% anual. Este fenómeno macroeconómico tiene efectos directamente observables en los conceptos microeconómicos que estamos estudiando.</p>
<p><strong>Efecto sobre la restricción presupuestaria:</strong> Si los precios suben más rápido que los salarios, el ingreso real cae. La restricción presupuestaria se desplaza hacia la izquierda: el consumidor puede comprar menos cantidad de bienes. Esto es exactamente lo opuesto a cuando decimos que "el ingreso sube".</p>
<p><strong>Efecto ingreso y efecto sustitución:</strong> Ante el alza de precios de ciertos alimentos (como la carne), muchos argentinos sustituyeron por bienes más baratos (pollo, legumbres, huevo). Esta es la elasticidad-precio cruzada en acción.</p>
<p><strong>Bienes inferiores y la crisis:</strong> Las ventas de marcas de segunda línea y comercios de descuento aumentaron notablemente, fenómeno consistente con la teoría de bienes inferiores: cuando el ingreso real cae, la demanda de bienes inferiores aumenta.</p>
<p>Analizar la economía argentina desde la teoría microeconómica permite comprender mejor las decisiones cotidianas de los consumidores bajo situaciones de alta incertidumbre.</p>
`,
    quizId: 'quiz-news-1',
    quiz: {
      questions: [
        {
          text: 'Si la inflación erosiona el ingreso real de las familias, la restricción presupuestaria:',
          options: ['Se desplaza hacia la derecha', 'Se desplaza hacia la izquierda', 'No cambia', 'Cambia su pendiente únicamente'],
          correct: 1,
          feedback: 'Correcto. Al perder poder adquisitivo, la restricción presupuestaria se contrae hacia la izquierda: se pueden comprar menos bienes con el mismo ingreso nominal.'
        },
        {
          text: 'En el contexto de la noticia, el reemplazo de carne por pollo ante el alza del precio de la carne es un ejemplo de:',
          options: ['Efecto ingreso únicamente', 'Bienes complementarios en acción', 'Bienes sustitutos y elasticidad cruzada', 'Utilidad marginal creciente'],
          correct: 2,
          feedback: '¡Muy bien! La carne y el pollo son bienes sustitutos. Al subir el precio de la carne, los consumidores demandan más pollo. Esto muestra la elasticidad precio-cruzada positiva entre bienes sustitutos.'
        },
        {
          text: 'El aumento de ventas de marcas de segunda línea durante la crisis económica evidencia:',
          options: ['Un aumento del ingreso real de las familias', 'Que esas marcas tienen mejor calidad', 'El comportamiento de los bienes inferiores ante caída del ingreso real', 'Una falla del mercado de consumo'],
          correct: 2,
          feedback: 'Exacto. Los bienes inferiores tienen elasticidad-ingreso negativa: su demanda aumenta cuando el ingreso real cae. Las marcas más baratas y los negocios de descuento son ejemplos típicos de bienes/servicios inferiores.'
        }
      ]
    }
  },
  {
    id: 'news-2',
    tag: 'Microeconomía · Argentina · Teoría de la Producción',
    title: 'YPF amplía su capacidad productiva en Vaca Muerta: etapas de producción y costos en acción',
    date: 'Marzo 2025',
    desc: 'La mayor inversión en hidrocarburos de la historia argentina nos permite analizar en vivo los conceptos de función de producción, rendimientos decrecientes y costos de largo plazo.',
    content: `
<p>YPF anunció en 2025 una inversión record en el yacimiento no convencional de Vaca Muerta (Neuquén), con el objetivo de aumentar la producción de petróleo y gas. Esta decisión empresarial es un ejemplo perfecto para analizar los conceptos de producción y costos que estudiamos en clase.</p>
<p><strong>La función de producción en Vaca Muerta:</strong> Para extraer petróleo no convencional, YPF combina factores productivos: <em>tierra</em> (el yacimiento, recurso natural), <em>trabajo</em> (ingenieros, técnicos, operadores) y <em>capital</em> (plataformas de perforación, oleoductos, plantas de procesamiento). La cantidad producida (Q) depende de cómo se combinen estos factores.</p>
<div class="highlight-box">
⚙️ <strong>Rendimientos decrecientes en la práctica:</strong> En las primeras etapas de explotación de un pozo, cada plataforma adicional genera grandes aumentos de producción (Etapa I). A medida que se agregan más equipos y trabajadores a una infraestructura fija, los incrementos de producción se vuelven menores (Etapa II — región económica). Si se excede la capacidad, la producción puede hasta caer (Etapa III).
</div>
<p><strong>Costos de largo plazo:</strong> La inversión en Vaca Muerta es un ejemplo de decisión de <em>largo plazo</em>: YPF está modificando todos sus factores, incluyendo el capital (construye nueva infraestructura). En el corto plazo, una vez instaladas las plataformas, estas se convierten en <em>costos fijos</em> que deben amortizarse independientemente de la producción diaria.</p>
<p><strong>Maximización del beneficio:</strong> ¿Cuántos pozos conviene perforar? La empresa perfora un pozo adicional siempre que el ingreso que genera (precio del barril × producción adicional) sea mayor que su costo marginal. Cuando el costo del pozo adicional iguala al ingreso que genera, se detiene: IMg = CMg.</p>
<p>Este caso muestra cómo las decisiones de una empresa real se pueden analizar con exactamente las mismas herramientas teóricas que desarrollamos en la Unidad 1.</p>
`,
    quizId: 'quiz-news-2',
    quiz: {
      questions: [
        {
          text: 'La decisión de YPF de invertir en nueva infraestructura en Vaca Muerta es una decisión de:',
          options: [
            'Corto plazo, porque el capital siempre es variable',
            'Largo plazo, porque implica modificar todos los factores incluyendo el capital',
            'Etapa III de la producción, porque reduce la eficiencia',
            'Minimización del costo marginal únicamente'
          ],
          correct: 1,
          feedback: '¡Correcto! En el largo plazo todos los factores son variables. YPF está modificando su capital (infraestructura) para aumentar su capacidad productiva, lo que es típico de una decisión de largo plazo.'
        },
        {
          text: 'Cuando una plataforma de perforación ya está instalada, su costo pasa a ser:',
          options: [
            'Un costo variable que cambia con la producción diaria',
            'Un costo fijo que se mantiene independientemente de la cantidad producida',
            'Un costo marginal decreciente',
            'Un costo de la Etapa II de producción'
          ],
          correct: 1,
          feedback: 'Exacto. Una vez instalada, la plataforma representa un costo fijo: hay que pagar su amortización, mantenimiento y financiamiento sin importar si produce 100 o 1.000 barriles por día. Solo en el largo plazo (si se deja de usar o se vende) deja de ser fijo.'
        },
        {
          text: 'YPF decide cuántos pozos perforar según el criterio:',
          options: [
            'Perfora hasta agotar completamente el yacimiento (maximizar producción)',
            'Perfora mientras el Ingreso Marginal de cada pozo supere su Costo Marginal (IMg ≥ CMg)',
            'Perfora la cantidad que minimiza el costo total',
            'Perfora según lo que decida el Estado, sin análisis económico'
          ],
          correct: 1,
          feedback: '¡Muy bien! La regla de maximización del beneficio dice: producir mientras IMg ≥ CMg. Cada pozo adicional conviene mientras genere más ingreso del que cuesta. El punto óptimo es donde IMg = CMg.'
        }
      ]
    }
  },
  {
    id: 'news-3',
    tag: 'Economía Argentina · Política',
    title: 'Desregulación y mercados competitivos en la Argentina 2024-2025',
    date: 'Marzo 2025',
    desc: 'El gobierno argentino implementó medidas de desregulación económica. ¿Qué implica esto desde la teoría de los sistemas económicos y la microeconomía?',
    content: `
<p>A partir de diciembre de 2023, Argentina inició un proceso de desregulación y apertura económica que incluyó la liberación de precios en varios sectores, reducción de controles cambiarios y reformas en mercados históricamente regulados.</p>
<p><strong>Desde la teoría del sistema económico:</strong> Este proceso implica un movimiento hacia una economía más cercana al modelo de mercado (precio como señal coordinadora) y alejarse de la economía mixta con fuerte intervención estatal que había prevalecido.</p>
<p><strong>Efectos sobre los mercados:</strong> La liberación de precios buscó eliminar distorsiones y restaurar el mecanismo de precios como asignador de recursos. En sectores con precios controlados, los precios "reprimidos" generaban escasez (demanda mayor a oferta al precio oficial).</p>
<p><strong>Elasticidad y ajuste de precios:</strong> Cuando se liberaron precios en sectores con demanda inelástica (energía, combustibles, medicamentos), el impacto en los consumidores fue mayor porque no podían reducir fácilmente su consumo ante el aumento de precios.</p>
<p><strong>Debate entre economía positiva y normativa:</strong> Esta situación ilustra perfectamente la diferencia: la economía positiva describe qué ocurrió (los precios subieron, el déficit fiscal bajó), mientras que la normativa debate si fue correcto hacerlo y con qué velocidad.</p>
`,
    quizId: 'quiz-news-3',
    quiz: {
      questions: [
        {
          text: 'Cuando el gobierno libera precios previamente controlados en sectores con demanda inelástica, el impacto sobre los consumidores es:',
          options: ['Menor, porque ajustan fácilmente su consumo', 'Mayor, porque no pueden reducir fácilmente su consumo ante el alza', 'Nulo, porque la oferta también se ajusta automáticamente', 'Igual que en cualquier otro sector'],
          correct: 1,
          feedback: 'Exacto. En bienes con demanda inelástica (energía, medicamentos), los consumidores no pueden reducir fácilmente su consumo aunque el precio suba mucho. Por eso el impacto en su presupuesto es mayor.'
        },
        {
          text: 'Afirmar que "fue incorrecto liberar los precios porque aumentó la pobreza" es un ejemplo de:',
          options: ['Economía positiva', 'Economía normativa', 'Una medición del PBI', 'Un análisis de elasticidad'],
          correct: 1,
          feedback: '¡Correcto! Es un juicio de valor (normativo): evalúa si algo "debería" haberse hecho o no. La economía positiva solo describría los hechos: "la liberación de precios generó un aumento del X% en el índice de pobreza".'
        },
        {
          text: 'Que haya "escasez" cuando los precios están controlados por debajo del precio de equilibrio significa que:',
          options: ['La oferta supera a la demanda', 'La demanda supera a la oferta al precio oficial', 'El mercado está en equilibrio', 'Los consumidores no quieren comprar el bien'],
          correct: 1,
          feedback: '¡Muy bien! Cuando el precio está artificialmente bajo (por debajo del precio de equilibrio), hay más demanda que oferta: los consumidores quieren comprar más de lo que los productores están dispuestos a ofrecer a ese precio.'
        }
      ]
    }
  },
  // ══ NOTICIAS SEMANA DEL 17–22 MARZO 2026 ══════════
  {
    id: 'news-4',
    tag: 'Macroeconomía · Argentina · Semana 22/03/2026',
    title: 'El PBI argentino creció 4,4% en 2025: ¿qué sectores lideraron la recuperación?',
    date: '20 de marzo de 2026',
    desc: 'El INDEC confirmó esta semana que la economía argentina cerró 2025 con una expansión del 4,4%, revirtiendo dos años de caída. El consumo privado (7,9%) y la inversión (16,4%) fueron los principales motores.',
    content: `
<p>Esta semana el INDEC (Instituto Nacional de Estadística y Censos) publicó el dato definitivo del Producto Bruto Interno del año 2025: la economía argentina creció un <strong>4,4% interanual</strong>, revirtiendo la caída del 1,3% de 2024 y el 1,9% de 2023.</p>
<p><strong>Componentes de la demanda agregada:</strong> El crecimiento se explica principalmente por el aumento del <em>consumo privado</em> (7,9%), las <em>exportaciones</em> (7,6%) y la <em>formación bruta de capital fijo</em> (16,4%), lo que refleja una recuperación de la inversión empresarial.</p>
<div class="highlight-box">
💡 <strong>Conexión con la microeconomía:</strong> El aumento del consumo privado del 7,9% es el resultado de millones de decisiones individuales de consumidores que, con mayor ingreso real disponible, desplazaron su restricción presupuestaria hacia la derecha y se movieron a curvas de indiferencia más alejadas del origen.
</div>
<p><strong>Sectores líderes:</strong> Los rubros con mayor crecimiento fueron intermediación financiera (+24,7%), explotación de minas y canteras (+8,0%), hoteles y restaurantes (+7,4%) y agricultura y ganadería (+6,2%). En cambio, industria manufacturera y comercio mostraron menor dinamismo, reflejando una <em>recuperación heterogénea</em>.</p>
<p><strong>Perspectivas 2026:</strong> El FMI proyecta un crecimiento del 4% para Argentina en 2026, ubicándola entre las economías de mayor expansión dentro del G20. Sin embargo, analistas como Fundación Capital advierten que la inflación, que no bajará del 2,5% mensual en el primer trimestre, podría moderar la recuperación del consumo.</p>
<p>Este dato de PBI nos conecta con la macroeconomía: el PBI es la medida más importante de la producción total de una economía y su crecimiento (o caída) resume las decisiones de producción, consumo e inversión de millones de agentes.</p>
`,
    quizId: 'quiz-news-4',
    quiz: {
      questions: [
        {
          text: 'Si el consumo privado creció 7,9%, desde la perspectiva microeconómica esto implica que:',
          options: [
            'Los consumidores cambiaron sus gustos y preferencias',
            'La restricción presupuestaria de las familias se desplazó hacia la derecha por mayor ingreso real',
            'Los precios de los bienes bajaron en todos los mercados',
            'La utilidad marginal de los bienes aumentó en 2025'
          ],
          correct: 1,
          feedback: '¡Muy bien! El aumento del consumo privado refleja un mayor ingreso real disponible: los consumidores pudieron comprar más cantidad de bienes. Esto se representa como un desplazamiento de la restricción presupuestaria hacia la derecha.'
        },
        {
          text: 'El hecho de que la inversión (formación bruta de capital fijo) creciera 16,4% implica que las empresas:',
          options: [
            'Redujeron sus costos fijos en el corto plazo',
            'Ampliaron su capacidad productiva agregando más capital (bienes de capital)',
            'Contrataron solo más trabajadores (factor trabajo)',
            'Operaron en la Etapa III de la producción'
          ],
          correct: 1,
          feedback: '¡Correcto! La inversión en capital fijo (maquinaria, edificios, equipos) es lo que permite a las empresas aumentar su capacidad productiva en el largo plazo, expandiendo la función de producción y pudiendo producir más con mayor eficiencia.'
        },
        {
          text: 'Si el consumo privado creció 7,9% porque aumentó el ingreso real de las familias, esto implica que los consumidores se movieron a:',
          options: [
            'Una curva de indiferencia más cercana al origen (menor utilidad)',
            'Una curva de indiferencia más alejada del origen (mayor utilidad)',
            'El mismo punto de equilibrio pero con distinta restricción presupuestaria',
            'Una demanda inelástica de todos los bienes'
          ],
          correct: 1,
          feedback: '¡Perfecto! Al aumentar el ingreso real, la restricción presupuestaria se desplaza hacia la derecha. Esto permite al consumidor alcanzar una curva de indiferencia más alta (más alejada del origen), que representa mayor utilidad o bienestar.'
        }
      ]
    }
  },
  {
    id: 'news-5',
    tag: 'Microeconomía · Argentina · Semana 22/03/2026',
    title: 'Inflación, salarios y consumo débil: el desafío del primer trimestre 2026',
    date: '21 de marzo de 2026',
    desc: 'Pese al crecimiento del PBI en 2025, los indicadores de consumo muestran escaso dinamismo en el inicio de 2026. La inflación proyectada de 2,5% mensual supera las paritarias y erosiona el ingreso real.',
    content: `
<p>Mientras Argentina celebra el crecimiento del 4,4% en 2025, los datos del inicio de 2026 muestran una tensión que los economistas de Equilibra describen así: los salarios, incluso los que tienen paritarias negociadas, no logran acompañar el aumento de precios.</p>
<p><strong>La paradoja del consumidor en 2026:</strong> El índice de consumo en supermercados, ventas pyme y centros comerciales muestra escaso dinamismo en los primeros meses del año, a pesar de la recuperación del año anterior. ¿Por qué? Porque la inflación erosiona el ingreso real.</p>
<div class="highlight-box">
📉 <strong>Efecto sobre la restricción presupuestaria:</strong> Si los precios suben 2,5% mensual (30% anual) pero los salarios suben a menor ritmo, el ingreso real cae. Esto contrae la restricción presupuestaria mes a mes, reduciendo la cantidad de bienes que cada consumidor puede adquirir.
</div>
<p><strong>Inflación segmentada:</strong> Los analistas señalan que el alza de precios no es uniforme. Los servicios regulados (energía, transporte) y los alimentos (especialmente la carne) están generando mayor presión que otros rubros. Para los consumidores con menor ingreso, estos bienes tienen <em>demanda inelástica</em>: no pueden reducir fácilmente su consumo aunque el precio suba.</p>
<p><strong>El crédito como factor:</strong> La intermediación financiera fue el sector que más creció en 2025 (+24,7%). El crédito al consumo permitió que las familias sostuvieran su nivel de gasto incluso con ingresos reales estancados. Sin embargo, la <em>morosidad creciente</em> y el menor dinamismo del crédito en 2026 anticipan un freno adicional al consumo.</p>
<p>Este escenario ilustra perfectamente la relación entre variables macroeconómicas (inflación, salarios, crédito) y las decisiones microeconómicas individuales (cuánto consumir, qué bienes sustituir, cuánto endeudarse).</p>
`,
    quizId: 'quiz-news-5',
    quiz: {
      questions: [
        {
          text: 'Si los precios suben 30% anual pero los salarios suben solo 20% anual, el ingreso real:',
          options: [
            'Aumenta en un 10%',
            'Se mantiene igual porque ambos suben',
            'Cae: el consumidor puede comprar menos bienes con su salario',
            'Depende únicamente de la elasticidad-precio'
          ],
          correct: 2,
          feedback: '¡Correcto! El ingreso real es el ingreso nominal ajustado por inflación. Si los precios suben más que los salarios, el poder adquisitivo cae: la restricción presupuestaria se contrae y el consumidor puede acceder a menos bienes.'
        },
        {
          text: 'El hecho de que los consumidores de menor ingreso no puedan reducir su consumo de alimentos básicos aunque suban los precios refleja que estos bienes tienen:',
          options: [
            'Demanda elástica — muy sensibles al precio',
            'Demanda inelástica — poco sensibles al precio',
            'Demanda de bien de lujo',
            'Elasticidad-ingreso positiva alta'
          ],
          correct: 1,
          feedback: 'Exacto. Los alimentos básicos, energía y otros bienes esenciales tienen demanda inelástica (|Ed| < 1): la cantidad demandada no cae mucho cuando sube el precio, porque son de primera necesidad y no tienen buenos sustitutos cercanos.'
        },
        {
          text: 'Ante el alza simultánea de precios de energía y alimentos, un consumidor que tiene ingresos fijos debería, según la teoría del consumidor, tender a:',
          options: [
            'Mantener exactamente el mismo punto de equilibrio porque su utilidad no cambia',
            'Buscar un nuevo punto de equilibrio consumiendo menos de los bienes que subieron más de precio y más de los que subieron menos',
            'Aumentar su consumo total para no perder bienestar',
            'Moverse a una curva de indiferencia más alejada del origen'
          ],
          correct: 1,
          feedback: '¡Muy bien! Cuando cambian los precios relativos, el consumidor racional reajusta su consumo buscando un nuevo equilibrio (nueva tangencia). Reduce el consumo de bienes que se encarecieron más y sustituye por bienes relativamente más baratos, maximizando utilidad con la nueva restricción presupuestaria.'
        }
      ]
    }
  },
  {
    id: 'news-6',
    tag: 'Macro · Global · Argentina · Semana 22/03/2026',
    title: 'Argentina y el triángulo del litio: oportunidad productiva y costos de largo plazo',
    date: '18 de marzo de 2026',
    desc: 'Según el BID, Argentina proyecta ser el país de mayor crecimiento regional en 2026. El litio y la minería aparecen como nuevos motores productivos. ¿Qué implica esto desde la teoría de la producción?',
    content: `
<p>El Banco Interamericano de Desarrollo (BID) proyecta que Argentina será el país de mayor crecimiento de América Latina en 2026, con una expansión estimada del 3,8%. Uno de los factores clave mencionados en el informe es el posicionamiento estratégico del país en el denominado <em>triángulo del litio</em>.</p>
<p><strong>El litio como factor productivo:</strong> Argentina, junto a Bolivia y Chile, concentra las mayores reservas mundiales de litio, mineral esencial para las baterías de autos eléctricos y dispositivos tecnológicos. Desde la teoría económica, el litio es un recurso natural (factor "Tierra") cuya demanda global está creciendo aceleradamente.</p>
<div class="highlight-box">
⚙️ <strong>Función de producción y recursos naturales:</strong> El litio actúa como un insumo clave en la función de producción de tecnología limpia global. Su abundancia en Argentina representa una ventaja comparativa en términos de costos: los países con más reservas pueden producir litio a menor costo medio que otros.
</div>
<p><strong>Costos en el largo plazo:</strong> La explotación minera requiere enormes <em>costos fijos</em> iniciales (exploración, infraestructura, plantas de procesamiento) que actúan como barreras de entrada. Sin embargo, una vez instalada la capacidad productiva, el costo variable por tonelada de litio puede ser relativamente bajo, generando economías de escala.</p>
<p><strong>El dilema de producción vs. sustentabilidad:</strong> El BID advierte que transformar el potencial geológico en riqueza efectiva depende de marcos regulatorios, licencia social y cumplimiento ambiental. Esto introduce la idea de costos externos (externalidades negativas) que no siempre aparecen en los costos contables de las empresas productoras.</p>
<p><strong>Maximización del beneficio y el Estado:</strong> Una empresa minera maximiza su beneficio cuando IMg = CMg. Pero los costos ambientales (contaminación de acuíferos, impacto en comunidades) son costos sociales que la empresa no asume. Aquí aparece el rol regulador del Estado para corregir esta falla de mercado.</p>
`,
    quizId: 'quiz-news-6',
    quiz: {
      questions: [
        {
          text: 'El litio, como recurso natural del subsuelo argentino, corresponde al factor productivo denominado:',
          options: [
            'Capital (K)',
            'Trabajo (L)',
            'Tierra — recursos naturales',
            'Tecnología / Entrepreneurship'
          ],
          correct: 2,
          feedback: '¡Correcto! En la teoría de la producción, el factor "Tierra" incluye todos los recursos naturales: suelo, minerales, agua, energía, litio, etc. No se refiere solo a la tierra agrícola sino a todos los recursos provistos por la naturaleza.'
        },
        {
          text: 'Los altos costos de exploración e infraestructura para explotar el litio actúan principalmente como:',
          options: [
            'Costos variables que aumentan con la producción',
            'Costos marginales decrecientes',
            'Costos fijos que representan barreras de entrada al sector',
            'Costos medios totales en el corto plazo'
          ],
          correct: 2,
          feedback: 'Exacto. Las inversiones iniciales en exploración, infraestructura y plantas de procesamiento son costos fijos: no varían con la cantidad producida una vez instalados. Al ser tan elevados, actúan como barreras de entrada para nuevos competidores.'
        },
        {
          text: 'Cuando una empresa minera no considera el costo ambiental de su actividad en su cálculo de beneficio, se produce:',
          options: [
            'Una situación donde IMg = CMg correctamente',
            'Una externalidad negativa: el costo social real es mayor que el costo privado de la empresa',
            'Un caso de demanda elástica del mercado',
            'Una economía de escala positiva para toda la sociedad'
          ],
          correct: 1,
          feedback: '¡Muy bien! Las externalidades negativas ocurren cuando una empresa genera costos para terceros (sociedad, medio ambiente) que no están incluidos en su cálculo privado de costos. Esto lleva a que la empresa produzca más de lo socialmente óptimo, porque subestima el costo real de su producción.'
        }
      ]
    }
  }
];

// ─── LOGIN ─────────────────────────────────────────
// Base de alumnos: { APELLIDO_MAYUS: { clave, nombre, cursos:[...] } }
const STUDENTS_DB = {
  'GARCIA':    { clave: '40123456', nombre: 'Juan',   cursos: ['5°1'] },
  'RODRIGUEZ': { clave: '40234567', nombre: 'María',  cursos: ['5°1'] },
  'LOPEZ':     { clave: '40345678', nombre: 'Carlos', cursos: ['5°1'] },
  'MARTINEZ':  { clave: '40456789', nombre: 'Ana',    cursos: ['5°2'] },
  'GONZALEZ':  { clave: '40567890', nombre: 'Pedro',  cursos: ['5°2'] },
  // ← Agregar todos los alumnos acá y en Code.gs
};

// Usuarios especiales — docentes y directivos
const SPECIAL_USERS = {
  'MONTES DE OCA': { clave: '21548434', nombre: 'Prof.',  rol: 'Profesor',     isTeacher: true },
  'DIRECTOR':      { clave: 'director',      nombre: '',  rol: 'Director',     isTeacher: true },
  'VICEDIRECTORA': { clave: 'vicedirectora', nombre: '',  rol: 'Vicedirectora',isTeacher: true },
};

function doLogin() {
  const nombre   = (document.getElementById('nombre-inp')?.value || '').trim();
  const apellido = (document.getElementById('apellido-inp')?.value || '').trim().toUpperCase();
  const clave    = (document.getElementById('clave-inp')?.value || '').trim();
  const curso    = (document.getElementById('curso-sel')?.value || '');
  const err      = document.getElementById('login-error');

  if (!apellido || !clave || !curso) {
    err.style.display = 'block';
    err.textContent = 'Por favor completá todos los campos.';
    return;
  }
  err.style.display = 'none';

  // ── Acceso Prueba
  if (curso === 'prueba') {
    if (clave !== 'juana2026') {
      err.style.display = 'block';
      err.textContent = 'Contraseña de prueba incorrecta.';
      return;
    }
    currentUser = { apellido: 'PRUEBA', nombre: nombre || 'Usuaria', curso: 'Prueba', fullName: (nombre||'Usuaria')+' PRUEBA', isTeacher: false };
    loadProgress(); initApp(); return;
  }

  // ── Acceso Docente / Directivos
  if (curso === 'docente') {
    const apellidoNorm = apellido.replace(/\s+/g,' ').trim();
    const special = SPECIAL_USERS[apellidoNorm];
    if (!special || special.clave !== clave) {
      err.style.display = 'block';
      err.textContent = 'Credenciales de docente/directivo incorrectas.';
      return;
    }
    window.location.href = 'docente.html?auto='+encodeURIComponent(clave)+'&rol='+encodeURIComponent(apellidoNorm);
    return;
  }

  // ── Acceso Alumno — cualquier alumno entra con su DNI como contraseña
  if (!nombre) {
    err.style.display = 'block';
    err.textContent = 'Por favor ingresá tu nombre.';
    return;
  }
  if (!/^\d{7,8}$/.test(clave)) {
    err.style.display = 'block';
    err.textContent = 'La contraseña debe ser tu DNI (7 u 8 números, sin puntos ni espacios).';
    return;
  }
  currentUser = { apellido, nombre, curso, fullName: nombre + ' ' + apellido, isTeacher: false };
  loadProgress(); initApp();
}

function loadProgress() {
  const key = `progress_${currentUser.apellido}_${currentUser.curso}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    try { progress = JSON.parse(saved); } catch(e) {}
  }
}

function saveProgress() {
  const key = `progress_${currentUser.apellido}_${currentUser.curso}`;
  const data = Object.assign({ _nombre: currentUser.nombre }, progress);
  localStorage.setItem(key, JSON.stringify(data));
  // También llamar al Apps Script para persistir en Drive
  syncToSheet();
}

async function syncToSheet() {
  try {
    console.log('📡 Sincronizando con Firebase...', currentUser.apellido, currentUser.curso);
    const key = currentUser.apellido.replace(/[^a-zA-Z0-9]/g, '_') + '_' + currentUser.curso.replace(/[^a-zA-Z0-9]/g, '_');
    const url = FIREBASE_URL + '/students/' + key + '.json';
    const payload = {
      apellido: currentUser.apellido,
      nombre: currentUser.nombre,
      curso: currentUser.curso,
      timestamp: new Date().toISOString(),
      progress: progress
    };
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data && data.apellido) {
      console.log('✅ Sync OK — Firebase');
    } else {
      console.log('⚠️ Sync respuesta:', data);
    }
  } catch(e) {
    console.log('❌ Sync error:', e);
  }
}

// ─── INIT APP ──────────────────────────────────────
function initApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'block';

  document.getElementById('h-name').textContent = currentUser.nombre + ' ' + currentUser.apellido;
  document.getElementById('h-curso').textContent = currentUser.curso;
  document.getElementById('h-avatar').textContent = currentUser.apellido.charAt(0);

  buildSidebar();
  updateGlobalProgress();
  showSection('home');
}

// ─── SIDEBAR ───────────────────────────────────────
function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  let html = '';

  html += `<div class="sidebar-section-title">Inicio</div>`;
  html += `<div class="sidebar-item ${currentSection==='home'?'active':''}" onclick="showSection('home')">
    <span class="s-icon">🏠</span> Mi Progreso
  </div>`;

  CURRICULUM.forEach(unit => {
    html += `<div class="sidebar-section-title">${unit.title}</div>`;
    unit.sections.forEach(s => {
      const done = progress.readSections[s.id];
      html += `<div class="sidebar-item ${currentSection===s.id?'active':''}" onclick="showSection('${s.id}')">
        <span class="s-icon">📄</span> ${s.title}
        ${done ? '<span class="s-check">✓</span>' : ''}
      </div>`;
    });
    unit.quizzes.forEach(q => {
      const done = progress.quizScores[q.id];
      html += `<div class="sidebar-item ${currentSection===q.id?'active':''}" onclick="showSection('${q.id}')">
        <span class="s-icon">✏️</span> ${q.title.replace('Ejercitación — ','')}
        ${done ? `<span class="s-check">✓ ${done.score}/${done.total}</span>` : ''}
      </div>`;
    });
  });

  html += `<div class="sidebar-divider"></div>`;
  html += `<div class="sidebar-section-title">Noticias Económicas</div>`;
  NEWS.forEach(n => {
    const done = progress.newsRead[n.id];
    html += `<div class="sidebar-item ${currentSection===n.id?'active':''}" onclick="showSection('${n.id}')">
      <span class="s-icon">📰</span> ${n.title.substring(0,30)}…
      ${done ? '<span class="s-check">✓</span>' : ''}
    </div>`;
  });

  sidebar.innerHTML = html;
}

// ─── PROGRESS CALCULATION ──────────────────────────
function calcProgress() {
  let totalItems = 0, doneItems = 0;

  // Lecturas
  CURRICULUM.forEach(u => {
    u.sections.forEach(s => {
      totalItems++;
      if (progress.readSections[s.id]) doneItems++;
    });
    u.quizzes.forEach(q => {
      totalItems += q.questions.length;
      if (progress.quizScores[q.id]) {
        doneItems += progress.quizScores[q.id].score;
      }
    });
  });

  // Noticias (lectura + quiz)
  NEWS.forEach(n => {
    totalItems += 2;
    if (progress.newsRead[n.id]) doneItems++;
    if (progress.newsQuiz[n.id]) doneItems++;
  });

  const readPct = (() => {
    const rs = CURRICULUM.reduce((a,u) => a + u.sections.length, 0);
    const rd = Object.keys(progress.readSections).length;
    return rs > 0 ? Math.round(rd/rs*100) : 0;
  })();

  const quizPct = (() => {
    let total = 0, done = 0;
    CURRICULUM.forEach(u => u.quizzes.forEach(q => {
      total += q.questions.length;
      if (progress.quizScores[q.id]) done += progress.quizScores[q.id].score;
    }));
    NEWS.forEach(n => {
      total += n.quiz.questions.length;
      if (progress.newsQuiz[n.id]) done += progress.newsQuiz[n.id].score;
    });
    return total > 0 ? Math.round(done/total*100) : 0;
  })();

  const globalPct = totalItems > 0 ? Math.round(doneItems/totalItems*100) : 0;
  return { globalPct, readPct, quizPct };
}

function updateGlobalProgress() {
  const { globalPct, readPct, quizPct } = calcProgress();
  document.getElementById('global-fill').style.width = globalPct + '%';
  document.getElementById('global-pct').textContent = globalPct + '%';

  const level = LEVELS.reduce((best, l) => globalPct >= l.pct ? l : best, LEVELS[0]);
  document.getElementById('level-badge').textContent = level.label;

  if (globalPct >= 95) showCertificate();
}

// ─── CONTENT RENDERER ──────────────────────────────
function showSection(id) {
  currentSection = id;
  buildSidebar();
  const ca = document.getElementById('content-area');

  if (id === 'home') {
    ca.innerHTML = renderHome();
    return;
  }

  // Find section content
  for (const unit of CURRICULUM) {
    for (const s of unit.sections) {
      if (s.id === id) {
        ca.innerHTML = renderSection(s, unit);
        // Auto-marcar como leído tras 30 segundos en la sección
        if (!progress.readSections[id]) {
          clearTimeout(window._readTimer);
          window._readTimer = setTimeout(() => {
            progress.readSections[id] = true;
            saveProgress();
            updateGlobalProgress();
            buildSidebar();
            showSection(id);
          }, 30000);
        }
        ca.scrollTop = 0;
        return;
      }
    }
    for (const q of unit.quizzes) {
      if (q.id === id) {
        ca.innerHTML = renderQuiz(q);
        return;
      }
    }
  }

  // News
  for (const n of NEWS) {
    if (n.id === id) {
      ca.innerHTML = renderNews(n);
      return;
    }
    if (n.quizId === id) {
      ca.innerHTML = renderNewsQuiz(n);
      return;
    }
  }
}

function renderHome() {
  const { globalPct, readPct, quizPct } = calcProgress();
  const level = LEVELS.reduce((best, l) => globalPct >= l.pct ? l : best, LEVELS[0]);
  const nextLevel = LEVELS.find(l => l.pct > globalPct);

  let quizSummary = '';
  CURRICULUM.forEach(u => u.quizzes.forEach(q => {
    const r = progress.quizScores[q.id];
    if (r) {
      const pct = Math.round(r.score/r.total*100);
      const color = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--gold-dark)' : 'var(--red)';
      quizSummary += `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #EEF0F6;font-size:13px;">
        <span style="color:var(--text-mid)">${q.title.replace('Ejercitación — ','')}</span>
        <span style="font-weight:700;color:${color}">${r.score}/${r.total} (${pct}%)</span>
      </div>`;
    }
  }));

  return `
<div class="card" style="background:linear-gradient(135deg,#F5ECF9 0%,#EDD8F5 100%);border:1.5px solid var(--purple-pale);">
  <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
    <div style="flex:1;min-width:200px;">
      <div style="font-size:11px;font-weight:700;color:var(--purple-mid);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">📄 Material de estudio offline</div>
      <div style="font-size:15px;font-weight:600;color:var(--purple);">Cuadernillo de contenidos — EconoApp 2026</div>
      <div style="font-size:13px;color:var(--text-mid);margin-top:3px;">Todos los contenidos del programa en PDF para estudiar sin conexión.</div>
    </div>
    <a href="EconoApp_Contenidos_2026.pdf" download="EconoApp_Contenidos_2026.pdf"
       style="background:linear-gradient(135deg,var(--purple),var(--bordeaux-mid));color:white;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:8px;flex-shrink:0;box-shadow:0 4px 14px rgba(91,44,111,0.3);">
      ⬇ Descargar PDF
    </a>
  </div>
</div>
<div class="card">
  <div class="card-title">👋 ¡Hola, ${currentUser.nombre}!</div>
  <div class="card-subtitle">${currentUser.curso} · Micro & Macroeconomía</div>
  
  <div class="level-row">
    ${LEVELS.map(l => `<span class="level-pill ${globalPct >= l.pct ? 'done' : globalPct >= l.pct - 5 ? 'current' : 'locked'}">${l.label}</span>`).join('')}
  </div>

  <div class="progress-grid">
    <div class="mini-prog-card">
      <div class="mpc-label">📖 Lecturas completadas</div>
      <div class="mpc-value">${readPct}%</div>
      <div class="mpc-bar"><div class="mpc-bar-fill" style="width:${readPct}%;background:var(--navy-light)"></div></div>
    </div>
    <div class="mini-prog-card">
      <div class="mpc-label">✏️ Ejercitación</div>
      <div class="mpc-value">${quizPct}%</div>
      <div class="mpc-bar"><div class="mpc-bar-fill" style="width:${quizPct}%;background:var(--gold)"></div></div>
    </div>
  </div>

  ${nextLevel ? `<div style="background:#F0E8D4;border-radius:10px;padding:14px 18px;font-size:14px;color:var(--text-mid)">
    🎯 <strong>Próximo nivel:</strong> ${nextLevel.label} — necesitás llegar al ${nextLevel.pct}% de progreso total.
  </div>` : `<div style="background:var(--green-light);border-radius:10px;padding:14px 18px;font-size:14px;color:var(--green);font-weight:600">
    🏆 ¡Completaste el programa! Ya podés ver tu certificado.
  </div>`}
</div>

${quizSummary ? `<div class="card">
  <div class="card-title" style="font-size:18px">📊 Mis resultados de ejercitación</div>
  ${quizSummary}
</div>` : ''}

<div class="card">
  <div class="card-title" style="font-size:18px">🗺️ Contenidos del Programa</div>
  <div style="font-size:14px;color:var(--text-mid);margin-bottom:16px">Hacé clic en cualquier tema para comenzar a estudiar.</div>
  ${CURRICULUM.map(u => `
    <div style="margin-bottom:16px">
      <div style="font-weight:700;color:var(--navy);font-size:15px;margin-bottom:8px">${u.icon} ${u.title}</div>
      ${u.sections.map(s => `<div onclick="showSection('${s.id}')" style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:${progress.readSections[s.id]?'var(--green-light)':'var(--cream)'};border-radius:8px;margin-bottom:4px;cursor:pointer;font-size:13.5px;color:var(--text-mid)">
        ${progress.readSections[s.id] ? '✅' : '⚪'} ${s.title}
      </div>`).join('')}
    </div>
  `).join('')}
  <div style="margin-top:8px">
    <div style="font-weight:700;color:var(--navy);font-size:15px;margin-bottom:8px">📰 Noticias Económicas</div>
    ${NEWS.map(n => `<div onclick="showSection('${n.id}')" style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:${progress.newsRead[n.id]?'var(--green-light)':'var(--cream)'};border-radius:8px;margin-bottom:4px;cursor:pointer;font-size:13.5px;color:var(--text-mid)">
      ${progress.newsRead[n.id] ? '✅' : '⚪'} ${n.title.substring(0,50)}…
    </div>`).join('')}
  </div>
</div>`;
}

function renderSection(s, unit) {
  const isRead = progress.readSections[s.id];
  return `
<button class="btn-back" onclick="showSection('home')">← Volver al inicio</button>
<div class="card">
  <div style="font-size:12px;color:var(--text-light);margin-bottom:4px;letter-spacing:0.5px">${unit.icon} ${unit.title}</div>
  <div class="card-title">${s.title}</div>
  <div class="read-progress-row">
    <span class="read-label">Lectura:</span>
    <div class="read-prog-track"><div class="read-prog-fill" style="width:${isRead?100:0}%"></div></div>
    <span class="read-label">${isRead ? '✓ Completado' : 'En progreso'}</span>
  </div>
  <div class="content-text">${s.content}</div>
  <div style="margin-top:20px;padding:12px 16px;background:var(--green-light);border-radius:8px;color:var(--green);font-size:14px;font-weight:600">${isRead ? "✅ Sección completada" : "📖 Leyendo..."}</div>
</div>`;
}

function markRead(sectionId) {
  progress.readSections[sectionId] = true;
  saveProgress();
  updateGlobalProgress();
  showSection(sectionId);
  buildSidebar();
}

// ─── QUIZ RENDERER ─────────────────────────────────
function renderQuiz(q) {
  const prev = progress.quizScores[q.id];

  // Si ya lo hizo: mostrar resultado sin posibilidad de repetir
  if (prev) {
    const pct = Math.round(prev.score / prev.total * 100);
    const color = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--gold-dark)' : 'var(--red)';
    const bg    = pct >= 70 ? 'var(--green-light)' : pct >= 50 ? '#FFF8E8' : 'var(--red-light)';
    let html = `<button class="btn-back" onclick="showSection('home')">← Volver al inicio</button><div class="card">
      <div class="card-title">${q.title}</div>
      <div style="padding:16px 20px;background:${bg};border-radius:10px;margin-bottom:18px">
        <div style="font-size:18px;font-weight:700;color:${color}">
          ${pct >= 70 ? '✅' : pct >= 50 ? '⚠️' : '❌'} ${prev.score}/${prev.total} correctas (${pct}%)
        </div>
        <div style="font-size:12px;color:var(--text-light);margin-top:4px">
          Realizado el ${new Date(prev.date).toLocaleDateString('es-AR')} · Esta ejercitación ya fue completada y no puede repetirse.
        </div>
      </div>`;

    // Mostrar las preguntas con las respuestas del alumno (solo lectura)
    q.questions.forEach((qs, qi) => {
      const ans = prev.answers?.[qi];
      html += `<div class="quiz-question" style="opacity:0.85">
        <div class="q-text">${qi+1}. ${qs.text}</div>`;
      qs.options.forEach((opt, oi) => {
        let cls = 'quiz-option';
        let style = '';
        if (oi === qs.correct) { cls += ' correct'; }
        else if (ans && ans.selected === oi && oi !== qs.correct) { cls += ' wrong'; }
        html += `<div class="${cls}" style="pointer-events:none">
          <span class="opt-letter">${'ABCD'[oi]}</span> ${opt}
        </div>`;
      });
      if (ans) {
        const ok = ans.selected === qs.correct;
        html += `<div class="quiz-feedback show ${ok ? 'correct' : 'wrong'}">
          ${ok ? '✅' : '❌'} ${safeDecode(qs.feedback)}
        </div>`;
      }
      html += `</div>`;
    });
    html += `</div>`;
    return html;
  }

  // Primera vez: mostrar quiz interactivo
  let html = `<button class="btn-back" onclick="showSection('home')">← Volver al inicio</button><div class="card">
    <div class="card-title">${q.title}</div>
    <div class="card-subtitle">${q.questions.length} preguntas · Solo podés realizarlo una vez — respondé con atención.</div>`;

  q.questions.forEach((qs, qi) => {
    html += `<div class="quiz-question" id="qq-${q.id}-${qi}">
      <div class="q-text">${qi+1}. ${qs.text}</div>`;
    qs.options.forEach((opt, oi) => {
      html += `<div class="quiz-option" id="opt-${q.id}-${qi}-${oi}" onclick="selectOption('${q.id}',${qi},${oi},${qs.correct},'${encodeURIComponent(qs.feedback)}')">
        <span class="opt-letter">${'ABCD'[oi]}</span> ${opt}
      </div>`;
    });
    html += `<div class="quiz-feedback" id="fb-${q.id}-${qi}"></div>`;
    html += `</div>`;
  });

  html += `<button class="btn-check" id="btn-check-${q.id}" onclick="submitQuiz('${q.id}',${q.questions.length})" disabled>Corregir →</button>`;
  html += `</div>`;
  return html;
}

// Decode seguro — evita URIError con caracteres especiales en feedbacks
function safeDecode(str) {
  if (!str) return '';
  try { return decodeURIComponent(str); } catch(e) { return str; }
}

let quizState = {}; // { quizId: { qi: selectedOi } }

function selectOption(qid, qi, oi, correct, feedbackEnc) {
  if (!quizState[qid]) quizState[qid] = {};
  if (quizState[qid][qi] !== undefined) return; // already answered

  quizState[qid][qi] = oi;
  document.getElementById(`opt-${qid}-${qi}-${oi}`).classList.add('selected');

  // check if all answered
  const q = findQuiz(qid);
  if (q && Object.keys(quizState[qid]).length === q.questions.length) {
    document.getElementById(`btn-check-${qid}`).disabled = false;
  }
}

function submitQuiz(qid, total) {
  const q = findQuiz(qid);
  if (!q) return;
  let score = 0;
  const answers = {};

  q.questions.forEach((qs, qi) => {
    const sel = quizState[qid]?.[qi];
    answers[qi] = { selected: sel, correct: qs.correct };
    const fb = document.getElementById(`fb-${qid}-${qi}`);

    if (sel === qs.correct) {
      score++;
      document.getElementById(`opt-${qid}-${qi}-${sel}`).classList.remove('selected');
      document.getElementById(`opt-${qid}-${qi}-${sel}`).classList.add('correct');
      fb.className = 'quiz-feedback show correct';
      fb.innerHTML = '✅ Correcto. ' + safeDecode(qs.feedback);
    } else {
      if (sel !== undefined) {
        document.getElementById(`opt-${qid}-${qi}-${sel}`).classList.remove('selected');
        document.getElementById(`opt-${qid}-${qi}-${sel}`).classList.add('wrong');
      }
      document.getElementById(`opt-${qid}-${qi}-${qs.correct}`).classList.add('correct');
      fb.className = 'quiz-feedback show wrong';
      const respCorrecta = qs.options[qs.correct];
      fb.innerHTML = '❌ Incorrecto. La respuesta correcta es: <strong>' + respCorrecta + '</strong>. ' + safeDecode(qs.feedback);
    }
    // Disable all options
    qs.options.forEach((_,oi) => {
      const el = document.getElementById(`opt-${qid}-${qi}-${oi}`);
      if (el) el.onclick = null;
    });
  });

  progress.quizScores[qid] = { score, total, answers, date: new Date().toISOString() };
  saveProgress();
  updateGlobalProgress();
  buildSidebar();

  const btn = document.getElementById(`btn-check-${qid}`);
  const pct = Math.round(score/total*100);
  const msg = pct === 100 ? '🌟 ¡Perfecto!' : pct >= 70 ? '✅ ¡Muy bien!' : pct >= 50 ? '📚 Seguí estudiando' : '💪 Repasá el contenido';
  btn.outerHTML = `<div style="margin-top:20px;padding:16px 20px;border-radius:10px;background:${pct>=70?'var(--green-light)':'var(--red-light)'};color:${pct>=70?'var(--green)':'var(--red)'};font-size:16px;font-weight:700">
    ${msg} · ${score}/${total} correctas (${pct}%)
  </div>`;
}

function renderNews(n) {
  const isRead = progress.newsRead[n.id];
  return `
<button class="btn-back" onclick="showSection('home')">← Volver al inicio</button>
<div class="card">
  <div style="display:inline-block;background:var(--navy);color:var(--gold-light);font-size:11px;font-weight:600;letter-spacing:0.8px;padding:4px 12px;border-radius:4px;margin-bottom:14px;text-transform:uppercase">${n.tag}</div>
  <div class="card-title">${n.title}</div>
  <div class="card-subtitle">${n.date}</div>
  <div class="content-text">${n.content}</div>
  ${!isRead ? `<button class="btn-next" onclick="markNewsRead('${n.id}')">✓ Leído — ir a ejercitación →</button>` 
  : `<button class="btn-next" onclick="showSection('${n.quizId}')">📝 Ir a la ejercitación →</button>`}
</div>`;
}

function markNewsRead(newsId) {
  progress.newsRead[newsId] = true;
  saveProgress();
  updateGlobalProgress();
  buildSidebar();
  const n = NEWS.find(x => x.id === newsId);
  if (n) showSection(n.quizId);
}

function renderNewsQuiz(n) {
  const prev = progress.newsQuiz[n.id];
  const tempId = n.quizId;

  // Si ya lo hizo: mostrar resultado bloqueado
  if (prev) {
    const pct = Math.round(prev.score / prev.total * 100);
    const color = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--gold-dark)' : 'var(--red)';
    const bg    = pct >= 70 ? 'var(--green-light)' : pct >= 50 ? '#FFF8E8' : 'var(--red-light)';
    let html = `<button class="btn-back" onclick="showSection('${n.id}')">← Volver a la noticia</button><div class="card">
      <div style="display:inline-block;background:var(--navy);color:var(--gold-light);font-size:11px;font-weight:600;padding:4px 12px;border-radius:4px;margin-bottom:14px;text-transform:uppercase">${n.tag}</div>
      <div class="card-title">Ejercitación — ${n.title.substring(0,40)}…</div>
      <div style="padding:16px 20px;background:${bg};border-radius:10px;margin-bottom:18px">
        <div style="font-size:18px;font-weight:700;color:${color}">
          ${pct >= 70 ? '✅' : pct >= 50 ? '⚠️' : '❌'} ${prev.score}/${prev.total} correctas (${pct}%)
        </div>
        <div style="font-size:12px;color:var(--text-light);margin-top:4px">Esta ejercitación ya fue completada y no puede repetirse.</div>
      </div>`;
    n.quiz.questions.forEach((qs, qi) => {
      const ans = prev.answers?.[qi];
      html += `<div class="quiz-question" style="opacity:0.85"><div class="q-text">${qi+1}. ${qs.text}</div>`;
      qs.options.forEach((opt, oi) => {
        let cls = 'quiz-option';
        if (oi === qs.correct) cls += ' correct';
        else if (ans && ans.selected === oi) cls += ' wrong';
        html += `<div class="${cls}" style="pointer-events:none"><span class="opt-letter">${'ABCD'[oi]}</span> ${opt}</div>`;
      });
      if (ans) {
        const ok = ans.selected === qs.correct;
        html += `<div class="quiz-feedback show ${ok?'correct':'wrong'}">${ok?'✅':'❌'} ${safeDecode(qs.feedback)}</div>`;
      }
      html += `</div>`;
    });
    html += `</div>`;
    return html;
  }

  // Primera vez: interactivo
  let html = `<button class="btn-back" onclick="showSection('${n.id}')">← Volver a la noticia</button><div class="card">
    <div style="display:inline-block;background:var(--navy);color:var(--gold-light);font-size:11px;font-weight:600;padding:4px 12px;border-radius:4px;margin-bottom:14px;text-transform:uppercase">${n.tag}</div>
    <div class="card-title">Ejercitación — ${n.title.substring(0,40)}…</div>
    <div class="card-subtitle">Solo podés realizarlo una vez — respondé con atención.</div>`;

  n.quiz.questions.forEach((qs, qi) => {
    html += `<div class="quiz-question" id="qq-${tempId}-${qi}">
      <div class="q-text">${qi+1}. ${qs.text}</div>`;
    qs.options.forEach((opt, oi) => {
      html += `<div class="quiz-option" id="opt-${tempId}-${qi}-${oi}" onclick="selectNewsOption('${tempId}','${n.id}',${qi},${oi},${qs.correct},'${encodeURIComponent(qs.feedback)}',${n.quiz.questions.length})">
        <span class="opt-letter">${'ABCD'[oi]}</span> ${opt}
      </div>`;
    });
    html += `<div class="quiz-feedback" id="fb-${tempId}-${qi}"></div></div>`;
  });

  html += `<button class="btn-check" id="btn-check-${tempId}" onclick="submitNewsQuiz('${tempId}','${n.id}',${n.quiz.questions.length})" disabled>Corregir →</button></div>`;
  return html;
}

function selectNewsOption(qid, newsId, qi, oi, correct, feedbackEnc, total) {
  if (!quizState[qid]) quizState[qid] = {};
  if (quizState[qid][qi] !== undefined) return;
  quizState[qid][qi] = oi;
  document.getElementById(`opt-${qid}-${qi}-${oi}`).classList.add('selected');
  if (Object.keys(quizState[qid]).length === total) {
    document.getElementById(`btn-check-${qid}`).disabled = false;
  }
}

function submitNewsQuiz(qid, newsId, total) {
  const n = NEWS.find(x => x.id === newsId);
  if (!n) return;
  let score = 0;
  n.quiz.questions.forEach((qs, qi) => {
    const sel = quizState[qid]?.[qi];
    const fb = document.getElementById(`fb-${qid}-${qi}`);
    if (sel === qs.correct) {
      score++;
      document.getElementById(`opt-${qid}-${qi}-${sel}`).classList.add('correct');
      fb.className = 'quiz-feedback show correct';
      fb.innerHTML = '✅ Correcto. ' + safeDecode(qs.feedback);
    } else {
      if (sel !== undefined) document.getElementById(`opt-${qid}-${qi}-${sel}`).classList.add('wrong');
      document.getElementById(`opt-${qid}-${qi}-${qs.correct}`).classList.add('correct');
      fb.className = 'quiz-feedback show wrong';
      const respCorrecta = qs.options[qs.correct];
      fb.innerHTML = '❌ Incorrecto. La respuesta correcta es: <strong>' + respCorrecta + '</strong>. ' + safeDecode(qs.feedback);
    }
    qs.options.forEach((_,oi) => {
      const el = document.getElementById(`opt-${qid}-${qi}-${oi}`);
      if (el) el.onclick = null;
    });
  });
  progress.newsQuiz[newsId] = { score, total, answers: Object.fromEntries(n.quiz.questions.map((_,qi) => [qi, { selected: quizState[qid]?.[qi], correct: n.quiz.questions[qi].correct }])), date: new Date().toISOString() };
  saveProgress();
  updateGlobalProgress();
  buildSidebar();
  const pct = Math.round(score/total*100);
  const btn = document.getElementById(`btn-check-${qid}`);
  btn.outerHTML = `<div style="margin-top:20px;padding:16px 20px;border-radius:10px;background:${pct>=70?'var(--green-light)':'var(--red-light)'};color:${pct>=70?'var(--green)':'var(--red)'};font-size:16px;font-weight:700">
    ${pct>=70?'✅ ¡Excelente!':'💪 Repasá la noticia'} · ${score}/${total} correctas (${pct}%)
  </div>`;
}

// ─── CERTIFICATE ───────────────────────────────────
function showCertificate() {
  const overlay = document.getElementById('cert-overlay');
  if (!overlay.dataset.shown) {
    overlay.dataset.shown = '1';
    document.getElementById('cert-name').textContent = currentUser.nombre + ' ' + currentUser.apellido;
    const { globalPct, quizPct } = calcProgress();
    document.getElementById('cert-score').textContent = `Progreso total: ${globalPct}% · Rendimiento en ejercitación: ${quizPct}%`;
    document.getElementById('cert-badges').innerHTML = LEVELS.map(l =>
      `<span class="level-pill done">${l.label}</span>`).join('');
    overlay.classList.add('show');
  }
}

// ─── HELPERS ───────────────────────────────────────
function findQuiz(qid) {
  for (const u of CURRICULUM) {
    for (const q of u.quizzes) {
      if (q.id === qid) return q;
    }
  }
  return null;
}

// Allow Enter key on login
document.addEventListener('DOMContentLoaded', () => {
  const claveInp = document.getElementById('clave-inp');
  if (claveInp) claveInp.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
});
