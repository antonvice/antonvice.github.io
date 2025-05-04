# Building a Tiny Transformer from Scratch in Rust (No Training!)

Ever felt like transformer models like GPT are magical black boxes? You've read "Attention is All You Need," maybe skimmed "The Illustrated Transformer," but the *intuition* behind how those Q, K, and V matrices actually *do* something useful remains elusive?

Me too! While training large models requires massive datasets and compute, understanding the *mechanics* can be done on a smaller scale. Inspired by Theia Vogel's fantastic post ["I made a transformer by hand (no training!)"](https://vgel.me/posts/handmade-transformer/), I decided to replicate the process in Rust.

Instead of using training or pre-trained weights, we'll **manually assign every single weight** in a small, decoder-only transformer. Our goal? To make it predict the next character in the simple repeating sequence `aabaabaabaab...` (the pattern `(aab)*`).

This exercise forces us to think deeply about what each component does and how the matrices interact. By the end, you'll hopefully have a much clearer picture of how attention works.

Let's dive in!

## Prerequisites

*   **Basic Rust:** Familiarity with Rust syntax, `struct`s, functions, vectors, and `cargo`.
*   **Conceptual Linear Algebra:** Understanding matrix multiplication (`@` or `*` in code) and matrix/vector addition is helpful. We won't be doing complex proofs, just seeing how the shapes fit together.
*   **The `nalgebra` Crate:** We'll use this excellent library for matrix operations. Implementing matrix math from scratch isn't the focus here.

## Setup: Our Rust Project

First, let's set up our Rust project and add `nalgebra`.

```bash
cargo new handmade_transformer_rust
cd handmade_transformer_rust
cargo add nalgebra # Or add `nalgebra = "0.32"` to Cargo.toml
```

Our `Cargo.toml` should look something like this:

```toml
# Cargo.toml
[package]
name = "handmade_transformer_rust"
version = "0.1.0"
edition = "2021" # Explicitly set edition

[dependencies]
nalgebra = "0.32" # Or newer compatible version
```

Now, let's start coding in `src/main.rs`. We'll need some imports:

```rust
// src/main.rs
extern crate nalgebra; // May be needed in some environments, usually not for Edition 2021+
use nalgebra::{DMatrix, DVector};
use std::cmp::Ordering; // For argmax
```

(**Note:** We add `extern crate nalgebra;` here. While typically not required for Rust editions 2018 and later when a dependency is listed in `Cargo.toml`, it resolved a specific linking issue encountered during development in some environments. You might not need it, but include it if you face similar unresolved import errors.)

## Defining the Task and Model Shape

1.  **Task:** Predict the next character in the sequence `aabaabaabaab...`. This requires looking at the previous *two* characters:
    *   `aa` -> `b`
    *   `ab` -> `a`
    *   `ba` -> `a`
2.  **Model Parameters:** We need to choose the dimensions of our model. Based on the original post and the task's needs:
    *   `N_CTX = 5`: Maximum context length (we only *need* 2, but 5 makes it slightly more robust and requires ignoring irrelevant tokens).
    *   `N_VOCAB = 2`: Our vocabulary is just 'a' and 'b'.
    *   `N_EMBED = 8`: The size of our internal vector representations. This dimension needs to be large enough to hold positional information, token information, and some scratch space for calculations. 8 turns out to be sufficient.
    *   `LG = 1024.0`: A large scaling factor we'll use later to make certain signals dominate others.

Let's define these as constants:

```rust
// --- Model Parameters ---
const N_CTX: usize = 5;
const N_VOCAB: usize = 2;
const N_EMBED: usize = 8;
const LG: f32 = 1024.0; // Large value for scaling
```

## Step 1: Tokenization

We need a way to convert our characters 'a' and 'b' into numerical IDs that the model can use. A simple mapping works: 'a' -> 0, 'b' -> 1.

```rust
// --- Tokenization ---
const CHARS: [&str; N_VOCAB] = ["a", "b"];

fn tokenize(s: &str) -> Result<Vec<usize>, String> {
    s.chars()
        .map(|c| {
            let s_c = c.to_string();
            CHARS
                .iter()
                .position(|&r| r == s_c)
                .ok_or_else(|| format!("Invalid character: {}", c))
        })
        .collect()
}

fn untok(tok: usize) -> Result<&'static str, String> {
    if tok < N_VOCAB {
        Ok(CHARS[tok])
    } else {
        Err(format!("Invalid token id: {}", tok))
    }
}
```

## Step 2: Embeddings - Giving Tokens and Positions Meaning

The first step in a transformer is to convert the sequence of token IDs into a sequence of vectors (embeddings). In GPT-like models, these initial embeddings are the sum of a *token embedding* (what the character is) and a *position embedding* (where the character is in the sequence).

We'll hand-craft these embedding matrices (`wte` for tokens, `wpe` for positions) using a one-hot encoding strategy within our `N_EMBED=8` dimensions.

*   **Position Embeddings (`wpe`)**: `[N_CTX, N_EMBED]` shape ([5, 8]). We'll use the first 5 dimensions. Position 0 is `[1, 0, 0, 0, 0, ...]`, Position 1 is `[0, 1, 0, 0, 0, ...]`, etc.
*   **Token Embeddings (`wte`)**: `[N_VOCAB, N_EMBED]` shape ([2, 8]). We'll use dimensions 5 and 6. Token 'a' (ID 0) is `[..., 1, 0, 0]`, Token 'b' (ID 1) is `[..., 0, 1, 0]`.
*   **Dimension 7:** We'll reserve the last dimension (`index 7`) as scratch space for the attention mechanism later.

Here's how we define the weights:

```rust
// Function to load all our hand-crafted weights
fn load_model_weights() -> ModelWeights { // We'll define ModelWeights struct later

    // EMBEDDING SCHEME VISUALIZED:
    // Index: 0  1  2  3  4 | 5  6 | 7
    // Type: [P, P, P, P, P | T, T | V]
    // P = Position, T = Token, V = Value/Scratch

    // wte: [N_VOCAB, N_EMBED] = [2, 8]
    let wte_data = vec![
        // token `a` (id 0) - Hot at index 5
        0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // token `b` (id 1) - Hot at index 6
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
    ];
    let wte = DMatrix::from_row_slice(N_VOCAB, N_EMBED, &wte_data);

    // wpe: [N_CTX, N_EMBED] = [5, 8]
    let wpe_data = vec![
        // position 0 - Hot at index 0
        1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        // position 1 - Hot at index 1
        0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        // position 2 - Hot at index 2
        0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        // position 3 - Hot at index 3
        0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
        // position 4 - Hot at index 4
        0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
    ];
    let wpe = DMatrix::from_row_slice(N_CTX, N_EMBED, &wpe_data);

    // ... (attn weights will go here later) ...

    // Return value structure defined below
    ModelWeights { wte, wpe, blocks: vec![/* block weights defined later */] }
}

// Structure to hold all model weights
struct ModelWeights {
    wte: DMatrix<f32>,
    wpe: DMatrix<f32>,
    blocks: Vec<TransformerBlockWeights>, // We'll only have one block
}

// Structures for block/attention weights (to be defined fully later)
#[derive(Debug)] // Added Debug for potential printing/debugging
struct TransformerBlockWeights { attn: CausalSelfAttentionWeights }
#[derive(Debug)] // Added Debug
struct CausalSelfAttentionWeights {
    c_attn_w: DMatrix<f32>, c_attn_b: DVector<f32>,
    c_proj_w: DMatrix<f32>, c_proj_b: DVector<f32>,
}

// --- The main GPT function outline ---
// [n_seq] token IDs -> [n_seq, n_vocab] logits
fn gpt(inputs: &[usize], weights: &ModelWeights) -> DMatrix<f32> {
    let n_seq = inputs.len();
    assert!(n_seq <= N_CTX, "Input sequence too long!");

    // 1. Create Initial Embeddings: Sum of token and position embeddings
    let mut x = DMatrix::<f32>::zeros(n_seq, N_EMBED);
    for i in 0..n_seq {
        let token_id = inputs[i];
        let pos_id = i;

        // Ensure IDs are valid before indexing
        assert!(token_id < N_VOCAB, "Invalid token id during embedding lookup: {}", token_id);
        assert!(pos_id < N_CTX, "Invalid position id during embedding lookup: {}", pos_id);

        let token_embed = weights.wte.row(token_id);
        let pos_embed = weights.wpe.row(pos_id);

        x.set_row(i, &(token_embed + pos_embed)); // Summing the vectors
    }

    // Example: Input "aab" (IDs [0, 0, 1])
    // Row 0 (pos 0, token 'a'): [1,0,0,0,0, 1,0,0] = wpe[0] + wte[0]
    // Row 1 (pos 1, token 'a'): [0,1,0,0,0, 1,0,0] = wpe[1] + wte[0]
    // Row 2 (pos 2, token 'b'): [0,0,1,0,0, 0,1,0] = wpe[2] + wte[1]
    // Resulting `x` is a [3, 8] matrix.

    // 2. Pass through Transformer Blocks (we only have one)
    let mut current_x = x; // Start with initial embeddings
    for block_weights in &weights.blocks {
        current_x = transformer_block(&current_x, block_weights); // Defined later
    }

    // 3. Project to Vocabulary Space
    // Use the transpose of wte: [n_embd, n_vocab]
    let output_logits = current_x * weights.wte.transpose(); // [n_seq, n_embd] @ [n_embd, n_vocab] -> [n_seq, n_vocab]

    output_logits
}
```

## Step 3: The Transformer Block - Where the Magic Happens

Our simplified transformer block has only two main parts:
1.  **Causal Self-Attention:** Allows each position to look at previous positions (including itself) and gather information.
2.  **Residual Connection:** Adds the output of the attention mechanism back to its input (`x = x + attention_output`).

(Real GPT models also have Layer Normalization and a Feed-Forward Network (MLP) here, but we've removed them for simplicity).

```rust
// --- Math Helpers --- Needed for Attention

// Numerically stable softmax for a matrix (row-wise)
// Note: This is used *within* the attention mechanism, not for the final prediction.
fn softmax(matrix: &DMatrix<f32>) -> DMatrix<f32> {
    let mut result = DMatrix::zeros(matrix.nrows(), matrix.ncols());
    for r in 0..matrix.nrows() {
        let row = matrix.row(r);
        let max_val = row.max(); // For numerical stability
        let exp_row = row.map(|x| (x - max_val).exp());
        let sum_exp_row = exp_row.sum();
        // Handle potential division by zero if all inputs are -inf (though unlikely here)
        if sum_exp_row > 0.0 {
            result.set_row(r, &(exp_row / sum_exp_row));
        } else {
            // Assign uniform probability if sum is zero (e.g., all inputs were -inf)
             result.row_mut(r).fill(1.0 / matrix.ncols() as f32);
        }
    }
    result
}

// Linear layer: y = x @ w + b
fn linear(x: &DMatrix<f32>, w: &DMatrix<f32>, b: &DVector<f32>) -> DMatrix<f32> {
    // Ensure matrix dimensions are compatible for multiplication
    assert_eq!(x.ncols(), w.nrows(), "linear matmul: x.ncols ({}) != w.nrows ({})", x.ncols(), w.nrows());
    // Ensure bias vector dimension matches output dimension
    assert_eq!(w.ncols(), b.len(), "linear bias: w.ncols ({}) != b.len ({})", w.ncols(), b.len());

    let mut result = x * w;
    // Add bias vector b to each row
    for r in 0..result.nrows() {
        // Get a mutable reference to the current row
        let mut row_mut = result.row_mut(r);
        // Add the bias vector (transposed to act as a row vector)
        row_mut += b.transpose();
    }
    result
}


// --- Transformer Block Structure ---
// [n_seq, n_embd] -> [n_seq, n_embd]
fn transformer_block(x: &DMatrix<f32>, weights: &TransformerBlockWeights) -> DMatrix<f32> {
    // Pass input through the causal self-attention mechanism
    let attention_output = causal_self_attention(x, &weights.attn); // Defined next

    // Add the output back to the input (Residual Connection)
    x + attention_output
}
```

## Step 4: Causal Self-Attention - The Core Mechanism

This is the most intricate part. Attention takes the input sequence embeddings `x` and calculates Query (`q`), Key (`k`), and Value (`v`) vectors for each position.

The formula is: `Attention(Q, K, V) = softmax( (Q @ K.T / sqrt(d_k)) + mask ) @ V`

Let's break down how we generate Q, K, V and why.

### 4.1 QKV Projection (`c_attn`)

We use a single linear layer (`c_attn`) to project our input embeddings `x` (`[n_seq, n_embd]`) into a combined QKV matrix (`[n_seq, 3 * n_embd]`). We then split this into Q, K, and V matrices, each of shape `[n_seq, n_embd]`.

The weights of `c_attn` (`c_attn.w` of shape `[n_embd, 3 * n_embd]` and `c_attn.b` which is zero) are hand-crafted to achieve specific goals:

*   **Goal for K (Key):** Extract the *position* information (the one-hot encoding in dims 0-4) for each token. This is what each token "offers" or "announces" – its position.
*   **Goal for Q (Query):** For a given token, create a query that looks for the positions of the *two most recent* tokens (including itself). This is what each token is "looking for".
*   **Goal for V (Value):** Extract the *token* information, but transform it. We want 'a' (dim 5) to become `+1` in our scratch space (dim 7) and 'b' (dim 6) to become `-1` in the scratch space. This encoding is crucial for our prediction logic later.

Here are the carefully crafted `c_attn.w` weights (defined inside the `load_model_weights` function):

```rust
    // In load_model_weights()...
    // c_attn_w: [N_EMBED, 3 * N_EMBED] = [8, 24]
    // Each row corresponds to an input embedding dimension.
    // Each column corresponds to an output Q, K, or V dimension.
    let c_attn_w_data = vec![
        // Input Dim 0 (Pos 0 Embed):
        // Q wants Pos 0 (large value in q[0])
        // K offers Pos 0 (value 1 in k[0])
        // V is ignored
        /* Q[0-7] */ LG, 0., 0., 0., 0., 0., 0., 0.,   /* K[0-7] */ 1., 0., 0., 0., 0., 0., 0., 0.,   /* V[0-7] */ 0., 0., 0., 0., 0., 0., 0., 0.,
        // Input Dim 1 (Pos 1 Embed):
        // Q wants Pos 0 & Pos 1 (large values in q[0], q[1])
        // K offers Pos 1 (value 1 in k[1])
        // V ignored
        /* Q */ LG, LG, 0., 0., 0., 0., 0., 0.,   /* K */ 0., 1., 0., 0., 0., 0., 0., 0.,   /* V */ 0., 0., 0., 0., 0., 0., 0., 0.,
        // Input Dim 2 (Pos 2 Embed):
        // Q wants Pos 1 & Pos 2
        // K offers Pos 2
        // V ignored
        /* Q */ 0., LG, LG, 0., 0., 0., 0., 0.,   /* K */ 0., 0., 1., 0., 0., 0., 0., 0.,   /* V */ 0., 0., 0., 0., 0., 0., 0., 0.,
        // Input Dim 3 (Pos 3 Embed):
        // Q wants Pos 2 & Pos 3
        // K offers Pos 3
        // V ignored
        /* Q */ 0., 0., LG, LG, 0., 0., 0., 0.,   /* K */ 0., 0., 0., 1., 0., 0., 0., 0.,   /* V */ 0., 0., 0., 0., 0., 0., 0., 0.,
        // Input Dim 4 (Pos 4 Embed):
        // Q wants Pos 3 & Pos 4
        // K offers Pos 4
        // V ignored
        /* Q */ 0., 0., 0., LG, LG, 0., 0., 0.,   /* K */ 0., 0., 0., 0., 1., 0., 0., 0.,   /* V */ 0., 0., 0., 0., 0., 0., 0., 0.,
        // Input Dim 5 (Token 'a' Embed):
        // Q ignored
        // K ignored
        // V maps 'a' to +1 in v[7] (scratch space)
        /* Q */ 0., 0., 0., 0., 0., 0., 0., 0.,   /* K */ 0., 0., 0., 0., 0., 0., 0., 0.,   /* V */ 0., 0., 0., 0., 0., 0., 0., 1.,
        // Input Dim 6 (Token 'b' Embed):
        // Q ignored
        // K ignored
        // V maps 'b' to -1 in v[7] (scratch space)
        /* Q */ 0., 0., 0., 0., 0., 0., 0., 0.,   /* K */ 0., 0., 0., 0., 0., 0., 0., 0.,   /* V */ 0., 0., 0., 0., 0., 0., 0., -1.,
        // Input Dim 7 (Scratch Space):
        // Ignored everywhere
        /* Q */ 0., 0., 0., 0., 0., 0., 0., 0.,   /* K */ 0., 0., 0., 0., 0., 0., 0., 0.,   /* V */ 0., 0., 0., 0., 0., 0., 0., 0.,
    ];
    // nalgebra needs weights W in shape [in_dim, out_dim] for `X @ W`
    let c_attn_w = DMatrix::from_row_slice(N_EMBED, 3 * N_EMBED, &c_attn_w_data);

    // Bias is zero
    let c_attn_b = DVector::<f32>::zeros(3 * N_EMBED);
```

### 4.2 Calculating Attention Scores (`Q @ K.T`)

The core of attention is matching Queries and Keys. We compute `scores = Q @ K.T`. `K.T` has shape `[n_embd, n_seq]`. So, `scores` has shape `[n_seq, n_seq]`.

`scores[i, j]` represents how much position `i` (the query) should attend to position `j` (the key).

Because of our hand-crafted Q and K:
*   `Q` has large values (`LG`) in the dimensions corresponding to the two most recent positions.
*   `K` has a `1` in the dimension corresponding to its *own* position.
*   When we multiply `Q[i]` by `K[j].T`, we get a large score (`LG`) only if position `i` is querying a position `j` that is one of the two most recent positions relative to `i`.

Example for input "aabaa" (`n_seq = 5`):
`Q @ K.T` will look something like (ignoring scaling and mask for now):

```
      Attend to pos: 0    1    2    3    4
Query from pos 0: [ LG,   0,   0,   0,   0 ]  <- Looks only at pos 0
Query from pos 1: [ LG,  LG,   0,   0,   0 ]  <- Looks at pos 0, 1
Query from pos 2: [  0,  LG,  LG,   0,   0 ]  <- Looks at pos 1, 2
Query from pos 3: [  0,   0,  LG,  LG,   0 ]  <- Looks at pos 2, 3
Query from pos 4: [  0,   0,   0,  LG,  LG ]  <- Looks at pos 3, 4
```

### 4.3 Causal Masking

We need to prevent positions from attending to *future* positions (otherwise, the model could just copy the next token during training). We add a mask before the softmax:

```rust
    // Inside causal_self_attention function...
    let n_seq = x.nrows();
    // Create a mask matrix [n_seq, n_seq].
    // This variable is not modified after creation, so `mut` is removed.
    let causal_mask = DMatrix::from_fn(n_seq, n_seq, |r, c| {
        // If column index `c` (key position) is greater than row index `r` (query position),
        // set mask value to a large negative number to zero out attention after softmax.
        if c > r { -1e10 } else { 0.0 } // -1e10 acts like -infinity
    });
```

Adding this mask ensures that `softmax(scores + mask)` will result in zeros for all future positions.

### 4.4 Softmax and Scaling

We scale the scores by `sqrt(d_k)` (where `d_k` is the dimension of K, which is `N_EMBED=8`) before the softmax. This helps stabilize gradients during real training but doesn't affect our manual logic much. The `softmax` function (our matrix version defined earlier) converts the scores into attention *weights* that sum to 1 across each row.

`attention_weights = softmax( (Q @ K.T / sqrt(d_k)) + mask )`

For our example, `attention_weights` becomes:

```
      Attend to pos: 0    1    2    3    4
Query from pos 0: [ 1.0, 0.0, 0.0, 0.0, 0.0 ]
Query from pos 1: [ 0.5, 0.5, 0.0, 0.0, 0.0 ]
Query from pos 2: [ 0.0, 0.5, 0.5, 0.0, 0.0 ]
Query from pos 3: [ 0.0, 0.0, 0.5, 0.5, 0.0 ]
Query from pos 4: [ 0.0, 0.0, 0.0, 0.5, 0.5 ]
```
Each row now shows how the attention is distributed over previous (and current) tokens.

### 4.5 Applying Attention to Values (`... @ V`)

The final step is to multiply the `attention_weights` by the `V` matrix:
`attention_result = attention_weights @ V`

`attention_weights` is `[n_seq, n_seq]`, `V` is `[n_seq, n_embd]`. The result is `[n_seq, n_embd]`.

Each row `i` of the `attention_result` is a weighted sum of the rows of `V`, where the weights come from `attention_weights[i]`.

Recall our `V` matrix has the token identity encoded as `+1` (for 'a') or `-1` (for 'b') in dimension 7. Let's see what happens for row 2 (predicting after seeing "aa"):

*   `attention_weights[2] = [0.0, 0.5, 0.5, 0.0, 0.0]` (Incorrect in previous analysis, should attend to 0 and 1)
*   *Corrected Analysis for Row 2 (predicting after "aa", query from Pos 2):*
    *   `attention_weights[2] = [0.0, 0.5, 0.5, 0.0, 0.0]` <- This IS correct based on the Q/K matrix multiplication result shown earlier. The query from position 2 looks at keys from position 1 and 2.
    *   Input was "aab", `V` rows (focusing on dim 7):
        *   `V[0]` (pos 0, 'a'): `[..., +1]`
        *   `V[1]` (pos 1, 'a'): `[..., +1]`
        *   `V[2]` (pos 2, 'b'): `[..., -1]`
    *   `attention_result[2]` calculation for dimension 7:
        `= 0.0 * V[0, 7] + 0.5 * V[1, 7] + 0.5 * V[2, 7] + 0.0 * ...`
        `= 0.5 * (+1) + 0.5 * (-1)` (Attending to 'a' at pos 1 and 'b' at pos 2)
        `= 0.0`

Now for row 3 (predicting after seeing "aab", query from Pos 3):
*   `attention_weights[3] = [0.0, 0.0, 0.5, 0.5, 0.0]`
*   `V` rows:
    *   `V[1]` (pos 1, 'a'): `[..., +1]`
    *   `V[2]` (pos 2, 'b'): `[..., -1]`
    *   `V[3]` (pos 3, 'a'): `[..., +1]`
*   `attention_result[3]` calculation for dimension 7:
    `= 0.0 * ... + 0.5 * V[2, 7] + 0.5 * V[3, 7] + 0.0 * ...`
    `= 0.5 * (-1) + 0.5 * (+1)` (Attending to 'b' at pos 2 and 'a' at pos 3)
    `= 0.0`

*Revisiting Row 1 (predicting after "a", query from Pos 1):*
*   `attention_weights[1] = [0.5, 0.5, 0.0, 0.0, 0.0]`
*   `V` rows:
    *   `V[0]` (pos 0, 'a'): `[..., +1]`
    *   `V[1]` (pos 1, 'a'): `[..., +1]`
*   `attention_result[1]` calculation for dimension 7:
    `= 0.5 * V[0, 7] + 0.5 * V[1, 7] + 0.0 * ...`
    `= 0.5 * (+1) + 0.5 * (+1)` (Attending to 'a' at pos 0 and 'a' at pos 1)
    `= 1.0`

Okay, the logic holds! The value in dimension 7 of the attention result becomes:
*   `1.0` if the two attended tokens were the same ('aa').
*   `0.0` if the two attended tokens were different ('ab' or 'ba').

This perfectly captures our rule: predict 'b' (which we'll associate with `1.0`) if previous two were 'aa', otherwise predict 'a' (associated with `0.0`).

### 4.6 Causal Self-Attention Function Implementation

```rust
// The attention calculation function itself
// q: [n_q, d_k], k: [n_k, d_k], v: [n_k, d_v], mask: [n_q, n_k] -> [n_q, d_v]
fn attention(
    q: &DMatrix<f32>, k: &DMatrix<f32>, v: &DMatrix<f32>, mask: &DMatrix<f32>,
) -> DMatrix<f32> {
    // Ensure compatible dimensions
    assert_eq!(q.ncols(), k.ncols(), "attention Q/K: q.ncols ({}) != k.ncols ({})", q.ncols(), k.ncols());
    assert_eq!(k.nrows(), v.nrows(), "attention K/V: k.nrows ({}) != v.nrows ({})", k.nrows(), v.nrows());
    assert_eq!(q.nrows(), mask.nrows(),"attention Q/Mask: q.nrows ({}) != mask.nrows ({})", q.nrows(), mask.nrows());
    assert_eq!(k.nrows(), mask.ncols(),"attention K/Mask: k.nrows ({}) != mask.ncols ({})", k.nrows(), mask.ncols());
    // Assuming d_v = N_EMBED for this specific model
    assert_eq!(v.ncols(), N_EMBED, "attention V shape: v.ncols ({}) != N_EMBED ({})", v.ncols(), N_EMBED);


    let d_k = q.ncols() as f32; // Dimension of keys, used for scaling
    // 1. Calculate scores: Q @ K.T
    let scores = q * k.transpose();
    // 2. Scale and apply mask
    let scaled_masked_scores = (scores / d_k.sqrt()) + mask;
    // 3. Apply softmax row-wise using our matrix softmax helper
    let weights = softmax(&scaled_masked_scores);
    // 4. Multiply weights by V
    weights * v
}


// The main causal self-attention function using the weights
// [n_seq, n_embd] -> [n_seq, n_embd]
fn causal_self_attention(x: &DMatrix<f32>, weights: &CausalSelfAttentionWeights) -> DMatrix<f32> {
    let n_seq = x.nrows();
    assert_eq!(x.ncols(), N_EMBED, "causal_self_attention input shape: x.ncols ({}) != N_EMBED ({})", x.ncols(), N_EMBED);

    // 1. QKV Projection: x @ c_attn.w + c_attn.b
    // Result shape: [n_seq, 3 * n_embd]
    let qkv = linear(x, &weights.c_attn_w, &weights.c_attn_b);
    assert_eq!(qkv.nrows(), n_seq, "causal_self_attention qkv shape: qkv.nrows ({}) != n_seq ({})", qkv.nrows(), n_seq);
    assert_eq!(qkv.ncols(), 3 * N_EMBED, "causal_self_attention qkv shape: qkv.ncols ({}) != 3*N_EMBED ({})", qkv.ncols(), 3 * N_EMBED);

    // 2. Split into Q, K, V matrices
    // Each shape: [n_seq, n_embd]
    let q = qkv.columns(0, N_EMBED).clone_owned();
    let k = qkv.columns(N_EMBED, N_EMBED).clone_owned();
    let v = qkv.columns(2 * N_EMBED, N_EMBED).clone_owned();

    // 3. Create Causal Mask [n_seq, n_seq]
    let causal_mask = DMatrix::from_fn(n_seq, n_seq, |r, c| {
        if c > r { -1e10 } else { 0.0 }
    });

    // 4. Perform Attention Calculation
    // Result shape: [n_seq, n_embd]
    let attention_result = attention(&q, &k, &v, &causal_mask);
    assert_eq!(attention_result.nrows(), n_seq, "causal_self_attention attn_result shape: attention_result.nrows ({}) != n_seq ({})", attention_result.nrows(), n_seq);
    assert_eq!(attention_result.ncols(), N_EMBED, "causal_self_attention attn_result shape: attention_result.ncols ({}) != N_EMBED ({})", attention_result.ncols(), N_EMBED);


    // 5. Output Projection (c_proj) - linear layer
    // Result shape: [n_seq, n_embd]
    let output = linear(&attention_result, &weights.c_proj_w, &weights.c_proj_b);
    assert_eq!(output.nrows(), n_seq, "causal_self_attention output shape: output.nrows ({}) != n_seq ({})", output.nrows(), n_seq);
    assert_eq!(output.ncols(), N_EMBED, "causal_self_attention output shape: output.ncols ({}) != N_EMBED ({})", output.ncols(), N_EMBED);

    output
}
```

## Step 5: Output Projection (`c_proj`)

The `attention_result` matrix holds our prediction logic (0.0 or 1.0) in dimension 7. We need to project this back into our standard embedding space, specifically influencing the token dimensions (5 and 6).

We want:
*   If `attention_result[i, 7] == 0.0` (predict 'a'), the output embedding should strongly favor 'a' (dimension 5).
*   If `attention_result[i, 7] == 1.0` (predict 'b'), the output embedding should strongly favor 'b' (dimension 6).

We use another linear layer, `c_proj`, for this. Its weights (`c_proj.w` of shape `[n_embd, n_embd]` and `c_proj.b` of shape `[n_embd]`) are designed as follows:

*   **Bias (`c_proj.b`):** Set dimension 5 ('a' token) to `LG` by default. `[0, 0, 0, 0, 0, LG, 0, 0]`
*   **Weights (`c_proj.w`):** Mostly zeros, *except* for the row corresponding to the input dimension 7 (our attention result). This row is `[0, 0, 0, 0, 0, -LG, LG, 0]`.

What does `attention_result @ c_proj.w + c_proj.b` do?
Let `pred = attention_result[i, 7]` (which is 0.0 or 1.0).
The output for row `i` will be approximately:
*   Output dimension 5 ('a'): `bias[5] + pred * weight[7, 5] = LG + pred * (-LG)`
*   Output dimension 6 ('b'): `bias[6] + pred * weight[7, 6] = 0 + pred * (LG)`

Let's trace:
*   If `pred == 0.0` (predict 'a'):
    *   Output dim 5 = `LG + 0.0 * (-LG) = LG`
    *   Output dim 6 = `0 + 0.0 * (LG) = 0`
    *   Result strongly indicates 'a'.
*   If `pred == 1.0` (predict 'b'):
    *   Output dim 5 = `LG + 1.0 * (-LG) = 0`
    *   Output dim 6 = `0 + 1.0 * (LG) = LG`
    *   Result strongly indicates 'b'.

Here are the weights added to `load_model_weights`:

```rust
    // Inside load_model_weights()...

    // --- Block 0 Weights (continued) ---
    // c_proj_w: [N_EMBED, N_EMBED] = [8, 8]
    // Takes attention result (esp. dim 7) and maps it back to token dims 5 & 6
    let c_proj_w_data = vec![
        // Input dims 0-6 map to all zeros
        0., 0., 0., 0., 0., 0., 0., 0., // Input dim 0 -> Output dims 0-7
        0., 0., 0., 0., 0., 0., 0., 0., // Input dim 1 -> Output dims 0-7
        0., 0., 0., 0., 0., 0., 0., 0., // ...
        0., 0., 0., 0., 0., 0., 0., 0.,
        0., 0., 0., 0., 0., 0., 0., 0.,
        0., 0., 0., 0., 0., 0., 0., 0., // Input dim 5 -> Output dims 0-7
        0., 0., 0., 0., 0., 0., 0., 0., // Input dim 6 -> Output dims 0-7
        // Input dim 7 (attention result):
        // Map prediction (0 or 1) to dims 5 ('a') and 6 ('b').
        // If input is 1 (predict 'b'), add -LG to 'a' dim, +LG to 'b' dim.
        /* Output dims: 0, 1, 2, 3, 4,  5,  6, 7 */
                          0.,0.,0.,0.,0.,-LG, LG, 0.,
    ];
    let c_proj_w = DMatrix::from_row_slice(N_EMBED, N_EMBED, &c_proj_w_data);

    // c_proj_b: [N_EMBED] = [8]
    // Bias towards predicting 'a' (dim 5) by default
    let c_proj_b_data = vec![0.0, 0.0, 0.0, 0.0, 0.0, LG, 0.0, 0.0];
    let c_proj_b = DVector::from_vec(c_proj_b_data);

    // Package the weights for the single block
    let block0 = TransformerBlockWeights {
        attn: CausalSelfAttentionWeights {
            c_attn_w, c_attn_b, c_proj_w, c_proj_b,
        }
    };

    // Add the block to the model weights collection
    ModelWeights { wte, wpe, blocks: vec![block0] } // Complete ModelWeights return
```

## Step 6: Residual Connection and Final Output

Remember the transformer block calculation: `x = x + attention_output`. The `attention_output` is the result from `c_proj`. We add the original input `x` back.

Why did we use the large factor `LG=1024.0` in `c_proj`? To ensure that the prediction signal from the attention mechanism *dominates* the original token/position information present in `x` when we do this addition. The residual connection helps with training deeper networks, but here it mostly just adds noise we need to overwhelm.

Finally, the `gpt` function takes the output of the transformer block (`current_x`) and projects it to vocabulary space using `current_x @ weights.wte.transpose()`. This gives us the final logits (`[n_seq, n_vocab]`).

## Step 7: Inference - Predicting the Next Token

To actually predict, we take the logits corresponding to the *last* input token. Since we need probabilities to choose the most likely next token, we apply the softmax calculation *directly to this final logit vector*. We don't use our matrix `softmax` function here, as that operates row-wise on potentially multiple logit vectors. After calculating the probabilities for the next token, we find the token ID with the highest probability (argmax).

```rust
// --- Inference Functions ---

// Predict the next token ID for a given context string
fn predict(s: &str, weights: &ModelWeights) -> Result<usize, String> {
    let tokens = tokenize(s)?;
    // Take last N_CTX tokens as context
    let context = if tokens.len() > N_CTX {
        &tokens[tokens.len() - N_CTX ..]
    } else {
        &tokens[..]
    };

    // Handle empty context - predict 'a' by default for this task
    if context.is_empty() {
        return Ok(0); // Predict 'a'
    }

    // Run the model to get logits for the entire context sequence
    let logits = gpt(context, weights); // Shape [context_len, n_vocab]

    // Get the logits for the *last* token in the input sequence as a row view
    let last_logits_row_view = logits.row(logits.nrows() - 1); // Type: MatrixView<...>

    // --- Calculate softmax directly on this final logit vector ---
    // 1. Find max value for numerical stability
    let max_val = last_logits_row_view.max();
    // 2. Compute exponentials (results in an owned RowVector)
    let exp_vals = last_logits_row_view.map(|x| (x - max_val).exp());
    // 3. Compute sum of exponentials
    let sum_exp_vals = exp_vals.sum();

    // Handle potential case where sum is zero (e.g., all logits were -inf)
    let probs_vector = if sum_exp_vals > 0.0 {
        exp_vals / sum_exp_vals
    } else {
        // Assign uniform probability if sum is zero
        DVector::<f32>::from_element(N_VOCAB, 1.0 / N_VOCAB as f32)
    };
    // --- End of direct softmax calculation ---

    // Find the index (token ID) of the maximum probability (argmax)
    // Use iter() on the resulting probability vector
    let (pred_idx, _max_prob) = probs_vector
        .iter()
        .enumerate()
        .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap_or(Ordering::Equal))
         // This unwrap is safe because N_VOCAB >= 1, so there's always a max element.
        .unwrap();

    Ok(pred_idx)
}

// Generate a sequence continuation
fn complete(s: &str, max_new_tokens: usize, weights: &ModelWeights) -> Result<String, String> {
    let mut tokens = tokenize(s)?;
    let initial_len = tokens.len();

    for _ in 0..max_new_tokens {
        // Use the current sequence (converted back to string) to predict the next token
        // Note: More efficient would be to pass tokens directly if predict supported it
        let context_str = tokens.iter().map(|&t| untok(t).unwrap()).collect::<String>();
        let next_token = predict(&context_str, weights)?;
        tokens.push(next_token);
    }

    // Extract the newly generated part
    let generated_part = tokens[initial_len..]
        .iter()
        .map(|&t| untok(t).unwrap())
        .collect::<String>();

    Ok(format!("{} :: {}", s, generated_part))
}
```

## Running the Code

Add a `main` function to tie it all together and test it:

```rust
// --- Main Function and Testing ---
fn main() -> Result<(), String> {
    println!("Loading hand-crafted model weights...");
    let weights = load_model_weights();
    println!("Weights loaded.");

    println!("\n--- Running Completions ---");
    println!("{}", complete("a", 10, &weights)?);
    println!("{}", complete("aa", 10, &weights)?);
    println!("{}", complete("aab", 10, &weights)?);
    println!("{}", complete("ba", 10, &weights)?);
    println!("{}", complete("abaab", 10, &weights)?);
    println!("Testing Out-of-Domain Recovery:");
    println!("{}", complete("ababa", 10, &weights)?); // OOD example
    println!("{}", complete("bbbbb", 10, &weights)?); // OOD example

    println!("\n--- Running Accuracy Test ---");
    let test_sequence = "aab".repeat(10); // e.g., "aabaabaabaabaabaabaab..."
    let test_tokens = tokenize(&test_sequence)?;
    let mut total = 0;
    let mut correct = 0;

    // Start predicting from index 2 (need two previous tokens for the rule)
    for i in 2..test_tokens.len() {
        let context_tokens = &test_tokens[..i];
        // Convert current token context back to string for predict()
        let context_string = context_tokens.iter().map(|&t| untok(t).unwrap()).collect::<String>();

        let expected_token = test_tokens[i];
        let predicted_token = predict(&context_string, &weights)?;

        total += 1;
        if predicted_token == expected_token {
            correct += 1;
        }
        // Optional: Print step-by-step predictions
        // println!("Context: '{}', Expected: {}, Predicted: {}",
        //     context_string, untok(expected_token)?, untok(predicted_token)?);
    }

    if total > 0 {
        println!(
            "ACCURACY on 'aab' pattern: {:.1}% ({:.0} / {:.0})",
            (correct as f64 / total as f64) * 100.0,
            correct,
            total
        );
    } else {
         println!("No accuracy test cases run.");
    }

    Ok(())
}
```

Now, run it with `cargo run --release` (or `cargo run` for faster compiles during development):

```bash
# Example output (using debug build for speed, release recommended for final check)
cargo run
   Compiling handmade_transformer_rust v0.1.0 (...)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in ...s
     Running `target/debug/handmade_transformer_rust`
Loading hand-crafted model weights...
Weights loaded.

--- Running Completions ---
a :: baabaabaab
aa :: baabaabaab
aab :: aabaabaaba
ba :: abaabaabaa
abaab :: aabaabaaba
Testing Out-of-Domain Recovery:
ababa :: abaabaabaa
bbbbb :: aabaabaaba

--- Running Accuracy Test ---
ACCURACY on 'aab' pattern: 100.0% (28 / 28)
```

Success! Our hand-crafted transformer correctly learned the `aab` pattern.

## Conclusion & Takeaways

We successfully built a minimal transformer decoder block entirely by hand in Rust, programming its weights to solve a specific sequence prediction task.

Key Intuitions Gained:

*   **Embeddings Matter:** The initial representation combining token and position info is the foundation.
*   **QKV are Engineered:** Q, K, and V aren't random; they are projections designed to extract specific information (position, identity) and formulate queries (look back).
*   **Attention is Weighted Sum:** The `softmax(Q@K.T)` creates weights, telling the model *how much* to pay attention to the Value (`V`) of each relevant previous token.
*   **Value Transformation:** The `V` matrix doesn't have to be just the input embedding; we transformed the token identity into a +/- 1 signal perfect for our logic.
*   **Additive Cancellation:** We used the `0.5 * (+1) + 0.5 * (-1) = 0` trick within the attention mechanism itself to implement the core prediction rule.
*   **Projection and Residuals:** Output projection maps the attention result back, and large scaling factors help overcome noise from residual connections in simple models.
*   **Context Matters (Types):** We saw how the specific matrix/vector types in `nalgebra` (dynamic vs. static dimensions) affected how we needed to implement the final softmax calculation.

This tiny model won't write Shakespeare, but the underlying *mechanics* are the same ones scaled up in giant LLMs. By building it ourselves, the "magic" feels a little less magical and more like clever, interlocking linear algebra.

Feel free to experiment! Can you modify the weights to predict `ababab...`? Or `aaab`? It's a great way to solidify your understanding.

## Acknowledgements

*   This project is a Rust implementation based entirely on the concepts and weights brilliantly explained by **Theia Vogel** in ["I made a transformer by hand (no training!)"](https://vgel.me/posts/handmade-transformer/).
*   The code structure is inspired by **Jay Mody's** clear and concise [picoGPT](https://github.com/jaymody/picoGPT).
