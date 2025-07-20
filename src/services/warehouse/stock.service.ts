import type { AxiosResponse } from "axios";
import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { Stock, StockResponse, UpdateStockPayload } from "../../types/warehouse/stock.types";

export const getStocks = (): Promise<Stock[]> =>
  api
    .get<StockResponse>("/warehouse/stocks/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch stocks:", err);
      throw err;
    });

export const updateStock = (
  id: number,
  payload: UpdateStockPayload
): Promise<AxiosResponse<Stock>> => {
  return api
    .patch<Stock>(`/warehouse/stocks/${id}/`, payload)
    .then((res) => {
      toastCustom({
        title: "Stock Updated",
        message: `Stock for "${res.data.product_name}" was successfully updated.`,
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to update stock.";
      toastCustom({
        title: "Update Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const deleteStock = (id: number): Promise<AxiosResponse<void>> =>
  api
    .delete(`/warehouse/stocks/${id}/`)
    .then((res) => {
      toastCustom({
        title: "Stock Deleted",
        message: "Stock record was successfully deleted.",
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete stock.";
      toastCustom({
        title: "Deletion Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });