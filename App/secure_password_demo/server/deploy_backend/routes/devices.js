"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabaseClient_1 = require("../storage/supabaseClient");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/**
 * GET /api/devices
 * US 3.6 — Lists all registered devices for the authenticated user.
 */
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data: devices, error } = await supabaseClient_1.supabase
            .from('devices')
            .select('id, device_name, device_id, is_trusted, registered_at, last_seen_at')
            .eq('user_id', req.userId);
        if (error)
            throw error;
        res.json({ devices: devices || [] });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch devices' });
    }
});
/**
 * POST /api/devices/register
 * US 3.6 — Registers a new device for the authenticated user.
 */
router.post('/register', auth_1.authMiddleware, async (req, res) => {
    try {
        const { device_id, device_name } = req.body;
        if (!device_id) {
            return res.status(400).json({ error: 'device_id is required' });
        }
        // Check if already registered
        const { data: existing } = await supabaseClient_1.supabase
            .from('devices')
            .select('id')
            .eq('user_id', req.userId)
            .eq('device_id', device_id)
            .maybeSingle();
        if (existing) {
            // Update last_seen_at
            await supabaseClient_1.supabase
                .from('devices')
                .update({ last_seen_at: new Date().toISOString() })
                .eq('id', existing.id);
            return res.json({ message: 'Device already registered', device_id });
        }
        const { data: device, error } = await supabaseClient_1.supabase
            .from('devices')
            .insert([{
                user_id: req.userId,
                device_id,
                device_name: device_name || 'Unknown Device',
                is_trusted: true,
                registered_at: new Date().toISOString(),
                last_seen_at: new Date().toISOString()
            }])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json({ message: 'Device registered', device });
    }
    catch {
        res.status(500).json({ error: 'Failed to register device' });
    }
});
/**
 * POST /api/devices/revoke
 * US 3.9 — Revokes a device, blocking its future access.
 */
router.post('/revoke', auth_1.authMiddleware, async (req, res) => {
    try {
        const { device_id } = req.body;
        if (!device_id) {
            return res.status(400).json({ error: 'device_id is required' });
        }
        // Mark device as untrusted/revoked
        const { data, error } = await supabaseClient_1.supabase
            .from('devices')
            .update({ is_trusted: false, revoked_at: new Date().toISOString() })
            .eq('user_id', req.userId)
            .eq('device_id', device_id)
            .select()
            .maybeSingle();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ error: 'Device not found' });
        }
        console.log(`[SECURITY] Device revoked: ${device_id} for user: ${req.userId}`);
        res.json({ message: 'Device revoked successfully', device_id });
    }
    catch {
        res.status(500).json({ error: 'Failed to revoke device' });
    }
});
exports.default = router;
