export const tasks = [
  // 1. 종합청소 하위 작업들
  { id: "exterior-cleaning", categoryId: "general-cleaning", name: "외벽청소", slug: "exterior-cleaning" },
  { id: "window-cleaning", categoryId: "general-cleaning", name: "유리창청소", slug: "window-cleaning" },
  { id: "fire-cleaning", categoryId: "general-cleaning", name: "화재청소", slug: "fire-cleaning" },
  { id: "floor-waxing", categoryId: "general-cleaning", name: "바닥왁스코팅", slug: "floor-waxing" },
  { id: "floor-cleaning", categoryId: "general-cleaning", name: "바닥청소", slug: "floor-cleaning" },
  { id: "awning-cleaning", categoryId: "general-cleaning", name: "어닝청소", slug: "awning-cleaning" },
  { id: "sign-cleaning", categoryId: "general-cleaning", name: "간판청소", slug: "sign-cleaning" },
  { id: "post-construction-cleaning", categoryId: "general-cleaning", name: "준공청소", slug: "post-construction-cleaning" },
  { id: "interior-cleaning", categoryId: "general-cleaning", name: "인테리어청소", slug: "interior-cleaning" },
  { id: "hood-cleaning", categoryId: "general-cleaning", name: "후드청소", slug: "hood-cleaning" },

  // 2. 방수/누수 하위 작업들
  { id: "exterior-waterproofing", categoryId: "waterproof-leak", name: "외벽방수", slug: "exterior-waterproofing" },
  { id: "rooftop-waterproofing", categoryId: "waterproof-leak", name: "옥상방수", slug: "rooftop-waterproofing" },
  { id: "roof-waterproofing", categoryId: "waterproof-leak", name: "지붕방수", slug: "roof-waterproofing" },
  { id: "rain-leak", categoryId: "waterproof-leak", name: "빗물누수", slug: "rain-leak" },
  { id: "exterior-leak", categoryId: "waterproof-leak", name: "외벽누수", slug: "exterior-leak" },
  { id: "rooftop-leak", categoryId: "waterproof-leak", name: "옥상누수", slug: "rooftop-leak" },

  // 3. 창틀코킹/창틀누수 하위 작업들
  { id: "window-caulking-task", categoryId: "window-caulking", name: "창틀코킹", slug: "window-caulking" },
  { id: "window-leak", categoryId: "window-caulking", name: "창틀누수", slug: "window-leak" },
  { id: "window-silicon", categoryId: "window-caulking", name: "창틀실리콘", slug: "window-silicon" },
  { id: "chassis-silicon", categoryId: "window-caulking", name: "샷시실리콘", slug: "chassis-silicon" },
  { id: "window-rain-leak", categoryId: "window-caulking", name: "빗물누수", slug: "window-rain-leak" },

  // 4. 하수구막힘 하위 작업들
  { id: "drain-clogged", categoryId: "drain-clog", name: "하수구막힘", slug: "drain-clogged" },
  { id: "sink-clogged", categoryId: "drain-clog", name: "싱크대막힘", slug: "sink-clogged" },
  { id: "toilet-clogged", categoryId: "drain-clog", name: "변기막힘", slug: "toilet-clogged" },
  { id: "bathroom-drain-clogged", categoryId: "drain-clog", name: "배수구막힘", slug: "bathroom-drain-clogged" },
  { id: "main-sewer-clogged", categoryId: "drain-clog", name: "오수관막힘", slug: "main-sewer-clogged" },
  { id: "main-sewer-backflow", categoryId: "drain-clog", name: "오수관역류", slug: "main-sewer-backflow" }
];
