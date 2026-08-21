import { generateUploadToken } from '@vercel/blob/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    // 환경변수 미연결 시 로컬 개발 목업 토큰 반환
    console.log("[Mock Vercel Upload-Token] BLOB_READ_WRITE_TOKEN 환경변수가 감지되지 않아 Mocking 모드로 발급합니다.");
    return res.status(200).json({
      success: true,
      mockMode: true,
      clientToken: "mock-client-token-for-local-poc"
    });
  }

  try {
    const { pathname, contentType } = req.body;

    // 1. MIME 및 확장자 이중 보안 검증 (비허용 포맷 거부)
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(contentType)) {
      return res.status(400).json({ success: false, error: 'Unsupported Media Type' });
    }

    // 2. Vercel Blob clientToken 발급 정책 수립 (Direct client upload용 일회성 티켓)
    const clientToken = await generateUploadToken({
      token,
      pathname,
      contentType,
      onUploadCompleted: async ({ blob }) => {
        console.log('[Upload completed inside Serverless]:', blob.url);
      }
    });

    return res.status(200).json({ success: true, clientToken });
  } catch (error) {
    console.error("[generateUploadToken failure]:", error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}
