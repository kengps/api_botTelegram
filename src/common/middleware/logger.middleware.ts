import { Injectable ,NestMiddleware} from "@nestjs/common";



@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { method, originalUrl } = req;
    
    // เมื่อ response ถูกส่งกลับ
    res.on('finish', () => {
      const { statusCode ,statusMessage} = res;  // ดึง Status Code จาก response
      console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} ${statusMessage}`);
   
    });

    next();
  }
}
