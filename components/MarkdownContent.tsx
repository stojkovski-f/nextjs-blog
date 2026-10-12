type MarkdownContentProps = {
  html: string;
};

export function MarkdownContent({ html }: MarkdownContentProps) {
  return (
    <div
      className="prose-custom"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
