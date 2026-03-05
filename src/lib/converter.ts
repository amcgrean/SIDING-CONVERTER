import { ITEM_CODES, SidingType } from './sidingData';

export interface ParsedItem {
    itemCode: string;
    description: string;
    quantity: number;
    uom: string;
}

export interface ConversionResult {
    sourceItem: ParsedItem;
    targetItem: ParsedItem | null;
    isMatched: boolean;
}

export function detectSidingType(itemCodes: string[]): SidingType | null {
    for (const code of itemCodes) {
        const lowerCode = code.toLowerCase();
        if (lowerCode.startsWith('lp')) return 'LP';
        if (lowerCode.startsWith('jh')) return 'Hardie';
        if (lowerCode.startsWith('vin') || lowerCode.startsWith('rollex')) return 'Vinyl';
    }
    return null;
}

export function convertMaterialList(
    sourceItems: ParsedItem[],
    targetType: SidingType
): ConversionResult[] {
    return sourceItems.map(sourceItem => {
        const lowerCode = sourceItem.itemCode.toLowerCase();

        // Find matching row in ITEM_CODES
        const row = ITEM_CODES.find(entry => {
            return Object.values(entry.itemCodes).some(code => code?.toLowerCase() === lowerCode);
        });

        // If no match found in our master table, we still want to preserve it
        if (!row) {
            return {
                sourceItem,
                targetItem: {
                    ...sourceItem,
                    itemCode: `[REVIEW] ${sourceItem.itemCode}`,
                    description: `[UNMATCHED] ${sourceItem.description}`
                },
                isMatched: false
            };
        }

        const targetCode = row.itemCodes[targetType];
        const isActive = row.activeFor.includes(targetType);

        if (!targetCode || !isActive) {
            return {
                sourceItem,
                targetItem: {
                    ...sourceItem,
                    itemCode: `[NO-BRAND-PARITY] ${sourceItem.itemCode}`,
                    description: `[UNMATCHED] ${row.description}`
                },
                isMatched: false
            };
        }

        return {
            sourceItem,
            targetItem: {
                itemCode: targetCode,
                description: row.description,
                quantity: sourceItem.quantity,
                uom: row.uom
            },
            isMatched: true
        };
    });
}
