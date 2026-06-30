import { categories } from '../data/categories.js';
import { tasks } from '../data/tasks.js';
import { regions } from '../data/regions.js';
import { businesses } from '../data/businesses.js';

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
      const category = categories.find(c => c.id === task.categoryId);
      if (!category) return;

      // 1. 매칭 업체 필터링
      const matchedBusinesses = filterBusinessesForPage({
        regionSlug: region.slug,
        categoryId: category.id,
        taskId: task.id
      });

      // 2. SEO 정보 가공
      const provinceKr = region.province;
      const cityKr = region.city ? ` ${region.city}` : "";
      const districtKr = region.district ? ` ${region.district}` : "";
      const neighborhoodKr = region.neighborhood ? ` ${region.neighborhood}` : "";
      const fullRegionName = `${provinceKr}${cityKr}${districtKr}${neighborhoodKr}`.trim();

      const pageTitle = category.seoTitleTemplate
        .replace("[지역명]", fullRegionName)
        .replace("[작업명]", task.name);

      const pageDescription = category.seoDescriptionTemplate
        .replace("[지역명]", fullRegionName)
        .replace("[작업명]", task.name);

      // 3. 인근 지역 슬러그 목록
      const nearbyLinks = region.nearbyRegions.map(slug => {
        const targetReg = regions.find(r => r.slug === slug);
        return {
          displayName: targetReg ? targetReg.displayName : slug,
          url: `/${category.slug}/${slug}/${task.slug}`
        };
      });

      // 4. 관련 작업들 링크 목록
      const relatedLinks = tasks
        .filter(t => t.categoryId === category.id && t.id !== task.id)
        .map(t => ({
          name: t.name,
          url: `/${category.slug}/${region.slug}/${t.slug}`
        }));

      // 5. FAQ 텍스트 지역+작업명 치환
      const customizedFaq = category.faq.map(item => ({
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
          title: pageTitle,
          description: pageDescription,
          canonical: `https://dongnae-booklet.co.kr${pageUrl}`,
          sitemap: matchedBusinesses.length > 0 // 매칭된 활성 광고 업체가 있는 경우만 sitemap에 등록 (크롤링 효율 극대화)
        },
        faq: customizedFaq,
        priceGuide: {
          standard: category.priceGuide.standard,
          note: category.priceGuide.note
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
 * 업체 필터링 코어 매칭 알고리즘
 */
function filterBusinessesForPage({ regionSlug, categoryId, taskId }) {
  return businesses
    .filter(biz => {
      // 규칙 A: 노출 설정이 켜져있어야 함
      if (!biz.visible) return false;

      // 규칙 B: 광고 상태가 active 상태여야 함
      if (biz.adStatus !== "active") return false;

      // 규칙 C: 현재 날짜 기준 광고 시작일~종료일 이내여야 함
      const start = new Date(biz.adStartDate);
      const end = new Date(biz.adEndDate);
      if (CURRENT_DATE < start || CURRENT_DATE > end) return false;

      // 규칙 D: 카테고리 매칭
      if (!biz.categoryIds.includes(categoryId)) return false;

      // 규칙 E: 작업(Task) 매칭
      if (!biz.taskIds.includes(taskId)) return false;

      // 규칙 F: 서비스 제공 지역 매칭 (상위 지역 매칭 시 하위 지역 자동 노출 지원)
      // 예: 업체가 "seoul/gangnam"을 지원할 때 "seoul/gangnam/nonhyeon" 페이지에 자동 매칭 허용
      const isRegionMatch = biz.serviceRegions.some(reg => {
        return regionSlug === reg || regionSlug.startsWith(reg + "/");
      });

      return isRegionMatch;
    })
    // 우선순위가 높은(숫자가 큰) 업체 순서대로 상단에 노출
    .sort((a, b) => b.priority - a.priority);
}

// 빌드 모듈 또는 디버그용 실행 지원
if (process.argv[1] && process.argv[1].endsWith('generator.js')) {
  const allPages = generateLandingPages();
  console.log(`[분석 결과] 총 ${allPages.length}개의 가상 롱테일 랜딩 페이지 경로 분석 완료.`);
  const sample = allPages[0];
  console.log("\n=== 매칭 샘플 (첫 번째 페이지 데이터 구조) ===");
  console.log(JSON.stringify(sample, null, 2));
}
