import { z } from "zod";

const passwordValidation = z
  .string()
  .regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[$*&@#! ])[^{}]{6,}$/, "INVALID_PASSWORD");

const passwordLengthValidation = z.string().min(6, "PASSWORD_TOO_SHORT");

const passwordSpecialCharValidation = z
  .string()
  .regex(/[$*&@#! ]/, "PASSWORD_NEEDS_SPECIAL_CHAR");

const passwordNumberValidation = z
  .string()
  .regex(/\d/, "PASSWORD_NEEDS_NUMBER");

const passwordUppercaseValidation = z
  .string()
  .regex(/[A-Z]/, "PASSWORD_NEEDS_UPPERCASE");

const usernameValidation = z.string().regex(/^[^{}]{3,255}$/, "INVALID_NAME");

const emailValidation = z.string().email("INVALID_EMAIL");

const postTitleValidation = z.string().regex(/^[^{}]{3,70}$/, "INVALID_TITLE");

const postContentValidation = z
  .string()
  .regex(/^[^{}]{3,700}$/, "INVALID_CONTENT");

export const isValidEmail = (value?: string) =>
  value && value.length !== 0
    ? emailValidation.safeParse(value).success
      ? "valid"
      : "invalid"
    : null;

export const isValidUsername = (value?: string) =>
  value && value.length !== 0
    ? usernameValidation.safeParse(value).success
      ? "valid"
      : "invalid"
    : null;

export const isValidPassword = (value?: string) =>
  value && value.length !== 0
    ? passwordValidation.safeParse(value).success
      ? "valid"
      : "invalid"
    : null;

export const isValidPasswordLength = (value?: string) =>
  value && value.length !== 0
    ? passwordLengthValidation.safeParse(value).success
      ? "valid"
      : "invalid"
    : null;

export const isValidPasswordSpecialChar = (value?: string) =>
  value && value.length !== 0
    ? passwordSpecialCharValidation.safeParse(value).success
      ? "valid"
      : "invalid"
    : null;

export const isValidPasswordNumber = (value?: string) =>
  value && value.length !== 0
    ? passwordNumberValidation.safeParse(value).success
      ? "valid"
      : "invalid"
    : null;

export const isValidPasswordUppercase = (value?: string) =>
  value && value.length !== 0
    ? passwordUppercaseValidation.safeParse(value).success
      ? "valid"
      : "invalid"
    : null;

export const isValidPostTitle = (value?: string) =>
  value && value.length !== 0
    ? postTitleValidation.safeParse(value).success
      ? "valid"
      : "invalid"
    : null;

export const isValidPostContent = (value?: string) =>
  value && value.length !== 0
    ? postContentValidation.safeParse(value).success
      ? "valid"
      : "invalid"
    : null;
