// =====================================================
// SMART CROP ADVISORY SYSTEM
// MAIN SCRIPT - FINAL VERSION
// =====================================================

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

        let s = search;
        let searchMatch = !s ||
            (crop.name && crop.name.toLowerCase().includes(s)) ||
            (crop.teluguName && crop.teluguName.includes(s)) ||
            (crop.scientificName && crop.scientificName.toLowerCase().includes(s)) ||
            (crop.category && crop.category.toLowerCase().includes(s)) ||
            (crop.keywords && crop.keywords.some(k => k.includes(s))) ||
            (crop.aliases && crop.aliases.some(a => a.toLowerCase().includes(s)));

        return seasonMatch && soilMatch && waterMatch && searchMatch;
    });

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
            <img src="${crop.cropImage || crop.image}" alt="${crop.name} field" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImg}';">
            <div class="crop-card-body">
                <h3>${currentLanguage === 'te' && crop.teluguName ? crop.teluguName : crop.name}</h3>
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
    return fallback;
}
function tVal(crop, propEn, propTe) {
    if (currentLanguage === 'te' && crop[propTe]) return crop[propTe];
    return crop[propEn] || "-";
}
function tObj(obj) {
    if (!obj) return "-";
    if (typeof obj === 'string') return obj;
    return currentLanguage === 'te' && obj.te ? obj.te : obj.en;
}

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
        let name = currentLanguage === 'te' && crop.teluguName ? crop.teluguName : crop.name;
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
            { label: "Family", val: tVal(crop, "family", "teluguFamily") },
            { label: "Season", val: getTrans(crop.season ? crop.season.toLowerCase() : "", crop.season) },
            { label: "Scientific Name", val: crop.scientificName },
            { label: "Soil", val: getTrans(crop.soil ? crop.soil.replace(/\s+/g, '').replace(/^[A-Z]/, c => c.toLowerCase()) : "", crop.soil) },
            { label: "Water Requirement", val: getTrans(crop.water ? crop.water.toLowerCase() : "", crop.water) },
            { label: "Temperature", val: crop.temperature },
            { label: "Humidity", val: tVal(crop, "humidity", "teluguHumidity") },
            { label: "Rainfall", val: tVal(crop, "rainfall", "teluguRainfall") },
            { label: "pH", val: tVal(crop, "ph", "teluguPH") },
            { label: "Duration", val: tVal(crop, "duration", "teluguDuration") },
            { label: "Seed Rate", val: tVal(crop, "seedRate", "teluguSeedRate") },
            { label: "Spacing", val: tVal(crop, "spacing", "teluguSpacing") },
            { label: "Yield", val: tVal(crop, "yield", "teluguYield") },
            { label: "Price", val: tObj(crop.price) || crop.price },
            { label: "Sowing Months", val: tObj(crop.bestSowingMonths) },
            { label: "Harvest Months", val: tObj(crop.harvestingMonths) },
            { label: "Advantages", val: extractList(tObj(crop.advantages)) },
            { label: "Uses", val: extractList(tObj(crop.uses)) },
            { label: "Market Demand", val: tObj(crop.marketDemand) },
            { label: "Profit", val: tObj(crop.profitPerAcre) },
            { label: "Investment", val: tObj(crop.investmentPerAcre) },
            { label: "Expected ROI", val: crop.investmentPerAcre && crop.profitPerAcre ? "≈120-150%" : "" },
            { label: "Tips", val: extractList(tObj(crop.tips)) },
            { label: "Irrigation", val: tObj(crop.irrigationMethod) },
            { label: "Weed Management", val: tObj(crop.weedManagement) },
            { label: "Intercropping", val: tObj(crop.intercropping) },
            { label: "Storage", val: tObj(crop.storageTips) },
            { label: "Export Potential", val: tObj(crop.exportPotential) },
            { label: "Government Schemes", val: extractList(tObj(crop.governmentSchemes)) },
            { label: "Seed Varieties", val: extractList(tObj(crop.seedVarieties)) },
            { label: "Soil Preparation", val: tObj(crop.soilPreparation) },
            { label: "Land Preparation", val: tObj(crop.landPreparation) },
            { label: "Nursery Method", val: tObj(crop.nurseryMethod) },
            { label: "Transplanting Method", val: tObj(crop.transplantingMethod) },
            { label: "Flowering Time", val: tObj(crop.floweringTime) },
            { label: "Harvest Indicators", val: tObj(crop.harvestIndicators) },
            { label: "Post Harvest Care", val: tObj(crop.postHarvestCare) },
            { label: "Nutrition", val: tObj(crop.nutritionValue) },
            { label: "Economic Importance", val: tObj(crop.economicImportance) }
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
                let name = currentLanguage === 'te' && item.teluguName ? item.teluguName : item.name;
                let purpose = currentLanguage === 'te' && item.purposeTe ? item.purposeTe : item.purposeEn || item.purpose;
                let sched = crop.fertilizerSchedule ? crop.fertilizerSchedule[idx] : null;

                let schedText = "";
                if (sched) {
                    let schedKey = sched.stage.replace(/\W+/g, '');
                    schedText = ` (${getTrans("stage", "Stage")}: ${getTrans(schedKey, sched.stage)})`;
                }

                return `
<div class="fertilizer-card">
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
                let name = currentLanguage === 'te' && item.teluguName ? item.teluguName : item.name;
                let sym = currentLanguage === 'te' && item.symptomsTe ? item.symptomsTe : item.symptomsEn || item.symptoms;
                let ctrl = currentLanguage === 'te' && item.controlTe ? item.controlTe : item.controlEn || item.control;

                return `
<div class="disease-card">
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
function initializeWeather() {
    let today = document.getElementById("todayWeather");
    let tomorrow = document.getElementById("tomorrowWeather");
    let next = document.getElementById("nextWeather");
    let todayTmp = document.getElementById("todayTemp");
    let tomorrowTmp = document.getElementById("tomorrowTemp");
    let nextTmp = document.getElementById("nextTemp");

    if (today) today.innerHTML = `<span data-key="weatherClear">${getTrans("weatherClear", "Clear")}</span>`;
    if (todayTmp) todayTmp.innerHTML = "32°C";
    if (tomorrow) tomorrow.innerHTML = `<span data-key="weatherClouds">${getTrans("weatherClouds", "Clouds")}</span>`;
    if (tomorrowTmp) tomorrowTmp.innerHTML = "31°C";
    if (next) next.innerHTML = `<span data-key="weatherRain">${getTrans("weatherRain", "Rain")}</span>`;
    if (nextTmp) nextTmp.innerHTML = "29°C";
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