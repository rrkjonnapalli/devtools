
import { motion } from 'framer-motion';
import { DynamicIcon } from "lucide-react/dynamic";
import { addToast, DatePicker } from "@heroui/react";
import { useState } from "react";
import {
  duration,
  // getCompatibleDate
} from '@utils/date-utils';
import { now, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from '@react-aria/i18n'


export default function Duration() {
  const formatter = useDateFormatter({ dateStyle: 'medium', timeStyle: 'medium', hourCycle: 'h23' });

  const [d1, setD1] = useState<ReturnType<typeof now> | null>(now(getLocalTimeZone()));
  const [d2, setD2] = useState<ReturnType<typeof now> | null>(now(getLocalTimeZone()).add({ days: 1 }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [diffResult, setDiffResult] = useState<any>(null);


  const calculate = () => {
    console.log('Calculate duration between', d1?.toString(), 'and', d2?.toString());
    // calculate duration between d1 and d2
    if (d1 && d2) {
      const _d1 = d1.toDate();
      const _d2 = d2.toDate();
      const diff = duration(_d1, _d2, getLocalTimeZone());
      console.log('Duration is', diff);
      setDiffResult(diff);
      addToast({ title: 'Duration', description: `Duration is  ${diff.main}`, variant: 'flat', color: 'success', timeout: 8000 });
    } else {
      setDiffResult(null);
      addToast({ title: 'Error', description: 'Please select both dates.', variant: 'flat', color: 'danger' });
    }
  }

  return (
    <div className="flex flex-col align-middle justify-center flex-1 min-h-0">
      <div className='flex flex-row gap-4 min-h-0 justify-center items-center'>
        <div className='text-center'>
          <DatePicker
            className="max-w-md"
            granularity="second"
            hourCycle={24}
            value={d1}
            onChange={setD1}
            errorMessage="Please enter a valid date."
            label="Start date"
          />
          {d1 ? formatter.format(d1.toDate()) : "--"}
        </div>


        <div className='text-center'>
          <DatePicker
            className="max-w-md"
            granularity="second"
            minValue={d1}
            hourCycle={24}
            value={d2}
            onChange={setD2}
            errorMessage="Please enter a valid date."
            label="End date"
          />
          {d2 ? formatter.format(d2.toDate()) : "--"}
        </div>

      </div>
      <div className='flex flex-col items-center gap-4'>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => calculate()}
          className="action-button"
        >
          <span className="button-icon">
            <DynamicIcon name="file-diff" className="icon" />
          </span>
          Calculate
        </motion.button>


        {diffResult ? (
          <div className="max-w-md p-4 rounded bg-card">
            <h3 className="text-lg font-medium mb-2">Duration:</h3>
            <p>
              {diffResult.main}
            </p>
            <p>{diffResult.years} years</p>
            <p>{diffResult.months} months</p>
            <p>{diffResult.days} days</p>
            <p>{diffResult.hours} hours</p>
            <p>{diffResult.minutes} minutes</p>
            <p>{diffResult.seconds} seconds</p>
          </div>

        ) : (
          <p className="text-sm text-gray-500">No duration calculated yet.</p>
        )}
      </div>
    </div>
  );
}