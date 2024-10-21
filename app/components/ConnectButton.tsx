import { ConnectButton } from "thirdweb/react";
import { client } from '@/app/lib/thirdweb';
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";

const wallets = [
    inAppWallet({
        auth: {
            options: [
                "google",
                "email",
                "passkey",
                "phone",
                "apple",
                "x",
                "telegram",
            ],
        },
    }),
    createWallet("io.metamask"),
    createWallet("walletConnect"),
    createWallet("com.okex.wallet"),
    createWallet("com.coinbase.wallet"),
    createWallet("com.binance"),
    createWallet("global.safe"),
];

export function Connect() {
    return (
        <ConnectButton
            client={client}
            wallets={wallets}
            theme={"light"}
            connectButton={{ label: "Sign in" }}
            connectModal={{
                size: "wide",
                showThirdwebBranding: false,
            }}
            accountAbstraction={{
                chain: sepolia,
                sponsorGas: true,
            }}
            detailsButton={{
                displayBalanceToken: {
                    [sepolia.id]: "0xFdD5126B9801029897f57981b9b0Eb974B202853", // token address to display balance for
                },
            }}
        />
    );
}