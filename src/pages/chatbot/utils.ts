import { SYNONYMS } from "./data/synonyms";
import { INTENTS } from "./data/intents";
import type { Intent } from "./types";

//  텍스트 정규화 (소문자 변환, 구두점 제거, 공백 정리)

export const normalize = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[\p{P}\p{S}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

//  사용자 입력에 가장 적합한 인텐트 찾기

export function findIntent(input: string): Intent | undefined {
  const q = normalize(input);
  if (!q) return;

  const tokens = new Set(q.split(" "));
  const expanded = new Set<string>();

  // 토큰 확장 (동의어 포함)
  tokens.forEach((t) => {
    expanded.add(t);
    Object.values(SYNONYMS).forEach((list) => {
      if (list.includes(t)) {
        list.forEach((v) => expanded.add(v));
      }
    });
  });

  let best: { intent?: Intent; score: number } = { score: 0 };

  // 각 인텐트의 태그와 매칭 스코어 계산
  for (const intent of INTENTS) {
    const score = intent.tags.reduce(
      (acc, tag) => (expanded.has(tag) || q.includes(tag) ? acc + 1 : acc),
      0
    );

    if (score > best.score) {
      best = { intent, score };
    }
  }

  return best.intent;
}
