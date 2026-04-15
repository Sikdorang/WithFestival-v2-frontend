import FestivalCarousel from "./FestivalCarousel";

const FESTIVALS = {
  ongoing: [
    {
      id: 1,
      univ: "광운대",
      name: "대동제: 비상",
      dates: "04.15 - 04.17",
      imgUrl: "/images/festival_1.webp",
    },
    {
      id: 2,
      univ: "국민대",
      name: "북악축전",
      dates: "04.14 - 04.16",
      imgUrl: "/images/festival_2.webp",
    },
    {
      id: 3,
      univ: "세종대",
      name: "대동제: 군자",
      dates: "04.16 - 04.18",
      imgUrl: "/images/festival_3.jpeg",
    },
    {
      id: 4,
      univ: "세종대",
      name: "대동제: 군자",
      dates: "04.16 - 04.18",
      imgUrl: "/images/festival_1.webp",
    },
    {
      id: 5,
      univ: "세종대",
      name: "대동제: 군자",
      dates: "04.16 - 04.18",
      imgUrl: "/images/festival_3.jpeg",
    },
  ],
  upcoming: [
    {
      id: 6,
      univ: "고려대",
      name: "석탑대동제",
      dates: "05.20 - 05.23",
      imgUrl: "/images/festival_1.webp",
    },
    {
      id: 7,
      univ: "연세대",
      name: "무악대동제",
      dates: "05.21 - 05.24",
      imgUrl: "/images/festival_2.webp",
    },
    {
      id: 8,
      univ: "한양대",
      name: "라치오스",
      dates: "05.22 - 05.24",
      imgUrl: "/images/festival_3.jpeg",
    },
    {
      id: 9,
      univ: "한양대",
      name: "라치오스",
      dates: "05.22 - 05.24",
      imgUrl: "/images/festival_1.webp",
    },
    {
      id: 10,
      univ: "한양대",
      name: "라치오스",
      dates: "05.22 - 05.24",
      imgUrl: "/images/festival_3.jpeg",
    },
  ],
  ended: [
    {
      id: 11,
      univ: "서울대",
      name: "관악모꼬지",
      dates: "03.20 - 03.22",
      imgUrl: "/images/festival_2.webp",
    },
    {
      id: 12,
      univ: "서강대",
      name: "새내기맞이",
      dates: "03.15 - 03.17",
      imgUrl: "/images/festival_3.jpeg",
    },
    {
      id: 13,
      univ: "서강대",
      name: "새내기맞이",
      dates: "03.15 - 03.17",
      imgUrl: "/images/festival_1.webp",
    },
  ],
};

export default function FestivalStatusBoard() {
  return (
    <section className="w-full bg-[#F8F9FB] py-16">
      <div className="mx-auto mb-10 max-w-7xl px-4 md:px-8">
        <h1 className="text-3xl font-bold text-[#11153F] md:text-4xl">
          2026 진행하는 대학 축제들 !
        </h1>
      </div>

      <div className="mx-auto max-w-7xl">
        <FestivalCarousel title="진행 중인 축제" data={FESTIVALS.ongoing} />
        <FestivalCarousel title="진행 예정인 축제" data={FESTIVALS.upcoming} />
        <FestivalCarousel title="끝난 축제" data={FESTIVALS.ended} />
      </div>
    </section>
  );
}
