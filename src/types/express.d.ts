export type TypedRequestBody<T> = Request<{}, {}, T>;
export type TypedRequestParams<P> = Request<P>;
export type TypedRequestQuery<Q> = Request<{}, {}, {}, Q>;
export type TypedRequestFull<P, B, Q> = Request<P, {}, B, Q>;
