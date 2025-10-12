import AppEditor from "@components/JsonEditor";
import { motion } from 'framer-motion';
import { DynamicIcon } from "lucide-react/dynamic";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { checkJSONDiff, sortJSON } from "@utils/jsondiff";

type Diff = { changed?: boolean; position?: string | number; type?: string;[k: string]: unknown };
const toolKey = 'json-diff-data';

const loadInitialData = () => {
  const local = localStorage.getItem(toolKey);
  let l1 = '';
  let l2 = '';
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed.s1) l1 = JSON.stringify(parsed.s1, null, 2);
      if (parsed.s2) l2 = JSON.stringify(parsed.s2, null, 2);
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
  const [spaces, setSpaces] = useState('2');
  const [differences, setDifferences] = useState<Array<Diff>>([]);
  const [data3, setData3] = useState('');
  const DEFAULT_SPACES = '2';


  const __getTextFromEditor = (data: string) => {
    try {
      if (!data || data.trim() === '') return null;
      return JSON.parse(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast({ title: 'Invalid JSON', description: String(msg), variant: 'flat', color: 'danger' });
      return null;
    }
  }

  const clearDiff = () => {
    setDifferences([]);
    setData3('');
  }

  const _setNextEditor = (e: number, data: object) => {
    const indent = parseInt(spaces, 10);
    if (e === 1) setData1(JSON.stringify(data, null, indent));
    if (e === 2) setData2(JSON.stringify(data, null, indent));
  }

  const jsondiff = () => {
    const _data1 = __getTextFromEditor(data1);
    const _data2 = __getTextFromEditor(data2);
    if (!_data1 || !_data2) {
      // parsing failed or empty editors — abort
      return;
    }
    const allDiffs = (checkJSONDiff(_data1, _data2) as Array<Diff>);
    const s1 = sortJSON(_data1);
    const s2 = sortJSON(_data2);
    _setNextEditor(1, s1);
    _setNextEditor(2, s2);
    const changes = allDiffs.filter(d => d.changed);
    setDifferences(changes);
    setData3(changes.map(d => `${d.position}: ${d.type}`).join('\n'));
    localStorage.setItem(toolKey, JSON.stringify({ s1, s2 }));
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
            onClick={() => jsondiff()}
            className="action-button"
          >
            <span className="button-icon">
              <DynamicIcon name="file-diff" className="icon" />
            </span>
            Check Diff
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => clearDiff()}
            className="action-button"
          >
            <span className="button-icon">
              <DynamicIcon name="eraser" className="icon" />
            </span>
            Clear Diff
          </motion.button>
        </div>

        {/* Select - positioned absolutely at the end */}
        <div className="md:absolute right-0">
          <Select
            className="w-[120px]"
            label="Indent"
            placeholder="Select Indent"
            defaultSelectedKeys={[DEFAULT_SPACES]}
            onChange={(change) => {
              setSpaces(change.target.value || DEFAULT_SPACES.toString())
            }}
          >
            {[2, 4, 8].map((s: number) => (
              <SelectItem key={s} textValue={`${s}`}>{s} Space(s)</SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Editor Container */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <div className="flex lg:flex-row flex-col gap-4 editor-container">
          <AppEditor label="JSON 1" value={data1} onChange={setData1} />
          <AppEditor label="JSON 2" value={data2} onChange={setData2} />
          {
            differences.length > 0 && (
              <AppEditor value={data3} />
            )
          }
        </div>

      </div>
    </div>
  );
}