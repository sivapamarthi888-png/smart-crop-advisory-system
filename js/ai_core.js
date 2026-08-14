
const GEMINI_API_KEY = 'AQ.Ab8RN6IobRHpmgir1mI3uCnTqsr6bI1w0uqoOdM5F0fFkCvwVA';

let chatHistory = [];
let currentLang = localStorage.getItem('language') || 'en';
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
                let currentMicrophoneLang = localStorage.getItem('language') || 'en';
                rec.lang = currentMicrophoneLang === 'te' ? 'te-IN' : (currentMicrophoneLang === 'hi' ? 'hi-IN' : 'en-US');

                // Dynamically select microphone language based on CURRENT state every single time they click it!
                let currentSysLang = localStorage.getItem('language') || 'en';
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
            const greeting = "Good day, Sir. I am AXIOM, your advanced agricultural intelligence system. Please select or speak your preferred communication language: English, Telugu, or Hindi.";
            
            // Autoplay explicitly requested by user 
            if (typeof speakText === 'function') speakText(greeting);
            
            // Fix duplicated greetings
            if (typeof chatHistory !== 'undefined' && (chatHistory.length === 0 || chatHistory[chatHistory.length - 1].text !== greeting)) {
                if(typeof addMessage === 'function') addMessage('assistant', greeting);
            }
        }, 800);
    }
    loadChatHistory();
});

async function sendChatMessage() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
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
    
    let currentSysLang = localStorage.getItem('language') || 'en';
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
    
    // Do NOT use text.replace(/\n/g, '<br>')! It physically breaks html tables!
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

async function askGemini(userMessage) {
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

        let userLang = localStorage.getItem('language') || 'en';
        let langName = userLang === 'te' ? 'Telugu' : (userLang === 'hi' ? 'Hindi' : 'English');

        // Universally command Gemini to detect ANY crop inquiry and force the Table format!
        let promptText = "You are AXIOM, an elite AI Assistant for farmers. Address the user as 'Sir'. " +
                         "The user's default language is " + langName + ". The user said: " + userMessage + ".\n" +
                         "CRITICAL RULE 1: If the user's message is a Crop, Fruit, Vegetable, or asks about cultivating a crop, you MUST generate a massive HTML TABLE detailing the crop profile exactly like this template. " +
"Output RAW HTML ONLY (no markdown backticks). EVERY SINGLE ROW IS MANDATORY:\n" +
"<table>" +
"<tr><td><b>Category</b></td><td>...</td></tr>" +
"<tr><td><b>Scientific Name</b></td><td>...</td></tr>" +
"<tr><td><b>Family</b></td><td>...</td></tr>" +
"<tr><td><b>Season</b></td><td>...</td></tr>" +
"<tr><td><b>Soil Type</b></td><td>...</td></tr>" +
"<tr><td><b>Water Requirement</b></td><td>...</td></tr>" +
"<tr><td><b>Temperature</b></td><td>...</td></tr>" +
"<tr><td><b>Humidity</b></td><td>...</td></tr>" +
"<tr><td><b>Rainfall</b></td><td>...</td></tr>" +
"<tr><td><b>pH</b></td><td>...</td></tr>" +
"<tr><td><b>Duration</b></td><td>...</td></tr>" +
"<tr><td><b>Seed Rate</b></td><td>...</td></tr>" +
"<tr><td><b>Spacing</b></td><td>...</td></tr>" +
"<tr><td><b>Yield</b></td><td>...</td></tr>" +
"<tr><td><b>Market Price</b></td><td>...</td></tr>" +
"<tr><td><b>Sowing Months</b></td><td>...</td></tr>" +
"<tr><td><b>Harvest Months</b></td><td>...</td></tr>" +
"<tr><td><b>Major Pests</b></td><td>...</td></tr>" + 
"<tr><td><b>Major Diseases</b></td><td>...</td></tr>" + 
"<tr><td><b><span style='color:green'>Profit</span></b></td><td><b><span style='color:green'>...</span></b></td></tr>" +
"<tr><td><b>Investment</b></td><td>...</td></tr>" +
"<tr><td><b><span style='color:green'>Expected ROI</span></b></td><td><b><span style='color:green'>...</span></b></td></tr>" +
"<tr><td><b>Description</b></td><td>...</td></tr>" +
"<tr><td><b>Uses</b></td><td>...</td></tr>" +
"</table><br>" + 
"<b>Recommended Fertilizers</b><br><ul><li>...</li><li>...</li><li>...</li></ul><br>" +
"<b>Retail Buyers & Market Demand</b><br><b>Market State:</b> ...<br>" +
"<ul>" +
"<li>⭐⭐⭐⭐⭐ <b>[Authentic Real Buyer Name]</b> - Rate: [Real ₹ Price] (Maximum Profit). 📞 [Real 10-digit Phone] - Location: Hyderabad<br><b>Profit Analysis:</b> Strongly recommend...</li>" +
"<li>⭐⭐⭐⭐⭐ <b>[Authentic Real Buyer Name]</b> - Rate: [Real ₹ Price] (Maximum Profit). 📞 [Real 10-digit Phone] - Location: Guntur<br><b>Profit Analysis:</b> Strongly recommend...</li>" +
"<li>⭐⭐⭐⭐⭐ <b>[Authentic Real Buyer Name]</b> - Rate: [Real ₹ Price] (Maximum Profit). 📞 [Real 10-digit Phone] - Location: Vizag<br><b>Profit Analysis:</b> Strongly recommend...</li>" +
"</ul>\n" +
"TRANSLATION MANDATE: If the language is NOT English, YOU MUST COMPLETELY TRANSLATE all the bold headers (e.g. Category, Season, Soil Type, Profit, Recommended Fertilizers, Retail Buyers) into the exact native script (Telugu/Hindi) so NO English words remain anywhere!\n" +
"CRITICAL RULE 4: You MUST generate exactly THREE retail buyers (one for Hyderabad, one for Guntur, one for Vizag) with authentic real-world distributor market names and authentic-looking 10-digit Indian phone numbers.\n" +
"CRITICAL RULE 2: If the user asks a general farming question, answer normally without a table. Do NOT use Markdown formatting.\n" +
                         "CRITICAL RULE 3: ALL 'Market Price', 'Profit', and 'Investment' MUST BE EXCLUSIVELY calculated and displayed in Indian Rupees (₹). DO NOT USE DOLLARS ($). " +
                         "Output EXACTLY and ONLY in " + langName + " language. Do not mix languages! If langName is Telugu, EVERY SINGLE WORD must be in Telugu script. If langName is Hindi, EVERY WORD in Hindi script.";

        let apiKey = GEMINI_API_KEY || (typeof config !== 'undefined' ? config.GEMINI_API_KEY : '');
        let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: promptText + ' CRITICAL RULE: For Retail Buyers & Market Demand, YOU MUST ONLY USE AUTHENTIC, EXISTING MARKET HUBS AND VERIFIED COMPANIES (e.g., e-NAM markets, Reliance Fresh, ITC Choupal). Do NOT invent fake phone numbers or fake company names; provide real local market locations/buyers instead.' }] }] })
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
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (!('speechSynthesis' in window)) return;
        
        // Strict Mobile-Only Enforcer: Laptops lack regional voice packs!
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (!isMobileDevice) {
            console.log("Desktop detected: Voice Synthesis mechanically skipped. AI will only speak on Mobile phones.");
            return;
        }

        // Force pause between table cells
        let cleanText = text.replace(/<\/td>/gi, '. ').replace(/<\/th>/gi, '. ').replace(/<\/tr>/gi, '. ').replace(/<[^>]+>/g, ' ').replace(/\*/g, '');
        
        let chunkLength = 150;
        let pattRegex = new RegExp('^[\\s\\S]{1,' + chunkLength + '}(?:[\\.\\,\\?\\!]|$)', 'i');
        let txtArr = [];
        
        while (cleanText.length > 0) {
            let arr = cleanText.match(pattRegex);
            if (arr === null || arr[0] === '') {
                txtArr.push(cleanText.substring(0, chunkLength));
                cleanText = cleanText.substring(chunkLength);
            } else {
                txtArr.push(arr[0]);
                cleanText = cleanText.substring(arr[0].length);
            }
        }

        let j = 0;
        let sysLang = localStorage.getItem('language') || 'en';
        
        function playChunk() {
            if (j >= txtArr.length) return;
            let speech = new SpeechSynthesisUtterance(txtArr[j]);
            
            // Fluency matching: rigidly bind TTS language to selected language!
            if (sysLang === 'te') {
                speech.lang = 'te-IN';
            } else if (sysLang === 'hi') {
                speech.lang = 'hi-IN';
            } else {
                speech.lang = 'en-US';
            }
            
            let voices = window.speechSynthesis.getVoices();
            // Enforce Pleasant Female Voice (Zira on Windows, Google on Android)
            let targetVoice = voices.find(v => v.lang.includes(speech.lang) && (v.name.includes('Zira') || v.name.includes('Shruti') || v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Natural')));
            
            // If the found voice happens to be Male (like David), try to skip it
            if (targetVoice && (targetVoice.name.includes('Male') || targetVoice.name.includes('David') || targetVoice.name.includes('Ravi'))) {
                let femaleFallback = voices.find(v => v.lang.includes(speech.lang) && (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Shruti')));
                if (femaleFallback) targetVoice = femaleFallback;
            }

            if (targetVoice) speech.voice = targetVoice;

            speech.pitch = 1.0; 
            speech.rate = 1.0;
            speech.volume = 1.0;
            
            // Exactly 0.5s pause after every chunk!
            speech.onend = () => { j++; setTimeout(playChunk, 500); };
            
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
