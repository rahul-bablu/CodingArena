import ReactMarkdown, { Options } from "react-markdown";

const CodeBlock = ({ className, children }: any) => {
  const isInline = !className;  // Check if it's inline code

  return (
    <>
      {isInline ? (
        <code style={{ backgroundColor: '#f5f5f5', color: '#d63384', padding: '2px 4px', borderRadius: '5px' }}>
          {children}
        </code>
      ) : (
        <pre style={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
          <code className={className}>{children}</code>
        </pre>
      )}
    </>
  );
};

const Markdown = ({children, options} : {children:string, options?: Readonly<Options>}) => {
    return <ReactMarkdown components={{ code: CodeBlock }} children={children} {...options} />
} 

export default Markdown;