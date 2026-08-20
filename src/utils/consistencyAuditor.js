import { categories, OPERATED_CATEGORIES } from '../data/categories.js';
import { adSlots } from '../data/adSlots.js';
import { businesses } from '../data/businesses.js';
import { regions } from '../data/regions.js';
import { tasks } from '../data/tasks.js';

/**
 * 관리자용 광고 구좌 리스트와 실제 소비자 랜딩페이지 노출 비즈니스 리스트 간의 정합성을 검증합니다.
 */
export function auditBusinessSlotConsistency() {
  const auditReport = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  const activeCategories = categories.filter(c => OPERATED_CATEGORIES.includes(c.id));

  activeCategories.forEach(cat => {
    // 해당 업종의 대상 구 구하기
    const districtIds = cat.targetDistrictIds || [];
    const associatedTasks = tasks.filter(t => t.categoryIds.includes(cat.id) && t.visible);

    districtIds.forEach(distId => {
      const distRegion = regions.find(r => r.id === distId);
      if (!distRegion) return;

      // 1. 관리자 구좌 점유 리스트 조회 (정렬 제외, 고유 ID 목록 획득)
      const adminSlots = adSlots.filter(s => 
        s.status === 'active' && 
        s.categoryId === cat.id && 
        s.purchaseRegionId === distId
      );
      
      const adminActiveSlots = adminSlots.filter(slot => {
        const biz = businesses.find(b => b.id === slot.businessId);
        return biz && biz.visible && biz.status === 'active';
      });

      const adminBizIds = Array.from(new Set(adminActiveSlots.map(s => s.businessId))).sort();

      // 2. 소비자 랜딩페이지 기준 검증 (해당 구 및 예하 동 단위까지 전수 대조)
      // 해당 구 자체 및 구 내부 동 리스트 구하기
      const targetRegions = [
        distRegion,
        ...regions.filter(r => r.parentId === distId && r.visible !== false)
      ];

      targetRegions.forEach(reg => {
        associatedTasks.forEach(task => {
          totalTests++;

          // 랜딩페이지 로직에 따른 실시간 매칭 비즈니스 조회
          const CURRENT_DATE = new Date("2026-06-30T10:30:00+09:00");
          const salesDistrict = reg.level === "district" ? reg : regions.find(r => r.id === reg.parentId);
          
          const landingMatchedSlots = adSlots.filter(slot => {
            if (slot.status !== "active") return false;
            if (slot.categoryId !== cat.id) return false;
            
            const taskMatches = slot.coverageTaskMode === "all-category-tasks" || slot.taskId === task.id;
            if (!taskMatches) return false;

            if (slot.startDate !== null && CURRENT_DATE < new Date(slot.startDate)) return false;
            if (slot.endDate !== null && CURRENT_DATE > new Date(slot.endDate)) return false;

            // 지역 계층 검사
            let currentReg = reg;
            let matchedRegion = false;
            while (currentReg) {
              if (currentReg.id === slot.purchaseRegionId) {
                matchedRegion = true;
                break;
              }
              currentReg = currentReg.parentId ? regions.find(r => r.id === currentReg.parentId) : null;
            }

            if (matchedRegion) {
              const biz = businesses.find(b => b.id === slot.businessId);
              return biz && biz.visible && biz.status === "active";
            }
            return false;
          });

          // 고유 비즈니스 ID 목록 추출 및 정렬
          const landingBizIds = Array.from(new Set(landingMatchedSlots.map(s => s.businessId))).sort();

          // 정합성 검증 비교 수행 (adminBizIds vs landingBizIds)
          const isConsistent = JSON.stringify(adminBizIds) === JSON.stringify(landingBizIds);

          if (isConsistent) {
            passedTests++;
          } else {
            failedTests++;
          }

          auditReport.push({
            category: cat.id,
            district: distRegion.displayName,
            regionName: reg.displayName,
            regionLevel: reg.level,
            taskName: task.displayName || task.name,
            adminCount: adminBizIds.length,
            landingCount: landingBizIds.length,
            adminBusinesses: adminBizIds,
            landingBusinesses: landingBizIds,
            status: isConsistent ? 'PASS' : 'FAIL'
          });
        });
      });
    });
  });

  return {
    summary: {
      totalTests,
      passedTests,
      failedTests,
      successRate: `${((passedTests / totalTests) * 100).toFixed(2)}%`
    },
    report: auditReport
  };
}
