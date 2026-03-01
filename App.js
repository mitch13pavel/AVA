import React, { useState, useEffect } from 'react';
import { Dna, Microscope, Beaker, Target, ArrowRight, RotateCcw, Trophy, Zap, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function App() {
  const [tokens, setTokens] = useState(120);
  const [currentVirus, setCurrentVirus] = useState(null);
  const [gamePhase, setGamePhase] = useState('creation');
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [testingPhase, setTestingPhase] = useState('none'); // none, quicktest, adventure

  // Expanded virus database with increased costs and more options
  const virusDatabase = {
    nucleicAcid: {
      dsDNA: {
        name: "Double-stranded DNA",
        cost: 8,
        stability: 90,
        mutationRate: 1,
        description: "Highly stable, precise replication, large genome capacity",
        color: "#3B82F6",
        examples: ["Adenovirus", "Poxvirus", "Herpesvirus"]
      },
      ssDNA: {
        name: "Single-stranded DNA", 
        cost: 6,
        stability: 60,
        mutationRate: 15,
        description: "Compact genome, moderate stability, simple replication",
        color: "#06B6D4",
        examples: ["Parvovirus B19", "Circoviruses"]
      },
      dsRNA: {
        name: "Double-stranded RNA",
        cost: 10,
        stability: 70,
        mutationRate: 8,
        description: "Segmented genomes possible, protein kinase R activation",
        color: "#8B5CF6",
        examples: ["Rotavirus", "Bluetongue virus", "Reovirus"]
      },
      ssRNApos: {
        name: "Single-stranded RNA (+)",
        cost: 5,
        stability: 40,
        mutationRate: 25,
        description: "Direct translation, high mutation rate, rapid evolution",
        color: "#10B981",
        examples: ["SARS-CoV-2", "Poliovirus", "Hepatitis A", "Rhinovirus"]
      },
      ssRNAneg: {
        name: "Single-stranded RNA (-)",
        cost: 7,
        stability: 45,
        mutationRate: 20,
        description: "Requires RNA polymerase, ribonucleoprotein complexes",
        color: "#F59E0B",
        examples: ["Influenza", "Ebola", "Measles", "RSV"]
      },
      retrovirus: {
        name: "Retrovirus (RNA→DNA)",
        cost: 12,
        stability: 35,
        mutationRate: 30,
        description: "Reverse transcription, genome integration, latency",
        color: "#EF4444",
        examples: ["HIV", "HTLV", "MMTV"]
      },
      segmented: {
        name: "Segmented RNA",
        cost: 15,
        stability: 50,
        mutationRate: 35,
        description: "Reassortment potential, pandemic risk, antigenic shift",
        color: "#EC4899",
        examples: ["Influenza A", "Hantavirus", "Bunyavirus"]
      },
      ambisense: {
        name: "Ambisense RNA",
        cost: 18,
        stability: 55,
        mutationRate: 18,
        description: "Dual polarity coding, complex gene expression",
        color: "#F97316",
        examples: ["Arenaviruses", "Phleboviruses"]
      }
    },
    capsid: {
      icosahedral: {
        name: "Icosahedral",
        cost: 6,
        stability: 85,
        efficiency: 75,
        description: "20-sided symmetry, optimal genetic economy",
        shape: "icosahedral",
        examples: ["Adenovirus", "Poliovirus", "Rhinovirus"]
      },
      helical: {
        name: "Helical",
        cost: 5,
        stability: 65,
        efficiency: 90,
        description: "Rod-shaped, flexible length accommodation",
        shape: "helical",
        examples: ["TMV", "Ebola", "Influenza nucleocapsid"]
      },
      complex: {
        name: "Complex",
        cost: 12,
        stability: 95,
        efficiency: 65,
        description: "Specialized structures, multiple components",
        shape: "complex",
        examples: ["Poxvirus", "Bacteriophage", "Herpesvirus"]
      },
      pleomorphic: {
        name: "Pleomorphic",
        cost: 9,
        stability: 45,
        efficiency: 95,
        description: "Variable shape, membrane-dependent structure",
        shape: "pleomorphic",
        examples: ["Influenza", "HIV", "Paramyxoviruses"]
      },
      prolate: {
        name: "Prolate (Elongated)",
        cost: 8,
        stability: 80,
        efficiency: 70,
        description: "Elongated icosahedral, efficient DNA packaging",
        shape: "prolate",
        examples: ["Bacteriophages", "Some DNA viruses"]
      },
      filamentous: {
        name: "Filamentous",
        cost: 7,
        stability: 60,
        efficiency: 85,
        description: "Long flexible filaments, high aspect ratio",
        shape: "filamentous",
        examples: ["Filoviruses", "Some plant viruses"]
      }
    },
    envelope: {
      enveloped: {
        name: "Enveloped",
        cost: 5,
        environmentalStability: 25,
        transmissibility: 75,
        description: "Lipid membrane from host cell, glycoproteins",
        hasEnvelope: true
      },
      nonEnveloped: {
        name: "Non-enveloped",
        cost: 10,
        environmentalStability: 90,
        transmissibility: 45,
        description: "Protein capsid only, highly resistant",
        hasEnvelope: false
      },
      pseudoEnveloped: {
        name: "Pseudo-enveloped",
        cost: 15,
        environmentalStability: 65,
        transmissibility: 85,
        description: "Host membrane without viral proteins",
        hasEnvelope: true
      },
      archaeal: {
        name: "Archaeal Envelope",
        cost: 20,
        environmentalStability: 95,
        transmissibility: 30,
        description: "Extremophile-adapted lipids, unique structure",
        hasEnvelope: true
      }
    },
    receptors: {
      ace2: { name: "ACE2", cost: 6, tropism: "Respiratory/CV", efficiency: 80, host: "Human", color: "#F97316" },
      cd4: { name: "CD4", cost: 12, tropism: "T-helper cells", efficiency: 90, host: "Human", color: "#DC2626" },
      sialic: { name: "Sialic acid", cost: 5, tropism: "Respiratory", efficiency: 70, host: "Multiple", color: "#2563EB" },
      integrin: { name: "Integrin", cost: 8, tropism: "Multiple tissues", efficiency: 65, host: "Multiple", color: "#059669" },
      glycan: { name: "Glycan receptors", cost: 9, tropism: "Intestinal", efficiency: 75, host: "Multiple", color: "#7C3AED" },
      cd46: { name: "CD46", cost: 14, tropism: "Multiple cells", efficiency: 85, host: "Human", color: "#DB2777" },
      car: { name: "CAR", cost: 18, tropism: "Multiple", efficiency: 95, host: "Human", color: "#0891B2" },
      poliovirus: { name: "PVR", cost: 22, tropism: "Neurons", efficiency: 98, host: "Primate", color: "#C2410C" },
      cd155: { name: "CD155", cost: 16, tropism: "Epithelial", efficiency: 88, host: "Human", color: "#7C2D12" },
      cxcr4: { name: "CXCR4", cost: 20, tropism: "T-cells", efficiency: 92, host: "Human", color: "#BE123C" },
      ccr5: { name: "CCR5", cost: 18, tropism: "Macrophages", efficiency: 85, host: "Human", color: "#A21CAF" },
      ldlr: { name: "LDL Receptor", cost: 10, tropism: "Hepatocytes", efficiency: 78, host: "Multiple", color: "#0D9488" }
    },
    hostRange: {
      narrow: { name: "Narrow Host Range", cost: 5, stability: 90, description: "Single species specialization", examples: ["Measles", "Smallpox"] },
      broad: { name: "Broad Host Range", cost: 12, stability: 60, description: "Multiple related species", examples: ["Influenza", "Rabies"] },
      zoonotic: { name: "Zoonotic Potential", cost: 18, stability: 70, description: "Cross-species transmission capability", examples: ["SARS-CoV-2", "MERS"] },
      pantropic: { name: "Pantropic", cost: 25, stability: 55, description: "Extremely broad host and tissue range", examples: ["Vesicular stomatitis virus"] },
      extremophile: { name: "Extremophile", cost: 30, stability: 100, description: "Extreme environment adaptation", examples: ["Hyperthermophile viruses"] }
    },
    transmissionMode: {
      respiratory: { name: "Respiratory Droplets", cost: 6, efficiency: 80, range: "Close contact", examples: ["COVID-19", "Common cold"] },
      airborne: { name: "Airborne", cost: 12, efficiency: 95, range: "Long distance", examples: ["Measles", "Chickenpox"] },
      contact: { name: "Direct Contact", cost: 4, efficiency: 60, range: "Physical touch", examples: ["HSV", "HPV"] },
      fomite: { name: "Fomite Transmission", cost: 8, efficiency: 70, range: "Surface contact", examples: ["Norovirus", "Adenovirus"] },
      vector: { name: "Vector-borne", cost: 15, efficiency: 85, range: "Arthropod vector", examples: ["Yellow Fever", "Zika"] },
      parenteral: { name: "Blood/Body Fluids", cost: 9, efficiency: 90, range: "Fluid exchange", examples: ["HIV", "Hepatitis B"] },
      fecalOral: { name: "Fecal-Oral", cost: 7, efficiency: 75, range: "Contaminated water/food", examples: ["Poliovirus", "Hepatitis A"] },
      vertical: { name: "Vertical Transmission", cost: 20, efficiency: 95, range: "Mother to child", examples: ["CMV", "Zika"] },
      sexual: { name: "Sexual Transmission", cost: 11, efficiency: 88, range: "Sexual contact", examples: ["HSV", "HPV"] }
    },
    mutations: {
      // Basic structural mutations
      capsidStability: {
        name: "Enhanced Capsid Stability",
        cost: 12,
        effect: "Environmental stability +25",
        scientificBasis: "Improved protein folding and disulfide bonds",
        visualEffect: "stability"
      },
      polymeraseAccuracy: {
        name: "Polymerase Proofreading",
        cost: 18,
        effect: "Mutation rate control, genetic stability",
        scientificBasis: "3' to 5' exonuclease activity like coronaviruses",
        visualEffect: "accuracy"
      },
      receptorBinding: {
        name: "Optimized Receptor Binding",
        cost: 15,
        effect: "Cell entry efficiency +35%",
        scientificBasis: "Improved spike protein conformational changes",
        visualEffect: "spikes"
      },
      
      // Immune evasion
      antigenicDrift: {
        name: "Antigenic Drift",
        cost: 22,
        effect: "Gradual immune evasion +45%",
        scientificBasis: "Point mutations in antigenic sites",
        visualEffect: "drift"
      },
      antigenicShift: {
        name: "Antigenic Shift",
        cost: 35,
        effect: "Complete immune reset capability",
        scientificBasis: "Reassortment of gene segments",
        visualEffect: "shift"
      },
      epitopeMasking: {
        name: "Epitope Masking",
        cost: 28,
        effect: "Neutralizing antibody resistance +60%",
        scientificBasis: "Glycan shielding of antigenic sites",
        visualEffect: "masking"
      },
      
      // Host adaptation
      hostJumping: {
        name: "Host Range Expansion", 
        cost: 25,
        effect: "Cross-species transmission +65%",
        scientificBasis: "Receptor binding domain adaptations",
        visualEffect: "adaptation"
      },
      tisseTropism: {
        name: "Expanded Tissue Tropism",
        cost: 20,
        effect: "Multiple organ system infection",
        scientificBasis: "Alternative receptor usage",
        visualEffect: "tropism"
      },
      
      // Advanced mechanisms
      latencyMechanism: {
        name: "Latency Establishment",
        cost: 40,
        effect: "Immune detection -85%, dormancy capability",
        scientificBasis: "Chromatin silencing and viral latency programs",
        visualEffect: "latency"
      },
      immunosuppression: {
        name: "Immune Suppression",
        cost: 32,
        effect: "Host immune response -75%",
        scientificBasis: "Interference with antigen presentation",
        visualEffect: "suppression"
      },
      oncoGenesis: {
        name: "Oncogenic Transformation",
        cost: 45,
        effect: "Cell transformation and immortalization",
        scientificBasis: "Integration and oncogene activation",
        visualEffect: "transformation"
      },
      
      // Replication strategies
      superinfection: {
        name: "Superinfection Exclusion",
        cost: 16,
        effect: "Prevents competing infections +30%",
        scientificBasis: "Receptor downregulation mechanisms",
        visualEffect: "exclusion"
      },
      persistentInfection: {
        name: "Persistent Infection",
        cost: 30,
        effect: "Chronic infection establishment",
        scientificBasis: "Balance between replication and immune evasion",
        visualEffect: "persistence"
      },
      
      // Transmission enhancements
      asymptomaticShedding: {
        name: "Asymptomatic Shedding",
        cost: 24,
        effect: "Silent transmission +50%",
        scientificBasis: "Reduced inflammatory response",
        visualEffect: "stealth"
      },
      environmentalSurvival: {
        name: "Enhanced Environmental Survival",
        cost: 18,
        effect: "Surface stability +40%",
        scientificBasis: "Protective protein modifications",
        visualEffect: "survival"
      }
    }
  };

  // Enhanced scenarios with more detailed environmental factors
  const scenarios = {
    hospital: {
      name: "Intensive Care Unit",
      difficulty: "Extreme",
      factors: { 
        disinfection: 98, 
        temperature: 22, 
        humidity: 45, 
        uvExposure: 8, 
        airflow: 95,
        ppeCompliance: 95,
        surfaceDisinfection: 99,
        handHygiene: 98
      },
      description: "Maximum biosafety protocols, frequent disinfection, HEPA filtration",
      color: "#DC2626",
      challenges: ["70% alcohol disinfection every 15 minutes", "N95 masks and full PPE", "Positive pressure ventilation"]
    },
    daycare: {
      name: "Daycare Center", 
      difficulty: "Easy",
      factors: { 
        disinfection: 35, 
        temperature: 24, 
        humidity: 55, 
        uvExposure: 25, 
        airflow: 25,
        ppeCompliance: 20,
        surfaceDisinfection: 40,
        handHygiene: 30
      },
      description: "High contact rate, moderate hygiene, children with developing immunity",
      color: "#16A34A",
      challenges: ["Limited hand hygiene compliance", "Shared toys and surfaces", "Close contact activities"]
    },
    airplane: {
      name: "Commercial Aircraft",
      difficulty: "Hard",
      factors: { 
        disinfection: 70, 
        temperature: 21, 
        humidity: 15, 
        uvExposure: 0, 
        airflow: 98,
        ppeCompliance: 60,
        surfaceDisinfection: 80,
        handHygiene: 75
      },
      description: "Recirculated air with HEPA filtration, close quarters, dry environment",
      color: "#EA580C",
      challenges: ["HEPA filtration removes >99.97% particles", "Low humidity dehydrates virions", "Limited space for distancing"]
    },
    school: {
      name: "Elementary School",
      difficulty: "Medium", 
      factors: { 
        disinfection: 55, 
        temperature: 23, 
        humidity: 45, 
        uvExposure: 35, 
        airflow: 45,
        ppeCompliance: 70,
        surfaceDisinfection: 60,
        handHygiene: 65
      },
      description: "Classroom setting, moderate ventilation, mixed-age population",
      color: "#CA8A04",
      challenges: ["Shared classroom materials", "Varying hygiene compliance by age", "Seasonal ventilation changes"]
    },
    cruise: {
      name: "Cruise Ship",
      difficulty: "Easy",
      factors: { 
        disinfection: 45, 
        temperature: 25, 
        humidity: 70, 
        uvExposure: 65, 
        airflow: 35,
        ppeCompliance: 30,
        surfaceDisinfection: 50,
        handHygiene: 40
      },
      description: "Confined population, high humidity, social activities, UV exposure",
      color: "#0891B2",
      challenges: ["High humidity favors some viruses", "Buffet-style dining", "Extended close contact periods"]
    },
    laboratory: {
      name: "BSL-4 Laboratory",
      difficulty: "Extreme",
      factors: { 
        disinfection: 99, 
        temperature: 20, 
        humidity: 30, 
        uvExposure: 99, 
        airflow: 99,
        ppeCompliance: 100,
        surfaceDisinfection: 100,
        handHygiene: 100
      },
      description: "Maximum containment, negative pressure, positive pressure suits",
      color: "#7C2D12",
      challenges: ["UV sterilization", "Autoclave sterilization", "Chemical decontamination showers"]
    },
    arctic: {
      name: "Arctic Research Station",
      difficulty: "Hard",
      factors: { 
        disinfection: 75, 
        temperature: -15, 
        humidity: 20, 
        uvExposure: 45, 
        airflow: 70,
        ppeCompliance: 85,
        surfaceDisinfection: 80,
        handHygiene: 90
      },
      description: "Extreme cold stress, dry air, isolated population, UV reflection",
      color: "#0369A1",
      challenges: ["Extreme cold damages viral membranes", "UV reflection from snow/ice", "Very low humidity"]
    },
    tropical: {
      name: "Rainforest Expedition",
      difficulty: "Medium",
      factors: { 
        disinfection: 15, 
        temperature: 35, 
        humidity: 95, 
        uvExposure: 25, 
        airflow: 20,
        ppeCompliance: 40,
        surfaceDisinfection: 20,
        handHygiene: 25
      },
      description: "High humidity and heat, minimal hygiene facilities, vector insects",
      color: "#15803D",
      challenges: ["Heat stress on proteins", "High humidity aids some viruses", "Limited sanitation"]
    },
    subway: {
      name: "Rush Hour Subway",
      difficulty: "Easy",
      factors: { 
        disinfection: 30, 
        temperature: 26, 
        humidity: 60, 
        uvExposure: 5, 
        airflow: 35,
        ppeCompliance: 50,
        surfaceDisinfection: 35,
        handHygiene: 45
      },
      description: "High density, poor ventilation, brief but intense contact",
      color: "#6B7280",
      challenges: ["High population density", "Frequent surface contact", "Poor air circulation"]
    },
    spa: {
      name: "Hot Springs Spa",
      difficulty: "Hard",
      factors: { 
        disinfection: 40, 
        temperature: 42, 
        humidity: 90, 
        uvExposure: 20, 
        airflow: 25,
        ppeCompliance: 10,
        surfaceDisinfection: 45,
        handHygiene: 55
      },
      description: "High temperature, humidity, and mineral content, shared facilities",
      color: "#DC2626",
      challenges: ["High temperature denatures proteins", "Chlorine and mineral disinfection", "Steam environment"]
    }
  };

  // Real virus database for classification matching
  const realVirusDatabase = {
    "SARS-CoV-2": {
      nucleicAcid: "ssRNApos", capsid: "helical", envelope: "enveloped", 
      receptor: "ace2", hostRange: "zoonotic", transmission: "respiratory",
      characteristics: ["polymeraseAccuracy", "receptorBinding"],
      description: "Pandemic coronavirus causing COVID-19"
    },
    "Influenza A H1N1": {
      nucleicAcid: "segmented", capsid: "helical", envelope: "enveloped",
      receptor: "sialic", hostRange: "zoonotic", transmission: "airborne", 
      characteristics: ["antigenicDrift", "antigenicShift", "hostJumping"],
      description: "Pandemic flu strain with reassortment capability"
    },
    "HIV-1": {
      nucleicAcid: "retrovirus", capsid: "icosahedral", envelope: "enveloped",
      receptor: "cd4", hostRange: "narrow", transmission: "parenteral",
      characteristics: ["antigenicDrift", "latencyMechanism", "immunosuppression"],
      description: "Human immunodeficiency virus causing AIDS"
    },
    "Measles Virus": {
      nucleicAcid: "ssRNAneg", capsid: "helical", envelope: "enveloped",
      receptor: "cd46", hostRange: "narrow", transmission: "airborne",
      characteristics: ["immunosuppression", "receptorBinding"],
      description: "Highly contagious respiratory virus"
    },
    "Adenovirus Type 5": {
      nucleicAcid: "dsDNA", capsid: "icosahedral", envelope: "nonEnveloped",
      receptor: "car", hostRange: "narrow", transmission: "respiratory",
      characteristics: ["capsidStability", "receptorBinding"],
      description: "Common cold and respiratory infections"
    },
    "Poliovirus": {
      nucleicAcid: "ssRNApos", capsid: "icosahedral", envelope: "nonEnveloped",
      receptor: "poliovirus", hostRange: "narrow", transmission: "fecalOral",
      characteristics: ["capsidStability", "receptorBinding"],
      description: "Neurotropic virus causing paralytic polio"
    },
    "Norovirus": {
      nucleicAcid: "ssRNApos", capsid: "icosahedral", envelope: "nonEnveloped",
      receptor: "glycan", hostRange: "broad", transmission: "fomite",
      characteristics: ["capsidStability", "antigenicDrift"],
      description: "Leading cause of viral gastroenteritis"
    },
    "Ebola Virus": {
      nucleicAcid: "ssRNAneg", capsid: "filamentous", envelope: "enveloped",
      receptor: "integrin", hostRange: "zoonotic", transmission: "contact",
      characteristics: ["immunosuppression", "hostJumping"],
      description: "Filovirus causing hemorrhagic fever"
    },
    "Hepatitis B": {
      nucleicAcid: "dsDNA", capsid: "icosahedral", envelope: "enveloped",
      receptor: "ldlr", hostRange: "narrow", transmission: "parenteral",
      characteristics: ["persistentInfection", "oncoGenesis"],
      description: "Chronic hepatitis virus with cancer risk"
    },
    "Herpes Simplex Virus": {
      nucleicAcid: "dsDNA", capsid: "icosahedral", envelope: "enveloped",
      receptor: "integrin", hostRange: "narrow", transmission: "contact",
      characteristics: ["latencyMechanism", "epitopeMasking"],
      description: "Neurotropic herpesvirus establishing lifelong latency"
    }
  };

  const initializeVirus = () => {
    setCurrentVirus({
      nucleicAcid: null, capsid: null, envelope: null, receptor: null, 
      hostRange: null, transmissionMode: null, mutations: [],
      stats: { stability: 0, transmissibility: 0, immuneResistance: 0, replicationRate: 0, hostAdaptation: 0 },
      classification: "", matchedVirus: null, similarity: 0
    });
    setGamePhase('creation');
    setSelectedScenarios([]);
    setTestResults([]);
    setAchievements([]);
    setTestingPhase('none');
    setTokens(120);
  };

  // Enhanced virus visualization component
  const VirusVisualization = ({ virus }) => {
    if (!virus || !virus.nucleicAcid) {
      return (
        <div className="w-full h-96 bg-gray-800/30 rounded-xl border border-gray-600/30 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Dna className="w-20 h-20 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Begin Virus Construction</p>
            <p className="text-sm mt-2">Watch your creation come to life</p>
          </div>
        </div>
      );
    }

    const nucleicData = virusDatabase.nucleicAcid[virus.nucleicAcid];
    const capsidData = virus.capsid ? virusDatabase.capsid[virus.capsid] : null;
    const envelopeData = virus.envelope ? virusDatabase.envelope[virus.envelope] : null;
    const receptorData = virus.receptor ? virusDatabase.receptors[virus.receptor] : null;

    const renderCapsid = () => {
      if (!capsidData) return null;
      
      switch (capsidData.shape) {
        case 'icosahedral':
          return (
            <g>
              <polygon
                points="200,70 260,110 200,150 140,110"
                fill={nucleicData.color}
                stroke="#ffffff"
                strokeWidth="3"
                opacity="0.85"
              />
              <polygon
                points="200,70 260,110 240,85"
                fill={nucleicData.color}
                stroke="#ffffff"
                strokeWidth="2"
                opacity="0.95"
              />
              <polygon
                points="200,70 140,110 160,85"
                fill={nucleicData.color}
                stroke="#ffffff"
                strokeWidth="2"
                opacity="0.95"
              />
            </g>
          );
        case 'helical':
          return (
            <g>
              <ellipse cx="200" cy="110" rx="70" ry="30" fill={nucleicData.color} opacity="0.8" stroke="#ffffff" strokeWidth="3"/>
              <rect x="130" y="80" width="140" height="60" fill={nucleicData.color} opacity="0.8" stroke="#ffffff" strokeWidth="3"/>
              <ellipse cx="200" cy="110" rx="70" ry="30" fill="none" stroke="#ffffff" strokeWidth="4"/>
            </g>
          );
        case 'complex':
          return (
            <g>
              <rect x="160" y="70" width="80" height="80" fill={nucleicData.color} opacity="0.85" stroke="#ffffff" strokeWidth="3"/>
              <polygon points="160,70 200,50 240,70" fill={nucleicData.color} opacity="0.95" stroke="#ffffff" strokeWidth="3"/>
              <polygon points="160,150 200,170 240,150" fill={nucleicData.color} opacity="0.75" stroke="#ffffff" strokeWidth="3"/>
              <circle cx="200" cy="110" r="15" fill="#ffffff" opacity="0.9"/>
            </g>
          );
        case 'pleomorphic':
          return (
            <g>
              <path
                d="M 130,110 Q 160,70 210,90 Q 270,120 230,160 Q 180,150 130,110 Z"
                fill={nucleicData.color}
                opacity="0.85"
                stroke="#ffffff"
                strokeWidth="3"
              />
            </g>
          );
        case 'filamentous':
          return (
            <g>
              <path
                d="M 100,110 Q 150,80 200,110 Q 250,140 300,110"
                fill="none"
                stroke={nucleicData.color}
                strokeWidth="25"
                opacity="0.85"
              />
              <path
                d="M 100,110 Q 150,80 200,110 Q 250,140 300,110"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
              />
            </g>
          );
        case 'prolate':
          return (
            <g>
              <ellipse cx="200" cy="110" rx="50" ry="70" fill={nucleicData.color} opacity="0.85" stroke="#ffffff" strokeWidth="3"/>
              <polygon points="200,40 220,60 200,80 180,60" fill={nucleicData.color} opacity="0.95" stroke="#ffffff" strokeWidth="2"/>
              <polygon points="200,140 220,160 200,180 180,160" fill={nucleicData.color} opacity="0.95" stroke="#ffffff" strokeWidth="2"/>
            </g>
          );
        default:
          return (
            <circle cx="200" cy="110" r="50" fill={nucleicData.color} opacity="0.85" stroke="#ffffff" strokeWidth="3"/>
          );
      }
    };

    const renderEnvelope = () => {
      if (!envelopeData || !envelopeData.hasEnvelope) return null;
      
      const envelopeRadius = capsidData?.shape === 'helical' ? 90 : 
                           capsidData?.shape === 'filamentous' ? 0 : 75;
      
      if (envelopeRadius === 0) {
        return (
          <path
            d="M 80,110 Q 130,60 200,110 Q 270,160 320,110"
            fill="none"
            stroke="#34D399"
            strokeWidth="6"
            strokeDasharray="8,4"
            opacity="0.8"
          />
        );
      }
      
      return (
        <circle 
          cx="200" 
          cy="110" 
          r={envelopeRadius} 
          fill="none" 
          stroke="#34D399" 
          strokeWidth="5" 
          strokeDasharray="8,4"
          opacity="0.8"
        />
      );
    };

    const renderSurfaceProteins = () => {
      if (!receptorData) return null;
      
      const proteins = [];
      const radius = envelopeData?.hasEnvelope ? (capsidData?.shape === 'helical' ? 95 : 80) : 55;
      
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * (Math.PI / 180);
        const x = 200 + radius * Math.cos(angle);
        const y = 110 + radius * Math.sin(angle);
        
        proteins.push(
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill={receptorData.color} />
            <line x1={x} y1={y} x2={x + 12 * Math.cos(angle)} y2={y + 12 * Math.sin(angle)} stroke={receptorData.color} strokeWidth="3"/>
          </g>
        );
      }
      
      return proteins;
    };

    const renderMutationEffects = () => {
      if (!virus.mutations || virus.mutations.length === 0) return null;
      
      return virus.mutations.map((mutation, index) => {
        const mutData = virusDatabase.mutations[mutation];
        if (!mutData) return null;
        
        switch (mutData.visualEffect) {
          case 'spikes':
            return (
              <g key={mutation}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
                  const rad = angle * (Math.PI / 180);
                  const x1 = 200 + 60 * Math.cos(rad);
                  const y1 = 110 + 60 * Math.sin(rad);
                  const x2 = 200 + 85 * Math.cos(rad);
                  const y2 = 110 + 85 * Math.sin(rad);
                  
                  return (
                    <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F59E0B" strokeWidth="4"/>
                  );
                })}
              </g>
            );
          case 'stability':
            return (
              <circle key={mutation} cx="200" cy="110" r="105" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="5,5" opacity="0.7"/>
            );
          case 'drift':
            return (
              <g key={mutation}>
                <circle cx="200" cy="110" r="115" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,3" opacity="0.6">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 200 110;360 200 110"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          case 'latency':
            return (
              <g key={mutation}>
                <circle cx="200" cy="110" r="25" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.5">
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite"/>
                </circle>
              </g>
            );
          default:
            return (
              <circle key={mutation} cx="200" cy="110" r={95 + index * 8} fill="none" stroke="#F97316" strokeWidth="2" opacity="0.4"/>
            );
        }
      });
    };

    const renderNucleicAcidCore = () => {
      return (
        <circle cx="200" cy="110" r="18" fill={nucleicData.color} opacity="1" stroke="#ffffff" strokeWidth="2">
          <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite"/>
        </circle>
      );
    };

    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-cyan-400/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <svg width="100%" height="100%" viewBox="0 0 400 220">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Virus components */}
            {renderCapsid()}
            {renderEnvelope()}
            {renderSurfaceProteins()}
            {renderMutationEffects()}
            {renderNucleicAcidCore()}
            
            {/* Scale bar */}
            <g transform="translate(20, 190)">
              <line x1="0" y1="0" x2="60" y2="0" stroke="#9CA3AF" strokeWidth="3"/>
              <text x="30" y="18" textAnchor="middle" fill="#9CA3AF" fontSize="14" fontWeight="bold">100 nm</text>
            </g>
            
            {/* Labels */}
            {virus.nucleicAcid && (
              <text x="200" y="25" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">
                {nucleicData.name}
              </text>
            )}
          </svg>
        </div>
        
        {/* Enhanced info overlay */}
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-sm max-w-48">
          <div className="text-cyan-400 font-bold mb-2 text-center">LIVE PREVIEW</div>
          {virus.nucleicAcid && (
            <div className="text-white mb-1 text-xs">
              <span className="text-gray-400">Core:</span> <span style={{color: nucleicData.color}}>{nucleicData.name}</span>
            </div>
          )}
          {virus.capsid && (
            <div className="text-white mb-1 text-xs">
              <span className="text-gray-400">Shape:</span> {capsidData.name}
            </div>
          )}
          {virus.envelope && (
            <div className="text-white mb-1 text-xs">
              <span className="text-gray-400">Envelope:</span> {envelopeData.hasEnvelope ? 'Present' : 'Absent'}
            </div>
          )}
          {virus.receptor && (
            <div className="text-white mb-1 text-xs">
              <span className="text-gray-400">Receptor:</span> {receptorData.name}
            </div>
          )}
          {virus.mutations?.length > 0 && (
            <div className="text-orange-300 text-xs">
              <span className="text-gray-400">Mutations:</span> {virus.mutations.length} active
            </div>
          )}
        </div>
      </div>
    );
  };

  const calculateVirusStats = (virus) => {
    if (!virus.nucleicAcid || !virus.envelope || !virus.receptor) return virus.stats;

    const nucleicData = virusDatabase.nucleicAcid[virus.nucleicAcid];
    const envelopeData = virusDatabase.envelope[virus.envelope];
    const receptorData = virusDatabase.receptors[virus.receptor];
    const capsidData = virus.capsid ? virusDatabase.capsid[virus.capsid] : { stability: 50, efficiency: 50 };
    const hostData = virus.hostRange ? virusDatabase.hostRange[virus.hostRange] : { stability: 50 };
    const transmissionData = virus.transmissionMode ? virusDatabase.transmissionMode[virus.transmissionMode] : { efficiency: 50 };

    let stats = {
      stability: Math.round((nucleicData.stability + envelopeData.environmentalStability + capsidData.stability) / 3),
      transmissibility: Math.round((envelopeData.transmissibility + receptorData.efficiency + transmissionData.efficiency) / 3),
      immuneResistance: Math.round(100 - nucleicData.mutationRate),
      replicationRate: Math.round(100 - nucleicData.mutationRate + (nucleicData.mutationRate * 0.5)),
      hostAdaptation: Math.round((hostData.stability + receptorData.efficiency) / 2)
    };

    // Apply mutation effects with more nuanced calculations
    virus.mutations.forEach(mutation => {
      const mutData = virusDatabase.mutations[mutation];
      if (mutation === 'capsidStability') stats.stability += 25;
      if (mutation === 'polymeraseAccuracy') { stats.immuneResistance += 15; stats.stability += 10; }
      if (mutation === 'receptorBinding') { stats.transmissibility += 35; stats.hostAdaptation += 20; }
      if (mutation === 'antigenicDrift') stats.immuneResistance += 45;
      if (mutation === 'antigenicShift') stats.immuneResistance += 65;
      if (mutation === 'epitopeMasking') stats.immuneResistance += 60;
      if (mutation === 'hostJumping') { stats.hostAdaptation += 65; stats.transmissibility += 20; }
      if (mutation === 'tisseTropism') { stats.hostAdaptation += 30; stats.replicationRate += 15; }
      if (mutation === 'latencyMechanism') { stats.immuneResistance += 85; stats.stability += 30; }
      if (mutation === 'immunosuppression') { stats.immuneResistance += 75; stats.replicationRate += 25; }
      if (mutation === 'oncoGenesis') { stats.replicationRate += 40; stats.hostAdaptation += 30; stats.stability += 20; }
      if (mutation === 'asymptomaticShedding') { stats.transmissibility += 50; stats.immuneResistance += 20; }
      if (mutation === 'environmentalSurvival') stats.stability += 40;
      if (mutation === 'persistentInfection') { stats.immuneResistance += 45; stats.stability += 25; }
    });

    Object.keys(stats).forEach(key => {
      stats[key] = Math.min(100, Math.max(0, stats[key]));
    });

    return stats;
  };

  const findClosestVirus = (virus) => {
    let bestMatch = null;
    let highestSimilarity = 0;

    Object.entries(realVirusDatabase).forEach(([virusName, realVirus]) => {
      let similarity = 0;
      let factors = 0;

      // Enhanced similarity calculation with weighted factors
      if (virus.nucleicAcid === realVirus.nucleicAcid) { similarity += 25; }
      if (virus.capsid === realVirus.capsid) { similarity += 20; }
      if (virus.envelope === realVirus.envelope) { similarity += 20; }
      if (virus.receptor === realVirus.receptor) { similarity += 15; }
      if (virus.hostRange === realVirus.hostRange) { similarity += 10; }
      if (virus.transmissionMode === realVirus.transmission) { similarity += 10; }
      factors += 100;

      const finalSimilarity = Math.round(similarity);

      if (finalSimilarity > highestSimilarity) {
        highestSimilarity = finalSimilarity;
        bestMatch = { name: virusName, data: realVirus, similarity: finalSimilarity };
      }
    });

    return bestMatch;
  };

  const classifyVirus = (virus) => {
    if (!virus.nucleicAcid || !virus.envelope) return "";
    
    const nucleicData = virusDatabase.nucleicAcid[virus.nucleicAcid];
    const envelopeData = virusDatabase.envelope[virus.envelope];
    const capsidData = virus.capsid ? virusDatabase.capsid[virus.capsid] : null;
    
    let classification = `${nucleicData.name} `;
    if (capsidData) classification += `${capsidData.name} `;
    classification += `${envelopeData.name} Virus`;
    
    return classification;
  };

  // Enhanced survival calculation with detailed explanations
  const calculateSurvivability = (virus, scenario) => {
    const stats = calculateVirusStats(virus);
    const factors = scenarios[scenario].factors;
    
    let survivability = stats.stability;
    let explanations = [];
    
    // Base environmental stability
    explanations.push(`Base stability: ${stats.stability}%`);
    
    // Disinfection effects
    if (virus.envelope === 'enveloped' || virus.envelope === 'pseudoEnveloped') {
      const disinfectionPenalty = factors.disinfection * 0.9;
      survivability -= disinfectionPenalty;
      explanations.push(`Envelope vulnerability to disinfection: -${Math.round(disinfectionPenalty)}%`);
    } else {
      const disinfectionPenalty = factors.disinfection * 0.4;
      survivability -= disinfectionPenalty;
      explanations.push(`Capsid resistance to disinfection: -${Math.round(disinfectionPenalty)}%`);
    }

    // Temperature effects
    const optimalTemp = virus.envelope === 'enveloped' ? 25 : 20;
    const tempStress = Math.abs(factors.temperature - optimalTemp);
    let tempPenalty;
    
    if (virus.envelope === 'enveloped') {
      tempPenalty = tempStress * 2;
      if (factors.temperature < 0) tempPenalty *= 1.5; // Cold especially damages enveloped viruses
    } else {
      tempPenalty = tempStress * 1.2;
    }
    
    survivability -= tempPenalty;
    explanations.push(`Temperature stress (${factors.temperature}°C): -${Math.round(tempPenalty)}%`);

    // UV exposure effects
    let uvPenalty = factors.uvExposure * 0.7;
    if (virus.mutations?.includes('environmentalSurvival')) {
      uvPenalty *= 0.6; // Reduced UV sensitivity
      explanations.push(`UV resistance mutation reduces damage`);
    }
    survivability -= uvPenalty;
    explanations.push(`UV radiation damage: -${Math.round(uvPenalty)}%`);

    // Humidity effects
    let humidityEffect = 0;
    if (virus.envelope === 'enveloped' || virus.envelope === 'pseudoEnveloped') {
      if (factors.humidity > 50) {
        humidityEffect = 8; // Enveloped viruses prefer moderate humidity
        explanations.push(`Favorable humidity for enveloped virus: +${humidityEffect}%`);
      } else if (factors.humidity < 30) {
        humidityEffect = -12;
        explanations.push(`Low humidity damages envelope: ${humidityEffect}%`);
      }
    } else {
      if (factors.humidity < 40) {
        humidityEffect = 5; // Non-enveloped prefer dryness
        explanations.push(`Dry conditions favor non-enveloped virus: +${humidityEffect}%`);
      }
    }
    survivability += humidityEffect;

    // Airflow effects based on transmission mode
    if (virus.transmissionMode === 'airborne') {
      if (factors.airflow > 80) {
        survivability -= 25;
        explanations.push(`High airflow disperses airborne virus: -25%`);
      } else {
        survivability += 10;
        explanations.push(`Moderate airflow aids airborne transmission: +10%`);
      }
    }
    
    if (virus.transmissionMode === 'fomite') {
      const surfaceContamination = 100 - factors.surfaceDisinfection;
      const fomiteBonus = surfaceContamination * 0.3;
      survivability += fomiteBonus;
      explanations.push(`Surface contamination opportunities: +${Math.round(fomiteBonus)}%`);
    }

    // Mutation bonuses
    if (virus.mutations?.includes('capsidStability')) {
      explanations.push(`Enhanced capsid stability mutation: already included in base stats`);
    }
    
    if (virus.mutations?.includes('asymptomaticShedding') && factors.ppeCompliance > 70) {
      survivability += 15;
      explanations.push(`Asymptomatic shedding bypasses PPE: +15%`);
    }

    const finalSurvivability = Math.max(0, Math.min(100, Math.round(survivability)));
    
    return {
      survivability: finalSurvivability,
      explanations: explanations
    };
  };

  const selectCharacteristic = (type, value, cost = 0) => {
    if (tokens >= cost) {
      setTokens(tokens - cost);
      
      if (type === 'mutation') {
        setCurrentVirus(prev => {
          const updated = { ...prev, mutations: [...prev.mutations, value] };
          const newStats = calculateVirusStats(updated);
          const classification = classifyVirus(updated);
          const match = findClosestVirus(updated);
          
          return {
            ...updated,
            stats: newStats,
            classification,
            matchedVirus: match
          };
        });
      } else {
        setCurrentVirus(prev => {
          const updated = { ...prev, [type]: value };
          const newStats = calculateVirusStats(updated);
          const classification = classifyVirus(updated);
          const match = findClosestVirus(updated);
          
          return {
            ...updated,
            stats: newStats,
            classification,
            matchedVirus: match
          };
        });
      }
    }
  };

  // Simple, Working Adventure Mode
  const AdventureMode = () => {
    const [currentMission, setCurrentMission] = useState(0);
    const [missionPhase, setMissionPhase] = useState('briefing'); // briefing, choice, result, ending
    const [totalInfected, setTotalInfected] = useState(0);
    const [campaignEnded, setCampaignEnded] = useState(false);
    const [missionResults, setMissionResults] = useState([]);
    const [choiceResult, setChoiceResult] = useState(null);

    const missions = [
      {
        title: "Patient Zero",
        scenario: "hospital",
        story: "You've infected a nurse at Metro General Hospital. The building is on high alert with full PPE and constant disinfection. This is your crucial first test - can you survive and spread?",
        target: 5,
        choices: [
          { 
            text: "Hide in asymptomatic carriers", 
            risk: "Safe", 
            bonus: 10, 
            description: "Stay quiet and spread slowly through unnoticed transmission"
          },
          { 
            text: "Rapid aggressive spread", 
            risk: "Risky", 
            bonus: -20, 
            description: "Cause obvious symptoms but spread to many people quickly"
          },
          { 
            text: "Target medical equipment", 
            risk: "Medium", 
            bonus: 0, 
            description: "Contaminate stethoscopes, keyboards, and shared tools"
          }
        ]
      },
      {
        title: "Community Spread",
        scenario: "daycare",
        story: "An infected doctor has brought you to Sunny Kids Daycare. 60 children and their families represent massive growth potential, but health officials are starting to take notice.",
        target: 25,
        choices: [
          { 
            text: "Focus on shared toys", 
            risk: "Safe", 
            bonus: 15, 
            description: "Use long-lasting surface contamination strategy"
          },
          { 
            text: "Target snack time", 
            risk: "Medium", 
            bonus: 5, 
            description: "Spread through food sharing and close contact"
          },
          { 
            text: "Parent pickup chaos", 
            risk: "Risky", 
            bonus: -10, 
            description: "Exploit crowded pickup times for maximum exposure"
          }
        ]
      },
      {
        title: "International Gateway",
        scenario: "airplane",
        story: "Infected families are boarding Flight 293 to three different countries. This cramped metal tube could be your ticket to global spread, but HEPA filters and limited time pose serious challenges.",
        target: 50,
        choices: [
          { 
            text: "Contaminate food service", 
            risk: "Medium", 
            bonus: 0, 
            description: "Target meal trays and flight attendant interactions"
          },
          { 
            text: "Surface transmission", 
            risk: "Safe", 
            bonus: 20, 
            description: "Coat armrests, tray tables, and overhead bins"
          },
          { 
            text: "Challenge air filtration", 
            risk: "Extreme", 
            bonus: -30, 
            description: "Attempt airborne transmission despite HEPA filters"
          }
        ]
      },
      {
        title: "Global Conference", 
        scenario: "school",
        story: "The World Health Summit brings together 500 experts from 80 countries. They're discussing outbreak responses while unknowingly hosting one. Can you spread globally before they realize what's happening?",
        target: 100,
        choices: [
          { 
            text: "Networking events", 
            risk: "Safe", 
            bonus: 5, 
            description: "Spread through handshakes and business card exchanges"
          },
          { 
            text: "Packed auditorium sessions", 
            risk: "Medium", 
            bonus: -5, 
            description: "Target large conference presentations"
          },
          { 
            text: "VIP international delegates", 
            risk: "Risky", 
            bonus: -15, 
            description: "High-risk but maximum global impact"
          }
        ]
      },
      {
        title: "Pandemic Response",
        scenario: "laboratory", 
        story: "The WHO has declared a Public Health Emergency. You've infected over 200 people across 15 countries, but the world's best scientists are now hunting you in BSL-4 labs. This is your final challenge.",
        target: 200,
        choices: [
          { 
            text: "Mutate to evade detection", 
            risk: "Safe", 
            bonus: 25, 
            description: "Use genetic variation to stay ahead of researchers"
          },
          { 
            text: "All-out infection blitz", 
            risk: "Extreme", 
            bonus: -40, 
            description: "Spread faster than containment efforts can respond"
          },
          { 
            text: "Establish dormant reservoirs", 
            risk: "Medium", 
            bonus: 10, 
            description: "Create hidden infected populations for long-term survival"
          }
        ]
      }
    ];

    const makeChoice = (choice) => {
      const mission = missions[currentMission];
      const baseResult = calculateSurvivability(currentVirus, mission.scenario);
      const modifiedSurvival = Math.max(0, Math.min(100, baseResult.survivability + choice.bonus));
      
      // Calculate infections based on survival rate and mission target
      let infections = 0;
      if (modifiedSurvival > 30) {
        const successRate = modifiedSurvival / 100;
        infections = Math.round(mission.target * successRate * (Math.random() * 0.3 + 0.85));
      }

      const result = {
        missionTitle: mission.title,
        choice: choice,
        survival: modifiedSurvival,
        infections: infections,
        target: mission.target,
        success: infections >= mission.target * 0.6, // 60% of target to succeed
        explanations: baseResult.explanations
      };

      setChoiceResult(result);
      setTotalInfected(prev => prev + infections);
      setMissionResults(prev => [...prev, result]);
      setMissionPhase('result');
    };

    const continueToNextMission = () => {
      // Check if mission completely failed
      if (choiceResult.survival < 15) {
        endCampaign('extinction');
        return;
      }

      // Check if we completed all missions
      if (currentMission >= missions.length - 1) {
        // Final mission - determine ending based on total performance
        if (totalInfected >= 500) {
          endCampaign('pandemic');
        } else if (totalInfected >= 200) {
          endCampaign('outbreak');
        } else if (totalInfected >= 100) {
          endCampaign('contained');
        } else {
          endCampaign('failure');
        }
        return;
      }

      // Continue to next mission
      setCurrentMission(prev => prev + 1);
      setMissionPhase('briefing');
    };

    const endCampaign = (ending) => {
      const endings = {
        pandemic: {
          title: "🌍 GLOBAL PANDEMIC!",
          message: "Congratulations! You've triggered a worldwide pandemic with over 500 infections across multiple continents. The WHO has activated emergency protocols, but it's too late to contain your spread.",
          color: "text-red-400",
          achievement: "Pandemic Architect",
          score: "S"
        },
        outbreak: {
          title: "🦠 MAJOR OUTBREAK",
          message: "You caused a significant international outbreak affecting 200+ people. While serious, coordinated global efforts have prevented full pandemic status.",
          color: "text-orange-400", 
          achievement: "Outbreak Engineer",
          score: "A"
        },
        contained: {
          title: "⚠️ LIMITED OUTBREAK",
          message: "You managed to spread to 100+ people before being contained. A noteworthy outbreak, but international health systems successfully limited your impact.",
          color: "text-yellow-400",
          achievement: "Emerging Threat",
          score: "B"
        },
        failure: {
          title: "🛡️ OUTBREAK CONTAINED",
          message: "Despite initial spread, your outbreak was quickly contained by health authorities. Better luck with your next viral design!",
          color: "text-blue-400",
          achievement: "Learning Experience", 
          score: "C"
        },
        extinction: {
          title: "💀 VIRAL EXTINCTION", 
          message: "Your virus couldn't survive the environmental pressures and died out before achieving significant spread. Back to the laboratory!",
          color: "text-gray-400",
          achievement: "Failed Experiment",
          score: "F"
        }
      };

      const endResult = endings[ending];
      
      const finalResult = {
        scenario: 'campaign_final',
        survivability: Math.round(missionResults.reduce((sum, r) => sum + r.survival, 0) / Math.max(1, missionResults.length)),
        explanations: [
          endResult.title,
          endResult.message,
          `Total infections: ${totalInfected}`,
          `Missions completed: ${missionResults.length}/5`,
          `Campaign score: ${endResult.score}`
        ],
        difficulty: 'Campaign',
        ending: endResult,
        totalInfected: totalInfected,
        missionsCompleted: missionResults.length
      };

      setTestResults([finalResult]);
      setAchievements(prev => [...prev, endResult.achievement]);
      setGamePhase('results');
      setCampaignEnded(true);
    };

    const startNewMission = () => {
      setMissionPhase('choice');
    };

    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
          🦠 Pandemic Campaign
        </h2>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Mission Progress</span>
            <span className="text-sm text-gray-300">{currentMission + 1} / 5</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentMission + 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-red-500/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-400">{totalInfected}</div>
            <div className="text-sm text-gray-300">Total Infected</div>
          </div>
          <div className="bg-blue-500/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">{missionResults.length}</div>
            <div className="text-sm text-gray-300">Missions Completed</div>
          </div>
          <div className="bg-green-500/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">
              {missionResults.length > 0 ? Math.round(missionResults.reduce((sum, r) => sum + r.survival, 0) / missionResults.length) : 0}%
            </div>
            <div className="text-sm text-gray-300">Avg Survival</div>
          </div>
        </div>

        {/* Mission Briefing */}
        {missionPhase === 'briefing' && (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-cyan-300">{missions[currentMission].title}</h3>
            <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
              <p className="text-lg leading-relaxed mb-4">{missions[currentMission].story}</p>
              <div className="text-purple-400 font-semibold">
                Mission Target: Infect at least {missions[currentMission].target} people
              </div>
            </div>
            <button
              onClick={startNewMission}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Begin Mission
            </button>
          </div>
        )}

        {/* Choice Phase */}
        {missionPhase === 'choice' && (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-cyan-300 text-center">Choose Your Strategy:</h3>
            <div className="space-y-4">
              {missions[currentMission].choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => makeChoice(choice)}
                  className={`w-full p-4 text-left rounded-lg border transition-colors ${
                    choice.risk === 'Safe' ? 'border-green-400/40 bg-green-500/10 hover:bg-green-500/20' :
                    choice.risk === 'Medium' ? 'border-yellow-400/40 bg-yellow-500/10 hover:bg-yellow-500/20' :
                    choice.risk === 'Risky' ? 'border-orange-400/40 bg-orange-500/10 hover:bg-orange-500/20' :
                    'border-red-400/40 bg-red-500/10 hover:bg-red-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-lg">{choice.text}</div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      choice.risk === 'Safe' ? 'bg-green-500/30 text-green-300' :
                      choice.risk === 'Medium' ? 'bg-yellow-500/30 text-yellow-300' :
                      choice.risk === 'Risky' ? 'bg-orange-500/30 text-orange-300' :
                      'bg-red-500/30 text-red-300'
                    }`}>
                      {choice.risk} Risk
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{choice.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Phase */}
        {missionPhase === 'result' && choiceResult && (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Mission Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 text-cyan-300">Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Survival Rate:</span>
                    <span className={`font-bold ${
                      choiceResult.survival > 60 ? 'text-green-400' :
                      choiceResult.survival > 30 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{choiceResult.survival}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Infections:</span>
                    <span className="font-bold text-red-400">{choiceResult.infections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target:</span>
                    <span className="font-bold">{choiceResult.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mission:</span>
                    <span className={`font-bold ${choiceResult.success ? 'text-green-400' : 'text-red-400'}`}>
                      {choiceResult.success ? 'SUCCESS' : 'PARTIAL'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 text-cyan-300">Analysis</h4>
                <div className="space-y-2 text-sm text-left">
                  {choiceResult.explanations.slice(0, 4).map((explanation, i) => (
                    <div key={i} className="text-gray-400">{explanation}</div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={continueToNextMission}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-colors"
            >
              {currentMission >= missions.length - 1 ? 'Complete Campaign' : 'Continue Campaign'}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Simple, Working Quick Test
  const QuickTestMode = () => {
    const [selectedEnvs, setSelectedEnvs] = useState([]);
    const [testComplete, setTestComplete] = useState(false);

    const toggleEnvironment = (envKey) => {
      setSelectedEnvs(prev => 
        prev.includes(envKey) 
          ? prev.filter(e => e !== envKey)
          : [...prev, envKey]
      );
    };

    const runQuickTests = () => {
      if (selectedEnvs.length === 0) return;

      const results = selectedEnvs.map(scenario => {
        const result = calculateSurvivability(currentVirus, scenario);
        return {
          scenario: scenario,
          survivability: result.survivability,
          explanations: result.explanations,
          difficulty: scenarios[scenario].difficulty
        };
      });

      // Calculate achievements
      const avgScore = results.reduce((sum, r) => sum + r.survivability, 0) / results.length;
      let newAchievements = [];
      
      if (avgScore > 80) newAchievements.push("Environmental Master");
      if (results.some(r => r.difficulty === "Extreme" && r.survivability > 50)) newAchievements.push("Biosafety Breach");
      if (results.length >= 5 && avgScore > 70) newAchievements.push("Versatile Pathogen");

      setTestResults(results);
      setAchievements(newAchievements);
      setGamePhase('results');
      setTestComplete(true);
    };

    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ⚡ Quick Environmental Testing
        </h2>

        <p className="text-center text-gray-300 mb-8">
          Select environments to test your virus against. Each environment poses unique survival challenges.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <button
              key={key}
              onClick={() => toggleEnvironment(key)}
              className={`p-4 rounded-lg border transition-all text-left ${
                selectedEnvs.includes(key)
                  ? 'border-cyan-400 bg-cyan-500/20 ring-2 ring-cyan-400/30'
                  : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold">{scenario.name}</div>
                <div 
                  className="text-xs px-2 py-1 rounded font-semibold"
                  style={{backgroundColor: scenario.color + '30', color: scenario.color}}
                >
                  {scenario.difficulty}
                </div>
              </div>
              <div className="text-sm text-gray-300">{scenario.description}</div>
              <div className="text-xs text-gray-400 mt-2">
                {scenario.challenges?.slice(0, 2).join(', ')}
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <div className="mb-4">
            <span className="text-cyan-400 font-semibold">{selectedEnvs.length}</span>
            <span className="text-gray-300"> environments selected</span>
          </div>
          
          {selectedEnvs.length > 0 ? (
            <button
              onClick={runQuickTests}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              Run Tests ({selectedEnvs.length})
            </button>
          ) : (
            <button
              disabled
              className="px-8 py-3 bg-gray-600 rounded-lg font-semibold opacity-50 cursor-not-allowed"
            >
              Select Environments to Test
            </button>
          )}
          
          <button
            onClick={() => setGamePhase('creation')}
            className="ml-4 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg border border-gray-400/30 transition-colors"
          >
            Return to Lab
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    initializeVirus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white font-sans">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-cyan-400/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Microscope className="w-10 h-10 text-cyan-400" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ADVANCED VIRAL ARCHITECT
                </h1>
                <p className="text-sm text-cyan-300">Professional Pathogen Engineering Laboratory</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-400/30">
                <span className="text-yellow-400 font-bold">Research Credits: {tokens}</span>
              </div>
              <button 
                onClick={initializeVirus}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg border border-red-400/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {gamePhase === 'creation' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            
            {/* FIXED VIRUS VISUALIZATION PANEL - Always visible on right */}
            <div className="xl:order-2 space-y-6">
              {/* Virus Visualization - FIXED POSITION */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-4 sticky top-4">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-cyan-400" />
                  Live Construction View
                </h3>
                <VirusVisualization virus={currentVirus} />
              </div>

              {/* Stats Panel */}
              {currentVirus?.nucleicAcid && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-4 sticky top-4">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Beaker className="w-5 h-5 mr-2 text-cyan-400" />
                    Performance Analysis
                  </h3>
                  
                  {currentVirus.classification && (
                    <div className="mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                      <div className="text-xs text-blue-300">Scientific Classification:</div>
                      <div className="font-semibold text-blue-100 text-sm">{currentVirus.classification}</div>
                    </div>
                  )}

                  {currentVirus.matchedVirus && (
                    <div className="mb-4 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                      <div className="text-xs text-green-300">Most Similar To:</div>
                      <div className="font-semibold text-green-100 text-sm">{currentVirus.matchedVirus.name}</div>
                      <div className="text-xs text-green-300 mt-1">
                        Match: {currentVirus.matchedVirus.similarity}%
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {[
                      { key: 'stability', label: 'Environmental Stability', color: '#06B6D4' },
                      { key: 'transmissibility', label: 'Transmission Rate', color: '#10B981' },
                      { key: 'immuneResistance', label: 'Immune Evasion', color: '#8B5CF6' },
                      { key: 'replicationRate', label: 'Replication Speed', color: '#F59E0B' },
                      { key: 'hostAdaptation', label: 'Host Range', color: '#EC4899' }
                    ].map(({ key, label, color }) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">{label}</span>
                          <span className="font-semibold text-xs" style={{color}}>{currentVirus.stats[key]}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${currentVirus.stats[key]}%`,
                              backgroundColor: color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Survival Testing Panel */}
              {currentVirus?.transmissionMode && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-4">
                  <h3 className="text-lg font-bold mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-cyan-400" />
                    Survival Testing
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-gray-300">Test your virus in different environments</p>
                    
                    {/* Testing Mode Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setTestingPhase('adventure');
                          setGamePhase('adventure');
                        }}
                        className="w-full p-3 bg-gradient-to-r from-green-500/20 to-red-500/20 hover:from-green-500/30 hover:to-red-500/30 rounded-lg border border-green-400/30 transition-colors text-sm font-semibold"
                      >
                        🦠 Pandemic Campaign
                      </button>
                      <button
                        onClick={() => {
                          setTestingPhase('quicktest');
                          setGamePhase('quicktest');
                        }}
                        className="w-full p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-lg border border-purple-400/30 transition-colors text-sm font-semibold"
                      >
                        ⚡ Environmental Testing
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Virus Engineering Panel - Takes up 3/4 of the width */}
            <div className="xl:col-span-3 xl:order-1 space-y-6">
              
              {/* Nucleic Acid Selection */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-6">
                <h3 className="text-xl font-bold mb-4 text-cyan-300 flex items-center">
                  <Dna className="w-5 h-5 mr-2" />
                  1. Genetic Material Core
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(virusDatabase.nucleicAcid).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => selectCharacteristic('nucleicAcid', key, data.cost)}
                      disabled={tokens < data.cost}
                      className={`p-4 rounded-lg border transition-all text-left relative ${
                        currentVirus?.nucleicAcid === key 
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50' 
                          : tokens >= data.cost
                            ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                            : 'bg-gray-800/30 border-gray-700/20 opacity-50 cursor-not-allowed'
                      }`}
                      style={{
                        backgroundColor: currentVirus?.nucleicAcid === key ? `${data.color}20` : undefined
                      }}
                    >
                      <div className="font-semibold text-sm">{data.name}</div>
                      <div className="text-xs text-gray-300 mt-1">{data.description}</div>
                      <div className="text-xs mt-2" style={{color: data.color}}>
                        Stability: {data.stability}%
                      </div>
                      <div className="absolute top-2 right-2 bg-yellow-500/20 px-2 py-1 rounded text-xs text-yellow-400">
                        {data.cost}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Capsid Architecture */}
              {currentVirus?.nucleicAcid && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-6">
                  <h3 className="text-xl font-bold mb-4 text-cyan-300">2. Capsid Architecture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(virusDatabase.capsid).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => selectCharacteristic('capsid', key, data.cost)}
                        disabled={tokens < data.cost}
                        className={`p-4 rounded-lg border transition-all text-left relative ${
                          currentVirus?.capsid === key 
                            ? 'bg-blue-500/30 border-blue-400 ring-2 ring-blue-400/50' 
                            : tokens >= data.cost
                              ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                              : 'bg-gray-800/30 border-gray-700/20 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="font-semibold">{data.name}</div>
                        <div className="text-sm text-gray-300 mt-1">{data.description}</div>
                        <div className="text-xs text-blue-400 mt-2">
                          Stability: {data.stability}%
                        </div>
                        <div className="absolute top-2 right-2 bg-yellow-500/20 px-2 py-1 rounded text-xs text-yellow-400">
                          {data.cost}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Envelope Structure */}
              {currentVirus?.capsid && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-6">
                  <h3 className="text-xl font-bold mb-4 text-cyan-300">3. Membrane Envelope</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(virusDatabase.envelope).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => selectCharacteristic('envelope', key, data.cost)}
                        disabled={tokens < data.cost}
                        className={`p-4 rounded-lg border transition-all text-left relative ${
                          currentVirus?.envelope === key 
                            ? 'bg-green-500/30 border-green-400 ring-2 ring-green-400/50' 
                            : tokens >= data.cost
                              ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                              : 'bg-gray-800/30 border-gray-700/20 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="font-semibold">{data.name}</div>
                        <div className="text-sm text-gray-300 mt-1">{data.description}</div>
                        <div className="text-xs text-green-400 mt-2">
                          Env. Stability: {data.environmentalStability}%
                        </div>
                        <div className="absolute top-2 right-2 bg-yellow-500/20 px-2 py-1 rounded text-xs text-yellow-400">
                          {data.cost}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Host Cell Receptor */}
              {currentVirus?.envelope && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-6">
                  <h3 className="text-xl font-bold mb-4 text-cyan-300">4. Target Cell Receptor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(virusDatabase.receptors).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => selectCharacteristic('receptor', key, data.cost)}
                        disabled={tokens < data.cost}
                        className={`p-3 rounded-lg border transition-all text-left relative ${
                          currentVirus?.receptor === key 
                            ? 'border-pink-400 ring-2 ring-pink-400/50' 
                            : tokens >= data.cost
                              ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                              : 'bg-gray-800/30 border-gray-700/20 opacity-50 cursor-not-allowed'
                        }`}
                        style={{
                          backgroundColor: currentVirus?.receptor === key ? `${data.color}20` : undefined
                        }}
                      >
                        <div className="font-semibold text-sm">{data.name}</div>
                        <div className="text-xs text-gray-300 mt-1">{data.tropism}</div>
                        <div className="text-xs mt-2" style={{color: data.color}}>
                          Efficiency: {data.efficiency}%
                        </div>
                        <div className="absolute top-1 right-1 bg-yellow-500/20 px-1 py-0.5 rounded text-xs text-yellow-400">
                          {data.cost}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Host Range Specialization */}
              {currentVirus?.receptor && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-6">
                  <h3 className="text-xl font-bold mb-4 text-cyan-300">5. Host Range Specialization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {Object.entries(virusDatabase.hostRange).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => selectCharacteristic('hostRange', key, data.cost)}
                        disabled={tokens < data.cost}
                        className={`p-4 rounded-lg border transition-all text-left relative ${
                          currentVirus?.hostRange === key 
                            ? 'bg-orange-500/30 border-orange-400 ring-2 ring-orange-400/50' 
                            : tokens >= data.cost
                              ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                              : 'bg-gray-800/30 border-gray-700/20 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="font-semibold text-sm">{data.name}</div>
                        <div className="text-xs text-gray-300 mt-1">{data.description}</div>
                        <div className="text-xs text-orange-400 mt-2">
                          Stability: {data.stability}%
                        </div>
                        <div className="absolute top-2 right-2 bg-yellow-500/20 px-2 py-1 rounded text-xs text-yellow-400">
                          {data.cost}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Transmission Mechanism */}
              {currentVirus?.hostRange && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-6">
                  <h3 className="text-xl font-bold mb-4 text-cyan-300">6. Transmission Strategy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(virusDatabase.transmissionMode).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => selectCharacteristic('transmissionMode', key, data.cost)}
                        disabled={tokens < data.cost}
                        className={`p-4 rounded-lg border transition-all text-left relative ${
                          currentVirus?.transmissionMode === key 
                            ? 'bg-teal-500/30 border-teal-400 ring-2 ring-teal-400/50' 
                            : tokens >= data.cost
                              ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                              : 'bg-gray-800/30 border-gray-700/20 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="font-semibold">{data.name}</div>
                        <div className="text-sm text-gray-300 mt-1">Range: {data.range}</div>
                        <div className="text-xs text-teal-400 mt-2">
                          Efficiency: {data.efficiency}%
                        </div>
                        <div className="absolute top-2 right-2 bg-yellow-500/20 px-2 py-1 rounded text-xs text-yellow-400">
                          {data.cost}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Evolutionary Adaptations - Full Mutation System */}
              {currentVirus?.transmissionMode && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-6">
                  <h3 className="text-xl font-bold mb-4 text-cyan-300 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    7. Evolutionary Adaptations
                  </h3>
                  
                  {/* Structural Mutations */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-purple-300">Structural Enhancements</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {['capsidStability', 'polymeraseAccuracy', 'receptorBinding', 'superinfection'].map(key => {
                        const data = virusDatabase.mutations[key];
                        return (
                          <button
                            key={key}
                            disabled={currentVirus?.mutations.includes(key) || tokens < data.cost}
                            onClick={() => selectCharacteristic('mutation', key, data.cost)}
                            className={`p-4 rounded-lg border transition-all text-left relative ${
                              currentVirus?.mutations.includes(key)
                                ? 'bg-orange-500/30 border-orange-400 opacity-60' 
                                : tokens >= data.cost
                                  ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                                  : 'bg-gray-800/30 border-gray-700/20 opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-semibold flex items-center">
                                  {data.name} 
                                  {currentVirus?.mutations.includes(key) && <span className="ml-2 text-orange-400">✓</span>}
                                </div>
                                <div className="text-sm text-gray-300 mt-1">{data.effect}</div>
                                <div className="text-xs text-blue-400 mt-2">{data.scientificBasis}</div>
                              </div>
                              <div className="bg-yellow-500/20 px-2 py-1 rounded text-xs text-yellow-400 ml-4">
                                {data.cost}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Immune Evasion Mutations */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-red-300">Immune Evasion</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {['antigenicDrift', 'antigenicShift', 'epitopeMasking', 'immunosuppression'].map(key => {
                        const data = virusDatabase.mutations[key];
                        return (
                          <button
                            key={key}
                            disabled={currentVirus?.mutations.includes(key) || tokens < data.cost}
                            onClick={() => selectCharacteristic('mutation', key, data.cost)}
                            className={`p-4 rounded-lg border transition-all text-left relative ${
                              currentVirus?.mutations.includes(key)
                                ? 'bg-red-500/30 border-red-400 opacity-60' 
                                : tokens >= data.cost
                                  ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                                  : 'bg-gray-800/30 border-gray-700/20 opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-semibold flex items-center">
                                  {data.name} 
                                  {currentVirus?.mutations.includes(key) && <span className="ml-2 text-red-400">✓</span>}
                                </div>
                                <div className="text-sm text-gray-300 mt-1">{data.effect}</div>
                                <div className="text-xs text-blue-400 mt-2">{data.scientificBasis}</div>
                              </div>
                              <div className="bg-yellow-500/20 px-2 py-1 rounded text-xs text-yellow-400 ml-4">
                                {data.cost}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Host Adaptation Mutations */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-green-300">Host Adaptation</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {['hostJumping', 'tisseTropism', 'asymptomaticShedding', 'environmentalSurvival'].map(key => {
                        const data = virusDatabase.mutations[key];
                        return (
                          <button
                            key={key}
                            disabled={currentVirus?.mutations.includes(key) || tokens < data.cost}
                            onClick={() => selectCharacteristic('mutation', key, data.cost)}
                            className={`p-4 rounded-lg border transition-all text-left relative ${
                              currentVirus?.mutations.includes(key)
                                ? 'bg-green-500/30 border-green-400 opacity-60' 
                                : tokens >= data.cost
                                  ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                                  : 'bg-gray-800/30 border-gray-700/20 opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-semibold flex items-center">
                                  {data.name} 
                                  {currentVirus?.mutations.includes(key) && <span className="ml-2 text-green-400">✓</span>}
                                </div>
                                <div className="text-sm text-gray-300 mt-1">{data.effect}</div>
                                <div className="text-xs text-blue-400 mt-2">{data.scientificBasis}</div>
                              </div>
                              <div className="bg-yellow-500/20 px-2 py-1 rounded text-xs text-yellow-400 ml-4">
                                {data.cost}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Advanced Pathogenesis Mutations */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-pink-300">Advanced Pathogenesis</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {['latencyMechanism', 'oncoGenesis', 'persistentInfection'].map(key => {
                        const data = virusDatabase.mutations[key];
                        return (
                          <button
                            key={key}
                            disabled={currentVirus?.mutations.includes(key) || tokens < data.cost}
                            onClick={() => selectCharacteristic('mutation', key, data.cost)}
                            className={`p-4 rounded-lg border transition-all text-left relative ${
                              currentVirus?.mutations.includes(key)
                                ? 'bg-pink-500/30 border-pink-400 opacity-60' 
                                : tokens >= data.cost
                                  ? 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                                  : 'bg-gray-800/30 border-gray-700/20 opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-semibold flex items-center">
                                  {data.name} 
                                  {currentVirus?.mutations.includes(key) && <span className="ml-2 text-pink-400">✓</span>}
                                </div>
                                <div className="text-sm text-gray-300 mt-1">{data.effect}</div>
                                <div className="text-xs text-blue-400 mt-2">{data.scientificBasis}</div>
                              </div>
                              <div className="bg-yellow-500/20 px-2 py-1 rounded text-xs text-yellow-400 ml-4">
                                {data.cost}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {gamePhase === 'adventure' && <AdventureMode />}
        
        {gamePhase === 'quicktest' && <QuickTestMode />}

        {gamePhase === 'results' && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-8">
              {/* Check if this is adventure results or quick test results */}
              {testResults[0]?.scenario === 'campaign_final' ? (
                <>
                  <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-red-400 bg-clip-text text-transparent">
                    {testResults[0].ending?.title || '🦠 Campaign Complete!'}
                  </h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-cyan-300">Campaign Results</h3>
                      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-red-500/20 rounded">
                            <div className="text-2xl font-bold text-red-400">
                              {testResults[0].totalInfected || 0}
                            </div>
                            <div className="text-sm text-gray-300">Total Infected</div>
                          </div>
                          <div className="text-center p-4 bg-blue-500/20 rounded">
                            <div className="text-2xl font-bold text-blue-400">
                              {testResults[0].missionsCompleted || 0}
                            </div>
                            <div className="text-sm text-gray-300">Missions Completed</div>
                          </div>
                          <div className="text-center p-4 bg-green-500/20 rounded">
                            <div className="text-2xl font-bold text-green-400">
                              {testResults[0].survivability}%
                            </div>
                            <div className="text-sm text-gray-300">Avg Survival</div>
                          </div>
                          <div className="text-center p-4 bg-purple-500/20 rounded">
                            <div className={`text-2xl font-bold ${testResults[0].ending?.color || 'text-purple-400'}`}>
                              {testResults[0].ending?.score || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-300">Final Grade</div>
                          </div>
                        </div>
                        
                        {testResults[0].ending && (
                          <div className="pt-4 border-t border-gray-600">
                            <div className={`text-lg font-semibold mb-2 ${testResults[0].ending.color}`}>
                              {testResults[0].ending.title}
                            </div>
                            <div className="text-sm text-gray-300 mb-4">
                              {testResults[0].ending.message}
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-4 border-t border-gray-600">
                          <h4 className="font-semibold text-cyan-300 mb-2">Campaign Summary:</h4>
                          <div className="space-y-1">
                            {testResults[0].explanations.slice(0, -1).map((event, i) => (
                              <div key={i} className="text-sm text-gray-400">{event}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-cyan-300">Virus Classification</h3>
                      <div className="mb-6">
                        <VirusVisualization virus={currentVirus} />
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-400/30">
                        <div className="text-lg font-semibold text-blue-200 mb-2">{currentVirus.classification}</div>
                        {currentVirus.matchedVirus && (
                          <div className="space-y-3">
                            <div className="text-green-300 font-semibold">
                              Most Closely Resembles: {currentVirus.matchedVirus.name}
                            </div>
                            <div className="text-sm text-gray-300">
                              {currentVirus.matchedVirus.data.description}
                            </div>
                          </div>
                        )}
                      </div>

                      {achievements.length > 0 && (
                        <div className="mt-6 text-center">
                          <div className="text-sm text-yellow-300 mb-2">Campaign Achievement:</div>
                          {achievements.map(achievement => (
                            <div key={achievement} className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded inline-block mx-1 mb-2">
                              <Trophy className="w-3 h-3 inline mr-1" />
                              {achievement}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Environmental Survival Analysis Report
                  </h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Detailed Test Results */}
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-semibold mb-4 text-cyan-300">Survival Test Results</h3>
                      <div className="space-y-4">
                        {testResults.map((result, index) => (
                          <div key={index} className="bg-gray-800/50 rounded-lg p-5 border border-gray-600/30">
                            <div className="flex justify-between items-start mb-3">
                              <div className="font-semibold text-lg">{scenarios[result.scenario].name}</div>
                              <div className="flex items-center space-x-3">
                                <span className="text-xs px-2 py-1 rounded" style={{
                                  backgroundColor: scenarios[result.scenario].color + '30',
                                  color: scenarios[result.scenario].color
                                }}>
                                  {result.difficulty}
                                </span>
                                <span className={`font-bold text-xl ${
                                  result.survivability > 70 ? 'text-green-400' :
                                  result.survivability > 40 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                  {result.survivability}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex-1">
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                  <div 
                                    className={`h-3 rounded-full transition-all duration-500 ${
                                      result.survivability > 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                      result.survivability > 40 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                      'bg-gradient-to-r from-red-400 to-red-600'
                                    }`}
                                    style={{ width: `${result.survivability}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center">
                                {result.survivability > 70 ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                                 result.survivability > 40 ? <AlertCircle className="w-5 h-5 text-yellow-400" /> :
                                 <XCircle className="w-5 h-5 text-red-400" />}
                              </div>
                            </div>

                            {/* Detailed Explanations */}
                            <div className="bg-gray-900/50 rounded p-3">
                              <div className="text-sm text-gray-300 mb-2 font-semibold">Survival Factors:</div>
                              <div className="space-y-1">
                                {result.explanations.map((explanation, i) => (
                                  <div key={i} className="text-xs text-gray-400">{explanation}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary and Virus Classification */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-cyan-300">Final Classification</h3>
                      
                      <div className="mb-6">
                        <VirusVisualization virus={currentVirus} />
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-400/30 mb-6">
                        <div className="text-lg font-semibold text-blue-200 mb-2">{currentVirus.classification}</div>
                        {currentVirus.matchedVirus && (
                          <div className="space-y-3">
                            <div className="text-green-300 font-semibold">
                              Most Closely Resembles: {currentVirus.matchedVirus.name}
                            </div>
                            <div className="text-sm text-gray-300">
                              {currentVirus.matchedVirus.data.description}
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm">Similarity:</span>
                              <div className="flex-1 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                                  style={{ width: `${currentVirus.matchedVirus.similarity}%` }}
                                />
                              </div>
                              <span className="text-green-400 font-semibold">{currentVirus.matchedVirus.similarity}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2 text-cyan-400">
                          {Math.round(testResults.reduce((sum, r) => sum + r.survivability, 0) / testResults.length)}%
                        </div>
                        <div className="text-lg text-cyan-300">Overall Performance</div>
                        {achievements.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <div className="text-sm text-yellow-300">Achievements Unlocked:</div>
                            {achievements.map(achievement => (
                              <div key={achievement} className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded inline-block mx-1">
                                <Trophy className="w-3 h-3 inline mr-1" />
                                {achievement}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {currentVirus.mutations?.length > 0 && (
                        <div className="mt-6 space-y-2">
                          <div className="text-sm font-semibold text-cyan-300">Active Mutations:</div>
                          {currentVirus.mutations.map(mutation => (
                            <div key={mutation} className="bg-orange-500/20 rounded px-3 py-2 text-sm border border-orange-400/30">
                              <div className="font-semibold text-orange-200">{virusDatabase.mutations[mutation].name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setGamePhase('creation')}
                  className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg border border-cyan-400/30 transition-colors flex items-center space-x-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Return to Lab</span>
                </button>
                <button
                  onClick={initializeVirus}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 rounded-lg border border-blue-400/30 transition-colors flex items-center space-x-2"
                >
                  <Dna className="w-4 h-4" />
                  <span>New Virus</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}