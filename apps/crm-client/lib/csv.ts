import { toast } from 'react-toastify';

/**
 * Client-side CSV export utility.
 * Formats lead data correctly and handles proper escaping for CSV format.
 */

export interface LeadExportData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  priority?: string;
  status?: string;
  tags?: string[] | string;
  lastSeen?: string;
  'next date'?: string;
  [key: string]: any;
}

/**
 * Escapes a single CSV value to follow standard RFC 4180 CSV specifications.
 */
function escapeCsvValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  let str = '';
  if (Array.isArray(value)) {
    str = value.join(', ');
  } else {
    str = String(value);
  }

  // If value contains quotes, commas, or newlines, escape it by wrapping in quotes
  // and duplicating existing double-quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Exports an array of lead objects to a CSV file and triggers a browser download.
 */
export function exportLeadsToCsv(leads: LeadExportData[], filename = 'leads_export.csv') {
  if (!leads || leads.length === 0) {
    toast.error('No lead data available to export.');
    return;
  }

  // Define headers and their corresponding data keys
  const headers = [
    { label: 'Customer Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'Company', key: 'company' },
    { label: 'Priority', key: 'priority' },
    { label: 'Status', key: 'status' },
    { label: 'Tags', key: 'tags' },
    { label: 'Last Contact', key: 'lastSeen' },
    { label: 'Next Follow Up', key: 'next date' }
  ];

  // Create CSV Header row
  const headerRow = headers.map(h => escapeCsvValue(h.label)).join(',');

  // Create CSV data rows
  const dataRows = leads.map(lead => {
    return headers.map(h => {
      let val = lead[h.key];

      // Format dates nicely
      if ((h.key === 'lastSeen' || h.key === 'next date') && val && val !== '-') {
        try {
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            val = date.toLocaleDateString();
          }
        } catch (e) {
          // Keep raw value if parsing fails
        }
      }

      return escapeCsvValue(val);
    }).join(',');
  });

  // Combine into single string with newline characters
  const csvContent = [headerRow, ...dataRows].join('\r\n');

  // Create Blob and trigger download
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Normalizes column headers to map to standard lead property keys.
 */
function normalizeHeaderKey(key: string): string {
  const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (cleanKey === 'customername' || cleanKey === 'name' || cleanKey === 'fullname' || cleanKey === 'customer') {
    return 'name';
  }
  if (cleanKey === 'email' || cleanKey === 'emailaddress') {
    return 'email';
  }
  if (cleanKey === 'phone' || cleanKey === 'phonenumber' || cleanKey === 'mobile') {
    return 'phone';
  }
  if (cleanKey === 'company' || cleanKey === 'organization' || cleanKey === 'employer') {
    return 'company';
  }
  if (cleanKey === 'priority') {
    return 'priority';
  }
  if (cleanKey === 'status') {
    return 'status';
  }
  if (cleanKey === 'tags' || cleanKey === 'tag') {
    return 'tags';
  }
  if (cleanKey === 'lastcontact' || cleanKey === 'lastcontactdate' || cleanKey === 'lastseen') {
    return 'lastSeen';
  }
  if (cleanKey === 'nextfollowupdate' || cleanKey === 'nextdate' || cleanKey === 'followupdate') {
    return 'next date';
  }
  return cleanKey;
}

/**
 * Parses a single CSV line into cells, respecting quotes, escaped double quotes, and commas.
 */
function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',') {
      if (inQuotes) {
        cell += char;
      } else {
        cells.push(cell.trim());
        cell = '';
      }
    } else {
      cell += char;
    }
  }
  cells.push(cell.trim());
  return cells;
}

/**
 * Parses raw CSV string data into an array of normalized key-value objects.
 */
export function parseCsvText(csvText: string): Record<string, any>[] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentLine += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === '\n' || char === '\r') {
      if (inQuotes) {
        currentLine += char;
      } else {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip next character
        }
        lines.push(currentLine);
        currentLine = '';
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length < 2) {
    return [];
  }

  // Parse headers and normalize keys
  const firstLine = lines[0] || '';
  const rawHeaders = parseCsvLine(firstLine);
  const headers = rawHeaders.map(h => normalizeHeaderKey(h));

  const results: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const lineText = lines[i] || '';
    const line = lineText.trim();
    if (!line) continue;

    const values = parseCsvLine(lineText);
    const record: Record<string, any> = {};

    headers.forEach((header, index) => {
      if (header) {
        let val: any = values[index] || '';

        // Handle tags specially (convert comma-separated string to array)
        if (header === 'tags') {
          val = val ? val.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
        }

        record[header] = val;
      }
    });

    results.push(record);
  }

  return results;
}
