/**
 * Exact Standard Reducing-Balance EMI Calculation
 * Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
 */
function calculateEMI(principal, annualRatePct, tenureMonths) {
  const p = Number(principal);
  const n = Number(tenureMonths);
  const rate = Number(annualRatePct);

  if (!p || p <= 0 || !n || n <= 0) return 0;
  if (!rate || rate <= 0) return Math.round((p / n) * 100) / 100;

  const r = rate / (12 * 100);
  const factor = Math.pow(1 + r, n);
  const emi = (p * r * factor) / (factor - 1);
  return Math.round(emi * 100) / 100;
}

/**
 * Exact Internal Rate of Return (IRR) / APR Root-Finder using Bisection Method
 * Solves: Net_Disbursed = Sum(EMI / (1 + r)^t)
 */
function calculateExactAPR(principal, totalUpfrontFees, emi, tenureMonths) {
  const netDisbursed = principal - totalUpfrontFees;
  if (netDisbursed <= 0 || emi <= 0 || tenureMonths <= 0) return 0;

  let low = 0.00001;
  let high = 5.0; // 500% monthly rate upper bound
  let monthlyRate = 0;

  for (let i = 0; i < 60; i++) {
    monthlyRate = (low + high) / 2;
    let npv = 0;
    for (let t = 1; t <= tenureMonths; t++) {
      npv += emi / Math.pow(1 + monthlyRate, t);
    }

    if (Math.abs(npv - netDisbursed) < 0.001) break;
    if (npv > netDisbursed) {
      low = monthlyRate;
    } else {
      high = monthlyRate;
    }
  }

  const annualizedRate = monthlyRate * 12 * 100;
  return Math.round(annualizedRate * 100) / 100;
}

/**
 * Evaluates Full Loan Commitment & Hidden Friction Outlays
 */
function evaluateLoanCommitment({
  principal = 0,
  advertisedEMI = 0,
  interestRate = 0,
  tenureMonths = 0,
  processingFee = 0,
  documentationFee = 0,
  insuranceFee = 0,
  otherCharges = 0,
  downPayment = 0
}) {
  const p = Math.max(0, Number(principal) || 0);
  const t = Math.max(1, Number(tenureMonths) || 12);
  const fees = (Number(processingFee) || 0) + 
               (Number(documentationFee) || 0) + 
               (Number(insuranceFee) || 0) + 
               (Number(otherCharges) || 0);
  
  let computedMonthlyPayment = Number(advertisedEMI);
  if (!computedMonthlyPayment || computedMonthlyPayment <= 0) {
    computedMonthlyPayment = calculateEMI(p, Number(interestRate) || 0, t);
  }

  const totalEMIPayments = Math.round(computedMonthlyPayment * t);
  const totalCommitment = totalEMIPayments + fees + (Number(downPayment) || 0);
  const totalInterestCost = Math.max(0, totalEMIPayments - p);
  const feesPercentageOfPrincipal = p > 0 ? Math.round((fees / p) * 10000) / 100 : 0;

  const exactAPR = calculateExactAPR(p, fees, computedMonthlyPayment, t);

  return {
    principal: p,
    tenureMonths: t,
    monthlyPayment: computedMonthlyPayment,
    totalEMIPayments,
    ancillaryFeesTotal: fees,
    downPayment: Number(downPayment) || 0,
    totalCommitment,
    totalInterestCost,
    effectiveAPR: exactAPR > 0 ? exactAPR : Number(interestRate) || 0,
    feesPercentageOfPrincipal,
    repaymentRatio: p > 0 ? Math.round((totalCommitment / p) * 100) / 100 : 1
  };
}

/**
 * Simulates Revolving Credit Card Minimum Payment Trap
 * In India/global retail banking: 36%-45% APR + 18% GST on interest charges
 */
function simulateCreditCardTrap({
  balance = 50000,
  annualRatePct = 42,
  minimumPaymentPct = 5,
  minFloor = 500,
  includeGST = true
}) {
  let remaining = Number(balance);
  const baseMonthlyRate = (Number(annualRatePct) / 100) / 12;
  const gstRate = includeGST ? 0.18 : 0.0;
  let months = 0;
  let totalInterest = 0;
  let totalGST = 0;
  let totalPaid = 0;
  const schedule = [];

  while (remaining > 50 && months < 240) {
    months++;
    const monthlyInterest = remaining * baseMonthlyRate;
    const monthlyGSTOnInterest = monthlyInterest * gstRate;
    const totalMonthFinanceCharge = monthlyInterest + monthlyGSTOnInterest;

    let minPayment = Math.max(minFloor, remaining * (minimumPaymentPct / 100));
    if (minPayment > remaining + totalMonthFinanceCharge) {
      minPayment = remaining + totalMonthFinanceCharge;
    }

    const principalReduction = Math.max(0, minPayment - totalMonthFinanceCharge);
    totalInterest += monthlyInterest;
    totalGST += monthlyGSTOnInterest;
    totalPaid += minPayment;
    remaining = Math.max(0, remaining - principalReduction);

    if (months <= 12 || months % 12 === 0 || remaining === 0) {
      schedule.push({
        month: months,
        paidToDate: Math.round(totalPaid),
        interestToDate: Math.round(totalInterest + totalGST),
        remainingBalance: Math.round(remaining)
      });
    }
  }

  return {
    initialBalance: Number(balance),
    annualRatePct: Number(annualRatePct),
    monthsToPayOff: months >= 240 ? '20+ years (Perpetual Trap)' : months,
    totalInterestPaid: Math.round(totalInterest),
    totalGSTPaid: Math.round(totalGST),
    totalPaidOverall: Math.round(totalPaid),
    interestToPrincipalMultiplier: balance > 0 ? Math.round(((totalInterest + totalGST) / balance) * 100) / 100 : 0,
    schedule
  };
}

/**
 * BNPL Late Fee & Effective Penalty APR Evaluator
 */
function evaluateBNPL({ orderAmount = 3000, installments = 3, platformFee = 99, lateFee = 350, defaultRiskDays = 15 }) {
  const p = Number(orderAmount);
  const inst = Math.max(1, Number(installments));
  const installmentAmount = Math.round((p / inst) * 100) / 100;
  const baseTotal = p + Number(platformFee);

  // If one installment is missed, calculate penalty APR equivalent
  const lateCost = Number(platformFee) + Number(lateFee);
  const annualizedPenaltyRate = ((lateCost / p) * (365 / defaultRiskDays) * 100).toFixed(1);

  return {
    orderAmount: p,
    installments: inst,
    installmentAmount,
    platformFee: Number(platformFee),
    baseTotal,
    lateFee: Number(lateFee),
    totalWithOneLateFee: baseTotal + Number(lateFee),
    annualizedPenaltyRate: Number(annualizedPenaltyRate),
    insight: `A ₹${lateFee} late fee on a ₹${installmentAmount} installment acts like a ${annualizedPenaltyRate}% APR borrowing charge.`
  };
}

/**
 * Evaluates Recurring Subscription Leakage
 */
function evaluateSubscriptions(subsList = []) {
  let monthlyTotal = 0;
  const categorized = [];

  for (const item of subsList) {
    const cost = Number(item.cost) || 0;
    const interval = item.interval === 'yearly' ? 1 / 12 : 1;
    const normalizedMonthly = Math.round(cost * interval);
    monthlyTotal += normalizedMonthly;
    categorized.push({
      title: item.title,
      monthlyCost: normalizedMonthly,
      yearlyCost: normalizedMonthly * 12
    });
  }

  const yearlyTotal = monthlyTotal * 12;
  const fiveYearInvestedAt11Pct = Math.round(monthlyTotal * ((Math.pow(1 + 0.11 / 12, 60) - 1) / (0.11 / 12)));

  return {
    monthlyTotal,
    yearlyTotal,
    fiveYearInvestedAt11Pct,
    items: categorized
  };
}

/**
 * Opportunity Cost Projection
 */
function calculateOpportunityCost({ dailyExpense = 200, assumedAnnualReturnPct = 11 }) {
  const expense = Number(dailyExpense);
  const monthly = expense * 30;
  const yearly = expense * 365;
  const r = (Number(assumedAnnualReturnPct) / 100) / 12;

  const calcFV = (months) => {
    return Math.round(monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r));
  };

  return {
    daily: expense,
    monthlyExpense: monthly,
    oneYearCost: yearly,
    fiveYearCost: yearly * 5,
    tenYearCost: yearly * 10,
    hypotheticalInvested5Yr: calcFV(60),
    hypotheticalInvested10Yr: calcFV(120),
    disclaimer: 'Projections are educational compound growth calculations based on monthly compounding. Not a guarantee of market returns.'
  };
}

module.exports = {
  calculateEMI,
  calculateExactAPR,
  evaluateLoanCommitment,
  simulateCreditCardTrap,
  evaluateBNPL,
  evaluateSubscriptions,
  calculateOpportunityCost
};
