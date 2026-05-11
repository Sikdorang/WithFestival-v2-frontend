import { festivalAPI, RawFestival } from "@/src/apis/festival";
import { DEFAULT_META, FESTIVAL_META } from "@/src/constants/festivalMeta";
import { useCallback, useEffect, useMemo, useState } from "react";

// UI에서 사용하는 확장된 데이터 타입
export type FestivalEvent = RawFestival & {
  logoExt?: "svg" | "png";
  color: string;
  abbr: string;
};

const getSeoulDateString = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

const TODAY = new Date(`${getSeoulDateString()}T00:00:00+09:00`);

const parseDate = (s: string) => new Date(`${s}T00:00:00+09:00`);

export const useFestival = () => {
  const [rawFestivals, setRawFestivals] = useState<RawFestival[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFestivals = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await festivalAPI.getFestivals();
      setRawFestivals(data);
    } catch (error) {
      console.error("축제 목록 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  // 💡 데이터 가공 및 분류 로직 통합
  const processedData = useMemo(() => {
    const ongoing: FestivalEvent[] = [];
    const upcoming: FestivalEvent[] = [];
    const ended: FestivalEvent[] = [];

    rawFestivals.forEach((f) => {
      // 1. 시각적 메타데이터 주입 (Enrichment)
      const meta = FESTIVAL_META[f.id] || {
        ...DEFAULT_META,
        abbr: f.university.slice(0, 2), // 매핑 없으면 대학명 앞 2글자
      };

      const enrichedFestival: FestivalEvent = { ...f, ...meta };

      // 2. 날짜별 분류
      const start = parseDate(f.startDate);
      const end = parseDate(f.endDate);

      if (start <= TODAY && TODAY <= end) ongoing.push(enrichedFestival);
      else if (start > TODAY) upcoming.push(enrichedFestival);
      else ended.push(enrichedFestival);
    });

    // 3. 명세에 따른 정렬 (startDate, endDate, name 오름차순)
    const sortFn = (a: FestivalEvent, b: FestivalEvent) => {
      const dateDiff =
        parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.name.localeCompare(b.name);
    };

    ongoing.sort(sortFn);
    upcoming.sort(sortFn);
    ended.sort(
      (a, b) => parseDate(b.endDate).getTime() - parseDate(a.endDate).getTime(),
    );

    return { ongoing, upcoming, ended };
  }, [rawFestivals]);

  return { ...processedData, isLoading, refresh: fetchFestivals };
};
