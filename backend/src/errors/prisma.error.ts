import { Prisma } from '../generated/prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interfaces';
import { httpStatus, httpStatusMessage, HttpStatus } from '../utils/http-status';

const handlePrismaError = (err: any): TGenericErrorResponse => {
  let statusCode: HttpStatus = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = httpStatusMessage[statusCode];
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  // Prisma Client Known Request Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      statusCode = httpStatus.CONFLICT;
      message = httpStatusMessage[statusCode];

      const target = err.meta?.target as string[] | undefined;
      const field: string = (target && target[0]) || 'field';

      errorSources = [
        {
          path: field,
          message: `${field} already exists`,
        },
      ];
      // Record not found
    } else if (err.code === 'P2025') {
      statusCode = httpStatus.NOT_FOUND;
      message = httpStatusMessage[statusCode];
      errorSources = [
        {
          path: '',
          message: 'The requested record was not found',
        },
      ];
      // Foreign key constraint violation
    } else if (err.code === 'P2003') {
      statusCode = httpStatus.BAD_REQUEST;
      message = httpStatusMessage[statusCode];

      const field =
        (err.meta?.field_name as string | undefined) || 'foreignKey';

      errorSources = [
        {
          path: field,
          message: `Invalid reference: ${field} does not exist`,
        },
      ];
      // Required relation violation
    } else if (err.code === 'P2014') {
      statusCode = httpStatus.BAD_REQUEST;
      message = httpStatusMessage[statusCode];
      errorSources = [
        {
          path: '',
          message: 'The change would violate the required relation',
        },
      ];
      // Null constraint violation
    } else if (err.code === 'P2011') {
      statusCode = httpStatus.BAD_REQUEST;
      message = httpStatusMessage[statusCode];

      const target = (err.meta?.target as string | undefined) || 'field';

      errorSources = [
        {
          path: target,
          message: `${target} cannot be null`,
        },
      ];
      // Missing required value
    } else if (err.code === 'P2012') {
      statusCode = httpStatus.BAD_REQUEST;
      message = httpStatusMessage[statusCode];

      const path = (err.meta?.path as string | undefined) || 'field';

      errorSources = [
        {
          path: path,
          message: `Missing required value for ${path}`,
        },
      ];
      // Missing required argument
    } else if (err.code === 'P2013') {
      statusCode = httpStatus.BAD_REQUEST;
      message = httpStatusMessage[statusCode];

      const argument =
        (err.meta?.argument_name as string | undefined) || 'argument';

      errorSources = [
        {
          path: argument,
          message: `Missing required argument: ${argument}`,
        },
      ];
      // Query interpretation error
    } else if (err.code === 'P2016') {
      statusCode = httpStatus.BAD_REQUEST;
      message = httpStatusMessage[statusCode];
      errorSources = [
        {
          path: '',
          message: 'Could not interpret the query',
        },
      ];
      // Table does not exist
    } else if (err.code === 'P2021') {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = httpStatusMessage[statusCode];

      const table = (err.meta?.table as string | undefined) || 'unknown';

      errorSources = [
        {
          path: '',
          message: `Table ${table} does not exist`,
        },
      ];
      // Column does not exist
    } else if (err.code === 'P2022') {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = httpStatusMessage[statusCode];

      const column = (err.meta?.column as string | undefined) || 'column';

      errorSources = [
        {
          path: column,
          message: `Column ${column} does not exist`,
        },
      ];
      // Other Prisma known errors
    } else {
      statusCode = httpStatus.BAD_REQUEST;
      message = httpStatusMessage[statusCode];
      errorSources = [
        {
          path: '',
          message: err.message || 'Unknown database error',
        },
      ];
    }
  }

  // Prisma Client Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = httpStatusMessage[statusCode];

    // Try to extract field information from the error message
    const fieldMatch = err.message.match(/Argument `(\w+)`/);
    const field: string = (fieldMatch && fieldMatch[1]) || 'input';

    errorSources = [
      {
        path: field,
        message: 'Invalid input data provided',
      },
    ];
  }

  // Prisma Client Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatusMessage[statusCode];
    errorSources = [
      {
        path: '',
        message: 'Could not connect to the database',
      },
    ];
  }

  // Prisma Client Rust Panic Error
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatusMessage[statusCode];
    errorSources = [
      {
        path: '',
        message: 'Database engine encountered an internal error',
      },
    ];
  }

  // Prisma Client Unknown Request Error
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatusMessage[statusCode];
    errorSources = [
      {
        path: '',
        message: err.message || 'An unknown database error occurred',
      },
    ];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

// Helper function to check if error is a Prisma error
export const isPrismaError = (error: any): boolean => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  );
};

export default handlePrismaError;
