const text = `Jane Doe
Email: janedoe@uw.edu netID: janedoe Ph: (123)-456-7890
Education
University of Washington- Seattle grad year: 2027 
Major: Computer Science GPA: 4.0/4.0 
Objective
Inspired Software engineering student interested in making an impact on the world by bridging the gap between cutting edge deep learning technology and problem spaces in the real world, that affect us all. I want to use my knowledge in tech to pay it forward and make sure the technology we create makes the world a place where we live in harmony
Experiences
Software Intern June – August 2026
AWS
• Created software to optimize AWS functioning by 300
`;

function extractEmail(text) {
    const m = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
    return m ? m[0] : "";
}

function extractPhone(text) {
    const m = text.match(/(?:\+?\d{1,3}[\-\.\s])?(?:\(?\d{3}\)?[\-\.\s])?\d{3}[\-\.\s]?\d{4}/);
    return m ? m[0].trim() : "";
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
        if (m && m[1]) return m[1].replace(/\.$/, '').replace(/GPA[:\s].*$/i, '').trim();
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
    const lower = text.toLowerCase();
    const headings = ['objective', 'summary', 'personal statement', 'profile'];
    for (const h of headings) {
        const idx = lower.indexOf('\n' + h + '\n');
        if (idx >= 0) {
            const after = text.slice(idx + h.length + 2).trim();
            const paras = after.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
            if (paras.length > 0 && paras[0].length > 30) return paras[0].slice(0, 2000);
        }
    }

    const keywords = ['objective', 'summary', 'research', 'interest', 'profile', 'statement'];
    const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    for (const p of paras) {
        const lowp = p.toLowerCase();
        for (const k of keywords) if (lowp.includes(k) && p.length > 50) return p.slice(0, 2000);
    }

    let longest = "";
    for (const p of paras) {
        if (p.length > longest.length && p.length > 80 && p.length < 2000) longest = p;
    }
    return longest;
}

const parsed = {
    fullName: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    major: extractMajor(text),
    year: extractYear(text),
    personalStatement: extractPersonalStatement(text),
    rawText: text.slice(0, 2000),
};

console.log(JSON.stringify(parsed, null, 2));
