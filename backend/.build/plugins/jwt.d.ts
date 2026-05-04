import type { FastifyPluginAsync } from 'fastify';
export interface JwtPayload {
    sub: string;
    role: 'player' | 'referee' | 'admin';
}
declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: JwtPayload;
        user: JwtPayload;
    }
}
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        requireRole: (...roles: Array<'player' | 'referee' | 'admin'>) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
declare const _default: FastifyPluginAsync;
export default _default;
//# sourceMappingURL=jwt.d.ts.map