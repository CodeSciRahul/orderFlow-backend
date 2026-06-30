import { IApiMeta, IApiResponse, IValidationError } from '../interfaces';

export class ResponseHelper {
  static success<T>(
    message: string,
    data?: T,
    meta?: IApiMeta,
  ): IApiResponse<T> {
    const response: IApiResponse<T> = {
      success: true,
      message,
    };

    if (data !== undefined) {
      response.data = data;
    }

    if (meta !== undefined) {
      response.meta = meta;
    }

    return response;
  }

  static error(
    message: string,
    errors?: IValidationError[],
  ): IApiResponse<null> {
    const response: IApiResponse<null> = {
      success: false,
      message,
    };

    if (errors !== undefined && errors.length > 0) {
      response.errors = errors;
    }

    return response;
  }

  static paginated<T>(
    message: string,
    data: T[],
    meta: Required<Pick<IApiMeta, 'page' | 'limit' | 'total' | 'totalPages'>>,
  ): IApiResponse<T[]> {
    return this.success(message, data, meta);
  }
}
