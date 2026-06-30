import fs from 'fs';
import path from 'path';

const categories = [
  { id: "general-cleaning", name: "종합청소", slug: "cleaning" },
  { id: "waterproof-leak", name: "방수/누수", slug: "waterproofing" },
  { id: "window-caulking", name: "창틀코킹/창틀누수", slug: "caulking" },
  { id: "drain-clog", name: "하수구막힘", slug: "drain" }
];

const tasks = [
  // 종합청소
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
  // 방수/누수
  { id: "exterior-waterproofing", categoryId: "waterproof-leak", name: "외벽방수", slug: "exterior-waterproofing" },
  { id: "rooftop-waterproofing", categoryId: "waterproof-leak", name: "옥상방수", slug: "rooftop-waterproofing" },
  { id: "roof-waterproofing", categoryId: "waterproof-leak", name: "지붕방수", slug: "roof-waterproofing" },
  { id: "rain-leak", categoryId: "waterproof-leak", name: "빗물누수", slug: "rain-leak" },
  { id: "exterior-leak", categoryId: "waterproof-leak", name: "외벽누수", slug: "exterior-leak" },
  { id: "rooftop-leak", categoryId: "waterproof-leak", name: "옥상누수", slug: "rooftop-leak" },
  // 창틀코킹
  { id: "window-caulking-task", categoryId: "window-caulking", name: "창틀코킹", slug: "window-caulking" },
  { id: "window-leak", categoryId: "window-caulking", name: "창틀누수", slug: "window-leak" },
  { id: "window-silicon", categoryId: "window-caulking", name: "창틀실리콘", slug: "window-silicon" },
  { id: "chassis-silicon", categoryId: "window-caulking", name: "샷시실리콘", slug: "chassis-silicon" },
  { id: "window-rain-leak", categoryId: "window-caulking", name: "빗물누수", slug: "window-rain-leak" },
  // 하수구막힘
  { id: "drain-clogged", categoryId: "drain-clog", name: "하수구막힘", slug: "drain-clogged" },
  { id: "sink-clogged", categoryId: "drain-clog", name: "싱크대막힘", slug: "sink-clogged" },
  { id: "toilet-clogged", categoryId: "drain-clog", name: "변기막힘", slug: "toilet-clogged" },
  { id: "bathroom-drain-clogged", categoryId: "drain-clog", name: "배수구막힘", slug: "bathroom-drain-clogged" },
  { id: "main-sewer-clogged", categoryId: "drain-clog", name: "오수관막힘", slug: "main-sewer-clogged" },
  { id: "main-sewer-backflow", categoryId: "drain-clog", name: "오수관역류", slug: "main-sewer-backflow" }
];

const regions = [
  { displayName: "서울 강남구", slug: "seoul/gangnam" },
  { displayName: "서울 강남구 논현동", slug: "seoul/gangnam/nonhyeon" },
  { displayName: "서울 강남구 역삼동", slug: "seoul/gangnam/yeoksam" },
  { displayName: "서울 송파구", slug: "seoul/songpa" },
  { displayName: "서울 송파구 잠실동", slug: "seoul/songpa/jamsil" },
  { displayName: "경기 수원시", slug: "gyeonggi/suwon" },
  { displayName: "경기 수원시 장안구", slug: "gyeonggi/suwon/jangan" },
  { displayName: "경기 수원시 영통구", slug: "gyeonggi/suwon/yeongtong" },
  { displayName: "경기 파주시 운정동", slug: "gyeonggi/paju/unjeong" }
];

const businesses = [
  { categoryIds: ["general-cleaning"], taskIds: ["floor-cleaning", "post-construction-cleaning", "interior-cleaning", "hood-cleaning", "floor-waxing", "awning-cleaning"], serviceRegions: ["seoul/gangnam", "seoul/songpa", "gyeonggi/suwon"] },
  { categoryIds: ["general-cleaning"], taskIds: ["exterior-cleaning", "window-cleaning", "awning-cleaning", "sign-cleaning"], serviceRegions: ["seoul/gangnam", "seoul/gangnam/yeoksam", "seoul/gangnam/nonhyeon", "gyeonggi/suwon/yeongtong"] },
  { categoryIds: ["general-cleaning"], taskIds: ["fire-cleaning", "post-construction-cleaning", "interior-cleaning", "hood-cleaning"], serviceRegions: ["seoul/songpa", "seoul/songpa/jamsil", "gyeonggi/suwon/jangan"] },
  { categoryIds: ["window-caulking", "waterproof-leak"], taskIds: ["window-caulking-task", "window-leak", "window-silicon", "chassis-silicon", "window-rain-leak"], serviceRegions: ["seoul/gangnam", "seoul/gangnam/nonhyeon", "gyeonggi/suwon"] },
  { categoryIds: ["waterproof-leak", "window-caulking"], taskIds: ["exterior-waterproofing", "exterior-leak", "window-rain-leak", "rain-leak"], serviceRegions: ["seoul/songpa", "seoul/songpa/jamsil", "gyeonggi/suwon/jangan"] },
  { categoryIds: ["waterproof-leak"], taskIds: ["rooftop-waterproofing", "rooftop-leak", "rain-leak"], serviceRegions: ["seoul/gangnam", "seoul/songpa", "gyeonggi/suwon", "gyeonggi/suwon/yeongtong"] }
];

// 배포 관리 도메인으로 갱신
const DOMAIN = "https://dongnebook-01.vercel.app";
const lastmod = "2026-06-30";

function generateSitemap() {
  const urls = [];

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
  categories.forEach(cat => {
    urls.push({
      loc: `/hub.html?cat=${cat.id}`,
      changefreq: "daily",
      priority: "0.9"
    });
  });

  // 4. 활성 광고 매칭 롱테일 랜딩 페이지들
  regions.forEach(region => {
    tasks.forEach(task => {
      const category = categories.find(c => c.id === task.categoryId);
      if (!category) return;

      const hasActiveListing = businesses.some(biz => {
        const hasCat = biz.categoryIds.includes(category.id);
        const hasTask = biz.taskIds.includes(task.id);
        const hasReg = biz.serviceRegions.some(reg => {
          return region.slug === reg || region.slug.startsWith(reg + "/");
        });
        return hasCat && hasTask && hasReg;
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

  // XML 포맷 조립 (인코딩 처리 포함 및 XML 문법 완전 검증 보장)
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  urls.forEach(u => {
    // XML 내부 앰퍼샌드(&) 문자 탈출 처리로 웰폼드 XML 보증 (Vercel 파싱 에러 방지 핵심)
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
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');

  const distDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf-8');

  console.log(`[성공] Vercel 전용 sitemap.xml 빌드 완료. 포함된 총 URL 수: ${urls.length}개`);
}

generateSitemap();
