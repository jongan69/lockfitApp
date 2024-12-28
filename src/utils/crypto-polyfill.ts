// import "react-native-get-random-values";
import nacl from 'tweetnacl';
import { sha256 } from 'js-sha256';

// Setup minimal crypto polyfill
const webCrypto = {
    getRandomValues: (array: Uint8Array) => {
        const keyPair = nacl.sign.keyPair();
        array.set(keyPair.publicKey.slice(0, array.length));
        return array;
    },
    randomUUID: () => {
        const keyPair = nacl.sign.keyPair();
        const bytes = keyPair.publicKey.slice(0, 16);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
    },
    subtle: {
        digest: async (algorithm: string, data: BufferSource) => {
            const buffer = Buffer.from(data as ArrayBuffer);
            const hash = sha256.create();
            hash.update(buffer);
            return Promise.resolve(new Uint8Array(hash.arrayBuffer()));
        }
    } as unknown as SubtleCrypto
};

global.crypto = webCrypto as unknown as Crypto;

// TODO: Probably need if we ever want to use solana web3.js v2+
// import { install } from '@solana/webcrypto-ed25519-polyfill';
// install(); 