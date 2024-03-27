import { AddItemInput, CategoryInput } from "../dto/category-input";
import { CategoryDoc, categories } from "../models";

export class CategoryRepository {
  constructor() {}

  async createCategory({
    name,
    parentId,
    imageUrl,
  }: CategoryInput): Promise<CategoryDoc> {
    const newCategory = await categories.create({
      name,
      parentId,
      imageUrl,
      subCategories: [],
      products: [],
    });

    if (parentId) {
      const parentCategory = await this.getCategoryById(parentId);
      parentCategory.subCategories.push(newCategory._id);
      parentCategory.save();
    }

    return newCategory as CategoryDoc;
  }

  async getAllCategories(offset = 0, pages?: number): Promise<CategoryDoc[]> {
    return (await categories
      .find({ parentId: null })
      .populate({
        path: "subCategories",
        model: "categories",
        populate: {
          path: "subCategories",
          model: "categories",
        },
      })
      .skip(offset)
      .limit(pages ? pages : 100)) as CategoryDoc[];
  }

  async getTopCategories(): Promise<CategoryDoc[]> {
    return (await categories
      .find({ parentId: { $ne: null } }, { products: { $slice: 10 } })
      .populate({ path: "products", model: "products" })
      .sort({ displayOrder: "descending" })
      .limit(10)) as CategoryDoc[];
  }

  async getCategoryById(
    id: string,
    offset = 0,
    pages?: number
  ): Promise<CategoryDoc> {
    return (await categories
      .findById(id, {
        products: { $slice: [offset, pages ? pages : 100] },
      })
      .populate({ path: "products", model: "products" })) as CategoryDoc;
  }

  async updateCategory({
    id,
    name,
    displayOrder,
    imageUrl,
  }: CategoryInput): Promise<CategoryDoc> {
    return (await categories.findByIdAndUpdate(
      id,
      {
        name,
        displayOrder,
        imageUrl,
      },
      { new: true }
    )) as CategoryDoc;
  }

  async deleteCategory(id: string) {
    return categories.deleteOne({ _id: id });
  }

  async addItem({ id, products }: AddItemInput): Promise<CategoryDoc> {
    let category = await this.getCategoryById(id);
    category.products = [...category.products, ...products];
    return (await category.save()) as CategoryDoc;
  }

  async removeItem({ id, products }: AddItemInput): Promise<CategoryDoc> {
    let category = await this.getCategoryById(id);
    const excludeProducts = category.products.filter(
      (item) => !products.includes(item)
    );
    category.products = excludeProducts;
    return (await category.save()) as CategoryDoc;
  }
}
