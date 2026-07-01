import crypto from 'crypto';

const ORDER_ID_PREFIX = 'ORD-';
const ORDER_ID_RANDOM_LENGTH = 10;

export function generateOrderId(): string {
  const randomPart = crypto
    .randomBytes(Math.ceil(ORDER_ID_RANDOM_LENGTH / 2))
    .toString('hex')
    .toUpperCase()
    .slice(0, ORDER_ID_RANDOM_LENGTH);

  return `${ORDER_ID_PREFIX}${randomPart}`;
}
