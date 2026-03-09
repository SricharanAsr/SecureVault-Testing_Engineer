"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const vault_1 = __importDefault(require("./routes/vault"));
const auth_1 = __importDefault(require("./routes/auth"));
const devices_1 = __importDefault(require("./routes/devices"));
const security_1 = __importDefault(require("./routes/security"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// US 3.10 — Rate Limiting: apply general limiter to all routes
app.use(rateLimiter_1.generalLimiter);
// US 3.5 — Secure Logging: log only method + URL, never body content
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/api/vault', vault_1.default);
app.use('/api/auth', rateLimiter_1.authLimiter, auth_1.default); // stricter limiter on auth
app.use('/api/devices', devices_1.default);
app.use('/api/security', security_1.default);
exports.default = app;
