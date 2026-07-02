import fs from 'fs';
import path from 'path';
import { categories } from '../../data/categories.js';
import { tasks } from '../../data/tasks.js';
import { regions } from '../../data/regions.js';
import { businesses } from '../../data/businesses.js';
import { adSlots } from '../../data/adSlots.js';

// 배포 관리 도메인으로 갱신
const DOMAIN = "https://dongnebook-01.vercel.app";
const lastmod = "2026-06-30";

function generateSitemap() {
  const urls = [];
  const activeCategories = categories.filter(c => c.visible !== false);

  // 1. 고정 정적 페이지들
  const staticPages = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/guide.html", changefreq: "weekly", priority: "0.8" },
    { loc: "/apply.html", changefreq: "weekly", priority: "0.8" }
  ];
  staticPages.forEach(p => urls.push(p));

  // 2. 통합 정책 탭 분기 URL 정식 포함
  const policyTabs = ["privacy", "terms", "ad-standards", "refund"];
  policyTabs.forEach(tab => {
    urls.push({
      loc: `/policy.html?tab=${tab}`,
      changefreq: "monthly",
      priority: "0.5"
    });
  });

  // 3. 카테고리 허브 페이지들
  activeCategories.forEach(cat => {
    urls.push({
      loc: `/hub.html?cat=${cat.id}`,
      changefreq: "daily",
      priority: "0.9"
    });
  });

  // 4. 활성 광고 매칭 롱테일 랜딩 페이지들 (adSlots 기준 매칭)
  const CURRENT_DATE = new Date("2026-06-30T10:30:00+09:00");
  regions.forEach(region => {
    tasks.forEach(task => {
      const category = activeCategories.find(c => task.categoryIds.includes(c.id));
      if (!category || !task.visible) return;

      // 해당 지역, 카테고리, 작업에 할당된 active 광고 구좌(adSlot)가 있는지 확인
      const hasActiveListing = adSlots.some(slot => {
        if (slot.status !== "active") return false;
        if (slot.categoryId !== category.id || slot.taskId !== task.id) return false;

        const start = new Date(slot.startDate);
        const end = new Date(slot.endDate);
        if (CURRENT_DATE < start || CURRENT_DATE > end) return false;

        // 지역 매칭 (계층형 고려)
        let currentReg = region;
        let matchedRegion = false;
        while (currentReg) {
          if (currentReg.id === slot.purchaseRegionId) {
            matchedRegion = true;
            break;
          }
          currentReg = currentReg.parentId ? regions.find(r => r.id === currentReg.parentId) : null;
        }

        // 해당 구좌의 업체가 존재하는지도 검증
        if (matchedRegion) {
          const biz = businesses.find(b => b.id === slot.businessId);
          return biz && biz.visible && biz.status === "active";
        }
        return false;
      });

      if (hasActiveListing) {
        urls.push({
          loc: `/landing.html?reg=${encodeURIComponent(region.displayName)}&cat=${category.id}&task=${task.id}`,
          changefreq: "daily",
          priority: "0.7"
        });
      }
    });
  });

  // XML 포맷 조립 (XML 문법 완전 검증 보장)
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  urls.forEach(u => {
    const escapedLoc = `${DOMAIN}${u.loc}`.replace(/&/g, '&amp;');
    xml += `  <url>\n`;
    xml += `    <loc>${escapedLoc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');

  const distDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf-8');

  console.log(`[성공] Vercel 전용 sitemap.xml 빌드 완료. 포함된 총 URL 수: ${urls.length}개`);
}

generateSitemap();
