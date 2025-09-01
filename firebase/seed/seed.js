"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
(async () => {
    if (admin.apps.length === 0)
        admin.initializeApp();
    const db = admin.firestore();
    await db.doc('wheelConfig/default').set({
        cooldownSec: 30,
        segments: [
            { label: '10 Points', weight: 10, color: '#fca5a5' },
            { label: 'Try Again', weight: 25, color: '#fdba74' },
            { label: '50 Points', weight: 5, color: '#fde047' },
            { label: 'Free Item', weight: 2, color: '#86efac' },
            { label: '20 Points', weight: 8, color: '#93c5fd' },
            { label: 'Coupon', weight: 5, color: '#c4b5fd' },
            { label: '5 Points', weight: 20, color: '#f9a8d4' },
            { label: 'Mystery', weight: 5, color: '#a7f3d0' },
        ]
    }, { merge: True });
    console.log('Seeded wheelConfig/default');
    process.exit(0);
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
