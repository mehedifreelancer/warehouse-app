import type { AxiosResponse } from "axios";
import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type {
  Product,
  ProductResponse,
  UpdateProductPayload,
} from "../../types/products/product.types";

export const getProducts = (): Promise<Product[]> =>
  api
    .get<ProductResponse>("/product/products/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch products:", err);
      throw err;
    });
//Posting new work process
// export const postWorkProcess = (
//   payload: WorkProcessPayload
// ): Promise<PostWorkProcessResponse> =>
//   api
//     .post<{ data: PostWorkProcessResponse }>("/v1/workProcess", payload)
//     .then((res) => {
//       toastCustom({
//         title: "Update Successfully Completed",
//         message: res.data.data.message, // Or res.data.data.message if needed
//         type: "success",
//       });
//       return res.data.data; // ✅ Only return the inner `data`
//     })
//     .catch((err) => {
//       console.error("Failed to update work process:", err);
//       toastCustom({
//         title: "Error",
//         message: err.data?.data?.message || "Something went wrong",
//         type: "error",
//       });
//       return err.data.data; // Adjust this if `err.data` is not the same structure
//     });

//Edit  work process
// export const editWorkProcess = (
//   id: number,
//   payload: WorkProcessPayload
// ): Promise<PostWorkProcessResponse> =>
//   api
//     .put<{ data: PostWorkProcessResponse }>(`/v1/workProcess/${id}`, payload)
//     .then((res) => {
//       toastCustom({
//         title: "Update Successfully Completed",
//         message: res.data.data.message,
//         type: "success",
//       });
//       return res.data.data;
//     })
//     .catch((err) => {
//       console.error("Failed to update work process:", err);
//       // throw err;
//       toastCustom({
//         title: "Error",
//         message: err.data.data.message,
//         type: "error",
//       });

//       return err.data.data;
//     });
export const deleteProduct = (id: number): Promise<AxiosResponse<void>> =>
  api
    .delete(`/product/products/${id}`)
    .then((res) => {
      toastCustom({
        title: "Product Deleted",
        message: `Product was successfully deleted.`,
        type: "success",
      });
      return res; // Return full Axios response
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || `Failed to delete product with ID ${id}.`;

      toastCustom({
        title: "Deletion Failed",
        message: errorMessage,
        type: "error",
      });

      throw err;
    });


    //Updating product
export const updateProduct = (
  id: number,
  payload: UpdateProductPayload
): Promise<AxiosResponse<Product>> =>
  api
    .patch<Product>(`/product/products/${id}/`, payload)
    .then((res) => {
      toastCustom({
        title: "Product Updated",
        message: `Product "${res.data.name}" was successfully updated.`,
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to update the product.";

      toastCustom({
        title: "Update Failed",
        message: errorMessage,
        type: "error",
      });

      throw err;
    });