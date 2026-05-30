'use client';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';
import { BlockNoteView } from '@blocknote/react';
import { useCreateBlockNote } from '@blocknote/react';
import { PartialBlock } from '@blocknote/core';

interface BlockNoteRendererProps {
  content: Record<string, unknown>;
  className?: string;
}

export function BlockNoteRenderer({ content, className = '' }: BlockNoteRendererProps) {
  const editor = useCreateBlockNote({
    initialContent: Array.isArray(content) ? (content as PartialBlock[]) : undefined,
  });

  return (
    <div className={`prose max-w-none ${className}`}>
      <BlockNoteView editor={editor} editable={false} theme="light" />
    </div>
  );
}
