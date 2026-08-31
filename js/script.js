
// ==========================================
// WCZYTANIE BAZY LINII
// ==========================================

const script = document.createElement("script");

script.src = "../dane/linie.js";


script.onload = function () {

    generujLinie(linie);

    uruchomWyszukiwarke();

};


// ==========================================
// GENEROWANIE LINII
// ==========================================

function generujLinie(lista) {

    const autobusy =
        document.getElementById("autobusy");

    const tramwaje =
        document.getElementById("tramwaje");

    const metro =
        document.getElementById("metro");


    if (!autobusy || !tramwaje || !metro) {
        return;
    }


    autobusy.innerHTML = "";

    tramwaje.innerHTML = "";

    metro.innerHTML = "";


    lista.forEach(linia => {

        const link =
            document.createElement("a");


        link.className = "linia";

        link.textContent =
            linia.numer;


        link.href =
            "../linia/?linia="
            + encodeURIComponent(linia.numer);


        switch (linia.typ) {

            case "autobus":

                autobusy.appendChild(link);

                break;


            case "tramwaj":

                tramwaje.appendChild(link);

                break;


            case "metro":

                metro.appendChild(link);

                break;

        }

    });

}



// ==========================================
// WYSZUKIWARKA
// ==========================================

function uruchomWyszukiwarke() {

    const search =
        document.getElementById("search");


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        function () {

            const tekst =
                this.value
                .toLowerCase()
                .trim();


            const wynik =
                linie.filter(linia =>

                    linia.numer
                        .toLowerCase()
                        .includes(tekst)

                );


            generujLinie(wynik);

        }
    );

}


document.head.appendChild(script);

