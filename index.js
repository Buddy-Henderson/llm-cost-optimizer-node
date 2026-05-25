const natural = require('natural');

const stopWordsMap = {
    en: ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"],
    es: ["el", "la", "los", "las", "un", "una", "unos", "unas", "y", "o", "pero", "de", "del", "al", "a", "en", "para", "por", "con", "sin", "sobre", "este", "esta", "estos", "estas", "ese", "esa", "esos", "esas", "mi", "tu", "su", "mis", "tus", "sus", "que", "como", "cuando", "donde", "quien", "cual", "es", "son", "era", "eran", "fue", "fueron", "ser", "estar", "tengo", "tiene", "tenemos", "tienen"],
    fr: ["le", "la", "les", "un", "une", "des", "et", "ou", "mais", "de", "du", "des", "au", "aux", "à", "en", "pour", "par", "avec", "sans", "sur", "ce", "cette", "ces", "mon", "ton", "son", "mes", "tes", "ses", "qui", "que", "quoi", "dont", "où", "comme", "quand", "est", "sont", "était", "étaient", "fut", "furent", "être", "avoir", "ai", "a", "avons", "avez", "ont"]
};

function estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / 4) + text.split(/\s+/).filter(Boolean).length;
}

// Global batch queue for telemetry metrics
let telemetryQueue = [];
let telemetryIntervalStarted = false;

// Asynchronously flush metrics up to the Cloud Gateway without blocking application threads
function startTelemetryReporter(rapidApiKey) {
    if (telemetryIntervalStarted || !rapidApiKey) return;
    telemetryIntervalStarted = true;

    setInterval(async () => {
        if (telemetryQueue.length === 0) return;

        const batch = [...telemetryQueue];
        telemetryQueue = []; // Clear queue immediately to prevent race conditions

        try {
            // Fires in the background back to your hosted Vercel/RapidAPI cloud infrastructure
            await fetch("https://llm-token-optimizer-api.vercel.app/api/telemetry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": rapidApiKey
                },
                body: JSON.stringify({ metrics: batch })
            });
        } catch (err) {
            // Silently absorb telemetry errors so production app dependencies never crash
        }
    }, 5000); // Flush metrics in batches every 5 seconds
}

function compressTextLocally(text, config) {
    let mode = (config.mode || 'chat').toLowerCase();
    let strategy = config.strategy;
    let language = config.language || 'en';
    let ignore_words = config.ignore_words || [];

    const lang = stopWordsMap[language.toLowerCase()] ? language.toLowerCase() : 'en';
    let localProtectedWords = Array.isArray(ignore_words) ? ignore_words.map(w => w.toLowerCase()) : [];

    switch (mode) {
        case 'rag':
            strategy = strategy || ["minify", "strip_stopwords", "stemming"];
            const factualTokens = String(text).match(/\b\d+[\w-]*\b|\$\d+(?:\.\d+)?/g) || [];
            factualTokens.forEach(token => localProtectedWords.push(token.toLowerCase()));
            break;
        case 'agent':
            strategy = strategy || ["minify"];
            const syntaxTokens = String(text).match(/[{}[\]"':,📊🤖⚙️]/g) || [];
            syntaxTokens.forEach(token => localProtectedWords.push(token.toLowerCase()));
            break;
        case 'codegen':
            strategy = strategy || ["minify"];
            if (typeof text === 'string') {
                text = text.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
            }
            break;
        case 'chat':
        default:
            strategy = strategy || ["minify", "strip_stopwords"];
            break;
    }

    let processedText = text;

    if (strategy.includes('strip_boilerplate')) {
        processedText = processedText.replace(/<\/?[^>]+(>|$)/g, " ");
    }

    if (strategy.includes('strip_stopwords')) {
        const selectedStopwords = stopWordsMap[lang];
        processedText = processedText.split(/\s+/).map(word => {
            const cleanWord = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
            if (localProtectedWords.includes(cleanWord)) return word;
            if (selectedStopwords.includes(cleanWord)) return '';
            return word;
        }).filter(Boolean).join(' ');
    }

    if (strategy.includes('stemming')) {
        const stemmer = lang === 'es' ? natural.PorterStemmerEs : natural.PorterStemmer;
        processedText = processedText.split(/\s+/).map(word => {
            const cleanWord = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
            if (localProtectedWords.includes(cleanWord)) return word;
            return stemmer.stem(word);
        }).join(' ');
    }

    if (strategy.includes('minify')) {
        processedText = processedText.replace(/\r?\n|\r/g, " ").replace(/\s+/g, " ").trim();
    }

    return processedText;
}

function wrapClient(openaiClient, config = {}) {
    if (config.rapidApiKey) {
        startTelemetryReporter(config.rapidApiKey);
    }

    return new Proxy(openaiClient, {
        get(target, prop, receiver) {
            if (prop === 'chat') {
                return {
                    completions: {
                        create: async function (params, ...args) {
                            try {
                                if (params && Array.isArray(params.messages)) {
                                    params.messages = params.messages.map(msg => {
                                        if (msg.content && typeof msg.content === 'string') {
                                            const originalText = msg.content;
                                            const optimizedText = compressTextLocally(originalText, config);

                                            const origTokens = estimateTokens(originalText);
                                            const compTokens = estimateTokens(optimizedText);
                                            
                                            // Queue telemetry metadata for cloud processing dashboard
                                            if (config.rapidApiKey) {
                                                telemetryQueue.push({
                                                    timestamp: new Date().toISOString(),
                                                    mode: config.mode || 'chat',
                                                    original_tokens: origTokens,
                                                    compressed_tokens: compTokens,
                                                    tokens_saved: origTokens - compTokens
                                                });
                                            }

                                            return { ...msg, content: optimizedText };
                                        }
                                        return msg;
                                    });
                                }
                            } catch (err) {
                                console.warn("⚠️ [Optimizer Warning] Safe execution bypass engaged:", err.message);
                            }

                            return target.chat.completions.create(params, ...args);
                        }
                    }
                };
            }
            
            const value = Reflect.get(target, prop, receiver);
            return typeof value === 'function' ? value.bind(target) : value;
        }
    });
}

module.exports = { wrapClient, compressTextLocally, estimateTokens };