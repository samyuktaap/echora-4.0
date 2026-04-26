/**
 * logisticRegression.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure-JS logistic regression engine for NGO application approval prediction.
 *
 * Feature vector per application:
 *   x0  – match_score          (0-100, normalised to 0-1)
 *   x1  – has_message          (1 if volunteer wrote a message, else 0)
 *   x2  – message_length       (char count, log-scaled & normalised)
 *   x3  – dob_known            (1 if DOB field is present)
 *   x4  – address_quality      (1 if address has comma → seems real)
 *   x5  – id_proof_complete    (1 if id_proof_number is not placeholder)
 *
 * Label:
 *   1 = approved, 0 = rejected
 *
 * Training: mini-batch gradient descent (pure JS, no deps).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Sigmoid ──────────────────────────────────────────────────────────────────
export function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

// ── Feature extraction ───────────────────────────────────────────────────────
export function extractFeatures(app) {
  const matchScore = (app.match_score ?? 0) / 100; // normalise 0→1
  const hasMessage = app.message && app.message.trim().length > 0 ? 1 : 0;
  const msgLen = Math.min(Math.log1p(app.message?.length ?? 0) / Math.log1p(500), 1);
  const dobKnown = app.dob && app.dob !== '2000-01-01' ? 1 : 0; // exclude default placeholder
  const addressQuality = app.address && app.address.includes(',') ? 1 : 0;
  const idComplete =
    app.id_proof_number &&
    !app.id_proof_number.includes('X') &&
    app.id_proof_number.length > 5
      ? 1
      : 0;

  return [matchScore, hasMessage, msgLen, dobKnown, addressQuality, idComplete];
}

// ── Predict (single sample) ──────────────────────────────────────────────────
export function predict(weights, bias, features) {
  const z = features.reduce((acc, xi, i) => acc + xi * weights[i], bias);
  return sigmoid(z);
}

// ── Train ────────────────────────────────────────────────────────────────────
/**
 * @param {Array<{features: number[], label: number}>} trainingData
 * @param {object} opts  { lr, epochs }
 * @returns {{ weights: number[], bias: number, trained: boolean, accuracy: number }}
 */
export function trainLogisticRegression(trainingData, opts = {}) {
  const lr = opts.lr ?? 0.1;
  const epochs = opts.epochs ?? 800;
  const n = trainingData.length;

  if (n < 2) {
    // Not enough data – return a sensible default model biased toward match_score
    return {
      weights: [2.5, 0.5, 0.3, 0.1, 0.1, 0.1],
      bias: -1.2,
      trained: false,
      accuracy: null,
    };
  }

  const numFeatures = trainingData[0].features.length;
  let weights = new Array(numFeatures).fill(0);
  let bias = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    let dw = new Array(numFeatures).fill(0);
    let db = 0;

    for (const { features, label } of trainingData) {
      const yHat = predict(weights, bias, features);
      const error = yHat - label;
      for (let j = 0; j < numFeatures; j++) {
        dw[j] += error * features[j];
      }
      db += error;
    }

    for (let j = 0; j < numFeatures; j++) {
      weights[j] -= (lr / n) * dw[j];
    }
    bias -= (lr / n) * db;
  }

  // Compute training accuracy
  let correct = 0;
  for (const { features, label } of trainingData) {
    const prob = predict(weights, bias, features);
    if ((prob >= 0.5 ? 1 : 0) === label) correct++;
  }
  const accuracy = Math.round((correct / n) * 100);

  return { weights, bias, trained: true, accuracy };
}

// ── Score all applications ────────────────────────────────────────────────────
/**
 * Given all applications (any status), trains on approved/rejected history
 * and returns predictions for pending ones.
 *
 * @param {object[]} allApplications – raw supabase rows
 * @returns {{ modelMeta: object, predictions: Map<string, { prob: number, recommendation: string }> }}
 */
export function scoreApplications(allApplications) {
  // Build training set from historical decisions
  const trainingData = allApplications
    .filter(a => a.status === 'approved' || a.status === 'rejected')
    .map(a => ({
      features: extractFeatures(a),
      label: a.status === 'approved' ? 1 : 0,
    }));

  const model = trainLogisticRegression(trainingData);

  // Score every application (not just pending) so UI can display it
  const predictions = new Map();
  for (const app of allApplications) {
    const features = extractFeatures(app);
    const prob = predict(model.weights, model.bias, features);
    const pct = Math.round(prob * 100);

    let recommendation, color;
    if (pct >= 70) {
      recommendation = 'Approve';
      color = '#22c55e';
    } else if (pct >= 45) {
      recommendation = 'Review';
      color = '#f59e0b';
    } else {
      recommendation = 'Reject';
      color = '#ef4444';
    }

    predictions.set(app.id, { prob, pct, recommendation, color });
  }

  return { modelMeta: model, predictions };
}
