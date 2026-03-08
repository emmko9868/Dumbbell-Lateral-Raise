export type Locale = "ko" | "zh-TW";

export interface Translations {
  appName: string;
  appSub: string;
  unit: string;
  onboarding: { badge: string; placeholder: string; cta: string; loading: string; dupError: string };
  home: { greeting: string };
  today: { label: string; done: string; notDone: string; startCta: string; doneCta: string };
  streak: { unit: string; zero: string };
  ranking: {
    title: string; realtime: string; realtimeFull: string;
    participants: (n: number) => string;
    king: string; me: string; empty: string; viewAll: string;
  };
  calendar: { title: string; totalDays: string; streakUnit: string };
  profile: { back: string; totalDays: string; streakUnit: string; noRecord: string; notFound: string };
  exercise: {
    back: string; flapCount: (n: number) => string; cameraLoading: string; tapMode: string;
    armUp: (pct: number) => string; armDown: string; gameStart: string; gameStartTap: string;
    bestScore: string; retry: string; save: string; saving: string; switchCamera: string;
    dinoStart: string; dinoRestart: string;
  };
  results: {
    newRecord: string; rank: (n: number) => string; share: string; home: string;
    titleNormal: string; titleRecord: string;
    shareText: (n: number) => string;
    motivation: (reps: number) => string;
  };
  nav: { home: string; ranking: string; calendar: string };
}

export const translations: Record<Locale, Translations> = {
  ko: {
    appName: "어깨 깡패",
    appSub: "하루 한 번, 어깨를 깡패로 만든다",
    unit: "회",
    onboarding: {
      badge: "어깨 운동 챌린지",
      placeholder: "나만의 닉네임 (ex. 어깨왕, 헬창99)",
      cta: "깡패 되러 가기",
      loading: "잠깐만...",
      dupError: "이미 사용 중인 닉네임이에요.",
    },
    home: {
      greeting: "안녕,",
    },
    today: {
      label: "오늘의 기록",
      done: "오늘 완료!",
      notDone: "오늘 아직 안 했어요",
      startCta: "지금 바로 하기",
      doneCta: "내일 또 봐요",
    },
    streak: {
      unit: "일 연속 달성",
      zero: "오늘부터 시작!",
    },
    ranking: {
      title: "오늘 랭킹",
      realtime: "실시간",
      realtimeFull: "실시간 업데이트",
      participants: (n: number) => `${n}명 참여`,
      king: "오늘의 깡패",
      me: "나",
      empty: "오늘 첫 번째 깡패가 되어보세요",
      viewAll: "전체 랭킹 보기 →",
    },
    calendar: {
      title: "기록",
      totalDays: "총 운동일",
      streakUnit: "일 연속",
    },
    profile: {
      back: "← 뒤로",
      totalDays: "총 운동일",
      streakUnit: "일 연속",
      noRecord: "아직 기록이 없어요",
      notFound: "유저를 찾을 수 없어요.",
    },
    exercise: {
      back: "← 뒤로",
      flapCount: (n: number) => `퍼덕 ${n}회`,
      cameraLoading: "카메라 연결 중...",
      tapMode: "탭해서 카운트",
      armUp: (pct: number) => `팔 올라감 ${pct}% — 퍼덕!`,
      armDown: "팔을 어깨 위로 들어올리세요",
      gameStart: "팔을 들어올려 시작",
      gameStartTap: "화면을 탭해서 시작",
      bestScore: "오늘 최고 횟수",
      retry: "다시 하기",
      save: "기록 저장",
      saving: "저장 중...",
      switchCamera: "카메라 전환",
      dinoStart: "팔을 들어올려 시작!",
      dinoRestart: "팔 올려서 재시작",
    },
    results: {
      newRecord: "신기록!",
      rank: (n: number) => `오늘 ${n}위`,
      share: "공유하기 💪",
      home: "홈으로",
      titleNormal: "오늘도 깡패!",
      titleRecord: "신기록! 🎉",
      shareText: (n: number) => `나 오늘 ${n}회 했어. 어깨 깡패 도전 중 💪`,
      motivation: (reps: number) => {
        if (reps < 10) return "시작이 반이야! 내일은 두 배로 😤";
        if (reps < 20) return "오늘 잘했어. 어깨가 기억하고 있어 💪";
        if (reps < 40) return "진짜 불타오르는 중 🔥";
        if (reps < 50) return "어깨 라인 보이기 시작할 거야 👊";
        return "진짜 어깨 깡패 등극 👑";
      },
    },
    nav: {
      home: "홈",
      ranking: "랭킹",
      calendar: "기록",
    },
  },
  "zh-TW": {
    appName: "肩膀霸主",
    appSub: "每天一次，打造霸主肩膀",
    unit: "次",
    onboarding: {
      badge: "肩膀運動挑戰",
      placeholder: "你的暱稱（例：肩膀王、健身99）",
      cta: "去成為霸主",
      loading: "請稍等...",
      dupError: "此暱稱已被使用。",
    },
    home: {
      greeting: "你好，",
    },
    today: {
      label: "今日記錄",
      done: "今日完成！",
      notDone: "今天還沒做",
      startCta: "立刻開始",
      doneCta: "明天見",
    },
    streak: {
      unit: "天連續達成",
      zero: "從今天開始！",
    },
    ranking: {
      title: "今日排名",
      realtime: "即時",
      realtimeFull: "即時更新",
      participants: (n: number) => `${n}人參與`,
      king: "今日霸主",
      me: "我",
      empty: "成為今天第一位霸主吧",
      viewAll: "查看全部排名 →",
    },
    calendar: {
      title: "記錄",
      totalDays: "總運動天數",
      streakUnit: "天連續",
    },
    profile: {
      back: "← 返回",
      totalDays: "總運動天數",
      streakUnit: "天連續",
      noRecord: "尚無記錄",
      notFound: "找不到用戶。",
    },
    exercise: {
      back: "← 返回",
      flapCount: (n: number) => `拍翅 ${n}次`,
      cameraLoading: "相機連接中...",
      tapMode: "點擊計數",
      armUp: (pct: number) => `手臂抬起 ${pct}% — 揮動！`,
      armDown: "將手臂抬至肩膀以上",
      gameStart: "抬起手臂開始",
      gameStartTap: "點擊螢幕開始",
      bestScore: "今日最高次數",
      retry: "再試一次",
      save: "儲存記錄",
      saving: "儲存中...",
      switchCamera: "切換相機",
      dinoStart: "抬起手臂開始！",
      dinoRestart: "抬起手臂重新開始",
    },
    results: {
      newRecord: "新紀錄！",
      rank: (n: number) => `今日第 ${n} 名`,
      share: "分享 💪",
      home: "回首頁",
      titleNormal: "今天也是霸主！",
      titleRecord: "新紀錄！🎉",
      shareText: (n: number) => `我今天做了${n}次。正在挑戰肩膀霸主 💪`,
      motivation: (reps: number) => {
        if (reps < 10) return "開始就是成功！明天加倍 😤";
        if (reps < 20) return "今天做得很好。肩膀記得哦 💪";
        if (reps < 40) return "真的燃起來了 🔥";
        if (reps < 50) return "肩膀線條快出來了 👊";
        return "真正的肩膀霸主誕生 👑";
      },
    },
    nav: {
      home: "首頁",
      ranking: "排名",
      calendar: "記錄",
    },
  },
};
