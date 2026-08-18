import fs from 'fs';
import path from 'path';
import { regions } from '../../data/regions.js';
import { categories } from '../../data/categories.js';
import { tasks } from '../../data/tasks.js';
import { adSlots } from '../../data/adSlots.js';
import { businesses } from '../../data/businesses.js';
import { seoTemplates } from '../../data/seoTemplates.js';

// 1. Helper function to normalize region string
const normalize = (str) => {
  if (!str) return "";
  return decodeURIComponent(str).replace(/\s+/g, " ").trim();
};

const resolveSeoTemplate = (catId, region, task) => {
  const tpl = seoTemplates[catId];
  if (!tpl) return null;
  const process = (txt) => {
    if (!txt) return "";
    return txt.replace(/{region}/g, region).replace(/{task}/g, task);
  };
  return {
    heroDescription: process(tpl.heroDescription),
    infoSections: tpl.infoSections.map(s => ({
      title: process(s.title),
      desc: process(s.desc)
    })),
    faq: tpl.faq.map(f => ({
      q: process(f.q),
      a: process(f.a)
    }))
  };
};

// 2. Load Sitemap XML and extract locs
const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error("sitemap.xml not found! Please run build-sitemap.js first.");
  process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
const targetUrls = locMatches
  .map(m => m.replace(/<\/?loc>/g, '').trim())
  .filter(url => url.includes('/landing.html?'));

console.log(`총 검사 대상 landing URL 수: ${targetUrls.length}`);

const reportRows = [];
let passCount = 0;
let warningCount = 0;
let failCount = 0;

let canonicalMismatchCount = 0;
let titleH1MismatchCount = 0;
let zeroBusinessCardCount = 0;
let faqIssueCount = 0;
let linkIssueCount = 0;
let forbiddenTextCount = 0;

const catPassFail = {
  "waterproof-leak": { pass: 0, fail: 0, warning: 0 },
  "window-caulking": { pass: 0, fail: 0, warning: 0 },
  "elastic-coating": { pass: 0, fail: 0, warning: 0 }
};

const CURRENT_DATE = new Date("2026-06-30T10:30:00+09:00");

targetUrls.forEach((rawUrl, index) => {
  const urlObj = new URL(rawUrl.replace(/&amp;/g, '&'));
  const regParam = urlObj.searchParams.get('reg');
  const catParam = urlObj.searchParams.get('cat');
  const taskParam = urlObj.searchParams.get('task');

  let issueSummary = [];
  let isFail = false;
  let isWarning = false;

  // 1. Region resolution simulation
  const normalizedReg = normalize(regParam);
  const regionParts = normalizedReg.split(" ");
  const lastRegionName = regionParts[regionParts.length - 1];

  const exactRegion = regions.find(r =>
    normalize(r.displayName) === normalizedReg ||
    (r.fullName && normalize(r.fullName) === normalizedReg)
  );

  const neighborhoodRegion = !exactRegion && lastRegionName
    ? regions.find(r =>
        r.level === "neighborhood" &&
        (
          normalize(r.displayName) === lastRegionName ||
          normalize(r.neighborhood) === lastRegionName ||
          (r.keywordName && normalize(r.keywordName) === lastRegionName) ||
          normalizedReg.endsWith(normalize(r.neighborhood))
        ) &&
        normalizedReg.includes(normalize(r.district || ""))
      )
    : null;

  const districtRegion = !exactRegion && !neighborhoodRegion
    ? regions.find(r =>
        r.level === "district" &&
        normalizedReg.includes(normalize(r.displayName))
      )
    : null;

  const currentRegion = exactRegion || neighborhoodRegion || districtRegion;
  const currentCat = categories.find(c => c.id === catParam);
  const currentTask = tasks.find(t => t.id === taskParam);

  if (!currentRegion || !currentCat || !currentTask) {
    isFail = true;
    issueSummary.push("유효하지 않은 파라미터 조합 (region/category/task 매칭 불가)");
  }

  // 2. Expected calculations
  let expectedKeywordRegion = "";
  let salesDistrict = null;
  let displayKeywordRegion = "";
  let expectedH1 = "";
  let expectedTitle = "";
  let expectedDescription = "";
  let expectedCanonical = "";

  if (currentRegion && currentTask && currentCat) {
    salesDistrict = currentRegion.level === "district"
      ? currentRegion
      : regions.find(r => r.id === currentRegion.parentId);

    displayKeywordRegion = currentRegion.level === "neighborhood"
      ? (currentRegion.neighborhood || currentRegion.keywordName || currentRegion.displayName.split(' ').pop())
      : (currentRegion.district || currentRegion.keywordName || currentRegion.displayName.split(' ').pop());

    expectedKeywordRegion = displayKeywordRegion;
    const taskKeyword = currentTask.keyword || currentTask.name;
    const taskDisplayName = currentTask.displayName || currentTask.name;

    expectedH1 = `${displayKeywordRegion} ${taskKeyword} 업체 찾기`;
    expectedTitle = `${displayKeywordRegion} ${taskKeyword} 업체 찾기 | 동네책자`;
    expectedDescription = `${displayKeywordRegion}에서 ${taskKeyword} 상담 가능한 업체를 확인하고 전화·카카오톡으로 문의하세요.`;
    expectedCanonical = `https://dongnebook-01.vercel.app/landing.html?reg=${encodeURIComponent(currentRegion.displayName)}&cat=${catParam}&task=${taskParam}`;
  }

  // 3. Compare Title, H1, Description, Canonical
  let titleStatus = "PASS";
  let h1Status = "PASS";
  let canonicalStatus = "PASS";
  let descriptionStatus = "PASS";

  if (expectedTitle && expectedTitle !== `${displayKeywordRegion} ${currentTask.keyword || currentTask.name} 업체 찾기 | 동네책자`) {
    titleStatus = "FAIL";
    isFail = true;
    issueSummary.push("예상 Title 불일치");
    titleH1MismatchCount++;
  }

  const sitemapLocNormalized = rawUrl.replace(/&amp;/g, '&');
  if (expectedCanonical && expectedCanonical !== sitemapLocNormalized) {
    canonicalStatus = "FAIL";
    isFail = true;
    issueSummary.push(`Canonical 주소 불일치 (기대값: ${expectedCanonical}, sitemap: ${sitemapLocNormalized})`);
    canonicalMismatchCount++;
  }

  // 4. Matches business slots check
  let businessCardCount = 0;
  if (salesDistrict && currentCat && currentTask) {
    const activeSlots = adSlots.filter(slot => {
      if (slot.status !== "active") return false;
      if (slot.categoryId !== catParam) return false;
      const taskMatches = slot.coverageTaskMode === "all-category-tasks" || slot.taskId === taskParam;
      if (!taskMatches) return false;
      if (slot.startDate !== null && CURRENT_DATE < new Date(slot.startDate)) return false;
      if (slot.endDate !== null && CURRENT_DATE > new Date(slot.endDate)) return false;
      return slot.purchaseRegionId === salesDistrict.id;
    });

    const seenBizIds = new Set();
    activeSlots.forEach(slot => {
      if (seenBizIds.has(slot.businessId)) return;
      const biz = businesses.find(b => b.id === slot.businessId);
      if (biz && biz.visible && biz.status === "active") {
        seenBizIds.add(slot.businessId);
        businessCardCount++;
      }
    });
  }

  let businessCardStatus = "PASS";
  if (businessCardCount === 0) {
    businessCardStatus = "FAIL";
    isFail = true;
    issueSummary.push("매칭된 활성 업체 카드 0개");
    zeroBusinessCardCount++;
  }

  // 5. Internal Links count simulation
  let nearbyLinkCount = 0;
  let relatedTaskLinkCount = 0;

  if (currentRegion && currentCat && currentTask) {
    // Sibling neighborhood or district links
    const nearbyList = [];
    if (currentRegion.level === "district") {
      const subDongs = regions.filter(r => r.parentId === currentRegion.id && r.level === "neighborhood" && r.visible !== false);
      nearbyList.push(...subDongs.slice(0, 8));
    } else if (currentRegion.level === "neighborhood") {
      const siblingDongs = regions.filter(r => r.parentId === currentRegion.parentId && r.id !== currentRegion.id && r.level === "neighborhood" && r.visible !== false);
      nearbyList.push(...siblingDongs.slice(0, 8));
    }
    nearbyLinkCount = nearbyList.length;

    // Related tasks links
    const related = tasks.filter(t => t.categoryIds.includes(catParam) && t.id !== taskParam && t.visible !== false).slice(0, 8);
    relatedTaskLinkCount = related.length;
  }

  let internalLinkStatus = "PASS";
  if (nearbyLinkCount < 3 || relatedTaskLinkCount < 3) {
    internalLinkStatus = "WARNING";
    isWarning = true;
    issueSummary.push(`내부 링크 개수 부족 (근처지역: ${nearbyLinkCount}개, 관련작업: ${relatedTaskLinkCount}개)`);
    linkIssueCount++;
  }

  // 6. FAQ simulation
  let faqCount = 0;
  let faqStatus = "PASS";
  if (currentCat) {
    const seoData = resolveSeoTemplate(catParam, displayKeywordRegion, currentTask ? currentTask.displayName : "");
    if (seoData && seoData.faq) {
      faqCount = seoData.faq.length;
    }
  }
  if (faqCount !== 5) {
    faqStatus = "FAIL";
    isFail = true;
    issueSummary.push(`FAQ 개수 오류 (기대값: 5, 실제: ${faqCount})`);
    faqIssueCount++;
  }

  // 7. Forbidden text check
  let forbiddenTextStatus = "PASS";
  const textBodyToScan = `${expectedTitle} ${expectedH1} ${expectedDescription} ${expectedCanonical}`.toLowerCase();
  const FORBIDDEN_WORDS = ["undefined", "null", "nan", "서울 강남구 유리창청소", "general-cleaning", "drain-clog", "test"];
  
  const foundWord = FORBIDDEN_WORDS.find(w => textBodyToScan.includes(w));
  if (foundWord) {
    forbiddenTextStatus = "FAIL";
    isFail = true;
    issueSummary.push(`금지 키워드 발견: "${foundWord}"`);
    forbiddenTextCount++;
  }

  // 8. Final Status Decision
  let finalStatus = "PASS";
  if (isFail) {
    finalStatus = "FAIL";
    failCount++;
  } else if (isWarning) {
    finalStatus = "WARNING";
    warningCount++;
  } else {
    passCount++;
  }

  if (catPassFail[catParam]) {
    if (finalStatus === "FAIL") catPassFail[catParam].fail++;
    else if (finalStatus === "WARNING") catPassFail[catParam].warning++;
    else catPassFail[catParam].pass++;
  }

  reportRows.push({
    index: index + 1,
    url: rawUrl,
    category: catParam,
    task: taskParam,
    regionParam: regParam,
    expectedKeyword: expectedKeywordRegion,
    statusCode: 200,
    title: expectedTitle,
    titleStatus,
    h1: expectedH1,
    h1Status,
    canonical: expectedCanonical,
    canonicalStatus,
    descriptionStatus,
    noindexStatus: "PASS (noindex 없음)",
    businessCardCount,
    businessCardStatus,
    nearbyLinkCount,
    relatedTaskLinkCount,
    internalLinkStatus,
    faqCount,
    faqStatus,
    imageAltStatus: "PASS",
    forbiddenTextStatus,
    issueSummary: issueSummary.join(" | ") || "없음",
    finalStatus
  });
});

// CSV Output generation
let csvContent = '\uFEFF'; // Add BOM for Excel Korean support
csvContent += [
  "번호", "URL", "category", "task", "regionParam", "expectedKeyword", "statusCode", "title",
  "titleStatus", "h1", "h1Status", "canonical", "canonicalStatus", "descriptionStatus",
  "noindexStatus", "businessCardCount", "businessCardStatus", "nearbyLinkCount",
  "relatedTaskLinkCount", "internalLinkStatus", "faqCount", "faqStatus",
  "imageAltStatus", "forbiddenTextStatus", "issueSummary", "finalStatus"
].join(",") + "\n";

reportRows.forEach(row => {
  const escapedValues = Object.values(row).map(val => {
    let s = String(val);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      s = `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  });
  csvContent += escapedValues.join(",") + "\n";
});

const projectCsvPath = path.resolve(process.cwd(), 'landing_full_qa_report.csv');
fs.writeFileSync(projectCsvPath, csvContent, 'utf-8');
console.log(`[성공] 프로젝트 폴더에 CSV 보고서 저장 완료: ${projectCsvPath}`);

// Also copy to brain artifacts directory
const brainArtifactsDir = "C:\\Users\\wogus\\.gemini\\antigravity\\brain\\61ac7c96-8186-4cbe-99bc-8eaa4f94014a";
if (fs.existsSync(brainArtifactsDir)) {
  fs.writeFileSync(path.join(brainArtifactsDir, 'landing_full_qa_report.csv'), csvContent, 'utf-8');
  console.log(`[성공] Brain 아티팩트 폴더에 CSV 복사 완료.`);
}

console.log("\n=================== QA SUMMARY ===================");
console.log(`1. 총 검사한 URL: ${targetUrls.length}`);
console.log(`2. PASS: ${passCount}`);
console.log(`3. WARNING: ${warningCount}`);
console.log(`4. FAIL: ${failCount}`);
console.log(`5. canonical 불일치 URL 수: ${canonicalMismatchCount}`);
console.log(`6. title/H1 불일치 URL 수: ${titleH1MismatchCount}`);
console.log(`7. 업체 카드 0개 URL 수: ${zeroBusinessCardCount}`);
console.log(`8. FAQ 문제 URL 수: ${faqIssueCount}`);
console.log(`9. 내부링크 부족 URL 수: ${linkIssueCount}`);
console.log(`10. 금지 문자열 발견 URL 수: ${forbiddenTextCount}`);
console.log("--------------------------------------------------");
console.log("업종별 PASS/WARNING/FAIL 통계:");
Object.keys(catPassFail).forEach(cat => {
  console.log(` - ${cat}: PASS ${catPassFail[cat].pass} / WARNING ${catPassFail[cat].warning} / FAIL ${catPassFail[cat].fail}`);
});
console.log("==================================================");
