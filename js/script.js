function generujLinie(lista) {

    const autobusy = document.getElementById("autobusy");
    const tramwaje = document.getElementById("tramwaje");
    const metro = document.getElementById("metro");

    autobusy.innerHTML = "";
    tramwaje.innerHTML = "";
    metro.innerHTML = "";

    lista.forEach(linia => {

        const link = document.createElement("a");

        link.className = "linia";
        link.textContent = linia.numer;

        link.href =
            "../linia/?linia=" +
            encodeURIComponent(linia.numer);

        if (linia.typ === "autobus") {
            autobusy.appendChild(link);
        }

        if (linia.typ === "tramwaj") {
            tramwaje.appendChild(link);
        }

        if (linia.typ === "metro") {
            metro.appendChild(link);
        }

    });
}


// Uruchomienie po załadowaniu strony
generujLinie(linie);


// Wyszukiwarka
const search = document.getElementById("search");

if (search) {

    search.addEventListener("input", function () {

        const tekst = this.value
            .toLowerCase()
            .trim();

        const wynik = linie.filter(linia =>
            linia.numer
                .toLowerCase()
                .includes(tekst)
        );

        generujLinie(wynik);

    });

}
