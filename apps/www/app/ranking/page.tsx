import { notFound } from "next/navigation";

/** 실시간 랭킹은 당분간 비공개 — 라우트는 유지하되 접근 시 404 */
export default function RankingPage() {
  notFound();
}
