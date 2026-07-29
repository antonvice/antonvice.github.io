# The End of Model Fragmentation: A Unified Cognitive Architecture Based on First Principles

I opened a model picker to ask a question and found myself taking an exam about the question before I was allowed to ask it.

Which model? How much thinking? Is this a Medium problem or an Extra High problem? Will Standard be enough, or do I need Extended? Am I about to waste ten minutes and a small pile of tokens, or ruin the answer because I chose the cheap button?

This is annoying. More importantly, it is an architecture problem disguised as user choice.

OpenAI's current [GPT-5.6 family contains Sol, Terra, and Luna](https://openai.com/index/gpt-5-6/). Its June 2026 ChatGPT picker then exposes modes including [Instant, Medium, High, Extra High, Pro Standard, and Pro Extended](https://help.openai.com/en/articles/6825453-chatgpt-release-notes). The API has its own reasoning-effort controls. I understand why these options exist. Compute is expensive, latency matters, and not every request deserves the same budget.

But why am I the scheduler?

I know what I want done. I usually do not know how many internal reasoning steps the model needs before it has done it. Neither does anyone else before the work begins. Task difficulty is instance-dependent. A short prompt can conceal a hard proof. A long prompt can ask for a trivial transformation. The model often learns the true shape of the problem only after it starts working.

I do not want a smarter model picker. I want the picker gone.

## The User Should Not Allocate GPU Time

Model tiers made sense as a temporary product interface. They exposed a real constraint while inference-time reasoning was still new and unpredictable. Now they are becoming a permanent tax on every conversation.

The tax is not only cognitive. Choosing a thinking level before inference encourages two kinds of waste:

1. Easy tasks receive too much compute because the user plays it safe.
2. Hard tasks receive too little compute because the user cannot know they are hard yet.

Both are failures of static allocation.

There is already movement in the right direction. ChatGPT can [automatically switch from Instant to a reasoning model](https://help.openai.com/en/articles/20001354-gpt-56-in-chatgpt/), and research on [adaptive test-time compute allocation](https://arxiv.org/html/2604.14853v1) treats the problem explicitly: maximize accuracy under an average compute budget by learning which instances benefit from more work.

That is useful, but routing between fixed modes is still not the end state I want. It turns the picker into a classifier. The classifier can still guess wrong, and a third-party router must inspect the prompt before it can make that guess, which creates an obvious privacy and trust problem. A first-party provider can route internally, but the deeper question remains: why should a request be assigned one fixed depth before the model has seen what happens at step twelve?

The better abstraction is one user-facing model per generation, with elastic execution depth inside it.

I say *user-facing* deliberately. The system may still contain experts, draft models, verifiers, search tools, or specialized hardware. I do not care how many machines are behind the curtain. I care that the contract is simple:

> Here is the task. Spend as little compute as possible, but keep working until you have earned the answer.

## One Model, Elastic Depth

The model I want does not merely produce a longer chain of thought. It runs a loop.

1. Form an initial answer or plan.
2. Estimate uncertainty and identify what remains unresolved.
3. Test the fragile parts with tools, retrieval, code execution, or formal checks.
4. Continue reasoning only where those checks expose uncertainty or contradiction.
5. Stop when the answer satisfies task-specific completion criteria.

The important word is *criteria*. "Think until it feels done" is not a stopping rule. A model can become confidently wrong, circle the same idea for ten thousand tokens, or keep polishing an answer that was already correct. Dynamic compute requires a learned controller with observable signals: verifier results, contradiction counts, test outcomes, source agreement, calibration, and marginal improvement per additional step.

Several recent approaches point toward pieces of this architecture:

- [Adaptive Test-Time Compute Allocation](https://arxiv.org/html/2604.14853v1) learns to assign reasoning budgets under a global compute constraint.
- [TIDE](https://arxiv.org/html/2603.21365v1) learns per-token early exits, allowing hidden states that have already converged to skip later layers.
- [AdaAnchor](https://arxiv.org/html/2603.15051v1) performs silent iterative refinement in latent space and halts when the internal state stabilizes.
- [SELF-Transformer](https://arxiv.org/html/2507.13569v1) repeatedly refines attention toward a fixed point, scaling execution with input difficulty.
- [Inference Scaling Laws](https://openreview.net/forum?id=VNckp7JEHn) studies when additional inference compute is more useful than simply scaling model parameters.

These are not the same technique. Some allocate among discrete budgets, some exit layers early, and some add recurrent latent computation. None, by itself, is the complete cognitive architecture. Together they make one point difficult to ignore: execution depth does not have to be a constant chosen by the user.

There are practical implementation guides such as [LM-Kit.NET's inference-time compute notes](https://docs.lm-kit.com/lm-kit-net/guides/glossary/inference-time-compute.html), and there are contrasting approaches such as [N-way self-evaluating mixtures of models](https://arxiv.org/pdf/2601.16863). I am arguing for the opposite product surface. Let the provider manage internal diversity. Give me one capable system whose depth changes with the work.

## The Other Problem: Retrieval Is Not Truth

Removing the model picker solves only half of my frustration.

The other half appears when the model searches the web.

I have watched an LLM retrieve a Reddit post near the top of a search, summarize it with total confidence, and turn one stranger's claim into an answer. The danger is not that Reddit is uniquely bad. Reddit can contain excellent first-hand information. The danger is that retrieval rank, repetition, and truth are different things, while the final prose often makes them look identical.

This is becoming an attack surface.

[Generative Engine Optimization](https://arxiv.org/abs/2311.09735) already studies how content can be written to increase its visibility in generative answers. [PoisonedRAG](https://arxiv.org/abs/2402.07867) shows that retrieval-augmented systems can be manipulated by injecting a small number of adversarial documents. The exact behavior varies by search engine and model, so "post once on Reddit and control every LLM" would be an irresponsible universal claim. The broader problem is real: retrievability can be optimized independently of truth.

This matters because an LLM can convert a ranking failure into a knowledge failure. It takes uncertain evidence, removes the texture of uncertainty, and returns a clean paragraph. The hallucination is no longer invented from nothing. It is laundered through a source.

Three pages repeating the same original rumor are not three independent confirmations. A recent SEO page is not automatically stronger than an older primary document. A highly upvoted personal account is still a personal account. Search gives us candidate evidence, not a verdict.

The model needs a way to reason about that distinction before it speaks.

## Why Z3 Helps, and Why Z3 Is Not a Truth Machine

This is where I think neurosymbolic AI becomes useful.

Language models are good at interpreting messy language, proposing hypotheses, and translating between representations. Symbolic systems are good at checking whether explicit statements satisfy explicit rules. A system such as [SATLM](https://arxiv.org/pdf/2305.09656) lets the language model produce a declarative specification and gives the actual solving to a program such as Z3. [Logitext](https://arxiv.org/html/2602.18095v1) represents natural-language constraints as an SMT theory. [Nsvif](https://arxiv.org/html/2601.17789v1) uses symbolic constraints to verify whether an output followed a complex instruction.

This division of labor is powerful, but it comes with a limitation that should be written in capital letters:

> Z3 can prove that a conclusion follows from the premises. It cannot prove that the premises describe reality.

If the model formalizes a false Reddit post as an axiom, the solver may produce a flawless proof of nonsense. Formal verification is only as sound as the formalization and the facts entering it. SATLM makes essentially this distinction: the solver can guarantee correctness with respect to the generated specification, not guarantee that the model translated the world into that specification correctly.

So my proposal is not "put Z3 after web search." It needs an evidence layer before the proof layer.

For every retrieved claim, the system should track:

- provenance: who made the claim, where, and when;
- source type: primary evidence, secondary reporting, or unattributed repetition;
- independence: whether apparently separate sources share one origin;
- domain authority: whether the source is actually in a position to know;
- contradiction: which other claims cannot be true at the same time;
- temporal scope: whether the claim was true then, now, or only under a condition;
- uncertainty: what is observed, inferred, assumed, or still unknown.

Only then should the model compile the relevant claims into propositions and constraints for a symbolic engine. The solver can reject contradictions, test consequences, produce counterexamples, and show exactly which assumptions support a conclusion. The language model can then search again for the missing premise or report that the evidence is insufficient.

This is closer to how [Chiasmus](https://yogthos.net/posts/2026-04-08-neurosymbolic-mcp.html) handles structural questions about code: parse source into explicit facts, then use Prolog or Z3 to answer reachability and consistency questions over that representation. [OxiRAG](https://github.com/cool-japan/oxirag) explores an SMT verification layer in a RAG system. These are implementation examples, not proof that open-web truth has been solved, but they show the shape of a useful interface between neural interpretation and symbolic checking.

"First principles" also needs care. There is no small universal file of indisputable truths from which the internet can be deduced. Useful axioms are usually domain-specific, versioned, and explicit: physical constraints, mathematical definitions, software invariants, legal rules in a particular jurisdiction and date, or facts signed by an authoritative primary source. The goal is not to freeze one worldview into the model. The goal is to expose its assumptions so they can be challenged.

## The Architecture I Actually Want

Put the two halves together and the system looks like this:

```text
request
  -> initial plan
  -> dynamic compute controller
       -> answer directly when confidence is earned
       -> retrieve evidence when facts are missing
       -> run tools when results are testable
       -> formalize claims when logic matters
  -> provenance and contradiction graph
  -> symbolic verifier / tests / external critic
  -> continue, revise, abstain, or answer
```

The user sees one model. Internally, the model earns the right to stop.

An easy rewrite should finish almost immediately. A coding task should keep going until the relevant tests pass or the model can explain why they cannot. A current-events question should gather independent evidence and separate confirmed facts from inference. A mathematical claim should be checked by a proof assistant or solver when possible. An unresolvable question should end with calibrated uncertainty, not ceremonial confidence.

External feedback matters. The paper bluntly titled [Large Language Models Cannot Self-Correct Reasoning Yet](https://www.emergentmind.com/papers/2310.01798) finds that intrinsic self-correction is unreliable without external feedback. [CRITIC](https://openreview.net/forum?id=Sx038qxjek) shows a more productive direction: let the model interact with tools that can expose errors. More thinking is useful only when the loop receives information that can change the answer.

## Training It With Verifiable Rewards

This system will not emerge from interface cleanup. It needs to be trained to allocate compute, seek evidence, formalize carefully, react to failures, and stop.

Reinforcement Learning with Verifiable Rewards is a natural fit. [DeepSeekMath](https://arxiv.org/abs/2402.03300) introduced Group Relative Policy Optimization for mathematical reasoning, and later work has explored how [RLVR can incentivize correct reasoning already present in a base model](https://arxiv.org/abs/2506.14245). The verifier provides a reward that is harder to bluff than a style judge: a proof checks, code passes, constraints are satisfied, or the answer does not receive the reward.

For this architecture, the reward cannot be correctness alone. It should look more like:

```text
reward = verified correctness
       + evidence quality
       + calibrated uncertainty
       - unsupported claims
       - unnecessary compute
```

The compute penalty matters. Without it, the model learns to think forever. With too much of it, the model learns to stop early and gamble. Training has to find the frontier where another step is purchased only when it is likely to improve the result.

[DREAM](https://arxiv.org/html/2506.17104v2) contributes two ideas I especially like: Axiom-Driven Strategy Diversification, which prevents the model from collapsing onto one proof pattern, and Sub-Proposition Error Feedback, which points to the exact failed part of a formal proof instead of returning one useless red light at the end. A broader [keynote on neuro-symbolic learning in the era of large models](https://www.lamda.nju.edu.cn/guolz/paper/AAAI_Logic_AI_Keynote.pdf) discusses symbolic systems as generators and validators for learning.

There is still a formalization gap. The model can translate a true sentence into the wrong logic. It can learn to exploit a weak verifier. It can optimize the benchmark instead of the underlying task. Work on [neurosymbolic natural-language formalization and verification](https://openreview.net/forum?id=aMIkbx81Em) addresses this by checking both formal validity and semantic equivalence, but this remains a core research problem, not a solved detail.

The system therefore needs rewards at several levels: source selection, claim extraction, formalization, proof, final answer, calibration, and compute cost. A single pass/fail score at the end is too blunt.

## How I Would Test the Idea

I would not begin by claiming a unified architecture has solved truth. I would test narrow things that can fail visibly.

First, compare dynamic allocation against fixed Low, Medium, and High budgets on the same task distribution. Measure answer quality, latency, tokens, and how often the controller stops too early.

Second, create retrieval sets containing primary documents, duplicated reporting, stale facts, contradictory claims, and deliberately optimized misinformation. Measure whether the evidence graph identifies shared provenance and whether the final answer preserves uncertainty.

Third, test the formalization boundary. Give the model statements whose logical form is easy to mistranslate: quantifiers, exceptions, dates, negation, and causal claims. A proof over the wrong proposition should count as a failure, even if Z3 says `sat`.

Fourth, reward abstention when the evidence cannot support a conclusion. A model that says "I cannot verify this from the available sources" should beat a model that writes a beautiful guess.

Finally, evaluate the complete loop under a shared compute budget. The claim is not that maximum thinking always wins. The claim is that adaptive thinking should spend compute where it changes the outcome and save it where it does not.

## The Product Should Feel Boring

If this works, the interface becomes almost boring.

There is one model for the generation. You ask it something. A trivial task returns quickly. A difficult task takes longer because the system finds unresolved claims, runs checks, and keeps going. When the answer depends on the web, you can inspect the provenance and see which statements are facts, inferences, or assumptions. When formal verification applies, you can inspect the proof or counterexample. When the system does not know, it says so.

No personality test about thinking levels. No ritual of rerunning the same prompt at High because Medium felt suspicious. No pretending that a source became true because retrieval ranked it first.

I do not want five buttons that ask me how intelligent the model should be today. I want one model that knows how much work remains.

The next generation of reasoning systems should not merely think more. They should know when more thinking is useful, know what evidence can support, know what a proof actually proves, and know when they have not earned an answer yet.

Then the user can go back to the part that matters: asking the question.

## Sources and Further Reading

### Product context and adaptive compute

- OpenAI, [Introducing GPT-5.6](https://openai.com/index/gpt-5-6/)
- OpenAI, [GPT-5.6 in ChatGPT](https://help.openai.com/en/articles/20001354-gpt-56-in-chatgpt/)
- OpenAI, [ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- [Adaptive Test-Time Compute Allocation for Reasoning LLMs via Constrained Policy Optimization](https://arxiv.org/html/2604.14853v1)
- [TIDE: Token-Informed Depth Execution for Per-Token Early Exit in LLM Inference](https://arxiv.org/html/2603.21365v1)
- [Thinking in Latents: Adaptive Anchor Refinement for Implicit Reasoning in LLMs](https://arxiv.org/html/2603.15051v1)
- [Change of Thought: Adaptive Test-Time Computation](https://arxiv.org/html/2507.13569v1)
- [Inference Scaling Laws: An Empirical Analysis of Compute-Optimal Inference for LLM Problem-Solving](https://openreview.net/forum?id=VNckp7JEHn)
- [LM-Kit.NET: Inference-Time Compute Scaling](https://docs.lm-kit.com/lm-kit-net/guides/glossary/inference-time-compute.html)
- [Mixture-of-Models: Unifying Heterogeneous Agents via N-Way Self-Evaluating Deliberation](https://arxiv.org/pdf/2601.16863)

### Retrieval, provenance, and neurosymbolic verification

- [GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735)
- [PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation](https://arxiv.org/abs/2402.07867)
- [SATLM: Satisfiability-Aided Language Models Using Declarative Prompting](https://arxiv.org/pdf/2305.09656)
- [Neurosymbolic Language Reasoning as Satisfiability Modulo Theory](https://arxiv.org/html/2602.18095v1)
- [Neuro-Symbolic Verification on Instruction Following of LLMs](https://arxiv.org/html/2601.17789v1)
- [Giving LLMs a Formal Reasoning Engine for Code Analysis](https://yogthos.net/posts/2026-04-08-neurosymbolic-mcp.html)
- [OxiRAG](https://github.com/cool-japan/oxirag)
- [Neuro-Symbolic AI for Agent Reasoning: Bridging Neural Fluency and Symbolic Rigor](https://zylos.ai/research/2026-03-21-neuro-symbolic-ai-agent-reasoning/)
- [Neuro-Symbolic Learning in the Era of Large Models](https://www.lamda.nju.edu.cn/guolz/paper/AAAI_Logic_AI_Keynote.pdf)
- [A Neurosymbolic Approach to Natural Language Formalization and Verification](https://openreview.net/forum?id=aMIkbx81Em)

### Training and external feedback

- [DREAM: Towards Advanced Mathematical Reasoning for LLMs via First-Order Logic Theorem Proving](https://arxiv.org/html/2506.17104v2)
- [DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models](https://arxiv.org/abs/2402.03300)
- [Reinforcement Learning with Verifiable Rewards Implicitly Incentivizes Correct Reasoning in Base LLMs](https://arxiv.org/abs/2506.14245)
- [Large Language Models Cannot Self-Correct Reasoning Yet](https://www.emergentmind.com/papers/2310.01798)
- [CRITIC: Large Language Models Can Self-Correct with Tool-Interactive Critiquing](https://openreview.net/forum?id=Sx038qxjek)
