import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import rehypeRaw from "rehype-raw";
// import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import "github-markdown-css";

import './index.less'


function Shapes({ src }) {
  const [mdText, setMdText] = useState("");
  useEffect(() => {
    fetch(src)
      .then((response) => response.text())
      .then((text) => {
        setMdText(text);
      });
  }, [src]);
  return (
    <div className="markdown-body">
      <ReactMarkdown
        children={mdText}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            console.log("clasname...", className);
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                // style={{ background: 'red'}}
                language={match[1]}
                className="my-code"
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
}

export default Shapes;
