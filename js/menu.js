document.addEventListener("DOMContentLoaded", function () {

    const menu = document.getElementById("menu");

    if (!menu) return;

    menu.innerHTML = `
        <button
            class="menu-toggle"
            type="button"
            aria-label="Otwórz menu"
            aria-expanded="false"
        >
            <span></span>
            <span></span>
            <span></span>
        </button>

        <div class="menu-links">
            <a href="/FWTP/">Strona główna</a>
            <a href="/FWTP/linie/">Rozkład jazdy</a>
            <a href="/FWTP/przystanki/">Przystanki</a>
            <a href="/FWTP/aktualnosci/">Aktualności</a>
        </div>
    `;


    const przycisk =
        menu.querySelector(".menu-toggle");

    const linki =
        menu.querySelector(".menu-links");


    przycisk.addEventListener("click", function () {

        const otwarte =
            menu.classList.toggle("menu-otwarte");

        przycisk.setAttribute(
            "aria-expanded",
            otwarte ? "true" : "false"
        );

    });


    /*
     * Po kliknięciu pozycji menu
     * zamykamy menu mobilne.
     */
    linki.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            menu.classList.remove("menu-otwarte");

            przycisk.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });


    /*
     * Kliknięcie poza menu również je zamyka.
     */
    document.addEventListener("click", function (event) {

        if (!menu.contains(event.target)) {

            menu.classList.remove("menu-otwarte");

            przycisk.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

});
