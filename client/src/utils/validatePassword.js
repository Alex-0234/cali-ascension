

export default function validatePassword(password) {
    const errors = [];

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long. \n");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter. \n");
    }

    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter. \n");
    }

    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one digit. \n");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must contain at least one special character. \n");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}