export type FestivalEvent = {
  id: string;
  university: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  logoExt?: "svg" | "png";
  color: string;
  abbr: string;
};

export const FESTIVALS: FestivalEvent[] = [
  {
    id: "snu",
    university: "서울대",
    name: "샤대제",
    startDate: "2026-05-12",
    endDate: "2026-05-14",
    location: "관악캠퍼스 자하연 일대",
    logoExt: "svg",
    color: "#003F7C",
    abbr: "서울",
  },
  {
    id: "korea",
    university: "고려대",
    name: "입실렌티",
    startDate: "2026-05-18",
    endDate: "2026-05-20",
    location: "안암캠퍼스 녹지광장",
    logoExt: "svg",
    color: "#8C1D40",
    abbr: "고려",
  },
  {
    id: "hanyang",
    university: "한양대",
    name: "라치오스",
    startDate: "2026-05-21",
    endDate: "2026-05-23",
    location: "서울캠퍼스 사자상 광장",
    logoExt: "svg",
    color: "#0E4DA4",
    abbr: "한양",
  },
  {
    id: "sogang",
    university: "서강대",
    name: "Albatross",
    startDate: "2026-05-25",
    endDate: "2026-05-27",
    location: "본관 앞 잔디광장",
    logoExt: "svg",
    color: "#A8001D",
    abbr: "서강",
  },
  {
    id: "hongik",
    university: "홍익대",
    name: "와우제",
    startDate: "2026-05-27",
    endDate: "2026-05-29",
    location: "홍문관 앞 광장",
    logoExt: "svg",
    color: "#1F4DA0",
    abbr: "홍익",
  },
  {
    id: "kwangwoon",
    university: "광운대",
    name: "어우야제",
    startDate: "2026-04-27",
    endDate: "2026-04-29",
    location: "광운대 비마관 앞 광장",
    logoExt: "svg",
    color: "#7B2A47",
    abbr: "광운",
  },
  {
    id: "seoultech",
    university: "서울과기대",
    name: "대동제",
    startDate: "2026-04-15",
    endDate: "2026-04-17",
    location: "어의관 앞 잔디광장",
    logoExt: "png",
    color: "#003876",
    abbr: "과기",
  },
];
