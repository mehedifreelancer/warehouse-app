import type { AxiosResponse } from "axios";
import { toastCustom } from "../../components/ui/CustomToast";
import api from "../../config/api/api-config";
import type { CreateDeliveryChargePayload, DeliveryCharge, DeliveryChargesResponse, UpdateDeliveryChargePayload } from "../../types/order/deliveryCharges.types";

export const getDeliveryCharges = (): Promise<DeliveryCharge[]> =>
  api
    .get<DeliveryChargesResponse>("/order/delivery-charges/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch delivery charges:", err);
      throw err;
    });

export const createDeliveryCharge = (payload: CreateDeliveryChargePayload): Promise<AxiosResponse<DeliveryCharge>> => {
  return api
    .post<DeliveryCharge>("/order/delivery-charges/", payload)
    .then((res) => {
      toastCustom({
        title: "Delivery Charge Created",
        message: `Delivery charge for "${res.data.location}" was successfully created.`,
        type: "success",
      });
      return res;
    })
    .catch((err) => {
       const errorMessage =
       err?.response?.data?.location?.[0] || "Failed to update delivery charge.";
      toastCustom({
        title: "Creation Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });
};

export const updateDeliveryCharge = async (
  id: number,
  payload: UpdateDeliveryChargePayload
): Promise<AxiosResponse<DeliveryCharge>> => {
  try {
    const res = await api.put<DeliveryCharge>(`/order/delivery-charges/${id}/`, payload);

    toastCustom({
      title: "Delivery Charge Updated",
      message: `Delivery charge for "${res.data.location}" was successfully updated.`,
      type: "success",
    }); 

    return res;
  } catch (err: any) {
    console.error("Failed to update delivery charge:", err);
                       
    const errorMessage =
       err?.response?.data?.location?.[0] || "Failed to update delivery charge.";

    toastCustom({ 
      title: "Update Failed",
      message: errorMessage,
      type: "error",
    });

    throw err;
  }
};

export const deleteDeliveryCharge = (id: number): Promise<AxiosResponse<void>> =>
  api
    .delete(`/order/delivery-charges/${id}/`)
    .then((res) => {
      toastCustom({
        title: "Delivery Charge Deleted",
        message: "Delivery charge was successfully deleted.",
        type: "success",
      });
      return res;
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete delivery charge.";
      toastCustom({
        title: "Deletion Failed",
        message: errorMessage,
        type: "error",
      });
      throw err;
    });