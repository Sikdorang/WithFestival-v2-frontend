import { festivalAPI } from "@/src/apis/festival";
import { DEFAULT_META, FESTIVAL_META } from "@/src/constants/festivalMeta";
import { type FestivalEvent } from "@/src/data/schedule";
import { useCallback, useEffect, useMemo, useState } from "react";

const parseDate = (s: string) => new Date(`${s}T00:00:00+09:00`);
const TODAY = new Date("2026-04-28T00:00:00+09:00");

export const useFestival = () => {
  const [festivals, setFestivals] = useState<FestivalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFestivals = useCallback(async () => {
    try {
      setIsLoading(true);
      const serverData = await festivalAPI.getFestivals();

      const transformedData: FestivalEvent[] = serverData.map((f) => {
        const meta = FESTIVAL_META[f.id] || {
          ...DEFAULT_META,
          abbr: f.university.slice(0, 2),
        };

        return {
          ...f,
          color: meta.color,
          abbr: meta.abbr,
          logoExt: meta.logoExt,
        };
      });

      setFestivals(transformedData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  const categorizedData = useMemo(() => {
    const ongoing: FestivalEvent[] = [];
    const upcoming: FestivalEvent[] = [];
    const ended: FestivalEvent[] = [];

    festivals.forEach((f) => {
      const start = parseDate(f.startDate);
      const end = parseDate(f.endDate);

      if (start <= TODAY && TODAY <= end) ongoing.push(f);
      else if (start > TODAY) upcoming.push(f);
      else ended.push(f);
    });

    ongoing.sort(
      (a, b) =>
        parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime(),
    );
    upcoming.sort(
      (a, b) =>
        parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime(),
    );
    ended.sort(
      (a, b) => parseDate(b.endDate).getTime() - parseDate(a.endDate).getTime(),
    );

    return { ongoing, upcoming, ended };
  }, [festivals]);

  return {
    ...categorizedData,
    isLoading,
    refresh: fetchFestivals,
  };
};
