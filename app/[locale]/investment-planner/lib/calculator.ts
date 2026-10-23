export interface CalculatorInputs {
  apartmentPrice: number;
  squareMeters: number;
  downPaymentPercent: number;
  annualInterestRate: number;
  amortizationRate: number;
  fixedCost: number;
  sellAfterYears: number;
  agencyFeePercent: number;
  transferTaxPercent: number;
  bankFeePercent: number;
  annuity: boolean;
}

export interface CalculatorResult {
  pricePerSqm: number;
  downPaymentAmount: number;
  loanAmount: number;
  monthlyPayment: number;
  totalMonthlyPayments: number;
  totalInterest: number;
  agencyFee: number;
  transferTax: number;
  bankFee: number;
  totalPurchaseCosts: number;
  totalCostOfOwnership: number;
  cashNeededAtPurchase: number;
  fixedCost: number;
  sellAfterYears: number;
  numPayments: number;
  annuity: boolean;
  interestPerMonth: number;
  allMonthlyPayments: MonthlyPayment[];
}

type MonthlyPayment = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};


const DEFAULT_INPUTS: CalculatorInputs = {
  apartmentPrice: 120_000,
  squareMeters: 65,
  downPaymentPercent: 20,
  annualInterestRate: 4.5,
  amortizationRate: 4,
  fixedCost: 3200,
  sellAfterYears: 5,
  agencyFeePercent: 2,
  transferTaxPercent: 2.5,
  bankFeePercent: 1,
  annuity: false,
};

export function getDefaultInputs(): CalculatorInputs {
  return { ...DEFAULT_INPUTS };
}

/** Standard annuity (fixed-rate) monthly payment. */
export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  termYears: number,
  fixedCost: number,
  annuuity,
): number {
  if (principal <= 0) return 0;
  if (termYears <= 0) return 0;

  const monthlyRate = annualRatePercent / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) {
    return principal / numPayments;
  }

  if(annuuity){
    const factor = Math.pow(1 + monthlyRate, numPayments);
    return ((principal * monthlyRate * factor) / (factor - 1))+fixedCost;
  }else{
  
        const averageMonthlyInterest =
        (principal / 2)  * (annualRatePercent / 100) / 12;

        return (
          principal / numPayments +
          averageMonthlyInterest +
          fixedCost
        );
  }
  
}

export function calculateAllMonthlyPayments(loan:number, annualInterestRate:number, amortizationYears:number, fixedCost:number) {
  const monthlyRateCoefficient = annualInterestRate / 100 / 12;
  const numberOfPayments = amortizationYears * 12;

  let balance = loan;

  const monthlyAmortization = loan / numberOfPayments;

  return Array.from({ length: numberOfPayments }, (_, index) => {
    const interest = balance * monthlyRateCoefficient;
    const principal = monthlyAmortization;
    const monthlyPayment = principal + interest + fixedCost;

    balance -= principal;

    // Avoid tiny floating-point errors at the end
    if (index === numberOfPayments - 1) {
      balance = 0;
    }

    return {
      month: index + 1,
      payment: monthlyPayment,
      principal,
      interest,
      balance
    };
  });
}



export function calculatePurchase(inputs: CalculatorInputs): CalculatorResult {
  const {
    apartmentPrice,
    squareMeters,
    downPaymentPercent,
    annualInterestRate,
    agencyFeePercent,
    transferTaxPercent,
    bankFeePercent,
    amortizationRate,
    fixedCost,
    sellAfterYears,
    annuity,
  } = inputs;

  const pricePerSqm = squareMeters > 0 ? apartmentPrice / squareMeters : 0;
  const downPaymentAmount = apartmentPrice * (downPaymentPercent / 100);
  const loanAmount = Math.max(0, apartmentPrice - downPaymentAmount);

 

  const loanTermYears = 100 / amortizationRate;
  const numPayments = Math.ceil(loanTermYears * 12);


  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    annualInterestRate,
    loanTermYears,
    fixedCost,
    annuity,
  );

  const totalMonthlyPayments = monthlyPayment * numPayments;
  const totalFixedCost = fixedCost * numPayments;
  const totalInterest = Math.max(0, totalMonthlyPayments - loanAmount - totalFixedCost);
  const interestPerMonth = totalInterest / numPayments;



  const agencyFee = apartmentPrice * (agencyFeePercent / 100);
  const transferTax = apartmentPrice * (transferTaxPercent / 100);
  const bankFee = loanAmount * (bankFeePercent / 100);

  const totalPurchaseCosts = agencyFee + transferTax + bankFee;
  const cashNeededAtPurchase = downPaymentAmount + totalPurchaseCosts;
  const totalCostOfOwnership =
    apartmentPrice + totalInterest + totalPurchaseCosts;

    // Get a plan of all monthly payments
  const allMonthlyPayments = calculateAllMonthlyPayments(loanAmount, annualInterestRate, loanTermYears, fixedCost);

  return {
    pricePerSqm,
    downPaymentAmount,
    loanAmount,
    monthlyPayment,
    totalMonthlyPayments,
    totalInterest,
    agencyFee,
    transferTax,
    bankFee,
    totalPurchaseCosts,
    totalCostOfOwnership,
    fixedCost,
    sellAfterYears,
    cashNeededAtPurchase,
    numPayments,
    annuity,
    interestPerMonth,
    allMonthlyPayments,
  };
}

export function compareDownPayments(
  baseInputs: CalculatorInputs,
  percentages: number[],
): Array<{ percent: number; result: CalculatorResult }> {
  return percentages.map((percent) => ({
    percent,
    result: calculatePurchase({ ...baseInputs, downPaymentPercent: percent }),
  }));
}
