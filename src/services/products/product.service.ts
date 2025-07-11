import api from "../../config/api/api-config";
import type { Product, ProductResponse } from "../../types/products/product.types";

export const getProducts = (): Promise<Product[]> =>
  api
    .get<ProductResponse>("/api/v1/product/products/")
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
