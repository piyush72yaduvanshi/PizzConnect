import {body} from 'express-validator';

export const registerValidation = () => {
    return [
        body("email")
        .trim()
        .isEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address."),
        body("password")
        .trim()
        .isEmpty()
        .withMessage("Password is required.")
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long."),
        body("name")
        .trim()
        .isEmpty()
        .withMessage("Name is required"),
        body("mobileNumber")
        .trim()
        .isEmpty()
        .withMessage("Mobile number is required")
        .isMobilePhone()
        .withMessage("Please enter a valid mobile number."),
    ]
}

export const loginValidation = ()=>{
    return [
        body("email")
        .trim()
        .isEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address."),
        body("password")
        .trim()
        .isEmpty()
        .withMessage("Password is required.")
    ]
}

export const productValidation = ()=>{
    return [
        body("productName")
        .trim()
        .isEmpty()
        .withMessage("Product name is required.")
        .isLength({max: 100})
        .withMessage("Product name must be less than 100 characters."),
        body("price")
        .isEmpty()
        .withMessage("Price is required."),
        body("description")
        .trim()
        .isEmpty()
        .withMessage("Description is required.")
        .isLength({max: 500})
        .withMessage("Description must be less than 500 characters."),
        body("category")
        .trim()
        .isEmpty()
        .withMessage("Category is required.")
    ]
}