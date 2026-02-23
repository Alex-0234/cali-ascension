
export function calculateBMR(weight, height, age, gender) {
    const currentBMI = Math.ceil(weight / (Math.pow(height, 2)) * 10000);
    let currentBMR = 0;
    if (gender === 'Male') {
        currentBMR = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    }
    else if (gender === 'Female') {
        currentBMR = (10 * weight) + (6.25 * height) - (5 * age) -161;
    }
    else {
        currentBMR = 'idk whaat u are'
    }
    
    return {BMR : currentBMR, BMI : currentBMI}
}