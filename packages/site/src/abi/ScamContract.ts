const abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                internalType: "address",
                name: "_nft",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "claimAirdrop",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "claimNFTAirdrop",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

export default abi;
