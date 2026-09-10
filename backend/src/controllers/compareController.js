const { evaluateLoanCommitment } = require('../engines/financeEngine');
const db = require('../config/db');

exports.compareOffers = (req, res) => {
  try {
    const { offerA, offerB, productName = 'Comparative Evaluation' } = req.body;
    if (!offerA || !offerB) {
      return res.status(400).json({ error: 'Both Offer A and Offer B are required.' });
    }

    const resultA = evaluateLoanCommitment(offerA);
    const resultB = evaluateLoanCommitment(offerB);

    const deltaTotal = resultA.totalCommitment - resultB.totalCommitment;
    const deltaInterest = resultA.totalInterestCost - resultB.totalInterestCost;
    const deltaFees = resultA.ancillaryFeesTotal - resultB.ancillaryFeesTotal;

    let verdict = '';
    let winner = null;

    if (Math.abs(deltaTotal) < 1000) {
      verdict = 'Both options have virtually identical aggregate commitments. Prefer the offer with lower upfront fees and simpler pre-payment terms.';
      winner = 'TIE';
    } else if (deltaTotal > 0) {
      winner = 'B';
      verdict = `Offer B saves approx ₹${Math.abs(deltaTotal).toLocaleString()} overall. Even if Offer A advertises lower monthly payments, its longer tenure or hidden fees inflate total cost.`;
    } else {
      winner = 'A';
      verdict = `Offer A saves approx ₹${Math.abs(deltaTotal).toLocaleString()} in lifetime outflows. Offer B's lower headline rate is offset by its high upfront fees.`;
    }

    const summary = {
      winner,
      verdict,
      deltaTotal: Math.abs(deltaTotal),
      deltaInterest,
      deltaFees
    };

    // Save comparison log
    const stmt = db.prepare(`
      INSERT INTO comparisons (user_id, product_name, offer_a_payload, offer_b_payload, comparison_summary)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      req.user ? req.user.id : null,
      productName,
      JSON.stringify(resultA),
      JSON.stringify(resultB),
      JSON.stringify(summary)
    );

    return res.json({
      offerA: resultA,
      offerB: resultB,
      summary
    });
  } catch (err) {
    console.error('Compare error:', err);
    return res.status(500).json({ error: 'Failed to process comparison.' });
  }
};
