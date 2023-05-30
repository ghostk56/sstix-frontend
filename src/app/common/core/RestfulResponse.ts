/**
 * 成功
 * returnCode = "00000";
 * returnMsg = "成功";
 * 系統預設錯誤代碼
 * RROR_CODE = "99999";
 */
export interface RestfulResponse<T> {
    returnCode: string;
    returnMsg: string;
    data: T;
}