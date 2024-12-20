// src/lib/handleAxiosError.ts
import axios from 'axios';

export function handleAxiosError(error: any) {
    if (axios.isAxiosError(error)) {
        return {
            success: false,
            error: 'Network error',
            details: {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status,
            },
        };
    }
    return {
        success: false,
        error: 'Internal server error',
        details: {
            message: error.message,
            type: error.name,
            code: error.code,
        },
    };
}