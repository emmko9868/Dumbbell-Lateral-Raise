"use client";

import type { PoseLandmarkerResult } from "@mediapipe/tasks-vision";

// MediaPipe pose landmark indices
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_WRIST = 15;
const RIGHT_WRIST = 16;

// THRESHOLD: shoulder.y - wrist.y > this = arm starts counting as "up" (≈80°)
const THRESHOLD = -0.05;
// LIFT_RANGE: additional normalized units above threshold = full lift (liftAmount=1)
const LIFT_RANGE = 0.20;

export type ArmState = "up" | "down";

export interface RepCounterState {
  count: number;
  armState: ArmState;
  isUp: boolean;
  liftAmount: number; // 0 = at threshold (80°), 1 = fully raised
}

export function createRepCounter(): RepCounterState {
  return { count: 0, armState: "down", isUp: false, liftAmount: 0 };
}

/**
 * Processes a pose result and returns updated rep counter state.
 * In image coords: y increases downward, so wrist.y < shoulder.y means wrist is above shoulder.
 */
export function processPoseResult(
  state: RepCounterState,
  result: PoseLandmarkerResult
): RepCounterState {
  if (!result.landmarks || result.landmarks.length === 0) return state;

  const landmarks = result.landmarks[0];
  const leftShoulder = landmarks[LEFT_SHOULDER];
  const rightShoulder = landmarks[RIGHT_SHOULDER];
  const leftWrist = landmarks[LEFT_WRIST];
  const rightWrist = landmarks[RIGHT_WRIST];

  if (!leftShoulder || !rightShoulder || !leftWrist || !rightWrist)
    return state;

  // Compute how much each arm is above threshold (0 = at threshold, 1 = fully raised)
  const leftRaw = leftShoulder.y - leftWrist.y - THRESHOLD;
  const rightRaw = rightShoulder.y - rightWrist.y - THRESHOLD;
  const rawLift = Math.max(leftRaw, rightRaw);
  const liftAmount = Math.min(1, Math.max(0, rawLift / LIFT_RANGE));
  const isUp = liftAmount > 0;

  let { count, armState } = state;

  if (isUp && armState === "down") {
    armState = "up";
  } else if (!isUp && armState === "up") {
    armState = "down";
    count += 1;
  }

  return { count, armState, isUp, liftAmount };
}
