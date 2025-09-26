export interface IFlowMiddlewareHandler<TCtx>{
    (ctx: TCtx, next: () => Promise<void>): Promise<void>|void;
}

