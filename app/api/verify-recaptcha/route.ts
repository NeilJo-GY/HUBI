import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaWithRetry } from '@/app/src/lib/recaptchaService';
import { handleAxiosError } from '@/app/src/lib/handleAxiosError';

// 请求体验证函数
async function validateRequestBody(req: NextRequest) {
  const body = await req.json();
  if (!body?.token) {
    throw new Error('Token is required');
  }
  return body;
}

// 接收 POST 请求，验证 reCAPTCHA
export async function POST(req: NextRequest) {
  try {
    const { token, expectedAction } = await validateRequestBody(req);

    console.log("Received token:", token.substring(0, 20) + "...");
    console.log("Expected action:", expectedAction);

    const result = await verifyRecaptchaWithRetry(token, expectedAction || 'reserve');

    return NextResponse.json({
      success: true,
      data: {
        score: result.riskAnalysis?.score,
        action: result.tokenProperties.action,
        timestamp: result.tokenProperties.createTime,
      },
    });
  } catch (error: any) {
    console.error('Error verifying reCAPTCHA:', error);
    return NextResponse.json(handleAxiosError(error), {
      status: error.response?.status || 500,
    });
  }
}