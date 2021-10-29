class ExtendedError extends Error {
    translationKey: string;
  
    constructor(message: string, translationKey: string) {
      super(message);
      this.translationKey = translationKey;
    }
  }
  
  export default ExtendedError;
  