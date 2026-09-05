"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = generatePassword;
// src/utils/password.ts
const crypto_1 = __importDefault(require("crypto"));
function generatePassword() {
    return crypto_1.default.randomBytes(12).toString('base64url');
}
