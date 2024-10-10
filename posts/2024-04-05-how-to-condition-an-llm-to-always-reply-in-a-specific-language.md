# How to Condition an LLM to Always Reply in a Specific Language

*Published on April 05, 2024*

section-divider

------------------------------------------------------------------------

 section-content

## How to Condition an LLM to Always Reply in a Specific Language 


![](https://cdn-images-1.medium.com/max/800/1*2Fe95WY77H3uloYViO5AXQ.png)


## Hello everyone🌟 Welcome to my Tewtorial. 

Today I will teach you how to condition open-source llms to respond in
your language without asking it to do so 20 times in a prompt like:

``` 
messages = [
    ,
]
```

All you need is a tiny bit of Python. Yep, that's right, the snake! Just
kidding, it's a programming language. 😄

## Step 1: Gathering Our Magic Ingredients! 

First things first, we need to grab some stuff from the internet. It's
like getting ingredients for a magic potion. We'll need:

-   [A pinch of `transformers` library.
    It\'s not the robots movie, but it\'s just as cool!]
-   [A sprinkle of `torch`. No, we\'re
    not starting a fire, it\'s another coding thingy!]

``` 
from transformers import AutoModelForCausalLM, AutoTokenizer, LogitsProcessor
import torch
```

## Step 2: Waking Up Mistral 7B 

Now, we\'ll wake up Mistral 7B. It\'s like saying \"Abracadabra!\" but
for computers.

``` 
## I will use Mistral-7B for example
model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2", torch_dtype=torch.float16, device_map="auto")
tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")
```

## Step 3: Asking Nicely 

Let\'s say we want a pizza recipe, but we REALLY want it in Russian.
Here\'s how you ask nicely:

``` 
messages = [
    ,
]
```

## Step 4: The Secret Spell - `Guidance` 

Here comes the super secret part - the `Guidance` spell. It\'s like telling Mistral 7B to only use
Russian letters and punctuation. Shh\... it\'s our little secret!

## YOU MUST SPECIFY THE ALLOWED Symbols (Russian letters in my case) to be used in the regular expression 

``` 
import regex

ru_alphabet = regex.compile(r'[А-Яа-яЁё]+') 
punctuation = regex.compile(r'^\P+$')

drop_mask = torch.zeros(1, tokenizer.vocab_size, dtype=torch.bool, device="cuda:0")

for k, v in tokenizer.get_vocab().items():
    s = k.lstrip('▁')
    if ru_alphabet.match(s) or punctuation.match(k):
        continue

    drop_mask[0][v] = True

drop_mask[0][tokenizer.eos_token_id] = False
```

## Step 5: Watching the Magic Happen 

After casting our spell, we just sit back, relax, and watch the magic
happen. Mistral 7B will start talking in Russian, just like we asked!

``` 
tokens = tokenizer.apply_chat_template(messages, return_tensors="pt").to(device)

generated_ids = model.generate(
    tokens, max_new_tokens=1000, do_sample=True, num_beams=5,
    renormalize_logits=True, logits_processor=[Guidance()])

decoded = tokenizer.batch_decode(generated_ids)
print(decoded[0])
```

``` 
/////OUTPUT/////

Давай приготовим вкусную классическую пиццу с сыром и томатами! Этот рецепт достаточно прост, так что ты сможешь с легкостью приготовить пиццу дома.

Ингредиенты:
Тесто для пиццы:

300 г пшеничной муки
200 мл воды (теплой)
1 ч. л. сухих дрожжей
1 ч. л. сахара
2 ст. л. оливкового масла
½ ч. л. соли
Соус:

200 г томатного пюре или соуса
2 зубчика чеснока
1 ч. л. сушеного орегано
Соль, перец по вкусу
Начинка:

200 г моцареллы
2 помидора
100 г ветчины или салями (по желанию)
Несколько листьев базилика
Приготовление:
Тесто:

В миске смешай теплую воду, дрожжи и сахар. Оставь на 10 минут.
Добавь муку, оливковое масло и соль. Замеси тесто до эластичности. Покрой миску пленкой и оставь в теплом месте на 1 час.
Соус:

Мелко нарежь чеснок и обжарь на сковороде с оливковым маслом до золотистости.
Добавь томатное пюре, орегано, соль и перец. Тушите на медленном огне 10 минут.
Сборка пиццы:

Разогрей духовку до 220°C.
Раскатай тесто толщиной примерно 0,5 см. Положи его на противень, застеленный пергаментом.
Равномерно распредели соус по тесту, сверху выложи нарезанную моцареллу, помидоры и ветчину (если используешь).
Запекай в духовке 15-20 минут до золотистой корочки.
Перед подачей укрась свежими листьями базилика.
Приятного аппетита! Теперь у тебя есть все, чтобы удивить друзей и семью домашней пиццей. 🍕
```

And there you have it, folks! That\'s how you make sure llms always talk
back in Russian, or any language you want, really. Just a little bit of
coding, and a lot of magic! 🌈✨

Don\'t forget to hit that like button, subscribe, and ring the bell so
you don\'t miss any of my magical coding adventures. See you in the next
video! Bye! 👋🎉

*By Anton [The AI Whisperer] Vice*
