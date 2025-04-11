import base64url from 'base64url';

type ChallengeResponse = {
    user: {
        id: string;
        name: string;
    };
    challenge: string;
}

export const createPublicKeyPairWithChallenge = async (challengeResponse: ChallengeResponse): Promise<Credential | null> => {
    const { user, challenge } = challengeResponse;
    const options: CredentialCreationOptions = {
        publicKey: {
            rp: {
                name: 'Passkey project',
            },
            user: {
                id: Uint8Array.from(base64url.toBuffer(user.id)),
                name: user.name,
                displayName: user.name,
            },
            challenge: Uint8Array.from(base64url.toBuffer(challenge)),
            pubKeyCredParams: [
                {
                    type: 'public-key',
                    alg: -7, // ES256
                },
                {
                    type: 'public-key',
                    alg: -257, // RS256
                },
                {
                    type: 'public-key',
                    alg: -8, // Ed25519
                },
            ],
            authenticatorSelection: {
                userVerification: "preferred",
            },
        }
    };

    const newCredentials = await navigator.credentials.create(options);
    return newCredentials;
}