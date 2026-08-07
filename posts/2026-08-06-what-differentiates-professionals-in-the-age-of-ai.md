# What Differentiates Professionals in the Age of AI?

Another day of pondering.. another question:

## What differentiates professionals nowadays?

Back in my day things were simple to understand:

There are white collar professionals, lets say and engineer or a designer. They start small by making doodle projects, honing their skills. And when they are ready to hit the market they start with junior level jobs. These roles entail that a professional's skillset is still young and naive, he can write some functions and tests, create a logo, or write a document.

And with the progression through the career ladder, one learns how to do more things and take on bigger tasks.

But with the advent of AI, this way of thinking blurs the line between a senior and a junior professional.

## SO

I needed a better frame of reference, that's when I remembered my chat with my aunt who was a PM and currently an HR:

> I aksed her, "What makes one a senior and a junior dev?"
>
> She said, "I can just tell a senior developer what I want, he will clarify a few questions, and a few days later comes back with a working product, which he can maintain and improve. All byhimslef"

Thats when it hit me and I quickly realized, what makes one senior is not the amount of things you can do (because coding agents can pretty much write anything at diverse scales) but the **AMOUNT OF RESPONSIBILITY** that one can take up on and own it in the end.

Since a beginner can cook up a microservices architecture with AI, the same way a senior developer might, there remains one difference between them. Can you put your life on whether it works and works right. Can a junior dev detect that the ai output is valid, scalable, according to the instructions? From my experience - no, they lack the rational thinking to analyze it, verify, and be completely sure that when they submit the work and something is wrong - they can take full responsibility for the mistake. Of course there are exceptions, but from what I have seen, the interaction with the AI has reduced the amount of time one spends on reason and analysis, rendering most brains who have not had a prior experience debugging and coding by hand pretty much useless at seeing where the output of the tool they are using has a clear disconnect from reality.

I am guilty myself, when I first started coding with AI, the dopamine rush from doing things quickly, things that run in the shell without errors, created a false illusion that I can accomplish radically more tasks in the the same amount of time. But what I was doing is simply copy pasting prompt given to me, and when something doesn't run, just throw the error back in the coding agent until it works.

What this created is a system where I have very little understanding of the internals, as well as a clear picture of the output, the output seems correct, whats wrong with that?

For example, say you need to get some xlsx out of the postgres data you have to present to potential customer your inventory (my real use case). My partner asked me to make it, I just tossed it to the AI, glimpsed over the table "looks aight I guess", and sent it out.

I have never been so horrified when I saw the response from Dima:

> "WHAT THE HELL IS THIS?"
>
> "Why are there are internal prices in the table, why are the names leaking internal information, why the hell there are columns that make no use for the customer, like dude wtf is wrong with you, are you drunk"

That situation with xlsx happened about a year ago, and since then I have been working on improving my workflow and started reading, analyzing, and exercising my brain with competitions, leetcode, kaggle (without ai), and fun pet projects to keep my reasoning sharp and ready for any challenges to come.

**That was the moment when I realized: an ai coding agent is but a tool, and if you use a tool like a toy, you will not get any job done**

That was a wake up moment that led me to:

1. Describe the heck out of the task that needs to be done, every single detail that I need to mind, that needs to be done, and every single dangerous case that can happen
2. Look at the outputs thoroughly, I saved a lot of time by not writing code, therefore I can spend it going through what was done and how it was done

From now on, I am a manager that checks the work. I go through the file structure, tests that I described, outputs and pipelines. click things, change things I don't quite understand how they work, and especially dig deeper on innovative things that the AI coworker has done that I have not thought of.

To this day I miss a lot of things, still, but instead of just saying "oops stupid ai" I try to own the mistakes I miss and figure out a way to sharpen my tool for the next use case to avoid these mistakes

---

What I guess is the point of this rabble is that I do not thing that we are going to be writing code or designing things by themselves. Perhaps it can be a much cleaner product if made by hand, but in a such fast paced world, we have to be quick to adapt, which, if done with AI, can give you an edge on the market.

Therefore, we should not hate on AI and its mistakes, we should learn from them and make our tools better for us with each iteration, and most importantly, **OWN every mistake and decision we make with or without the use of technology**
