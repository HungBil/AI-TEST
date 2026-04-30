interface Props {
  text: string;
}

export function RichText({ text }: Props) {
  const parts = text.split(/```/g);
  return (
    <div className="rich-text">
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          const cleaned = part.replace(/^\w+\n/, '').trim();
          return <pre key={index}><code>{cleaned}</code></pre>;
        }
        return part.split('\n').filter(Boolean).map((line, lineIndex) => <p key={`${index}-${lineIndex}`}>{line}</p>);
      })}
    </div>
  );
}
