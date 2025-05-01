import * as yup from "yup";

// Phone number regex for common international formats
const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

// Email regex for validating email addresses
const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Contact validation schema
export const contactSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(phoneRegExp, "Phone number is not valid"),
  email: yup
    .string()
    .email("Email is not valid")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  imageUri: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

// Function to validate a phone number
export const isValidPhoneNumber = (phone: string): boolean => {
  return phoneRegExp.test(phone);
};

// Function to validate an email
export const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  return emailRegExp.test(email);
};
