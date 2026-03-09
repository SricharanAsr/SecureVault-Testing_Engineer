"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Import the compiled Risk Engine Addon
const riskEngine = require('../../build/Release/risk_engine');
const router = express_1.default.Router();
/**
 * GET /api/security/audit/verify
 * Admin endpoint to verify the tamper-evident hash chain of the Risk Engine's log.
 */
router.get('/audit/verify', (req, res) => {
    try {
        const isValid = riskEngine.verifyAuditLog();
        if (isValid) {
            res.json({ success: true, message: 'Audit log chain verified successfully.' });
        }
        else {
            // Note: Returning 500 or 400 depending on security policy. 500 for internal error/tampering.
            res.status(500).json({ success: false, error: 'Audit log chain verification failed. Tampering detected or log missing.' });
        }
    }
    catch (error) {
        console.error('Audit verification error:', error);
        res.status(500).json({ success: false, error: 'Server error during audit verification.' });
    }
});
exports.default = router;
