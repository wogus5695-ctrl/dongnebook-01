import { upload } from '@vercel/blob/client';

export default async function handler(req, res) {
  // POST 이외의 요청 차단
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  // 구글 앱스 스크립트 웹앱 주소가 설정되지 않은 경우 처리 (Mock Fallback 또는 안내)
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("YOUR_REAL_GOOGLE")) {
    console.log("[Mock Vercel API Serverless-Mode] 로컬 환경 또는 미설정 상태 대응으로 성공 Mocking 처리합니다.");
    return res.status(200).json({ success: true, message: 'Mock success' });
  }

  try {
    const data = req.body;

    // application/x-www-form-urlencoded 포맷으로 인코딩 전환 (기존 Apps Script의 doPost 호환성 유지)
    const formBody = [];
    for (const property in data) {
      const encodedKey = encodeURIComponent(property);
      const val = Array.isArray(data[property]) ? data[property].join(", ") : data[property];
      const encodedValue = encodeURIComponent(val);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    const serializedData = formBody.join("&");

    // Vercel Serverless Function -> Google Apps Script 전송 (CORS 제약이 없으므로 normal fetch 가동)
    const gasResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: serializedData
    });

    if (!gasResponse.ok) {
      throw new Error(`Google Apps Script HTTP Error: ${gasResponse.status}`);
    }

    const responseText = await gasResponse.text();
    let resultJson;
    try {
      resultJson = JSON.parse(responseText);
    } catch (parseErr) {
      // JSON 파싱 실패 시 단순 텍스트 판단
      if (responseText.includes("success") || responseText.includes("result")) {
        resultJson = { result: "success" };
      } else {
        throw new Error(`Invalid response format from GAS: ${responseText}`);
      }
    }

    if (resultJson && (resultJson.result === 'success' || resultJson.success === true)) {
      return res.status(200).json({ success: true });
    } else {
      const errMsg = resultJson ? (resultJson.message || resultJson.error) : 'Unknown GAS error';
      return res.status(500).json({ success: false, error: errMsg });
    }

  } catch (error) {
    console.error("[Vercel API Relay Error]:", error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}
