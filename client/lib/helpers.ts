import { decode, encode } from './base64url';

export const fetchWithErrorHandling = async <T>(
    url: string,
    options: RequestInit = {},
    errorMessage: string = "API request failed"
): Promise<T> => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`${errorMessage}: Server responded with status ${response.status}`);
        }
        return await response.json() as T;
    } catch (error) {
        console.error(`${errorMessage}:`, error);
        throw error;
    }
};

export type ChallengeResponse = {
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
                id: decode(user.id),
                name: user.name,
                displayName: user.name,
            },
            challenge: decode(challenge),
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

type AuthenticatorAttestationResponseWithTransports = AuthenticatorAttestationResponse & {
    getTransports?: () => string[];
}

export const buildLoginOptionsWithUserCredentials = async (
    userCredentials: any
): Promise<{
    response: {
        clientDataJSON: string;
        attestationObject: string;
        transports: string[];
    }
}> => {
    const { response } = userCredentials;
    // Cast to the extended interface that includes optional getTransports
    const attestationResponse = response as AuthenticatorAttestationResponseWithTransports;

    const body = {
        id: userCredentials.id,
        response: {
            clientDataJSON: encode(response.clientDataJSON as unknown as string),
            attestationObject: encode(attestationResponse.attestationObject as unknown as string),
            transports: attestationResponse.getTransports ? attestationResponse.getTransports() : [],
        }
    };

    return body;
};