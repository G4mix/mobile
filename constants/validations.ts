import { z } from "zod";

const passwordValidation = z.string().regex(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#! ])[^{}]{6,72}$/,
  'INVALID_PASSWORD'
);

const usernameValidation = z.string().regex(/^[^{}]{3,255}$/, 'INVALID_NAME');

const emailValidation = z.string().email('INVALID_EMAIL');

export const isValidEmail = (value: string) =>
  value.length !== 0 ?
    (emailValidation.safeParse(value).success ? 'valid' : 'invalid')
    : null

export const isValidUsername = (value: string) => 
  value.length !== 0 ?
    (usernameValidation.safeParse(value).success ? 'valid' : 'invalid')
    : null

export const isValidPassword = (value: string) =>
  value.length !== 0 ?
    (passwordValidation.safeParse(value).success ? 'valid' : 'invalid')
    : null
