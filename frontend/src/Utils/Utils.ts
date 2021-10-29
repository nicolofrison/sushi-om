import axios, { AxiosError } from "axios";
import AlertService from "../services/alert.service";
import { AlertType } from "./Enums";

export function ToFirstCapitalLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function handleError(error: Error | AxiosError) {
    if (axios.isAxiosError(error))  {
        // Access to config, request, and response
        console.error(error);

        const errorResponse = (error.response as any);
        AlertService.showAlert(errorResponse.data?.translationKey ?? errorResponse.data?.message ?? error.message, AlertType.error);
    } else {
        // Just a stock error
        console.error(error);
        AlertService.showAlert(error.message, AlertType.error);
    }
}