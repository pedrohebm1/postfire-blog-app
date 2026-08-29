"use client";

import { useEffect, useState } from "react";

import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";

import {
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";

import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
} from "@lexical/list";

import { mergeRegister } from "@lexical/utils";

import {
    $getNearestNodeOfType,
} from "@lexical/utils";

import { ListNode } from "@lexical/list";

import {
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_LOW,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();

    const [isBold, setBold] = useState(false);
    const [isItalic, setItalic] = useState(false);
    const [isUnderline, setUnderline] = useState(false);
    const [isBullet, setBullet] = useState(false);
    const [isNumber, setNumber] = useState(false);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const selection = $getSelection();

                    if (!$isRangeSelection(selection)) return;

                    setBold(selection.hasFormat("bold"));
                    setItalic(selection.hasFormat("italic"));
                    setUnderline(selection.hasFormat("underline"));

                    const anchor = selection.anchor.getNode();
                    const list = $getNearestNodeOfType(anchor, ListNode);

                    if (list) {
                        setBullet(list.getListType() === "bullet");
                        setNumber(list.getListType() === "number");
                    } else {
                        setBullet(false);
                        setNumber(false);
                    }
                });
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => false,
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor]);

    const button =
        "px-3 py-1 border rounded hover:bg-gray-100 text-sm";

    const active =
        "bg-blue-500 text-white hover:bg-blue-500";

    return (
        <div className="flex flex-wrap gap-2 border-b p-2 mb-2">
            <button
                type="button"
                className={`${button} ${isBold ? active : ""}`}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
                }
            >
                B
            </button>

            <button
                type="button"
                className={`${button} ${isItalic ? active : ""}`}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
                }
            >
                I
            </button>

            <button
                type="button"
                className={`${button} ${isUnderline ? active : ""}`}
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
                }
            >
                U
            </button>

            <button
                type="button"
                className={`${button} ${isBullet ? active : ""}`}
                onClick={() =>
                    editor.dispatchCommand(
                        INSERT_UNORDERED_LIST_COMMAND,
                        undefined
                    )
                }
            >
                • List
            </button>

            <button
                type="button"
                className={`${button} ${isNumber ? active : ""}`}
                onClick={() =>
                    editor.dispatchCommand(
                        INSERT_ORDERED_LIST_COMMAND,
                        undefined
                    )
                }
            >
                1. List
            </button>

            <button
                type="button"
                className={button}
                onClick={() =>
                    editor.dispatchCommand(
                        REMOVE_LIST_COMMAND,
                        undefined
                    )
                }
            >
                Remove List
            </button>

            <button
  type="button"
  className={button}
  onClick={() =>
    editor.dispatchCommand(UNDO_COMMAND, undefined)
  }
>
  Undo
</button>

<button
  type="button"
  className={button}
  onClick={() =>
    editor.dispatchCommand(REDO_COMMAND, undefined)
  }
>
  Redo
</button>
        </div>
    );
}