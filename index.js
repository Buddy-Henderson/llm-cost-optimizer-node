/**
 * Official Node.js SDK for LLM Cost & Context Optimizer
 */
class LLMCostOptimizer {
    /**
     * @param {Object} config
     * @param {string} config.apiKey - Your unique RapidAPI Key
     */
    constructor(config) {
        if (!config || !config.apiKey) {
            throw new Error("LLMCostOptimizer requires an apiKey. Get one at https://rapidapi.com/");
        }
        this.apiKey = config.apiKey;
        this.host = "llm-cost-token-optimizer.p.rapidapi.com";
        this.endpoint = `https://${this.host}/v1/compress`;
    }

    /**
     * Compress your text payload before sending to an LLM provider.
     */
    async compress(options) {
        if (!options || !options.text) {
            throw new Error("Missing required field: text");
        }

        // 🟢 Added the 'mode' parameter to the payload being shipped to your Vercel API
        const payload = {
            text: options.text,
            mode: options.mode || "chat", // Default to conversational chat mode
            strategy: options.strategy || ["minify"],
            language: options.language || "en",
            ignore_words: options.ignoreWords || []
        };

        try {
            const response = await fetch(this.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": this.apiKey,
                    "X-RapidAPI-Host": this.host
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(`Optimizer Gateway Error (${response.status}): ${errData.error || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`LLMCostOptimizer Request Failed: ${error.message}`);
        }
    }
}

/**
 * Wraps a standard LLM provider client (OpenAI or Anthropic) 
 * to automatically intercept and compress payload text.
 */
function wrapClient(client, config = {}) {
    if (!config.rapidApiKey) {
        throw new Error("llm-cost-optimizer-node: wrapClient requires a 'rapidApiKey' in the config object.");
    }

    const optimizer = new LLMCostOptimizer({ apiKey: config.rapidApiKey });
    
    // 🟢 Establish fallback configurations for optimization modes and strategies
    const defaultMode = config.mode || "chat";
    const defaultStrategy = config.strategy || ["minify", "strip_stopwords", "stemming"];

    return new Proxy(client, {
        get(target, prop, receiver) {
            if (prop === 'chat') {
                return new Proxy(target.chat, {
                    get(chatTarget, chatProp) {
                        if (chatProp === 'completions') {
                            return new Proxy(chatTarget.completions, {
                                get(compTarget, compProp) {
                                    if (compProp === 'create') {
                                        return async function (...args) {
                                            const payload = args[0];
                                            
                                            if (payload && payload.messages && Array.isArray(payload.messages)) {
                                                console.log("--- [Optimizer Proxy] Intercepting Outgoing Messages... ---");
                                                
                                                for (let i = 0; i < payload.messages.length; i++) {
                                                    const msg = payload.messages[i];
                                                    if (msg.content && typeof msg.content === 'string') {
                                                        try {
                                                            // 🟢 Passing the target mode out to the class compressor loop
                                                            const result = await optimizer.compress({
                                                                text: msg.content,
                                                                mode: defaultMode, 
                                                                strategy: defaultStrategy,
                                                                language: "en"
                                                            });
                                                            
                                                            const original = result.metrics?.original_tokens || msg.content.split(' ').length;
                                                            const compressed = result.metrics?.compressed_tokens || original;
                                                            const saved = result.metrics?.savings_percentage || "0%";
                                                            
                                                            console.log(`🟢 [Metrics] Msg ${i} | Slashed: ${original} -> ${compressed} tokens (${saved} Saved)`);
                                                            
                                                            msg.content = result.compressed_text;
                                                        } catch (err) {
                                                            console.warn(`⚠️ [Optimizer Proxy Warning] Compression failed, passing original text: ${err.message}`);
                                                        }
                                                    }
                                                }
                                            }
                                            return Reflect.apply(compTarget[compProp], compTarget, args);
                                        };
                                    }
                                    return Reflect.get(compTarget, compProp);
                                }
                            });
                        }
                        return Reflect.get(chatTarget, chatProp);
                    }
                });
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}

// Unified export layer
module.exports = {
    LLMCostOptimizer,
    wrapClient
};