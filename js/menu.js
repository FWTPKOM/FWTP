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
            <!-- ===============================
                 BRYGADY - MENU ROZWIJANE
                 =============================== -->

            <div class="menu-dropdown">
              <div class="menu-dropdown">
    <button class="menu-dropdown-przycisk" type="button" aria-expanded="false">
        Brygady
    </button>
    <div class="menu-dropdown-lista">
        <a href="/FWTP/brygady/">Rozkład brygad</a>
      
    </div>
</div>
</div>


            <a href="/FWTP/aktualnosci/">Aktualności</a>

        </div>
    `;


    const przycisk =
        menu.querySelector(".menu-toggle");


    const linki =
        menu.querySelector(".menu-links");


    const dropdown =
        menu.querySelector(".menu-dropdown");


    const dropdownPrzycisk =
        menu.querySelector(".menu-dropdown-przycisk");


    /* =====================================================
       MENU MOBILNE
       ===================================================== */

    przycisk.addEventListener("click", function () {

        const otwarte =
            menu.classList.toggle(
                "menu-otwarte"
            );


        przycisk.setAttribute(
            "aria-expanded",
            otwarte
                ? "true"
                : "false"
        );

    });


    /* =====================================================
       BRYGADY - KLIKNIĘCIE
       
       Na komputerze głównie działa hover.
       Na telefonie kliknięcie otwiera podmenu.
       ===================================================== */

    dropdownPrzycisk.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            const otwarte =
                dropdown.classList.toggle(
                    "dropdown-otwarte"
                );


            dropdownPrzycisk.setAttribute(
                "aria-expanded",
                otwarte
                    ? "true"
                    : "false"
            );

        }
    );


    /* =====================================================
       KLIKNIĘCIE LINKU
       ===================================================== */

    linki
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    menu.classList.remove(
                        "menu-otwarte"
                    );


                    dropdown.classList.remove(
                        "dropdown-otwarte"
                    );


                    przycisk.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    dropdownPrzycisk.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });


    /* =====================================================
       KLIKNIĘCIE POZA MENU
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !menu.contains(
                    event.target
                )
            ) {

                menu.classList.remove(
                    "menu-otwarte"
                );


                dropdown.classList.remove(
                    "dropdown-otwarte"
                );


                przycisk.setAttribute(
                    "aria-expanded",
                    "false"
                );


                dropdownPrzycisk.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

});
