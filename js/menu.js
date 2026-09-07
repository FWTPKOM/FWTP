document.addEventListener("DOMContentLoaded", function () {

    const menu = document.getElementById("menu");

    if (!menu) {
        console.error("Nie znaleziono elementu #menu");
        return;
    }

    menu.innerHTML = `
        <a href="/FWTP/">Strona główna</a>
        <a href="/FWTP/linie/">Rozkład jazdy</a>
        <a href="/FWTP/aktualnosci/">Aktualności</a>
    `;

});
