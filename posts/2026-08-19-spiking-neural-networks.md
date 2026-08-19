# Spiking Neural Networks: Teaching Machines to Think in Pulses

*Published on August 19, 2026*

There is a certain kind of magic in watching a machine remain quiet.

Most neural networks are always talking. Every layer produces a number,
passes it forward, and does it again on the next calculation. A spiking
neural network is different. Its neurons wait. They collect signals over
time, and when the internal voltage becomes high enough, they fire a
small pulse.

That pulse is called a spike.

If we wanted to explain this to a five-year-old, we could say that every
neuron is a little bucket. Drops of water arrive from other neurons. The
bucket slowly leaks. When it becomes full, it rings a bell, empties itself,
and starts collecting again.

The bell is the spike.

![Interactive spiking neural network dashboard](/snn-lif-lab-cyberpunk.html "SNN Signal Lab")

The dashboard above shows the whole idea. A passenger feature from the
Titanic dataset becomes a stream of spikes. The middle plot shows the
neuron's voltage. The line is the firing threshold. Once the voltage gets
there, the neuron sends a signal and resets.

This sounds simple, but adding time changes the character of the model.

## The idea in plain English

Imagine a room full of people passing notes. In a normal artificial neural
network, everyone speaks at every round. Even if they have nothing useful to
say, a number is still produced and transmitted.

In a spiking network, people speak only when something happens.

The timing matters. Ten spikes arriving close together can mean something
different from ten spikes spread across a long interval. A fast burst can be
an important event. Silence can also carry information.

This makes SNNs interesting for cameras, microphones, robots, sensors, and
other systems that naturally produce events. A changing light pixel does not
need to report itself constantly. It can report when it changes.

## A short history

The story begins with attempts to describe real neurons mathematically.
The Hodgkin-Huxley model, published in 1952, described how biological action
potentials are produced. It is remarkably detailed, but also expensive to
simulate.

Simpler models followed. The integrate-and-fire neuron kept the useful idea
of accumulating charge and firing at a threshold. The leaky integrate-and-
fire model added decay between inputs. This is the model used in our small
experiment.

The broader field of neuromorphic computing grew around the same intuition:
if brains compute with sparse events, perhaps computers can do the same.
Research systems such as IBM TrueNorth, Intel Loihi, and SpiNNaker explored
specialized hardware for these workloads. Software projects such as Brian,
NEST, NEURON, and snnTorch made experimentation easier.

There is no single moment when SNNs replaced ordinary neural networks. They
have instead become a parallel direction: less mature for many benchmark
tasks, but potentially better matched to time, energy, and event-driven
data.

## The slightly harder version

Let the membrane voltage at time `t` be `V_t`. A simple discrete leaky
integrate-and-fire neuron can be written as:

```text
V[t] = λV[t−1] + I[t]
```

Here, `I_t` is the incoming signal and `λ` is the leak factor.
When `λ` is close to one, the neuron remembers more of its recent
past. When it is smaller, the neuron forgets quickly.

The firing rule is:

```text
s[t] = 1  if V[t] ≥ θ
s[t] = 0  if V[t] < θ
```

After a spike, the voltage is reset:

```text
V[t] ← 0
```

The output is not a smooth number. It is a sequence of zeros and ones over
time. This is one of the central differences between a conventional neural
network and an SNN.

## Turning a normal feature into spikes

Our Titanic example starts with an ordinary feature: whether a passenger was
female. We turn its intensity into a probability of emitting a spike at each
time step. This is called rate coding.

```python
def rate_encode(value, steps, rng):
    return (rng.random(steps) < value).astype(float)

female = 0.72
spikes = rate_encode(female, steps=40, rng=rng)
```

The feature is no longer represented by one scalar. It is represented by a
small history of events.

The neuron can then be written in a few lines:

```python
voltage = 0.0
for input_spike in spikes:
    voltage = leak * voltage + 0.31 * input_spike
    output_spike = voltage >= threshold
    if output_spike:
        voltage = 0.0
```

That is the bucket and bell again, now expressed as a simulation.

## Why use this instead of an ordinary neural network?

The answer is not “because it is newer.” On many static tabular problems,
ordinary models are still the sensible choice.

SNNs become attractive when the data itself has a rhythm:

- event cameras that report changes rather than full images;
- microphones and audio streams where timing matters;
- robots receiving asynchronous sensor updates;
- low-power devices that should avoid unnecessary computation;
- biological modelling where the timing of a response is part of the question.

There is also an architectural appeal. If no neuron fires, there may be no
outgoing message to process. Specialized neuromorphic hardware can exploit
that sparsity. The practical energy benefit depends on the chip, the model,
the encoding, and the workload, so it should be measured rather than assumed.

## The hard part: training

Spikes are discrete. A neuron either fires or it does not. The threshold
function therefore has a derivative that is zero almost everywhere and
undefined at the threshold.

That is inconvenient for backpropagation.

Researchers work around this in several ways. Some use surrogate gradients,
which replace the sharp threshold derivative during the backward pass. Some
train a conventional network and convert it into a spiking one. Others use
local learning rules such as Hebbian learning or spike-timing-dependent
plasticity.

The model we built here uses a deliberately small reservoir-style experiment.
The hidden spiking layer is fixed, and a simple ridge regression readout is
trained on its spike counts. This lets us see the mechanics without hiding
them behind a large framework.

## What happened on Kaggle?

I ran the experiment on the Titanic dataset and published the working
notebook on Kaggle:

[SNN Titanic: LIF Reservoir v2](https://www.kaggle.com/code/dzehtsiarou/snn-titanic-lif-reservoir-v2)

On a fixed stratified holdout, the SNN reached 82.0% accuracy. A NumPy
logistic regression baseline also reached 82.0% accuracy. The baseline had
better ROC AUC and log loss, which means the SNN was not the winner on this
static table.

That result is useful. It tells us that an SNN is not automatically a better
classifier simply because it is inspired by biology. Titanic does not contain
much real temporal structure. The timing in this experiment is mostly an
encoding we introduced ourselves.

This is the distinction I find most important: a model can be fascinating
without being the right tool for every dataset.

## Where I would take it next

The next experiment should use event-based data rather than forcing a static
table into a time series. A small audio task, an event-camera dataset, or a
robotics sensor stream would give the network a real reason to care about
timing.

I would also compare rate coding with temporal coding, train the hidden layer
with surrogate gradients, and measure energy on actual neuromorphic hardware.
Accuracy alone is not enough to justify a different computing paradigm.

For now, the dashboard is the most honest result. You can see the input
spikes, watch the voltage rise and fall, and step through the model one event
at a time.

*By Anton Vice*
