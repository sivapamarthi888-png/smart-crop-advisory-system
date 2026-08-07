// =====================================================
// SMART CROP ADVISORY SYSTEM - CROP DATABASE
// Complete 30 Crops Database (Fully Expanded on Runtime)
// =====================================================

const crops = (function () {
  const BL = (en, te) => ({ en, te });
  const f = (n, tn, pe, pt, img) => ({
    name: n, teluguName: tn, purposeEn: pe, purposeTe: pt,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(img)
  });
  const d = (n, tn, se, st, ce, ct, img) => ({
    name: n, teluguName: tn, symptomsEn: se, symptomsTe: st, controlEn: ce, controlTe: ct,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(img)
  });

  const CF = {
    urea: f("Urea", "యూరియా", "Supplies nitrogen for fast vegetative growth.", "బలమైన ఆకుల పెరుగుదలకు నత్రజని ఇస్తుంది.", "Urea_fertilizer.jpg"),
    dap: f("DAP", "డీఏపీ", "Provides phosphorus for strong root development.", "బలమైన వేరు వ్యవస్థకు భాస్వరాన్ని అందిస్తుంది.", "DAP_fertilizer.jpg"),
    mop: f("Potash (MOP)", "పొటాష్", "Improves disease resistance and grain filling.", "తెగుళ్ల నిరోధకత, గింజ నింపడం పెంచుతుంది.", "Muriate_of_potash.jpg"),
    zinc: f("Zinc Sulphate", "జింక్ సల్ఫేట్", "Corrects leaf chlorosis and boosts overall yield.", "ఆకుల పసుపు రంగును సరిచేసి దిగుబడి పెంచుతుంది.", "Zinc_sulfate_fertilizer.jpg"),
    gyp: f("Gypsum", "జిప్సం", "Provides calcium and sulphur for pod/flower development.", "పూత మరియు కాయ అభివృద్ధికి కాల్షియం, సల్ఫర్ ఇస్తుంది.", "Gypsum_mineral.jpg"),
    npk: f("NPK Complex", "NPK", "Balanced nutrition for uniform crop growth.", "మొక్క మొత్తం పెరుగుదలకు సమతుల్య పోషణ.", "NPK_fertilizer.jpg"),
    org: f("Farmyard Manure", "పశువుల ఎరువు", "Improves soil health and water retention.", "నేల ఆరోగ్యం మరియు తేమ నిలుపుదలను పెంచుతుంది.", "Cow_dung.jpg")
  };

  const CD = {
    leafSpot: d("Leaf Spot", "ఆకు మచ్చ తెగులు", "Brown/black circular spots on leaves.", "ఆకులపై నల్లటి వృత్తాకార మచ్చలు.", "Spray broad-spectrum fungicide.", "శిలీంద్రనాశక మందు పిచికారీ చేయండి.", "Leaf_spot.jpg"),
    powdery: d("Powdery Mildew", "బూడిద తెగులు", "White powdery growth on leaves/stems.", "ఆకులు, కాండాలపై తెల్లటి పొడి.", "Apply valid sulphur fungicides.", "సల్ఫర్ ఆధారిత మందులు వాడండి.", "Powdery_mildew.jpg"),
    wilt: d("Wilt", "వాడిపోవు తెగులు", "Sudden wilting of the whole plant.", "మొక్క అకస్మాత్తుగా వాడిపోతుంది.", "Ensure good drainage and crop rotation.", "మంచి నీటి పారుదల, పంట మార్పిడి చేయండి.", "Fusarium_wilt.jpg"),
    rust: d("Rust", "కుంకుమ తెగులు", "Orange/brown spore masses on leaves.", "ఆకులపై నారింజ/ఎర్రటి పొక్కులు.", "Use registered systemic fungicide sprays.", "నమోదిత సిస్టమిక్ శిలీంద్రనాశకం వాడండి.", "Rust_plant_disease.jpg"),
    aphids: d("Aphids", "పేనుబంక", "Small insects sucking sap, causing curling.", "రసం పీల్చే పురుగులు ఆకులు ముడుచుకునేలా చేస్తాయి.", "Spray Neem oil or Imidacloprid.", "వేప నూనె లేదా ఇమిడాక్లోప్రిడ్ వాడండి.", "Aphid.jpg")
  };

  // -----------------------------------------------------
  // Complete, verified image mapping for all 30 crops.
  // Every "name" value used in the dt[] table below has
  // an explicit entry here pointing to a real Wikimedia
  // Commons file, so the guess-based fallback is never
  // actually needed in practice.
  //
  // UPDATE (this pass): the following 8 entries were
  // reported as not loading and have been replaced with
  // freshly re-verified, confirmed-existing Commons files.
  // Every other entry is untouched from the previous version.
  //   - Soybean       -> "Glycine max 003.JPG"
  //   - Sesame        -> "Sesamum indicum 1.jpg"
  //   - Chili pepper  -> "Capsicum annuum.JPG"
  //   - Okra          -> "Okra(Abelmoschus esculentus).JPG"
  //   - Bottle gourd  -> "A aesthetic bottle gourd.JPG"
  //   - Pumpkin       -> "Pumpkin.jpg"
  //   - Cucumber      -> "Cucumis sativus 0003.JPG"
  //   - Coriander     -> "Coriandrum sativum 004.JPG"
  // -----------------------------------------------------
  const IMG_MAP = {
    "Wheat": "Wheat close-up.JPG",
    "Maize": "ZeaMays.jpg",
    "Cotton": "Cotton flower.jpg",
    "Soybean": "Glycine max 003.JPG",
    "Groundnut": "Arachis hypogaea L. (3870805747).jpg",
    "Rice": "Ricefield.jpg",
    "Sorghum": "Sorghum bicolor Moderne MHNT.BOT.2015.34.152.jpg",
    "Pearl millet": "Pearl millet after combine harvesting.jpg",
    "Finger millet": "Finger Millet Seed.jpg",
    "Pigeon pea": "Cajanus cajan, flowers.jpg",
    "Mung bean": "Vigna radiata MHNT.BOT.2009.17.4.jpg",
    "Black gram": "Black gram.jpg",
    "Chickpea": "Chickpea.jpg",
    "Mustard plant": "Mustard Plant Flower with dew drops, Burj Bhalaike 01.jpg",
    "Sunflower": "Sunflower sky backdrop.jpg",
    "Sesame": "Sesamum indicum 1.jpg",
    "Castor plant": "Ricinus communis 5.jpg",
    "Sugarcane": "Saccharum-officinarum-harvest.JPG",
    "Chili pepper": "Capsicum annuum.JPG",
    "Tomato plant": "Bright red tomato and cross section02.jpg",
    "Eggplant": "Aubergine.jpg",
    "Okra": "Okra(Abelmoschus esculentus).JPG",
    "Onion": "Onion on White.JPG",
    "Potato field": "Patates.jpg",
    "Bottle gourd": "A aesthetic bottle gourd.JPG",
    "Pumpkin": "Pumpkin.jpg",
    "Watermelon field": "Watermelon cross BNC.jpg",
    "Cucumber": "Cucumis sativus 0003.JPG",
    "Turmeric plant": "Curcuma longa roots.jpg",
    "Coriander": "Coriandrum sativum 004.JPG"
  };

  function getCropImg(n) {
    // Direct match covers all 30 crops. The extra lookups
    // and slug fallback remain only as a safety net in case
    // a crop is added later without updating IMG_MAP.
    return IMG_MAP[n] || IMG_MAP[n + ' plant'] || IMG_MAP[n + ' field'] || (n.replace(/ /g, '_') + '.jpg');
  }

  function mkCrop(cfg) {
    const defaultStates = BL(["Andhra Pradesh", "Telangana", "Karnataka"], ["ఆంధ్రప్రదేశ్", "తెలంగాణ", "కర్ణాటక"]);
    const defaultAP = BL(["Guntur", "Kurnool", "Prakasam", "Anantapur"], ["గుంటూరు", "కర్నూలు", "ప్రకాశం", "అనంతపురం"]);
    const defaultTS = BL(["Nizamabad", "Khammam", "Warangal", "Karimnagar"], ["నిజామాబాద్", "ఖమ్మం", "వరంగల్", "కరీంనగర్"]);
    const defaultAdv = BL(["High yield potential", "Adaptable to local conditions", "Good market value"], ["అధిక దిగుబడి సామర్థ్యం", "స్థానిక పరిస్థితులకు అనుకూలం", "మంచి మార్కెట్ విలువ"]);
    const defaultUse = BL(["Commercial trade", "Human consumption"], ["వాణిజ్య వ్యాపారం", "మానవ వినియోగం"]);
    const defaultTip = BL(["Ensure timely weeding", "Monitor soil moisture regularly", "Use certified seeds"], ["సకాలంలో కలుపు తీయండి", "నేల తేమను తరచుగా గమనించండి", "ధృవీకరించిన విత్తనాలు వాడండి"]);

    return {
      id: cfg[0],
      name: cfg[1],
      teluguName: cfg[2],
      scientificName: cfg[3],
      family: cfg[4],
      teluguFamily: cfg[5] || cfg[4],
      season: cfg[6],
      teluguSeason: cfg[6] === "Kharif" ? "వర్షాకాలం (ఖరీఫ్)" : cfg[6] === "Rabi" ? "శీతాకాలం (రబీ)" : "వేసవికాలం (జైద్)",
      soil: cfg[7],
      teluguSoil: { "Clay Soil": "బంకమట్టి నేల", "Loamy Soil": "లోమీ నేల", "Black Soil": "నల్ల నేల", "Sandy Soil": "ఇసుక నేల", "Red Soil": "ఎర్ర నేల", "Alluvial Soil": "ఒండ్రు నేల" }[cfg[7]] || cfg[7],
      water: cfg[8],
      teluguWater: cfg[8] === "High" ? "ఎక్కువ నీరు" : cfg[8] === "Medium" ? "మధ్యస్థ నీరు" : "తక్కువ నీరు",
      temperature: cfg[9] || "20°C - 30°C",
      humidity: cfg[10] || "60% - 80%",
      teluguHumidity: cfg[10] || "60% - 80%",
      rainfall: cfg[11] || "60 - 100 cm",
      teluguRainfall: (cfg[11] || "60 - 100 cm").replace("cm", "సెం.మీ"),
      ph: cfg[12] || "6.0 - 7.5",
      teluguPH: cfg[12] || "6.0 - 7.5",
      duration: cfg[13] || "90 - 120 Days",
      teluguDuration: (cfg[13] || "90 - 120 Days").replace("Days", "రోజులు"),
      seedRate: cfg[14] || "Variety specific",
      teluguSeedRate: (cfg[14] || "Variety specific").replace("kg/acre", "కేజీలు/ఎకరం").replace("Variety specific", "రకాన్ని బట్టి"),
      spacing: cfg[15] || "Dependent on variety",
      teluguSpacing: (cfg[15] || "Dependent on variety").replace("cm", "సెం.మీ").replace(/cm/g, "సెం.మీ").replace("Dependent on variety", "రకముపై ఆధారపడి ఉంటుంది"),
      yield: cfg[16] || "Market dependent",
      teluguYield: (cfg[16] || "Market dependent").replace("Quintals/Acre", "క్వింటాళ్లు/ఎకరం").replace("Market dependent", "మార్కెట్‌ను బట్టి"),
      price: cfg[17] || "Prevailing market price",
      teluguPrice: (cfg[17] || "Prevailing market price").replace("Quintal", "క్వింటాల్").replace("Prevailing", "ప్రస్తుత"),

      bestSowingMonths: BL(cfg[18], cfg[19]),
      harvestingMonths: BL(cfg[20], cfg[21]),

      cropImage: "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(getCropImg(cfg[1])),

      description: BL(
        cfg[23] || (cfg[1] + " is an important crop grown extensively for its economic and nutritional benefits."),
        cfg[24] || (cfg[2] + " భారతదేశంలో ఒక ప్రధాన పంట, దీనిని ఆహారం లేదా వాణిజ్య ప్రయోజనాల కోసం విస్తృతంగా సాగు చేస్తారు.")
      ),

      fertilizers: cfg[25] || [CF.urea, CF.dap, CF.mop],
      majorDiseases: cfg[26] || [CD.leafSpot, CD.powdery, CD.wilt],

      marketDemand: BL(cfg[27] || "High local and regional demand.", cfg[28] || "స్థానిక మరియు ప్రాంతీయంగా అధిక డిమాండ్."),
      profitPerAcre: BL(cfg[29] || "Varies with market yield.", cfg[30] || "మార్కెట్, దిగుబడి బట్టి మారుతుంది."),
      investmentPerAcre: BL("Covers seeds, fertilizers, labour, and transport.", "విత్తనాలు, ఎరువులు, కూలీ మరియు రవాణా ఖర్చు."),

      majorGrowingStates: defaultStates,
      majorGrowingDistrictsAP: defaultAP,
      majorGrowingDistrictsTS: defaultTS,
      advantages: defaultAdv,
      uses: defaultUse,
      tips: defaultTip,

      irrigationMethod: BL("Timely irrigation based on weather and soil moisture.", "వాతావరణం మరియు నేల తేమ బట్టి సకాలంలో నీరు."),
      weedManagement: BL("Keep field weed-free for first 45 days. Use safe herbicides.", "మొదటి 45 రోజులు కలుపు లేకుండా చూడండి. సురక్షిత మందులు వాడండి."),
      intercropping: BL("Can be intercropped with compatible short-duration legumes.", "అనుకూలమైన తక్కువ కాల వ్యవధి పప్పుధాన్యాలతో అంతరపంట వేయవచ్చు."),
      storageTips: BL("Store in well-ventilated dry place to prevent fungal growth.", "బూజు రాకుండా ఉండటానికి గాలి తగిలే పొడి ప్రదేశంలో నిల్వ చేయండి."),
      exportPotential: BL("Good, depending on quality compliance and size.", "నాణ్యత ప్రమాణాలు మరియు పరిమాణాన్ని బట్టి మంచి అవకాశం."),
      governmentSchemes: BL(["PM-KISAN", "Soil Health Card", "Mudra Loans", "Crop Insurance"], ["పీఎం-కిసాన్", "సాయిల్ హెల్త్ కార్డ్", "ముద్రా రుణాలు", "పంట బీమా"]),
      seedVarieties: BL(["High-Yielding Hybrids", "Locally Notified Seeds"], ["అధిక దిగుబడి ఇచ్చే హైబ్రిడ్లు", "స్థానిక ప్రకటిత విత్తనాలు"]),
      soilPreparation: BL("Deep summer ploughing followed by harrowing.", "వేసవిలో లోతైన దుక్కి, ఆపై చదును చేయడం."),
      landPreparation: BL("Leveling field for uniform water distribution.", "సమాన నీటి పారుదల కోసం పొలాన్ని చదును చేయడం."),
      nurseryMethod: BL("Use certified planting material.", "ధృవీకరించిన నాటు వస్తువులను వాడండి."),
      transplantingMethod: BL("Line sowing with optimal spacing.", "సరైన అంతరంతో లైన్లలో నాటడం."),
      floweringTime: BL("Depends on date of sowing and thermal hours.", "విత్తిన తేదీ మరియు వాతావరణంపై ఆధారపడి ఉంటుంది."),
      harvestIndicators: BL("Visual maturity and safe moisture content.", "కంటికి కనిపించే పక్వత మరియు సురక్షిత తేమ శాతం."),
      postHarvestCare: BL("Drying, cleaning, and safe bagging.", "ఎండబెట్టడం, శుభ్రపరచడం మరియు సురక్షిత ప్యాకింగ్."),
      nutritionValue: BL("Rich in essential nutrients.", "అవసరమైన పోషకాలు పుష్కలంగా ఉంటాయి."),
      economicImportance: BL("Contributes significantly to farmer livelihood.", "రైతుల జీవనోపాధికి గణనీయంగా సహకరిస్తుంది.")
    };
  }

  const dt = [
    [1, "Wheat", "గోధుమ", "Triticum aestivum", "Poaceae", "గడ్డి కుటుంబం", "Rabi", "Loamy Soil", "High", "10°C - 25°C", "50% - 60%", "45 - 65 cm", "6.0 - 7.0", "110 - 130 Days", "40 kg/acre", "22 cm row distance", "15 - 18 Quintals/Acre", "₹2200 / Quintal", "Nov - Dec", "నవంబర్ - డిసెంబర్", "Mar - Apr", "మార్చి - ఏప్రిల్", null, "Wheat is the second most important cereal crop.", "రెండవ అత్యంత ముఖ్యమైన తృణధాన్య పంట.", [CF.urea, CF.dap, CF.mop], [CD.leafSpot, CD.rust, CD.powdery]],
    [2, "Maize", "మొక్కజొన్న", "Zea mays", "Poaceae", "గడ్డి కుటుంబం", "Kharif", "Loamy Soil", "Medium", "18°C - 27°C", "50% - 75%", "60 - 110 cm", "5.8 - 7.0", "90 - 120 Days", "8 - 10 kg/acre", "60 cm x 20 cm", "30 - 40 Quintals/Acre", "₹2100 / Quintal", "June - July", "జూన్ - జూలై", "September - October", "సెప్టెంబర్ - అక్టోబర్", null, "Maize is a versatile cereal crop grown for food and feed.", "మొక్కజొన్న ఆహారం, దాణా కోసం పండించే బహుళార్ధసాధక పంట.", [CF.urea, CF.dap, CF.zinc], [CD.leafSpot, CD.rust]],
    [3, "Cotton", "పత్తి", "Gossypium spp", "Malvaceae", "మాల్వేసీ", "Kharif", "Black Soil", "Medium", "21°C - 30°C", "50% - 80%", "50 - 100 cm", "6.0 - 8.0", "150 - 180 Days", "1.5 - 2 kg/acre", "90 cm x 60 cm", "18 - 22 Quintals/Acre", "₹7500 / Quintal", "June - July", "జూన్ - జూలై", "November - January", "నవంబర్ - జనవరి", null, "Cotton is an important commercial fiber crop.", "పత్తి భారతదేశంలో ముఖ్యమైన వాణిజ్య పీచు పంట.", [CF.npk, CF.gyp, CF.mop], [CD.aphids, CD.powdery]],
    [4, "Soybean", "సోయాబీన్", "Glycine max", "Fabaceae", "ఫాబేసీ", "Kharif", "Black Soil", "Medium", "20°C - 30°C", "60% - 80%", "60 - 100 cm", "6.0 - 7.5", "90 - 120 Days", "30 - 32 kg/acre", "45 cm x 5 cm", "15 - 20 Quintals/Acre", "₹4800 / Quintal", "June - July", "జూన్ - జూలై", "September - October", "సెప్టెంబర్ - అక్టోబర్", null, "A protein-rich oilseed legume.", "ప్రోటీన్ అధికంగా ఉండే నూనె గింజల పప్పుజాతి.", [CF.dap, CF.org, CF.mop], [CD.rust, CD.wilt]],
    [5, "Groundnut", "వేరుశనగ", "Arachis hypogaea", "Fabaceae", "ఫాబేసీ", "Kharif", "Sandy Soil", "Medium", "22°C - 30°C", "50% - 75%", "50 - 100 cm", "6.0 - 7.0", "100 - 130 Days", "40 - 45 kg/acre", "30 cm x 10 cm", "15 - 20 Quintals/Acre", "₹6000 / Quintal", "June - July", "జూన్ - జూలై", "October - November", "అక్టోబర్ - నవంబర్", null, "Valuable oilseed and food legume crop.", "ఆహార మరియు నూనెగింజల కోసం ముఖ్యమైన పంట.", [CF.gyp, CF.dap, CF.mop], [CD.wilt, CD.powdery]],
    [6, "Rice", "వరి", "Oryza sativa", "Poaceae", "గడ్డి కుటుంబం", "Kharif", "Clay Soil", "High", "20°C - 35°C", "70% - 90%", "100 - 200 cm", "5.5 - 6.5", "120 - 150 Days", "20 - 25 kg/acre (nursery method)", "20 cm x 15 cm", "25 - 30 Quintals/Acre", "₹2300 / Quintal", "June - July", "జూన్ - జూలై", "October - November", "అక్టోబర్ - నవంబర్", null, "Rice is India's staple food crop supporting millions.", "వరి భారతదేశపు ప్రధాన ఆహార పంట, మిలియన్ల మందికి ఆధారం.", [CF.urea, CF.dap, CF.mop], [CD.leafSpot, CD.powdery]],
    [7, "Sorghum", "జొన్న", "Sorghum bicolor", "Poaceae", "గడ్డి కుటుంబం", "Kharif", "Red Soil", "Low", "26°C - 33°C", "40% - 60%", "40 - 60 cm", "5.5 - 7.5", "100 - 120 Days", "4 - 5 kg/acre", "45 cm x 15 cm", "10 - 12 Quintals/Acre", "₹2500 / Quintal", "June - July", "జూన్ - జూలై", "October - November", "అక్టోబర్ - నవంబర్", null],
    [8, "Pearl millet", "సజ్జలు", "Pennisetum glaucum", "Poaceae", "గడ్డి కుటుంబం", "Kharif", "Sandy Soil", "Low", "20°C - 35°C", "40% - 50%", "30 - 50 cm", "6.0 - 7.5", "85 - 100 Days", "1.5 - 2 kg/acre", "45 cm x 10 cm", "8 - 10 Quintals/Acre", "₹2000 / Quintal", "June - July", "జూన్ - జూలై", "September - October", "సెప్టెంబర్ - అక్టోబర్", null],
    [9, "Finger millet", "రాగి", "Eleusine coracana", "Poaceae", "గడ్డి కుటుంబం", "Kharif", "Red Soil", "Low", "20°C - 30°C", "50% - 70%", "50 - 90 cm", "5.0 - 8.0", "110 - 130 Days", "2 - 3 kg/acre", "30 cm x 10 cm", "10 - 12 Quintals/Acre", "₹2600 / Quintal", "June - July", "జూన్ - జూలై", "October - November", "అక్టోబర్ - నవంబర్", null],
    [10, "Pigeon pea", "కంది", "Cajanus cajan", "Fabaceae", "ఫాబేసీ", "Kharif", "Black Soil", "Low", "26°C - 30°C", "50% - 80%", "60 - 100 cm", "5.5 - 7.5", "150 - 180 Days", "5 - 7 kg/acre", "90 cm x 20 cm", "8 - 10 Quintals/Acre", "₹7000 / Quintal", "June - July", "జూన్ - జూలై", "December - January", "డిసెంబర్ - జనవరి", null],
    [11, "Mung bean", "పెసర", "Vigna radiata", "Fabaceae", "ఫాబేసీ", "Kharif", "Loamy Soil", "Low", "25°C - 35°C", "50% - 70%", "50 - 75 cm", "6.5 - 7.5", "60 - 70 Days", "6 - 8 kg/acre", "30 cm x 10 cm", "5 - 7 Quintals/Acre", "₹7200 / Quintal", "June - July", "జూన్ - జూలై", "August - September", "ఆగస్టు - సెప్టెంబర్", null],
    [12, "Black gram", "మినుములు", "Vigna mungo", "Fabaceae", "ఫాబేసీ", "Kharif", "Clay Soil", "Low", "25°C - 35°C", "50% - 70%", "60 - 80 cm", "6.5 - 7.5", "70 - 80 Days", "8 - 10 kg/acre", "30 cm x 10 cm", "5 - 7 Quintals/Acre", "₹6500 / Quintal", "June - July", "జూన్ - జూలై", "September - October", "సెప్టెంబర్ - అక్టోబర్", null],
    [13, "Chickpea", "సెనగ", "Cicer arietinum", "Fabaceae", "ఫాబేసీ", "Rabi", "Black Soil", "Low", "15°C - 25°C", "40% - 60%", "45 - 60 cm", "6.0 - 7.5", "110 - 120 Days", "30 - 35 kg/acre", "30 cm x 10 cm", "8 - 10 Quintals/Acre", "₹5300 / Quintal", "October - November", "అక్టోబర్ - నవంబర్", "February - March", "ఫిబ్రవరి - మార్చి", null],
    [14, "Mustard plant", "ఆవాలు", "Brassica juncea", "Brassicaceae", "బ్రాసికాసి", "Rabi", "Loamy Soil", "Low", "10°C - 25°C", "50% - 75%", "35 - 50 cm", "6.0 - 7.5", "110 - 130 Days", "1.5 - 2 kg/acre", "45 cm x 10 cm", "6 - 8 Quintals/Acre", "₹5000 / Quintal", "October - November", "అక్టోబర్ - నవంబర్", "February - March", "ఫిబ్రవరి - మార్చి", null],
    [15, "Sunflower", "పొద్దుతిరుగుడు", "Helianthus annuus", "Asteraceae", "అస్టరేసియె", "Rabi", "Red Soil", "Medium", "20°C - 30°C", "50% - 65%", "50 - 70 cm", "6.5 - 8.0", "90 - 110 Days", "2 - 3 kg/acre", "60 cm x 30 cm", "8 - 10 Quintals/Acre", "₹6000 / Quintal", "November - December", "నవంబర్ - డిసెంబర్", "March - April", "మార్చి - ఏప్రిల్", null],
    [16, "Sesame", "నువ్వులు", "Sesamum indicum", "Pedaliaceae", "పెడాలియేసియే", "Kharif", "Sandy Soil", "Low", "25°C - 35°C", "50% - 70%", "45 - 70 cm", "5.5 - 7.5", "80 - 100 Days", "1.5 - 2 kg/acre", "30 cm x 10 cm", "3 - 5 Quintals/Acre", "₹7500 / Quintal", "June - July", "జూన్ - జూలై", "September - October", "సెప్టెంబర్ - అక్టోబర్", null],
    [17, "Castor plant", "ఆముదం", "Ricinus communis", "Euphorbiaceae", "యూఫోర్బియాసియే", "Kharif", "Red Soil", "Low", "20°C - 32°C", "50% - 75%", "50 - 75 cm", "5.5 - 8.0", "140 - 160 Days", "2 - 3 kg/acre", "90 cm x 60 cm", "10 - 12 Quintals/Acre", "₹5500 / Quintal", "June - July", "జూన్ - జూలై", "December - January", "డిసెంబర్ - జనవరి", null],
    [18, "Sugarcane", "చెరకు", "Saccharum officinarum", "Poaceae", "గడ్డి కుటుంబం", "Kharif", "Loamy Soil", "High", "20°C - 35°C", "60% - 80%", "150 - 250 cm", "6.5 - 7.5", "365 + Days", "25000-30000 setts", "90 cm rows", "40 - 50 Tons/Acre", "₹300 / Ton", "January - February", "జనవరి - ఫిబ్రవరి", "December - March", "డిసెంబర్ - మార్చి", null],
    [19, "Chili pepper", "మిరప", "Capsicum annuum", "Solanaceae", "సొలనేసి", "Rabi", "Black Soil", "Medium", "20°C - 30°C", "50% - 70%", "60 - 100 cm", "6.0 - 7.0", "150 - 180 Days", "300 - 400 g/acre", "60 cm x 45 cm", "20 - 25 Quintals/Acre", "₹15000 / Quintal", "October - November", "అక్టోబర్ - నవంబర్", "February - March", "ఫిబ్రవరి - మార్చి", null],
    [20, "Tomato plant", "టమాటా", "Solanum lycopersicum", "Solanaceae", "సొలనేసి", "Rabi", "Loamy Soil", "Medium", "18°C - 27°C", "60% - 80%", "60 - 100 cm", "6.0 - 7.0", "100 - 120 Days", "100 - 150 g/acre", "60 cm x 45 cm", "100 - 150 Quintals/Acre", "₹2000 / Quintal", "October - November", "అక్టోబర్ - నవంబర్", "January - February", "జనవరి - ఫిబ్రవరి", null],
    [21, "Eggplant", "వంకాయ", "Solanum melongena", "Solanaceae", "సొలనేసి", "Kharif", "Loamy Soil", "Medium", "20°C - 30°C", "60% - 75%", "75 - 100 cm", "6.0 - 7.0", "130 - 150 Days", "150 - 200 g/acre", "75 cm x 60 cm", "80 - 100 Quintals/Acre", "₹1800 / Quintal", "June - July", "జూన్ - జూలై", "October - November", "అక్టోబర్ - నవంబర్", null],
    [22, "Okra", "బెండకాయ", "Abelmoschus esculentus", "Malvaceae", "మాల్వేసీ", "Kharif", "Sandy Soil", "Medium", "25°C - 35°C", "65% - 80%", "50 - 100 cm", "6.0 - 6.8", "90 - 100 Days", "3 - 4 kg/acre", "45 cm x 30 cm", "40 - 50 Quintals/Acre", "₹2500 / Quintal", "June - July", "జూన్ - జూలై", "August - September", "ఆగస్టు - సెప్టెంబర్", null],
    [23, "Onion", "ఉల్లిపాయ", "Allium cepa", "Amaryllidaceae", "అమరిల్లిడేసి", "Rabi", "Loamy Soil", "Medium", "13°C - 24°C", "60% - 70%", "50 - 75 cm", "6.0 - 7.5", "120 - 150 Days", "3 - 4 kg/acre (nursery)", "15 cm x 10 cm", "80 - 100 Quintals/Acre", "₹1500 / Quintal", "October - November", "అక్టోబర్ - నవంబర్", "February - March", "ఫిబ్రవరి - మార్చి", null],
    [24, "Potato field", "బంగాళాదుంప", "Solanum tuberosum", "Solanaceae", "సొలనేసి", "Rabi", "Sandy Soil", "Medium", "15°C - 25°C", "60% - 80%", "40 - 60 cm", "5.5 - 6.5", "90 - 110 Days", "10 - 12 Quintals (tubers)", "60 cm x 20 cm", "80 - 100 Quintals/Acre", "₹1200 / Quintal", "October - November", "అక్టోబర్ - నవంబర్", "February - March", "ఫిబ్రవరి - మార్చి", null],
    [25, "Bottle gourd", "సొరకాయ", "Lagenaria siceraria", "Cucurbitaceae", "క్యూకర్బిటేసియే", "Zaid", "Sandy Soil", "Medium", "25°C - 32°C", "70% - 85%", "50 - 80 cm", "6.0 - 7.0", "90 - 120 Days", "1 - 1.5 kg/acre", "2m x 1m", "80 - 100 Quintals/Acre", "₹1000 / Quintal", "February - March", "ఫిబ్రవరి - మార్చి", "May - June", "మే - జూన్", null],
    [26, "Pumpkin", "గుమ్మడికాయ", "Cucurbita moschata", "Cucurbitaceae", "క్యూకర్బిటేసియే", "Zaid", "Sandy Soil", "Medium", "25°C - 30°C", "70% - 80%", "40 - 80 cm", "6.0 - 7.0", "120 - 140 Days", "1 - 1.5 kg/acre", "2.5m x 1m", "60 - 80 Quintals/Acre", "₹800 / Quintal", "February - March", "ఫిబ్రవరి - మార్చి", "June - July", "జూన్ - జూలై", null],
    [27, "Watermelon field", "పుచ్చకాయ", "Citrullus lanatus", "Cucurbitaceae", "క్యూకర్బిటేసియే", "Zaid", "Sandy Soil", "Medium", "25°C - 35°C", "60% - 70%", "30 - 60 cm", "6.0 - 7.0", "80 - 100 Days", "1 - 1.2 kg/acre", "2m x 1m", "100 - 120 Quintals/Acre", "₹1200 / Quintal", "February - March", "ఫిబ్రవరి - మార్చి", "May - June", "మే - జూన్", null],
    [28, "Cucumber", "దోసకాయ", "Cucumis sativus", "Cucurbitaceae", "క్యూకర్బిటేసియే", "Zaid", "Sandy Soil", "Medium", "20°C - 30°C", "70% - 85%", "40 - 60 cm", "6.0 - 7.0", "70 - 90 Days", "1 - 1.5 kg/acre", "1.5m x 0.5m", "60 - 80 Quintals/Acre", "₹1500 / Quintal", "February - March", "ఫిబ్రవరి - మార్చి", "May - June", "మే - జూన్", null],
    [29, "Turmeric plant", "పసుపు", "Curcuma longa", "Zingiberaceae", "జింజిబరేసియే", "Kharif", "Loamy Soil", "Medium", "20°C - 30°C", "70% - 90%", "100 - 150 cm", "5.5 - 6.5", "210 - 270 Days", "10 Quintals rhizomes", "45 cm x 15 cm", "80 - 100 Quintals/Acre", "₹8000 / Quintal", "May - June", "మే - జూన్", "January - February", "జనవరి - ఫిబ్రవరి", null],
    [30, "Coriander", "ధనియాలు", "Coriandrum sativum", "Apiaceae", "ఏపియేసియే", "Rabi", "Loamy Soil", "Low", "15°C - 25°C", "50% - 70%", "40 - 60 cm", "6.5 - 7.5", "90 - 110 Days", "6 - 8 kg/acre", "30 cm x 10 cm", "4 - 6 Quintals/Acre", "₹10000 / Quintal", "October - November", "అక్టోబర్ - నవంబర్", "February - March", "ఫిబ్రవరి - మార్చి", null]
  ];

  return dt.map(mkCrop);
})();