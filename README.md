# LLM Cost & Context Optimizer (`llm-cost-optimizer-node`) v1.1.3

A zero-config, drop-in client wrapper and proxy utility designed to automatically optimize your prompts. Reduce your LLM token count, maximize your effective context windows, and slash your API bills by up to 40% with zero changes to your existing execution logic.

---

## Key Features

* **Invisible Integration:** Wrap your existing OpenAI client once and change zero lines of downstream execution code.
* **In-Memory Local Execution:** Token minification executes instantly in-memory (< 2ms) using high-performance NLP dictionaries—no external API overhead for processing text.
* **Intelligent Workload Modes:** Four dedicated contextual optimization profiles tailored for `chat`, `rag`, `agent`, and `codegen`.
* **Asynchronous Cloud Telemetry:** Non-blocking background event loop buffers and flushes cost savings metadata to dashboards without delaying production runtime execution paths.
* **Robust Fail-Safe Design:** If any internal exception or telemetry network blip occurs, the proxy engages a silent bypass to ensure your raw prompt safely reaches your LLM provider.

---

## Installation

```bash
npm install llm-cost-optimizer-node
```

## Usage Guide

### 1. The Drop-In Wrapper (Recommended)
By wrapping your native client instance, every single prompt sent to chat.completions.create is intercepted, compressed locally, and processed safely in the background.

```
const { OpenAI } = require('openai');
const { wrapClient } = require('llm-cost-optimizer-node');

// 1. Initialize and wrap your standard client
const openai = wrapClient(
    new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    {
        mode: "rag",               // Options: "chat" | "rag" | "agent" | "codegen"
        language: "en",            // Supported token lookups: "en" | "es" | "fr"
        ignore_words: ["database"] // Optional array of terms to lock down completely
    }
);

// 2. Run your existing code exactly as before!
const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {
            role: "system",
            content: "You are a helpful database administration assistant."
        },
        {
            role: "user",
            content: "The demographic and historical telemetry records are highly accessible and currently available inside database-warehouse-4 right now."
        }
    ]
});

console.log(response.choices[0].message.content);
```

## Optional Enterprise Cloud Analytics Dashboard
To unlock centralized financial tracking and custom visualizations, pass your cloud gateway token in the configurations array. The internal proxy engine will automatically buffer metrics and flush them asynchronously every 5 seconds.

```    
const openai = wrapClient(new OpenAI(), {
    mode: "chat",
    rapidApiKey: "your_hosted_rapidapi_dashboard_key" // Toggles non-blocking background SaaS sync
});
```

### 2. Advanced Manual Direct Mode
If you prefer to compress standalone strings, raw system files, or custom context variables before feeding them into specialized vector pipelines or state machines, use the internal utility methods directly.

```
const { compressTextLocally, estimateTokens } = require('llm-cost-optimizer-node');

const originalPrompt = "The ergonomic configuration variables are thoroughly documented inside the main repository archive.";

const optimizedPrompt = compressTextLocally(originalPrompt, {
    mode: "chat",
    strategy: ["minify", "strip_stopwords"],
    language: "en"
});

console.log("Original Tokens:", estimateTokens(originalPrompt));
console.log("Compressed Text:", optimizedPrompt);
console.log("Optimized Tokens:", estimateTokens(optimizedPrompt));
```

## Engine Profiles & Parameters

### Contextual Optimization Modes

Different LLM tasks require unique token-slashing guardrails. llm-cost-optimizer-node uses specialized rule engines to maximize cost reduction without disrupting application data flow:

| Mode | Target Workload | Strategy Engaged | Safety Guardrail |
|---|---|---|---|
| `"chat"` (Default) | Multi-turn conversational systems | Removes conversational fluff, filler phrasing, and stop-words. | Preserves user queries and emotional intent indicators. |
| `"rag"` | Knowledge Retrieval / Vector Contexts | Aggressively slashes contextual boilerplate text down to core factual roots. | Automatically extracts and safely locks down all numbers, dates, monetary codes, and database IDs. |
| `"agent"` | Structured Tool & Function Call Loops | Compresses token overhead in natural language system descriptions. | Zero symbol corruption. Tracks and completely bypasses JSON arrays, curly braces `{}`, code brackets `[]`, and symbols. |
| `"codegen"` | AI Programming Assistants | Strips multi-line comment blocks (`/* */`), inline noise (`//`), and unnecessary indentation whitespace. | Leaves underlying functional syntax and source code structures fully executable. |

### Selectable Strategy Filters

| Strategy | Description | Recommended Workloads |
|---|---|---|
| `minify` | Slices out horizontal tabs, carriage returns, and redundant space streams. | Global baseline cleanup across all workflows. |
| `strip_stopwords` | Filters out language-specific grammatical boilerplate filler terms (`the`, `is`, `and`, `an`). | Dense, text-heavy systems, document summaries, and raw transcripts. |
| `stemming` | Truncates inflected words down to their root linguistic base structure (`telemetry → telem`). | Massive context windows and high-volume background ingestion tasks. |

## Production Safety Design

* Fail-Safe Bypass: If your user passes an unexpected type or an edge-case syntax error is encountered inside the wrapper, the code catches it gracefully, issues a subtle ⚠️ [Optimizer Warning], and forwards your original payload unaltered to the LLM. Your system uptime is never compromised.

* 100% Privacy Focused: Prompt compression and text parsing execute completely on your local compute instance. No model secrets, API environment keys, or proprietary data streams are sent across public networks. Telemetry only tracks numeric token counts, timestamps, and active modes.

### Highlights of what we improved:

1. **API Alignment:** Your previous `README` showed instantiated client definitions (`new LLMCostOptimizer()`), but your code actually exports functions (`wrapClient`, `compressTextLocally`, `estimateTokens`). The updated file reflects exactly how a user imports your library.
2. **Clarity on Compute:** The new copy clearly specifies that text optimization is **in-memory and local**, making it much more attractive for developers worried about data latency.
3. **Formatted Tables:** Rebuilt the parameter indices using scannable Markdown formatting tables to make the features look professional at a glance.llm-optimize benchmark
```

### Expected Output Matrix

```text
Initiating Local Fidelity Benchmarking Analysis Suite...

--------------------------------------------------------------------------------
| Mode     | Orig Tokens | Comp Tokens | Savings % | Syntax Status              |
--------------------------------------------------------------------------------
| chat     | 48          | 36          | 25.0%     | 🟢 Pristine Integrity      |
| rag      | 53          | 44          | 17.0%     | 🟢 Pristine Integrity      |
--------------------------------------------------------------------------------
```

---

# 💡 Engine References & Parameters

## Available Optimization Strategies

Pass these string arrays inside your configurations to tailor compression behaviors to your specific engineering workloads.

| Strategy | Description | Best For |
|---|---|---|
| `minify` | Strips extra line breaks, excess indentation, and redundant whitespace formatting. | General cleanup, logs, text |
| `strip_stopwords` | Removes grammatical boilerplate filler words (`the`, `is`, `and`, `an`) while maintaining key intent words. | Verbose system prompts, RAG |
| `stemming` | Reduces inflected/derived words down to their root linguistic base structure (`telemetry → telem`). | Massive context blocks |

---

# Contextual Optimization Modes

Different workloads require different token-slashing guardrails. `llm-cost-optimizer-node` includes four specialized contextual intelligence modes to maximize savings without breaking your application code logic.

| Mode | Target Workload | Optimization Strategy | Safety Guardrail |
|---|---|---|---|
| `"chat"` (Default) | Multi-turn conversational bots | Removes conversational fluff, repetitive greetings, and common stop-words. | Preserves core user requirements and conversational emotional intent. |
| `"rag"` | Vector DB / Knowledge Retrieval | Aggressively slashes contextual boilerplate text down to core informational roots. | Strictly locks down and protects all numbers, dates, currency formats, and database IDs. |
| `"agent"` | Structured Tool & Function Loops | Compresses internal natural language reasoning and system strings. | Zero character corruption. Automatically isolates and bypasses JSON blocks, braces `{}`, brackets `[]`, and code anchors. |
| `"codegen"` | LLM Programming Assistants | Strips multi-line documentation strings, developer comments (`//`, `/* */`), and redundant spacing noise. | Leaves underlying functional source code structures completely executable. |

---

# 🛡️ Production Safety Guardrails

## Fail-Safe Design

If your network goes down, your RapidAPI keys expire, or your gateway hits a rate limit, the client wrapper will instantly catch the exception, print a subtle terminal warning, and safely forward your original untouched prompt to your LLM provider.

Your application production uptime will never be compromised.

---

## Privacy Focused

Only raw prompt strings are transmitted through the optimization layer.

No model parameters, application secret tokens, or user configuration states ever leave your local network footprint.
