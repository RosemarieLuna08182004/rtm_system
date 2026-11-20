/**
 * Reads term / sub term rows from an Excel (.xlsx) or CSV file, and builds the
 * import template. ExcelJS is large, so it is only loaded when one of these runs.
 *
 * Sheets are recognised by their column headers, not their names:
 *  - Terms:     Volume, Term, Focus (optional)
 *  - Sub Terms: Volume, Term, Category, Title (optional), Description
 */

export interface SheetTermRow { Row: number; Volume: string; Term: string; Focus: string }
export interface SheetSubTermRow { Row: number; Volume: string; Term: string; Category: string; Title: string; Description: string }
export interface SheetRows { Terms: SheetTermRow[]; SubTerms: SheetSubTermRow[] }

export const MAX_IMPORT_ROWS = 1000;
export const MAX_SHEET_FILE_SIZE = 5 * 1024 * 1024;

type Field = 'Volume' | 'Term' | 'Focus' | 'Category' | 'Title' | 'Description';
const HEADER_ALIASES: Record<string, Field> = {
    volume: 'Volume', volumetitle: 'Volume', chapter: 'Volume',
    term: 'Term', termname: 'Term',
    focus: 'Focus',
    category: 'Category',
    title: 'Title', subterm: 'Title', subtermtitle: 'Title',
    description: 'Description', content: 'Description',
};
const headerField = (header: string): Field | undefined => HEADER_ALIASES[header.toLowerCase().replace(/[^a-z]/g, '')];

/** Turns a grid of cells (first row = headers) into term or sub term rows; null if the headers fit neither. */
const readGrid = (grid: Array<{ Row: number; Cells: string[] }>, into: SheetRows) => {
    const [header, ...body] = grid;
    if (!header) return false;
    const columns = new Map<Field, number>();
    header.Cells.forEach((cell, index) => {
        const field = headerField(cell);
        if (field && !columns.has(field)) columns.set(field, index);
    });
    const get = (cells: string[], field: Field) => (columns.has(field) ? (cells[columns.get(field)!] ?? '').trim() : '');
    const isSubTerms = columns.has('Volume') && columns.has('Term') && columns.has('Category') && columns.has('Description');
    const isTerms = !isSubTerms && columns.has('Volume') && columns.has('Term');
    if (!isSubTerms && !isTerms) return false;

    body.forEach(({ Row, Cells }) => {
        if (Cells.every(cell => !cell.trim())) return; // blank row
        if (isSubTerms) into.SubTerms.push({ Row, Volume: get(Cells, 'Volume'), Term: get(Cells, 'Term'), Category: get(Cells, 'Category'), Title: get(Cells, 'Title'), Description: get(Cells, 'Description') });
        else into.Terms.push({ Row, Volume: get(Cells, 'Volume'), Term: get(Cells, 'Term'), Focus: get(Cells, 'Focus') });
    });
    return true;
};

/** Minimal CSV reader: commas or semicolons, quoted fields, doubled quotes, line breaks inside quotes. */
const parseCsv = (text: string): string[][] => {
    // Drop the byte-order mark (code 0xFEFF) that Excel adds to the start of CSV files
    const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
    const firstLine = source.split(/\r?\n/, 1)[0] ?? '';
    const delimiter = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';
    const rows: string[][] = [];
    let row: string[] = [], field = '', quoted = false;
    for (let i = 0; i < source.length; i++) {
        const ch = source[i];
        if (quoted) {
            if (ch === '"' && source[i + 1] === '"') { field += '"'; i++; }
            else if (ch === '"') quoted = false;
            else field += ch;
        } else if (ch === '"' && field === '') quoted = true;
        else if (ch === delimiter) { row.push(field); field = ''; }
        else if (ch === '\n' || ch === '\r') {
            if (ch === '\r' && source[i + 1] === '\n') i++;
            row.push(field); rows.push(row); row = []; field = '';
        } else field += ch;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
};

const loadExcelJS = async () => (await import('exceljs')).default;

/** Reads a .xlsx or .csv file. Throws an Error with a readable message if it can't be used. */
export const readImportFile = async (file: File): Promise<SheetRows> => {
    const name = file.name.toLowerCase();
    const rows: SheetRows = { Terms: [], SubTerms: [] };

    if (name.endsWith('.csv')) {
        const grid = parseCsv(await file.text()).map((Cells, index) => ({ Row: index + 1, Cells }));
        if (!readGrid(grid, rows))
            throw new Error('The first row must have the column names: Volume, Term (and Focus) for terms, or Volume, Term, Category, Title, Description for sub terms.');
    } else if (name.endsWith('.xlsx')) {
        const ExcelJS = await loadExcelJS();
        const workbook = new ExcelJS.Workbook();
        try { await workbook.xlsx.load(await file.arrayBuffer()); }
        catch { throw new Error("This file couldn't be opened as an Excel workbook. Save it as .xlsx and try again."); }
        let recognised = 0;
        workbook.eachSheet(sheet => {
            const grid: Array<{ Row: number; Cells: string[] }> = [];
            sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                const Cells: string[] = [];
                row.eachCell({ includeEmpty: true }, (cell, col) => { Cells[col - 1] = cell.text ?? ''; });
                grid.push({ Row: rowNumber, Cells: Array.from(Cells, c => c ?? '') });
            });
            if (readGrid(grid, rows)) recognised++;
        });
        if (!recognised)
            throw new Error('No sheet with the expected columns was found. Use the template: a "Terms" sheet (Volume, Term, Focus) and/or a "Sub Terms" sheet (Volume, Term, Category, Title, Description).');
    } else if (name.endsWith('.xls')) {
        throw new Error('Old .xls files aren\'t supported. In Excel choose File › Save As › Excel Workbook (.xlsx).');
    } else {
        throw new Error('Please choose an Excel (.xlsx) or CSV (.csv) file.');
    }
    return rows;
};

/**
 * Builds the template workbook. Volume and Category cells get drop-down lists of
 * the current names, so they can be picked rather than typed.
 */
export const buildImportTemplate = async (volumes: string[], categories: string[]) => {
    const ExcelJS = await loadExcelJS();
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'RTM';

    const readMe = workbook.addWorksheet('Read me');
    readMe.getColumn(1).width = 110;
    [
        'How to fill in this template',
        '',
        '1. "Terms" sheet: one row per new term. Pick its volume, type the term, and optionally a focus.',
        '2. "Sub Terms" sheet: one row per sub term (Brief Definition, Etymology, ...). Volume + Term say which term it belongs to;',
        '    the term can already exist in RTM or be on the Terms sheet of this file.',
        '3. Volume and Category have drop-down lists of the names currently in RTM. Names must match exactly (capital letters don\'t matter).',
        '4. Description: plain text. Each line becomes its own paragraph.',
        '5. Terms that already exist in that volume, and sub terms identical to an existing one, are skipped, never duplicated.',
        '6. Term and sub term titles may only contain letters, spaces and . , \' - / ( )',
        '7. Up to 1,000 rows per file. You can leave either sheet empty, or delete it.',
        '',
        'Example (Terms):      Volume = Skeletal System, Term = Mandible, Focus = Lower jaw',
        'Example (Sub Terms):  Volume = Skeletal System, Term = Mandible, Category = Brief Definition, Title = (empty), Description = The bone of the lower jaw.',
        '',
        'You can delete this sheet; it is ignored during import.',
    ].forEach((line, index) => {
        const cell = readMe.getCell(index + 1, 1);
        cell.value = line;
        if (index === 0) cell.font = { bold: true, size: 14 };
    });

    const lists = workbook.addWorksheet('Lists');
    lists.getCell('A1').value = 'Volumes';
    lists.getCell('B1').value = 'Categories';
    volumes.forEach((v, i) => { lists.getCell(i + 2, 1).value = v; });
    categories.forEach((c, i) => { lists.getCell(i + 2, 2).value = c; });
    lists.getRow(1).font = { bold: true };
    lists.getColumn(1).width = 35;
    lists.getColumn(2).width = 30;

    const addSheet = (name: string, columns: Array<{ header: string; width: number }>) => {
        const sheet = workbook.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
        sheet.columns = columns.map(c => ({ header: c.header, width: c.width }));
        const header = sheet.getRow(1);
        header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3949AB' } };
        return sheet;
    };
    const dropDown = (sheet: ReturnType<typeof addSheet>, column: number, listColumn: 'A' | 'B', count: number, what: string) => {
        if (!count) return;
        for (let row = 2; row <= MAX_IMPORT_ROWS + 1; row++) {
            sheet.getCell(row, column).dataValidation = {
                type: 'list', allowBlank: true, formulae: [`Lists!$${listColumn}$2:$${listColumn}$${count + 1}`],
                showErrorMessage: true, errorStyle: 'warning', errorTitle: `Unknown ${what}`, error: `Pick a ${what} from the list, or it won't be imported.`,
            };
        }
    };

    const terms = addSheet('Terms', [{ header: 'Volume', width: 30 }, { header: 'Term', width: 30 }, { header: 'Focus', width: 40 }]);
    dropDown(terms, 1, 'A', volumes.length, 'volume');

    const subTerms = addSheet('Sub Terms', [
        { header: 'Volume', width: 30 }, { header: 'Term', width: 30 }, { header: 'Category', width: 24 },
        { header: 'Title', width: 28 }, { header: 'Description', width: 80 },
    ]);
    dropDown(subTerms, 1, 'A', volumes.length, 'volume');
    dropDown(subTerms, 3, 'B', categories.length, 'category');
    subTerms.getColumn(5).alignment = { wrapText: true, vertical: 'top' };

    // Open on the Terms sheet
    workbook.views = [{ x: 0, y: 0, width: 20000, height: 12000, firstSheet: 0, activeTab: 2, visibility: 'visible' }];

    return workbook.xlsx.writeBuffer();
};

/** Builds the template and saves it as rtm-import-template.xlsx. */
export const downloadImportTemplate = async (volumes: string[], categories: string[]) => {
    const buffer = await buildImportTemplate(volumes, categories);
    const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rtm-import-template.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
