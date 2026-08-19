export const categories = [
  {
    id: "general-cleaning",
    name: "종합청소",
    slug: "cleaning",
    description: "이사청소, 입주청소, 준공청소 및 상가/건물 외벽 유리창 관리 전문 업체 정보입니다.",
    mainTaskIds: ["exterior-cleaning", "window-cleaning", "floor-waxing", "post-construction-cleaning"],
    relatedTaskIds: ["fire-cleaning", "floor-cleaning", "awning-cleaning", "sign-cleaning", "interior-cleaning", "hood-cleaning"],
    hubTitle: "서울·경기 종합청소 업체 찾기",
    hubDescription: "종합청소 업종에 등록된 세부 작업을 확인하시고 상담 연결 가능한 동네 업체를 찾아보세요.",
    managed: false,
    visible: false,
    publicVisible: false,
    adSelectable: false,
    keywordMapEnabled: false,
    showOnMain: false,
    sitemapInclude: false,
    noindex: true,
    mainTitle: "우리동네 유리창청소",
    mainPriority: 10,
    priceGuide: {
      standard: "전화/채널 문의 시 무료 가견적",
      note: "현장 층수, 시공 면적, 동원 장비에 따라 다르게 산정됩니다."
    }
  },
  {
    id: "waterproof-leak",
    name: "방수/누수",
    slug: "waterproofing",
    description: "아파트 베란다 누수, 옥상 우레탄 방수 공사 및 미세 누수 탐지 정밀 진단 업체 리스트입니다.",
    mainTaskIds: ["rooftop-waterproofing", "rain-leak", "rooftop-leak"],
    relatedTaskIds: ["exterior-waterproofing", "roof-waterproofing", "exterior-leak"],
    hubTitle: "서울·경기 방수·누수 업체 찾기",
    hubDescription: "방수/누수 업종에 등록된 세부 작업을 확인하시고 상담 연결 가능한 동네 업체를 찾아보세요.",
    managed: true,
    visible: true,
    publicVisible: true,
    adSelectable: true,
    keywordMapEnabled: true,
    showOnMain: true,
    landingEnabled: true,
    sitemapInclude: true,
    noindex: false,
    mainTitle: "우리동네 외벽방수",
    mainPriority: 20,
    priceGuide: {
      standard: "전화/채널 문의 시 무료 가견적",
      note: "현장 층수, 시공 면적, 동원 장비에 따라 다르게 산정됩니다."
    },
    seoTemplate: {
      heroDescription: "{region}에서 외벽·옥상·지붕 주변 빗물누수가 의심된다면 {task} 상담 가능 업체를 확인하고 전화 또는 카카오톡으로 문의해보세요.",
      infoSections: [
        {
          title: "{region} {task} 상담이 필요한 경우",
          desc: "비가 온 뒤 벽면이나 천장 주변에 물자국이 생기거나 외벽 균열, 옥상 방수층 손상이 의심될 경우 {task} 상담을 받아볼 수 있습니다."
        },
        {
          title: "상담 전 확인하면 좋은 내용",
          desc: "누수 위치 사진, 비가 온 시점, 물이 생긴 위치, 외벽·옥상·지붕 등 의심 부위를 정리해두면 상담이 더 수월합니다."
        },
        {
          title: "작업 범위 확인사항",
          desc: "고층 건물이나 외벽 작업은 로프, 사다리, 스카이 장비 접근 가능 여부에 따라 상담 기준이 달라질 수 있습니다."
        }
      ],
      faq: [
        {
          q: "{region}에서 {task} 상담은 어떻게 진행되나요?",
          a: "페이지에 등록된 업체 정보를 확인한 뒤 전화 또는 카카오톡으로 상담을 요청할 수 있습니다. 현장 위치와 작업 내용을 함께 전달하면 상담이 더 빠르게 진행될 수 있습니다."
        },
        {
          q: "{task} 상담 전 어떤 사진을 준비하면 좋나요?",
          a: "작업이 필요한 위치, 문제 부위, 주변 환경을 확인할 수 있는 사진을 준비하면 업체가 상황을 파악하는 데 도움이 됩니다."
        },
        {
          q: "외벽 빗물누수와 옥상 누수는 상담 기준이 다른가요?",
          a: "네, 외벽 누수는 층수와 로프/스카이 장비 접근성, 균열 부위 위주로 점검이 이루어지며, 옥상 누수는 옥상 바닥 전체의 면적과 기존 우레탄 방수층 들뜸 및 노후 수명을 감안하므로 진단 스펙이 다릅니다."
        },
        {
          q: "고층 건물도 상담 가능 여부를 확인할 수 있나요?",
          a: "네, 가능합니다. 건물 외부 로프 작업 숙련도와 장비 주정차 접근 조건 등을 업체 상담을 통해 상세히 안내받으실 수 있습니다."
        },
        {
          q: "전화와 카카오톡 중 어떤 방식으로 문의할 수 있나요?",
          a: "업체별로 제공된 전화 문의 또는 카카오 문의 버튼을 통해 원하는 방식으로 상담을 요청할 수 있습니다."
        }
      ]
    }
  },
  {
    id: "window-caulking",
    name: "창틀코킹/창틀누수",
    slug: "caulking",
    description: "빗물이 들이치는 아파트/빌라 창틀 실리콘 코킹 및 크랙 빗물 누수 차단 전문 지면입니다.",
    mainTaskIds: ["window-caulking-task", "window-leak", "window-rain-leak"],
    relatedTaskIds: ["window-silicon", "chassis-silicon"],
    hubTitle: "서울·경기 창틀코킹·창틀누수 업체 찾기",
    hubDescription: "창틀코킹/창틀누수 업종에 등록된 세부 작업을 확인하시고 상담 연결 가능한 동네 업체를 찾아보세요.",
    managed: true,
    visible: true,
    publicVisible: true,
    adSelectable: true,
    keywordMapEnabled: true,
    showOnMain: true,
    landingEnabled: true,
    sitemapInclude: true,
    noindex: false,
    mainTitle: "우리동네 창틀누수",
    mainPriority: 30,
    priceGuide: {
      standard: "전화/채널 문의 시 무료 가견적",
      note: "현장 층수, 시공 면적, 동원 장비에 따라 다르게 산정됩니다."
    },
    seoTemplate: {
      heroDescription: "{region}에서 비 오는 날 창틀 주변으로 물이 스며들거나 실리콘 노후가 의심된다면 {task} 상담 가능 업체를 확인해보세요.",
      infoSections: [
        {
          title: "{region} {task}가 필요한 경우",
          desc: "비가 온 뒤 창틀 주변에 물자국이 생기거나 기존 실리콘이 갈라지고 들뜬 경우 {task} 상담이 필요할 수 있습니다."
        },
        {
          title: "상담 전 확인하면 좋은 내용",
          desc: "물이 들어오는 위치, 창틀 내부·외부 실리콘 상태, 비 오는 날 발생한 흔적 사진을 준비하면 상담이 더 정확해질 수 있습니다."
        },
        {
          title: "작업 범위 확인사항",
          desc: "창틀 외부 작업은 층수와 접근 방식에 따라 상담 기준이 달라질 수 있으므로 외부 작업 가능 여부를 함께 확인하는 것이 좋습니다."
        }
      ],
      faq: [
        {
          q: "{region}에서 {task} 상담은 어떻게 진행되나요?",
          a: "페이지에 등록된 업체 정보를 확인한 뒤 전화 또는 카카오톡으로 상담을 요청할 수 있습니다. 현장 위치와 작업 내용을 함께 전달하면 상담이 더 빠르게 진행될 수 있습니다."
        },
        {
          q: "{task} 상담 전 어떤 사진을 준비하면 좋나요?",
          a: "작업이 필요한 위치, 문제 부위, 주변 환경을 확인할 수 있는 사진을 준비하면 업체가 상황을 파악하는 데 도움이 됩니다."
        },
        {
          q: "비 오는 날에만 창틀 주변 물샘이 생겨도 상담 가능한가요?",
          a: "네, 비 오는 날에만 발생하는 미세 누수도 외벽 샷시 틈이나 낡은 실리콘 코킹 균열이 원인인 경우가 많으므로 상담이 적극적으로 가능합니다."
        },
        {
          q: "기존 실리콘 제거가 필요한지도 확인할 수 있나요?",
          a: "네, 낡은 기존 실리콘을 완전 탈거하고 프리미엄 우레탄 실란트를 새로 채워 넣는 정석 시공 기준이 원칙이므로, 기존 코킹 부위의 사진을 통해 상세 제거 범위를 확인 받으실 수 있습니다."
        },
        {
          q: "전화와 카카오톡 중 어떤 방식으로 문의할 수 있나요?",
          a: "업체별로 제공된 전화 문의 또는 카카오 문의 버튼을 통해 원하는 방식으로 상담을 요청할 수 있습니다."
        }
      ]
    }
  },
  {
    id: "drain-clog",
    name: "하수구막힘",
    slug: "drain",
    description: "싱크대 역류, 화장실 바닥 배수구 막힘, 빌라/상가 메인 오수관 고압세척 전문 안내입니다.",
    mainTaskIds: ["drain-clogged", "sink-clogged", "toilet-clogged"],
    relatedTaskIds: ["bathroom-drain-clogged", "main-sewer-clogged", "main-sewer-backflow"],
    hubTitle: "서울·경기 하수구막힘 업체 찾기",
    hubDescription: "하수구막힘 업종에 등록된 세부 작업을 확인하시고 상담 연결 가능한 동네 업체를 찾아보세요.",
    managed: false,
    visible: false,
    publicVisible: false,
    adSelectable: false,
    keywordMapEnabled: false,
    showOnMain: false,
    sitemapInclude: false,
    noindex: true,
    mainTitle: "우리동네 하수구막힘",
    mainPriority: 999,
    priceGuide: {
      standard: "전화/채널 문의 시 무료 가견적",
      note: "현장 층수, 시공 면적, 동원 장비에 따라 다르게 산정됩니다."
    }
  },
  {
    id: "elastic-coating",
    name: "탄성코트",
    slug: "elastic-coating",
    description: "아파트 베란다, 세탁실, 다용도실 등 실내 탄성코트 시공 상담 가능 업체를 확인할 수 있는 카테고리입니다.",
    mainTaskIds: ["elastic-coating", "elastic-coating-work", "veranda-elastic-coating"],
    relatedTaskIds: ["laundry-room-elastic-coating", "apartment-elastic-coating", "elastic-coating-company"],
    hubTitle: "서울·경기 탄성코트 업체 찾기",
    hubDescription: "탄성코트 업종에 등록된 세부 작업을 확인하시고 상담 연결 가능한 동네 업체를 찾아보세요.",
    managed: true,
    visible: true,
    publicVisible: true,
    adSelectable: true,
    keywordMapEnabled: true,
    showOnMain: true,
    landingEnabled: true,
    sitemapInclude: true,
    noindex: false,
    mainTitle: "우리동네 탄성코트",
    mainPriority: 40,
    priceGuide: {
      standard: "전화/채널 문의 시 무료 가견적",
      note: "현장 층수, 시공 면적, 동원 장비에 따라 다르게 산정됩니다."
    },
    seoTemplate: {
      heroDescription: "{region}에서 베란다·세탁실·아파트 {task} 상담이 가능한 업체를 확인하고 전화 또는 카카오톡으로 바로 문의해보세요.",
      infoSections: [
        {
          title: "{region} {task}가 필요한 경우",
          desc: "베란다나 세탁실 벽면에 결로, 곰팡이, 들뜸 현상이 반복된다면 {task} 상담을 받아볼 수 있습니다."
        },
        {
          title: "상담 전 확인하면 좋은 내용",
          desc: "시공 위치 사진, 벽면 상태, 곰팡이 흔적, 기존 페인트 들뜸 여부를 함께 전달하면 상담이 더 빠르게 진행될 수 있습니다."
        },
        {
          title: "작업 범위 확인사항",
          desc: "베란다, 세탁실, 다용도실 등 공간에 따라 상담 기준이 달라질 수 있으므로 시공 범위와 벽면 상태를 먼저 확인하는 것이 좋습니다."
        }
      ],
      faq: [
        {
          q: "{region}에서 {task} 상담은 어떻게 진행되나요?",
          a: "페이지에 등록된 업체 정보를 확인한 뒤 전화 또는 카카오톡으로 상담을 요청할 수 있습니다. 현장 위치와 작업 내용을 함께 전달하면 상담이 더 빠르게 진행될 수 있습니다."
        },
        {
          q: "{task} 상담 전 어떤 사진을 준비하면 좋나요?",
          a: "작업이 필요한 위치, 문제 부위, 주변 환경을 확인할 수 있는 사진을 준비하면 업체가 상황을 파악하는 데 도움이 됩니다."
        },
        {
          q: "베란다와 세탁실 탄성코트 상담 기준이 다른가요?",
          a: "네, 베란다와 세탁실은 시공 면적, 환기 조건, 곰팡이 오염도 및 추가 보양 필요성에 따라 공정 및 자재 소요량이 달라지므로 공간별 세부 조건에 따라 상담 기준이 세분화될 수 있습니다."
        },
        {
          q: "기존 벽면에 곰팡이가 있으면 바로 상담 가능한가요?",
          a: "네, 바로 상담 가능합니다. 곰팡이가 있는 벽면은 향균 하도 공정 및 살균 제거 작업이 필수로 선행되므로, 벽면 상태 사진을 전송해 주시면 보다 원활한 점검을 도와드릴 수 있습니다."
        },
        {
          q: "전화와 카카오톡 중 어떤 방식으로 문의할 수 있나요?",
          a: "업체별로 제공된 전화 문의 또는 카카오 문의 버튼을 통해 원하는 방식으로 상담을 요청할 수 있습니다."
        }
      ]
    }
  }
];

// Single Source of Truth: 활성화/운영 대상 카테고리 ID 리스트 동적 추출
export const OPERATED_CATEGORIES = categories.filter(c => c.landingEnabled && c.visible).map(c => c.id);

/**
 * SEO 설명문 및 FAQ 플레이스홀더 치환 헬퍼
 */
export function resolveSeoTemplate(catId, region, task) {
  const cat = categories.find(c => c.id === catId);
  const tpl = cat ? cat.seoTemplate : null;
  if (!tpl) return null;

  const replacePlaceholders = (str) => {
    return str
      .replace(/{region}/g, region)
      .replace(/{task}/g, task)
      .replace(/{category}/g, catId);
  };

  return {
    heroDescription: replacePlaceholders(tpl.heroDescription),
    infoSections: tpl.infoSections.map(s => ({
      title: replacePlaceholders(s.title),
      desc: replacePlaceholders(s.desc)
    })),
    faq: tpl.faq.map(f => ({
      q: replacePlaceholders(f.q),
      a: replacePlaceholders(f.a)
    }))
  };
}
