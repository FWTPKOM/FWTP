/* =========================================================
   FWTP - LISTA LINII
   ========================================================= */


/* =========================================================
   FORMAT DATY YYYY-MM-DD
   ========================================================= */

function formatujDateISO(data) {

    if (!(data instanceof Date)) {
        return "";
    }

    return (
        data.getFullYear() +
        "-" +
        String(
            data.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +
        "-" +
        String(
            data.getDate()
        ).padStart(
            2,
            "0"
        )
    );
}


/* =========================================================
   SPRAWDZENIE DATY YYYY-MM-DD
   ========================================================= */

function czyPoprawnaDataISO(tekst) {

    return /^\d{4}-\d{2}-\d{2}$/.test(
        String(
            tekst || ""
        ).trim()
    );
}


/* =========================================================
   POBIERANIE AKTUALNIE WYBRANEJ DATY
   ========================================================= */

function pobierzWybranaDate() {

    /* -----------------------------------------------------
       1. Najpierw data z URL
       ----------------------------------------------------- */

    const parametry =
        new URLSearchParams(
            window.location.search
        );


    const dataURL =
        parametry.get(
            "data"
        );


    if (
        dataURL &&
        czyPoprawnaDataISO(
            dataURL
        )
    ) {

        return dataURL;
    }


    /* -----------------------------------------------------
       2. Data z pola kalendarza
       ----------------------------------------------------- */

    const input =
        document.getElementById(
            "wybranaData"
        );


    if (
        input &&
        input.value &&
        czyPoprawnaDataISO(
            input.value
        )
    ) {

        return input.value;
    }


    /* -----------------------------------------------------
       3. Zmienna kalendarza strony
       ----------------------------------------------------- */

    try {

        if (
            typeof wybranaDataLinii !==
            "undefined"
        ) {

            if (
                wybranaDataLinii instanceof
                Date
            ) {

                return formatujDateISO(
                    wybranaDataLinii
                );
            }


            if (
                typeof wybranaDataLinii ===
                "string" &&
                czyPoprawnaDataISO(
                    wybranaDataLinii
                )
            ) {

                return wybranaDataLinii;
            }
        }

    } catch (e) {

        /* brak zmiennej - ignorujemy */

    }


    /* -----------------------------------------------------
       4. Awaryjnie dzisiejsza data
       ----------------------------------------------------- */

    return formatujDateISO(
        new Date()
    );
}


/* =========================================================
   BUDOWANIE LINKU DO LINII
   ========================================================= */

function zbudujLinkLinii(
    numer
) {

    const data =
        pobierzWybranaDate();


    let adres =
        "../linia/?linia=" +
        encodeURIComponent(
            numer
        );


    if (
        data &&
        czyPoprawnaDataISO(
            data
        )
    ) {

        adres +=
            "&data=" +
            encodeURIComponent(
                data
            );
    }


    return adres;
}


/* =========================================================
   GENEROWANIE LINII
   ========================================================= */

function generujLinie(lista) {

    const autobusy =
        document.getElementById(
            "autobusy"
        );


    const tramwaje =
        document.getElementById(
            "tramwaje"
        );


    const metro =
        document.getElementById(
            "metro"
        );


    if (autobusy) {
        autobusy.innerHTML = "";
    }


    if (tramwaje) {
        tramwaje.innerHTML = "";
    }


    if (metro) {
        metro.innerHTML = "";
    }


    lista.forEach(
        linia => {

            const link =
                document.createElement(
                    "a"
                );


            link.className =
                "linia";


            link.textContent =
                linia.numer;


            link.href =
                zbudujLinkLinii(
                    linia.numer
                );


            /* =============================================
               AUTOBUS
               ============================================= */

            if (
                linia.typ ===
                "autobus"
            ) {

                if (autobusy) {

                    autobusy.appendChild(
                        link
                    );
                }
            }


            /* =============================================
               TRAMWAJ
               ============================================= */

            if (
                linia.typ ===
                "tramwaj"
            ) {

                if (tramwaje) {

                    tramwaje.appendChild(
                        link
                    );
                }
            }


            /* =============================================
               METRO
               ============================================= */

            if (
                linia.typ ===
                "metro"
            ) {

                if (metro) {

                    metro.appendChild(
                        link
                    );
                }
            }
        }
    );
}


/* =========================================================
   AKTUALIZOWANIE DATY WE WSZYSTKICH LINKACH
   ========================================================= */

function aktualizujDatyWLinkach() {

    const data =
        pobierzWybranaDate();


    const linki =
        document.querySelectorAll(
            "a.linia"
        );


    linki.forEach(
        link => {

            const tekstNumeru =
                String(
                    link.textContent ||
                    ""
                ).trim();


            if (!tekstNumeru) {
                return;
            }


            link.href =
                "../linia/?linia=" +
                encodeURIComponent(
                    tekstNumeru
                ) +
                "&data=" +
                encodeURIComponent(
                    data
                );
        }
    );
}


/* =========================================================
   URUCHOMIENIE
   ========================================================= */

if (
    typeof linie !==
    "undefined" &&
    Array.isArray(
        linie
    )
) {

    generujLinie(
        linie
    );
}


/* =========================================================
   WYSZUKIWARKA
   ========================================================= */

const search =
    document.getElementById(
        "search"
    );


if (search) {

    search.addEventListener(
        "input",
        function () {

            const tekst =
                this.value
                    .toLowerCase()
                    .trim();


            const wynik =
                linie.filter(
                    linia =>

                        String(
                            linia.numer ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                tekst
                            )
                );


            generujLinie(
                wynik
            );
        }
    );
}


/* =========================================================
   ZMIANA DATY W POLU <input type="date">
   ========================================================= */

const inputDaty =
    document.getElementById(
        "wybranaData"
    );


if (inputDaty) {

    inputDaty.addEventListener(
        "change",
        function () {

            const data =
                this.value;


            if (
                data &&
                czyPoprawnaDataISO(
                    data
                )
            ) {

                const url =
                    new URL(
                        window.location.href
                    );


                url.searchParams.set(
                    "data",
                    data
                );


                window.history.replaceState(
                    null,
                    "",
                    url.toString()
                );
            }


            aktualizujDatyWLinkach();
        }
    );
}


/* =========================================================
   OBSŁUGA KLIKANIA DNI KALENDARZA
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const przycisk =
            event.target.closest(
                ".dzien-btn"
            );


        if (!przycisk) {
            return;
        }


        /*
         * Kalendarz może najpierw zmienić zmienną
         * wybranaDataLinii lub URL.
         *
         * Dlatego aktualizujemy linki dopiero po wykonaniu
         * funkcji obsługującej kliknięcie.
         */

        setTimeout(
            function () {

                aktualizujDatyWLinkach();

            },
            0
        );
    }
);


/* =========================================================
   ZABEZPIECZENIE - LINK ZAWSZE DOSTAJE AKTUALNĄ DATĘ
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const link =
            event.target.closest(
                "a.linia"
            );


        if (!link) {
            return;
        }


        const numer =
            String(
                link.textContent ||
                ""
            ).trim();


        if (!numer) {
            return;
        }


        const data =
            pobierzWybranaDate();


        link.href =
            "../linia/?linia=" +
            encodeURIComponent(
                numer
            ) +
            "&data=" +
            encodeURIComponent(
                data
            );
    },
    true
);


/* =========================================================
   PIERWSZA AKTUALIZACJA
   ========================================================= */

aktualizujDatyWLinkach();
