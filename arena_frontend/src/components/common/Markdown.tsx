import ReactMarkdown, { Options } from "react-markdown";

const CodeBlock = ({node}:any) => {
    return (
      <>
      <pre style={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
        <code>{node.children[0].value}</code>
      </pre>
      </>
    );
  };

const Markdown = ({children, options} : {children:string, options?: Readonly<Options>}) => {
    return <ReactMarkdown components={{ code: CodeBlock }} children={children} {...options} />
} 

export default Markdown;