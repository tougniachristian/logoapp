import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  //   HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const status = exception.getStatus();
    const errorResponse: string | object = exception.getResponse();

    const message =
      typeof errorResponse === 'string' ? errorResponse : errorResponse; //Je doute sur le message d'erreur

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
