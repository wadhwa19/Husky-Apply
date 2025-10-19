import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/common/CodeBlock";
import { Link } from "react-router-dom";

const routesSnippet = `import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}`;

const pageTemplate = `import type { FC } from "react";

const Page: FC = () => {
  return (
    <section className="container py-12">
      <h1 className="text-4xl font-bold tracking-tight">Page title</h1>
      <p className="mt-3 text-muted-foreground max-w-prose">Page content goes here. Build one component per page and register it in your router.</p>
    </section>
  );
};

export default Page;`;

const barrelSnippet = `// client/pages/index.ts
export { default as Home } from "./Home";
export { default as About } from "./About";
export { default as Contact } from "./Contact";`;

export default function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute -z-10 inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.accent/20),transparent_60%)]" aria-hidden />
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">Guide</span>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight">
              Get JavaScript code for <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">all your pages</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have multiple pages in your template? Create one React component per page, register routes, and you instantly have JS code for every page.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#how-it-works">How it works</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pages">See pages overview</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container py-12 md:py-20">
        <div className="grid gap-10">
          <div className="grid gap-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How to get JS for every page</h2>
            <p className="text-muted-foreground">Three simple steps to structure a multi‑page template.</p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-xl border p-6 bg-card text-card-foreground">
              <h3 className="text-lg font-semibold">1) Create a component per page</h3>
              <p className="mt-2 text-sm text-muted-foreground">Place each page in <code>client/pages/</code>. Use this template:</p>
              <div className="mt-4">
                <CodeBlock code={pageTemplate} language="tsx" />
              </div>
            </div>

            <div className="rounded-xl border p-6 bg-card text-card-foreground">
              <h3 className="text-lg font-semibold">2) Register routes</h3>
              <p className="mt-2 text-sm text-muted-foreground">Map URLs to your page components using React Router:</p>
              <div className="mt-4">
                <CodeBlock code={routesSnippet} language="tsx" />
              </div>
            </div>

            <div className="rounded-xl border p-6 bg-card text-card-foreground">
              <h3 className="text-lg font-semibold">3) Export pages (optional)</h3>
              <p className="mt-2 text-sm text-muted-foreground">Create a barrel file to easily import pages elsewhere:</p>
              <div className="mt-4">
                <CodeBlock code={barrelSnippet} language="ts" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
