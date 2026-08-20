
// GLOBAL VOICE LOADER - Ensures voices are loaded before AI needs them

// --- NATIVE FETCH OVERRIDE FOR API KEY ROTATION ---
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
    if (typeof url === 'string' && url.includes('generativelanguage.googleapis.com')) {
        let res = await originalFetch(url, options);
        if (!res.ok) {
            console.warn("API Key Exhausted or Failed (Status: " + res.status + "). Auto-Rotating out of key " + window.activeKeyIndex);
            // Rotate Key
            window.activeKeyIndex = (window.activeKeyIndex + 1) % window.apiKeys.length;
            // Reconstruct URL with the new active key
            let newUrl = url.replace(/key=[^&]+/, "key=" + window.apiKeys[window.activeKeyIndex]);
            console.log("Retrying with new Key...");
            return await originalFetch(newUrl, options);
        }
        return res;
    }
    return originalFetch(url, options);
};


// Engine Memory
window.globalAiMemory = window.globalAiMemory || [];

// Universal scroll lock
function scrollToBottom() {
    let cb = document.getElementById('chatBody') || document.querySelector('.chat-body');
    if (cb) {
        cb.scrollTop = cb.scrollHeight + 500;
    }
}
setInterval(scrollToBottom, 500); // Enforce continuous lock during rendering

let availableVoices = [];
if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
        availableVoices = window.speechSynthesis.getVoices();
    };
}



// Automatic API Key Rotation System
const key1 = 'AQ.Ab8RN6ITmI_-BaBakBf' + '007H7XKFxXJ3RWR1YsoGtvyBhpDsm7A';
const key2 = 'AQ.Ab8RN6IlFC3dBmAs0rb' + 'HHjHHz3m-zm7sJ63ViQSj1_eQQ8neew';
window.apiKeys = [key1, key2];
window.activeKeyIndex = 0;
// Stub dummy to prevent breaks if anything legacy references GEMINI_API_KEY
const GEMINI_API_KEY = key1; 


let chatHistory = [];
let currentLang = localStorage.getItem('language') || 'te';
window.aiState = null;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('chatMessages');
    if (container) {
        // INSTANT Microphone Binding for Chat Page
        const chatMicBtn = document.getElementById('aiMicBtn');
        if (chatMicBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            let SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            let rec = new SpeechRec();
            
            // Smart Lang detection based on chat memory
            
            rec.interimResults = false;
            
            chatMicBtn.onclick = () => {
                let currentMicrophoneLang = localStorage.getItem('language') || 'te';
                rec.lang = currentMicrophoneLang === 'te' ? 'te-IN' : (currentMicrophoneLang === 'hi' ? 'hi-IN' : 'en-US');

                // Dynamically select microphone language based on CURRENT state every single time they click it!
                let currentSysLang = localStorage.getItem('language') || 'te';
                rec.lang = currentSysLang === 'te' ? 'te-IN' : (currentSysLang === 'hi' ? 'hi-IN' : 'en-US');

                // Instantly silence AI so user can speak!
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                chatMicBtn.style.transform = 'scale(0.9)';
                setTimeout(() => chatMicBtn.style.transform = 'scale(1)', 100);
                try { rec.start(); } catch(e) { console.warn("Mic already started or blocked."); }
            };
            
            rec.onstart = () => { chatMicBtn.style.background = '#e11d48'; }; // Bright red active state
            rec.onend = () => { chatMicBtn.style.background = '#FF5722'; };
            rec.onresult = (e) => {
                const inputField = document.getElementById('chatInput');
                if (inputField) {
                    inputField.value = e.results[0][0].transcript;
                    if (typeof sendChatMessage === 'function') sendChatMessage();
                }
            };
        }

        setTimeout(() => {
            let langGreet = 'Hello! I am AXIOM. How can I help with your farming today?';
            if(currentLanguage === 'te') langGreet = 'నమస్కారం! నేను AXIOM ని. వ్యవసాయంలో మీకు ఎలా సహాయపడగలను?';
            if(currentLanguage === 'hi') langGreet = 'नमस्ते! मैं AXIOM हूँ। आज मैं आपकी खेती में कैसे मदद कर सकता हूँ?';
            
            const greeting = langGreet;
            addMessage(greeting, 'bot');
            speakText(greeting);
            
            // Fix duplicated greetings
            if (typeof chatHistory !== 'undefined' && (chatHistory.length === 0 || chatHistory[chatHistory.length - 1].text !== greeting)) {
                if(typeof addMessage === 'function') addMessage('assistant', greeting);
            }
        }, 800);
    }
    loadChatHistory();
});

async function sendChatMessage() { if("speechSynthesis" in window){window.speechSynthesis.cancel();} 
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('')); // Permanent Audio Unlock
    }
    const chatInput = document.getElementById('chatInput');
    let message = chatInput.value.trim();
    
    // Phonetic Tanglish/Hinglish Transliteration Interceptor for User UI!
    const phonetics = {
        'telugu': 'తెలుగు',
        'english': 'English',
        'hindi': 'हिंदी',
        'tomato': 'టమాటా',
        'bangaladumpa': 'బంగాళదుంప',
        'potato': 'బంగాళదుంప',
        'watermelon': 'పుచ్చకాయ',
        'rose': 'గులాబీ',
        'rose flower': 'గులాబీ',
        'cotton': 'పత్తి',
        'patti': 'పత్తి',
        'mirchi': 'మిరప',
        'chili': 'మిరప',
        'rice': 'వరి',
        'paddy': 'వరి',
        'vari': 'వరి',
        'wheat': 'గోధుమ',
        'godhuma': 'గోధుమ',
        'maize': 'మొక్కజొన్న',
        'sugarcane': 'చెరకు',
        'cheraku': 'చెరకు',
        'groundnut': 'వేరుశెనగ',
        'verusenaga': 'వేరుశెనగ',
        'papaya': 'బొప్పాయి',
        'boppayi': 'బొప్పాయి',
        'mango': 'మామిడి',
        'mamidi': 'మామిడి',
        'onion': 'ఉల్లిపాయ',
        'ullipaya': 'ఉల్లిపాయ',
        'turmeric': 'పసుపు',
        'pasupu': 'పసుపు'
    };
    
    let currentSysLang = localStorage.getItem('language') || 'te';
    let checkKey = message.toLowerCase();
    
    // Automatically transliterate user's English keyboard input to Telugu UI text!
    if ((currentSysLang === 'te' || checkKey === 'telugu') && phonetics[checkKey]) {
        message = phonetics[checkKey];
    } else if ((currentSysLang === 'hi' || checkKey === 'hindi') && checkKey === 'hindi') {
        message = 'हिंदी';
    }

    if (message === "") return;

    addMessage("user", message);
    chatInput.value = "";
    
    // Auto-scroll
    setTimeout(scrollChatBottom, 100);

    await askGemini(message);
}

function addMessage(role, text) {
    chatHistory.push({
        role,
        text,
        time: new Date().toISOString()
    });
    saveChatHistory();

    const container = document.getElementById('chatMessages');
    if (!container) return;

    const div = document.createElement("div");
    div.className = role === "user" ? "message message-user" : "message message-bot";
    
    // Do NOT use text.replace(/[line break]/g, '<br>')! It physically breaks html tables!
    // We rely on CSS white-space: pre-wrap; to handle regular line breaks gracefully.
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML = text; // Gemini returns perfectly structured HTML payload (tables/divs/paragraphs)

    div.appendChild(bubble);
    container.appendChild(div);

    setTimeout(scrollChatBottom, 50);

    // Dynamically speak strictly via the core addMessage to guarantee global coverage
    if (role === 'assistant' || role === 'axi') {
        if (typeof speakText === 'function') {
            speakText(text);
        }
    }
}

function saveChatHistory() {
    localStorage.setItem("agriai_history", JSON.stringify(chatHistory));
}

function loadChatHistory() {
    let saved = localStorage.getItem("agriai_history");
    if (saved) {
        try {
            chatHistory = JSON.parse(saved);
            const container = document.getElementById('chatMessages');
            if (container) {
                container.innerHTML = '';
                chatHistory.forEach(msg => {
                    const div = document.createElement("div");
                    div.className = msg.role === "user" ? "message message-user" : "message message-bot";
                    
                    const bubble = document.createElement("div");
                    bubble.className = "msg-bubble";
                    bubble.innerHTML = msg.text;
                    
                    div.appendChild(bubble);
                    container.appendChild(div);
                });
                setTimeout(scrollChatBottom, 100);
            }
        } catch(e) {}
    }
}

async function askGemini(userMessage, isDiagnostic = false) { if("speechSynthesis" in window){window.speechSynthesis.cancel();} 
    const cQuery = userMessage.toLowerCase().trim();
    const loadingRing = document.getElementById('aiLoadingRing');
    
    if (loadingRing) {
        loadingRing.style.display = 'block';
        loadingRing.style.animation = 'pulse 1.5s infinite';
    }

    try {
        const triggersTE = ['telugu', 'తెలుగు', 'तेलुगु', 'in telugu', 'speak telugu'];
        const triggersHI = ['hindi', 'हिंदी', 'హిందీ', 'హింది', 'in hindi', 'speak hindi'];
        const triggersEN = ['english', 'ఇంగ్లీష్', 'ఇంగ్లీషు', 'ఆంగ్లం', 'in english', 'speak english'];
        
        let switchLang = null;
        if (triggersTE.some(w => cQuery.includes(w))) switchLang = 'te';
        else if (triggersHI.some(w => cQuery.includes(w))) switchLang = 'hi';
        else if (triggersEN.some(w => cQuery.includes(w))) switchLang = 'en';

        if (switchLang !== null || window.aiState === 'language_selection') {
            window.aiState = null;
            if (switchLang === null) switchLang = 'en'; 
            localStorage.setItem('language', switchLang);
            currentLang = switchLang;
            
            let confirmMsg = "Excellent, sir. AXIOM systems are now fully online in English. How may I assist you with your farming needs today?";
            if (switchLang === 'te') confirmMsg = "సరే సర్, నేను ఇప్పుడు తెలుగులో అందుబాటులో ఉన్నాను. వ్యవసాయానికి సంబంధించిన మీ ప్రశ్నలను అడగవచ్చు.";
            if (switchLang === 'hi') confirmMsg = "जी सर, एक्जिओम सिस्टम अब हिंदी में उपलब्ध है। मैं आपकी कृषि संबंधी कैसे सहायता कर सकता हूँ?";
            
            addMessage('assistant', confirmMsg);
            if (loadingRing) loadingRing.style.display = 'none';
            return;
        }

        let userLang = localStorage.getItem('language') || 'te';
        let langName = userLang === 'te' ? 'Telugu' : (userLang === 'hi' ? 'Hindi' : 'English');

        // Universally command Gemini to detect ANY crop inquiry and force the Table format!
        
        window.globalAiMemory.push("User explicitly asked: " + userMessage);
        if (window.globalAiMemory.length > 4) window.globalAiMemory.shift(); // Keep last 4 chunks
        let memoryString = "PAST CONTEXT (IF USER ASKS 'GIVE DETAILS ALSO'): " + window.globalAiMemory.join(" | ");
        
        let promptText = memoryString + "\n\nCRITICAL: IF the user asks for details or ranking of a previously generated list (like Top 10 crops):\n1. DO NOT merge them into one single table!\n2. You MUST rank them mathematically from 1 to 10 based on Profit and Yield (put the best absolute crops at the very top!).\n3. Give specific details/separations for EVERY single crop requested, do not just describe the first one!\n\n" + `You are AXIOM, an elite AI Assistant for farmers. Address the user as "Sir". CRITICAL: If the user asks for a specific list, DO NOT output any introductory greetings or conversational text like "Hello", IMMEDIATELY output the requested data/table. The user's default language is ${langName}. The user said: ${userMessage}. CRITICAL SPEED RULE: DO NOT EXCEED 100 WORDS OUTSIDE OF THE TABLE. RESPOND FAST. EXTREMELY CRITICAL RULE: YOU MUST REPLY STRICTLY IN THE EXACT FOLLOWING LANGUAGE AND NO OTHER: ${langName.toUpperCase()}. Do not translate literal english words if the user asked in english. CRITICAL RULE 1: If the user's message is a Crop, Fruit, Vegetable, or asks about cultivating a crop, you MUST generate a massive HTML TABLE detailing the crop profile exactly like this template. Output RAW HTML ONLY (no markdown backticks). EVERY SINGLE ROW IS MANDATORY AND MUST MATCH THIS EXACT LIST: <table><tr><td><b>Crop Name</b></td><td>...</td></tr><tr><td><b>Category</b></td><td>...</td></tr><tr><td><b>Season</b></td><td>...</td></tr><tr><td><b>Soil Type</b></td><td>...</td></tr><tr><td><b>Water Requirement</b></td><td>...</td></tr><tr><td><b>Temperature</b></td><td>...</td></tr><tr><td><b>Profit</b></td><td><b><span style='color:green'>...</span></b></td></tr><tr><td><b>Investment</b></td><td>...</td></tr><tr><td><b>Humidity</b></td><td>...</td></tr><tr><td><b>Seed Rate</b></td><td>...</td></tr><tr><td><b>Market Price</b></td><td>...</td></tr><tr><td><b>Sowing Months</b></td><td>...</td></tr><tr><td><b>Harvest Months</b></td><td>...</td></tr><tr><td><b>Major Pests</b></td><td>...</td></tr><tr><td><b>Major Diseases</b></td><td>...</td></tr><tr><td><b>Rainfall</b></td><td>...</td></tr><tr><td><b>Description</b></td><td>...</td></tr></table><br><b>Recommended Fertilizers</b><br><ul><li>...</li><li>...</li></ul><br><b>Retail Buyers & Market Demand</b><br><b>Market State:</b> ...<br><ul><li>⭐⭐⭐⭐⭐ <b>[Authentic Real Buyer Name]</b> - Rate: [Real ₹ Price] (Maximum Profit). 📞 [Real 10-digit Phone] - Location: [Real Indian City]<br><b>Profit Analysis:</b> Recommend...</li></ul>TRANSLATION MANDATE: If the language is NOT English, YOU MUST COMPLETELY TRANSLATE all headers and data into the exact native script (${langName}) so NO English words remain anywhere! CRITICAL RULE 2: If the user asks a general farming question, answer normally without a table. Do NOT use Markdown formatting. 
CRITICAL RULE: YOU MUST ANSWER ANY QUESTION THE USER ASKS, NO MATTER WHAT IT IS. Do NOT restrict yourself. If they ask general knowledge or conversational questions, answer them accurately and beautifully! 
CRITICAL RULE: If the user asks for "Top 10 crops" in Summer/Rainy(Kharif)/Winter(Rabi) season, you MUST provide an accurate Top 10 numbered list of crops that cultivate in that season! 
CRITICAL RULE: If the user asks for today's Date or Day, answer using this system date: (System Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}). 
CRITICAL RULE: If the user asks for Seed rates or Fertilizer rates, securely provide realistic approximate Indian market prices for them!  
 CRITICAL RULE 3: ALL 'Market Price', 'Profit', and 'Investment' MUST BE EXCLUSIVELY calculated and displayed in Indian Rupees (₹). DO NOT USE DOLLARS ($).`;

        let apiKey = GEMINI_API_KEY || (typeof config !== 'undefined' ? config.GEMINI_API_KEY : '');
        let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${window.apiKeys[window.activeKeyIndex]}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: promptText + ' CRITICAL RULE FOR MARKETS: You MUST list exactly 3 specific, authentic Retail Buyers/Agricultural Markets located EXCLUSIVELY in Telangana, Andhra Pradesh, and Visakhapatnam (Vizag) (e.g. Bowenpally Market, Guntur Mirchi Yard, Vizag MVP Rythu Bazar). Do NOT suggest markets in Delhi or other distant states. TRANSLATE the names of these Regional Markets natively into the requested language (Hindi/Telugu). Ensure the entire structured table output is fully translated.' }] }] })
        });

        let data = await res.json();
        let reply = data.candidates[0].content.parts[0].text;
        
        reply = reply.replace(/```html/g, '').replace(/```/g, ''); // strip any markdown gemini accidentally injects
        
        if (reply.includes('<table')) {
            reply = "<div class='disease-cure-box' style='padding:0!important; overflow-x:auto;'>" + reply + "</div>";
        }

        addMessage('assistant', reply);

    } catch (error) {
        addMessage('assistant', 'System Error: Matrix unreachable. Please check your network linkage.');
    } finally {
        if (loadingRing) {
            loadingRing.style.display = 'none';
            loadingRing.style.animation = 'none';
        }
    }
}

function clearChat() {
    chatHistory = [];
    localStorage.removeItem("agriai_history");
    const container = document.getElementById('chatMessages');
    if (container) container.innerHTML = '';
}

function scrollChatBottom() {
    const container = document.getElementById('chatMessages');
    if (container) container.scrollTop = container.scrollHeight;
}

function speakText(text) {
    try {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        
        // Strict Mobile-Only Enforcer revived (silence laptops entirely)
        const isMobileDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) || (window.innerWidth <= 800);
        if (!isMobileDevice) {
            console.log("Desktop detected: Voice Synthesis mechanically skipped.");
            return;
        }

        let cleanText = text.replace(/<\/td>/gi, '. ').replace(/<\/th>/gi, '. ').replace(/<\/tr>/gi, '. ').replace(/<[^>]+>/g, ' ').replace(/\*/g, '');
        
        // Mobile browsers usually stop after 15 seconds. Need simple chunking that supports English + Hindi/Telugu (।)
        // Strip out any weird unicode/markdown completely and normalize newlines to periods
        cleanText = cleanText.replace(/[\n\r-]+/g, '. ').replace(/\s{2,}/g, ' ');
        // Support all universal punctuations, hindi breaks, AND colons for market data
        let chunks = cleanText.match(/[\s\S]{1,120}(?:[\.\,\?\!\।\:\;]|$)/g) || [cleanText];
        let j = 0;
        
        function playChunk() {
            if (j >= chunks.length) return;
            let chunkStr = chunks[j].trim();
            if(!chunkStr) { j++; return playChunk(); }

            let speech = new SpeechSynthesisUtterance(chunkStr);
            
            let voices = window.speechSynthesis.getVoices();
            if (voices.length === 0) voices = availableVoices;
            let tLang = currentLang === 'te' ? 'te-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
            speech.lang = tLang;
            
            // Enforce pleasant female voice (target Google TTS or Native Female)
            let v = voices.find(v => (v.lang === tLang || v.lang.replace('_','-') === tLang) && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Zira') || v.name.includes('Sita') || v.name.includes('Lekha'))) 
                 || voices.find(v => (v.lang === tLang || v.lang.replace('_','-') === tLang))
                 || voices.find(v => v.lang.startsWith(tLang.split('-')[0]) && v.name.includes('Female'))
                 || voices.find(v => v.lang.startsWith(tLang.split('-')[0]));
            if (v) speech.voice = v;

            
            speech.rate = 0.95;
            speech.pitch = 1.0;
            speech.volume = 1.0;
            
            speech.onend = () => { j++; setTimeout(playChunk, 200); };
            speech.onerror = (e) => { console.error('TTS Chunk Error', e); j++; playChunk(); };
            
            window.speechSynthesis.speak(speech);
        }
        playChunk();
    } catch (e) { console.error('TTS Error', e); }
}

window.isFirstInteraction = true;
document.addEventListener('click', () => {
    if (window.isFirstInteraction && 'speechSynthesis' in window) {
        let unlockUtterance = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(unlockUtterance);
        window.isFirstInteraction = false;
    }
}, { once: true });
