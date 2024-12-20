import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { PROJECT_ID, API_KEY, SITE_KEY, DEV_HTTPS_PROXY, PROD_HTTPS_PROXY } from '@/app/src/config/recaptcha';

const proxyUrl = process.env.NODE_ENV === 'production' ? PROD_HTTPS_PROXY : DEV_HTTPS_PROXY;

const axiosInstance = axios.create({
    timeout: 30000,
    httpsAgent: proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
});

// 验证 reCAPTCHA Token 并支持重试
export async function verifyRecaptchaWithRetry(token: string, expectedAction: string, retries = 3): Promise<any> {
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${API_KEY}`;
    const requestBody = {
        event: { token, expectedAction, siteKey: SITE_KEY },
    };

    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempt ${i + 1}/${retries}`);
            const response = await axiosInstance.post(url, requestBody);
            return response.data;
        } catch (error: any) {
            console.error(`Attempt ${i + 1}/${retries} failed:`, {
                message: error.message,
                response: error.response?.data,
            });
            if (i === retries - 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
        }
    }
}
