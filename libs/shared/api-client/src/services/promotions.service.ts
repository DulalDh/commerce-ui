import { resource } from './resource';
import type { Coupon, FlashSale, PromotionRule } from '@org/types';

export const couponsService = resource<Coupon>('/coupons');
export const flashSalesService = resource<FlashSale>('/flash-sales');
export const promotionRulesService = resource<PromotionRule>('/promotion-rules');
