import jose from "node-jose";
import getEnv from "../configs/getEnv.js";

// Function to encrypt the payload
const encryptPayload = async (payload) => {
    try {
        const keyStore = jose.JWK.createKeyStore();
        const publicKey = await keyStore.add(getEnv("PUBLIC_KEY_FOR_ENCRYPTION"), "pem");
        const encrypted = await jose.JWE.createEncrypt({ format: "compact" }, publicKey)
            .update(JSON.stringify(payload))
            .final();
        return encrypted;
    } catch (error) {
        console.error(`Error encrypting payload: ${error.message}`);
        throw error;
    }
};

// Function to decrypt the payload
const decryptPayload = async (encrypted) => {
    try {
        const keyStore = jose.JWK.createKeyStore();
        const privateKey = await keyStore.add(getEnv("PRIVATE_KEY_FOR_ENCRYPTION"), "pem");
        const result = await jose.JWE.createDecrypt(privateKey).decrypt(encrypted);
        return JSON.parse(result.payload.toString());
    } catch (error) {
        console.error(`Error decrypting payload: ${error.message}`);
        throw error;
    }
};

export { encryptPayload, decryptPayload };
