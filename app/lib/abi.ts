export const grantv1ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_launchDayTimestampInSeconds",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [

        ],
        "name": "CannotRenounceOwnership",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "InvalidConfiguration",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "InvalidGrant",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "launchDayTimestamp",
                "type": "uint256"
            }
        ],
        "name": "GrantInitialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [

        ],
        "name": "OwnershipRenouncePrevented",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "calculateId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "grantId",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "grantId",
                "type": "uint256"
            }
        ],
        "name": "checkValidity",
        "outputs": [

        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "getAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "getCurrentId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "grantId",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "grantId",
                "type": "uint256"
            }
        ],
        "name": "getGrantTimestamps",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "startTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTimestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "getLaunchDayTimestamp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "renounceOwnership",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

export const reservepregrantABI = [
    {
        "inputs": [
            {
                "internalType": "contract IGrant",
                "name": "_grant",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_maxReservationsPerGrant",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [

        ],
        "name": "AlreadyReserved",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "CannotAcceptEther",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "CannotRenounceOwnership",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "InvalidConfiguration",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "InvalidGrantId",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "ReservationLimitReached",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "contract IGrant",
                "name": "grant",
                "type": "address"
            }
        ],
        "name": "GrantUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newMaxReservations",
                "type": "uint256"
            }
        ],
        "name": "MaxReservationsPerGrantUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [

        ],
        "name": "OwnershipRenouncePrevented",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "grantId",
                "type": "uint256"
            }
        ],
        "name": "ReservationLimitReachedEvent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "grantId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensReserved",
        "type": "event"
    },
    {
        "stateMutability": "nonpayable",
        "type": "fallback"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "grantId",
                "type": "uint256"
            }
        ],
        "name": "getReservationCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "count",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "grantId",
                "type": "uint256"
            }
        ],
        "name": "getReservedAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "grant",
        "outputs": [
            {
                "internalType": "contract IGrant",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "maxReservationsPerGrant",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "renounceOwnership",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "reservationCounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "reserveTokens",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "reservedAmounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IGrant",
                "name": "_grant",
                "type": "address"
            }
        ],
        "name": "setGrant",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_maxReservations",
                "type": "uint256"
            }
        ],
        "name": "setMaxReservationsPerGrant",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;