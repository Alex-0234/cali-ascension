
export default function getAvarage(weightHistory) {
    if (!weightHistory) return;

    let tempWeight = 0;
    let num = 0;
    weightHistory.forEach(entry => {
        tempWeight += entry.weight;
        num++;
    });
    const avarage = tempWeight / num;

    return avarage;
}