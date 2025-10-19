import { RequestHandler } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
// No external exec needed when OCR is disabled

const upload = multer({ dest: path.join(process.cwd(), "tmp") });

function isLikelyBinary(s: string) {
    if (!s) return false;
    const len = s.length;
    let nonPrintable = 0;
    for (let i = 0; i < len; i++) {
        const code = s.charCodeAt(i);
        if (code === 9 || code === 10 || code === 13) continue; // allow tab/newline/carriage
        if (code < 32 || code === 127) nonPrintable++;
    }
    return len > 0 && nonPrintable / len > 0.2; // >20% non-printable bytes
}

function extractEmail(text: string) {
    const m = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
    return m ? m[0] : "";
}

function extractPhone(text: string) {
    // Match common US phone formats, with optional country code and parentheses
    const m = text.match(/(?:\+?\d{1,3}[\-\.\s])?(?:\(?\d{3}\)?[\-\.\s])?\d{3}[\-\.\s]?\d{4}/);
    return m ? m[0].trim() : "";
}

function extractName(text: string) {
    // conservative: scan the first several lines and pick a short, name-like line
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return "";
    const maxInspect = Math.min(lines.length, 12);
    for (let i = 0; i < maxInspect; i++) {
        const l = lines[i];
        if (!l) continue;
        // skip obvious non-name lines
        if (/\d/.test(l)) continue;
        if (/[@]/.test(l)) continue;
        if (/\b(street|avenue|ave|road|rd|lane|ln|apt|suite|email|phone|www|http|www\.|pdf)\b/i.test(l)) continue;
        const words = l.split(/\s+/).filter(Boolean);
        if (words.length === 0) continue;
        if (words.length > 6) continue; // too many words for a name
        if (l.length > 80) continue; // too long
        const punctCount = (l.match(/[.,:;()\[\]\/\\]/g) || []).length;
        if (punctCount > 3) continue;
        // require at least one capitalized word (simple heuristic)
        const capWords = words.filter(w => /^[A-Z][a-z\-']+$/.test(w));
        if (capWords.length >= 1) return l.slice(0, 80);
        // allow all-caps names (e.g., JOHN DOE)
        const allCaps = words.filter(w => /^[A-Z\-']+$/.test(w));
        if (allCaps.length >= 1 && l.length < 40) return l.slice(0, 80);
    }

    // fallback: try to derive a name from an email address in the document
    const emailMatch = text.match(/\b([A-Z0-9._%+-]+)@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
    if (emailMatch && emailMatch[1]) {
        const local = emailMatch[1].replace(/[._]/g, ' ');
        const parts = local.split(/\s+/).map(p => p.replace(/[^a-zA-Z\-']/g, ''))
            .filter(Boolean)
            .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
        if (parts.length >= 1) return parts.slice(0, 3).join(' ');
    }

    return "";
}

function extractMajor(text: string) {
    // Try to find lines that indicate major or degree
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
        const m = line.match(/(?:Major|Degree|Field of Study)[:\-\s]+(.+)/i);
        if (m && m[1]) return m[1].replace(/\.$/, '').replace(/GPA[:\s].*$/i, '').trim();
    }

    // Fallback: look for common major keywords
    const majors = [
        "computer science",
        "computer engineering",
        "electrical engineering",
        "mechanical engineering",
        "biology",
        "chemistry",
        "physics",
        "mathematics",
        "economics",
        "business",
        "finance",
        "psychology",
        "data science",
        "statistics",
        "information technology",
    ];

    const lower = text.toLowerCase();
    for (const m of majors) {
        if (lower.includes(m)) return m.split(' ').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ');
    }

    return "";
}

function extractYear(text: string) {
    // Find 4-digit years between 1900 and 2099
    const m = text.match(/\b(19|20)\d{2}\b/g);
    if (!m) return "";
    // prefer years that are near words like Graduat or Class
    const candidates = m;
    for (const c of candidates) {
        const idx = text.indexOf(c);
        const before = text.slice(Math.max(0, idx - 50), idx).toLowerCase();
        if (before.includes('class of') || before.includes('graduat') || before.includes('expected')) return c;
    }
    return candidates[0];
}

function extractPersonalStatement(text: string) {
    // Split into paragraphs and pick one that likely looks like a personal statement
    // Prefer an explicit "Objective" or "Summary" section: find heading and return the paragraph after it
    const lower = text.toLowerCase();
    const headings = ['objective', 'summary', 'personal statement', 'profile'];
    for (const h of headings) {
        const idx = lower.indexOf('\n' + h + '\n');
        if (idx >= 0) {
            // get substring after heading
            const after = text.slice(idx + h.length + 2).trim();
            const paras = after.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
            if (paras.length > 0 && paras[0].length > 30) return paras[0].slice(0, 2000);
        }
    }

    // Keywords that indicate summary/objective
    const keywords = ['objective', 'summary', 'research', 'interest', 'profile', 'statement'];
    const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    for (const p of paras) {
        const lowp = p.toLowerCase();
        for (const k of keywords) if (lowp.includes(k) && p.length > 50) return p.slice(0, 2000);
    }

    // Fallback: pick a reasonably-sized paragraph (not the entire document)
    // prefer paragraphs between 80 and 1200 chars
    const totalLen = text.length || 1;
    const candidates = paras.filter(p => {
        // ignore paragraphs that are almost the entire document
        if (p.length / totalLen > 0.5) return false;
        return p.length >= 80 && p.length <= 1200 && p.split(/\s+/).length < 300;
    });
    if (candidates.length > 0) return candidates[0].slice(0, 1000);

    // otherwise pick the first paragraph that looks sentence-like
    for (const p of paras) {
        if (p.length > 80 && /[\.\!\?]/.test(p) && p.split(/\s+/).length < 500 && p.length / totalLen <= 0.5) {
            // sanitize: remove emails, phones, and years and drop contact-like lines
            const lines = p.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            const cleanedLines = lines.filter(l => {
                if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(l)) return false;
                if (/(?:\+?\d{1,3}[\-\.\s])?(?:\(?\d{3}\)?[\-\.\s])?\d{3}[\-\.\s]?\d{4}/.test(l)) return false;
                if (/\b(19|20)\d{2}\b/.test(l) && l.length < 30) return false; // short line that's just a year
                return true;
            });
            let stmt = cleanedLines.join(' ');
            // remove any remaining inline emails/phones/years
            stmt = stmt.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '');
            stmt = stmt.replace(/(?:\+?\d{1,3}[\-\.\s])?(?:\(?\d{3}\)?[\-\.\s])?\d{3}[\-\.\s]?\d{4}/g, '');
            stmt = stmt.replace(/\b(19|20)\d{2}\b/g, '');
            stmt = stmt.replace(/\s{2,}/g, ' ').trim();
            if (stmt.length > 30) return stmt.slice(0, 1000);
        }
    }

    // last resort: return empty string rather than the whole resume
    return "";
}

export const parseResume: RequestHandler = upload.single("file") as any;

// wrap handler to use multer middleware
export const handleParse: RequestHandler = async (req, res) => {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ error: "file required" });

    try {
        const data = fs.readFileSync(file.path);
        let text = "";
        let parsingMethod: 'pdf-parse' | 'none' = 'none';
        try {
            // Dynamically import pdf-parse at request time to avoid loading it during Vite config parsing
            const pdfModule = await import("pdf-parse");
            const pdfFn = (pdfModule && (pdfModule.default || pdfModule)) as any;
            const pdfData = await pdfFn(data);
            // ONLY accept pdf-parse extracted text. Do not attempt to interpret the raw PDF bytes as UTF-8
            text = pdfData && pdfData.text ? pdfData.text : "";
            if (text && text.trim().length > 0) parsingMethod = 'pdf-parse';
        } catch (e) {
            // If pdf-parse itself errors, don't try OCR or convert the raw buffer to text (this produces PDF object garbage).
            text = "";
        }

        // If extracted text is very short or looks like binary, try OCR fallback using pdftoppm -> tesseract.js
        let ocrUsed = false;
        let ocrError: string | null = null;
        if (!text || text.trim().length < 100 || isLikelyBinary(text)) {
            try {
                const pdftoppmPath = execSync("which pdftoppm || true").toString().trim();
                if (pdftoppmPath) {
                    const tmpDir = path.join(process.cwd(), "tmp", `ocr-${Date.now()}`);
                    fs.mkdirSync(tmpDir, { recursive: true });
                    const pdfPath = path.join(tmpDir, path.basename(file.path) + ".pdf");
                    fs.writeFileSync(pdfPath, data);

                    // convert PDF pages to PNG images
                    execSync(`pdftoppm -png ${pdfPath} ${path.join(tmpDir, 'page')}`);

                    try {
                        const tesseract = await import('tesseract.js');
                        const { createWorker } = tesseract as any;
                        const worker = createWorker({ logger: () => { } });
                        await worker.load();
                        await worker.loadLanguage('eng');
                        await worker.initialize('eng');

                        const pngFiles = fs.readdirSync(tmpDir).filter(f => f.endsWith('.png')).sort();
                        let ocrText = '';
                        for (const p of pngFiles) {
                            const imgPath = path.join(tmpDir, p);
                            const { data: { text: pageText } } = await worker.recognize(imgPath) as any;
                            ocrText += '\n' + (pageText || '');
                        }

                        await worker.terminate();

                        // cleanup tmpDir files
                        for (const f of fs.readdirSync(tmpDir)) try { fs.unlinkSync(path.join(tmpDir, f)); } catch { }
                        try { fs.rmdirSync(tmpDir); } catch { }

                        if (ocrText && ocrText.trim().length > 50) {
                            text = ocrText;
                            parsingMethod = 'ocr' as any;
                            ocrUsed = true;
                        }
                    } catch (ocrErr) {
                        console.warn('OCR fallback failed:', ocrErr && (ocrErr as any).message ? (ocrErr as any).message : ocrErr);
                        ocrError = (ocrErr && (ocrErr as any).message) ? String((ocrErr as any).message) : String(ocrErr);
                    }
                }
            } catch (err) {
                // if pdftoppm isn't available or conversion failed, record error and continue to final check
                console.warn('pdftoppm conversion failed', err && (err as any).message ? (err as any).message : err);
            }
        }

        // If still no usable text, return a helpful client-visible error rather than binary
        if (!text || text.trim().length < 50 || isLikelyBinary(text)) {
            try { fs.unlinkSync(file.path); } catch { }
            return res.status(422).json({ error: 'no_text_extracted', message: 'Could not extract readable text from the uploaded file. Please upload a searchable PDF (not a scanned image) or try a different file.', parsingMethod, ocrUsed, ocrError });
        }

        const email = extractEmail(text);
        const phone = extractPhone(text);
        const fullName = extractName(text);
        const major = extractMajor(text);
        const year = extractYear(text);
        const personalStatement = extractPersonalStatement(text);

        // Derive UW NetID from email if possible (local part for uw.edu)
        let uwNetId = "";
        if (email && /@(uw\.edu|washington\.edu)$/i.test(email)) {
            uwNetId = email.split('@')[0];
        }

        // cleanup
        fs.unlinkSync(file.path);

        console.log('parse method=', parsingMethod, 'uwNetId=', uwNetId);
        return res.json({ fullName, email, phone, major, year, personalStatement, uwNetId, rawText: text.slice(0, 2000), parsingMethod });
    } catch (err) {
        console.error(err);
        try { fs.unlinkSync(file.path); } catch { };
        return res.status(500).json({ error: "failed to parse" });
    }
};

// Accept raw extracted text (from client-side pdf.js) and run heuristics server-side
export const handleParseText: RequestHandler = async (req, res) => {
    try {
        const { text } = req.body as { text?: string };
        if (!text || typeof text !== 'string' || text.trim().length < 20) return res.status(400).json({ error: 'text_required' });

        const email = extractEmail(text);
        const phone = extractPhone(text);
        const fullName = extractName(text);
        const major = extractMajor(text);
        const year = extractYear(text);
        const personalStatement = extractPersonalStatement(text);

        let uwNetId = "";
        if (email && /@(uw\.edu|washington\.edu)$/i.test(email)) uwNetId = email.split('@')[0];

        return res.json({ fullName, email, phone, major, year, personalStatement, uwNetId, rawText: text.slice(0, 2000), parsingMethod: 'client-text' });
    } catch (err) {
        console.error('handleParseText error', err);
        return res.status(500).json({ error: 'failed' });
    }
}

export default { parseResume, handleParse, handleParseText };
