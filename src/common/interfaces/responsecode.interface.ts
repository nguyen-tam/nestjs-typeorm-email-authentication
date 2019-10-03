export class ResponseCode {    
  public static readonly RESULT_SUCCESS = 1;
  public static readonly RESULT_FAIL = 0;
  public static readonly RESULT_USER_EXISTS = -1;
  public static readonly RESULT_USER_VERIFYCODE_ERROR = -2;
  public static readonly RESULT_USER_VERIFYCODE_TIMEOUT = -3;
  public static readonly RESULT_USER_ISBIND = -4;
  public static readonly RESULT_USER_NOTEXISTS = -5;
  public static readonly RESULT_USER_LOGINED = -6;
  public static readonly RESULT_USER_LOGOUT=-7;
  public static readonly RESULT_TOUSER_NOTEXISTS=-8;
  public static readonly RESULT_USER_NOAUTHORITY=-9;
  public static readonly RESULT_USER_NOTEXISTSDEV=-10;
  public static readonly RESULT_PASSWORD_NOT_MATCH=-11;      
}