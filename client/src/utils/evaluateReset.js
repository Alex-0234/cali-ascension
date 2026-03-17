


export default function evaluateReset(evaluatedArray, date = Date.now()) {
    let newDate = new Date(date);
    let newDateCA = newDate;
    console.log('....uh',newDateCA);

    let tempDate = '';
    let tempId = '';
    let result = {
        lastDateId: null,
        newDate: null,
        reset: false,
        wholeDay: false, // 24h
    };

    evaluatedArray.forEach(obj => {
        const objDate = new Date(obj.date).toISOString().split('T')[0];

        if (newDate.valueOf() > objDate.valueOf()) {
            tempId = obj.id;
            tempDate = objDate;
            console.log(tempId)
        }
    });

    const finalDate = new Date(tempDate)
    const objYear = finalDate.getFullYear();
    const objMonth = finalDate.getMonth();
    const objDay = finalDate.getDate();  // Day of the month
    const objValue = finalDate.valueOf();

    console.log('old date:', objYear, objMonth, objDay, objValue);

    console.log(newDateCA.getDate())
    const year = newDateCA.getFullYear() > objYear;
    const month = newDateCA.getMonth() > objMonth;
    const day = newDateCA.getDate() > objDay;
    const elapsedTime = newDateCA.valueOf() - objValue;

    console.log('new date:', year, month, day, elapsedTime);

    if (year || month || day) {
        if (elapsedTime >= (24*60*60*1000)) {
            result = {
                lastDateId: tempId,
                newDate: newDateCA,
                reset: true,
                wholeDay: true
            }
        }
        else {
            result = {
                lastDateId: tempId,
                newDate: newDateCA,
                reset: true,
                wholeDay: false
        }};
    }
    else {
        result = {
            lastDateId: tempId,
            newDate: newDateCA,
            reset: false,
            wholeDay: false
    }};

    return result;
}