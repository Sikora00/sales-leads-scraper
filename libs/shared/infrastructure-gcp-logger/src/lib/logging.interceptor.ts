import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Request } from 'express';
import { Logger } from '@sales-leads/shared/application';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> {
    const request: Request = context.switchToHttp().getRequest();

    this.logger.log({
      data: {
        requestData: {
          path: request.path,
          body: request.body,
        },
      },
      message: 'Incoming request',
    });

    return next.handle().pipe(
      tap((res) => {
        this.logger.log({
          message: 'Returning response',
          data: { responseData: res || null },
        });
      }),
      catchError((err) => {
        this.logger.error({
          message: 'Request failed',
          data: { error: err },
        });
        return throwError(err);
      })
    );
  }
}
