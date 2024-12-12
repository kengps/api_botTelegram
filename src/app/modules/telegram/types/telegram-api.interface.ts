type ApiId = number;
type ApiHash = string;

export interface telegramTypeApi {
  apiId: ApiId;
  apiHash: ApiHash;
}
export type AuthResult = {
    user: {
      id: string;
      accessHash: string;
      firstName: string;
      lastName: string;
      username: string;
      phone: string;
      [key: string]: any; // สำหรับ property อื่น ๆ
    };
    flags: number;
    setupPasswordRequired: boolean;
    futureAuthToken?: Buffer;
    [key: string]: any; // สำหรับ property อื่น ๆ
  };