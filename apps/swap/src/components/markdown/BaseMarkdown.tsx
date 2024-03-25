import { useEffect, useMemo } from "react";
import { Remarkable } from "remarkable";
import { linkify } from "remarkable/linkify";
import copyToClipboard from "copy-to-clipboard";

import "./base.css";

const remarkable = new Remarkable({
  html: false,
  breaks: true,
  typographer: false,
  linkTarget: "_blank",
}).use(linkify);

export default function BaseMarkdown({ content }: { content: string }) {
  const html = useMemo(() => {
    const body = content;

    // // Add the ipfs gateway to markdown images that start with ipfs://
    // function replaceIpfsUrl(match, p1) {
    //   return match.replace(p1, getIpfsUrl(p1));
    // }

    // body = body.replace(/!\[.*?\]\((ipfs:\/\/[a-zA-Z0-9]+?)\)/g, replaceIpfsUrl);

    return remarkable.render(body);
  }, [content]);

  useEffect(() => {
    document
      ?.querySelector(".markdown-body")
      ?.querySelectorAll("pre>code")
      .forEach((code) => {
        code.parentElement?.classList.add("rounded-lg");
        const copyButton = document.createElement("a");
        const icon = document.createElement("i");
        icon.classList.add("copy");
        icon.classList.add("text-skin-text");
        icon.classList.add("iconcopy");
        icon.classList.add("iconfont");
        copyButton.appendChild(icon);
        copyButton.addEventListener("click", () => {
          const codeText = (code as HTMLElement).innerText.trim();
          copyToClipboard(codeText);
        });
        code.appendChild(copyButton);
      });
  }, []);

  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />;
}
