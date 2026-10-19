# AI model comparison

Compare available AI models in Copilot Chat and choose the best model for your task.

## Comparison of AI models for GitHub Copilot

GitHub Copilot supports multiple AI models with different capabilities. The model you choose affects the quality and relevance of responses by Copilot Chat and Copilot inline suggestions. Some models offer lower latency, while others offer fewer hallucinations or better performance on specific tasks. This guide helps you pick the best model based on your task, not just model names.

> \[!NOTE\]
>
> * Different models consume AI credits at different rates based on their token pricing. For details, see [Models and pricing for GitHub Copilot](/en/copilot/reference/copilot-billing/models-and-pricing).
> * Choosing the **Auto** option when selecting a model automatically selects the optimum model for your task, based on model availability and task complexity.  If you are on a paid Copilot plan, you qualify for a discount on model costs when you use the **Auto** option. See [About Copilot auto model selection](/en/copilot/concepts/models/auto-model-selection).

### Recommended models by task

Use this table to find a suitable model quickly, see more detail in the sections below.

| Model                                 | Task area                                               | Excels at (primary use case)                                                                                                                                   | Further reading                                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-5 mini                            | General-purpose coding and writing                      | Fast, accurate code completions and explanations                                                                                                               | [GPT-5 mini model card](https://cdn.openai.com/gpt-5-system-card.pdf)                                                                                                      |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-5.3-Codex                         | Agentic software development                            | Agentic tasks                                                                                                                                                  | [GPT-5.3-Codex model card](https://deploymentsafety.openai.com/gpt-5-3-codex)                                                                                              |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-5.4                               | Deep reasoning and debugging                            | Multi-step problem solving and architecture-level code analysis                                                                                                | [GPT-5.4 model card](https://deploymentsafety.openai.com/gpt-5-4-thinking/introduction)                                                                                    |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-5.4 mini                          | Agentic software development                            | Codebase exploration and is especially effective when using grep-style tools                                                                                   | [GPT-5.4 mini model card](https://deploymentsafety.openai.com/gpt-5-4-thinking/gpt-5-4-thinking.pdf)                                                                       |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-5.5                               | Deep reasoning and debugging                            | Multi-step problem solving and architecture-level code analysis                                                                                                | [GPT-5.5 model card](https://deploymentsafety.openai.com/gpt-5-5/gpt-5-5.pdf)                                                                                              |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-5.6 Luna                          | Fast help with simple or repetitive tasks               | Quick, cost-efficient responses for smaller, faster coding tasks                                                                                               | [GPT-5.6 model card](https://deploymentsafety.openai.com/gpt-5-6/gpt-5-6.pdf)                                                                                              |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-5.6 Sol                           | Deep reasoning and debugging                            | Complex reasoning over large codebases and long-running agentic work                                                                                           | [GPT-5.6 model card](https://deploymentsafety.openai.com/gpt-5-6/gpt-5-6.pdf)                                                                                              |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-5.6 Terra                         | General-purpose coding and agent tasks                  | Balanced everyday interactive and agentic coding                                                                                                               | [GPT-5.6 model card](https://deploymentsafety.openai.com/gpt-5-6/gpt-5-6.pdf)                                                                                              |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-6 Astra                           | Long-horizon, autonomous coding and agentic tasks       | Long-horizon coding tasks with continuous planning, batched diagnosis and verification, and independent result confirmation                                    | [GPT-6 Astra model card](https://deploymentsafety.openai.com/gpt-6-astra/gpt-6-astra.pdf)                                                                                  |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-6 Luna                            | Fast help with simple or repetitive tasks               | Quick, cost-efficient responses for smaller, faster tasks                                                                                                      | [GPT-6 Luna model card](https://deploymentsafety.openai.com/gpt-6-astra/gpt-6-astra.pdf)                                                                                   |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-6 Sol                             | Interactive and agentic coding                          | All-round development tasks that benefit from careful, multistep validation                                                                                    | [GPT-6 Sol model card](https://deploymentsafety.openai.com/gpt-6-astra/gpt-6-astra.pdf)                                                                                    |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| GPT-6.1 Sol                           | Complex coding tasks                                    | Advanced, efficient reasoning for complex coding tasks                                                                                                         | [GPT-6.1 Sol model card](https://deploymentsafety.openai.com/gpt-6-1-sol/gpt-6-1-sol.pdf)                                                                                  |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Fable 5                        | Long-horizon, autonomous coding and knowledge-work      | First-attempt correctness through upfront reasoning, aggressive parallel tool batching, and proactive verification of pre-existing test state before debugging | [Claude Fable 5 model card](https://anthropic.com/claude-fable-5-mythos-5-system-card)                                                                                     |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Fable 5.1                      | Long-horizon, autonomous coding and knowledge-work      | Substantial, long-running coding tasks, including deep codebase research, feature development, and complex agentic workflows                                   | [Claude Fable 5.1 model card](https://www-cdn.anthropic.com/0339e6a7c5c7b87f5c07798616dc32c215d14235/Claude%20Fable%205.1%20&%20Claude%20Mythos%205.1%20System%20Card.pdf) |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Haiku 4.5                      | Fast help with simple or repetitive tasks               | Fast, reliable answers to lightweight coding questions                                                                                                         | [Claude Haiku 4.5 model card](https://assets.anthropic.com/m/99128ddd009bdcb/Claude-Haiku-4-5-System-Card.pdf)                                                             |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Haiku 5.5                      | Fast help with simple or repetitive tasks               | Fast, reliable answers to lightweight coding questions                                                                                                         | [Claude Haiku 5.5 model card](https://www-cdn.anthropic.com/e1080d6bf5ae2018ea3c2f414064be03232f5be5/Claude%20Haiku%205.5%20System%20Card.pdf)                             |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Opus 4.8                       | Deep reasoning and debugging                            | Complex problem-solving challenges, sophisticated reasoning                                                                                                    | [Claude Opus 4.8 model card](https://www-cdn.anthropic.com/0b4915911bb0d19eca5b5ee635c80fef830a37ea.pdf)                                                                   |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Opus 4.8 (fast mode) (preview) | Deep reasoning and debugging                            | Complex problem-solving challenges, sophisticated reasoning                                                                                                    | [Claude Opus 4.8 model card](https://www-cdn.anthropic.com/0b4915911bb0d19eca5b5ee635c80fef830a37ea.pdf)                                                                   |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Opus 5                         | Deep reasoning and debugging                            | Complex problem-solving challenges, sophisticated reasoning                                                                                                    | [Claude Opus 5 model card](https://www-cdn.anthropic.com/c5fbac3f0b1280a933ebd26d3cb8bb9f5bdeaf48/Claude%20Opus%205%20System%20Card.pdf)                                   |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Opus 5.5                       | Long-running agentic coding and knowledge work          | Efficient multistep tasks, error recovery, and collaboration                                                                                                   | [Claude Opus 5.5 model card](https://www-cdn.anthropic.com/fc1b44717c85dc068bc6ba5024219938094694bd/Claude%20Opus%205.5%20System%20Card.pdf)                               |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Sonnet 4.6                     | General-purpose coding and agent tasks                  | Complex problem-solving challenges, sophisticated reasoning                                                                                                    | [Claude Sonnet 4.6 model card](https://www-cdn.anthropic.com/78073f739564e986ff3e28522761a7a0b4484f84.pdf)                                                                 |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Sonnet 5                       | General-purpose coding and agent tasks                  | Complex problem-solving challenges, sophisticated reasoning                                                                                                    | [Claude Sonnet 5 model card](https://www-cdn.anthropic.com/9e6a1044980d8c4ed85669faf9c2a8342e2e9f1e/Claude%20Sonnet%205%20System%20Card.pdf)                               |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Claude Sonnet 5.5                     | General-purpose coding and agent tasks                  | Efficient task completion with fewer steps, tokens, and tool calls                                                                                             | [Claude Sonnet 5.5 model card](https://www-cdn.anthropic.com/870c8f525702625d2c62fc6dd04c857e3250bec1/Claude%20Sonnet%205.5%20System%20Card.pdf)                           |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Gemini 3.7 Flash                      | Fast help with simple or repetitive tasks               | Fast, reliable answers to lightweight coding questions                                                                                                         | [Gemini 3.7 Flash model card](https://storage.googleapis.com/deepmind-media/Model-Cards/Gemini-3-7-Flash-Model-Card.pdf)                                                   |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Gemini 3.8 Flash                      | Fast help with simple or repetitive tasks               | Fast, reliable answers to lightweight coding questions                                                                                                         | [Gemini 3.8 Flash model card](https://storage.googleapis.com/deepmind-media/Model-Cards/Gemini-3-8-Flash-Model-Card.pdf)                                                   |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Gemini 4 Argon                        | Complex coding, agentic, and reasoning tasks            | Thorough work that tests edge cases before finishing                                                                                                           | [Gemini 4 Argon](https://storage.googleapis.com/deepmind-media/Model-Cards/Gemini-4-Argon-Model-Card.pdf)                                                                  |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| MAI-Code-1.1-Flash[^mai-models]       | General-purpose coding and writing, image understanding | Fast code completions and explanations, instruction following, tool use                                                                                        | [MAI-Code-1.1-Flash model card](https://microsoft.ai/pdf/MAI-Code-1.1-Flash-Model-Card.PDF)                                                                                |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Grok 4.5                              | General-purpose coding and agent tasks                  | Complex problem-solving challenges, sophisticated reasoning                                                                                                    | [Grok 4.5 model card](https://media.x.ai/v1/website/card-7f81d41b.pdf)                                                                                                     |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Grok 4.6                              | General-purpose coding and agent tasks                  | Complex problem-solving challenges, sophisticated reasoning                                                                                                    | [Grok 4.6 model card](https://media.x.ai/v1/website/card-4p6-4cd2dc57.pdf)                                                                                                 |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Grok 4.7                              | Agentic coding and complex, multistep workflows         | Complex problem-solving challenges, sophisticated reasoning                                                                                                    | [Grok 4.7 model card](https://media.x.ai/v1/website/4p7card-5eccc980.pdf)                                                                                                  |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Qwen2.5                               | General-purpose coding and writing                      | Code generation, reasoning, and code repair / debugging                                                                                                        | [Qwen2.5 model card](https://arxiv.org/pdf/2409.12186)                                                                                                                     |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |
| Kimi K3[^kimi-k3]                     | Agentic coding and long-context work                    | Multi-step agent tasks across large codebases                                                                                                                  | [Kimi K3 model card](https://huggingface.co/moonshotai/Kimi-K3)                                                                                                            |
|                                       |                                                         |                                                                                                                                                                |                                                                                                                                                                            |

## Task: General-purpose coding and writing

Use these models for common development tasks that require a balance of quality, speed, and cost efficiency. These models are a good default when you don't have specific requirements.

| Model         | Why it's a good fit                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| GPT-5.3-Codex | Delivers higher-quality code on complex engineering tasks like features, tests, debugging, refactors, and reviews without lengthy instructions. |
| GPT-5 mini    | Reliable default for most coding and writing tasks. Fast, accurate, and works well across languages and frameworks.                             |
| GPT-5.6 Terra | Balanced all-round choice for everyday interactive and agentic coding.                                                                          |

### When to use these models

Use one of these models if you want to:

* Write or review functions, short files, or code diffs.
* Generate documentation, comments, or summaries.
* Explain errors or unexpected behavior quickly.
* Work in a non-English programming environment.

### When to use a different model

If you're working on complex refactoring, architectural decisions, or multi-step logic, consider a model from [Deep reasoning and debugging](#task-deep-reasoning-and-debugging). For faster, simpler tasks like repetitive edits or one-off code suggestions, see [Fast help with simple or repetitive tasks](#task-fast-help-with-simple-or-repetitive-tasks).

## Task: Fast help with simple or repetitive tasks

These models are optimized for speed and responsiveness. They’re ideal for quick edits, utility functions, syntax help, and lightweight prototyping. You’ll get fast answers without waiting for unnecessary depth or long reasoning chains.

### Recommended models

| Model            | Why it's a good fit                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| GPT-5.6 Luna     | Lightweight, cost-efficient option for smaller, faster tasks. The lowest-cost model in the GPT-5.6 family. |
| Claude Haiku 4.5 | Balances fast responses with quality output. Ideal for small tasks and lightweight code explanations.      |

### When to use these models

Use one of these models if you want to:

* Write or edit small functions or utility code.
* Ask quick syntax or language questions.
* Prototype ideas with minimal setup.
* Get fast feedback on simple prompts or edits.

### When to use a different model

If you’re working on complex refactoring, architectural decisions, or multi-step logic, see [Deep reasoning and debugging](#task-deep-reasoning-and-debugging).
For tasks that need stronger general-purpose reasoning or more structured output, see [General-purpose coding and writing](#task-general-purpose-coding-and-writing).

## Task: Deep reasoning and debugging

These models are designed for tasks that require step-by-step reasoning, complex decision-making, or high-context awareness. They work well when you need structured analysis, thoughtful code generation, or multi-file understanding.

### Recommended models

| Model             | Why it's a good fit                                                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GPT-5 mini        | Delivers deep reasoning and debugging with faster responses and lower resource usage than GPT-5. Ideal for interactive sessions and step-by-step code analysis. |
| GPT-5.5           | Great at complex reasoning, code analysis, and technical decision-making.                                                                                       |
| GPT-5.6 Sol       | The highest reasoning ceiling in the GPT-5.6 family. Best for complex reasoning over large codebases and demanding, long-running agentic work.                  |
| Claude Sonnet 4.6 | Reliable completions and smarter reasoning under pressure.                                                                                                      |

### When to use these models

Use one of these models if you want to:

* Debug complex issues with context across multiple files.
* Refactor large or interconnected codebases.
* Plan features or architecture across layers.
* Weigh trade-offs between libraries, patterns, or workflows.
* Analyze logs, performance data, or system behavior.

### When to use a different model

For fast iteration or lightweight tasks, see [Fast help with simple or repetitive tasks](#task-fast-help-with-simple-or-repetitive-tasks).
For general development workflows or content generation, see [General-purpose coding and writing](#task-general-purpose-coding-and-writing).

## Task: Working with visuals (diagrams, screenshots)

Use these models when you want to ask questions about screenshots, diagrams, UI components, or other visual input. These models support multimodal input and are well suited for front-end work or visual debugging.

| Model             | Why it's a good fit                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GPT-5 mini        | Reliable default for most coding and writing tasks. Fast, accurate, and supports multimodal input for visual reasoning tasks. Works well across languages and frameworks. |
| Claude Sonnet 4.6 | Reliable completions and smarter reasoning under pressure.                                                                                                                |

### When to use these models

Use one of these models if you want to:

* Ask questions about diagrams, screenshots, or UI components.
* Get feedback on visual drafts or workflows.
* Understand front-end behavior from visual context.

> \[!TIP\]
> If you're using a model in a context that doesn’t support image input (like a code editor), you won’t see visual reasoning benefits. You may be able to use an MCP server to get access to visual input indirectly. See [Extending GitHub Copilot Chat with Model Context Protocol (MCP) servers](/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp).

### When to use a different model

If your task involves deep reasoning or large-scale refactoring, consider a model from [Deep reasoning and debugging](#task-deep-reasoning-and-debugging). For text-only tasks or simpler code edits, see [Fast help with simple or repetitive tasks](#task-fast-help-with-simple-or-repetitive-tasks).

## Model-specific considerations

Some models have behaviors, limitations, or safeguards that are useful to understand before you choose them for a task.

### Kimi K3

Kimi K3 is designed for long-context, multi-step coding and agentic workflows. Fine-tuned model variants may be included as part of the Kimi K3 (GitHub) offering on individual plans only. Fine-tuned variants are not included for Copilot Business or Copilot Enterprise plans. In pre-release testing, the model exhibited elevated risk on certain higher-risk prompts and was less consistent than some other models in refusing requests involving sensitive topics. These behaviors may reflect differences in the model's safety post-training and alignment. We have deployed additional safeguards in GitHub Copilot to help mitigate the identified risks. As with any model, enterprises should evaluate model capabilities, limitations, and safeguards in light of their particular use cases and requirements.

## Next steps

[^mai-models]: MAI models are continuously improving models. Performance and behavior may evolve over time as new checkpoints are released.

[^kimi-k3]: For important information about Kimi K3 behavior and safeguards, see [Model-specific considerations](#kimi-k3).

Choosing the right model helps you get the most out of Copilot. If you're not sure which model to use, start with a general-purpose option like GPT-5 mini, then adjust based on your needs.

* For detailed model specs and pricing, see [Supported AI models in GitHub Copilot](/en/copilot/reference/ai-models/supported-models).
* To switch between models, refer to [Changing the AI model for GitHub Copilot Chat](/en/copilot/how-tos/copilot-in-your-ide/chat-with-copilot/change-the-chat-model) or [Changing the AI model for GitHub Copilot inline suggestions](/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/change-the-completion-model).
* To learn how Copilot Chat serves different AI models, see [Hosting of models for GitHub Copilot](/en/copilot/reference/ai-models/model-hosting).
