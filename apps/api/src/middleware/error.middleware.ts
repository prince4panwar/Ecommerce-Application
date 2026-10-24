import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export const errorHandler = (
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
) => {
      // Log the error
      logger.error('API Error:', {
            error: err.message,
            stack: err.stack,
            method: req.method,
            url: req.url,
            body: req.body,
            params: req.params,
            query: req.query,
            ip: req.ip,
      });

      // Send error response
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
            success: false,
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      });
};

export const notFoundHandler = (req: Request, res: Response) => {
      logger.warn(`Route not found: ${req.method} ${req.url}`);
      res.status(404).json({
            success: false,
            message: 'Route not found',
      });
};
