"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const supabaseClient_1 = require("./storage/supabaseClient");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Verify Supabase connection works at startup
const checkSupabase = async () => {
    try {
        const { error } = await supabaseClient_1.supabase.from('users').select('id').limit(1);
        if (error) {
            console.warn('Supabase connected with warning:', error.message);
        }
        else {
            console.log('Connected to Supabase PostgreSQL');
        }
    }
    catch (err) {
        console.error('Supabase connection error:', err);
    }
};
checkSupabase();
app_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
