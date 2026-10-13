# I Asked a 4B Model Where a Thought Ends

**An expedition into decision-model chunking. The stopwatch came along.**

Imagine, for a moment, that a document is a jungle of meaning. Ideas curl around each other. Explanations hang from premises. Somewhere in the undergrowth, a pronoun is looking for its antecedent.

![A small machine inspecting a branching river of language in a psychedelic library.](/images/blog/decision-model-chunking/cover.webp)

> AI-generated editorial illustration. The measurements below are real.

And we arrive with a ruler.

Cut every 256 tokens. Put the pieces in a retrieval index. Hope the explanation survived the border crossing.

In [RAG](https://docs.langchain.com/oss/python/langchain/knowledge-base), a retriever brings relevant passages into a language model’s context. Chunking decides which passages are available. A small engineering choice can shape the entire conversation.

## Give the scissors a decision model

Semantic chunking already makes the ruler more interesting: embed neighboring sentence windows, then look for jumps in cosine distance. [This approachable guide](https://www.reddit.com/r/LangChain/comments/1erxo60/a_guide_to_understand_semantic_splitting_for/) explains the intuition.

The intriguing gap: a sentence can change vocabulary while completing the same thought.

So I tried [Imajev-4B](https://huggingface.co/mohit67890/imajev-4b), a four-billion-parameter decision model. Its trained readout scores supplied choices and includes an explicit unknown outcome. I ran it locally through MLX and gave it two pieces of evidence:

```text
current_chunk: everything kept together so far
next_sentence: the next piece of text

APPEND → it continues, explains, exemplifies, or supports this passage
SPLIT  → it starts a different topic, task, or self-contained section
```

The model chooses boundaries. The original text stays intact. A token-cap violation forces a split; uncertainty can trigger one too. Afterward, ordinary embedding retrieval still does the searching.

![Two actual Imajev smoke checks: continuation gets APPEND; payroll after a telescope description gets SPLIT.](/images/blog/decision-model-chunking/decisions.png)

> Two easy, actual-model sanity checks. These do not establish general boundary accuracy.

There is ancestry here: [Meta-Chunking’s margin-sampling method](https://arxiv.org/html/2410.12788v3#S3.SS1.SSS2) also uses binary merge/split probabilities. This experiment tests Imajev’s decision head with fixed rules and preserved source text; it does not reproduce that paper’s full pipeline.

## Into the laboratory jungle

I used the **complete Chatlogs portion** of [Chroma’s chunking benchmark](https://www.trychroma.com/research/evaluating-chunking): **56 queries and 7,727 tokens**. The corpus was already Markdown, so I preserved it verbatim to keep reference offsets valid.

Eight strategies entered: Imajev; fixed 128 and 256 tokens; fixed with overlap; recursive with overlap; sentence packing; and semantic chunking at the **80th and 95th distance percentiles**.

Every method used the same local [BGE-small retriever](https://huggingface.co/BAAI/bge-small-en-v1.5). I checked top-1, top-5, top-10, and a shared **1,024-token maximum context budget**. Actual budget utilization varied.

Recall measures how much annotated relevant text was found. Our redundancy-penalized IoU also accounts for unnecessary and repeated context. Higher is better.

![All eight strategies compared by top-five IoU and IoU under a shared token cap.](/images/blog/decision-model-chunking/retrieval.png)

At top-5, Imajev looked promising: **8.58% IoU**, versus **6.14%** for semantic p95. Fixed-128 scored higher still: **9.32%**, with lower recall. But Imajev’s average chunk was **87.5 tokens**, versus **180.5** for semantic p95. Five chunks were different-sized meals.

Under the shared cap, Imajev scored **7.06% IoU**. Semantic p80 scored **7.10%**; plain sentence packing scored **7.17%**. Imajev’s recall was **97.37%**, versus **97.25%** for sentence packing.

The cosmic breakthrough had become a very small numerical neighborhood.

## The stopwatch has objections

![Measured one-time chunking times for all eight methods, on a clearly labeled logarithmic axis.](/images/blog/decision-model-chunking/cost.png)

On an **Apple M4 with 32 GiB RAM**, this Imajev implementation spent **31 minutes** chunking the corpus. Semantic p80 took **6.01 seconds**—about **309× faster** in this deployment.

That is ingestion time for the whole corpus, not per-query latency. MLX handled Imajev; the semantic encoder ran on CPU. Loading and indexing are excluded from this chart.

The explanation is quite earthly: **289 model calls**, repeatedly encoding **100,075 input tokens** of text and instructions. Small model, substantial repetition.

![Imajev’s IoU differences against every baseline, with paired query-bootstrap intervals.](/images/blog/decision-model-chunking/uncertainty.png)

Imajev did improve IoU over fixed-256 by **0.56 percentage points**, while losing **1.54 points of recall**. Against semantic p80 and sentence packing, the uncertainty intervals crossed zero. No clear win over those leading cheap baselines emerged.

## What survived the expedition

The tool works: **89 chunks**, preserved source text, **11 abstentions**, **15 passing integrity tests**, and an offline audit of all **305 boundaries and 1,792 retrieval records**.

One less mystical discovery: token-sized overlaps gave the recursive baseline invalid source offsets. I repaired alignment and tested repeated passages. Those positions had to be verified before the scores meant anything.

The claim stays small: one synthetic chat corpus, LLM-generated reference excerpts, one retriever, no human boundary labels, and no answer-generation evaluation. We did not run the benchmark’s other four corpora or tune the prompt on retrieval scores.

For this workload, I’d keep a cheap baseline. A useful next expedition could invoke the decision model only at ambiguous boundaries, reuse prompt prefixes, or test a cheaper boundary classifier. Those are proposals, not measured improvements.

Language may be a jungle. Bring an interesting hypothesis. Also bring a stopwatch.

---

[Measured results](/downloads/decision-model-chunking/results.json) · [Audit summary](/downloads/decision-model-chunking/audit.json) · [Rebuild the graphs](/downloads/decision-model-chunking/plot.py) · [Method and evidence notes](/downloads/decision-model-chunking/NOTES.md)

Further reading: [Is Semantic Chunking Worth the Computational Cost?](https://arxiv.org/abs/2410.13070), [HiChunk / HiCBench](https://arxiv.org/abs/2509.11552).
