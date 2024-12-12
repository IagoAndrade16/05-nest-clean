import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, any>): Promise<string> {
    return JSON.stringify(payload)
  }

}