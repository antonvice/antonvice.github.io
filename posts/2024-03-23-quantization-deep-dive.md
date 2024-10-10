# Quantization Deep Dive

*Published on March 23, 2024*

section-divider

------------------------------------------------------------------------

 section-content

## Quantization Deep Dive 

## TL;DR: 

The discussed texts explore advanced quantization techniques for large
language models (LLMs), focusing on reducing model size and
computational demands while retaining performance. Methods like
Quantize-Aware Training, GPTQ, SPQR, and QLoRA offer strategies for
near-lossless weight compression, handling of outliers, and efficient
fine-tuning. These techniques utilize a mix of sparse representations,
block-wise quantization, and specialized data formats (e.g., NF4, BF16)
to address the challenges of quantizing high-parameter models without
significant quality loss. These approaches highlight the importance of
strategic quantization in enhancing the efficiency of AI models, making
them more accessible for deployment across various platforms, including
those with limited computational resources.

 section-divider

------------------------------------------------------------------------

 section-content

**Hello! My name is Anton**, and I work in ML infrastructure
development. One of my tasks in the line of work is model quantization.
Since user devices have limited resources, it is a good idea to save
resources through quantization.

For the past year, I was very impressed by stories where people take
giant neural networks, quantize them to 4 bits, and manage to run them
on laptops. I decided to understand how this is done and gathered
material for a presentation for colleagues and friends. Now I am sharing
this knowledge with you.

I hope diving into the topic of quantization will be interesting both
for specialists and enthusiasts in the field of neural network training.
I tried to write an article that I would like to read myself when I just
started learning how to make models work more efficiently. In it, we
will thoroughly discuss why quantization is needed and when is the best
time to quantize a model, as well as look at different data types and
modern quantization methods.

 section-divider

------------------------------------------------------------------------

 section-content

## What is quantization and how does it work? 

**Quantization** is the process of converting values from a
representation with a large amount of information (usually a continuous
set) to a more compact representation, usually from a discrete set. A
clear example of quantization is the discretization of an analog signal,
where each value of the continuous signal is assigned a value from a
pre-defined discrete set.

In the context of neural networks, quantization means transitioning from
a data type with a larger number of bits, such as float32, to a type
with fewer bits, such as int8. In this article, we will explore the key
ideas of quantizing neural network models with a focus on LLM.


![](https://cdn-images-1.medium.com/max/800/1*tM8-m_-nEZY6Cf3raeQCCg.png)
*Analog Signal Sampling*


**Why is quantization needed at all?**

It allows for \$\$\$aving\$\$\$. Quantized models require less
computational resources and work faster. As a result, they save money
and improve user experience.

Researchers and enthusiasts without a personal GPU cluster have the
opportunity to experiment with large modern models. This means that
computations can be efficiently performed right on user devices.

**Linear Quantization**

There are different approaches to quantization. For example, through
clustering or matrix factorization. In this article, we will focus on
linear quantization as the most popular and proven effective method.

**Affine Quantization**

Affine, or asymmetric, quantization maps an asymmetric range to a k-bit
data type. Consider the real range of values \[R_min, R_max\].


![](https://cdn-images-1.medium.com/max/800/1*xCW4fOZUPAgNCOd2DpIf5Q.png)


Once a tensor is quantized, converting it back to real values is
straightforward. You need to subtract the zero-point and multiply the
result by the scale. From this, it's easy to understand how to get a
quantized tensor from a real tensor.


![](https://cdn-images-1.medium.com/max/800/1*-iAc_2DOxDrOLta8941G4g.png)


S and Z are quantization constants, i.e., parameters that are calculated
in the process. S is the scale, which accounts for the transformation
scale.


![](https://cdn-images-1.medium.com/max/800/1*S5WmbQJpCSg_X0WPCRvdxg.png)


**Precision is needed here**, so the original, real data type is used
for storage.

Z is the zero-point, corresponding to the zero value, where ⌊⌉⌊⌉ is
rounding.


![](https://cdn-images-1.medium.com/max/800/1*_1xOlXPPyk6wKiT9t2B4iw.png)


Accurate zero representation is very important for neural networks.
Rounding can be done differently: down, to the nearest integer,
stochastically. Z is typically stored in the quantized data type.

**Quantization:**


![](https://cdn-images-1.medium.com/max/800/1*2CfxV4sEQdkRArFXOSQiQg.png)


**Dequantization:**


![](https://cdn-images-1.medium.com/max/800/1*iy2rDMSaCb8TSJUwRt_Dig.png)


Affine quantization is well-suited for asymmetric distributions, such as
the output of ReLU.

## Symmetric Quantization 

## Symmetric quantization maps a range symmetric to zero. 

The zero of the real type is mapped to the zero of the quantized type.
The boundaries of the quantized range are determined as the maximum
absolute quantizable value


![](https://cdn-images-1.medium.com/max/800/1*_H9C0-kwciJGULTphgqcHQ.png)


To make the type symmetric, one value in the quantized data type is
omitted. For example, the range of signed int8: \[-128, 127\] becomes
\[-127, 127\].

**Constants:**


![](https://cdn-images-1.medium.com/max/800/1*_Usg-vbx-2asrVZCXQV9zQ.png)
*Z = 0*


**Quantization:**


![](https://cdn-images-1.medium.com/max/800/1*BwD8AJtxaQCZOfPMyk1EKg.png)


**Dequantization:**


![](https://cdn-images-1.medium.com/max/800/1*XWBpvyYisd2VT1po3eaS7w.png)


The difference from affine quantization formulas lies in the absence of
Z. Affine quantization has the advantage of being more accurate and
better handling asymmetric distributions, while symmetric quantization
benefits from simplicity and speed. This approach does not require
storing the zero-point, and dequantization is simply a matter of
multiplying the tensor by a constant.

## How to quantize a real tensor into int8: 

A neural network can be viewed as a sequence of operations on tensors of
numbers. Let's consider a clear example of how to quantize a real tensor
of 32-bit floating-point numbers into 8-bit integers.

**Step 1.** Take the real tensor.\
**Step 2.** Find the maximum.


![](https://cdn-images-1.medium.com/max/800/1*91Jgh0Nk6uXUKYT4bKSc_A.png)


**Step 3**. Calculate S using the formula.\
**Step 4**. Quantize.


![](https://cdn-images-1.medium.com/max/800/1*q4peu5XpE5MefcnTv_ehSg.png)


Done. As a result, we have obtained an 8-bit integer tensor and a
quantization constant of 0.0077. Now we can store a smaller volume of
information and, if necessary, return to the original 32-bit
floating-point representation with some loss of precision.

## What to quantize to improve model efficiency ? 

The standard approach is to quantize the model weights. No additional
manipulations are needed; just use the formulas.

You can also quantize the outputs of layers --- **activations**. To do
this, you need to estimate the values that occur in the activation
tensors. How is this done? Run data from the training dataset through
the trained neural network and collect statistics. With this
information, find the constants. Done --- you're brilliant! This
approach is called static quantization.

With dynamic quantization, activations are quantized at inference. This
approach can offer better quality, but it comes with challenges: during
inference, constants must be found dynamically. This makes the method
more complex and computationally expensive, but the constants always
remain up-to-date.

## When is the best time to quantize a model? 

The network can be prepared for quantization during training, a method
called Quantize-Aware Training. Special blocks are embedded in the
neural network, and quantized inference is emulated during training.


![](https://cdn-images-1.medium.com/max/800/0*oZmgUmkTib1ysnDl.png)


## Quantize-Aware Training Scheme 

In the layers, the original, real weights are stored. Before performing
the *forward pass*, they are replaced with quantized values according to
formulas. Since the operation is non-differentiable, gradients are
passed directly to the real tensor. Similarly, for the quantization of
activations, special blocks are used.

Quantize-aware training is complex and requires more computational
resources, but the output is a model "adapted" to work with quantized
values and is potentially more accurate.

In the case of Post Training Quantization, an already trained model is
quantized. For the quantization of activations, data from a calibration
dataset is additionally run through the trained network, statistics are
collected on the tensors, and then quantization is performed. If only
the weights are quantized, no additional data is needed, as all the
information is already in the tensors. This method is simpler and faster
than Quantize-Aware but is less accurate.

## Seeking the Right Granularity 

A neural network can be quantized with different granularities. The
worst way is to quantize the entire network at once. In this case, you
will end up with one general S constant for the entire model. The
results of such manipulations will most likely be unsatisfactory.

It's possible to quantize tensors individually --- then each tensor will
get its constants. You can go further and quantize rows or columns
within each tensor. Accordingly, each row (column) will have its
constant in this case. They will need to be stored somewhere, but the
calculations will be more accurate.


![](https://cdn-images-1.medium.com/max/800/0*fRJPFpCdJZQEMaXv.png)


## Quantization Constants: by tensors, by rows, by columns 

Also, the tensor can be divided into blocks of a small size --- for even
more accuracy. This approach allows dealing with outliers in matrices,
which we will discuss further.


![](https://cdn-images-1.medium.com/max/800/0*lo740Hg8k7bdkkxK.png)


## Quantization Granularity 

So, the smaller the granularity, the fewer constants need to be stored,
and conversely, the higher the granularity, the closer the results of
quantized computations to the originals.

## Which dimensions to quantize models in 

Common sense suggests that any tensor can be quantized both by columns
and by rows. However, the physics of computation comes into play here.
It turns out that if efficient computations are needed, there are strict
limitations.


![](https://cdn-images-1.medium.com/max/800/0*yEip_C9LAG7HSfGt.png)


## Which dimensions to store the constants in 

Modern efficient GEMM (General Matrix Multiply) operations for quantized
matrices expect the quantization constants to relate to the outer
dimensions of the matrices. That is, they are not of the dimension
across which the multiplication occurs.

To understand why everything works this way, one must imagine how
matrices are stored in memory. For efficient computation, the processor
needs to operate sequential memory blocks and efficiently utilize
caches. For example, like this:


![](https://cdn-images-1.medium.com/max/800/0*ikvbYwU8IqunHX8n.png)


where S are the diagonal matrices of scale.

## Data Types 

In quantized neural network models, there are usually two types of data:

**Quantized type **--- in which the tensors are stored;

**Computation type **--- in which the computations are carried out.

Unfortunately, these two types do not always match. For example, your
hardware may not support operations in the sophisticated quantized type.
Efficient matrix multiplication kernels for the quantized type may
simply not exist. In such cases, the matrix needs to be converted into
the computation type before computations. The computation type also
allows avoiding overflow issues in activations since multiplying 8-bit
numbers will likely result in type overflow.

Let's examine the structure of the main data types.

## Int16/Int8/Int4 

These are the most common integer types. The range of values is

\[-2\^(n-1), 2(n-1) -1\]

The bit representation of Int16 can be schematically shown as 1 sign bit
and 15 value bits.


![](https://cdn-images-1.medium.com/max/800/0*VFRav7cQ10sco6SS.png)


The more bits, the more accurately the range of values can be
represented.

## Float32 

The floating-point type float32 is described by the IEEE-754 standard.
Here, the bit representation looks like this: 1 sign bit, 8 for the
exponent, and 23 for the mantissa.


![](https://cdn-images-1.medium.com/max/800/0*Ni_NY-t0jKKxcEea.png)


Formula:


![](https://cdn-images-1.medium.com/max/800/1*t3wHiYZdrsmrYxKeeNIg6A.png)


The key idea behind real types: the more bits allocated for the
exponent, the larger the range of values that can be represented. The
remaining bits for the mantissa determine the precision with which
values within the range are represented.

## Float16 

Described by the same IEEE-754 standard in its 2008 edition. Bit
representation: 1 sign bit, 5 exponent bits, and 10 mantissa bits.


![](https://cdn-images-1.medium.com/max/800/0*jQrxVZVTP6Yo9vf-.png)


The main problem with float16 is its small value range. The maximum
value is 65504, causing activation tensors to easily overflow.

## Bfloat16, or brain float 

A special data format developed by Google Brain. It can be considered an
approximation of float32. Bit representation is as follows: 1 sign bit,
8 exponent bits, and 7 mantissa bits.


![](https://cdn-images-1.medium.com/max/800/0*g-OIkA1b9L6rjiE-.png)


Note that the number of bits for the exponent matches the float32
representation. Thus, bfloat16 represents the same value range, albeit
less precisely. However, it is less prone to overflows in activations.

Another nice feature of bf16 is the ability to quickly convert values to
float32. The magic works thanks to the similar bit representation.
Unfortunately, not all hardware (especially mobile) currently works with
this type.

## TensorFloat32 

An interesting 19-bit data type from NVidia, supported in architectures
starting with NVidia Ampere (A-100). Bit representation: 1 sign bit, 8
exponent bits, 10 mantissa bits.


![](https://cdn-images-1.medium.com/max/800/0*hThAAgfR5Jwek8tb.png)


Key features:

-   [The number of exponent bits matches that of bfloat16, and thus
    float32;]
-   [The number of mantissa bits matches that of float16.]

This resulted in an unusual, but precise and efficient data type. It
shows excellent performance in computations and is suitable for training
models. The only drawback is its availability only on modern NVidia
GPUs.

## E4M3 and E5M2 

New 8-bit floats proposed by NVidia, ARM, and Intel in the paper FP8
Formats for Deep Learning. The authors suggest two possible 8-bit real
values:

-   [E4M3: 1 sign bit, 4 exponent bits, 3 mantissa bits;]
-   [E5M2: 1 sign bit, 5 exponent bits, 2 mantissa bits.]

Experiments show that modern LLMs and "image" networks can be
successfully inferred and even trained (!) on such data types. We are
waiting for widespread adoption and hardware support. There are also
more radical ideas for 4-bit real values: E2M1 and E3M0.

## NormalFloat4 

Normal Float 4 (NF4) is an intriguing example of creating a 4-bit data
type. Empirically, we know that the weights of neural networks are
normally distributed and concentrated around zero. The authors of the
article claim that NF4 is theoretically optimal for quantizing values
from the normal distribution N(0, 1) within the range \[-1, 1\]. There
are differing opinions regarding its optimality, but this does not
change the essence.

There are 4 bits --- which means 16 values. Two values are allocated for
-1 and 1 --- leaving 14. These are used to represent the quantiles of
N(0, 1) within the range \[-1, 1\].


![](https://cdn-images-1.medium.com/max/800/0*SLe_-pZU3DMcY9O8.png)
<figcaption>The points -1 and 1 in the normal distribution N(0, 1) are
not located there, but this illustration of the idea appears
more vivid.</figcaption>


The points -1 and 1 in the normal distribution N(0, 1) are not located
there, but this illustration of the idea looks more vivid. Each layer of
the neural network is normalized so that the weights fall within the
range \[-1, 1\]. After this, each weight can be matched with the nearest
value from the pre-calculated quantiles.

However, the described scheme has a drawback --- there is no precise
representation for zero. Precise zero value is critically important for
neural networks, so the authors propose a clever solution:

-   [The range \[-1, 1\] is divided into two parts, positive and
    negative.]
-   [Find 2\^ quantiles to the left.]
-   [Find 2\^ + 1 quantiles to the right.]
-   [The resulting values are joined at zero.]


![](https://cdn-images-1.medium.com/max/800/0*zsLc88uslGOujPr4.png)



![](https://cdn-images-1.medium.com/max/800/0*V5VsLLDkZPftVFRE.png)


This data type will be revisited in the discussion of QLoRA.

## Features of Quantizing Large Language Models 

Modern LLMs are **autoregressive**. This means they generate one token
at a time. Improper quantization increases the likelihood of generating
the wrong token. If the model starts veering off course during
generation, the result will be far from what the user needs. And, of
course, the quality metrics will also be off.

The bottleneck for large regression models is the process of
transferring large tensors in GPU memory. But with modern hardware's
computational resources, we can manage to compute something useful while
the transfer is happening.

However, due to memory requirements, large and resource-intensive models
need efficient quantization techniques. Quantize-aware training, which I
mentioned earlier, is not suitable here. And importantly, as the number
of parameters increases, standard quantization techniques stop working.
When crossing the threshold of 6.7 billion parameters, quantized models
lose all quality. This happens due to the growing number of outliers in
matrices, which we will discuss further.

## The Essence of the Outlier Problem 

Let's look again at the example of symmetric quantization from the
beginning of the article.


![](https://cdn-images-1.medium.com/max/800/0*lUsWFAPv_4B51Mnz.png)


What happens if an outlier enters the input tensor?


![](https://cdn-images-1.medium.com/max/800/0*ToHpwaDXwlxMT3Zt.png)


The weights "merge" into a narrow range and become indistinguishable.
The model's quality is lost. Thus, a single outlier ruins the entire
matrix.

Outliers make up only 0.1--1% of all values. The first thought that
comes to mind is to try to eliminate the outliers, for example, by
zeroing them. But this leads to complete model degradation, huge quality
losses, and an increase in perplexity.

If you conduct an experiment by zeroing a random subset of weights of
the same volume, the quality suffers insignificantly. This means
outliers are important, and we cannot simply discard them.

The nature of outliers and the fight against them are actively
researched, with some amusing articles on the topic occasionally
published.

To better understand the problem, let's consider the activation matrix.
Tokens are arranged by rows, and channels by columns. Research shows
that outliers in matrices are not randomly distributed; they have their
own structure:

-   [Outliers are predominantly located in activation tensors;]
-   [Outliers are concentrated in individual channels (columns).]

How to imagine this? There's an activation tensor at the output of a
certain layer:


![](https://cdn-images-1.medium.com/max/800/0*n-MG6dsllYNzTLT3.png)


If the tensor contains outliers, they are likely grouped in specific
channels.


![](https://cdn-images-1.medium.com/max/800/0*0tU3kwxTSifuEHQi.png)


At this point, it's worth recalling the different ways to quantize
tensors: by rows and columns. If it were possible to quantize the
activation matrix by columns, it would solve the problem. Empirically,
the column with outliers contains values from a similar range, meaning
constants can be selected with satisfactory quality.

But, as we've already discussed, for efficient computations in
inference, activation tensors need to be quantized by rows. Next, we
will consider current techniques for efficient quantization of large
language models and dealing with outliers.

## LLM.Int8 

The authors of [this
article,](https://arxiv.org/abs/2208.07339) which I recommend reading, learned to
quantize large (175 billion parameters) models from conventional 16- or
32-bit floating-point weights into an 8-bit integer type with virtually
no loss of quality. There's also a detailed post about this on the
[Hugging Face
blog](https://huggingface.co/blog/hf-bitsandbytes-integration#accelerate-is-all-you-need). The idea is that outliers need to be
handled separately since they make up a tiny fraction (0.1--1% of all
values) and are located in individual channels of activation tensors.

Consider multiplying the activation matrix X by the weight matrix W.
Columns of X are divided into two groups: those that contain at least
one outlier and those that do not. Different articles define outlier
values differently. In the article I refer to, the definition is simple:
outliers are values that are more than 6 in absolute value (science!).
Thus, two new matrices are obtained from the original weight matrix.


![](https://cdn-images-1.medium.com/max/800/0*sRj1agoTU1iV0Fh4.png)


Note that the i-th column of activations X interacts only with the i-th
row of weights W. Thus, the matrix W can also be divided into two parts,
separating the rows corresponding to the outlier columns of X.

So, we have two groups of matrices: with and without outliers. Now,
multiply each group separately and add the results. The result will be
equivalent to regular matrix multiplication.

Most values will fall into matrices that do not contain outliers, which
can be easily quantized into 8 bits and used for efficient operations.
Matrices with outliers are left in the original 16-bit type and are
calculated without loss of accuracy.

Paying for increased quantization accuracy comes at the cost of
performance. The authors' measurements show a slowdown in inference
speed on BLOOM-176B by 15--23% compared to the 16-bit default. For
smaller models, such as T5--3B, the slowdown is even more significant.

## SmoothQuant 

The SmoothQuant paper (which you can also explore on
[GitHub](https://github.com/mit-han-lab/smoothquant)) discusses how to quantize both weights
and activations.

With weights, it's simple: their distribution is almost certainly close
to normal, centered around zero, and does not contain outliers.

With activations, it's more complicated. Research shows that outliers
are mainly concentrated in activations. They can be 100 times or more
different from other values. The efficiency of quantizing tensors with
outliers is very low.


![](https://cdn-images-1.medium.com/max/800/0*cNLEZAZDCD849xXi.png)



![](https://cdn-images-1.medium.com/max/800/0*vcnL3zpSL6_drVCH.png)


Let's try to shift the problem from a problematic area to a healthier
one. We notice again that matrix multiplication can be accurately
decomposed into several products according to the corresponding columns
of the first matrix and rows of the second. Let's run batches through a
trained model of a test dataset and look at the activations.


![](https://cdn-images-1.medium.com/max/800/0*oQ3AShCtT-7xY3u_.png)


Let's closely examine the j-th column of the activation matrix ∣*X*∣ and
find the maximum absolute value max∣*X*:,*j*​∣. Divide all values in the
column by this value.


![](https://cdn-images-1.medium.com/max/800/0*M_GZcpt6lISNFmpO.png)


Multiply the corresponding row of the weight matrix :*Wj*,:​ by the same
value.


![](https://cdn-images-1.medium.com/max/800/0*5lqZH2k8adhYw6kD.png)


This way, we managed to eliminate the outlier in the activation matrix,
and the product *XW* remained unchanged! However, the problem has not
disappeared --- it has just moved to the weight matrix. Let's distribute
the problem between two matrices. Introduce a coefficient *sj*​ as the
ratio of the maxima of the corresponding row and column in the matrix
product.


![](https://cdn-images-1.medium.com/max/800/1*C7QCNQNuXP9FSSPYRmq6og.png)


Coefficient *alpha* allows for finer tuning, determining which matrix
will bear the greater load. The authors recommend simply taking 0.5.


![](https://cdn-images-1.medium.com/max/800/0*R4a1LLVXmAfVFHM1.png)


Now divide the j-th column of activations and multiply the j-th row of
weights by *sj*​.


![](https://cdn-images-1.medium.com/max/800/0*m_eYDmTV30sbJWFP.png)


If this manipulation is performed for all columns of *W*, the matrices
will be smoothed and ready for quantization.


![](https://cdn-images-1.medium.com/max/800/0*9OEC1WTyu6lAL6l8.png)



![](https://cdn-images-1.medium.com/max/800/0*bQB0nMxmB_-HeUfs.png)


The beauty of the method lies in the fact that all these operations are
performed offline. The *sj*​ constants can be baked into the weight
matrices. For the activation matrices --- just bake the corresponding
constants into the previous weight matrix. Thus, there are no overhead
costs during inference. Cool, isn't it?

## GPTQ: Quantization for Generative Pre-trained Transformers 

Let's consider whether we're even solving the right problem. Perhaps
rounding to the nearest integer is not the optimal approach. What we
really want is to find such a quantized weight matrix \^*W*\^ that,
after being multiplied by the activation matrix, produces a result as
close as possible to the original.


![](https://cdn-images-1.medium.com/max/800/1*xQ9J_rcKDEPArb9n9M0wDA.png)


In this formulation, the problem is NP-hard, meaning it's unclear how to
efficiently find an exact solution. One could try to find a suitable
solution with special solvers.

The key idea of the algorithm was described in 1990 in the paper
"Optimal Brain Damage." The authors solved the pruning problem: which
model weights can be zeroed without losing quality. For this, they
propose to assess the "importance" of elements in the weight matrix *W*.
Pruning implies that the least important weights can be removed. The
algorithm is as follows:

1.  [Train the model.]
2.  [Assess the importance of each weight in the neural network.]
3.  [Zero the least important weights.]
4.  [Go back to the first step and retrain the remaining
    weights.]


![](https://cdn-images-1.medium.com/max/800/0*CoVmk83Hm0WMVvzo.png)


## Pruning 

In the same year of 1990, the idea was further developed. The paper
"[Optimal Brain
Surgeon](https://proceedings.neurips.cc/paper/1992/file/303ed4c69846ab36c2904d3ba8573050-Paper.pdf)" came out, where the authors suggest
assessing the importance of weights through the inverted Hessian, to
achieve a high-quality result without retraining the network during
quantization.

Present days. The paper "Optimal Brain Quantization" extends OBS to
solve the quantization problem. How? It's necessary to determine the
importance of weights and quantize them from the least important to the
more important ones. Furthermore, the authors found a way to make this
procedure more efficient. The performance is sufficient for quantizing
ResNet or simple Bert models. But for LLMs, this algorithm is still too
cumbersome.


![](https://cdn-images-1.medium.com/max/800/0*GThFU11h71xk9UFS.png)


## Quantization 

The authors of GPTQ learned to solve the task quickly. A model with 176
billion parameters is quantized into 3--4 bits within a few hours on a
single A100. The mathematics behind it could fill a separate article, so
it's better to look for details in the original papers or on GitHub.

It's important to understand that weights are not quantized one by one,
as in OBS, but by columns --- one column at a time. Quantizing the model
one weight at a time would result in a set of constants comparable to
the original matrices, which would defeat the whole idea.

Data on speed:

-   [A100--3.25 speedup over FP16;]
-   [A6000--4.5 speedup over FP16.]

## SPQR: A Sparse-Quantized Representation for Near-Lossless LLM Weight Compression 

[SPQR](https://arxiv.org/abs/2306.03078) is a quantization method developed by
researchers from the Yandex Research team in collaboration with
co-authors from other companies. It is an example of a method that
combines all the ideas discussed above. It allows compressing LLM
weights into a 3- or 4-bit format with almost no loss of quality.

SPQR relies on two key ideas: outlier isolation and quantization in
small blocks. We have already encountered the first idea. However,
unlike LLM.Int8, here it is proposed not to isolate entire columns but
to separate only the outliers and store them in a sparse matrix.

For quantization in small blocks, the same post-training quantization
technique as in GPTQ is used, but constants are selected for 16-element
blocks. They provide greater accuracy but naturally lead to an increase
in the number of constants. This problem has a beautiful solution: all
constants for the matrix are collected together and quantized again.

Outliers are stored in a sparse matrix. To do this, they are first
sorted by rows, then by columns, and saved in an array. Each outlier
takes up 32 bits: 16 bits for the value itself and 16 bits for the
column index in the matrix. For each row, an additional 32-bit integer
is stored --- the number of outliers in that row.

During inference, weights are dequantized into a 16-bit floating-point
representation. The authors propose an efficient GPU implementation of
the SPQR format decoding algorithm. Regression LLMs are memory-bound, so
the high degree of compression compensates for the computational costs
of decoding.


![](https://cdn-images-1.medium.com/max/800/0*Rsunl-5uoUkqawMO.png)


SPQR of a single tensor. The final data types and dimensions are
indicated on the right. More about this method can be learned on
[GitHub](https://github.com/Vahe1994/SpQR).

## QLoRA 

Until now, we have been considering quantization for inference. The
[QLoRA](https://arxiv.org/abs/2305.14314) method suggests applying it during the
fine-tuning stage. As usual, a link to GitHub is provided.

Let's consider the original idea of
[LoRA](https://arxiv.org/abs/2106.09685). It is one of the [Parameter-Efficient
Fine-Tunin](https://github.com/huggingface/peft)g methods. Imagine we have a large
language model that needs to be fine-tuned for a task. Retraining the
whole model is complex and costly. Instead, small skip-connection block
adapters can be trained. The weights of the base model are frozen, while
gradients flow through the network to the mutable adapters.

The authors of QLoRA suggest training factorized adapters and
demonstrate the efficiency of this method. Instead of a large d × d
matrix, two matrices can be used: d × r and r × d, where r is smaller
than d. A typical value of d \>= 768, while LoRA effectively works even
at r = 20.


![](https://cdn-images-1.medium.com/max/800/0*15gSeyO-F39a_ED_.png)
*How QLoRA works*


The authors of QLoRA suggest quantizing the base model before training
the adapters. The model weights are quantized into NF4, which we
discussed in the data types section. Quantization is performed in small
blocks of 64 elements, and the constants are re-quantized in blocks of
256. Adapters require higher precision, so they are stored in the BF16
format. During fine-tuning, NF4 values are dequantized, and matrix
operations are applied to them in BF16.


![](https://cdn-images-1.medium.com/max/800/0*0_lnkJVNgee74Bww.png)


Where


![](https://cdn-images-1.medium.com/max/800/0*bZvyOOfKSgoAZaBj.png)


## Thank you! 

That's all the information about quantizing large models that I wanted
to share. I hope this overview has been helpful to you. Bookmark it to
have the links to articles and GitHub projects always at hand. I think
this little guide will make it slightly easier for you to choose the
most suitable quantization method. Remember, all approaches are good in
their way; the main thing is to "cook" them correctly ;)

*By Anton [The AI Whisperer] Vice*
