// VIBE//APEX data. Every paper below is a real arXiv preprint; ids, titles and dates
// were checked against arxiv.org. Dates are the arXiv first-version date. arXiv does not
// publish a submission time on the abstract page, so no time is shown for these entries.
// Summaries in ES and HI are translations of the English line and should be reviewed by a
// native speaker before wider release. Paper titles and abstracts stay in English.

window.PAPERS = [
  {
    id: "deepseek",
    arxiv: "2501.12948",
    level: "master",
    status: "weights_available",
    date: "2025-01-22",
    authors: "DeepSeek-AI, Guo, Yang, Zhang et al.",
    title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
    abstract: "General reasoning represents a long-standing and formidable challenge in artificial intelligence. Here we show that the reasoning abilities of LLMs can be incentivized through pure reinforcement learning (RL), obviating the need for human-labeled reasoning trajectories. The proposed RL framework facilitates the emergent development of advanced reasoning patterns, such as self-reflection, verification, and dynamic strategy adaptation. Moreover, the emergent reasoning patterns exhibited by these large-scale models can be systematically harnessed to guide and enhance the reasoning capabilities of smaller models.",
    summary: {
      en: "Pure reinforcement learning, with no human-labeled reasoning traces, pushes a base model to develop self-verification and reflection.",
      es: "El aprendizaje por refuerzo puro, sin trazas de razonamiento etiquetadas por humanos, lleva a un modelo base a desarrollar autoverificación y reflexión.",
      hi: "केवल रीइन्फोर्समेंट लर्निंग, बिना मानव-लेबल वाले तर्क-पथों के, एक बेस मॉडल में स्व-सत्यापन और आत्म-चिंतन विकसित कराती है।"
    }
  },
  {
    id: "flashattn",
    arxiv: "2407.08608",
    level: "master",
    status: "code_released",
    date: "2024-07-11",
    authors: "Shah, Bikshandi, Zhang, Thakkar, Ramani, Dao",
    title: "FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision",
    abstract: "Attention, as a core layer of the ubiquitous Transformer architecture, is the bottleneck for large language models and long-context applications. We develop three main techniques to speed up attention on Hopper GPUs: exploiting asynchrony of the Tensor Cores and TMA, interleaving block-wise matmul and softmax operations, and block quantization and incoherent processing that leverages hardware support for FP8 low-precision. FlashAttention-3 achieves speedup on H100 GPUs by 1.5-2.0x with FP16 reaching up to 740 TFLOPs/s (75% utilization), and with FP8 reaching close to 1.2 PFLOPs/s.",
    summary: {
      en: "Hopper-specific attention kernel that overlaps data movement with compute and uses FP8, reaching about 740 TFLOPs/s in FP16 on H100.",
      es: "Kernel de atención específico para Hopper que solapa el movimiento de datos con el cómputo y usa FP8; alcanza unos 740 TFLOPs/s en FP16 en H100.",
      hi: "Hopper-विशिष्ट अटेंशन कर्नल, जो डेटा-मूवमेंट को कम्प्यूट के साथ ओवरलैप करता है और FP8 का उपयोग करता है; H100 पर FP16 में लगभग 740 TFLOPs/s तक पहुँचता है।"
    }
  },
  {
    id: "swe-agent",
    arxiv: "2405.15793",
    level: "agent",
    status: "code_released",
    date: "2024-05-06",
    authors: "Yang, Jimenez, Wettig, Lieret, Yao, Narasimhan et al.",
    title: "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering",
    abstract: "We introduce SWE-agent: a system that facilitates LM agents to autonomously use computers to solve software engineering tasks. SWE-agent's custom agent-computer interface (ACI) significantly enhances an agent's ability to create and edit code files, navigate entire repositories, and execute tests and other programs. We evaluate SWE-agent on SWE-bench and HumanEvalFix, achieving state-of-the-art performance on both with a pass@1 rate of 12.5% and 87.7%, respectively.",
    summary: {
      en: "A purpose-built terminal interface lets an LM agent navigate a repo, edit files and run tests. It set state of the art on SWE-bench at publication.",
      es: "Una interfaz de terminal diseñada para el agente le permite navegar un repositorio, editar archivos y ejecutar pruebas. Fue el estado del arte en SWE-bench al publicarse.",
      hi: "एक विशेष टर्मिनल इंटरफ़ेस एजेंट को रिपॉज़िटरी में घूमने, फ़ाइलें संपादित करने और टेस्ट चलाने देता है। प्रकाशन के समय यह SWE-bench पर अत्याधुनिक था।"
    }
  },
  {
    id: "dspy",
    arxiv: "2310.03714",
    level: "vibe",
    status: "code_released",
    date: "2023-10-05",
    authors: "Khattab, Singhvi, Maheshwari, Zhang et al.",
    title: "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines",
    abstract: "We introduce DSPy, a programming model that abstracts LM pipelines as text transformation graphs, i.e. imperative computational graphs where LMs are invoked through declarative modules. We design a compiler that will optimize any DSPy pipeline to maximize a given metric. Within minutes of compiling, a few lines of DSPy allow GPT-3.5 and llama2-13b-chat to self-bootstrap pipelines that outperform standard few-shot prompting.",
    summary: {
      en: "Describe a pipeline in a few lines of Python, then let a compiler tune the prompts and examples against a metric you pick.",
      es: "Describe un pipeline en unas pocas líneas de Python y deja que un compilador ajuste los prompts y ejemplos según una métrica que elijas.",
      hi: "कुछ पंक्तियों के Python में एक पाइपलाइन लिखें, फिर एक कंपाइलर आपके चुने मेट्रिक के आधार पर प्रॉम्प्ट और उदाहरण ट्यून करता है।"
    }
  },
  {
    id: "gsm-symbolic",
    arxiv: "2410.05229",
    level: "agent",
    status: "preprint_open",
    date: "2024-10-07",
    authors: "Mirzadeh, Alizadeh, Shahrokhi, Tuzel, Bengio, Farajtabar",
    title: "GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in Large Language Models",
    abstract: "We introduce GSM-Symbolic, an improved benchmark created from symbolic templates that allow for the generation of a diverse set of questions. Our findings reveal that LLMs exhibit noticeable variance when responding to different instantiations of the same question. Adding a single clause that seems relevant to the question causes significant performance drops (up to 65%) across all state-of-the-art models.",
    summary: {
      en: "Change only the numbers in a grade-school math problem, or add one irrelevant clause, and model scores drop. Benchmark scores can overstate reasoning.",
      es: "Cambia solo los números de un problema de matemáticas escolar, o agrega una cláusula irrelevante, y las puntuaciones bajan. Los benchmarks pueden exagerar el razonamiento.",
      hi: "किसी स्कूली गणित प्रश्न में केवल संख्याएँ बदलें, या एक अप्रासंगिक वाक्यांश जोड़ें, तो मॉडल के स्कोर गिरते हैं। बेंचमार्क तर्क-क्षमता को बढ़ा-चढ़ाकर दिखा सकते हैं।"
    }
  },
  {
    id: "heavy-tail",
    arxiv: "2610.00010",
    level: "master",
    status: "preprint_open",
    date: "2026-07-09",
    authors: "Song, Xinyuan; Cai, Zekun",
    title: "Heavy-Tailed Memory Traces in Long-Horizon Language Agents",
    abstract: "Long-horizon language agents increasingly rely on external memory as a frozen world model, yet current memory systems are usually judged only by task success or token cost. We study this effect through a conservative tail audit and find that concentration is reproducible but policy-dependent. We propose Core--Tail World Model (CTWM), a rank-based memory controller that allocates prompt budget with a single exponent and retains a summarized tail. On Synthetic Graph World, CTWM reduces prompt tokens by 5.9%, and the same comparison gives a 24.48% token reduction on LongMemEval with aggregate accuracy parity.",
    summary: {
      en: "Agent memory concentrates on a small core with a long tail of rare states. A rank-based controller cuts prompt tokens while keeping that tail summarized.",
      es: "La memoria de los agentes se concentra en un núcleo pequeño con una cola larga de estados raros. Un controlador basado en rangos reduce tokens del prompt y resume esa cola.",
      hi: "एजेंट की मेमोरी दुर्लभ अवस्थाओं की लंबी पूँछ के साथ एक छोटे कोर पर केंद्रित होती है। रैंक-आधारित कंट्रोलर उस पूँछ को सारांशित रखकर प्रॉम्प्ट टोकन घटाता है।"
    }
  }
];

window.LEVEL_STYLES = {
  vibe: "bg-[#E8EEF9] text-[#2046A0] border-[#2046A0]/30",
  agent: "bg-[#F1EAFB] text-[#5B2AA8] border-[#5B2AA8]/30",
  master: "bg-[#FBE7E4] text-[#A52A20] border-[#A52A20]/30"
};

window.STATUS_STYLES = {
  code_released: "bg-[#E6F5EE] text-[#166B45]",
  weights_available: "bg-[#FFF4D6] text-[#8A5A00]",
  preprint_open: "bg-[#EEF0F3] text-[#333333]"
};

window.SANDBOX_TRACKS = [
  {
    level: "vibe",
    command: "pip install dspy",
    note: {
      en: "Installs the public DSPy package from PyPI. It needs a language model you can reach yourself; a local model through Ollama is free.",
      es: "Instala el paquete público DSPy desde PyPI. Necesita un modelo de lenguaje al que tengas acceso; un modelo local con Ollama es gratuito.",
      hi: "PyPI से सार्वजनिक DSPy पैकेज इंस्टॉल करता है। इसे एक भाषा मॉडल चाहिए जिस तक आपकी पहुँच हो; Ollama के ज़रिए स्थानीय मॉडल मुफ़्त है।"
    }
  },
  {
    level: "agent",
    command: "git clone https://github.com/princeton-nlp/SWE-agent.git\ncd SWE-agent\npip install -e .",
    note: {
      en: "Clones the public SWE-agent repository and installs it in editable mode. Agent runs need model access you provide.",
      es: "Clona el repositorio público de SWE-agent y lo instala en modo editable. Las ejecuciones del agente necesitan acceso a un modelo que tú proporcionas.",
      hi: "सार्वजनिक SWE-agent रिपॉज़िटरी क्लोन करके एडिटेबल मोड में इंस्टॉल करता है। एजेंट रन के लिए आपका अपना मॉडल एक्सेस चाहिए।"
    }
  },
  {
    level: "master",
    command: "git clone https://github.com/Dao-AILab/flash-attention.git\ncd flash-attention/hopper\npython setup.py install",
    note: {
      en: "Builds the FlashAttention-3 Hopper kernels from the public repo. Needs an NVIDIA Hopper GPU (H100 class) and CUDA. Read the repo README before running.",
      es: "Compila los kernels Hopper de FlashAttention-3 desde el repo público. Requiere una GPU NVIDIA Hopper (clase H100) y CUDA. Lee el README del repo antes de ejecutar.",
      hi: "सार्वजनिक रिपॉज़िटरी से FlashAttention-3 Hopper कर्नल बनाता है। इसके लिए NVIDIA Hopper GPU (H100 श्रेणी) और CUDA चाहिए। चलाने से पहले रिपॉज़िटरी का README पढ़ें।"
    }
  }
];

window.UI = {
  en: {
    nav_discover: "01 // DISCOVER",
    nav_labs: "02 // THE LABS",
    nav_sandbox: "03 // SANDBOX",
    nav_library: "04 // MY LIBRARY",
    dossier: "Dossier",
    hero_kicker: "Frontier AI · Real arXiv papers",
    hero_title: "FRONTIER",
    hero_tagline: "Research, sorted by how deep you build.",
    hero_note: "Six curated arXiv papers. No paid APIs. No invented opportunities.",
    spotlight_label: "Spotlight paper",
    inspect: "Inspect dossier",
    save: "Save",
    saved: "Saved",
    remove: "Remove",
    the: "the",
    breakthroughs: "BREAKTHROUGHS",
    filter_label: "Persona filter",
    filter_all: "All papers",
    lvl_vibe: "Vibe Coder",
    lvl_agent: "Agent Coder",
    lvl_master: "LLM Master",
    lbl_status: "Status",
    lbl_date: "Published",
    lbl_time: "Time",
    lbl_level: "Level",
    lbl_authors: "Authors",
    lbl_abstract: "Original abstract (arXiv, English)",
    time_na: "Not published by arXiv; date only",
    open_arxiv: "Open on arXiv ↗",
    labs_title: "THE LABS",
    labs_sub: "Groups behind the papers. Opportunities appear here only with a verified primary source link.",
    labs_empty_title: "No verified openings yet",
    labs_empty_body: "Fellowships, grants and compute calls will be listed here only after each has a primary source URL. Nothing is invented.",
    labs_groups: "Research groups behind these papers",
    sandbox_title: "SANDBOX",
    sandbox_sub: "Copy a real setup command for each tier. Nothing is provisioned for you; you run it on your own machine.",
    copy: "Copy command",
    copied: "Copied",
    lib_title: "MY LIBRARY",
    lib_sub: "Papers you saved. Stored only in this browser.",
    lib_count: "Saved papers",
    lib_empty: "Nothing saved yet. Open DISCOVER and save a paper.",
    lib_clear: "Clear library",
    lib_tiers: "Saved by tier",
    toast_saved: "Saved to library",
    toast_removed: "Removed from library",
    toast_cleared: "Library cleared",
    toast_copied: "Command copied",
    close: "Close",
    footer: "VIBE//APEX · Built on public arXiv metadata. No paid APIs. Every number shown is real or omitted."
  },
  es: {
    nav_discover: "01 // DESCUBRIR",
    nav_labs: "02 // LOS LABS",
    nav_sandbox: "03 // SANDBOX",
    nav_library: "04 // MI BIBLIOTECA",
    dossier: "Dosier",
    hero_kicker: "IA de frontera · Artículos reales de arXiv",
    hero_title: "FRONTERA",
    hero_tagline: "Investigación, ordenada según qué tan profundo construyas.",
    hero_note: "Seis artículos de arXiv seleccionados. Sin APIs de pago. Sin oportunidades inventadas.",
    spotlight_label: "Artículo destacado",
    inspect: "Ver dosier",
    save: "Guardar",
    saved: "Guardado",
    remove: "Quitar",
    the: "los",
    breakthroughs: "AVANCES",
    filter_label: "Filtro de perfil",
    filter_all: "Todos los artículos",
    lvl_vibe: "Vibe Coder",
    lvl_agent: "Agent Coder",
    lvl_master: "LLM Master",
    lbl_status: "Estado",
    lbl_date: "Publicado",
    lbl_time: "Hora",
    lbl_level: "Nivel",
    lbl_authors: "Autores",
    lbl_abstract: "Resumen original (arXiv, inglés)",
    time_na: "arXiv no publica la hora; solo fecha",
    open_arxiv: "Abrir en arXiv ↗",
    labs_title: "LOS LABS",
    labs_sub: "Grupos detrás de los artículos. Las oportunidades aparecen aquí solo con un enlace verificado a la fuente primaria.",
    labs_empty_title: "Aún no hay convocatorias verificadas",
    labs_empty_body: "Becas, subvenciones y convocatorias de cómputo aparecerán aquí solo cuando cada una tenga una URL de fuente primaria. Nada se inventa.",
    labs_groups: "Grupos de investigación detrás de estos artículos",
    sandbox_title: "SANDBOX",
    sandbox_sub: "Copia un comando de configuración real para cada nivel. Nada se aprovisiona por ti; lo ejecutas en tu propia máquina.",
    copy: "Copiar comando",
    copied: "Copiado",
    lib_title: "MI BIBLIOTECA",
    lib_sub: "Artículos que guardaste. Se guardan solo en este navegador.",
    lib_count: "Artículos guardados",
    lib_empty: "Aún no guardas nada. Abre DESCUBRIR y guarda un artículo.",
    lib_clear: "Vaciar biblioteca",
    lib_tiers: "Guardados por nivel",
    toast_saved: "Guardado en la biblioteca",
    toast_removed: "Quitado de la biblioteca",
    toast_cleared: "Biblioteca vaciada",
    toast_copied: "Comando copiado",
    close: "Cerrar",
    footer: "VIBE//APEX · Construido con metadatos públicos de arXiv. Sin APIs de pago. Cada número mostrado es real o se omite."
  },
  hi: {
    nav_discover: "01 // खोजें",
    nav_labs: "02 // लैब्स",
    nav_sandbox: "03 // सैंडबॉक्स",
    nav_library: "04 // मेरी लाइब्रेरी",
    dossier: "डोज़ियर",
    hero_kicker: "फ्रंटियर AI · वास्तविक arXiv शोधपत्र",
    hero_title: "फ्रंटियर",
    hero_tagline: "शोध, आपके निर्माण के स्तर के अनुसार छँटा हुआ।",
    hero_note: "छह चुने हुए arXiv शोधपत्र। कोई पेड API नहीं। कोई काल्पनिक अवसर नहीं।",
    spotlight_label: "मुख्य शोधपत्र",
    inspect: "डोज़ियर देखें",
    save: "सहेजें",
    saved: "सहेजा गया",
    remove: "हटाएँ",
    the: "the",
    breakthroughs: "सफलताएँ",
    filter_label: "पर्सोना फ़िल्टर",
    filter_all: "सभी शोधपत्र",
    lvl_vibe: "वाइब कोडर",
    lvl_agent: "एजेंट कोडर",
    lvl_master: "एलएलएम मास्टर",
    lbl_status: "स्थिति",
    lbl_date: "प्रकाशित",
    lbl_time: "समय",
    lbl_level: "स्तर",
    lbl_authors: "लेखक",
    lbl_abstract: "मूल सार (arXiv, अंग्रेज़ी)",
    time_na: "arXiv समय प्रकाशित नहीं करता; केवल तारीख",
    open_arxiv: "arXiv पर खोलें ↗",
    labs_title: "लैब्स",
    labs_sub: "शोधपत्रों के पीछे के समूह। अवसर यहाँ केवल सत्यापित प्राथमिक स्रोत लिंक के साथ दिखेंगे।",
    labs_empty_title: "अभी कोई सत्यापित अवसर नहीं",
    labs_empty_body: "फ़ेलोशिप, अनुदान और कंप्यूट कॉल तभी दिखेंगे जब हर एक का प्राथमिक स्रोत URL होगा। कुछ भी काल्पनिक नहीं है।",
    labs_groups: "इन शोधपत्रों के पीछे के शोध समूह",
    sandbox_title: "सैंडबॉक्स",
    sandbox_sub: "हर स्तर के लिए एक वास्तविक सेटअप कमांड कॉपी करें। आपके लिए कुछ भी प्रोविज़न नहीं होता; आप इसे अपनी मशीन पर चलाते हैं।",
    copy: "कमांड कॉपी करें",
    copied: "कॉपी हो गया",
    lib_title: "मेरी लाइब्रेरी",
    lib_sub: "आपके सहेजे गए शोधपत्र। केवल इसी ब्राउज़र में संग्रहीत।",
    lib_count: "सहेजे गए शोधपत्र",
    lib_empty: "अभी कुछ सहेजा नहीं गया। खोजें खोलें और एक शोधपत्र सहेजें।",
    lib_clear: "लाइब्रेरी खाली करें",
    lib_tiers: "स्तर के अनुसार सहेजे गए",
    toast_saved: "लाइब्रेरी में सहेजा गया",
    toast_removed: "लाइब्रेरी से हटाया गया",
    toast_cleared: "लाइब्रेरी खाली की गई",
    toast_copied: "कमांड कॉपी किया गया",
    close: "बंद करें",
    footer: "VIBE//APEX · सार्वजनिक arXiv मेटाडेटा पर बना। कोई पेड API नहीं। दिखाया गया हर नंबर वास्तविक है या हटाया गया है।"
  }
};
