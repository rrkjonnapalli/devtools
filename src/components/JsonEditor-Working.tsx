import { useEffect, useRef, useCallback } from 'react';
import { useCodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useTheme } from 'src/contexts/ThemeContext';

// Define the extensions outside the component for the best performance.
// If you need dynamic extensions, use React.useMemo to minimize reference changes
// which cause costly re-renders.
const extensions = [javascript()];

export default function AppEditor({ value, onChange: setValue }: { value: string; onChange?: (val: string) => void }) {
  const { theme } = useTheme();
  // Use a mutable ref just to hold the DOM element for styling, but pass
  // a callback ref to CodeMirror so it always mounts to the latest node.
  const rootRef = useRef<HTMLDivElement | null>(null);

  const onChange = useCallback((val: string) => {
    console.log('val:', val);
    setValue?.(val);
  }, [setValue]);

  const { setContainer } = useCodeMirror({
    container: rootRef.current ?? undefined,
    extensions,

    onChange,
    // width: '100%',
    // maxWidth: '100%',
    // Let CodeMirror know it should try to fill the container's height.
    height: '100%',
    theme: theme === 'dark' ? 'dark' : 'light',
    value,
  });

  // Create a stable callback ref so that when React mounts the div we call
  // setContainer immediately with the DOM node. This avoids the initial
  // render where editor.current is null.
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      // Keep a reference to the DOM node and compute a stable pixel height
      // so CodeMirror doesn't briefly measure collapsed flex containers.
      rootRef.current = node;
      const adjustHeight = () => {
        try {
          const footer = document.querySelector('#footer') as HTMLElement | null;
          const footerTop = footer ? footer.getBoundingClientRect().top : window.innerHeight;
          const top = node.getBoundingClientRect().top;
          let h = Math.max(0, Math.floor(footerTop - top));
          if (!h || h < 24) {
            // fallback to using viewport space
            h = Math.max(0, window.innerHeight - top);
          }
          // enforce a minimum so CM doesn't collapse to a single line
          const minH = 80;
          const finalH = Math.max(h, minH);
          node.style.height = `${finalH}px`;
          return finalH;
        } catch (_err) {
          void _err;
          return 0;
        }
      };

      // Apply a measured height then attach CodeMirror. A short re-apply
      // helps if parents are finishing a layout pass.
      adjustHeight();
      setContainer(node);
      setTimeout(() => {
        adjustHeight();
        setContainer(node);
      }, 60);

    } else {
      rootRef.current = null;
      // Clear the container by passing null.
      setContainer(null);
    }
  }, [setContainer]);

  // Re-apply container when theme changes so CodeMirror updates theme.
  useEffect(() => {
    if (rootRef.current) setContainer(rootRef.current);
  }, [theme, setContainer]);

  // Re-apply container on window resize so the editor can recompute its
  // sizing when the viewport or parent layout changes.
  useEffect(() => {
    const onResize = () => {
      if (rootRef.current) setContainer(rootRef.current);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setContainer]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, minWidth: 0 }}>
      <div ref={containerRef} style={{ height: '100%' }} />
    </div>
  );
}