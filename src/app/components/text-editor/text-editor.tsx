import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';
import { Control, Controller } from 'react-hook-form';

interface Props {
  control: Control<any>;
}

export const TextEditor = (props: Props): JSX.Element => {
  const { control } = props;
  const editor = useRef(null);

  const config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
    toolbarButtonSize: 'large',
    defaultMode: '1',
    toolbarStickyOffset: 64,
    editorCssClass: 'article-editor',
    showCharsCounter: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    inline: true,
    toolbarInlineForSelection: true,
    showPlaceholder: false,
    showXPathInStatusbar: false,
    buttons:
      'bold,italic,underline,strikethrough,eraser,ul,ol, align, font,fontsize,paragraph,lineHeight,superscript,subscript,image,video,hr,table,link,symbol, preview',
  };

  return (
    <Controller
      control={control}
      name="delta"
      render={({ field: { onChange, value } }) => (
        <JoditEditor
          ref={editor}
          value={value}
          config={config}
          onChange={onChange}
        />
      )}
    />
  );
};
