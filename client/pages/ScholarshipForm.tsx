import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ScholarshipForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        uwNetId: "",
        major: "",
        year: "",
        personalStatement: "",
    });
    const [parsedFieldsOpen, setParsedFieldsOpen] = useState(false);
    const [parsedSource, setParsedSource] = useState<any>(null);

    useEffect(() => {
        const parsed = (location.state as any)?.parsed;
        if (parsed) {
            setParsedSource(parsed);
            setForm((s) => ({
                ...s,
                fullName: parsed.fullName || s.fullName,
                email: parsed.email || s.email,
                uwNetId: parsed.uwNetId || s.uwNetId,
                major: parsed.major || s.major,
                year: parsed.year || s.year,
                // Prefer objective if available, else fallback to parsed.personalStatement
                personalStatement: parsed.objective || parsed.personalStatement || s.personalStatement,
            }));
        }
    }, [location.state]);

    function update<K extends keyof typeof form>(key: K, value: string) {
        setForm((s) => ({ ...s, [key]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Trigger confetti, then submit (mock) and navigate back to dashboard
        console.log("Scholarship application submitted:", form);
        launchConfetti();
        // show a short confirmation and navigate after confetti
        setTimeout(() => {
            alert("Application submitted!!");
            navigate("/dashboard");
        }, 1400);
    }

    // --- Confetti implementation (lightweight, no deps) ---
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const confettiRef = useRef<any>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        function handleResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            // stop any running animation
            if (confettiRef.current && confettiRef.current.raf) {
                cancelAnimationFrame(confettiRef.current.raf);
            }
        };
    }, []);

    function launchConfetti() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const pieces: Array<any> = [];
        const colors = ["#fde68a", "#fb7185", "#60a5fa", "#34d399", "#f97316"];
        const count = 80;

        for (let i = 0; i < count; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: -20 - Math.random() * 200,
                size: 6 + Math.random() * 8,
                tilt: Math.random() * 10,
                tiltSpeed: 0.05 + Math.random() * 0.1,
                vx: -2 + Math.random() * 4,
                vy: 2 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        let lastTime = performance.now();
        function frame(now: number) {
            const dt = now - lastTime;
            lastTime = now;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let p of pieces) {
                p.x += p.vx * (dt / 16);
                p.y += p.vy * (dt / 16);
                p.tilt += p.tiltSpeed * (dt / 16);

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.tilt);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            }

            // remove pieces that have fallen past the bottom
            for (let i = pieces.length - 1; i >= 0; i--) {
                if (pieces[i].y > canvas.height + 40) pieces.splice(i, 1);
            }

            if (pieces.length > 0) {
                confettiRef.current.raf = requestAnimationFrame(frame);
            } else {
                // clear canvas when done
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        // store confetti state and start animation
        confettiRef.current = { raf: requestAnimationFrame(frame) };
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            {/* confetti canvas overlays the whole screen but doesn't block clicks */}
            <canvas
                ref={canvasRef}
                className="pointer-events-none fixed inset-0 w-full h-full z-50"
            />

            <div className="w-full max-w-3xl bg-[rgba(31,27,27,0.9)] rounded-3xl p-6 text-white">
                <h1 className="text-2xl md:text-3xl font-kavoon mb-4">Mary Gates Research Scholarship</h1>
                <p className="mb-6 text-sm md:text-base">Please fill out the application below.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Parsed fields editor */}
                    <div className="mb-2">
                        <button
                            type="button"
                            onClick={() => setParsedFieldsOpen((v) => !v)}
                            className="text-sm text-husky-green underline"
                        >
                            {parsedFieldsOpen ? "Hide parsed fields" : "Edit parsed fields"}
                        </button>
                    </div>

                    {parsedFieldsOpen && parsedSource && (
                        <div className="bg-white/5 p-3 rounded space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <label className="flex flex-col">
                                    <span className="text-xs text-gray-300">Parsed full name</span>
                                    <input
                                        value={form.fullName}
                                        onChange={(e) => update("fullName", e.target.value)}
                                        className="mt-1 p-1 rounded bg-white/10 border border-white/10 text-sm"
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-xs text-gray-300">Parsed email</span>
                                    <input
                                        value={form.email}
                                        onChange={(e) => update("email", e.target.value)}
                                        className="mt-1 p-1 rounded bg-white/10 border border-white/10 text-sm"
                                    />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <label className="flex flex-col">
                                    <span className="text-xs text-gray-300">Parsed UW NetID</span>
                                    <input
                                        value={form.uwNetId}
                                        onChange={(e) => update("uwNetId", e.target.value)}
                                        className="mt-1 p-1 rounded bg-white/10 border border-white/10 text-sm"
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-xs text-gray-300">Parsed major</span>
                                    <input
                                        value={form.major}
                                        onChange={(e) => update("major", e.target.value)}
                                        className="mt-1 p-1 rounded bg-white/10 border border-white/10 text-sm"
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-xs text-gray-300">Parsed graduation year</span>
                                    <input
                                        value={form.year}
                                        onChange={(e) => update("year", e.target.value)}
                                        className="mt-1 p-1 rounded bg-white/10 border border-white/10 text-sm"
                                    />
                                </label>
                            </div>

                            <label className="flex flex-col">
                                <span className="text-xs text-gray-300">Parsed objective / statement</span>
                                <textarea
                                    value={form.personalStatement}
                                    onChange={(e) => update("personalStatement", e.target.value)}
                                    rows={3}
                                    className="mt-1 p-1 rounded bg-white/10 border border-white/10 text-sm"
                                />
                            </label>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            <span className="text-sm text-gray-300">Full name</span>
                            <input
                                value={form.fullName}
                                onChange={(e) => update("fullName", e.target.value)}
                                className="mt-1 p-2 rounded bg-white/10 border border-white/10"
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-gray-300">Email</span>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => update("email", e.target.value)}
                                className="mt-1 p-2 rounded bg-white/10 border border-white/10"
                                required
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex flex-col">
                            <span className="text-sm text-gray-300">UW NetID</span>
                            <input
                                value={form.uwNetId}
                                onChange={(e) => update("uwNetId", e.target.value)}
                                className="mt-1 p-2 rounded bg-white/10 border border-white/10"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-gray-300">Major</span>
                            <input
                                value={form.major}
                                onChange={(e) => update("major", e.target.value)}
                                className="mt-1 p-2 rounded bg-white/10 border border-white/10"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-gray-300">Graduation year</span>
                            <input
                                value={form.year}
                                onChange={(e) => update("year", e.target.value)}
                                className="mt-1 p-2 rounded bg-white/10 border border-white/10"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col">
                        <span className="text-sm text-gray-300">Personal statement</span>
                        <textarea
                            value={form.personalStatement}
                            onChange={(e) => update("personalStatement", e.target.value)}
                            rows={6}
                            className="mt-1 p-2 rounded bg-white/10 border border-white/10"
                            required
                        />
                    </label>

                    <div className="flex items-center gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 rounded bg-white/10"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 rounded bg-husky-green text-black font-bold">
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
