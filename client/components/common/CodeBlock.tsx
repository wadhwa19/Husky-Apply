import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "tsx", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // noop
    }
  };

  return (
    <div className={cn("relative rounded-lg border bg-card text-card-foreground", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{language}</span>
        <Button size="sm" variant="secondary" onClick={onCopy} aria-label="Copy code">
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}
