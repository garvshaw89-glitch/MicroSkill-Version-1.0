import { ReviewSchedule, MasteryStatus, Concept } from '../types';

export interface MasteryResult {
  masteryLevel: number;
  status: MasteryStatus;
  intervalDays: number;
  nextReviewDate: string;
  confidenceCalibration: number;
  difficultyAdjustment: number;
}

/**
 * Calculates updated mastery level and spaced repetition interval
 * based on PRD equations.
 */
export function calculateMasteryAndSchedule(
  currentSchedule: ReviewSchedule | null,
  concept: Concept,
  sessionAccuracy: number, // 0.0 - 1.0
  avgConfidenceRating: number, // 1 to 5 scale
  currentDifficulty: number, // 0.5 - 3.0
  historicalAccuracies: number[] = []
): MasteryResult {
  // 1. Convert 1-5 confidence rating to 0.2-1.0 scale
  const normalizedConfidence = Math.min(1.0, Math.max(0.2, avgConfidenceRating / 5));
  
  // 2. Confidence calibration = 1 - |stated_confidence - actual_accuracy|
  const confidenceCalibration = Math.max(0, 1 - Math.abs(normalizedConfidence - sessionAccuracy));

  // 3. Rolling 30d accuracy calculation
  const allAccuracies = [...historicalAccuracies, sessionAccuracy];
  const rolling30dAccuracy = allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length;

  // 4. Consistency metric (lower variance = higher consistency)
  let consistency = 0.8;
  if (allAccuracies.length >= 2) {
    const mean = rolling30dAccuracy;
    const variance = allAccuracies.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / allAccuracies.length;
    const stdDev = Math.sqrt(variance);
    consistency = Math.max(0, Math.min(1, 1 - stdDev * 2));
  }

  // 5. Composite Mastery Score
  // mastery = (accuracy * 0.6) + (confidence_calibration * 0.3) + (consistency * 0.1)
  const masteryLevel = Math.max(
    0.05,
    Math.min(0.99, Number(((rolling30dAccuracy * 0.6) + (confidenceCalibration * 0.3) + (consistency * 0.1)).toFixed(2)))
  );

  // 6. Status Determination
  let status: MasteryStatus = 'UNFAMILIAR';
  if (masteryLevel >= 0.9) {
    status = 'MASTERED';
  } else if (masteryLevel >= 0.7) {
    status = 'PROFICIENT';
  } else if (masteryLevel >= 0.3) {
    status = 'LEARNING';
  }

  // 7. Interval Days determination
  let intervalDays = 1;
  const reviewCount = (currentSchedule?.reviewCount || 0) + 1;

  if (masteryLevel < 0.3) {
    intervalDays = 1;
  } else if (masteryLevel < 0.7) {
    // 3 -> 7 -> 14 days
    if (reviewCount <= 1) intervalDays = 3;
    else if (reviewCount === 2) intervalDays = 7;
    else intervalDays = 14;
  } else if (masteryLevel < 0.9) {
    // 21 -> 30 -> 60 days
    if (reviewCount <= 4) intervalDays = 21;
    else if (reviewCount === 5) intervalDays = 30;
    else intervalDays = 60;
  } else {
    // Mastered -> 90 days maintenance
    intervalDays = 90;
  }

  // Adjust interval based on confidence alignment & difficulty
  if (confidenceCalibration > 0.85 && sessionAccuracy > 0.8) {
    intervalDays = Math.round(intervalDays * 1.25);
  } else if (sessionAccuracy < 0.6) {
    intervalDays = Math.max(1, Math.round(intervalDays * 0.5));
  }

  // Calculate Next Review Date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  // 8. Session Difficulty Adjustment (±0.3)
  let difficultyAdjustment = 0;
  if (sessionAccuracy > 0.85) {
    difficultyAdjustment = 0.3;
  } else if (sessionAccuracy < 0.60) {
    difficultyAdjustment = -0.3;
  }

  return {
    masteryLevel,
    status,
    intervalDays,
    nextReviewDate: nextDate.toISOString(),
    confidenceCalibration: Number(confidenceCalibration.toFixed(2)),
    difficultyAdjustment,
  };
}

/**
 * Clamp difficulty within concept limits [0.5, 3.0]
 */
export function clampDifficulty(newDiff: number, concept?: Concept): number {
  const min = concept ? concept.minDifficulty : 0.5;
  const max = concept ? concept.maxDifficulty : 3.0;
  return Number(Math.max(min, Math.min(max, newDiff)).toFixed(1));
}
