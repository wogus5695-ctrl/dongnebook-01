import fs from 'fs';
import path from 'path';
import { categories, OPERATED_CATEGORIES } from '../src/data/categories.js';
import { tasks } from '../src/data/tasks.js';
import { regions } from '../src/data/regions.js';
import { businesses } from '../src/data/businesses.js';
import { adSlots } from '../src/data/adSlots.js';
import { CompanyCard } from '../src/components/CompanyCard.js';
import { resolveSeoTemplate } from '../src/data/seoTemplates.js';
import { buildLandingUrl } from '../src/utils/urlHelper.js';
import { checkIndexQuality } from '../src/utils/seoGate.js';

const normalize = (str) => {
  if (!str) return "";
  return decodeURIComponent(str).replace(/\s+/g, " ").trim();
};

export default function handler(req, res) {
  const regParam = req.query.reg;
  const catParam = req.query.cat;
  const taskParam = req.query.task;

  const activeCategories = categories.filter(c => c.visible !== false);
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
  const currentCat = activeCategories.find(c => c.id === catParam);
  const currentTask = tasks.find(t => t.id === taskParam);
  const taskBelongsToCat = currentTask && currentTask.categoryIds.includes(catParam);

  // 1. 유효하지 않은 조합 시 Soft-404 방지를 위해 HTTP 404 반환
  if (!regParam || !catParam || !taskParam || !currentRegion || !currentCat || !OPERATED_CATEGORIES.includes(catParam) || !currentTask || !taskBelongsToCat) {
    res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>404 Not Found | 동네책자</title>
        <meta name="robots" content="noindex, nofollow">
        <link rel="stylesheet" href="/src/css/main.css">
      </head>
      <body style="background-color: var(--bg-main); font-family: var(--font-family); padding: 40px 20px;">
        <div style="max-width: 600px; margin: 80px auto; padding: 40px 24px; background-color: var(--bg-card); border: 2px dashed #c0392b; border-radius: var(--border-radius); text-align: center;">
          <h2 style="color: #c0392b; margin-bottom: 12px;">⚠️ 404 - 페이지를 찾을 수 없습니다</h2>
          <p style="color: var(--text-dark); font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px;">
            요청하신 카테고리, 지역 혹은 작업명이 존재하지 않거나 비활성화 상태입니다.
          </p>
          <a href="/" class="btn btn-primary" style="text-decoration: none; padding: 10px 20px;">홈으로 돌아가기</a>
        </div>
      </body>
      </html>
    `);
    return;
  }

  const regionName = currentRegion.displayName;
  const displayKeywordRegion = currentRegion.level === "neighborhood"
    ? (currentRegion.neighborhood || currentRegion.keywordName || regionName.split(' ').pop())
    : (currentRegion.district || currentRegion.keywordName || regionName.split(' ').pop());
  const keywordRegionName = displayKeywordRegion;
  const taskKeyword = currentTask.keyword || currentTask.name;
  const taskDisplayName = currentTask.displayName || currentTask.name;
  const catName = currentCat.name;

  // SEO 템플릿 처리
  const seoData = resolveSeoTemplate(catParam, keywordRegionName, taskDisplayName, taskParam);

  // 4. 업체 리스트업 섹션 매칭 및 렌더링
  const CURRENT_DATE = new Date("2026-06-30T10:30:00+09:00");
  const salesDistrict = currentRegion.level === "district"
    ? currentRegion
    : regions.find(r => r.id === currentRegion.parentId);

  const activeSlots = adSlots.filter(slot => {
    if (slot.status !== "active") return false;
    if (slot.categoryId !== catParam) return false;
    const taskMatches = slot.coverageTaskMode === "all-category-tasks" || slot.taskId === taskParam;
    if (!taskMatches) return false;
    if (slot.startDate !== null && CURRENT_DATE < new Date(slot.startDate)) return false;
    if (slot.endDate !== null && CURRENT_DATE > new Date(slot.endDate)) return false;
    return salesDistrict && slot.purchaseRegionId === salesDistrict.id;
  });

  const matched = [];
  const seenBizIds = new Set();
  activeSlots.forEach(slot => {
    if (seenBizIds.has(slot.businessId)) return;
    const biz = businesses.find(b => b.id === slot.businessId);
    if (biz && biz.visible && biz.status === "active") {
      seenBizIds.add(slot.businessId);
      matched.push({
        ...biz,
        slotPriority: slot.priority,
        slotStartDate: slot.startDate ? new Date(slot.startDate) : new Date(0)
      });
    }
  });

  matched.sort((a, b) => {
    if (a.slotPriority !== b.slotPriority) return a.slotPriority - b.slotPriority;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.slotStartDate - a.slotStartDate;
  });

  // Index Quality Gate 검증 실행
  const hasActiveListing = matched.length > 0;
  const indexQuality = checkIndexQuality(currentRegion, currentCat, currentTask, hasActiveListing);
  const robotsPolicy = indexQuality.indexable ? "index, follow" : "noindex, follow";

  // HTML 템플릿 로드 (빌드된 프로덕션 쉘 우선 로드)
  let templatePath = path.join(process.cwd(), 'dist', 'landing-shell.html');
  if (!fs.existsSync(templatePath)) {
    templatePath = path.join(process.cwd(), 'landing-shell.html');
  }
  let html = fs.readFileSync(templatePath, 'utf8');

  // 2. SEO 메타 및 OG 태그 인젝션
  const pageUrl = "https://dongnebook-01.vercel.app" + buildLandingUrl(regionName, catParam, taskParam);
  const ogImages = {
    "elastic-coating": "/assets/thumbs/neocoat.jpg",
    "window-caulking": "/assets/thumbs/rainguard.jpg",
    "waterproof-leak": "/assets/thumbs/rainguard.jpg"
  };
  const catOgImage = ogImages[catParam] || "/assets/thumbs/elastic-coating-bareumspace.jpg";

  const seoTitle = `${keywordRegionName} ${taskKeyword} 업체 찾기 | 동네책자`;
  const seoDesc = `${keywordRegionName}에서 ${taskKeyword} 상담 가능한 업체를 확인하고 전화·카카오톡으로 문의하세요.`;

  // `<head>` 영역 치환
  html = html.replace(/<title>.*?<\/title>/, `<title>${seoTitle}</title>`);
  html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${seoDesc}">`);
  html = html.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${seoTitle}">`);
  html = html.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${seoDesc}">`);
  
  const ogMetaTags = `
    <link rel="canonical" href="${pageUrl}">
    <meta name="robots" content="${robotsPolicy}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:image" content="${catOgImage}">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "홈",
          "item": "https://dongnebook-01.vercel.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "${keywordRegionName}",
          "item": "https://dongnebook-01.vercel.app/hub.html?cat=${catParam}"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${catName}",
          "item": "https://dongnebook-01.vercel.app/hub.html?cat=${catParam}"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "${taskDisplayName}",
          "item": "${pageUrl}"
        }
      ]
    }
    </script>
  `;
  
  let faqSchema = '';
  if (seoData && seoData.faq && seoData.faq.length > 0) {
    faqSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        ${seoData.faq.map(f => `
        {
          "@type": "Question",
          "name": "${f.q.replace(/"/g, '\\"')}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "${f.a.replace(/"/g, '\\"')}"
          }
        }`).join(',')}
      ]
    }
    </script>
    `;
  }

  html = html.replace('</head>', `${ogMetaTags}\n${faqSchema}\n</head>`);

  // 3. 브레드크럼 치환
  html = html.replace('<span id="bread-region">서울</span>', `<span id="bread-region">${keywordRegionName}</span>`);
  html = html.replace('<span id="bread-category">종합청소</span>', `<span id="bread-category">${catName}</span>`);
  html = html.replace('<span id="bread-task" style="color: var(--text-dark); font-weight: bold;">유리창청소</span>', `<span id="bread-task" style="color: var(--text-dark); font-weight: bold;">${taskDisplayName}</span>`);

  // H1 및 서브타이틀 치환
  html = html.replace(
    /id="landing-h1" style="[^"]*">\s*서울 강남구 유리창청소 업체 찾기\s*<\/h1>/,
    `id="landing-h1" style="font-size: 1.6rem; color: var(--secondary); margin-bottom: 8px; line-height: 1.35; letter-spacing: -0.02em;">\n        ${keywordRegionName} ${taskKeyword} 업체 찾기\n      </h1>`
  );
  html = html.replace(
    /id="landing-subtitle" style="[^"]*">\s*서울 강남구 인근에서 유리창청소 상담 가능한 업체 정보를 확인해보세요\.\s*<\/p>/,
    `id="landing-subtitle" style="margin-bottom: 18px; line-height: 1.5; color: var(--text-dark); font-size: 0.95rem;">\n        ${seoData ? seoData.heroDescription : `${keywordRegionName}에서 ${taskDisplayName} 상담 가능한 업체 정보를 확인해보세요.`}\n      </p>`
  );

  // 제목 치환
  html = html.replace('id="listings-main-title">서울 강남구 인근 상담 가능 업체', `id="listings-main-title">${keywordRegionName} 인근 상담 가능 업체`);

  // 카드 렌더링 주입
  if (matched.length > 0) {
    const cardsHTML = matched.map(biz => {
      const tagDisplayNames = biz.taskIds.map(tId => {
        const foundT = tasks.find(t => t.id === tId);
        return foundT ? foundT.name : tId;
      }).slice(0, 3);

      const listObj = {
        id: biz.id,
        name: biz.brandName,
        category: biz.categoryIds[0],
        regions: biz.serviceRegionIds.map(regId => {
          const found = regions.find(r => r.id === regId);
          return found ? found.displayName : regId;
        }),
        tags: tagDisplayNames,
        phone: biz.phone,
        kakaoLink: biz.kakaoUrl,
        siteLink: biz.websiteUrl,
        description: biz.description,
        isAd: true,
        badgeText: biz.badge,
        thumbnail: biz.image
      };
      return CompanyCard(listObj, { regionName: keywordRegionName, taskName: taskKeyword });
    }).join('\n');

    html = html.replace('<!-- JS 렌더링 -->', cardsHTML);
    html = html.replace('id="ad-coverage-notice" style="display: none;', 'id="ad-coverage-notice" style="display: block;');
  } else {
    // 대체 UI 활성화
    html = html.replace('id="landing-fallback" style="display: none;"', 'id="landing-fallback" style="display: block;"');
  }

  // 5. CTA 및 띠배너 동적 치환
  html = html.replace('이 지역에서 유리창청소 업체를 운영 중이신가요?', `이 지역에서 ${taskKeyword} 업체를 운영 중이신가요?`);
  html = html.replace('지역명+작업명 페이지에 업체 정보를 등록하고 상담 유입을 테스트할 수 있습니다.', `${keywordRegionName}+${taskKeyword} 페이지에 업체 정보를 등록하고 상담 유입을 테스트해보세요.`);
  html = html.replace('href="/apply.html" id="mini-ad-apply-link"', 'href="/apply.html" id="mini-ad-apply-link" class="ad-apply-cta-btn"');

  // 6. 가이드 및 FAQ 아코디언 서버 사이드 렌더링
  html = html.replace('id="guide-info-main-title">서울 강남구 유리창청소 상담 전 참고 정보', `id="guide-info-main-title">${keywordRegionName} ${taskDisplayName} 상담 전 참고 정보`);
  
  if (seoData) {
    const accordionHTML = seoData.infoSections.map(sec => `
      <details class="guide-accordion" style="background-color: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: var(--border-radius); padding: 12px;">
        <summary style="font-weight: 700; color: var(--text-dark); cursor: pointer; outline: none; font-size: 0.9rem;">${sec.title}</summary>
        <div class="guide-content" style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; border-top: 1px dashed var(--border-color); padding-top: 10px;">
          <p>${sec.desc}</p>
        </div>
      </details>
    `).join('\n');

    html = html.replace('<div class="guide-accordion-container" style="display: flex; flex-direction: column; gap: 10px;">', `<div class="guide-accordion-container" style="display: flex; flex-direction: column; gap: 10px;">\n${accordionHTML}\n<!--`);
    html = html.replace('<!-- 아코디언 1:', '-->\n        <!-- 아코디언 1:');
  }

  // FAQ 렌더링
  html = html.replace('id="landing-faq-title">서울 강남구 유리창청소 자주 묻는 질문', `id="landing-faq-title">${keywordRegionName} ${taskKeyword} 자주 묻는 질문 (FAQ)`);
  if (seoData) {
    const faqHTML = seoData.faq.map(f => `
      <details class="faq-item" style="background-color: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: var(--border-radius); padding: 16px; margin-bottom: 12px; font-family: var(--font-family);">
        <summary style="font-weight: 700; color: var(--text-dark); cursor: pointer; outline: none; font-size: 0.95rem;">Q. ${f.q}</summary>
        <div style="margin-top: 12px; font-size: 0.88rem; color: var(--text-muted); line-height: 1.65; border-top: 1px dashed var(--border-color); padding-top: 12px;">
          <p>A. ${f.a}</p>
        </div>
      </details>
    `).join('\n');
    html = html.replace('<!-- JS 렌더링 -->', faqHTML);
  }

  // 관련 지역 및 관련 작업 추천 리스트업
  let nearbyList = [];
  if (currentRegion.level === "district") {
    const childNeighborhoods = regions.filter(r => r.parentId === currentRegion.id && r.level === "neighborhood" && r.visible !== false);
    nearbyList.push(...childNeighborhoods.slice(0, 8));
    const nearbyDistricts = regions.filter(r => r.level === "district" && r.id !== currentRegion.id && r.visible !== false && (currentRegion.nearbyRegionIds ? currentRegion.nearbyRegionIds.includes(r.id) : r.province === currentRegion.province));
    nearbyList.push(...nearbyDistricts.slice(0, 4));
  } else if (currentRegion.level === "neighborhood") {
    const siblingNeighborhoods = regions.filter(r => r.parentId === currentRegion.parentId && r.id !== currentRegion.id && r.level === "neighborhood" && r.visible !== false);
    nearbyList.push(...siblingNeighborhoods.slice(0, 8));
    const parentDistrict = regions.find(r => r.id === currentRegion.parentId);
    const nearbyDistricts = regions.filter(r => r.level === "district" && r.visible !== false && (parentDistrict && parentDistrict.nearbyRegionIds ? parentDistrict.nearbyRegionIds.includes(r.id) : r.province === currentRegion.province));
    nearbyList.push(...nearbyDistricts.slice(0, 4));
  }
  nearbyList = nearbyList.filter((regObj, index, self) => regObj.displayName !== regionName && self.findIndex(r => r.id === regObj.id) === index);
  if (nearbyList.length < 3) {
    nearbyList.push(...regions.filter(r => r.id !== currentRegion.id && r.visible !== false && r.province === currentRegion.province).slice(0, 8));
  }

  const nearbyHTML = nearbyList.map(regObj => {
    const regKeyword = regObj.keywordName || regObj.neighborhood || regObj.district || regObj.displayName.split(' ').pop();
    return `
      <a href="${buildLandingUrl(regObj.displayName, catParam, taskParam)}" class="region-bubble">
        ${regKeyword} ${taskKeyword}
      </a>
    `;
  }).join('\n');
  html = html.replace('<div class="region-links-wrapper" id="nearby-links-wrapper" style="margin-bottom: 20px;">', `<div class="region-links-wrapper" id="nearby-links-wrapper" style="margin-bottom: 20px;">\n${nearbyHTML}`);

  const related = tasks.filter(t => t.categoryIds.includes(catParam) && t.id !== taskParam && t.visible !== false).slice(0, 8);
  const relatedHTML = related.map(t => {
    const tKeyword = t.keyword || t.name;
    return `
      <a href="${buildLandingUrl(regionName, catParam, t.id)}" class="region-bubble" style="border-color: var(--primary);">
        ${keywordRegionName} ${tKeyword}
      </a>
    `;
  }).join('\n');
  html = html.replace('<div class="region-links-wrapper" id="related-tasks-wrapper">', `<div class="region-links-wrapper" id="related-tasks-wrapper">\n${relatedHTML}`);

  // 모바일 하단 플로팅 바 전화 연결 링크 치환
  const primaryPhone = matched.length > 0 ? matched[0].phone : null;
  if (primaryPhone && primaryPhone !== "추후 입력") {
    html = html.replace('href="tel:010-1234-5678" id="sticky-call-btn"', `href="tel:${primaryPhone}" id="sticky-call-btn"`);
    html = html.replace('📞 유리창청소 문의', `📞 ${taskKeyword} 문의 전화 연결`);
  } else {
    html = html.replace('href="tel:010-1234-5678" id="sticky-call-btn"', 'href="/apply.html" id="sticky-call-btn" class="ad-apply-cta-btn"');
    html = html.replace('📞 유리창청소 문의', `📢 이 지역 첫 광고 입점 신청`);
  }
  html = html.replace('href="/apply.html" id="sticky-apply-btn"', 'href="/apply.html" id="sticky-apply-btn" class="ad-apply-cta-btn"');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
}
