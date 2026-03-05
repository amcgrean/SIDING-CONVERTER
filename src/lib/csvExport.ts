import { CalculationResult } from './calculator';

export function generateERPCsv(
    items: CalculationResult[],
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
