import React, { useState, useEffect } from 'react';
import { TransactionButton, useActiveWallet } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from '@/app/src/lib/thirdweb';
import { reservepregrantABI } from '@/app/src/lib/abi';

const ReservePreGrant = getContract({
    address: "0xc829A1C939EB5E9D441e61f4566a7322c0CE247f",
    chain: sepolia,
    client,
    abi: reservepregrantABI,
});

// Extend the window object to include grecaptcha
declare global {
    interface Window {
        grecaptcha: any;
    }
}

interface ReserveButtonProps {
    onReserveSuccess: () => void;
}

export function ReserveButton({ onReserveSuccess }: ReserveButtonProps) {
    const wallet = useActiveWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 检查reCAPTCHA脚本是否正确加载
        const checkRecaptchaLoad = () => {
            if (!window.grecaptcha?.enterprise) {
                console.error("reCAPTCHA enterprise not loaded properly");
                setError("reCAPTCHA loading failed");
            }
        };

        // 给脚本加载一个合理的超时时间
        const timeout = setTimeout(checkRecaptchaLoad, 3000);

        return () => clearTimeout(timeout);
    }, []); // 空依赖数组意味着这个效果只在组件挂载时运行一次

    const handleReCAPTCHA = async (): Promise<string> => {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

        if (!siteKey) {
            throw new Error("SiteKey is missing.");
        }

        // 使用 enterprise 命名空间的 ready 方法
        return new Promise((resolve, reject) => {
            if (!window.grecaptcha || !window.grecaptcha.enterprise) {
                return reject(new Error("reCAPTCHA enterprise object not found."));
            }

            window.grecaptcha.enterprise.ready(() => {
                console.log("Enterprise reCAPTCHA SDK is ready.");
                window.grecaptcha.enterprise.execute(siteKey, { action: "reserve" })
                    .then((token: string) => {
                        if (token) {
                            resolve(token);
                        } else {
                            reject(new Error("Failed to generate reCAPTCHA token."));
                        }
                    })
                    .catch(reject);
            });
        });
    };

    const handleClick = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // 添加日志确认函数开始执行
            console.log("Starting reCAPTCHA verification...");

            // 确保reCAPTCHA已加载
            if (!window.grecaptcha?.enterprise) {
                throw new Error("reCAPTCHA enterprise not loaded");
            }

            const token = await handleReCAPTCHA();
            console.log("Generated reCAPTCHA token:", token?.substring(0, 20) + "..."); // 只显示token的一部分

            if (!token) {
                throw new Error("Failed to generate reCAPTCHA token");
            }

            const response = await fetch("/api/verify-recaptcha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // 添加防止CSRF的头部
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin', // 添加凭证
                body: JSON.stringify({
                    token,
                    expectedAction: "reserve",
                }),
            });

            // 添加更详细的错误处理
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Verification result:", result);

            return result; // 返回验证结果供后续使用

        } catch (err: any) {
            console.error("Error in handleClick:", err);
            setError(err.message || "An unexpected error occurred");
            throw err; // 重新抛出错误以便TransactionButton处理
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <TransactionButton
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                disabled={!wallet || isLoading || !!error}
                onClick={async () => {
                    try {
                        await handleClick();
                        // 只有在reCAPTCHA验证成功后才继续交易
                    } catch (err) {
                        console.error("Failed to verify reCAPTCHA:", err);
                        return; // 阻止交易继续
                    }
                }}
                transaction={async () => {
                    return await prepareContractCall({
                        contract: ReservePreGrant,
                        method: "reserveTokens",
                        params: [],
                    });
                }}
                onTransactionSent={(tx) => {
                    console.log("Transaction Sent:", tx);
                    alert("Transaction Sent!");
                }}
                onTransactionConfirmed={async (receipt) => {
                    console.log("Transaction Confirmed:", receipt);
                    alert("Transaction Confirmed!");
                    setIsLoading(false);
                    try {
                        const response = await fetch('/api/testGrants/sync/currentGrant', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (!response.ok) {
                            throw new Error(`Failed to sync grant data: ${response.statusText}`);
                        }

                        console.log('Grant data successfully synced with Redis.');
                        onReserveSuccess(); // 触发父组件的刷新回调
                    } catch (error) {
                        console.error('Error syncing grant data:', error);
                    }
                }}
                onError={(err) => {
                    alert(err.message);
                    setIsLoading(false);
                }}
            >
                {isLoading ? "Processing..." : "Reserve"}
            </TransactionButton>
            {error && (
                <div className="text-red-500 mt-2">Error: {error}</div>
            )}
        </div>
    );
}