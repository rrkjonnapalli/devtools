import { useEffect, useRef } from 'react';
import { useCodeMirror, type Extension } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useTheme } from 'src/contexts/ThemeContext';
import '../styles/cm-editor.css';
const extensions = [javascript()];

type AppEditorProps = {
  value: string;
  label?: string;
  ext?: Extension[];
  onChange?: (val: string) => void;
};

export default function AppEditor({ label, value, onChange: setValue, ext }: AppEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);
  
  const { setContainer } = useCodeMirror({
    container: editorRef.current,
    extensions: ext || extensions,
    onChange: setValue,
    theme: theme === 'dark' ? 'dark' : 'light',
    placeholder: label || 'Enter your text...',
    value,
  });

  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [setContainer]);

  return <div ref={editorRef} className="code-mirror-container" />;
}