export type ProductUpdate = {
  name: string;
  description: string;
  price: number;
};

type Product = ProductUpdate & {
  id: string;
};

// This is a temporary store for the product server actions. Replace it with a
// database repository before relying on it in a deployed application.
const products = new Map<string, Product>();

export function updateProduct(id: string, update: ProductUpdate) {
  const existing = products.get(id);

  if (!existing) {
    throw new Error("Product not found");
  }

  products.set(id, { ...existing, ...update });
}

export function deleteProduct(id: string) {
  if (!products.delete(id)) {
    throw new Error("Product not found");
  }
}
