
const GEMINI_API_KEY = 'AQ.Ab8RN6IRKSx7AlWB4QY-PSLC5dyLqqOLFYTKPoN7iHplaPo6Uw';

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
            let detectLang = localStorage.getItem("agriai_history") || "";
            rec.lang = detectLang.includes("Telugu") || detectLang.includes("తెలుగు") ? 'te-IN' : (detectLang.includes("Hindi") || detectLang.includes("हिंदी") ? 'hi-IN' : 'en-US');
            rec.interimResults = false;
            
            chatMicBtn.onclick = () => {
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
        const triggersTE = ['telugu', 'తెలుగు', 'in telugu', 'speak telugu'];
        const triggersHI = ['hindi', 'हिंदी', 'in hindi', 'speak hindi'];
        const triggersEN = ['english', 'ఇంగ్లీష్', 'in english', 'speak english'];
        
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
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: promptText }] }] })
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
        
        // Strip HTML tags for clean audio
        let cleanText = text.replace(/<[^>]+>/g, ' ').replace(/\*/g, '');
        
        let chunkLength = 120;
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
        let setLang = localStorage.getItem('language') || 'en';
        function playChunk() {
            if (j < txtArr.length) {
                let speech = new SpeechSynthesisUtterance(txtArr[j]);
                speech.lang = setLang === 'te' ? 'te-IN' : (setLang === 'hi' ? 'hi-IN' : 'en-US');
                let voices = window.speechSynthesis.getVoices();
                let locLang = setLang === 'te' ? 'te-IN' : (setLang === 'hi' ? 'hi-IN' : 'en-US');
                
                // Absolute Premium Voice Mapping
                let premiumNames = [];
                if (setLang === 'te') premiumNames = ['te-in-x-ted-network', 'te-in-x-tec-network', 'Microsoft Shruti', 'Microsoft Tulasi', 'Google తెలుగు', 'te-IN'];
                else if (setLang === 'hi') premiumNames = ['hi-in-x-hia-network', 'hi-in-x-hic-network', 'Microsoft Swara', 'Google हिन्दी', 'hi-IN'];
                else premiumNames = ['Google UK English Male', 'Microsoft Mark', 'Microsoft David', 'Google US English', 'en-US'];

                let targetVoice = null;
                for (let name of premiumNames) {
                    targetVoice = voices.find(v => v.name.includes(name) || v.voiceURI.includes(name));
                    if (targetVoice) break;
                }
                
                // Fallback to strict language match if premium strings fail
                if (!targetVoice) targetVoice = voices.find(v => v.lang === locLang);
                if (!targetVoice) targetVoice = voices.find(v => v.lang.includes(setLang));
                
                if (targetVoice) speech.voice = targetVoice;
                
                // Adjust pitch slightly for a deeper, more sophisticated AI persona
                speech.pitch = 0.9;
                speech.rate = 1.05;
                speech.pitch = 1.0;
                speech.rate = 1.0;
                speech.volume = 1.0;
                speech.onend = () => { j++; playChunk(); };
                window.speechSynthesis.speak(speech);
            }
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
