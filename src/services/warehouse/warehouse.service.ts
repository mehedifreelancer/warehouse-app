import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type {
  Warehouse,
  WarehouseResponse,
  CreateWarehousePayload,
} from "../../types/warehouse/warehouse.types";

export const getWarehouses = (): Promise<Warehouse[]> =>
  api
    .get<WarehouseResponse>("/warehouse/houses/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch warehouses:", err);
      throw err;
    });

export const createWarehouse = (
  payload: CreateWarehousePayload
): Promise<Warehouse> =>
  api
    .post<Warehouse>("/warehouse/houses/", payload)
    .then((res) => {
      toastCustom({
        title: "Warehouse Created",
        message: `Warehouse "${res.data.name}" was successfully created.`,
        type: "success",
      });
      return res.data;
    })
    .catch((err) => {
      const data = err?.response?.data;

      let errorMessage = "Failed to create warehouse.";
      if (data && typeof data === "object") {
        const firstField = Object.keys(data)[0];
        const messages = data[firstField];
        if (Array.isArray(messages) && messages.length > 0) {
          errorMessage = messages[0];
        }
      }

      toastCustom({
        title: "Creation Failed",
        message: errorMessage,
        type: "error",
      });

      throw err;
    });
