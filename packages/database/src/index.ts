export { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

export const Role = {
      CUSTOMER: "CUSTOMER",
      VENDOR: "VENDOR",
      ADMIN: "ADMIN"
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const OrderStatus = {
      PENDING: "PENDING",
      PROCESSING: "PROCESSING",
      SHIPPED: "SHIPPED",
      DELIVERED: "DELIVERED",
      CANCELLED: "CANCELLED"
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
