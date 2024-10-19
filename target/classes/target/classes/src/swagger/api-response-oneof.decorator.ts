import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

export function ApiResponseOneOf(
  responses: Function[],
  options?: ApiResponseOptions,
) {
  return applyDecorators(
    ApiExtraModels(...responses),
    ApiResponse({
      ...options,
      schema: {
        oneOf: responses.map((response) => ({
          $ref: getSchemaPath(response),
        })),
      },
    }),
  );
}
