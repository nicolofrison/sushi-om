import axios, { AxiosError } from "axios";
import AlertService from "../services/alert.service";
import { AlertType } from "./Enums";
import translations from "./TranslationKeys";
import UserUtils from "./UserUtils";

export function ToFirstCapitalLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function handleError(error: Error | AxiosError) {
    if (axios.isAxiosError(error))  {
        // Access to config, request, and response
        console.error(error);

        const errorResponse = (error.response as any);
        const errorMessage = errorResponse?.data?.translationKey ?? errorResponse?.data?.message ?? error.message;
        AlertService.showAlert(errorMessage, AlertType.error);

        if (UserUtils.IsLoggedIn() 
            && (errorMessage === translations.authenticationError 
            || errorMessage === translations.expiredAuthenticationToken 
            || errorMessage === translations.missingOrWrongAuthenticationToken)) {
            setTimeout(() => {
                UserUtils.removeUser();
                window.location.reload();
            }, 3000);
        }
    } else {
        // Just a stock error
        console.error(error);
        AlertService.showAlert(error.message, AlertType.error);
    }
}

export function isNullOrUndefined(obj: any) {
    return obj === null || obj === undefined;
}