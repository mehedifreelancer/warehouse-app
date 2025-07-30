import type { AxiosResponse } from "axios";
import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { ProductCategory, ProductCategoriesResponse, CreateProductCategoryPayload, UpdateProductCategoryPayload } from "../../types/products/productCategory.types";


export const getProductCategories = (): Promise<ProductCategory[]> =>
  api
    .get<ProductCategoriesResponse>("/product/categories/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch product categories:", err);
      throw err;
    });

export const createProductCategory = (payload: CreateProductCategoryPayload): Promise<AxiosResponse<ProductCategory>> => {
  return api
    .post<ProductCategory>("/product/categories/", payload)
    .then((res) => {
      toastCustom({
        title: "Category Created",
        message: `Category "${res.data.category_name}" was successfully created.`,
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to create category.";
      toastCustom({
        title: "Creation Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const updateProductCategory = async (
  id: number,
  payload: UpdateProductCategoryPayload
): Promise<AxiosResponse<ProductCategory>> => {
  try {
    const res = await api.put<ProductCategory>(`/product/categories/${id}/`, payload);

    toastCustom({
      title: "Category Updated",
      message: `Category "${res.data.category_name}" was successfully updated.`,
      type: "success",
    }); 

    return res;
  } catch (err: any) {
    console.error("Failed to update category:", err);
                       
    const errorMessage =
       err?.response?.data?.category_name?.[0] || "Failed to update category.";

    toastCustom({ 
      title: "Update Failed",
      message: errorMessage,
      type: "error",
    });

    throw err;
  }
};

export const deleteProductCategory = (id: number): Promise<AxiosResponse<void>> =>
  api
    .delete(`/product/categories/${id}/`)
    .then((res) => {
      toastCustom({
        title: "Category Deleted",
        message: "Category was successfully deleted.",
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete category.";
      toastCustom({
        title: "Deletion Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });