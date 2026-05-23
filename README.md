# LLM Cost & Context Optimizer (`llm-cost-optimizer-node`) V 1.1.3

A zero-config, drop-in client wrapper and proxy utility designed to automatically engineer your prompts. Reduce your LLM token count, increase your effective context windows, and slash your API bills by up to 40% with minimal cognitive overhead.

---

## ⚡ Key Features

- **Invisible Integration:** Wrap your existing OpenAI client once and change zero lines of execution code.
- **Zero-Latency Processing:** Token minification executes locally in-memory (< 2ms) using high-performance NLP dictionaries.
- **Intelligent Workload Modes:** Four dedicated contextual optimization profiles for `chat`, `rag`, `agent`, and `codegen`.
- **Asynchronous Telemetry:** Non-blocking background event emitters buffer and stream cost savings metadata to cloud dashboards without delaying production runtime execution paths.
- **Fidelity Benchmarking CLI:** Built-in validation suite to audit structural integrity and token contraction percentages instantly.

---

# Installation

```bash
npm install llm-cost-optimizer-node
```

---

# Usage Guide

## 1. The Drop-In Wrapper (Recommended)

This is the fastest path to integration. By wrapping your native client instance, every single prompt sent to `chat.completions.create` is intercepted, compressed, and measured automatically in the background.

### JavaScript

```javascript
const { OpenAI } = require('openai');
const { wrapClient } = require('llm-cost-optimizer-node');

// 1. Initialize and wrap your standard client
const openai = wrapClient(
    new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    {
        mode: "rag", // Options: "chat" | "rag" | "agent" | "codegen"
        strategy: ["minify", "strip_stopwords", "stemming"] // Optional overrides
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

---

## 🟢 Automatic Console Telemetry

The moment the request fires, your terminal logs will automatically stream crisp, quantified optimization metrics without requiring extra logging pipelines.

### Plaintext

```text
┌────────────────────────────────────────────────────────┐
│ --- [Optimizer Proxy] Intercepting Outgoing Messages... │
│ 🟢 [Local Optimizer] USER message optimized: 21 -> 14  │
│  tokens (33.3% Saved)                                  │
└────────────────────────────────────────────────────────┘
```

---

## 📈 Optional Enterprise Cloud Telemetry Dashboard

To unlock centralized financial tracking and visualization, include your cloud gateway profile token. The wrapper will automatically stream tracking analytics asynchronously in the background every 5 seconds without altering your application execution speeds.

### JavaScript

```javascript
const openai = wrapClient(new OpenAI(), {
    mode: "chat",
    rapidApiKey: "your_hosted_rapidapi_dashboard_key" // Toggles background SaaS analytics sync
});
```

---

# 2. Advanced Manual Mode

If you prefer to compress standalone strings, raw system text, or custom JSON payloads before feeding them into specialized agent states or memory lifecycles, instantiate the core class directly.

### JavaScript

```javascript
const { LLMCostOptimizer } = require('llm-cost-optimizer-node');

const optimizer = new LLMCostOptimizer({
    apiKey: process.env.RAPID_API_KEY
});

async function optimizeText() {
    const result = await optimizer.compress({
        text: "The ergonomic configuration variables are thoroughly documented inside the main repository archive.",
        strategy: ["minify", "strip_stopwords"],
        language: "en"
    });

    console.log("Lean Prompt Text:", result.compressed_text);

    console.log("Savings Metrics:", result.metrics);
    // Returns:
    // {
    //   original_tokens: X,
    //   compressed_tokens: Y,
    //   savings_percentage: "Z%"
    // }
}

optimizeText();
```

---

# 📊 Terminal Benchmarking CLI

Audit your optimization savings ratios and verify semantic safety loops straight from your terminal command line shell.

### Bash

```bash
# Link the package binary globally (if developing locally)
npm link

# Run the live diagnostic suite
llm-optimize benchmark
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
