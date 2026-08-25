export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  priceTomanDisplay: string;
  priceUsdCents: number;
};

export const products: Record<string, Product> = {
  "shadow-strike": {
    id: "shadow-strike",
    name: "Shadow Strike",
    description: "کفش ورزشی مدل Shadow Strike",
    image: "/images/featured-shoe.png",
    priceTomanDisplay: "۲,۹۵۰,۰۰۰ تومان",
    priceUsdCents: 7900,
  },
};
