export type SidingType = 'LP' | 'Hardie' | 'Vinyl';

export interface CoverageData {
  boardLengthLF: number;
  sfPerBoard: number;
  piecesPerSq: number;
  tinShinglesPerBoard: number;
  zFlashLFPerPiece: number;
  wasteFactor: number;
}

export const COVERAGE_TABLE: Record<SidingType, CoverageData> = {
  LP: {
    boardLengthLF: 16,
    sfPerBoard: 9.33,
    piecesPerSq: 16,
    tinShinglesPerBoard: 2,
    zFlashLFPerPiece: 10,
    wasteFactor: 1.2,
  },
  Hardie: {
    boardLengthLF: 12,
    sfPerBoard: 7.00,
    piecesPerSq: 12,
    tinShinglesPerBoard: 2,
    zFlashLFPerPiece: 10,
    wasteFactor: 1.2,
  },
  Vinyl: {
    boardLengthLF: 12,
    sfPerBoard: 8.33,
    piecesPerSq: 50,
    tinShinglesPerBoard: 0,
    zFlashLFPerPiece: 0,
    wasteFactor: 1.05,
  },
};

export interface ItemCodeEntry {
  rowRef: string;
  description: string;
  uom: 'Each' | 'lb';
  activeFor: SidingType[];
  itemCodes: Partial<Record<SidingType, string>>;
}

export const ITEM_CODES: ItemCodeEntry[] = [
  { rowRef: "Row 35", description: "8\" Lap Siding", uom: "Each", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "lpsidtxt0816", "Hardie": "jhsidtxt081412", "Vinyl": "vinclay1sidmsd4" } },
  { rowRef: "Row 36", description: "12\" Soffit Vent", uom: "Each", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "lpsoftxt1216", "Hardie": "jhsoftxt16144", "Vinyl": "rollexwht316cv" } },
  { rowRef: "Row 37", description: "16\" Soffit Vent", uom: "Each", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "lpsoftxt1616", "Hardie": "jhsoftxt16144", "Vinyl": "rollexwht316cv" } },
  { rowRef: "Row 38", description: "24\" Soffit Vent", uom: "Each", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "lpsoftxt2416", "Hardie": "jhsoftxt2496", "Vinyl": "rollexwht316cv" } },
  { rowRef: "Row 39", description: "12\" Rake Board", uom: "Each", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "lpsidtxt1216", "Hardie": "jhsidtxt1212", "Vinyl": "rollexwht316" } },
  { rowRef: "Row 40", description: "Vinyl J-Channel", uom: "Each", activeFor: ["Vinyl"], itemCodes: { "Vinyl": "vinclayjchan34" } },
  { rowRef: "Row 41", description: "Metal Starter Strip", uom: "Each", activeFor: ["Vinyl"], itemCodes: { "Vinyl": "vinstarterm212" } },
  { rowRef: "Row 42", description: "Single Under-Sill Trim", uom: "Each", activeFor: ["Vinyl"], itemCodes: { "Vinyl": "vinclayuss" } },
  { rowRef: "Row 43", description: "Rollex Starter", uom: "Each", activeFor: ["Vinyl"], itemCodes: { "Vinyl": "rollexwhtrs" } },
  { rowRef: "Row 44", description: "MD Divider", uom: "Each", activeFor: ["Vinyl"], itemCodes: { "Vinyl": "rollexwhtmd12" } },
  { rowRef: "Row 45", description: "Steel Nails (Vinyl)", uom: "Each", activeFor: ["Vinyl"], itemCodes: { "Vinyl": "rollexwhtnal114" } },
  { rowRef: "Row 46", description: "Vinyl Lineal (Window Wrap)", uom: "Each", activeFor: ["Vinyl"], itemCodes: { "Vinyl": "ct5natclaylin20" } },
  { rowRef: "Row 47", description: "1x6 Fascia / Trim", uom: "Each", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "lptrimtxt010616", "Hardie": "jhtrimtx4405", "Vinyl": "rollexbrzcl2450" } },
  { rowRef: "Row 48", description: "1x8 Soffit / Rake Trim", uom: "Each", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "lptrimtxt010816", "Hardie": "jhtrimtx44075", "Vinyl": "rollexwhtsl6" } },
  { rowRef: "Row 49", description: "5/4x6 Corner / Door Trim", uom: "Each", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "lptrimtxt540616", "Hardie": "jhtrimtx5405", "Vinyl": "vinclayoc" } },
  { rowRef: "Row 50", description: "Tin Step Flashing", uom: "Each", activeFor: ["LP", "Hardie"], itemCodes: { "LP": "flashtsb611", "Hardie": "flashtsb611" } },
  { rowRef: "Row 51", description: "Z-Flashing", uom: "Each", activeFor: ["LP", "Hardie"], itemCodes: { "LP": "flashzgalvz110", "Hardie": "flashzgalvz110" } },
  { rowRef: "Row 52", description: "Caulk", uom: "Each", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "caulkquad461", "Hardie": "caulkquad461", "Vinyl": "caulkquad461" } },
  { rowRef: "Row 53", description: "10d Galvanized Nails", uom: "lb", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "nailgalvbox10d", "Hardie": "nailgalvbox10d", "Vinyl": "nailgalvbox10d" } },
  { rowRef: "Row 54", description: "16d Galvanized Nails", uom: "lb", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "nailgalvbox16d", "Hardie": "nailgalvbox16d", "Vinyl": "nailgalvbox16d" } },
  { rowRef: "Row 55", description: "Roofing Nails", uom: "lb", activeFor: ["LP", "Hardie", "Vinyl"], itemCodes: { "LP": "nailroofeg2", "Hardie": "nailroofeg2", "Vinyl": "nailroofeg2" } }
];
