"use client"
import { useMemo, useEffect, useRef, useState } from "react";
import {
  calculatePurchase,
  compareDownPayments,
  getDefaultInputs,
  type CalculatorInputs,
} from "./lib/calculator";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatNumber,
  formatPercent,
} from "./lib/format";
import "./App.css";


const DOWN_PAYMENT_PRESETS = [10, 15, 20, 25, 30, 40, 50];
const INPUT_COMMIT_DELAY_MS = 2000;


function parseNumber(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}



function NumberInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const format = (n: number) =>
    new Intl.NumberFormat("sv-SE").format(n);

  const [inputValue, setInputValue] = useState(format(value));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusedRef = useRef(false);

  const clearDebounce = () => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  const commitValue = (raw: string) => {
    const parsed = parseNumber(
      raw.replace(/\s/g, "").replace(",", "."),
      value
    );
    onChange(parsed);
    setInputValue(format(parsed));
  };

  useEffect(() => () => clearDebounce(), []);

  useEffect(() => {
    setInputValue((current) => {
      const parsed = parseNumber(
        current.replace(/\s/g, "").replace(",", "."),
        Number.NaN
      );
      if (parsed === value || focusedRef.current) {
        return current;
      }
      return format(value);
    });
  }, [value]);

  return (
    <label className="field" htmlFor={id}>
      <span className="field-label text-left">{label}</span>
      <div className="field-input-wrap">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={inputValue}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const next = e.target.value;
            setInputValue(next);
            clearDebounce();
            debounceRef.current = setTimeout(() => {
              commitValue(next);
            }, INPUT_COMMIT_DELAY_MS);
          }}
          onFocus={() => {
            focusedRef.current = true;
          }}
          onBlur={() => {
            focusedRef.current = false;
            clearDebounce();
            commitValue(inputValue);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        />
        {suffix && <span className="field-suffix">{suffix}</span>}
      </div>
    </label>
  );
}




type ToggleProps = {
  id: string;
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
};

function Toggle({
  id,
  label,
  value,
  onChange,
}: ToggleProps) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>

      <div className="field-input-wrap">
        <label className="switch">
          <input
            id={id}
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="slider" />
        </label>
      </div>
    </label>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`result-row${highlight ? " highlight" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function App() {

  const [inputs, setInputs] = useState<CalculatorInputs>(getDefaultInputs);
  const [comparePercentages, setComparePercentages] = useState<number[]>([
    10, 20, 30,
  ]);

  const update = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const result = useMemo(() => calculatePurchase(inputs), [inputs]);
  const comparison = useMemo(
    () => compareDownPayments(inputs, comparePercentages),
    [inputs, comparePercentages],
  );

  const toggleComparePercent = (percent: number) => {
    setComparePercentages((prev) => {
      if (prev.includes(percent)) {
        return prev.length > 1 ? prev.filter((p) => p !== percent) : prev;
      }
      return [...prev, percent].sort((a, b) => a - b);
    });
  };


  let totalPages = Math.ceil(result.allMonthlyPayments.length / 12);

  const [currentPage, setCurrentPage] = useState(1);


  const itemsPerPage = 12;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPayments = result.allMonthlyPayments.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Net Present Value calculator</p>
        <h1>Home Real Value Insights</h1>
        <p className="subtitle">
          Adjust apartment price, size, down payment, and loan terms to see
          monthly payments, upfront cash, and side-by-side down payment
          scenarios.
        </p>
      </header>

      <main className="layout">
        <section className="panel inputs-panel">
          <h2>Apartment &amp; loan inputs</h2>

          <div className="field-grid">
            <NumberInput
              id="price"
              label="Starting price"
              value={inputs.apartmentPrice}
              onChange={(v) => update("apartmentPrice", Math.max(0, v))}
              min={0}
              step={1000}
              suffix="SEK"
            />
            <NumberInput
              id="sqm"
              label="Total square meters"
              value={inputs.squareMeters}
              onChange={(v) => update("squareMeters", Math.max(0, v))}
              min={0}
              step={0.5}
              suffix="m²"
            />
            <NumberInput
              id="down"
              label="Down payment"
              value={inputs.downPaymentPercent}
              onChange={(v) =>
                update("downPaymentPercent", Math.min(100, Math.max(0, v)))
              }
              min={0}
              max={100}
              step={1}
              suffix="%"
            />
            <NumberInput
              id="rate"
              label="Annual interest rate"
              value={inputs.annualInterestRate}
              onChange={(v) => update("annualInterestRate", Math.max(0, v))}
              min={0}
              step={0.1}
              suffix="%"
            />
            <NumberInput
              id="amortizationRate"
              label="Amortization Rate"
              value={inputs.amortizationRate}
              onChange={(v) => update("amortizationRate", Math.max(1, v))}
              min={1}
              max={40}
              step={1}
              suffix="%"
            />

            <NumberInput
              id="fixedCost"
              label="Fixed Cost"
              value={inputs.fixedCost}
              onChange={(v) => update("fixedCost", Math.max(0, v))}
              min={1}
              max={100000}
              step={1}
              suffix="SEK"
            />

            <NumberInput
              id="sellAfterYears"
              label="Sell after X years"
              value={inputs.sellAfterYears}
              onChange={(v) => update("sellAfterYears", Math.max(0, v))}
              min={1}
              max={100}
              step={1}
              suffix="years"
            />

            {/* <Toggle
              id="annuity"
              label="Use annuity payments"
              value={inputs.annuity}
              onChange={(v) => update("annuity", v)}
            /> */}

          </div>

          <details className="advanced">
            <summary>Purchase fees &amp; taxes</summary>
            <div className="field-grid">
              <NumberInput
                id="agency"
                label="Agency fee"
                value={inputs.agencyFeePercent}
                onChange={(v) => update("agencyFeePercent", Math.max(0, v))}
                min={0}
                step={0.5}
                suffix="% of price"
              />
              <NumberInput
                id="tax"
                label="Transfer tax"
                value={inputs.transferTaxPercent}
                onChange={(v) => update("transferTaxPercent", Math.max(0, v))}
                min={0}
                step={0.5}
                suffix="% of price"
              />
              <NumberInput
                id="bank"
                label="Bank processing fee"
                value={inputs.bankFeePercent}
                onChange={(v) => update("bankFeePercent", Math.max(0, v))}
                min={0}
                step={0.1}
                suffix="% of loan"
              />
            </div>
          </details>
        </section>

        <section className="panel results-panel">
          <h2>Average Approximation</h2>

          <div className="metric-cards">
            <article className="metric-card primary">
              <span>Monthly payment</span>
              <strong>{formatCurrencyPrecise(result.monthlyPayment)}</strong>
            </article>
            <article className="metric-card">
              <span>Price per m²</span>
              <strong>{formatCurrency(result.pricePerSqm)}</strong>
            </article>
            <article className="metric-card">
              <span>Cash at purchase</span>
              <strong>{formatCurrency(result.cashNeededAtPurchase)}</strong>
            </article>
          </div>

          <div className="result-groups">
            <div className="result-group">
              <h3>Financing</h3>
              <ResultRow
                label="Down payment"
                value={formatCurrency(result.downPaymentAmount)}
              />
              <ResultRow
                label="Loan amount"
                value={formatCurrency(result.loanAmount)}
              />
              <ResultRow
                label="Total interest over term"
                value={formatCurrency(result.totalInterest)}
              />
            </div>
            <br></br>
            <div className="result-group">
              <h3>Monthly Breakdown</h3>
              <ResultRow
                label="Monthly Total"
                value={formatCurrency(result.monthlyPayment)}
              />
              <ResultRow
                label="Fixed Costs"
                value={formatCurrency(result.fixedCost)}
              />
              <ResultRow
                label={`Interest per month`}
                value={formatCurrency(result.interestPerMonth)}
              />
               <ResultRow
                label="Monthly Amortization (investment)"
                value={formatCurrency(result.loanAmount / result.numPayments)}
              />
              <ResultRow
                label="Wasted money per month"
                value={formatCurrency(result.interestPerMonth + result.fixedCost)}
              />
            </div>
              <br></br>
            <div className="result-group">
              <h3>Wasted Money</h3>
              <ResultRow
                label="Agency fee"
                value={formatCurrency(result.agencyFee)}
              />
              <ResultRow
                label="Transfer tax"
                value={formatCurrency(result.transferTax)}
              />
              <ResultRow
                label="Bank fee"
                value={formatCurrency(result.bankFee)}
              />
              <ResultRow
                label="Total purchase fees"
                value={formatCurrency(result.totalPurchaseCosts)}
              />

            </div>
            <br></br>
            <div className="result-group">
              <h3>Sell after {result.sellAfterYears} year{result.sellAfterYears === 1 ? "" : "s"}</h3>
              <ResultRow
                label={`Total wasted money in ${result.sellAfterYears} year${result.sellAfterYears === 1 ? "" : "s"}`}
                value={formatCurrency(result.totalPurchaseCosts + (12 * result.sellAfterYears * result.fixedCost) + (result.interestPerMonth *12*result.sellAfterYears))}
              />
              <ResultRow
                label="Sell to break even"
                value={formatCurrency(result.totalPurchaseCosts + (12 * result.sellAfterYears * result.fixedCost) + (result.interestPerMonth *12*result.sellAfterYears)+inputs.apartmentPrice)}
              />
            </div>
            <br></br>
            <div className="result-group">
              <h3>Totals</h3>
              <ResultRow
                label="Starting price"
                value={formatCurrency(inputs.apartmentPrice)}
              />
              <ResultRow
                label="Size"
                value={`${formatNumber(inputs.squareMeters)} m²`}
              />
              <ResultRow
                label="Total cost by end of loan term"
                value={formatCurrency(result.totalCostOfOwnership)}
                highlight
              />
            </div>
          </div>
        </section>

        <section className="panel compare-panel">
          <div className="compare-header">
            <div>
              <h2>Compare down payments</h2>
              <p>Select percentages to compare for the same apartment.</p>
            </div>
            <div className="preset-chips">
              {DOWN_PAYMENT_PRESETS.map((percent) => (
                <button
                  key={percent}
                  type="button"
                  className={
                    comparePercentages.includes(percent) ? "chip active" : "chip"
                  }
                  onClick={() => toggleComparePercent(percent)}
                >
                  {formatPercent(percent)}
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Down payment</th>
                  <th>Down payment amount</th>
                  <th>Loan amount</th>
                  <th>Monthly payment</th>
                  <th>Cash at purchase</th>
                  <th>Total interest</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(({ percent, result: row }) => (
                  <tr
                    key={percent}
                    className={
                      percent === inputs.downPaymentPercent ? "selected" : ""
                    }
                  >
                    <td>{formatPercent(percent)}</td>
                    <td>{formatCurrency(row.downPaymentAmount)}</td>
                    <td>{formatCurrency(row.loanAmount)}</td>
                    <td>{formatCurrencyPrecise(row.monthlyPayment)}</td>
                    <td>{formatCurrency(row.cashNeededAtPurchase)}</td>
                    <td>{formatCurrency(row.totalInterest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel compare-panel">
          <div className="compare-header">
            <div>
              <h2>Monthly payments projection</h2>
              <p>Get a view into the {result.allMonthlyPayments.length} individual monthly payments</p>
            </div>
            <div className="pagination">
              <button
                className="pagination-button"
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(page => page - 1)}
              >
                Previous
              </button>

              
                <span style={{ padding: "0 10px" }}>
                  year {currentPage} / {totalPages} 
                </span>
         

              <button
                className="pagination-button"
                type="button"
                disabled={currentPage === totalPages}
                onClick={ () => setCurrentPage(page => page + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Month number</th>
                  <th>Monthly Payment</th>
                  <th>Amortization</th>
                  <th>Interest</th>
                  <th>Fixed costs</th>
                  <th>Remaining balance</th>
                </tr>
              </thead>

              <tbody>
                {currentPayments.map((payment) => (
                  <tr key={payment.month}>
                    <td>{payment.month}</td>
                    <td>{formatCurrency(payment.payment)}</td>
                    <td>{formatCurrency(payment.principal)}</td>
                    <td>{formatCurrency(payment.interest)}</td>
                    <td>{formatCurrency(result.fixedCost)}</td>
                    <td>{formatCurrency(payment.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>
        
      </main>

      <footer className="footer">
        <p>
          Copyright 2026
        </p>
      </footer>
    </div>
  );
}
