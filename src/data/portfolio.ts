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
      'This is the kind of tool I wanted myself: mess up a command, get a better one, and stay in the terminal.',
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
      'I wanted an assistant that could use my actual computer context without sending everything somewhere else.',
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
      'I got tired of checking five places to see what was running, so I put the useful state and controls in one place.',
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
      'I can get oriented in an unfamiliar repo without uploading somebody else’s private code to a service.',
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
      'Useful when I need to understand a repo quickly or hand better context to an AI tool.',
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
      'This was me trying to make world-model research less abstract and closer to robot data I could actually inspect.',
  },
  {
    title: 'taif',
    href: 'https://github.com/antonvice/taif',
    stack: 'Python, JAX, active inference, LeRobot',
    visibility: 'Private',
    category: 'Robotics Research',
    summary:
      'An active-inference testbed for backprop-free world models, robotics benchmarks, and smolVLA/LeRobot experiments.',
    impact:
      'I wanted somewhere concrete to compare what a world model predicts with what a robot actually needs to do.',
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
      'Robots need more than cool demos, so I worked on clearer pass/fail checks and reports.',
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
      'Bad training data is expensive. This catches weak trajectories before they reach the model.',
  },
  {
    title: 'lightrag-project',
    href: 'https://github.com/antonvice/lightrag-project',
    stack: 'Python, LightRAG, multimodal ingestion, APIs',
    visibility: 'Private',
    category: 'RAG Systems',
    summary:
      'A multimodal RAG server with ingestion, indexing, web access, and APIs.',
    impact:
      'Moved retrieval out of notebook-land and into something an app could actually call.',
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
      'A weird but useful experiment in what happens when your chat history becomes something you can talk to.',
  },
  {
    title: 'marketmaker',
    href: 'https://github.com/antonvice/marketmaker',
    stack: 'Python, Telegram bots, TON payments',
    visibility: 'Private',
    category: 'Telegram / TON',
    summary:
      'A Telegram betting and prediction-market bot with TON payments and changing market states.',
    impact:
      'It forced the chat experience, payments, changing odds, and boring operational details to work as one product.',
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
      'Large uploads fail in annoying ways. This made them resumable and much easier to trust.',
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
      'Made large upload/storage jobs easier to see, debug, and hand off.',
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
      'Turned messy collected data into exports people could actually use.',
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
      'The interesting part was timing: transcription, context, and suggestions all had to arrive while they were still useful.',
  },
  {
    title: 'StegaDNA',
    href: 'https://github.com/antonvice/StegaDNA',
    stack: 'Python, Mojo, steganography',
    visibility: 'Public',
    category: 'Security / Media',
    summary:
      'A hybrid steganography engine for watermarking images, audio, and text.',
    impact:
      'Tried different ways to hide and recover watermarks across media without making the media ugly.',
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
      'I like systems where a handful of local rules turn into behavior you did not explicitly script.',
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
      'Writing it from scratch made attention, residual streams, and next-token prediction feel real instead of diagram-shaped.',
  },
  {
    title: 'PaperMaker',
    href: 'https://github.com/antonvice/PaperMaker',
    stack: 'Python, web dashboard, paper writing',
    visibility: 'Public',
    category: 'Research Tooling',
    summary:
      'A managed workspace for writing, organizing, and archiving scientific papers.',
    impact:
      'Built the kind of paper workspace I wanted: drafts, state, and old versions in one place.',
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
      'Could a robot plan from a compact internal state without wasting effort rebuilding every pixel?',
    tested:
      'Robot video ingestion, saved representations, action-conditioned prediction, and paths toward the SO-101 arm.',
    discovered:
      'The model was only part of it. The data, action labels, and evaluation setup mattered just as much.',
  },
  {
    title: 'taif',
    href: 'https://github.com/antonvice/taif',
    stack: 'JAX, active inference, LeRobot, smolVLA',
    status: 'Prototype',
    theme: 'Active inference for robot control',
    abstract:
      'A JAX active-inference project for backprop-free world models and robotics benchmarks.',
    hypothesis:
      'Could a robot choose actions by reducing expected surprise instead of only copying expert demonstrations?',
    tested:
      'Generative state models, robotics benchmark adapters, and experiments around smolVLA/LeRobot-style embodied tasks.',
    discovered:
      'The framing made uncertainty easier to talk about, but only when the benchmark showed failures instead of hiding them in one score.',
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
      'A robot score is more useful when you can see why it passed or failed.',
    tested:
      'Scenario records, policy scoring dimensions, reporting structure, and certification-style pass/fail reasoning.',
    discovered:
      'One score is not enough. I need to be able to show a person what happened and why the robot passed or failed.',
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
      'Bad training videos should get caught early instead of quietly hurting the model later.',
    tested:
      'Hand detection, lighting checks, stability checks, validity flags, and review queues.',
    discovered:
      'Simple checks early in the pipeline make messy data much easier to clean.',
  },
  {
    title: 'M.A.N.D.A',
    href: 'https://github.com/antonvice/M.A.N.D.A',
    stack: 'Python, Mojo, Apple Silicon, state-space models',
    status: 'Prototype',
    theme: 'Neuroscience-inspired sequence dynamics',
    abstract:
      'A local playground for Mamba-style state-space models and faster experiments on Apple Silicon.',
    hypothesis:
      'State-space models might be a better fit than attention-heavy models for some long-context local experiments.',
    tested:
      'Python/Mojo implementation paths, Apple Silicon acceleration, and active-dynamics experiment scaffolding.',
    discovered:
      'Fast iteration changes the questions I am willing to try. A beautiful theory is not much fun if every experiment is painful to run.',
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
      'A watermark is more useful if it can survive more than one media format.',
    tested:
      'Payload encoding, media-specific embedding, recovery, and speed-sensitive pieces.',
    discovered:
      'The hard part is balancing strength and invisibility. One setting does not fit every file.',
  },
  {
    title: 'ATLA',
    href: 'https://github.com/antonvice/ATLA',
    stack: 'C++, cellular automata, simulation',
    status: 'Prototype',
    theme: 'Emergent physical rules',
    abstract:
      'A cellular-automata world where elements spread heat, interact, and produce physics-like behavior from local rules.',
    hypothesis:
      'How much of a convincing little world can come from a small set of local rules?',
    tested:
      'Grid updates, elemental interaction rules, temperature propagation, and behavior combinations.',
    discovered:
      'Rule order changes the whole feel of the world. I needed to watch it and measure it because either view alone could lie.',
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
      'Building it in Rust forced me to actually understand the pieces instead of hiding behind a library.',
    tested:
      'Token flow, attention blocks, residual connections, logits, and minimal inference structure.',
    discovered:
      'The idea is simple enough; the annoying details are tensor shapes and numerical correctness.',
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
      'Fast local transcription changes what kinds of voice tools are worth building.',
    tested:
      'Different model versions and runtimes on a MacBook, with a focus on speed and how annoying each setup was to use.',
    discovered:
      'The runtime mattered as much as the model. Once transcription became fast enough, voice interfaces stopped feeling like a waiting room.',
  },
  {
    title: 'openai-hackathon',
    href: 'https://github.com/antonvice/openai-hackathon',
    stack: 'Python, Telegram exports, LLM personas',
    status: 'Prototype',
    theme: 'Personal memory',
    abstract:
      'A personal AI doppelganger experiment built around conversational history and reflective simulation.',
    hypothesis:
      'Would an assistant feel more like me if it could retrieve my actual conversational history, not just imitate my tone?',
    tested:
      'Telegram data preparation, memory retrieval, persona prompting, and interactive conversation loops.',
    discovered:
      'The model is not the whole issue. Memory quality, consent, and weird identity questions show up fast.',
  },
  {
    title: 'RAGonOBsidian',
    href: 'https://github.com/antonvice/RAGonOBsidian',
    stack: 'Python, Streamlit, embeddings, Obsidian',
    status: 'System',
    theme: 'Personal knowledge retrieval',
    abstract:
      'A way to talk to my Obsidian vault while keeping my own notes as the source of truth.',
    hypothesis:
      'A personal note vault becomes more useful when it can be queried conversationally instead of searched only by filename or keyword.',
    tested:
      'Markdown ingestion, embedding retrieval, Streamlit UI, and answer generation over personal notes.',
    discovered:
      'A chat box cannot rescue badly organized notes. Retrieval made every weak title, giant note, and missing connection obvious.',
  },
  {
    title: 'GPT-3 paper implementation',
    href: 'https://github.com/antonvice/gpt-3_paper_implementation',
    stack: 'Python, PyTorch, transformers',
    status: 'Prototype',
    theme: 'Architecture reproduction',
    abstract:
      'A PyTorch implementation of a GPT-3-style transformer for learning how the model works.',
    hypothesis:
      'Writing the model directly taught me more than only reading the paper.',
    tested:
      'Transformer block composition, model configuration, training scaffolds, and paper-to-code translation.',
    discovered:
      'The architecture diagram is the easy part. Data, optimization, and compute are where the real system starts fighting back.',
  },
  {
    title: 'Modified DDP',
    href: 'https://github.com/antonvice/modified_DDP',
    stack: 'Python, PyTorch, diffusion models',
    status: 'Prototype',
    theme: 'Generative modeling',
    abstract:
      'My implementation of a modified diffusion process so I could poke at the denoising loop directly.',
    hypothesis:
      'What actually changes when I alter the noise schedule and some of the assumptions inside the diffusion process?',
    tested:
      'Diffusion process structure, training loops, noise schedules, and generated sample behavior.',
    discovered:
      'Looking at samples was useful and also dangerously easy to fool myself with. Small changes needed a more consistent evaluation.',
  },
  {
    title: 'av-sonogenetics-paper',
    href: 'https://github.com/antonvice/av-sonogenetics-paper',
    stack: 'HTML, scientific writing, biointerfaces',
    status: 'Paper',
    theme: 'Synthetic bio-molecular interfaces',
    abstract:
      'A speculative paper about tiny protein “antennas” that could make ultrasound-based neuromodulation more targeted.',
    hypothesis:
      'Could tiny engineered bio-interfaces make ultrasound control more targeted and less invasive?',
    tested:
      'The idea, paper structure, diagrams, and how clearly the argument reads.',
    discovered:
      'With speculative biology, clarity is the work. I had to separate what I was proposing from what is known and what is still completely unproven.',
  },
];
