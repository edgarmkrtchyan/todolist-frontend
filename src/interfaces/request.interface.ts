export interface Request {
    data: RequestResult;
}

export interface RequestResult {
    message?: string;
    status: string;
    access_token?: string;
}