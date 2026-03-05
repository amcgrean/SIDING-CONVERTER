import { COVERAGE_TABLE, SidingType, ITEM_CODES } from './sidingData';

export interface CalculatorInputs {
    sidingType: SidingType;
    width: number;
    length: number;
    wallHeight: number;
    roofSlope: number; // Numerator of x:12
    roofOverhang: number; // Inches (12, 16, 24)
    overheadDoors: number;
    serviceDoors: number;
    windows: number;
    wrapWindows: boolean;
    jobNumber?: string;
    branch?: string;
}

export interface CalculationResult {
    itemCode: string;
    description: string;
    quantity: number;
    uom: string;
}

export function calculateMaterials(inputs: CalculatorInputs): CalculationResult[] {
    const coverage = COVERAGE_TABLE[inputs.sidingType];
    const { width, length, wallHeight, roofSlope, roofOverhang, overheadDoors, serviceDoors, windows, wrapWindows } = inputs;

    // Intermediate Values
    const overhangFt = roofOverhang / 12;
    const roofRise = roofSlope;
    const roofRun = 12;

    // eave soffit LF for both long sides + 5% waste
    const soffitLF = Math.ceil(((length * 2) + 2) * 1.05);

    // area of both gable-end triangles
    // Formula: (width / 2) * (roofRise / roofRun) * ((width + overhangFt) / 2) * 2
    // Simplified: (width / 2) * (roofRise / 12) * (width + overhangFt)
    const gableSF = (width / 2) * (roofRise / roofRun) * ((width + overhangFt) / 2) * 2;

    // full wall perimeter * height, plus gable triangles
    const wallSheathingSF = (((width + length) * 2) * wallHeight) + gableSF;

    // sloped rake edge length for all 4 rake edges
    // Formula: SQRT((roofRise/roofRun * (width/2))^2 + ((width/2) + overhangFt)^2) * 4
    const rakeLF = Math.sqrt(Math.pow((roofRise / roofRun * (width / 2)), 2) + Math.pow(((width / 2) + overhangFt), 2)) * 4;

    const results: CalculationResult[] = [];

    // Intermediate for reusing
    const lapSidingBoards = Math.ceil((wallSheathingSF + gableSF) / coverage.sfPerBoard);

    // Helper to get item code
    const getItemCode = (rowRef: string) => {
        const entry = ITEM_CODES.find(item => item.rowRef === rowRef);
        if (!entry) return null;
        if (!entry.activeFor.includes(inputs.sidingType)) return null;
        return {
            code: entry.itemCodes[inputs.sidingType] || '',
            description: entry.description,
            uom: entry.uom
        };
    };

    const addResult = (rowRef: string, qty: number) => {
        const item = getItemCode(rowRef);
        if (item && qty > 0) {
            results.push({
                itemCode: item.code,
                description: item.description,
                quantity: qty,
                uom: item.uom
            });
        }
    };

    // Row 35 — 8" Lap Siding
    addResult("Row 35", lapSidingBoards);

    // Row 36/37/38 — Soffit Vent
    if (roofOverhang === 12) {
        addResult("Row 36", Math.ceil((soffitLF / coverage.boardLengthLF) * coverage.wasteFactor));
    } else if (roofOverhang === 16) {
        addResult("Row 37", Math.ceil((soffitLF / coverage.boardLengthLF) * coverage.wasteFactor));
    } else if (roofOverhang === 24) {
        addResult("Row 38", Math.ceil((soffitLF / coverage.boardLengthLF) * 1.2));
    }

    // Row 39 — 12" Rake Board
    addResult("Row 39", Math.ceil((rakeLF / coverage.boardLengthLF) * 1.2));

    // Row 40 — Vinyl J-Channel (Vinyl only)
    if (inputs.sidingType === 'Vinyl') {
        addResult("Row 40", Math.ceil((rakeLF + soffitLF + (serviceDoors + windows) * 15) / 12));
    }

    // Row 41 — Metal Starter Strip (Vinyl only)
    if (inputs.sidingType === 'Vinyl') {
        addResult("Row 41", Math.ceil(((width + length) * 2) / 12));
    }

    // Row 42 — Single Under-Sill Trim (Vinyl only)
    if (inputs.sidingType === 'Vinyl') {
        addResult("Row 42", Math.ceil((windows * 5) / 12));
    }

    // Row 43 — Rollex Starter (Vinyl only)
    if (inputs.sidingType === 'Vinyl') {
        addResult("Row 43", Math.ceil((rakeLF + soffitLF) / 12));
    }

    // Row 44 — MD Divider (Vinyl only)
    if (inputs.sidingType === 'Vinyl') {
        addResult("Row 44", 1);
    }

    // Row 45 — Steel Nails (Vinyl only)
    if (inputs.sidingType === 'Vinyl') {
        addResult("Row 45", 1);
    }

    // Row 46 — Vinyl Lineal (Window Wrap) (Vinyl only, and only when wrapWindows === true)
    if (inputs.sidingType === 'Vinyl' && wrapWindows) {
        addResult("Row 46", Math.ceil(((serviceDoors + windows) * 15) / 20));
    }

    // Row 47 — 1x6 Fascia / Trim
    addResult("Row 47", Math.ceil((overheadDoors * 32) / coverage.boardLengthLF));

    // Row 48 — 1x8 Soffit / Rake Trim
    addResult("Row 48", Math.ceil(((soffitLF + rakeLF) / coverage.boardLengthLF) * 1.2));

    // Row 49 — 5/4x6 Corner / Door Trim
    if (inputs.sidingType === 'Vinyl') {
        addResult("Row 49", 4);
    } else {
        // LP / Hardie: qty = ROUNDUP(8 + (serviceDoors * 17 + (wrapWindows ? windows * 16 : 0) + overheadDoors * 32) / boardLengthLF)
        const qty = Math.ceil(8 + (serviceDoors * 17 + (wrapWindows ? windows * 16 : 0) + overheadDoors * 32) / coverage.boardLengthLF);
        addResult("Row 49", qty);
    }

    // Row 50 — Tin Step Flashing (LP, Hardie only)
    if (inputs.sidingType !== 'Vinyl') {
        addResult("Row 50", Math.ceil(lapSidingBoards / coverage.tinShinglesPerBoard));
    }

    // Row 51 — Z-Flashing (LP, Hardie only)
    if (inputs.sidingType !== 'Vinyl') {
        addResult("Row 51", Math.ceil((overheadDoors * 16 + windows * 4 + serviceDoors * 3) / coverage.zFlashLFPerPiece));
    }

    // Row 52 — Caulk
    addResult("Row 52", 20);

    // Row 53 — 10d Galvanized Nails
    addResult("Row 53", 5);

    // Row 54 — 16d Galvanized Nails
    addResult("Row 54", 5);

    // Row 55 — Roofing Nails
    addResult("Row 55", inputs.sidingType === 'Vinyl' ? 20 : 10);

    return results;
}
