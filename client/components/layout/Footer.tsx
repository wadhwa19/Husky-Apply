export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Multi‑Page JS Export. All rights
          reserved.
        </p>
        <p>
          Built with React, React Router, and Tailwind. Colors adapted for
          accessibility.
        </p>
      </div>
    </footer>
  );
}
