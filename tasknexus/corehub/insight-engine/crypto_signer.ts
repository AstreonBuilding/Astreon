export class SigningEngine {
  private keyPair?: CryptoKeyPair

  constructor() {}

  async init(): Promise<void> {
    this.keyPair = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )
  }

  private ensureKeys(): CryptoKeyPair {
    if (!this.keyPair) throw new Error("SigningEngine not initialized. Call init() first.")
    return this.keyPair
  }

  async sign(data: string): Promise<string> {
    const { privateKey } = this.ensureKeys()
    const enc = new TextEncoder().encode(data)
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, enc)
    return Buffer.from(sig).toString("base64")
  }

  async verify(data: string, signature: string): Promise<boolean> {
    const { publicKey } = this.ensureKeys()
    const enc = new TextEncoder().encode(data)
    const sig = Buffer.from(signature, "base64")
    return crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, sig, enc)
  }
}
