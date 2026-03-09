"use strict";
/**
 * Pure JavaScript fallback for the native Risk Engine.
 * This ensures the application can run on platforms where native compilation is restricted (e.g., Azure App Service for Students).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskEngine = void 0;
exports.getRiskEngine = getRiskEngine;
exports.riskEngine = {
    /**
     * Mirror of the C-based evaluate_risk function logic.
     */
    evaluate(signals) {
        let decision = 0; // 0: ALLOW, 1: STEP_UP, 2: DENY
        // 1. Integrity Rule (Secure Boot)
        const secureBoot = signals.secure_boot;
        if (secureBoot === undefined || secureBoot === false) {
            decision = Math.max(decision, 2); // DENY if not secure
        }
        else {
            decision = Math.max(decision, 0); // ALLOW
        }
        // 2. Device Rule (Device Trusted)
        const deviceTrusted = signals.device_trusted;
        if (deviceTrusted === undefined || deviceTrusted === false) {
            decision = Math.max(decision, 1); // STEP_UP if not trusted
        }
        else {
            decision = Math.max(decision, 0); // ALLOW
        }
        // 3. Failure Rule (Login Failures)
        const failureCount = signals.failed_login_count;
        if (failureCount === undefined) {
            decision = Math.max(decision, 2); // DENY if signal missing
        }
        else if (failureCount >= 5) {
            decision = Math.max(decision, 2); // DENY
        }
        else if (failureCount > 0) {
            decision = Math.max(decision, 1); // STEP_UP
        }
        else {
            decision = Math.max(decision, 0); // ALLOW
        }
        // Map numeric decision back to string
        switch (decision) {
            case 0: return 'ALLOW';
            case 1: return 'STEP_UP';
            case 2: return 'DENY';
            default: return 'UNKNOWN';
        }
    },
    /**
     * Placeholder for audit log verification.
     * In a production environment, this would verify a hash chain or digital signature.
     */
    verifyAuditLog() {
        console.warn('[RiskEngine] Audit log verification skipped in JS fallback mode.');
        return true;
    }
};
/**
 * Helper to safely load the risk engine, falling back to JS if native is missing.
 */
function getRiskEngine() {
    try {
        // Attempt to load the native addon
        const native = require('../../build/Release/risk_engine');
        console.log('[RiskEngine] Successfully loaded native C++ addon.');
        return native;
    }
    catch (e) {
        console.warn('[RiskEngine] Native addon not found. Falling back to pure JavaScript implementation.');
        return exports.riskEngine;
    }
}
