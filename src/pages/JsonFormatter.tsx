import AppEditor from "@components/JsonEditor";
import { motion } from 'framer-motion';
import { DynamicIcon } from "lucide-react/dynamic";
import * as _ from 'lodash';
import { addToast, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { sortJSON } from "@utils/jsondiff";

const toolKey = 'json-format-data';

const loadInitialData = () => {
  const local = localStorage.getItem(toolKey);
  let data = '';
  if (local) {
    try {
      data = local;
    } catch (err) {
      console.error(`Error parsing local storage data for ${toolKey}`, err);
    }
  }
  return data;
}

export default function JsonFormatter() {
  const [data1, setData1] = useState(loadInitialData());
  const [data2, setData2] = useState('');
  const [spaces, setSpaces] = useState('2');
  const DEFAULT_SPACES = '2';

  

  const handle = (action: string) => {
    try {
      switch (action) {
        case 'format': {
          format();
          break;
        }
        case 'unescape': {
          unescape();
          break;
        }
        case 'sort': {
          sortIt();
          break;
        }
        default: {
          throw new Error(`Action ${action} is not recognized.`);
        }
      }
      localStorage.setItem(toolKey, data1);
    } catch (error) {
      let message = '';
      if (error instanceof SyntaxError) {
        const msg = _.get(error, 'message', '');
        if (msg.startsWith('Expected')) {
          const [line, column] = msg.slice(msg.indexOf(' (') + 2, -1).replace(/line|column/g, '').trim().split('  ').map(e => parseInt(e));
          // this.e1 = { anchor: line, head: column };
          message = ` please correct line ${line} at column ${column}`;
        }
      }
      console.error(`Error while parsing data`, error, data1);
      addToast({
        title: 'Invalid JSON',
        description: `Error while parsing JSON.${message}`,
        variant: 'flat',
        color: 'danger'
      });
    }
  }

  const __getTextFromEditor = (data: string) => {
    const val = JSON.parse(data);
    return val;
  }

  const _setNextEditor = (data: object) => {
    const indent = parseInt(spaces, 10);
    setData2(JSON.stringify(data, null, indent));
  }

  const format = () => {
    const data = __getTextFromEditor(data1);
    _setNextEditor(data);
  }

  const unescape = () => {
    let jsonString = __getTextFromEditor(data1);
    jsonString = `"${jsonString}"`;
    const dataStr = JSON.parse(jsonString);
    const data = JSON.parse(dataStr);
    _setNextEditor(data);
  }


  const sortIt = () => {
    const data = __getTextFromEditor(data1);
    const sortedValue = sortJSON(data);
    _setNextEditor(sortedValue);
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
            onClick={() => handle('unescape')}
            className="action-button"
          >
            <span className="button-icon">
              <DynamicIcon name="unlock" className="icon" />
            </span>
            Unescape
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handle('sort')}
            className="action-button"
          >
            <span className="button-icon">
              <DynamicIcon name="arrow-up-down" className="icon" />
            </span>
            Sort
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handle('format')}
            className="action-button primary"
          >
            <span className="button-icon">
              <DynamicIcon name="sparkles" className="icon" />
            </span>
            Format
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
          <AppEditor value={data1} onChange={setData1} />
          <AppEditor label="This will be replaced" value={data2} onChange={setData2} />
        </div>
      </div>
    </div>
  );
}