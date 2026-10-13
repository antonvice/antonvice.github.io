# Evidence and sharing notes

The experiment ran on 2026-10-12. The blog was written on 2026-10-13. The post uses a psychedelic, spoken essay voice; it contains no fabricated Terence McKenna quotes or endorsement.

## Share

Keep `POST.md`, `assets/`, `data/`, and `NOTES.md` together. All local links in the article are relative. Upload the folder to your Markdown host or unpack the supplied ZIP. The Markdown file alone does not embed the image bytes. No post has been published automatically.

An optional `preview.html` opens the same article and local images in a browser. `POST.md` is the editable source.

## Rebuild the graphs

Requires Python and the versions in `plot-requirements.txt`:

```sh
python -m pip install -r plot-requirements.txt
python plot.py
```

The four measured figures are generated with Matplotlib from the copied results and real model smoke outputs. PNG versions are embedded for broad Markdown compatibility; SVG versions are included for editing/export. `assets/cover.png` is a generated editorial illustration, not experimental evidence. Its complete prompt and generation mode are in `ASSETS.md`.

## Protocol

- Public Chroma benchmark commit: `e708410d1c61cb76a85cd9d433630ef89b9c6b85`.
- One full corpus: Chatlogs, 7,727 canonical cl100k tokens, 56 queries. Full benchmark: five corpora / 472 queries.
- Same local `BAAI/bge-small-en-v1.5` retriever for all methods; checkpoint `5c38ec7c405ec4b44b94cc5a9bb96e735b38267a`. Query prefix follows the model card; vectors are normalized and ranked by exhaustive cosine similarity.
- 256-token cap except fixed-128; 64-token overlap where used. Semantic baselines use cosine distances between adjacent three-sentence windows and split above the 80th or 95th percentile, subject to the cap.
- Imajev sees the accumulated chunk and next sentence/unit. It has no benchmark question, reference excerpt, or future sentence in its input. Oversized sentence units are split into source-preserving fragments.
- Forced cap splits bypass inference. The policy starts a new chunk on a tie, abstention, or unknown probability at least 0.5. Otherwise it takes the higher conditional APPEND/SPLIT probability. One option order and the shipped calibration were used; calibration was not fitted to chunking.
- Native model probabilities, raw logits, usage and source offsets were persisted. Original Markdown text was reconstructed exactly. HTML conversion support was tested separately; the benchmark did not involve PDF extraction or a second Markdownify pass.
- Primary comparison takes a ranked prefix of whole chunks until the next would exceed 1,024 independently tokenized context tokens. Mean actual context ranges from about 933 to 1,023 tokens; this is a shared cap rather than exactly equal delivered text.
- Coverage uses canonical document-token positions. Relevant positions count once in the numerator; repeated delivered positions count repeatedly in the denominator. Thus penalized IoU = covered relevant tokens / (delivered tokens + missing relevant tokens). The JSON also contains ordinary unique-position IoU.
- Scores are means over queries. The framework is an adaptation of Chroma’s public data, not a reproduction of its OpenAI-embedding leaderboard or character-span scorer.
- The 95% intervals resample paired queries within the observed corpus, using 2,000 draws and seed 17. They are diagnostic and do not establish significance across independent documents/domains.
- BGE inputs exceeding its limit are windowed and pooled instead of silently truncated. No multiwindow inputs were observed in this Chatlogs run.

## What was actually checked

15 deterministic integrity tests passed, including Unicode, caps, duplicated retrieval penalties and source alignment on all five available corpora. This does not mean all five underwent model inference or retrieval evaluation.

Actual-model preflight returned the expected decisions on four obvious continuation/topic-change examples. A separate standalone export check turned four sentences into two expected topic chunks and reconstructed the complete input. These are sanity checks, not human-gold segmentation accuracy.

The final run evaluated eight methods × 56 queries × four retrieval modes = **1,792 retrieval records**. Offline auditing reconstructed the calibrated answers from **289 saved model logit passes**, replayed **305 candidate boundaries**, and recomputed rankings from saved embeddings. Every check passed.

Final decision statistics: 16 forced cap splits, 72 model-policy splits (including 11 abstentions), 89 chunks; median inference 5.95 s, p95 11.90 s; reported MLX peak allocation 9.70 GiB. Loading took 6.85 s separately; per-method embedding/indexing took 1.73–3.18 s.

Chunking times exclude model loading, common sentence preparation, indexing and artifact writes. Timings reflect a single local deployment without controlled thermal/system-load measurements. The measured cost ratio is not a universal statement about decision models.

Frozen source/data/dependency/model hashes and source snapshots were retained in the original experiment. Preflight dependency and source-offset incidents were fixed before the final freeze; an interrupted preflight is excluded. No final run was selected using retrieval outcomes.

## Pins and sources

- Imajev adapter: `mohit67890/imajev-4b@f8d8234cebc6c99065c07731e59716dc0a6e27ab`.
- Base: `Qwen/Qwen3.5-4B@851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`.
- Implementation runtime: MLX 0.32.3, mlx-vlm 0.7.1; sentence-transformers 5.7.0, transformers 5.18.0, tiktoken 0.12.0, pysbd 0.3.4.
- [Chroma benchmark source and dataset](https://github.com/brandonstarxel/chunking_evaluation/tree/e708410d1c61cb76a85cd9d433630ef89b9c6b85).
- [Imajev model card](https://huggingface.co/mohit67890/imajev-4b), [BGE model card](https://huggingface.co/BAAI/bge-small-en-v1.5).
- [Meta-Chunking](https://arxiv.org/html/2410.12788v3#S3.SS1.SSS2) is the close binary-probability precedent. Its adaptive margins, subsequent merging and rewriting are not reproduced here.
- [LangChain retrieval tutorial](https://docs.langchain.com/oss/python/langchain/knowledge-base) and [the supplied semantic-splitting Reddit guide](https://www.reddit.com/r/LangChain/comments/1erxo60/a_guide_to_understand_semantic_splitting_for/) informed the introductory structure. No prose or illustrations were copied.

The share bundle contains numerical results, a compact audit record and figure-generation code. It does not contain model weights or claim to be a turnkey installation of the inference harness.
