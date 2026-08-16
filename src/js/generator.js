import { categories } from '../data/categories.js';
import { tasks } from '../data/tasks.js';
import { regions } from '../data/regions.js';
import { businesses } from '../data/businesses.js';
import { adSlots } from '../data/adSlots.js';

/**
 * 2026-06-30 기준 광고 기간 검증
 */
const CURRENT_DATE = new Date("2026-06-30T10:30:00+09:00");

/**
 * 특정 조건에 맞는 랜딩 페이지 리스트를 조합 생성
 */
export function generateLandingPages() {
  const landingPages = [];

  // 모든 지역 * 모든 작업(Tasks) 조합 순회
  regions.forEach(region => {
    tasks.forEach(task => {
      // 1. 카테고리 매칭 (categoryIds 배열 검사)
      const category = categories.find(c => task.categoryIds.includes(c.id));
      if (!category || !category.visible) return;
      if (!task.visible) return;

      // 2. 매칭 업체 필터링 (adSlots 기준 매칭)
      const matchedBusinesses = filterBusinessesForPage({
        regionId: region.id,
        categoryId: category.id,
        taskId: task.id
      });

      // 3. SEO 정보 가공
      const provinceKr = region.province;
      const cityKr = region.city ? ` ${region.city}` : "";
      const districtKr = region.district ? ` ${region.district}` : "";
      const neighborhoodKr = region.neighborhood ? ` ${region.neighborhood}` : "";
      const fullRegionName = `${provinceKr}${cityKr}${districtKr}${neighborhoodKr}`.trim();

      const pageTitle = category.seoTitleTemplate || `[지역명] [작업명] 전문 입점 광고 업체 안내 - 동네책자`;
      const finalizedTitle = pageTitle
        .replace("[지역명]", fullRegionName)
        .replace("[작업명]", task.name);

      const pageDescription = category.seoDescriptionTemplate || `[지역명]에서 믿고 거래할 수 있는 [작업명] 입점 광고 업체의 상세 소개, 홈페이지 및 다이렉트 상담 연락처를 확인하세요.`;
      const finalizedDescription = pageDescription
        .replace("[지역명]", fullRegionName)
        .replace("[작업명]", task.name);

      // 4. 인근 지역 슬러그 목록
      const nearbyLinks = region.nearbyRegionIds.map(regId => {
        const targetReg = regions.find(r => r.id === regId);
        return {
          displayName: targetReg ? targetReg.displayName : regId,
          url: `/${category.slug}/${targetReg ? targetReg.slug : regId}/${task.slug}`
        };
      });

      // 5. 관련 작업들 링크 목록 (해당 카테고리에 속한 다른 작업들)
      const relatedLinks = tasks
        .filter(t => t.categoryIds.includes(category.id) && t.id !== task.id && t.visible)
        .map(t => ({
          name: t.name,
          url: `/${category.slug}/${region.slug}/${t.slug}`
        }));

      // 6. FAQ 텍스트 지역+작업명 치환
      const defaultFaq = [
        {
          question: "[작업명] 서비스 진행 시 시간은 얼마나 소요되나요?",
          answer: "일반적으로 현장 오염도와 작업 면적에 따라 다르지만 보통 4~8시간 내외가 소요됩니다. 입점 광고 업체 사장님과의 직접 유선 상담을 통해 상세한 일정을 사전 조율하실 수 있습니다."
        },
        {
          question: "작업 직후 보완(AS) 요청이 가능한가요?",
          answer: "네, 대부분의 입점 업체는 작업 직후 현장 검수를 진행하며 미진한 부분에 대해 즉각적인 조치를 취하고 있습니다. 자세한 보상 및 사후 대처는 업체별 공식 사이트를 참조해 주세요."
        }
      ];
      const customizedFaq = defaultFaq.map(item => ({
        question: item.question.replace("[작업명]", task.name),
        answer: item.answer.replace("[작업명]", task.name)
      }));

      // URL 구조 설계 규칙 반영: /{카테고리슬러그}/{지역슬러그}/{작업슬러그}
      const pageUrl = `/${category.slug}/${region.slug}/${task.slug}`;

      landingPages.push({
        url: pageUrl,
        regionName: fullRegionName,
        taskName: task.name,
        categoryName: category.name,
        meta: {
          title: finalizedTitle,
          description: finalizedDescription,
          canonical: `https://dongnae-booklet.co.kr${pageUrl}`,
          sitemap: matchedBusinesses.length > 0 // 매칭된 활성 광고 업체가 있는 경우만 sitemap에 등록 (크롤링 효율 극대화)
        },
        faq: customizedFaq,
        priceGuide: {
          standard: "전화/채널 문의 시 무료 가견적",
          note: "현장 층수, 시공 면적, 동원 장비에 따라 다르게 산정됩니다."
        },
        nearbyRegions: nearbyLinks,
        relatedTasks: relatedLinks,
        listings: matchedBusinesses
      });
    });
  });

  return landingPages;
}

/**
 * 업체 필터링 코어 매칭 알고리즘 (adSlots 구좌 기반 매칭으로 변경)
 */
function filterBusinessesForPage({ regionId, categoryId, taskId }) {
  // 활성화된 광고 구좌 필터링
  const activeSlots = adSlots.filter(slot => {
    if (slot.status !== "active") return false;
    if (slot.categoryId !== categoryId) return false;

    const taskMatches = slot.coverageTaskMode === "all-category-tasks" || slot.taskId === taskId;
    if (!taskMatches) return false;

    if (slot.startDate !== null) {
      const start = new Date(slot.startDate);
      if (CURRENT_DATE < start) return false;
    }
    if (slot.endDate !== null) {
      const end = new Date(slot.endDate);
      if (CURRENT_DATE > end) return false;
    }

    // 지역 매칭 (계층형 지원: 페이지의 지역이 광고 구좌 지역의 자식인지 여부)
    let currentReg = regions.find(r => r.id === regionId);
    let matchedRegion = false;
    while (currentReg) {
      const slotRegId = slot.purchaseRegionId || slot.regionId;
      if (currentReg.id === slotRegId) {
        matchedRegion = true;
        break;
      }
      currentReg = currentReg.parentId ? regions.find(r => r.id === currentReg.parentId) : null;
    }

    return matchedRegion;
  });

  // 매칭된 구좌에 설정된 업체 정보 가져오기
  const matchedBusinesses = [];
  activeSlots.forEach(slot => {
    const biz = businesses.find(b => b.id === slot.businessId);
    if (biz && biz.visible && biz.status === "active") {
      matchedBusinesses.push({
        ...biz,
        slotPriority: slot.priority
      });
    }
  });

  // 구좌 우선순위 순으로 정렬
  return matchedBusinesses.sort((a, b) => b.slotPriority - a.slotPriority);
}

// 빌드 모듈 또는 디버그용 실행 지원
if (process.argv[1] && process.argv[1].endsWith('generator.js')) {
  const allPages = generateLandingPages();
  console.log(`[분석 결과] 총 ${allPages.length}개의 가상 롱테일 랜딩 페이지 경로 분석 완료.`);
  if (allPages.length > 0) {
    const sample = allPages[0];
    console.log("\n=== 매칭 샘플 (첫 번째 페이지 데이터 구조) ===");
    console.log(JSON.stringify(sample, null, 2));
  }
}
