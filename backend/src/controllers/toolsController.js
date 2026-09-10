const {
  simulateCreditCardTrap,
  evaluateBNPL,
  evaluateSubscriptions,
  calculateOpportunityCost
} = require('../engines/financeEngine');
const db = require('../config/db');

exports.simulateCreditCard = (req, res) => {
  const { balance = 50000, rate = 42, minPct = 5, minFloor = 500 } = req.body;
  const result = simulateCreditCardTrap({
    balance: Number(balance),
    annualRatePct: Number(rate),
    minimumPaymentPct: Number(minPct),
    minFloor: Number(minFloor)
  });
  return res.json(result);
};

exports.simulateBNPL = (req, res) => {
  const { orderAmount, installments, platformFee, lateFee } = req.body;
  const result = evaluateBNPL({
    orderAmount: Number(orderAmount),
    installments: Number(installments),
    platformFee: Number(platformFee),
    lateFee: Number(lateFee)
  });
  return res.json(result);
};

exports.calculateSubscriptions = (req, res) => {
  const { subscriptions = [] } = req.body;
  const result = evaluateSubscriptions(subscriptions);
  return res.json(result);
};

exports.calculateOpportunity = (req, res) => {
  const { dailyExpense = 200, returnPct = 11 } = req.body;
  const result = calculateOpportunityCost({
    dailyExpense: Number(dailyExpense),
    assumedAnnualReturnPct: Number(returnPct)
  });
  return res.json(result);
};

exports.recordQuizScore = (req, res) => {
  try {
    const { quizType, score, maxScore, answersLog } = req.body;
    const stmt = db.prepare(`
      INSERT INTO quiz_records (user_id, quiz_type, score, max_score, answers_log)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      req.user ? req.user.id : null,
      quizType || 'SCAM_VS_LEGIT',
      score,
      maxScore,
      JSON.stringify(answersLog || [])
    );
    return res.json({ success: true, recordId: result.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ error: 'Could not record score.' });
  }
};
