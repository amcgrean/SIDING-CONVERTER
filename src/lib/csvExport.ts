import { ParsedItem } from './converter';

export function generateERPCsv(
    items: (ParsedItem | { itemCode: string, description: string, quantity: number, uom: string })[],
    jobNumber: string = '',
    branch: string = ''
): string {
    const headers = ['ItemCode', 'Description', 'Quantity', 'UOM', 'JobNumber', 'Branch'];
    const rows = items.map(item => [
        item.itemCode,
        item.description,
        item.quantity.toString(),
        item.uom,
        jobNumber,
        branch
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return csvContent;
}

export function downloadCsv(content: string, filename: string) {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
