import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { 
  ProductItem, 
  ProductItemResponse,
  CreateProductItemPayload,
  UpdateProductItemPayload
} from "../../types/products/productItem.types";

export const getProductItems = (): Promise<ProductItem[]> =>
  api
    .get<ProductItemResponse>("/product/product-items/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch product items:", err);
      throw err;
    });

export const createProductItem = (payload: CreateProductItemPayload): Promise<ProductItem> => {
  const formData = new FormData();
  formData.append("SKU", payload.SKU);
  formData.append("quantity_allocated", payload.quantity_allocated.toString());
  formData.append("price_override", payload.price_override.toString());
  formData.append("barcode", payload.barcode);
  formData.append("product", payload.product.toString());
  if (payload.color) formData.append("color", payload.color.toString());
  if (payload.size) formData.append("size", payload.size.toString());
  if (payload.item_image) formData.append("item_image", payload.item_image);

  return api
    .post<ProductItem>("/product/product-items/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      toastCustom({
        title: "Product Item Created",
        message: `Product Item "${res.data.SKU}" was successfully created.`,
        type: "success",
      });
      return res.data;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to create product item.";
      toastCustom({
        title: "Creation Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const updateProductItem = (
  id: number,
  payload: UpdateProductItemPayload
): Promise<ProductItem> => {
  const formData = new FormData();
  if (payload.SKU) formData.append("SKU", payload.SKU);
  if (payload.quantity_allocated) formData.append("quantity_allocated", payload.quantity_allocated.toString());
  if (payload.price_override) formData.append("price_override", payload.price_override.toString());
  if (payload.color) formData.append("color", payload.color.toString());
  if (payload.item_image) formData.append("item_image", payload.item_image);

  return api
    .patch<ProductItem>(`/product/product-items/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      toastCustom({
        title: "Product Item Updated",
        message: `Product Item "${res.data.SKU}" was successfully updated.`,
        type: "success",
      });
      return res.data;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to update product item.";
      toastCustom({
        title: "Update Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const deleteProductItem = (id: number): Promise<void> =>
  api
    .delete(`/product/product-items/${id}/`)
    .then(() => {
      toastCustom({
        title: "Product Item Deleted",
        message: "Product item was successfully deleted.",
        type: "success",
      });
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete product item.";
      toastCustom({
        title: "Deletion Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });

export const getColors = (): Promise<Color[]> =>
  api
    .get<Color[]>("/product/colors/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch colors:", err);
      throw err;
    });