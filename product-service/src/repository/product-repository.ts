import { ProductInput } from "../dto/product-input";
import { ProductDoc, products } from "../models";

export class ProductRepository {
  constructor() {}

  async createProduct({
    name,
    description,
    price,
    category_id,
    image_url,
  }: ProductInput): Promise<ProductDoc> {
    return (await products.create({
      name,
      description,
      price,
      category_id,
      image_url,
      availability: true,
    })) as ProductDoc;
  }

  async getAllProducts(offset = 0, pages?: number): Promise<ProductDoc[]> {
    return (await products
      .find({})
      .skip(offset)
      .limit(pages ? pages : 500)) as ProductDoc[];
  }

  async getProductById(id: string): Promise<ProductDoc> {
    return (await products.findById(id)) as ProductDoc;
  }

  async updateProduct({
    id,
    name,
    description,
    price,
    category_id,
    image_url,
    availability,
  }: ProductInput): Promise<ProductDoc> {
    return (await products.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category_id,
        image_url,
        availability,
      },
      { new: true }
    )) as ProductDoc;
  }

  async deleteProduct(id: string) {
    const { category_id } = await this.getProductById(id);
    const deleteResult = await products.deleteOne({ _id: id });
    return { category_id, deleteResult };
  }
}
