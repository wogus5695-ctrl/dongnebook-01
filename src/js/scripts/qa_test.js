import { categories } from '../../data/categories.js';
import { tasks } from '../../data/tasks.js';
import { regions } from '../../data/regions.js';
import { businesses } from '../../data/businesses.js';
import { adSlots } from '../../data/adSlots.js';

console.log("=== 동네책자 MVP 1단계 데이터 파일 무결성 QA 테스트 시작 ===");

let hasError = false;

// Helper: 에러 로깅
function logError(msg) {
  console.error("❌ [오류]: " + msg);
  hasError = true;
}

// Helper: 성공 로깅
function logSuccess(msg) {
  console.log("✅ [성공]: " + msg);
}

// 1. 카테고리 검수
const activeCats = categories.filter(c => c.visible !== false);
const inactiveCats = categories.filter(c => c.visible === false);

if (activeCats.length === 3) {
  logSuccess(`활성 카테고리 수 검증 완료 (총 3개: ${activeCats.map(c=>c.id).join(', ')})`);
} else {
  logError(`활성 카테고리 수가 3개가 아닙니다! (현재 활성 수: ${activeCats.length}개)`);
}

const drainClogCat = categories.find(c => c.id === "drain-clog");
if (drainClogCat && drainClogCat.visible === false) {
  logSuccess("drain-clog(하수구막힘) 카테고리의 visible: false 상태 확인 완료.");
} else {
  logError("drain-clog 카테고리가 비활성화되지 않았거나 존재하지 않습니다!");
}

// 2. 태스크 검수
tasks.forEach(t => {
  // categoryIds 매핑 검증
  t.categoryIds.forEach(catId => {
    const foundCat = categories.find(c => c.id === catId);
    if (!foundCat) {
      logError(`Task [${t.id}]가 존재하지 않는 Category ID [${catId}]를 참조하고 있습니다.`);
    }
  });

  // 하수구막힘 세부 작업 비활성 검증
  if (t.categoryIds.includes("drain-clog") && t.visible !== false) {
    logError(`비활성 하수구 카테고리의 하위 작업 [${t.id}]가 visible: false가 아닙니다!`);
  }
});
logSuccess("태스크 카테고리 맵 및 하수구막힘 하위 작업 비활성 검증 완료.");

// 빗물누수(rain-leak) 다중 카테고리 양방향 연결 검증
const rainLeakTask = tasks.find(t => t.id === "rain-leak");
if (rainLeakTask && rainLeakTask.categoryIds.includes("waterproof-leak") && rainLeakTask.categoryIds.includes("window-caulking")) {
  logSuccess("빗물누수(rain-leak)의 방수/누수 및 창틀코킹 카테고리 다중 연결 상태 확인 완료.");
} else {
  logError("빗물누수(rain-leak)의 양방향 카테고리 연결 설정에 오류가 있습니다!");
}

// 3. 지역 검수
regions.forEach(r => {
  if (r.parentId) {
    const foundParent = regions.find(p => p.id === r.parentId);
    if (!foundParent) {
      logError(`Region [${r.id}]의 parentId [${r.parentId}]가 실제 존재하지 않습니다.`);
    }
  }

  r.nearbyRegionIds.forEach(nearId => {
    const foundNear = regions.find(n => n.id === nearId);
    if (!foundNear) {
      logError(`Region [${r.id}]의 nearbyRegionId [${nearId}]가 실제 존재하지 않습니다.`);
    }
  });
});
logSuccess("지역 데이터 계층형 parentId 및 인근 지역 nearbyRegionIds 데이터 검증 완료.");

// 4. 업체 검수 (businesses)
const internalBrands = businesses.filter(b => b.isInternalBrand === true && b.visible !== false);
if (internalBrands.length === 6) {
  logSuccess("활성 내부 브랜드가 정상적으로 6개 등록되어 있습니다. (청소 3개, 방수/코킹 3개)");
} else {
  logError(`활성 내부 브랜드 수가 6개가 아닙니다! (현재 수: ${internalBrands.length}개)`);
}

businesses.forEach(b => {
  b.categoryIds.forEach(catId => {
    const foundCat = categories.find(c => c.id === catId);
    if (!foundCat) {
      logError(`Business [${b.id}]가 존재하지 않는 Category ID [${catId}]를 참조하고 있습니다.`);
    }
  });

  b.taskIds.forEach(tId => {
    const foundTask = tasks.find(t => t.id === tId);
    if (!foundTask) {
      logError(`Business [${b.id}]가 존재하지 않는 Task ID [${tId}]를 참조하고 있습니다.`);
    }
  });

  b.serviceRegionIds.forEach(regId => {
    const foundReg = regions.find(r => r.id === regId);
    if (!foundReg) {
      logError(`Business [${b.id}]가 존재하지 않는 Region ID [${regId}]를 참조하고 있습니다.`);
    }
  });
});
logSuccess("업체 데이터의 참조 ID 유효성 검증 완료.");

// 5. 광고 구좌 검수 (adSlots)
adSlots.forEach(slot => {
  const foundBiz = businesses.find(b => b.id === slot.businessId);
  if (!foundBiz) {
    logError(`AdSlot [${slot.id}]의 businessId [${slot.businessId}]가 실제 존재하지 않는 업체를 참조하고 있습니다.`);
  }

  const foundCat = categories.find(c => c.id === slot.categoryId);
  if (!foundCat) {
    logError(`AdSlot [${slot.id}]의 categoryId [${slot.categoryId}]가 실제 존재하지 않는 카테고리를 참조하고 있습니다.`);
  }

  const foundTask = tasks.find(t => t.id === slot.taskId);
  if (!foundTask) {
    logError(`AdSlot [${slot.id}]의 taskId [${slot.taskId}]가 실제 존재하지 않는 작업을 참조하고 있습니다.`);
  }

  const foundReg = regions.find(r => r.id === slot.purchaseRegionId);
  if (!foundReg) {
    logError(`AdSlot [${slot.id}]의 purchaseRegionId [${slot.purchaseRegionId}]가 실제 존재하지 않는 지역을 참조하고 있습니다.`);
  } else if (foundReg.level !== "district") {
    logError(`AdSlot [${slot.id}]의 purchaseRegionId가 district(구) 레벨이 아닙니다! (참조 레벨: ${foundReg.level})`);
  }
});
logSuccess("광고 구좌(adSlots)의 참조 무결성 검증 완료.");

console.log("\n=== 데이터 QA 최종 판정 ===");
if (hasError) {
  console.log("❌ 데이터 무결성 검증 실패 (로그 오류 항목을 확인하여 수정하세요)");
} else {
  console.log("✅ 데이터 무결성 검증 성공 (참조 오류 없음)");
}
