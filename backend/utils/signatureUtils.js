import crypto from "crypto";

/**
 * 🔑 Generate SHA256 signature
 * Steps:
 * 1. base64Payload = base64Encode(JSON.stringify(payload))
 * 2. signature = SHA256(base64Payload + apiEndpoint + saltKey)
 */
export const generateSignature = (payload, apiEndpoint, saltKey) => {
  const base64Payload = Buffer.from(payload, "utf-8").toString("base64").replace(/\n/g, "");
  const dataToSign = `${base64Payload}${apiEndpoint}${saltKey}`;
  
  const signature = crypto.createHash("sha256").update(dataToSign).digest("hex");

  console.log("🔑 Base64 Payload:", base64Payload);
  console.log("🔑 Data to Sign:", dataToSign);
  console.log("✅ Generated Signature:", signature);

  return signature;
};
