export function withTryCatch<T>(fn: (...args: any[]) => Promise<T>) {
  return async (...args: any[]): Promise<T | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('An error occurred:', error.message);
      return null; // หรือโยนข้อผิดพลาดกลับถ้าจำเป็น
    }
  };
}
