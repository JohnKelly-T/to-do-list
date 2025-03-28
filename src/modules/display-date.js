
export default function () {
    let dateToday = new Date(Date.now());
    let dateTodayString = dateToday.toLocaleDateString("en-US", {
        "month": "long",
        "day": "numeric",
        "year": "numeric"
    });

    let dateDisplay = document.createElement("div");
    dateDisplay.classList.add("date-display");
    dateDisplay.textContent = dateTodayString;

    document.querySelector(".date-container").appendChild(dateDisplay);
}