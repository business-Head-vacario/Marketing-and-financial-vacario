import { TAX_RATE } from "./constants";
import { priceAfterDiscount } from "./utils";

export type Quote = {
  unitPrice: number;
  listPrice: number;
  guests: number;
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  taxRate: number;
};

/** Single source of truth for package pricing — used by the booking form and the API. */
export function quoteFor(
  pkg: { price: number; discountPercent: number },
  guests: number,
): Quote {
  const people = Math.max(1, Math.floor(guests || 1));
  const unitPrice = priceAfterDiscount(pkg.price, pkg.discountPercent);
  const subtotal = Math.round(pkg.price * people);
  const discount = Math.round((pkg.price - unitPrice) * people);
  const taxable = subtotal - discount;
  const taxes = Math.round(taxable * TAX_RATE);
  return {
    unitPrice,
    listPrice: pkg.price,
    guests: people,
    subtotal,
    discount,
    taxes,
    total: taxable + taxes,
    taxRate: TAX_RATE,
  };
}
