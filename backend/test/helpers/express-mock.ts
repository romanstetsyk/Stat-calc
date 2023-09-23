import type { Request, Response } from 'express';
import { vi } from 'vitest';

const mockReq = (req?: Record<string, unknown>): Request => {
  return { ...req } as unknown as Request;
};

const mockRes = (res?: Record<string, unknown>): Response => {
  const response = { ...res } as unknown as Response;
  response.status = vi.fn().mockReturnThis();
  response.json = vi.fn().mockReturnThis();
  return response;
};

const mockNext = vi.fn;

export { mockNext, mockReq, mockRes };
