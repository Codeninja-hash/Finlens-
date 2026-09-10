const db = require('../config/db');

function seedDatabase() {
  console.log('[FinLens Seed] Checking and seeding default demo audits...');

  const count = db.prepare('SELECT COUNT(*) as cnt FROM analyses').get().cnt;
  if (count > 0) {
    console.log(`[FinLens Seed] Database already has ${count} records. Skipping initial seeding.`);
    return;
  }

  const insertStmt = db.prepare(`
    INSERT INTO analyses (
      user_id, product_type, input_mode, raw_text, 
      advertised_figure, true_total_commitment, transparency_score,
      status_label, detected_patterns, calculation_breakdown
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const demoItems = [
    {
      product_type: 'Personal Loan',
      input_mode: 'TEXT',
      raw_text: 'Instant Cash Loan! Get ₹5,00,000 disbursed in 5 minutes at just ₹9,499/mo! 0% processing fee for today only! Hurry, only 5 slots left. *T&C apply.',
      advertised_figure: '₹9,499/mo',
      true_total_commitment: 683940,
      transparency_score: 38,
      status_label: 'Low Transparency / Heavy Dark Patterns',
      detected_patterns: JSON.stringify([
        {
          id: 'monthly_payment_framing',
          name: 'Monthly Payment Framing',
          severity: 'high',
          evidence: 'at just ₹9,499/mo',
          description: 'Anchors borrower on recurring installment while masking 60-month total repayment of ₹5,69,940 + hidden charges.'
        },
        {
          id: 'artificial_urgency',
          name: 'Artificial Urgency & Scarcity',
          severity: 'medium',
          evidence: 'Hurry, only 5 slots left',
          description: 'Uses manufactured countdown to block thoughtful review of loan terms.'
        },
        {
          id: 'fine_print_obfuscation',
          name: 'Fine Print & Ambiguous Conditions',
          severity: 'low',
          evidence: '*T&C apply',
          description: 'Relegates critical conditions to tiny disclaimers.'
        }
      ]),
      calculation_breakdown: JSON.stringify({
        principal: 500000,
        tenureMonths: 60,
        monthlyPayment: 9499,
        totalEMIPayments: 569940,
        ancillaryFeesTotal: 14000,
        totalCommitment: 683940,
        effectiveAPR: 15.8
      })
    },
    {
      product_type: 'Consumer Electronics EMI',
      input_mode: 'TEXT',
      raw_text: 'Flagship Smartphone: No Cost EMI starting at ₹3,333/month for 24 months. Zero interest, zero down payment.',
      advertised_figure: '₹3,333/mo (No Cost)',
      true_total_commitment: 84490,
      transparency_score: 52,
      status_label: 'Moderately Transparent / Exercise Caution',
      detected_patterns: JSON.stringify([
        {
          id: 'zero_percent_illusion',
          name: 'Zero-Cost / 0% Interest Framing',
          severity: 'medium',
          evidence: 'No Cost EMI',
          description: 'Upfront cash discount is stripped to compensate lending partner; GST on interest is added to bill.'
        }
      ]),
      calculation_breakdown: JSON.stringify({
        principal: 79990,
        tenureMonths: 24,
        monthlyPayment: 3333,
        totalEMIPayments: 79992,
        ancillaryFeesTotal: 4498,
        totalCommitment: 84490,
        effectiveAPR: 9.4
      })
    }
  ];

  for (const item of demoItems) {
    insertStmt.run(
      null,
      item.product_type,
      item.input_mode,
      item.raw_text,
      item.advertised_figure,
      item.true_total_commitment,
      item.transparency_score,
      item.status_label,
      item.detected_patterns,
      item.calculation_breakdown
    );
  }

  console.log('[FinLens Seed] Successfully inserted demo seed audits.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
