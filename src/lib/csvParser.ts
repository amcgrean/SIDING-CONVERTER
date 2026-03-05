import Papa from 'papaparse';
import { ParsedItem } from './converter';

export function parseInputCsv(csvText: string): ParsedItem[] {
    const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase()
    });

    const items: ParsedItem[] = [];

    for (const row of result.data as any[]) {
        const itemCode = row.itemcode || row.code || Object.values(row)[0];
        const quantity = parseFloat(row.quantity || row.qty || '0');
        const description = row.description || row.desc || '';
        const uom = row.uom || 'Each';

        if (itemCode && !isNaN(quantity)) {
            items.push({
                itemCode: itemCode.toString().trim(),
                description: description.toString().trim(),
                quantity,
                uom: uom.toString().trim()
            });
        }
    }

    return items;
}
