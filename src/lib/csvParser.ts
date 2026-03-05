import Papa from 'papaparse';
import { ParsedItem } from './converter';

/**
 * Expanded synonyms for CSV headers
 */
const HEADERS = {
    itemCode: ['item', 'sku', 'itemcode', 'code', 'part number', 'part #', 'product'],
    quantity: ['ordered qty', 'qty', 'qty ordered', 'quantity', 'count', 'amount', 'ordered'],
    description: ['description', 'desc', 'item description', 'product description'],
    uom: ['uom', 'unit', 'unit of measure']
};

export function parseInputCsv(csvText: string): ParsedItem[] {
    // First, try standard CSV parsing
    const result = Papa.parse(csvText.trim(), {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase()
    });

    const items: ParsedItem[] = [];

    if (result.data.length > 0) {
        for (const row of result.data as any[]) {
            // Find the best match for each field based on synonyms
            const getVal = (fields: string[]) => {
                const key = Object.keys(row).find(k => fields.includes(k));
                return key ? row[key] : null;
            };

            const itemCode = getVal(HEADERS.itemCode) || Object.values(row)[0];
            const quantityStr = getVal(HEADERS.quantity);
            const quantity = quantityStr ? parseFloat(quantityStr.toString().replace(/,/g, '')) : NaN;
            const description = getVal(HEADERS.description) || '';
            const uom = getVal(HEADERS.uom) || 'Each';

            if (itemCode && !isNaN(quantity)) {
                items.push({
                    itemCode: itemCode.toString().trim(),
                    description: description.toString().trim(),
                    quantity,
                    uom: uom.toString().trim()
                });
            }
        }
    }

    // If standard parsing yielded no items, or very few, try heuristic parsing
    if (items.length === 0) {
        return parseHeuristicText(csvText);
    }

    return items;
}

/**
 * Tries to extract items from messy text (PDF text, non-comma lists)
 * using regular expressions for SKUs and Quantities.
 */
export function parseHeuristicText(text: string): ParsedItem[] {
    const items: ParsedItem[] = [];
    const lines = text.split(/\r?\n/);

    // Patterns for SKUs: lp..., jh..., vin..., rollex...
    const skuPattern = /\b(lp|jh|vin|rollex)[a-z0-9-]+\b/gi;
    // Pattern for quantity: looks for numbers near SKUs or in specific columns
    // This is a broad approach: we look for a SKU then look for a number on the same line

    for (const line of lines) {
        const skuMatches = line.match(skuPattern);
        if (!skuMatches) continue;

        for (const sku of skuMatches) {
            // Find numbers in the line that aren't the SKU itself
            // Specifically look for patterns like "10.000", "55", etc.
            const cleanedLine = line.replace(sku, ' [SKU] ');
            const numMatches = cleanedLine.match(/\b\d+(\.\d+)?\b/g);

            let quantity = 0;
            if (numMatches) {
                // Take the first number that isn't trivially 0 or the SKU
                // In many quotes, quantity comes before or after SKU
                quantity = parseFloat(numMatches[0]);
            }

            items.push({
                itemCode: sku,
                description: "Heuristic Match",
                quantity: quantity || 0,
                uom: "Each"
            });
        }
    }

    return items;
}
