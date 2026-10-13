"""Rebuild the blog figures from the saved, measured pilot. No model inference."""
import json
from pathlib import Path
import textwrap
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
OUT = ROOT / "assets"
OUT.mkdir(exist_ok=True)
R = json.loads((DATA / "results.json").read_text())
ORDER = ["decision", "semantic_80", "semantic_95", "sentence_pack", "recursive_overlap",
         "fixed_half", "fixed", "fixed_overlap"]
LABEL = {"decision": "Imajev-4B", "semantic_80": "Semantic p80", "semantic_95": "Semantic p95",
         "sentence_pack": "Sentence packing", "recursive_overlap": "Recursive + overlap",
         "fixed_half": "Fixed 128", "fixed": "Fixed 256", "fixed_overlap": "Fixed 256 + overlap"}
PAPER, INK, PURPLE, TEAL, ORANGE = "#faf6ed", "#252332", "#7554a1", "#147e7b", "#cb572b"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 12, "figure.facecolor": PAPER,
    "axes.facecolor": PAPER, "text.color": INK, "axes.labelcolor": INK, "xtick.color": INK,
    "ytick.color": INK, "axes.spines.top": False, "axes.spines.right": False,
    "axes.spines.left": False, "axes.spines.bottom": False, "svg.fonttype": "none"})


def save(fig, name, note):
    fig.text(.03, .025, note, fontsize=10, color="#595261", va="bottom")
    fig.savefig(OUT / f"{name}.png", dpi=180, facecolor=PAPER)
    fig.savefig(OUT / f"{name}.svg", facecolor=PAPER)
    plt.close(fig)


y = np.arange(len(ORDER))
fig, ax = plt.subplots(figsize=(12, 7.3))
fig.subplots_adjust(left=.24, right=.93, top=.83, bottom=.17)
fig.text(.03, .94, "Five chunks are not five equal meals", fontsize=23, weight="bold")
fig.text(.03, .888, "All eight strategies · token-coverage IoU · higher is better", fontsize=13)
for offset, mode, color, label in [(-.18, "k5", PURPLE, "Top 5 chunks"),
                                   (.18, "budget1024", TEAL, "At most 1,024 context tokens")]:
    values = [R["methods"][m]["metrics"][mode]["iou"] * 100 for m in ORDER]
    ax.barh(y + offset, values, .31, color=color, label=label)
    for yi, value in zip(y + offset, values):
        ax.text(value + .1, yi, f"{value:.2f}", va="center", fontsize=10)
ax.set(yticks=y, yticklabels=[LABEL[m] for m in ORDER], xlim=(0, 10.6),
       xlabel="Mean IoU (%)", xticks=np.arange(0, 11, 2))
ax.invert_yaxis()
ax.set_axisbelow(True)
ax.grid(axis="x", alpha=.15)
ax.tick_params(axis="both", length=0)
ax.legend(loc="lower right", frameon=False, fontsize=10)
save(fig, "retrieval", "56 public Chatlogs queries · same BGE retriever · shared maximum budget; actual utilization varies.")

fig, ax = plt.subplots(figsize=(12, 7))
fig.subplots_adjust(left=.24, right=.91, top=.81, bottom=.18)
fig.text(.03, .94, "The stopwatch entered the conversation", fontsize=23, weight="bold")
fig.text(.03, .88, "One-time chunking cost for the entire 7,727-token corpus", fontsize=13)
times = [R["methods"][m]["chunking_s"] for m in ORDER]
for yi, method, value in zip(y, ORDER, times):
    color = ORANGE if method == "decision" else TEAL
    ax.scatter(value, yi, s=115 if method == "decision" else 65, color=color, zorder=3)
    label = f"{value/60:.2f} min" if value > 60 else f"{value:.3g} s"
    ax.annotate(label, (value, yi), xytext=(10, 0), textcoords="offset points", va="center", fontsize=11)
ax.set_xscale("log")
ax.set(yticks=y, yticklabels=[LABEL[m] for m in ORDER], xlim=(.008, 9500),
       xlabel="Seconds · logarithmic axis (each major step is 10×)",
       xticks=[.01, .1, 1, 10, 100, 1000], xticklabels=["0.01", "0.1", "1", "10", "100", "1,000"])
ax.invert_yaxis()
ax.grid(axis="x", alpha=.2)
ax.tick_params(axis="both", length=0)
save(fig, "cost", "Apple M4 / 32 GiB · MLX decisions, CPU semantic embeddings · loading, common prep and indexing excluded.")

baselines = ORDER[1:]
fig, ax = plt.subplots(figsize=(12, 6.8))
fig.subplots_adjust(left=.25, right=.94, top=.8, bottom=.2)
fig.text(.03, .94, "Where is the improvement, exactly?", fontsize=23, weight="bold")
fig.text(.03, .88, "Imajev minus each baseline · IoU at the 1,024-token cap", fontsize=13)
for yi, method in enumerate(baselines):
    d = R["decision_minus_baseline"][method]["budget1024"]["iou"]
    value = d["delta"] * 100
    lo, hi = np.array(d["paired_query_bootstrap_ci95"]) * 100
    ax.errorbar(value, yi, xerr=[[value - lo], [hi - value]], fmt="o", color=PURPLE,
                markersize=8, capsize=5, linewidth=2)
ax.axvline(0, linestyle="--", color=INK, alpha=.65)
ax.set(yticks=np.arange(len(baselines)), yticklabels=[LABEL[m] for m in baselines],
       xlim=(-1.2, 1.1), xlabel="IoU difference (percentage points) · 95% paired query-bootstrap interval")
ax.invert_yaxis()
ax.grid(axis="x", alpha=.12)
ax.tick_params(axis="both", length=0)
save(fig, "uncertainty", "2,000 resamples within one corpus · positive favors Imajev · not cross-domain significance.")

smoke = [json.loads(s) for s in (DATA / "imajev-smoke.jsonl").read_text().splitlines()][:2]
fig = plt.figure(figsize=(12, 6.3))
fig.text(.04, .93, "Same mirror. Two different next sentences.", fontsize=22, weight="bold")
fig.text(.04, .83, "CURRENT CHUNK", fontsize=10, color=PURPLE, weight="bold")
fig.text(.04, .77, smoke[0]["current"], fontsize=15)
for left, r, color in zip([.04, .53], smoke, [TEAL, ORANGE]):
    fig.text(left, .62, "NEXT SENTENCE", fontsize=10, color=PURPLE, weight="bold")
    fig.text(left, .55, textwrap.fill(r["next"], 42), fontsize=14, va="top", linespacing=1.5)
    answer = r["answer"]
    choice = answer["choice"]
    fig.text(left, .28, f"{choice}  {answer['probabilities'][choice]*100:.1f}%", color=color, fontsize=26, weight="bold")
    fig.text(left, .19, f"Conditional choice probability · unknown {answer['unknown_probability']*100:.2f}%", fontsize=10)
save(fig, "decisions", "Actual local model outputs from two simple smoke checks · not a boundary-accuracy benchmark.")
print("Saved four measured figures as PNG and SVG")
