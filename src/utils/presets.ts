import { ModuleSpecs } from './solar';

export interface ModulePreset extends ModuleSpecs {
  name: string;
  manufacturer: string;
}

export const MODULE_PRESETS: ModulePreset[] = [
  // CANADIAN SOLAR
  {
    manufacturer: "Canadian Solar",
    name: "Canadian Solar HiKu6 CS6W-550MS",
    power: 550,
    voc: 49.6,
    vmp: 41.7,
    isc: 14.0,
    imp: 13.2,
    tempCoeffVoc: -0.27,
    tempCoeffVmp: -0.34,
  },
  {
    manufacturer: "Canadian Solar",
    name: "Canadian Solar BiHiKu7 CS7N-660MB-AG",
    power: 660,
    voc: 45.6,
    vmp: 38.3,
    isc: 18.47,
    imp: 17.24,
    tempCoeffVoc: -0.27,
    tempCoeffVmp: -0.34,
  },
  {
    manufacturer: "Canadian Solar",
    name: "Canadian Solar HiKu7 CS7L-600MS",
    power: 600,
    voc: 41.3,
    vmp: 34.7,
    isc: 18.42,
    imp: 17.30,
    tempCoeffVoc: -0.27,
    tempCoeffVmp: -0.34,
  },

  // JINKO SOLAR
  {
    manufacturer: "Jinko Solar",
    name: "Jinko Tiger Neo N-Type 72HL4-BDV 570W",
    power: 570,
    voc: 50.74,
    vmp: 42.07,
    isc: 14.31,
    imp: 13.55,
    tempCoeffVoc: -0.25,
    tempCoeffVmp: -0.29,
  },
  {
    manufacturer: "Jinko Solar",
    name: "Jinko Tiger Pro 72HC 545W",
    power: 545,
    voc: 49.52,
    vmp: 40.80,
    isc: 13.94,
    imp: 13.36,
    tempCoeffVoc: -0.28,
    tempCoeffVmp: -0.35,
  },
  {
    manufacturer: "Jinko Solar",
    name: "Jinko Tiger Neo 78HL4-BDV 620W",
    power: 620,
    voc: 55.65,
    vmp: 46.10,
    isc: 14.13,
    imp: 13.45,
    tempCoeffVoc: -0.25,
    tempCoeffVmp: -0.29,
  },

  // TRINA SOLAR
  {
    manufacturer: "Trina Solar",
    name: "Trina Vertex DE19 550W",
    power: 550,
    voc: 37.9,
    vmp: 31.6,
    isc: 18.52,
    imp: 17.40,
    tempCoeffVoc: -0.25,
    tempCoeffVmp: -0.34,
  },
  {
    manufacturer: "Trina Solar",
    name: "Trina Vertex DE21 660W",
    power: 660,
    voc: 45.7,
    vmp: 38.3,
    isc: 18.53,
    imp: 17.24,
    tempCoeffVoc: -0.25,
    tempCoeffVmp: -0.34,
  },
  {
    manufacturer: "Trina Solar",
    name: "Trina Vertex S+ 440W (NEG9R.28)",
    power: 440,
    voc: 52.2,
    vmp: 44.0,
    isc: 10.67,
    imp: 10.0,
    tempCoeffVoc: -0.24,
    tempCoeffVmp: -0.30,
  },

  // LONGI SOLAR
  {
    manufacturer: "Longi Solar",
    name: "Longi Hi-MO 5 LR5-72HPH 550M",
    power: 550,
    voc: 49.80,
    vmp: 41.95,
    isc: 13.98,
    imp: 13.12,
    tempCoeffVoc: -0.265,
    tempCoeffVmp: -0.34,
  },
  {
    manufacturer: "Longi Solar",
    name: "Longi Hi-MO 6 LR5-72HTH 580M",
    power: 580,
    voc: 52.21,
    vmp: 44.06,
    isc: 14.20,
    imp: 13.17,
    tempCoeffVoc: -0.23,
    tempCoeffVmp: -0.29,
  },

  // JA SOLAR
  {
    manufacturer: "JA Solar",
    name: "JA Solar DeepBlue 3.0 JAM72S30-550/MR",
    power: 550,
    voc: 49.90,
    vmp: 41.96,
    isc: 14.00,
    imp: 13.11,
    tempCoeffVoc: -0.275,
    tempCoeffVmp: -0.35,
  },
  {
    manufacturer: "JA Solar",
    name: "JA Solar JAM78S30-600/MR",
    power: 600,
    voc: 53.65,
    vmp: 45.15,
    isc: 14.25,
    imp: 13.29,
    tempCoeffVoc: -0.275,
    tempCoeffVmp: -0.35,
  },

  // RISEN ENERGY
  {
    manufacturer: "Risen Energy",
    name: "Risen Titan S RSM110-8-550M",
    power: 550,
    voc: 38.02,
    vmp: 31.66,
    isc: 18.16,
    imp: 17.40,
    tempCoeffVoc: -0.25,
    tempCoeffVmp: -0.34,
  },

  // SUNPOWER / MAXEON
  {
    manufacturer: "SunPower",
    name: "SunPower Maxeon 6 AC 425W",
    power: 425,
    voc: 75.6,
    vmp: 63.8,
    isc: 6.75,
    imp: 6.67,
    tempCoeffVoc: -0.27,
    tempCoeffVmp: -0.29,
  }
];
