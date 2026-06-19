const form = document.getElementById("uploadForm");
const podcastList = document.getElementById("podcastList");

async function cargarPodcasts() {
    const res = await fetch("/podcasts");
    const podcasts = await res.json();

    podcastList.innerHTML = "";

    podcasts.forEach((podcast) => {

        const div = document.createElement("div");
        div.classList.add("podcast");

        div.innerHTML = `
            <h3>${podcast.name}</h3>

            <audio controls>
                <source src="${podcast.url}" type="audio/mpeg">
            </audio>

            <button
                class="delete-btn"
                onclick="eliminarPodcast('${podcast.name}')"
            >
                Eliminar
            </button>
        `;

        podcastList.appendChild(div);
    });
}

async function eliminarPodcast(nombre) {

    const confirmar = confirm(
        "¿Seguro que deseas eliminar este podcast?"
    );

    if (!confirmar) return;

    await fetch(`/podcasts/${nombre}`, {
        method: "DELETE"
    });

    cargarPodcasts();
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    await fetch("/upload", {
        method: "POST",
        body: formData
    });

    form.reset();

    cargarPodcasts();
});

cargarPodcasts();