'use client';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useMemo } from "react";
import type { PartialBlock } from "@blocknote/core";

interface BlockNoteEditorProps {
  initialContent?: PartialBlock[] | string;
  onChange: (json: PartialBlock[]) => void;
  editable?: boolean;
}

export function BlockNoteEditor({ initialContent, onChange, editable = true }: BlockNoteEditorProps) {
  const initialBlocks = useMemo(() => {
    if (typeof initialContent === 'string' && initialContent) {
      try {
        return JSON.parse(initialContent);
      } catch (e) {
        return undefined;
      }
    }
    if (Array.isArray(initialContent) && initialContent.length > 0) {
        return initialContent;
    }
    return undefined;
  }, [initialContent]);

  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  });

  return (
    <div className="min-h-[300px] border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all pb-8 pt-4">
      <BlockNoteView 
        editor={editor} 
        editable={editable}
        onChange={() => {
          onChange(editor.document);
        }}
        theme="light"
      />
    </div>
  );
}
