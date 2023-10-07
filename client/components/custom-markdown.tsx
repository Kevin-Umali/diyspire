import { cleanMarkdown } from "@/lib";
import ReactMarkdown from "react-markdown";

type CustomMarkdownProps = {
  content: string;
};

const CustomMarkdown: React.FC<CustomMarkdownProps> = ({ content }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown>{cleanMarkdown(content)}</ReactMarkdown>
    </div>
  );
};

export default CustomMarkdown;
