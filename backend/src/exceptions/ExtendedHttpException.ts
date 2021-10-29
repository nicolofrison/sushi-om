import HttpException from "./HttpException";


export default class ExtendedHttpException extends HttpException {
    public translationKey: string;

    constructor(status: number, message: string, translationKey: string) {
          super(status, message);
          this.translationKey = translationKey;
    }
}