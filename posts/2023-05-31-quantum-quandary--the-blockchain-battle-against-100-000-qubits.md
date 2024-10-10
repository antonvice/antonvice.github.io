# Quantum Quandary: The Blockchain Battle Against 100,000 Qubits

*Published on May 31, 2023*

section-divider

------------------------------------------------------------------------

 section-content

## Quantum Quandary: The Blockchain Battle Against 100,000 Qubits 


![](https://cdn-images-1.medium.com/max/800/1*S46mem9okt-nUrhOP-boQA.png)


Quantum computing has emerged as a groundbreaking technology, promising
to revolutionize various fields, including cryptography, optimization,
and artificial intelligence. One area where quantum computing could have
a profound impact is blockchain technology, which relies heavily on
cryptographic security. In this blog post, we will delve into the
potential disruption of blockchain technology by quantum computing,
particularly focusing on the capabilities of a hypothetical
100,000-qubit quantum computer. We will also discuss the SHA-256
algorithm and its vulnerability to quantum computing attacks, as well as
explore possible countermeasures and adaptations for blockchain
technology in the face of quantum computing advancements.

 section-divider

------------------------------------------------------------------------

 section-content

**Quantum Computing and Qubits**

At the core of quantum computing are quantum bits or qubits. Unlike
classical bits, which can only represent either a 0 or 1, qubits can
exist in a superposition of states, representing both 0 and 1
simultaneously. This unique property allows quantum computers to perform
complex calculations exponentially faster than classical computers.
Furthermore, qubits can be entangled, which means that the state of one
qubit can be dependent on the state of another, even if they are
physically separated. This phenomenon enables quantum computers to
perform parallel computations, further enhancing their problem-solving
capabilities.


![](https://cdn-images-1.medium.com/max/800/1*zmc19DQw-EB26WuV-MU40w.png)


**Shor's Algorithm**

One of the most well-known quantum algorithms is Shor's Algorithm,
developed by Peter Shor in 1994. Shor's Algorithm can efficiently factor
large numbers, which has significant implications for cryptographic
systems, as it can potentially break widely used encryption schemes such
as RSA. The algorithm works by utilizing the quantum Fourier transform
and modular exponentiation to find the prime factors of a given number.
The ability to factor large numbers efficiently poses a threat to
current cryptographic systems, as many of them rely on the computational
infeasibility of factoring large numbers to ensure security.

``` 
from qiskit import QuantumCircuit, Aer, transpile, assemble
from qiskit.visualization import plot_histogram
from math import gcd
from numpy.random import randint
import numpy as np

N = 15

def qpe_amod15(a):
    n_count = 8
    qc = QuantumCircuit(4+n_count, n_count)
    for q in range(n_count):
        qc.h(q)     ## Initialize counting qubits in state |+>
    qc.x(3+n_count) ## And auxiliary register in state |1>
    qc.append(qiskit.circuit.library.QFT(n_count).inverse(), range(n_count))
    qc.measure(range(n_count), range(n_count))
    return qc

def shors_algorithm(N):
    x = randint(2, N)
    while gcd(x, N) != 1:
        x = randint(2, N)
    qc = qpe_amod15(x)
    t_qc = transpile(qc, Aer.get_backend('aer_simulator'), optimization_level=3)
    qobj = assemble(t_qc)
    result = Aer.get_backend('aer_simulator').run(qobj).result()
    counts = result.get_counts()
    return plot_histogram(counts)

shors_output = shors_algorithm(N)
print(f"Shor's Algorithm output for N = :")
shors_output
```

note: quantum computers using Grover's Algorithm: A quantum computer
with a sufficient number of qubits can perform Grover's Algorithm, which
provides a quadratic speedup over classical brute-force search
algorithms. This means that if a classical computer takes T time to
solve a problem, a quantum computer using Grover's Algorithm would take
roughly √T time.

**Blockchain Technology and Hashing Functions**

Blockchain technology relies on cryptographic hashing functions to
maintain the integrity and security of its data. One widely used hashing
function in blockchain systems, particularly in Bitcoin, is the SHA-256
(Secure Hash Algorithm 256-bit). Hashing functions take an input of any
length and produce a fixed-length output, often referred to as a hash.
In the context of blockchain, these functions are used to generate
unique identifiers for blocks and verify the integrity of the data
stored within the blocks.


![](https://cdn-images-1.medium.com/max/800/1*xjhznS_Gp3oARPXCyI5_0A.png)


The SHA-256 algorithm, as the name suggests, generates a 256-bit hash
from the input data. It is considered secure because it is
computationally infeasible to reverse-engineer the input data from the
hash or to find two different inputs that produce the same hash.
However, the advent of quantum computing presents a potential threat to
the security of SHA-256 and other similar hashing algorithms.

``` 
import hashlib

def sha256_hash(input_data):
    hasher = hashlib.sha256()
    hasher.update(input_data.encode('utf-8'))
    return hasher.hexdigest()

input_data = "Quantum computing and blockchain"
hash_output = sha256_hash(input_data)

print(f"Input data: ")
print(f"SHA-256 hash: ")
```

**Vulnerability of SHA-256 to Quantum Computing Attacks**

The NIST (National Institute of Standards and Technology) has published
guidelines on cryptographic key management, including the SP 800--56A
Rev. 3 document. These guidelines emphasize the importance of robust
cryptographic algorithms to ensure the security of sensitive
information. Quantum computing, with its exponential speedup in solving
complex problems, could potentially undermine the security of algorithms
like SHA-256.

A 100,000 qubit quantum computer, while not yet realized, would
theoretically be capable of breaking the SHA-256 algorithm using Shor's
Algorithm. This would render the current cryptographic security measures
in blockchain technology vulnerable to attacks, potentially compromising
the integrity of the entire system.

**Countermeasures and Adaptations for Blockchain Technology**

Despite the potential threats posed by quantum computing advancements,
there are several countermeasures and adaptations that can be
implemented to maintain the integrity and security of blockchain
systems. One such approach is the development and integration of
post-quantum cryptographic algorithms, which are designed to be
resistant to attacks from quantum computers. These algorithms rely on
mathematical problems that are believed to be difficult for both
classical and quantum computers to solve.

Another possible adaptation is the use of quantum-resistant signature
schemes in blockchain technology. These schemes, such as lattice-based
cryptography and hash-based signatures, are designed to be secure even
in the presence of powerful quantum computers. By incorporating these
quantum-resistant technologies, blockchain systems can continue to
provide secure and reliable platforms for data storage and transactions.

The potential impact of quantum computing on blockchain technology is
significant, with the possibility of a 100,000 qubit quantum computer
posing a considerable threat to the security of current cryptographic
systems. However, by exploring and implementing quantum-resistant
technologies, blockchain systems can adapt to the challenges posed by
quantum computing advancements. As research in both quantum computing
and blockchain technology continues to progress, it is crucial for
researchers and practitioners to collaborate and develop innovative
solutions to ensure the long-term security and viability of these
technologies.

*By Anton [The AI Whisperer] Vice*
