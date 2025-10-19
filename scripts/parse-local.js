#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function extractEmail(text) {
    const m = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
    return m ? m[0] : "";
}

function extractPhone(text) {
    const m = text.match(/\+?\d[\d\-\s()]{7,}\d/);
    return m ? m[0] : "";
}

function extractName(text) {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return "";
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
        const l = lines[i];
        if (/\d/.test(l)) continue;
        if (/[@]/.test(l)) continue;
        if (l.split(" ").length <= 6) return l;
    }
    return lines[0];
}

function extractMajor(text) {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
        const m = line.match(/(?:Major|Degree|Field of Study)[:\-\s]+(.+)/i);
        if (m && m[1]) return m[1].replace(/\.$/, '').trim();
    }
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

function extractYear(text) {
    const m = text.match(/\b(19|20)\d{2}\b/g);
    if (!m) return "";
    const candidates = m;
    for (const c of candidates) {
        const idx = text.indexOf(c);
        const before = text.slice(Math.max(0, idx - 50), idx).toLowerCase();
        if (before.includes('class of') || before.includes('graduat') || before.includes('expected')) return c;
    }
    return candidates[0];
}

function extractPersonalStatement(text) {
    const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const keywords = ['objective', 'summary', 'research', 'interest', 'profile', 'statement', 'experience'];
    for (const p of paras) {
        const low = p.toLowerCase();
        for (const k of keywords) if (low.includes(k) && p.length > 50) return p.slice(0, 2000);
    }
    let longest = "";
    for (const p of paras) {
        if (p.length > longest.length && p.length > 80 && p.length < 2000) longest = p;
    }
    return longest;
}

async function run() {
    const argv = process.argv.slice(2);
    if (argv.length === 0) {
        console.error('Usage: node scripts/parse-local.js <file>');
        process.exit(2);
    }
    const filePath = path.resolve(argv[0]);
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(2);
    }

    const data = fs.readFileSync(filePath);
    let text = '';
    try {
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(data);
        text = pdfData && pdfData.text ? pdfData.text : data.toString('utf8');
    } catch (e) {
        // fallback to text
        text = data.toString('utf8');
    }

    const email = extractEmail(text);
    const phone = extractPhone(text);
    const fullName = extractName(text);
    const major = extractMajor(text);
    const year = extractYear(text);
    const personalStatement = extractPersonalStatement(text);

    console.log('--- Parsed ---');
    console.log('Full name:', fullName);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Major:', major);
    console.log('Graduation year:', year);
    console.log('Personal statement (excerpt):', personalStatement.slice(0, 400));
    console.log('\n--- Raw text excerpt ---\n');
    console.log(text.slice(0, 2000));
}

run().catch(err => { console.error(err); process.exit(1); });
