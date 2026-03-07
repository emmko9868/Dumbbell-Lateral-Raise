/**
 * Returns a motivational message based on reps count (from E_content-data.md).
 */
export function getMotivationMessage(reps: number): string {
  if (reps < 10) return "시작이 반이야! 내일은 두 배로 😤";
  if (reps < 20) return "오늘 잘했어. 어깨가 기억하고 있어 💪";
  if (reps < 40) return "진짜 불타오르는 중 🔥";
  if (reps < 50) return "어깨 라인 보이기 시작할 거야 👊";
  return "진짜 어깨 깡패 등극 👑";
}

export function getResultTitle(reps: number, isNewRecord: boolean): string {
  return isNewRecord ? "신기록! 🎉" : "오늘도 깡패!";
}

export function getShareText(reps: number): string {
  return `나 오늘 ${reps}회 했어. 어깨 깡패 도전 중 💪`;
}
