# LLM Cost & Context Optimizer (`llm-cost-optimizer-node`) V 1.1.0

A zero-config, drop-in client wrapper and proxy utility designed to automatically engineering your prompts. Reduce your LLM token count, increase your effective context windows, and slash your API bills by up to 40% with minimal cognitive overhead.

## Key Features
* **Invisible Integration:** Wrap your existing OpenAI client once and change zero lines of execution code.
* **Instant Quantifiable Metrics:** Automated green console telemetry logs your exact token savings and percentage dynamically into your terminal.
* **Linguistic Optimization:** Advanced cloud-managed algorithmic minification, stemming, and stop-word removal.

---

## Installation

```bash
npm install llm-cost-optimizer-node
```

## Usage Guide
### 1. The Drop-In Wrapper (Recommended)
This is the fastest path to integration. By wrapping your native client instance, every single prompt sent to chat.completions.create is intercepted, compressed, and measured automatically in the background.

```
const { OpenAI } = require('openai');
const { wrapClient } = require('llm-cost-optimizer-node');

// 1. Initialize and wrap your standard client
const openai = wrapClient(new OpenAI({ apiKey: process.env.OPENAI_API_KEY }), {
    rapidApiKey: process.env.RAPID_API_KEY,
    strategy: ["minify", "strip_stopwords", "stemming"] // Optional overrides
});

// 2. Run your existing code exactly as before!
const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        { role: "system", content: "You are a helpful database administration assistant." },
        { role: "user", content: "The demographic and historical telemetry records are highly accessible and currently available inside database-warehouse-4 right now." }
    ]
});

console.log(response.choices[0].message.content);
```

### 🟢 Automatic Console Telemetry
The moment the request fires, your terminal logs will automatically stream crisp, quantified optimization metrics without requiring extra logging pipelines:
```
┌────────────────────────────────────────────────────────┐
│ --- [Optimizer Proxy] Intercepting Outgoing Messages... │
│ 🟢 [Metrics] Msg 1 | Slashed: 21 -> 14 tokens (33.3% Saved)  │
└────────────────────────────────────────────────────────┘
```

### 2. Advanced Manual Mode
If you prefer to compress standalone strings, raw system text, or custom JSON payloads before feeding them into specialized agent states or memory lifecycles, instantiate the core class directly.

```
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
    // Returns: { original_tokens: X, compressed_tokens: Y, savings_percentage: "Z%" }
}

optimizeText();
```

## Available Optimization Strategies
Pass these string arrays inside your configurations to tailor compression behaviors to your specific engineering workloads:

| Strategy | Description | Best For |
| :--- | :--- | :--- |
| `minify` | Strips extra line breaks, excess indentation, and redundant whitespace formatting. | General cleanup, logs, text |
| `strip_stopwords` | Removes grammatical boilerplate filler words (`the`, `is`, `and`, `an`) while maintaining key intent words. | Verbose system prompts, RAG |
| `stemming` | Reduces inflected/derived words down to their root linguistic base structure (`telemetry` $\rightarrow$ `telem`). | Massive context blocks |



## Production Safety Guardrails

* **Fail-Safe Design:** If your network goes down, your RapidAPI keys expire, or your gateway hits a rate limit, the client wrapper will instantly catch the exception, print a subtle terminal warning, and safely forward your original untouched prompt to your LLM provider. Your application production uptime will never be compromised.
* **Privacy Focused:** Only raw prompt strings are transmitted through the optimization layer. No model parameters, application secret tokens, or user configuration states ever leave your local network footprint.*

 
 ## Advanced Configuration: Optimization Modes

Different workloads require different token-slashing guardrails. `llm-cost-optimizer-node` includes four specialized contextual intelligence modes to maximize savings without breaking your application code logic.

```javascript
const openai = wrapClient(new OpenAI(), {
    rapidApiKey: process.env.RAPID_API_KEY,
    mode: "rag", // Options: "chat" | "rag" | "agent" | "codegen"
    strategy: ["minify", "strip_stopwords", "stemming"]
});
```

## ⚡ Architecture: Ultra-Low Latency Offline-First Core

`llm-cost-optimizer-node` executes token minification and semantic compression loops **locally in-memory**. By porting the core natural language processing (NLP) token-stripping pipelines onto the client runtime, the middleware eliminates network round-trips for standard execution streams.

* **Latency Overhead:** < 2ms (In-memory execution)
* **Network Overhead:** 0ms for core compilation modes (`chat`, `rag`, `agent`, `codegen`)

```javascript
const { OpenAI } = require('openai');
const { wrapClient } = require('llm-cost-optimizer-node');

// Instantiates a zero-network-latency local optimization layer
const openai = wrapClient(new OpenAI(), {
    mode: "rag", // Options: "chat" | "rag" | "agent" | "codegen"
    strategy: ["minify", "strip_stopwords", "stemming"]
});
```

### Supported Modes

| Mode | Target Workload | Optimization Strategy | Safety Guardrail |
| :--- | :--- | :--- | :--- |
| **`"chat"`** *(Default)* | Multi-turn conversational bots | Removes conversational fluff, repetitive greetings, and common stop-words. | Preserves core user requirements and conversational emotional intent. |
| **`"rag"`** | Vector DB / Knowledge Retrieval | Aggressively slashes contextual boilerplate text down to core informational roots. | **Strictly locks down and protects** all numbers, dates, currency formats, and database IDs. |
| **`"agent"`** | Structured Tool & Function Loops | Compresses internal natural language reasoning and system strings. | **Zero character corruption.** Automatically isolates and bypasses JSON blocks, braces `{}`, brackets `[]`, and code anchors. |
| **`"codegen"`** | LLM Programming Assistants | Strips multi-line documentation strings, developer comments (`//`, `/* */`), and redundant spacing noise. | Leaves underlying functional source code structures completely executable. |