import AppEditor from "@components/JsonEditor";
import { motion } from 'framer-motion';
import { addToast } from "@heroui/react";
import { useState } from "react";
import { AppIcon } from "@/shared/icons";

const toolKey = 'template-data';

const loadInitialData = () => {
  const local = localStorage.getItem(toolKey);
  let l1 = `Hello {name}, I'm still working`;
  let l2 = JSON.stringify({
    "name": "Tom"
  });
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed.s1) l1 = parsed.s1;
      if (parsed.s2) l2 = parsed.s2;
    } catch (err) {
      console.error(`Error parsing local storage data for ${toolKey}`, err);
    }
  }
  return { s1: l1, s2: l2 };
}

export default function JsonDiff() {
  const { s1, s2 } = loadInitialData();
  const [data1, setData1] = useState(s1);
  const [data2, setData2] = useState(s2);
  const [data3, setData3] = useState('');


  const __getTextFromEditor = (data: string) => {
    try {
      if (!data || data.trim() === '') return null;
      
      // Replace MongoDB-style constructors with their inner values
      // ObjectId('id') -> 'id'
      // ISODate('dt') -> 'dt'
      // NumberLong(123) -> 123
      const cleaned = data
        .replace(/ObjectId\s*\(\s*['"]([^'"]+)['"]\s*\)/g, '"$1"')
        .replace(/ISODate\s*\(\s*['"]([^'"]+)['"]\s*\)/g, '"$1"')
        .replace(/NumberLong\s*\(\s*(\d+)\s*\)/g, '$1')
        .replace(/NumberInt\s*\(\s*(\d+)\s*\)/g, '$1')
        .replace(/Timestamp\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/g, '$1');
      
      // Try parsing as JSON first
      try {
        return JSON.parse(cleaned);
      } catch {
        // If JSON.parse fails, try evaluating as JavaScript object literal
        // Wrap in parentheses to treat as expression, use Function constructor for safer eval
        const result = new Function('return (' + cleaned + ')')();
        return result;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast({ title: 'Invalid JSON/JS Object', description: String(msg), variant: 'flat', color: 'danger' });
      return null;
    }
  }

  const populate = () => {
    // const _data1 = __getTextFromEditor(data1);
    const _data2 = __getTextFromEditor(data2);
    if (!data1 || !_data2) {
      // parsing failed or empty editors — abort
      return;
    }
    const result = data1.fmt(_data2);
    setData3(result);
    localStorage.setItem(toolKey, JSON.stringify({ s1: data1, s2: data2 }));
  }


  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Button Container */}
      <div className="flex lg:flex-row flex-col justify-center relative">
        {/* Buttons - perfectly centered */}
        <div className="button-group">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => populate()}
            className="action-button"
          >
            <span className="button-icon">
              <AppIcon name="refresh-ccw-dot" className="icon" />
            </span>
            Populate
          </motion.button>
        </div>
      </div>

      {/* Editor Container */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <div className="flex flex-col lg:flex-row gap-4 editor-container">
          <AppEditor label="Enter Template" ext={[]} value={data1} onChange={setData1} />
          <AppEditor label="Enter Input JSON" value={data2} onChange={setData2} />
          {
            data3.length > 0 && (
              <AppEditor ext={[]} value={data3} />
            )
          }
        </div>

      </div>
    </div>
  );
}