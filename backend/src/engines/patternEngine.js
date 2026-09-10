/**
 * FinLens Deterministic Dark Pattern Engine
 * Categorizes and scores manipulative framing tactics without paid API dependencies.
 */

const PATTERN_DEFINITIONS = [
  {
    id: 'monthly_payment_framing',
    name: 'Monthly Payment Framing',
    severity: 'high',
    weight: 22,
    regex: /(?:only|just|starting\s+(?:at|from))\s*(?:₹|rs\.?|inr)?\s*([\d,]+)\s*(?:\/|\s*per\s*)?(?:mo|month|pm)/i,
    description: 'Accentuates an artificially small recurring installment while de-emphasizing multi-year total liabilities.',
    whyItMatters: 'Anchors consumer cognitive attention on manageable payments, obscuring substantial total cumulative interest.',
    action: 'Multiply the monthly installment by total tenure months and compare against the cash purchase price.'
  },
  {
    id: 'artificial_urgency',
    name: 'Artificial Urgency & Scarcity',
    severity: 'medium',
    weight: 16,
    regex: /\b(hurry|limited\s*time|expires\s*(?:today|soon)|act\s*now|last\s*chance|offer\s*ends\s*(?:in|today)|only\s*\d+\s*(?:slots?|seats?|left)|instant\s*approval\s*today)\b/i,
    description: 'Imposes synthetic scarcity or artificial timers to induce impulsive credit commitments.',
    whyItMatters: 'Triggers fear of missing out (FOMO) and stops consumers from vetting Key Fact Statements (KFS).',
    action: 'Enforce a personal 24-hour cooling-off delay. Genuine credit rates do not expire within minutes.'
  },
  {
    id: 'hidden_ancillary_fees',
    name: 'Hidden / Drip Ancillary Fees',
    severity: 'high',
    weight: 25,
    regex: /\b(processing\s*fee|convenience\s*fee|platform\s*fee|documentation\s*charge|admin\s*fee|origination\s*fee|verification\s*charge)\b/i,
    description: 'Mandatory processing and platform fees are separated from headline interest figures.',
    whyItMatters: 'Upfront deductions mean the net disbursed capital is lower than the balance accruing interest.',
    action: 'Request an all-inclusive Annual Percentage Rate (APR) disclosure including all upfront deductions.'
  },
  {
    id: 'zero_percent_illusion',
    name: 'Zero-Cost / 0% Interest Framing',
    severity: 'medium',
    weight: 18,
    regex: /\b(0%\s*(?:interest|emi)|zero\s*interest|no\s*cost\s*emi|interest\s*free|free\s*financing)\b/i,
    description: 'Frames financing as free while the financing cost is absorbed via forfeited cash discounts or processing fees.',
    whyItMatters: 'Retailers forfeit 5-10% cash discount margins to banks, and GST is levied on the underlying interest payment.',
    action: 'Ask the merchant for the upfront cash/UPI discount price before choosing No-Cost EMI.'
  },
  {
    id: 'guaranteed_return_hype',
    name: 'Unsubstantiated Return Claims',
    severity: 'high',
    weight: 30,
    regex: /\b(guaranteed\s*(?:returns?|profit|income)|risk[- ]free|double\s*your\s*money|fixed\s*(?:high\s*)?returns?|100%\s*safe)\b/i,
    description: 'Claims zero-risk elevated financial returns while obscuring counterparty or credit risk.',
    whyItMatters: 'Violates core financial risk-return parity. Promoted by unregulated schemes to mislead investors.',
    action: 'Verify SEBI / RBI registration and verify whether any capital protection guarantee exists in writing.'
  },
  {
    id: 'preselected_add_ons',
    name: 'Pre-selected Opt-in Add-ons',
    severity: 'medium',
    weight: 15,
    regex: /\b(opt-?out|insurance\s*(?:included|bundled|mandatory)|pre-?selected|protection\s*plan\s*(?:added|applied)|credit\s*shield)\b/i,
    description: 'Bundles loan protection insurance or optional riders into the default checkout funnel.',
    whyItMatters: 'Capitalizes additional charges into the principal, resulting in interest charged on top of insurance fees.',
    action: 'Look for pre-ticked checkboxes and opt out unless you have verified the insurer and policy schedule.'
  },
  {
    id: 'fine_print_obfuscation',
    name: 'Fine Print & Asterisk Hedging',
    severity: 'low',
    weight: 10,
    regex: /\b(\*conditions?\s*apply|\*t&c\s*apply|subject\s*to\s*approval|indicative\s*only|rates\s*subject\s*to\s*change)\b/i,
    description: 'Buries critical qualification criteria and rate variability inside microscopic footnotes.',
    whyItMatters: 'Promotional rates are usually reserved for credit scores above 800; average borrowers receive much higher rates.',
    action: 'Demand confirmation of the exact rate tier applicable to your specific CIBIL/Experian credit profile.'
  }
];

function extractFinancialParameters(rawText) {
  const clean = rawText.replace(/\n/g, ' ');
  
  let principal = null;
  const lakhMatch = clean.match(/(?:₹|rs\.?|inr)?\s*([\d\.]+)\s*(?:lakhs?|lac|l)\b/i);
  if (lakhMatch) {
    principal = parseFloat(lakhMatch[1]) * 100000;
  } else {
    const directAmount = clean.match(/(?:loan\s*(?:of)?|get|amount|upto|up\s*to|worth)\s*(?:₹|rs\.?|inr)?\s*([\d,]{4,})/i);
    if (directAmount) {
      principal = parseFloat(directAmount[1].replace(/,/g, ''));
    }
  }

  let emi = null;
  const emiMatch = clean.match(/(?:emi|only|just|pay)\s*(?:of|is|at)?\s*(?:₹|rs\.?|inr)?\s*([\d,]{3,})\s*(?:\/|\s*per\s*)?(?:mo|month|pm)?/i);
  if (emiMatch) {
    emi = parseFloat(emiMatch[1].replace(/,/g, ''));
  }

  let tenureMonths = null;
  const tenureYrMatch = clean.match(/(\d+)\s*(?:years?|yrs?)/i);
  const tenureMoMatch = clean.match(/(\d+)\s*(?:months?|mos?)/i);
  if (tenureYrMatch) {
    tenureMonths = parseInt(tenureYrMatch[1], 10) * 12;
  } else if (tenureMoMatch) {
    tenureMonths = parseInt(tenureMoMatch[1], 10);
  }

  let interestRate = null;
  const rateMatch = clean.match(/([\d\.]+)\s*%\s*(?:p\.?a\.?|per\s*annum|interest|roi)?/i);
  if (rateMatch) {
    interestRate = parseFloat(rateMatch[1]);
  }

  return { principal, emi, tenureMonths, interestRate };
}

function detectPatterns(text) {
  if (!text || typeof text !== 'string') {
    return { detected: [], transparencyScore: 100, statusLabel: 'Highly Transparent', totalPenaltiesApplied: 0 };
  }

  const detected = [];
  let totalPenalty = 0;

  for (const pat of PATTERN_DEFINITIONS) {
    const match = text.match(pat.regex);
    if (match) {
      detected.push({
        id: pat.id,
        name: pat.name,
        severity: pat.severity,
        weight: pat.weight,
        evidence: match[0],
        description: pat.description,
        whyItMatters: pat.whyItMatters,
        action: pat.action
      });
      totalPenalty += pat.weight;
    }
  }

  const score = Math.max(10, Math.min(100, 100 - totalPenalty));

  let statusLabel = 'Highly Transparent';
  if (score < 45) {
    statusLabel = 'Low Transparency / Heavy Dark Patterns';
  } else if (score < 75) {
    statusLabel = 'Moderately Transparent / Exercise Caution';
  }

  return {
    detected,
    transparencyScore: score,
    statusLabel,
    totalPenaltiesApplied: totalPenalty
  };
}

module.exports = {
  detectPatterns,
  extractFinancialParameters,
  PATTERN_DEFINITIONS
};
