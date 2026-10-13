# Experimenting with a Decision Model as a RAG Chunker (Spoiler: It's Bad)

I had what felt like a very clever idea: instead of cutting documents every 256 tokens, or using embedding distance to guess where the topic changes, why not ask a decision model where each thought ends?

Feed it the current chunk and the next sentence. Make it choose **APPEND** or **SPLIT**. Repeat until the document is done.

It sounds smart. It works. It is also, in its current form, a bad chunker.

![A small machine inspecting a branching river of language in a psychedelic library.](/images/blog/decision-model-chunking/cover.webp)

> The short version: Imajev-4B matched the good cheap baselines, but did not beat them. It took 31 minutes to chunk a tiny corpus that semantic chunking processed in six seconds.

## Why I thought this might work

Chunking is one of those boring-looking choices that quietly controls an entire [RAG](https://docs.langchain.com/oss/python/langchain/knowledge-base) system. If you split in the wrong place, the retriever may find the question but lose the answer sitting one sentence away.

Fixed-size chunking does not care about meaning. Semantic chunking is smarter: it embeds neighboring sentences and splits when the distance jumps. But vocabulary can change while the thought stays the same, and similar vocabulary can hide a completely new topic.

I wanted a model to make the actual decision:

```text
current_chunk: everything kept together so far
next_sentence: the next piece of text

APPEND -> this continues, explains, or supports the current passage
SPLIT  -> this begins a different topic or self-contained section
```

I used [Imajev-4B](https://huggingface.co/mohit67890/imajev-4b), a four-billion-parameter decision model with a trained choice readout and an explicit unknown option. I ran it locally through MLX. It never rewrote the source; it only chose the boundaries. A hard token cap could still force a split.

And yes, the basic behavior looked right:

![Two actual Imajev smoke checks: continuation gets APPEND; payroll after a telescope description gets SPLIT.](/images/blog/decision-model-chunking/decisions.png)

> A telescope sentence followed by another telescope sentence gets **APPEND**. A sudden jump to payroll gets **SPLIT**. These are sanity checks, not proof that the model understands every boundary.

This is not an entirely new direction. [Meta-Chunking](https://arxiv.org/html/2410.12788v3#S3.SS1.SSS2) also explores merge/split probabilities. My test was narrower: can Imajev's decision head replace the usual chunk-boundary rule without touching the original text?

## The test

I used the complete Chatlogs section of [Chroma's chunking benchmark](https://www.trychroma.com/research/evaluating-chunking): **56 queries over 7,727 tokens**.

I compared eight methods:

1. Imajev-4B decisions
2. Fixed 128-token chunks
3. Fixed 256-token chunks
4. Fixed 256 with overlap
5. Recursive 256 with overlap
6. Sentence packing up to 256 tokens
7. Semantic chunking at the 80th distance percentile
8. Semantic chunking at the 95th distance percentile

Every method used the same local [BGE-small retriever](https://huggingface.co/BAAI/bge-small-en-v1.5). The important comparison used a shared maximum of **1,024 retrieved tokens**, because comparing a fixed number of differently sized chunks is an easy way to fool yourself.

Recall tells us how much of the annotated evidence came back. IoU rewards relevant context and penalizes irrelevant or repeated context. Higher is better.

## The result: bad

![All eight strategies compared by top-five IoU and IoU under a shared token cap.](/images/blog/decision-model-chunking/retrieval.png)

Under the shared context budget, Imajev reached **97.37% recall and 7.06% IoU**.

That sounds decent until the cheap methods walk in:

| Method | Recall | IoU | Chunking time |
|---|---:|---:|---:|
| **Imajev-4B decision** | **97.37%** | **7.06%** | **31 min** |
| Semantic percentile 80 | 96.63% | 7.10% | 6.01 s |
| Sentence packing | 97.25% | **7.17%** | 0.02 s |
| Fixed 256 | 98.91% | 6.49% | 0.02 s |

Plain sentence packing had slightly better IoU. Semantic chunking was effectively tied. Both were dramatically faster.

At top five chunks, the decision model initially looked much better: **8.58% IoU**, compared with **6.14%** for semantic p95. Then I checked the chunk sizes. Imajev produced 87.5-token chunks on average; semantic p95 produced 180.5-token chunks. Five small chunks and five large chunks are not the same retrieval budget. Once I capped every method by tokens, most of the apparent win disappeared.

That is why the left and right sides of the graph tell different stories. The left side is flattering. The right side is fair.

## Then I looked at the clock

![Measured one-time chunking times for all eight methods, on a logarithmic axis.](/images/blog/decision-model-chunking/cost.png)

On my Apple M4 with 32 GiB of RAM, Imajev made **289 model calls**, processed **100,075 input tokens**, and took **30.99 minutes**.

Semantic p80 took **6.01 seconds**. In this implementation, it was about **309 times faster**.

This is ingestion time, not query time, so it would not slow every user question. But spending half an hour to produce roughly the same retrieval result as a six-second baseline is not a trade I would make.

![Imajev's IoU differences against every baseline, with paired query-bootstrap intervals.](/images/blog/decision-model-chunking/uncertainty.png)

The uncertainty check made the verdict even less exciting. Against semantic p80 and sentence packing, the intervals crossed zero. I cannot honestly claim a real improvement over either one.

The system itself was not broken. It produced **89 lossless chunks**, made reasonable boundary decisions, preserved every source character, passed **15 integrity tests**, and survived an offline replay of all **305 boundaries and 1,792 retrieval records**. It did exactly what I asked. The problem is that what I asked was too expensive for what it returned.

## The useful version of this idea

I do not think decision-based chunking is dead. I think using a general four-billion-parameter model on every sentence boundary is the wrong implementation.

A better version would use a **much smaller model trained specifically for APPEND versus SPLIT**. Give it the tail of the current chunk and the next sentence, fine-tune it on real boundary decisions, and make the training set heavy on difficult cases where embedding distance is misleading. A small classifier should be faster, easier to batch, and more consistent than repeatedly asking a general model to reason from a long instruction.

I would also stop calling the model for obvious boundaries. Let fixed rules handle headings and token limits. Let semantic distance handle the easy cases. Call the learned decision model only inside the uncertain middle, where the similarity score cannot confidently say whether the thought continued or changed.

That hybrid approach could keep the part I actually like: a learned boundary decision that sees the relationship between sentences. It would remove the absurd part: waking up a 4B model hundreds of times to compete with sentence packing.

To be clear, that is the next hypothesis, not a result from this benchmark. It still needs a labeled dataset, fine-tuning, and the same comparison against cheap baselines.

## What I would use today

For this workload, I would use sentence packing or semantic chunking. They are fast, understandable, and scored just as well.

The experiment was still useful because it killed the lazy version of the idea. The decision model *can* decide where thoughts end. That alone does not make it a good chunker. The result has to be better enough to pay for the thinking, and this one was not.

The benchmark is small: one synthetic chat corpus, one retriever, no human boundary labels, and no answer-generation evaluation. I did not run the other four Chroma corpora or tune the prompt against the final scores. A larger evaluation may move the numbers. It would have to move them quite a lot to erase a 31-minute versus six-second gap.

---

[Measured results](/downloads/decision-model-chunking/results.json) · [Audit summary](/downloads/decision-model-chunking/audit.json) · [Rebuild the graphs](/downloads/decision-model-chunking/plot.py) · [Method and evidence notes](/downloads/decision-model-chunking/NOTES.md)

Further reading: [Is Semantic Chunking Worth the Computational Cost?](https://arxiv.org/abs/2410.13070), [HiChunk / HiCBench](https://arxiv.org/abs/2509.11552).
