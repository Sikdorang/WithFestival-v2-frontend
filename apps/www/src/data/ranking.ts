export type Booth = {
  id: string;
  name: string;
  university: string;
  affiliation: string;
  revenue: number;
  color: string;
  abbr: string;
  logoExt?: "svg" | "png";
};

export const BOOTHS: Booth[] = [
  {
    id: "kwangwoon",
    name: "주점은 어우야",
    university: "광운대",
    affiliation: "인공지능융합대학 총학생회",
    revenue: 1542000,
    color: "#7B2A47",
    abbr: "광운",
    logoExt: "svg",
  },
  {
    id: "hanyang",
    name: "일렉트로닉 파전",
    university: "한양대",
    affiliation: "중앙 댄스동아리 꾼",
    revenue: 1410000,
    color: "#0E4DA4",
    abbr: "한양",
    logoExt: "svg",
  },
  {
    id: "seoultech",
    name: "경영인의 밤",
    university: "서울과기대",
    affiliation: "상경대학 연합",
    revenue: 1285000,
    color: "#003876",
    abbr: "과기",
    logoExt: "png",
  },
  {
    id: "hongik",
    name: "건축학개론 주막",
    university: "홍익대",
    affiliation: "건축도시대학 총학생회",
    revenue: 1120000,
    color: "#1F4DA0",
    abbr: "홍익",
    logoExt: "svg",
  },
  {
    id: "korea",
    name: "체대생의 불막창",
    university: "고려대",
    affiliation: "사범대학 체육교육과 학생회",
    revenue: 1095000,
    color: "#8C1D40",
    abbr: "고려",
    logoExt: "svg",
  },
  {
    id: "sogang",
    name: "화끈한 화학과",
    university: "서강대",
    affiliation: "자연과학부 연합",
    revenue: 980000,
    color: "#A8001D",
    abbr: "서강",
    logoExt: "svg",
  },
  {
    id: "snu",
    name: "미대오빠 칵테일",
    university: "서울대",
    affiliation: "미술대학 조소과 학생회",
    revenue: 840000,
    color: "#003F7C",
    abbr: "서울",
    logoExt: "svg",
  },
];
