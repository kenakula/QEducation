import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';
import { Control, Controller } from 'react-hook-form';
import { ColorMode, useThemeStore } from 'app/stores/theme-store/theme-store';

interface Props {
  control: Control<any>;
}

export const TextEditor = (props: Props): JSX.Element => {
  const { control } = props;
  const editor = useRef(null);
  const { mode } = useThemeStore();

  const config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
    toolbarButtonSize: 'large',
    defaultMode: '1',
    toolbarStickyOffset: 0,
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
      'bold,italic,underline,strikethrough,eraser,ul,ol, align, font,fontsize,paragraph,lineHeight,superscript,subscript,image,video,hr,link,symbol, preview',
  };

  return (
    <div
      className={
        mode === ColorMode.Dark
          ? 'article-editor article-editor--dark'
          : 'article-editor'
      }
    >
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
    </div>
  );
};
