const { detectPatterns, extractFinancialParameters } = require('../engines/patternEngine');
const { evaluateLoanCommitment } = require('../engines/financeEngine');
const db = require('../config/db');
const Tesseract = require('tesseract.js');
const fs = require('fs');

exports.analyzeText = async (req, res) => {
  try {
    const { text, productType = 'General Loan' } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text input cannot be empty.' });
    }

    const patternResult = detectPatterns(text);
    const extractedParams = extractFinancialParameters(text);

    let commitmentData = null;
    if (extractedParams.emi || extractedParams.principal) {
      commitmentData = evaluateLoanCommitment({
        principal: extractedParams.principal || 200000,
        advertisedEMI: extractedParams.emi || 0,
        interestRate: extractedParams.interestRate || 13.5,
        tenureMonths: extractedParams.tenureMonths || 36
      });
    }

    const stmt = db.prepare(`
      INSERT INTO analyses (
        user_id, product_type, input_mode, raw_text, 
        advertised_figure, true_total_commitment, transparency_score,
        status_label, detected_patterns, calculation_breakdown
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user ? req.user.id : null,
      productType,
      'TEXT',
      text,
      extractedParams.emi ? `₹${extractedParams.emi.toLocaleString()}/mo` : 'Unspecified',
      commitmentData ? commitmentData.totalCommitment : null,
      patternResult.transparencyScore,
      patternResult.statusLabel,
      JSON.stringify(patternResult.detected),
      JSON.stringify({ extractedParams, commitmentData })
    );

    return res.json({
      analysisId: result.lastInsertRowid,
      transparencyScore: patternResult.transparencyScore,
      statusLabel: patternResult.statusLabel,
      detectedPatterns: patternResult.detected,
      extractedParams,
      commitmentData
    });
  } catch (err) {
    console.error('Analyze text error:', err);
    return res.status(500).json({ error: 'Failed to complete analysis.' });
  }
};

exports.analyzeManual = (req, res) => {
  try {
    const data = req.body;
    const commitment = evaluateLoanCommitment(data);

    let syntheticText = `Loan of ${data.principal} over ${data.tenureMonths} months. Monthly payment is ${commitment.monthlyPayment}. `;
    if (Number(data.processingFee) > 0 || Number(data.insuranceFee) > 0) {
      syntheticText += 'Processing fee, documentation charge, and mandatory protection apply. ';
    }
    if (Number(data.interestRate) === 0) {
      syntheticText += '0% interest free scheme. ';
    }

    const patternResult = detectPatterns(syntheticText);

    const stmt = db.prepare(`
      INSERT INTO analyses (
        user_id, product_type, input_mode, raw_text, 
        advertised_figure, true_total_commitment, transparency_score,
        status_label, detected_patterns, calculation_breakdown
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user ? req.user.id : null,
      data.productType || 'Structured Loan',
      'MANUAL',
      syntheticText,
      `₹${commitment.monthlyPayment.toLocaleString()}/mo`,
      commitment.totalCommitment,
      patternResult.transparencyScore,
      patternResult.statusLabel,
      JSON.stringify(patternResult.detected),
      JSON.stringify(commitment)
    );

    return res.json({
      analysisId: result.lastInsertRowid,
      commitment,
      transparencyScore: patternResult.transparencyScore,
      statusLabel: patternResult.statusLabel,
      detectedPatterns: patternResult.detected
    });
  } catch (err) {
    console.error('Manual analyze error:', err);
    return res.status(500).json({ error: 'Manual calculation failed.' });
  }
};

exports.analyzeOCR = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file required.' });
  }

  const filePath = req.file.path;
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    fs.unlink(filePath, () => {});

    if (!text || text.trim().length === 0) {
      return res.status(422).json({ error: 'Could not extract legible text. Please upload a clear, high-contrast screenshot.' });
    }

    const patternResult = detectPatterns(text);
    const extractedParams = extractFinancialParameters(text);

    let commitmentData = null;
    if (extractedParams.emi || extractedParams.principal) {
      commitmentData = evaluateLoanCommitment({
        principal: extractedParams.principal || 100000,
        advertisedEMI: extractedParams.emi || 0,
        interestRate: extractedParams.interestRate || 14,
        tenureMonths: extractedParams.tenureMonths || 24
      });
    }

    return res.json({
      extractedText: text,
      transparencyScore: patternResult.transparencyScore,
      statusLabel: patternResult.statusLabel,
      detectedPatterns: patternResult.detected,
      extractedParams,
      commitmentData
    });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error('OCR Error:', err);
    return res.status(500).json({ error: 'OCR scanning failed.' });
  }
};
