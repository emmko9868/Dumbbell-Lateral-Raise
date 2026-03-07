"use client";

import type { PoseLandmarkerResult } from "@mediapipe/tasks-vision";

// MediaPipe pose landmark indices
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_WRIST = 15;
const RIGHT_WRIST = 16;

// Threshold: wrist must be this many normalized units above shoulder
const THRESHOLD = 0.15;

export type ArmState = "up" | "down";

export interface RepCounterState {
  count: number;
  armState: ArmState;
  isUp: boolean;
}

export function createRepCounter(): RepCounterState {
  return { count: 0, armState: "down", isUp: false };
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

  // Check if either wrist is above corresponding shoulder by threshold
  const leftUp = leftShoulder.y - leftWrist.y > THRESHOLD;
  const rightUp = rightShoulder.y - rightWrist.y > THRESHOLD;
  const isUp = leftUp || rightUp;

  let { count, armState } = state;

  if (isUp && armState === "down") {
    armState = "up";
  } else if (!isUp && armState === "up") {
    armState = "down";
    count += 1;
  }

  return { count, armState, isUp };
}
