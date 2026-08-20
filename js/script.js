// =====================================================
// SMART CROP ADVISORY SYSTEM
// MAIN SCRIPT - FINAL VERSION
// =====================================================

const hiDict = {
    'Wheat is the second most important cereal crop.': 'गेहूँ दूसरी सबसे महत्वपूर्ण अनाज की फसल है।',
    'Maize is a versatile cereal crop grown for food and feed.': 'मक्का भोजन और चारे के लिए उगाई जाने वाली एक बहुमुखी अनाज की फसल है।',
    'Cotton is an important commercial fiber crop.': 'कपास एक महत्वपूर्ण वाणिज्यिक फाइबर फसल है।',
    'Valuable oilseed and food legume crop.': 'मूल्यवान तिलहन और खाद्य फलीदार फसल।',
    "Rice is India's staple food crop supporting millions.": 'चावल भारत की मुख्य खाद्य फसल है जो लाखों लोगों का भरण-पोषण करती है।',

    'Rabi': 'रबी', 'Kharif': 'खरीफ', 'Zaid': 'ज़ैद',
    'Nov - Dec': 'नवंबर - दिसंबर', 'Mar - Apr': 'मार्च - अप्रैल',
    'Jan - Feb': 'जनवरी - फरवरी', 'Feb - Mar': 'फरवरी - मार्च',
    'Apr - May': 'अप्रैल - मई', 'May - Jun': 'मई - जून', 'May - June': 'मई - जून',
    'Jun - Jul': 'जून - जुलाई', 'June - July': 'जून - जुलाई', 'Jul - Aug': 'जुलाई - अगस्त', 'July - August': 'जुलाई - अगस्त',
    'Aug - Sep': 'अगस्त - सितंबर', 'August - September': 'अगस्त - सितंबर',
    'Sep - Oct': 'सितंबर - अक्टूबर', 'September - October': 'सितंबर - अक्टूबर',
    'Oct - Nov': 'अक्टूबर - नवंबर', 'October - November': 'अक्टूबर - नवंबर',
    'Dec - Jan': 'दिसंबर - जनवरी', 'December - January': 'दिसंबर - जनवरी',
    'January - February': 'जनवरी - फरवरी', 'February - March': 'फरवरी - मार्च',
    'March - April': 'मार्च - अप्रैल', 'November - December': 'नवंबर - दिसंबर',
    'Wheat is the second most important cereal crop.': 'गेहूँ दूसरी सबसे महत्वपूर्ण अनाज की फसल है।',

    'Wheat': 'गेहूँ', 'Maize': 'मक्का', 'Cotton': 'कपास', 'Soybean': 'सोयाबीन',
    'Groundnut': 'मूंगफली', 'Rice': 'चावल', 'Sorghum': 'ज्वार', 'Pearl millet': 'बाजरा',
    'Finger millet': 'रागी', 'Pigeon pea': 'अरहर', 'Mung bean': 'मूंग', 'Black gram': 'उड़द',
    'Chickpea': 'चना', 'Mustard plant': 'सरसों', 'Sunflower': 'सूरजमुखी', 'Sesame': 'तिल',
    'Castor plant': 'अरंडी', 'Sugarcane': 'गन्ना', 'Chili pepper': 'मिर्च', 'Tomato plant': 'टमाटर',
    'Eggplant': 'बैंगन', 'Okra': 'भिंडी', 'Onion': 'प्याज', 'Potato field': 'आलू',
    'Bottle gourd': 'लौकी', 'Pumpkin': 'कद्दू', 'Watermelon field': 'तरबूज', 'Cucumber': 'खीरा',
    'Turmeric plant': 'हल्दी', 'Coriander': 'धनिया',
    'Kharif (Monsoon)': 'खरीफ (मानसून)', 'Rabi (Winter)': 'रबी (सर्दियां)', 'Zaid (Summer)': 'ज़ैद (गर्मियां)',
    'Loamy Soil': 'दोमट मिट्टी', 'Black Soil': 'काली मिट्टी', 'Red Soil': 'लाल मिट्टी',
    'Sandy Soil': 'रेतीली मिट्टी', 'Clay Soil': 'चिकनी मिट्टी', 'Alluvial Soil': 'जलोढ़ मिट्टी', 
    'Market Price': 'बाज़ार मूल्य',
    'Recommended Fertilizers': 'अनुशंसित उर्वरक',
    'Major Diseases': 'प्रमुख रोग',
    'Major Growing Places': 'प्रमुख उगाने वाले स्थान',
    'Description': 'विवरण',

    'November - January': 'नवंबर - जनवरी',
    '1.5 - 2 kg/acre': '1.5 - 2 किग्रा/एकड़',
    'Cotton is an important commercial fiber crop.': 'कपास एक महत्वपूर्ण वाणिज्यिक फाइबर फसल है।',
    'NPK Complex': 'एनपीके (NPK) कॉम्प्लेक्स',
    'Balanced nutrition for uniform crop growth.': 'समान फसल वृद्धि के लिए संतुलित पोषण।',
    'Gypsum': 'जिप्सम',
    'Provides calcium and sulphur for pod/flower development.': 'फूलों के विकास के लिए कैल्शियम और सल्फर प्रदान करता है।',
    'Potash (MOP)': 'पोटाश (MOP)',
    'Improves disease resistance and grain filling.': 'रोग प्रतिरोधक क्षमता और अनाज भरने में सुधार करता है।',
    'Aphids': 'एफिड्स (Aphids)',
    'Small insects sucking sap, causing curling.': 'छोटे कीड़े जो रस चूसते हैं, जिससे पत्तियां मुड़ जाती हैं।',
    'Spray Neem oil or Imidacloprid.': 'नीम के तेल या इमिडाक्लोप्रिड का छिड़काव करें।',
    'Powdery Mildew': 'पाउडरी मिल्ड्यू (Powdery Mildew)',
    'White powdery growth on leaves/stems.': 'पत्तियों/तनों पर सफेद पाउडर जैसी वृद्धि।',
    'Apply valid sulphur fungicides.': 'उपयुक्त सल्फर कवकनाशी का प्रयोग करें।',
    'Andhra Pradesh,Telangana,Karnataka': 'आंध्र प्रदेश, तेलंगाना, कर्नाटक',
    'Guntur,Kurnool,Prakasam,Anantapur': 'गुंटूर, कुरनूल, प्रकाशम, अनंतपुर',
    'Nizamabad,Khammam,Warangal,Karimnagar': 'निजामाबाद, खम्मम, वारंगल, करीमनगर',
    'High': 'अधिक', 'Medium': 'मध्यम', 'Low': 'कम',
    
    'February - March': 'फरवरी - मार्च',
    'May - June': 'मई - जून',
    'Cucumber is an important crop grown extensively for its economic and nutritional benefits.': 'खीरा एक महत्वपूर्ण फसल है जिसे इसके आर्थिक और पोषण लाभों के लिए व्यापक रूप से उगाया जाता है।',
    'Wilt': 'विल्ट (Wilt)',
    'Sudden wilting of the whole plant.': 'संपूर्ण पौधे का अचानक मुरझा जाना।',
    'Ensure good drainage and crop rotation.': 'अच्छी जल निकासी और फसल चक्रण सुनिश्चित करें।',
    
    'A protein-rich oilseed legume.': 'एक प्रोटीन युक्त तिलहन फलीदार पौधा।',
    'Improves soil health and water retention.': 'मिट्टी के स्वास्थ्य और जल धारण क्षमता में सुधार करता है।',
    'Urea': 'यूरिया', 'DAP': 'डीएपी (DAP)', 'Zinc Sulphate': 'जिंक सल्फेट',
    'Leaf Spot': 'पत्ती का धब्बा', 'Rust': 'रतुआ (Rust)', 'Farmyard Manure': 'गोबर की खाद',
    'Varies with market yield.': 'बाजार की उपज के साथ बदलता रहता है।',
    'Covers seeds, fertilizers, labour, and transport.': 'बीज, उर्वरक, श्रम और परिवहन शामिल हैं।',
    'June - July': 'जून - जुलाई', 'September - October': 'सितंबर - अक्टूबर',
    'Maize is a versatile cereal crop grown for food and feed.': 'मक्का भोजन और चारे के लिए उगाई जाने वाली एक बहुमुखी अनाज की फसल है।',
    'Supplies nitrogen for fast vegetative growth.': 'तेजी से वनस्पति विकास के लिए नाइट्रोजन की आपूर्ति करता है।',
    'Provides phosphorus for strong root development.': 'मजबूत जड़ विकास के लिए फास्फोरस प्रदान करता है।',
    'Corrects leaf chlorosis and boosts overall yield.': 'पत्ती के क्लोरोसिस को ठीक करता है और कुल उपज बढ़ाता है।',
    'Brown/black circular spots on leaves.': 'पत्तियों पर भूरे/काले गोल धब्बे।',
    'Spray broad-spectrum fungicide.': 'व्यापक स्पेक्ट्रम कवकनाशी का छिड़काव करें।',
    'Orange/brown spore masses on leaves.': 'पत्तियों पर नारंगी/भूरे रंग के बीजाणु द्रव्यमान।',
    'Use registered systemic fungicide sprays.': 'पंजीकृत प्रणालीगत कवकनाशी स्प्रे का प्रयोग करें।',
    'Symptoms:': 'लक्षण:', 'Control Measures:': 'नियंत्रण के उपाय:'
};
function autoHi(str) {
    if (!str) return str;
    if (typeof str !== 'string') str = String(str);
    let cleanStr = str.trim();
    
    // Check generic dynamic sentences
    let genericMatch = cleanStr.match(/^(.*?)\s+is an important crop grown extensively for its economic and nutritional benefits\.?$/i);
    if (genericMatch) {
        return autoHi(genericMatch[1]) + " एक महत्वपूर्ण फसल है जिसे इसके आर्थिक और पोषण लाभों के लिए व्यापक रूप से उगाया जाता है।";
    }
    
    if (hiDict[cleanStr]) return hiDict[cleanStr];
    for (let k in hiDict) { if (cleanStr === k) return hiDict[k]; }
    return str;
}

let selectedSeason = "";
let selectedSoil = "";
let selectedWater = "";

// =====================================================
// PAGE LOAD
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    displayCrops();
    initializeWeather();

    const season = document.getElementById("seasonSelect");
    const soil = document.getElementById("soilSelect");
    const water = document.getElementById("waterSelect");
    const search = document.getElementById("cropSearch");
    const mic = document.getElementById("aiMic");

    if (season) season.addEventListener("change", filterCrops);
    if (soil) soil.addEventListener("change", filterCrops);
    if (water) water.addEventListener("change", filterCrops);
    if (search) search.addEventListener("input", displayCrops);
    if (mic) mic.onclick = startVoiceAssistant;

    // Keyboard accessibility for popup
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePopup();
    });
});

// =====================================================
// CROP FILTERING
// =====================================================

function filterCrops() {
    selectedSeason = document.getElementById("seasonSelect")?.value || "";
    selectedSoil = document.getElementById("soilSelect")?.value || "";
    selectedWater = document.getElementById("waterSelect")?.value || "";
    displayCrops();
}

// =====================================================
// DISPLAY CROPS
// =====================================================
function displayCrops() {

    const container = document.getElementById("cropContainer");
    if (!container || typeof crops === "undefined") return;

    let search = document.getElementById("cropSearch")?.value.toLowerCase() || "";

    
    let filtered = crops.filter(crop => {
        let seasonMatch = selectedSeason === "" || crop.season === selectedSeason;
        let soilMatch = selectedSoil === "" || crop.soil === selectedSoil;
        let waterMatch = selectedWater === "" || crop.water === selectedWater;
        
        let nameMatch = search === "" || (crop.name && crop.name.toLowerCase().includes(search)) || (crop.teluguName && crop.teluguName.includes(search));
        
        return seasonMatch && soilMatch && waterMatch && nameMatch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:#555; width:100%;">
            <h3>😞 No Crop Matches Found</h3>
            <p>Try broadening your season, soil, or water filters.</p>
        </div>`;
        return;
    }

    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = `<div class="no-result" data-key="noCrop">${getTrans("noCrop", "No crops found for selected conditions.")}</div>`;
        return;
    }

    const fragment = document.createDocumentFragment();
    filtered.forEach(crop => {
        let card = document.createElement("div");
        card.className = "crop-card";

        const fallbackImg = "https://images.unsplash.com/photo-1599557038167-3343d3fb66ce?w=400&q=80"; // elegant fallback

        card.innerHTML = `
            
            <img src="${crop.cropImage ? crop.cropImage : ''}" alt="${crop.name}" loading="lazy">
            <div class="crop-card-body">
                <h3>${currentLanguage === 'te' && crop.teluguName ? crop.teluguName : (currentLanguage === 'hi' ? autoHi(crop.name) : crop.name)}</h3>
                <p>🌱 ${getTrans("season", "Season")}: ${getTrans((crop.season || '').toLowerCase(), crop.season)}</p>
                <p>🌍 ${getTrans("soil", "Soil")}: ${getTrans((crop.soil || '').replace(/\s+/g, '').replace(/^[A-Z]/, c => c.toLowerCase()), crop.soil)}</p>
                <p>💧 ${getTrans("water", "Water")}: ${getTrans((crop.water || '').toLowerCase(), crop.water)}</p>
                <button onclick="openCropDetails('${crop.id}')" aria-label="${getTrans("viewDetails", "View Details")} for ${crop.name}" data-key="viewDetails">${getTrans("viewDetails", "View Details")}</button>
            </div>
        `;
        fragment.appendChild(card);
    });
    container.appendChild(fragment);
}

// --------------------------------------------------------------------
// Translation Helper for JS injections
// --------------------------------------------------------------------
function getTrans(key, fallback) {
    if (typeof currentLanguage !== "undefined" && typeof translations !== "undefined" && translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
    }
    if (currentLanguage === 'hi') {
        return autoHi(fallback);
    }
    return fallback;
}
function tVal(crop, propEn, propTe) {
    if (currentLanguage === 'te' && crop[propTe]) return crop[propTe];
    let val = crop[propEn] || '-';
    if (currentLanguage === 'hi') return autoHi(val);
    return val;
}
function tObj(obj) {
    if (!obj) return "-";
    if (typeof obj === 'string') return currentLanguage === 'hi' ? autoHi(obj) : obj;
    if (currentLanguage === 'hi' && obj.hi) return obj.hi;
    if (currentLanguage === 'hi') return autoHi(obj.en); // Fallback to autoHi for english strings
    return currentLanguage === 'te' && obj.te ? obj.te : obj.en;
}



// Static, Bulletproof Unsplash image maps!



// =====================================================
// OPEN CROP DETAILS POPUP
// =====================================================
function openCropDetails(id) {
    let crop = crops.find(item => item.id == id);
    if (!crop) return;

    let popup = document.getElementById("popup");
    let info = document.getElementById("cropInfo");
    let title = document.getElementById("cropTitle");
    let img = document.getElementById("cropImage");
    let fertContainer = document.getElementById("fertilizerContainer");
    let disContainer = document.getElementById("diseaseContainer");

    if (title) {
        let name = currentLanguage === 'te' && crop.teluguName ? crop.teluguName : (currentLanguage === 'hi' ? autoHi(crop.name) : crop.name);
        title.innerHTML = `🌱 ${name}`;
    }

    if (img) {
        img.src = crop.cropImage || crop.image;
        img.alt = crop.imageAlt || crop.name;
        const fallbackImg = "https://images.unsplash.com/photo-1599557038167-3343d3fb66ce?w=800&q=80";
        img.onerror = function () {
            this.onerror = null;
            this.src = fallbackImg;
        };
    }

    let growing = document.getElementById("growingPlaces");
    let desc = document.getElementById("cropDescription");

    if (desc) {
        desc.innerHTML = tObj(crop.description) || crop.description || "-";
    }

    if (growing) {
        let states = extractList(tObj(crop.majorGrowingStates));
        let ap = extractList(tObj(crop.majorGrowingDistrictsAP));
        let ts = extractList(tObj(crop.majorGrowingDistrictsTS));

        let gHtml = "";
        if (states) gHtml += `<p><b>${getTrans('growingStates', 'Growing States')}:</b> ${states}</p>`;
        if (ap) gHtml += `<p><b>${getTrans('aPDistricts', 'AP Districts')}:</b> ${ap}</p>`;
        if (ts) gHtml += `<p><b>${getTrans('telanganaDistricts', 'Telangana Districts')}:</b> ${ts}</p>`;
        growing.innerHTML = gHtml || `<p>${getTrans("noData", "No data available.")}</p>`;
    }

    if (info) {
        const fields = [
            { label: "Category", val: tObj(crop.category) || crop.category },
            { label: "Season", val: getTrans(crop.season ? crop.season.toLowerCase() : "", crop.season) },
            { label: "Soil Type", val: getTrans(crop.soil ? crop.soil.replace(/\s+/g, '').replace(/^[A-Z]/, c => c.toLowerCase()) : "", crop.soil) },
            { label: "Water Requirement", val: getTrans(crop.water ? crop.water.toLowerCase() : "", crop.water) },
            { label: "Temperature", val: crop.temperature },
            { label: "Profit", val: tObj(crop.profitPerAcre) },
            { label: "Investment", val: tObj(crop.investmentPerAcre) },
            { label: "Humidity", val: tVal(crop, "humidity", "teluguHumidity") },
            { label: "Seed Rate", val: tVal(crop, "seedRate", "teluguSeedRate") },
            { label: "Market Price", val: tObj(crop.price) || crop.price },
            { label: "Sowing Months", val: tObj(crop.bestSowingMonths) },
            { label: "Harvest Months", val: tObj(crop.harvestingMonths) },
            { label: "Rainfall", val: tVal(crop, "rainfall", "teluguRainfall") },
            { label: "Description", val: tObj(crop.description) || crops.find(c=>c.id==crop.id)?.purposeEn }
        ];

        let html = "";

        fields.forEach(f => {
            if (f.val && f.val !== "-" && f.val !== "") {
                let labelKey = f.label.replace(/\s+/g, '').replace(/^[A-Z]/, c => c.toLowerCase());
                html += `
                <div>
                    <b>${getTrans(labelKey, f.label)}</b>
                    <p>${Array.isArray(f.val) ? f.val.join(", ") : f.val}</p>
                </div>`;
            }
        });

        info.innerHTML = html;
    }

    if (fertContainer) {
        if (!crop.fertilizers || crop.fertilizers.length === 0) {
            fertContainer.innerHTML = `<p>${getTrans("noData", "No fertilizer data available.")}</p>`;
        } else {
            fertContainer.innerHTML = crop.fertilizers.map((item, idx) => {
                let name = currentLanguage === 'te' && item.teluguName ? item.teluguName : (currentLanguage === 'hi' ? autoHi(item.name) : item.name);
                let purpose = currentLanguage === 'te' && item.purposeTe ? item.purposeTe : (currentLanguage === 'hi' ? autoHi(item.purposeEn || item.purpose) : item.purposeEn || item.purpose);
                let sched = crop.fertilizerSchedule ? crop.fertilizerSchedule[idx] : null;

                let schedText = "";
                if (sched) {
                    let schedKey = sched.stage.replace(/\W+/g, '');
                    schedText = ` (${getTrans("stage", "Stage")}: ${getTrans(schedKey, sched.stage)})`;
                }

                return `
<div class="fertilizer-card">
    ${item.name ? `` : ""}
    <h4>${name}${schedText}</h4>
    <p>${purpose}</p>
</div>
`;
            }).join("");
        }
    }

    if (disContainer) {
        if (!crop.diseases && !crop.majorDiseases) {
            disContainer.innerHTML = `<p>${getTrans("noData", "No disease data available.")}</p>`;
        } else {
            let list = crop.majorDiseases || crop.diseases || [];
            disContainer.innerHTML = list.map(item => {
                let name = currentLanguage === 'te' && item.teluguName ? item.teluguName : (currentLanguage === 'hi' ? autoHi(item.name) : item.name);
                let sym = currentLanguage === 'te' && item.symptomsTe ? item.symptomsTe : (currentLanguage === 'hi' ? autoHi(item.symptomsEn || item.symptoms) : item.symptomsEn || item.symptoms);
                let ctrl = currentLanguage === 'te' && item.controlTe ? item.controlTe : (currentLanguage === 'hi' ? autoHi(item.controlEn || item.control) : item.controlEn || item.control);
                // Ignore replacing the rest since this regex maps carefully. && item.controlTe ? item.controlTe : (currentLanguage === 'hi' ? autoHi(item.controlEn || item.control) : item.controlEn || item.control);

                return `
<div class="disease-card">
    ${item.name ? `` : ""}
    <h4>${name}</h4>
    <p><b>${getTrans('symptoms', 'Symptoms')}:</b> ${sym}</p>
    <p><b>${getTrans('control', 'Control')}:</b> ${ctrl}</p>
</div>
`;
            }).join("");
        }
    }

    if (popup) popup.style.display = "flex";
}

function extractList(val) {
    if (Array.isArray(val)) return val.join(", ");
    return val;
}

// =====================================================
// CLOSE POPUP
// =====================================================
function closePopup() {
    let popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "none";
        popup.setAttribute("aria-hidden", "true");
    }
}

// Close on outside click
window.addEventListener("click", function (event) {
    let popup = document.getElementById("popup");
    if (event.target === popup) closePopup();
});

// =====================================================
// WEATHER CARD (PLACEHOLDER FOR NOW)
// =====================================================
async function initializeWeather() {
    let today = document.getElementById("todayWeather");
    let tomorrow = document.getElementById("tomorrowWeather");
    let next = document.getElementById("nextWeather");
    
    let todayTmp = document.getElementById("todayTemp");
    let tomorrowTmp = document.getElementById("tomorrowTemp");
    let nextTmp = document.getElementById("nextTemp");

    let weatherTitle = document.querySelector('[data-key="weatherTitle"]');
    
    // Default fallback coordinates (Hyderabad)
    let lat = 17.3850;
    let lon = 78.4867;
    let locationName = "Hyderabad";

    const fetchMeteo = async (latitude, longitude, locName) => {
        try {
            let res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max&timezone=auto`);
            let data = await res.json();
            
            let codes = data.daily.weathercode;
            let temps = data.daily.temperature_2m_max;
            
            function getWText(code) { return code <= 3 ? "Clear" : code <= 48 ? "Cloudy" : code <= 67 ? "Rainy" : "Stormy"; }
            function transW(text) { return (typeof getTrans === 'function') ? getTrans('weather' + text, text) : text; }
            
            if (today && codes[0] !== undefined) { today.innerText = transW(getWText(codes[0])); todayTmp.innerText = temps[0] + "°C"; }
            if (tomorrow && codes[1] !== undefined) { tomorrow.innerText = transW(getWText(codes[1])); tomorrowTmp.innerText = temps[1] + "°C"; }
            if (next && codes[2] !== undefined) { next.innerText = transW(getWText(codes[2])); nextTmp.innerText = temps[2] + "°C"; }
            
            if (weatherTitle && locName) {
                // Attach hyper-local name to the header
                let baseTitle = typeof getTrans === 'function' ? getTrans('weatherTitle', '🌦 Weather Intelligence') : '🌦 Weather Intelligence';
                weatherTitle.innerHTML = baseTitle + ` <span style="font-size:1.1rem; color:#128c7e;">(📍 ${locName})</span>`;
            }
        } catch(e) {
            console.error('Weather Fail:', e);
            if(today) today.innerHTML = "Offline";
            if(tomorrow) tomorrow.innerHTML = "Offline";
        }
    };

    if (navigator.geolocation) {
        if (weatherTitle) {
            let baseTitle = typeof getTrans === 'function' ? getTrans('weatherTitle', '🌦 Weather Intelligence') : '🌦 Weather Intelligence';
            weatherTitle.innerHTML = baseTitle + ` <span style="font-size:1.0rem; color:#888;">(Locating...)</span>`;
        }
        
        navigator.geolocation.getCurrentPosition(async (position) => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            
            // Phase 2: Reverse Geocoding API (OpenStreetMap Nominatim)
            try {
                let geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                let geoData = await geoRes.json();
                locationName = geoData.address.village || geoData.address.suburb || geoData.address.neighbourhood || geoData.address.town || geoData.address.city || geoData.address.state_district || "Your Location";
            } catch(e) { console.log('Reverse Geo Failed'); }
            
            fetchMeteo(lat, lon, locationName);
        }, (error) => {
            console.warn("Geolocation Denied or Failed. Falling back to Hyderabad.");
            fetchMeteo(lat, lon, locationName);
        }, { timeout: 8000 });
    } else {
        fetchMeteo(lat, lon, locationName);
    }
}

// =====================================================
// AI VOICE ASSISTANT
// =====================================================
function startVoiceAssistant() {
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert(getTrans("voiceNotSupported", "Voice assistant is not supported in this browser"));
        return;
    }

    let recognition = new SpeechRecognition();
    recognition.lang = typeof currentLanguage !== "undefined" && currentLanguage === "te" ? "te-IN" : "en-IN";

    // Add listening feedback
    let micBtn = document.getElementById("aiMic");
    if (micBtn) micBtn.classList.add("listening");

    recognition.onend = function () {
        if (micBtn) micBtn.classList.remove("listening");
    }

    recognition.onerror = function () {
        if (micBtn) micBtn.classList.remove("listening");
    }

    recognition.onresult = function (event) {
        let text = event.results[0][0].transcript.toLowerCase();
        processVoiceCommand(text);
    };

    recognition.start();
}

function processVoiceCommand(command) {
    if (command.includes("crop") || command.includes("పంట")) {
        document.getElementById("crops")?.scrollIntoView({ behavior: "smooth" });
        speakText(getTrans("navigatingToCrops", "Navigating to crops section"));
    }
    else if (command.includes("weather") || command.includes("వాతావరణం")) {
        document.getElementById("weather")?.scrollIntoView({ behavior: "smooth" });
        speakText(getTrans("navigatingToWeather", "Navigating to weather section"));
    }
    else if (command.includes("market") || command.includes("మార్కెట్")) {
        document.getElementById("market")?.scrollIntoView({ behavior: "smooth" });
        speakText(getTrans("navigatingToMarket", "Navigating to market section"));
    }
    else {
        speakText(getTrans("voiceFallbackMsg", "I can help with crops, weather and farming information"));
    }
}

// =====================================================
// TEXT TO SPEECH
// =====================================================
function speakText(text) {
    if ('speechSynthesis' in window) {
        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = typeof currentLanguage !== "undefined" && currentLanguage === "te" ? "te-IN" : "en-IN";
        window.speechSynthesis.speak(speech);
    }
}