import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

interface ErrorExample {
  message: string;
  error?: string;
}

interface QueryParam {
  name: string;
  required?: boolean;
  type?: unknown;
  description?: string;
  enum?: unknown[];
}

interface PathParam {
  name: string;
  required?: boolean;
  type?: unknown;
  description?: string;
}

export interface ApiDocOptions {
  summary: string;
  description?: string;
  body?: Type<unknown>;
  /** Raw OpenAPI schema for multipart/form-data bodies (use instead of `body`) */
  bodySchema?: Record<string, unknown>;
  auth?: boolean;
  consumes?: string[];
  extraModels?: Type<unknown>[];
  queries?: QueryParam[];
  params?: PathParam[];
  res?: {
    ok?: Type<unknown>;
    okIsArray?: boolean;
    notFound?: ErrorExample;
    conflict?: ErrorExample;
    forbidden?: ErrorExample;
    badRequest?: ErrorExample;
    unauthorized?: ErrorExample;
  };
}

function errorResponse(statusCode: number, example: ErrorExample) {
  return ApiResponse({
    status: statusCode,
    description: example.error ?? example.message,
    schema: {
      example: {
        success: false,
        statusCode,
        message: example.message,
        path: '/api/v1/...',
        timestamp: new Date().toISOString(),
      },
    },
  });
}

export function ApiDoc(
  options: ApiDocOptions,
): MethodDecorator & ClassDecorator {
  const decorators: (MethodDecorator | ClassDecorator | PropertyDecorator)[] = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
  ];

  if (options.auth) decorators.push(ApiBearerAuth());
  if (options.consumes) decorators.push(ApiConsumes(...options.consumes));
  if (options.body) decorators.push(ApiBody({ type: options.body }));
  if (options.bodySchema)
    decorators.push(ApiBody({ schema: options.bodySchema as never }));
  if (options.extraModels?.length)
    decorators.push(ApiExtraModels(...options.extraModels));

  options.queries?.forEach((q) =>
    decorators.push(
      ApiQuery({
        name: q.name,
        required: q.required ?? false,
        type: q.type as never,
        description: q.description,
        enum: q.enum as never,
      }),
    ),
  );

  options.params?.forEach((p) =>
    decorators.push(
      ApiParam({
        name: p.name,
        required: p.required ?? true,
        type: p.type as never,
        description: p.description,
      }),
    ),
  );

  if (options.res?.ok)
    decorators.push(
      ApiOkResponse({
        type: options.res.ok,
        isArray: options.res.okIsArray ?? false,
      }),
    );
  if (options.res?.notFound)
    decorators.push(errorResponse(404, options.res.notFound));
  if (options.res?.conflict)
    decorators.push(errorResponse(409, options.res.conflict));
  if (options.res?.forbidden)
    decorators.push(errorResponse(403, options.res.forbidden));
  if (options.res?.badRequest)
    decorators.push(errorResponse(400, options.res.badRequest));
  if (options.res?.unauthorized)
    decorators.push(errorResponse(401, options.res.unauthorized));

  return applyDecorators(...decorators);
}
