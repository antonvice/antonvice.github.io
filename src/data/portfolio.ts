export type PortfolioProject = {
  title: string;
  href: string;
  stack: string;
  visibility: 'Public' | 'Private';
  category: string;
  summary: string;
  impact: string;
};

export type ResearchProject = {
  title: string;
  href: string;
  stack: string;
  status: 'Prototype' | 'Benchmark' | 'Paper' | 'System';
  theme: string;
  abstract: string;
  hypothesis: string;
  tested: string;
  discovered: string;
};

export const portfolioStats = [
  { label: 'visible repos audited', value: '112' },
  { label: 'selected builds', value: '31' },
  { label: 'research tracks', value: '14' },
  { label: 'missing public descriptions', value: '0' },
];

export const portfolioProjects: PortfolioProject[] = [
  {
    title: 'nlsh',
    href: 'https://github.com/antonvice/nlsh',
    stack: 'Go, local LLMs, CLI automation',
    visibility: 'Public',
    category: 'Developer Agents',
    summary:
      'A shell interceptor and local-AI command agent that catches mistyped commands, suggests corrected terminal actions, and can operate in agent mode from the CLI.',
    impact:
      'Turned an everyday terminal failure mode into an assistive workflow, combining command parsing, local model prompting, and executable automation loops.',
  },
  {
    title: 'zelflayer',
    href: 'https://github.com/antonvice/zelflayer',
    stack: 'Python, Faster Whisper, AppleScript, vector search',
    visibility: 'Public',
    category: 'Local AI Interfaces',
    summary:
      'A local macOS assistant that combines voice input, document retrieval, graph-style context, and AppleScript control.',
    impact:
      'Explored a privacy-preserving desktop assistant architecture where local context and OS automation are first-class capabilities.',
  },
  {
    title: 'systemtracker',
    href: 'https://github.com/antonvice/systemtracker',
    stack: 'Go, macOS, launchd, Docker, SSH',
    visibility: 'Public',
    category: 'Operations Tools',
    summary:
      'A native macOS operations HUD for scripts, launchd agents, Docker containers, SSH services, and remote jobs.',
    impact:
      'Condensed scattered local and remote runtime state into one practical control surface for daily engineering operations.',
  },
  {
    title: 'reposcanner',
    href: 'https://github.com/antonvice/reposcanner',
    stack: 'Python, static analysis, local-first tooling',
    visibility: 'Public',
    category: 'Developer Tools',
    summary:
      'A local-first repository scanner that converts codebases into structured summaries while keeping source private.',
    impact:
      'Created a repeatable way to understand unfamiliar repositories without uploading proprietary code to external services.',
  },
  {
    title: 'Crawfih',
    href: 'https://github.com/antonvice/Crawfih',
    stack: 'Python, code indexing, knowledge catalogs',
    visibility: 'Public',
    category: 'Developer Tools',
    summary:
      'A repository-to-knowledge-catalog tool for compact codebase understanding and fast project orientation.',
    impact:
      'Focused on making source trees searchable, summarizeable, and useful as downstream context for humans or AI agents.',
  },
  {
    title: 'Xlab-Jepa',
    href: 'https://github.com/antonvice/Xlab-Jepa',
    stack: 'Python, V-JEPA, robotics, planning',
    visibility: 'Private',
    category: 'Robotics Research',
    summary:
      'A Mac-first robotics scaffold for V-JEPA/V-JEPA2 latent world models, action-conditioned dynamics, planning, and SO-101 adaptation.',
    impact:
      'Connected representation learning ideas to concrete robot-data workflows and planning experiments.',
  },
  {
    title: 'taif',
    href: 'https://github.com/antonvice/taif',
    stack: 'Python, JAX, active inference, LeRobot',
    visibility: 'Private',
    category: 'Robotics Research',
    summary:
      'An active-inference framework for backprop-free generative world modeling, robotics benchmarking, and smolVLA/LeRobot experiments.',
    impact:
      'Built a testbed for comparing predictive world-model behavior against embodied control needs.',
  },
  {
    title: 'theplatform',
    href: 'https://github.com/antonvice/theplatform',
    stack: 'Python, robotics evaluation, safety metrics',
    visibility: 'Private',
    category: 'Robotics Evaluation',
    summary:
      'Aegis Certification Protocol platform for benchmarking robotic policies across safety, mechanical integrity, and mission success.',
    impact:
      'Framed robotics evaluation as a certification problem with explicit pass/fail evidence instead of informal demos.',
  },
  {
    title: 'eidon-hand-detector',
    href: 'https://github.com/antonvice/eidon-hand-detector',
    stack: 'Python, computer vision, robotics data QA',
    visibility: 'Private',
    category: 'Robotics Data',
    summary:
      'A POV video quality pipeline that detects hand presence, stability, lighting, and validity for robot-training data.',
    impact:
      'Moved dataset quality checks earlier in the robot learning pipeline so weak trajectories can be filtered before training.',
  },
  {
    title: 'lightrag-project',
    href: 'https://github.com/antonvice/lightrag-project',
    stack: 'Python, LightRAG, multimodal ingestion, APIs',
    visibility: 'Private',
    category: 'RAG Systems',
    summary:
      'A unified multimodal RAG server combining LightRAG with ingestion, indexing, web access, and API workflows.',
    impact:
      'Turned retrieval from a notebook technique into a service layer that can support applications and user-facing flows.',
  },
  {
    title: 'openai-hackathon',
    href: 'https://github.com/antonvice/openai-hackathon',
    stack: 'Python, Telegram data, conversational AI',
    visibility: 'Public',
    category: 'Personal AI',
    summary:
      'A personal AI doppelganger experiment trained around Telegram history for reflection and conversational simulation.',
    impact:
      'Explored how personal archives can become interactive memory systems while raising questions about identity, consent, and recall.',
  },
  {
    title: 'marketmaker',
    href: 'https://github.com/antonvice/marketmaker',
    stack: 'Python, Telegram bots, TON payments',
    visibility: 'Private',
    category: 'Telegram / TON',
    summary:
      'A Telegram betting and binary prediction-market bot with TON blockchain payments and dynamic market workflows.',
    impact:
      'Combined bot UX, payment rails, market-state management, and operational automation into a single product loop.',
  },
  {
    title: 'grably-uploader',
    href: 'https://github.com/antonvice/grably-uploader',
    stack: 'Go, TUS uploads, storage hooks',
    visibility: 'Private',
    category: 'Data Infrastructure',
    summary:
      'A Go upload backend using resumable upload hooks and Grably configuration models.',
    impact:
      'Built reliable large-file intake primitives for media-heavy data operations.',
  },
  {
    title: 'gdrive-worker',
    href: 'https://github.com/antonvice/gdrive-worker',
    stack: 'Python, DigitalOcean Spaces, signed URLs',
    visibility: 'Private',
    category: 'Data Infrastructure',
    summary:
      'A dashboard and upload worker for browsing, previewing, signing, and tracking large file uploads.',
    impact:
      'Made storage operations inspectable and supportable for nontrivial datasets and transfer workflows.',
  },
  {
    title: 'grably-datasets',
    href: 'https://github.com/antonvice/grably-datasets',
    stack: 'Python, exporters, dataset tooling',
    visibility: 'Private',
    category: 'Data Infrastructure',
    summary:
      'Data exporter and dataset tooling for project configurations, URL retrieval, summaries, and command-driven exports.',
    impact:
      'Created operational glue between raw collection systems and usable dataset artifacts.',
  },
  {
    title: 'Interview-Copilot',
    href: 'https://github.com/antonvice/Interview-Copilot',
    stack: 'HTML, Python, speech, LLMs',
    visibility: 'Public',
    category: 'Realtime AI UX',
    summary:
      'A local interview copilot that transcribes conversations and generates real-time suggestions in a web UI.',
    impact:
      'Tested a low-latency human-assistance loop where speech, context, and generated suggestions must stay synchronized.',
  },
  {
    title: 'StegaDNA',
    href: 'https://github.com/antonvice/StegaDNA',
    stack: 'Python, Mojo, steganography',
    visibility: 'Public',
    category: 'Security / Media',
    summary:
      'A hybrid steganography engine for robust digital watermarking across images, audio, and text.',
    impact:
      'Explored resilient information hiding as a practical response to provenance, watermarking, and media-authenticity problems.',
  },
  {
    title: 'ATLA',
    href: 'https://github.com/antonvice/ATLA',
    stack: 'C++, cellular automata, physics simulation',
    visibility: 'Public',
    category: 'Simulation',
    summary:
      'A cellular-automata physics engine simulating elemental interactions, heat transfer, and bending-style abilities.',
    impact:
      'Implemented a rule-based world where simple local interactions produce richer emergent dynamics.',
  },
  {
    title: 'handmade_transformer',
    href: 'https://github.com/antonvice/handmade_transformer',
    stack: 'Rust, transformers, from-scratch ML',
    visibility: 'Public',
    category: 'Model Internals',
    summary:
      'A tiny hand-crafted decoder-only transformer implementation inspired by Theia Vogel\'s explainer.',
    impact:
      'Used implementation from first principles to make attention, residual streams, and token prediction mechanics concrete.',
  },
  {
    title: 'PaperMaker',
    href: 'https://github.com/antonvice/PaperMaker',
    stack: 'Python, web dashboard, writing workflows',
    visibility: 'Public',
    category: 'Research Tooling',
    summary:
      'A managed workspace for writing, organizing, and archiving scientific papers.',
    impact:
      'Shaped paper-writing as an operational workflow with structure around drafts, project state, and archived artifacts.',
  },
];

export const researchProjects: ResearchProject[] = [
  {
    title: 'Xlab-Jepa',
    href: 'https://github.com/antonvice/Xlab-Jepa',
    stack: 'Python, V-JEPA/V-JEPA2, SO-101 robotics',
    status: 'Prototype',
    theme: 'Latent world models for manipulation',
    abstract:
      'A robotics research scaffold for testing whether latent video representations can support action-conditioned prediction and planning for manipulation tasks.',
    hypothesis:
      'A compact JEPA-style latent state can preserve enough task-relevant structure to guide planning without reconstructing every pixel.',
    tested:
      'Robot-video ingestion, representation checkpoints, action-conditioned dynamics loops, and SO-101 adaptation paths.',
    discovered:
      'The highest-leverage engineering work is not the model alone; data quality, action alignment, and evaluation harnesses decide whether latent planning is measurable.',
  },
  {
    title: 'taif',
    href: 'https://github.com/antonvice/taif',
    stack: 'JAX, active inference, LeRobot, smolVLA',
    status: 'Prototype',
    theme: 'Active inference for robot control',
    abstract:
      'A JAX active-inference framework exploring backprop-free generative world models and robotics benchmarks.',
    hypothesis:
      'Policy selection can be framed as minimizing expected prediction error or free-energy-like objectives instead of only imitating expert actions.',
    tested:
      'Generative state models, robotics benchmark adapters, and experiments around smolVLA/LeRobot-style embodied tasks.',
    discovered:
      'Active-inference framing is promising for interpretability, but benchmark design must make uncertainty and failure modes visible.',
  },
  {
    title: 'theplatform',
    href: 'https://github.com/antonvice/theplatform',
    stack: 'Python, robotics benchmarks, safety scoring',
    status: 'System',
    theme: 'Robotics certification',
    abstract:
      'A certification-oriented platform for evaluating robotic policies across safety, mechanical integrity, and mission success.',
    hypothesis:
      'Robotic policy evaluation becomes more useful when it produces audit-style evidence instead of isolated demo scores.',
    tested:
      'Scenario records, policy scoring dimensions, reporting structure, and certification-style pass/fail reasoning.',
    discovered:
      'Safety evaluation needs human-readable trace artifacts; aggregate metrics alone do not explain why a policy should be trusted.',
  },
  {
    title: 'eidon-hand-detector',
    href: 'https://github.com/antonvice/eidon-hand-detector',
    stack: 'Python, CV, egocentric video QA',
    status: 'System',
    theme: 'Training-data quality control',
    abstract:
      'A computer-vision pipeline for checking whether robot-training POV videos contain useful hand presence, stability, lighting, and validity signals.',
    hypothesis:
      'Filtering low-quality demonstration videos before training improves downstream robot learning more cheaply than trying to fix noisy data later.',
    tested:
      'Hand detection, lighting heuristics, stability checks, validity flags, and dataset triage workflows.',
    discovered:
      'Simple quality gates are powerful when they are placed early; they turn ambiguous dataset problems into actionable review queues.',
  },
  {
    title: 'M.A.N.D.A',
    href: 'https://github.com/antonvice/M.A.N.D.A',
    stack: 'Python, Mojo, Apple Silicon, state-space models',
    status: 'Prototype',
    theme: 'Neuroscience-inspired sequence dynamics',
    abstract:
      'A research prototype around Mamba-style active dynamics, state-space modeling, and accelerated local experimentation.',
    hypothesis:
      'State-space sequence models can offer a useful alternative to attention-heavy architectures for long-context dynamics and efficient local execution.',
    tested:
      'Python/Mojo implementation paths, Apple Silicon acceleration, and active-dynamics experiment scaffolding.',
    discovered:
      'Implementation ergonomics matter as much as theory when experimenting locally; fast iteration changes what can be investigated.',
  },
  {
    title: 'StegaDNA',
    href: 'https://github.com/antonvice/StegaDNA',
    stack: 'Python, Mojo, steganography, media processing',
    status: 'Prototype',
    theme: 'Robust digital watermarking',
    abstract:
      'A hybrid steganography engine for embedding and recovering watermark-like information across image, audio, and text media.',
    hypothesis:
      'Cross-media encoding strategies can make provenance signals more robust than single-format watermarking.',
    tested:
      'Payload encoding, media-specific embedding paths, recovery workflows, and performance-sensitive components.',
    discovered:
      'Robustness and perceptual invisibility are in tension; useful systems need explicit tradeoff controls rather than one universal embedding recipe.',
  },
  {
    title: 'ATLA',
    href: 'https://github.com/antonvice/ATLA',
    stack: 'C++, cellular automata, simulation',
    status: 'Prototype',
    theme: 'Emergent physical rules',
    abstract:
      'A cellular-automata simulation engine for elemental interactions, heat transfer, and rule-driven physical behavior.',
    hypothesis:
      'A small set of local rules can create expressive emergent behavior suitable for interactive simulation and game-like worlds.',
    tested:
      'Grid updates, elemental interaction rules, temperature propagation, and behavior combinations.',
    discovered:
      'Rule ordering and conservation assumptions shape the perceived physics; debugging emergence requires visual and numerical feedback together.',
  },
  {
    title: 'handmade_transformer',
    href: 'https://github.com/antonvice/handmade_transformer',
    stack: 'Rust, transformer internals',
    status: 'Prototype',
    theme: 'Model mechanics from first principles',
    abstract:
      'A compact Rust implementation of a decoder-only transformer designed to make attention and token prediction mechanics inspectable.',
    hypothesis:
      'Rebuilding a transformer in a low-level language clarifies architecture details that framework abstractions hide.',
    tested:
      'Token flow, attention blocks, residual connections, logits, and minimal inference structure.',
    discovered:
      'The core architecture is conceptually small, but correctness depends on careful tensor shape discipline and numerically boring details.',
  },
  {
    title: 'Distil-Whisper-Test-mps',
    href: 'https://github.com/antonvice/Distil-Whisper-Test-mps',
    stack: 'Python, Distil-Whisper, Apple MPS',
    status: 'Benchmark',
    theme: 'Local speech recognition performance',
    abstract:
      'A benchmark comparing Distil-Whisper speech-recognition implementations on Apple Silicon MPS and faster-whisper paths.',
    hypothesis:
      'Apple Silicon acceleration can make local speech transcription practical enough for real-time assistant workflows.',
    tested:
      'Model variants, runtime backends, inference speed, and implementation ergonomics on a MacBook-class device.',
    discovered:
      'Backend choice can dominate user experience; faster local transcription unlocks interaction designs that cloud-only latency makes awkward.',
  },
  {
    title: 'openai-hackathon',
    href: 'https://github.com/antonvice/openai-hackathon',
    stack: 'Python, Telegram exports, LLM personas',
    status: 'Prototype',
    theme: 'Personal memory systems',
    abstract:
      'A personal AI doppelganger experiment built around conversational history and reflective simulation.',
    hypothesis:
      'A personal archive can support a more grounded assistant persona when retrieval and conversational style are both modeled.',
    tested:
      'Telegram data preparation, memory retrieval, persona prompting, and interactive conversation loops.',
    discovered:
      'Personal AI systems quickly become social and ethical systems; memory quality, consent, and misrepresentation matter as much as model quality.',
  },
  {
    title: 'RAGonOBsidian',
    href: 'https://github.com/antonvice/RAGonOBsidian',
    stack: 'Python, Streamlit, embeddings, Obsidian',
    status: 'System',
    theme: 'Personal knowledge retrieval',
    abstract:
      'A retrieval app for chatting with an Obsidian vault using local notes as context.',
    hypothesis:
      'A personal note vault becomes more useful when it can be queried conversationally instead of searched only by filename or keyword.',
    tested:
      'Markdown ingestion, embedding retrieval, Streamlit UI, and answer generation over personal notes.',
    discovered:
      'Good answers depend on chunking and note hygiene; retrieval makes hidden structure in a personal archive very obvious.',
  },
  {
    title: 'GPT-3 paper implementation',
    href: 'https://github.com/antonvice/gpt-3_paper_implementation',
    stack: 'Python, PyTorch, transformers',
    status: 'Prototype',
    theme: 'Architecture reproduction',
    abstract:
      'A PyTorch implementation of GPT-3-style transformer architecture for language-model study.',
    hypothesis:
      'Implementing the architecture directly is the fastest way to understand scaling-era transformer design choices.',
    tested:
      'Transformer block composition, model configuration, training scaffolds, and paper-to-code translation.',
    discovered:
      'Paper reproduction exposes the gap between architectural diagrams and training reality: data, optimization, and compute dominate the practical system.',
  },
  {
    title: 'Modified DDP',
    href: 'https://github.com/antonvice/modified_DDP',
    stack: 'Python, PyTorch, diffusion models',
    status: 'Prototype',
    theme: 'Generative modeling',
    abstract:
      'An implementation of a modified deep diffusion process model for generative modeling experiments.',
    hypothesis:
      'Changing diffusion process details can reveal how denoising schedules and model assumptions affect generation quality.',
    tested:
      'Diffusion process structure, training loops, noise schedules, and generated sample behavior.',
    discovered:
      'Small algorithmic changes are hard to judge without strong evaluation rituals; visual inspection is useful but insufficient.',
  },
  {
    title: 'av-sonogenetics-paper',
    href: 'https://github.com/antonvice/av-sonogenetics-paper',
    stack: 'HTML, scientific writing, biointerfaces',
    status: 'Paper',
    theme: 'Synthetic bio-molecular interfaces',
    abstract:
      'A paper page exploring logic-gated protein mini-antennas for ultrasound-addressable neuromodulation and readout.',
    hypothesis:
      'Engineered molecular interfaces could support selective, noninvasive ultrasound interaction with neural systems.',
    tested:
      'Conceptual architecture, paper structure, explanatory diagrams, and scientific argumentation flow.',
    discovered:
      'For speculative biointerface work, clarity of assumptions is the product; readers need to see what is proposed, what is known, and what remains unproven.',
  },
];
