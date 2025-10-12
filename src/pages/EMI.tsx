import { motion } from 'framer-motion';
import { DynamicIcon } from "lucide-react/dynamic";
import { addToast, DatePicker, Tooltip } from "@heroui/react";
import { useState } from "react";
import { getLocalTimeZone, now } from '@internationalized/date';
import { useDateFormatter } from '@react-aria/i18n';
import { TInputField } from '@/shared/TInputField';
// import '../styles/EMI.css';

const toolKey = 'emi-data';

const getEMI = (P: number, R: number, N: number) => {
  if (R === 0) return P / N;
  const r = R / (12 * 100);
  return (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
}

const getEMILogPerMonth = (P: number, R: number, N: number, startDate?: Date) => {
  const r = R / (12 * 100);
  let balance = P;
  const emiLog = [];
  const currentDate = startDate || new Date();
  const emi = getEMI(P, R, N);

  for (let month = 1; month <= N; month++) {
    const interestForMonth = balance * r;
    const principalForMonth = emi - interestForMonth;
    balance -= principalForMonth;
    const totalPrincialPaid = P - balance;
    const totalInterestPaid = (emi * month) - totalPrincialPaid;
    // needToPay is total amount need to be paid from till now
    const needToPay = emi * (N - month);

    emiLog.push({
      month,
      date: new Date(currentDate),
      total: interestForMonth + principalForMonth,
      interest: interestForMonth,
      principal: principalForMonth,
      balance: balance > 0 ? balance : 0,
      tip: totalInterestPaid,
      tpp: totalPrincialPaid,
      ntp: needToPay
    });

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return emiLog;
}

const loadInitialData = () => {
  const local = localStorage.getItem(toolKey);
  let p = 0;
  let n = 0;
  let r = 10.5;
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed.p) p = parsed.p;
      if (parsed.r) r = parsed.r;
      if (parsed.n) n = parsed.n;
    } catch (err) {
      console.error(`Error parsing local storage data for ${toolKey}`, err);
    }
  }
  return { p, n, r };
}
type EmiLog = { month: number; date: Date; total: number; interest: number; principal: number; balance: number, tip: number, tpp: number, ntp: number };

export default function Emi() {
  const { p: _p, n: _n, r: _r } = loadInitialData();
  const [p, setP] = useState<number>(_p);
  const [r, setR] = useState<number>(_r);
  const [n, setN] = useState<number>(_n);
  const [startDate, setStartDate] = useState<ReturnType<typeof now> | null>(now(getLocalTimeZone()));
  const [emi, setEmi] = useState<number>(0);
  const [emiLog, setEmiLog] = useState<Array<EmiLog>>([]);

  // const headers = ['Month', 'Date', 'Total', 'Interest', 'Principal', 'Balance'];
  // const fields = ['month', 'date', 'total', 'interest', 'principal', 'balance'];
  const formatter = useDateFormatter({ dateStyle: 'medium' });

  const calculate = () => {
    const _emi = getEMI(p, r, n);
    setEmi(_emi);
    setEmiLog(getEMILogPerMonth(p, r, n, startDate ? startDate.toDate() : undefined));
    localStorage.setItem(toolKey, JSON.stringify({ p, r, n }));
    addToast({
      title: 'EMI Calculated',
      description: `EMI is ${_emi.toFixed(2)}`,
      variant: 'flat',
      color: 'success',
      timeout: 8000
    });
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8 flex-1 min-h-0 max-w-4xl mx-auto w-full px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text mb-2">EMI Calculator</h1>
        <p className="text-text-light">Calculate your monthly loan payments</p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-md space-y-6">
        <TInputField
          label="Principal Amount"
          value={p}
          onValueChange={setP}
          placeholder="Enter principal amount"
        />

        <TInputField
          label="Interest Rate (%)"
          value={r}
          onValueChange={setR}
          placeholder="Enter interest rate"
        />

        <TInputField
          label="Loan Tenure (Months)"
          value={n}
          onValueChange={setN}
          placeholder="Enter months"
        />

        {/* Start Date */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-text px-1">Start Date</label>
          <DatePicker
            className="w-full"
            granularity="day"
            value={startDate}
            onChange={setStartDate}
            label="Select start date"
          />
          {startDate && (
            <p className="text-sm text-text-light px-1 mt-1">
              Starts: {formatter.format(startDate.toDate())}
            </p>
          )}
        </div>

        {/* Calculate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={calculate}
          className="w-full py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <DynamicIcon name="calculator" className="w-5 h-5" />
          Calculate EMI
        </motion.button>
      </div>

      {/* Results */}
      {emi > 0 && (
        <div className="w-full space-y-6">
          {/* EMI Summary */}
          <div className="card bg-alt p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DynamicIcon name="calculator" className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-text-light text-sm">Monthly EMI</p>
                <p className="text-3xl font-bold text-text">₹{emi.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex justify-center gap-6 text-sm text-text-light border-t border-border pt-4">
              <div>
                <p>Total Payment</p>
                <p className="font-medium text-text">₹{(emi * n).toFixed(2)}</p>
              </div>
              <div>
                <p>Total Interest</p>
                <p className="font-medium text-text">₹{((emi * n) - p).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* EMI Schedule Table */}
          <div className="w-full overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                  <h3 className="text-lg font-semibold text-text">Payment Schedule</h3>
                  <div className="flex items-center gap-2 text-sm text-text-light">
                    <DynamicIcon name="calendar" className="w-4 h-4" />
                    <span>{emiLog.length} Installments</span>
                  </div>
                </div>

                {/* Payment Cards */}
                <div className="flex flex-col gap-3">
                  {emiLog.map((log) => (
                    <div
                      key={log.month}
                      className="rounded-xl bg-card hover:border-primary/30 transition-all duration-200 group"
                    >
                      <div className="flex flex-wrap justify-between items-start pt-3 border-t border-border/50">
                        <div className="min-w-[120px] text-center mb-3 md:mb-0">
                          <p className="text-sm text-text-light">Date</p>
                          <p className="font-medium tabular-nums">{formatter.format(log.date)}</p>
                        </div>
                        <div className="min-w-[120px] text-center mb-3 md:mb-0">
                          <p className="text-sm text-text-light">Principal</p>
                          <p className="font-medium text-green-500 dark:text-green-400 tabular-nums">₹{log.principal.toFixed(2)}</p>
                        </div>
                        <div className="min-w-[120px] text-center mb-3 md:mb-0">
                          <p className="text-sm text-text-light">Interest</p>
                          <p className="font-medium text-red-500 dark:text-red-400 tabular-nums">₹{log.interest.toFixed(2)}</p>
                        </div>
                        <div className="min-w-[120px] text-center mb-3 md:mb-0">
                          <p className="text-sm text-text-light">Principal Remaining</p>
                          <p className="font-medium text-blue-500 dark:text-blue-400 tabular-nums">₹{log.balance.toFixed(2)}</p>
                        </div>
                        <div className="min-w-[120px] text-center">
                          <p className="text-sm text-text-light">Total Payment</p>
                          <p className="text-lg font-bold text-text tabular-nums">₹{log.total.toFixed(2)}</p>
                        </div>
                        <div className="min-w-[120px] text-center">
                          <p className="text-sm text-text-light">Meta</p>
                          <p className="text-lg font-bold text-text tabular-nums">
                            <div className='flex flex-col justify-start text-left'>
                              <span className="text-xs text-text-light">
                                <Tooltip content="Total Principal Paid"><DynamicIcon name="info" className="w-3 h-3 inline mr-1" /></Tooltip>
                                TPP: ₹{log.tpp.toFixed(2)}
                              </span>
                              <span className="text-xs text-text-light">
                                <Tooltip content="Total Interest Paid"><DynamicIcon name="info" className="w-3 h-3 inline mr-1" /></Tooltip>
                                TIP: ₹{log.tip.toFixed(2)}
                              </span>
                              <span className="text-xs text-text-light">
                                <Tooltip content="Need to pay"><DynamicIcon name="info" className="w-3 h-3 inline mr-1" /></Tooltip>
                                NTP: ₹{log.ntp.toFixed(2)}
                              </span>
                            </div>
                            {/* ₹{log.tip.toFixed(2)} */}
                          </p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}