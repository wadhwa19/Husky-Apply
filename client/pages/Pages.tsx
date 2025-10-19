import { CodeBlock } from "@/components/common/CodeBlock";

const examplePages = `// Example: define your pages as React components
export function About() { return <div className=\"container py-12\"><h1 className=\"text-3xl font-semibold\">About</h1><p className=\"mt-4 text-muted-foreground\">Tell your story here.</p></div>; }
export function Contact() { return <div className=\"container py-12\"><h1 className=\"text-3xl font-semibold\">Contact</h1><p className=\"mt-4 text-muted-foreground\">Add a form or details here.</p></div>; }
`;

export default function Pages() {
  return (
    <section className="container py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Pages overview</h1>
        <p className="mt-3 text-muted-foreground">
          Your template can have many pages. Create one React component per page
          and add a route for each. Start with two, then expand.
        </p>
      </div>

      <div className="mt-8 grid gap-6">
        <CodeBlock code={examplePages} language="tsx" />
        <div className="rounded-lg border p-4 bg-card text-card-foreground">
          <h2 className="font-semibold">Next steps</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>
              Create a file for each page in <code>client/pages/</code>.
            </li>
            <li>
              Register routes in <code>client/App.tsx</code>.
            </li>
            <li>
              Reuse the shared header/footer automatically via the layout.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
