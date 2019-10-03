// success: true => message, data
// success: false => errorMessage, error


export class ResponseError {
  constructor (codeMessage:number, errorMessage?: string, data?: any) {
    this.success = false;
    this.error = {code:codeMessage, message:errorMessage};  
    this.data = data;  
  };
  error: object;  
  success: boolean;
  data: any[];
}

export class ResponseSuccess {
  constructor (codeMessage:number, data?: any, notLog?: boolean) {
    this.success = true;
    this.code = codeMessage;
    this.data = data;
  };
  code: number;
  data: any[];
  errorMessage: any;
  error: any;
  success: boolean;
}