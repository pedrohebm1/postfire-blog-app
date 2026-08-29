"use client";

import { useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  $generateHtmlFromNodes,
  $generateNodesFromDOM,
} from "@lexical/html";

import {
  $getRoot,
  EditorState,
} from "lexical";

import {
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";

import {
  ListNode,
  ListItemNode,
} from "@lexical/list";

import {
  LinkNode,
  AutoLinkNode,
} from "@lexical/link";
import ToolbarPlugin from "./ToolbarPlugin";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function LoadHtmlPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!html) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");

      const nodes = $generateNodesFromDOM(editor, dom);

      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  }, [editor]);

  return null;
}

export default function LexicalEditor({
  value,
  onChange,
  placeholder,
}: Props) {
  const initialConfig = {
    namespace: "editor",

    theme: {
      paragraph: "mb-2",
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
      },
      list: {
        ul: "list-disc ml-6",
        ol: "list-decimal ml-6",
      },
    },

    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
    ],

    onError(error: Error) {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative border rounded-md p-4 min-h-[200px]">
        <ToolbarPlugin/>

        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none min-h-[180px]" />
          }
          placeholder={
            <div className="absolute top-4 left-4 text-gray-400">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />

        <ListPlugin />

        <OnChangePlugin
          onChange={(editorState: EditorState, editor) => {
            editorState.read(() => {
              const html = $generateHtmlFromNodes(editor);
              onChange(html);
            });
          }}
        />

        <LoadHtmlPlugin html={value} />
      </div>
    </LexicalComposer>
  );
}