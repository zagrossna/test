export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  priceTomanDisplay: string;
  priceUsdCents: number;
};

export type ProductRow = {
  id: string;
  name: string;
  description: string;
  image: string;
  price_toman_display: string;
  price_usd_cents: number;
};

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    priceTomanDisplay: row.price_toman_display,
    priceUsdCents: row.price_usd_cents,
  };
}
