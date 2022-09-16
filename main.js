import "./style.css";
import Swal from "sweetalert2";

const alert = document.querySelector(".hidden-alert");
const img1 = document.querySelector("#img-1");
const img2 = document.querySelector("#img-2");
const img3 = document.querySelector("#img-3");
const img4 = document.querySelector("#img-4");
const button = document.querySelector("#fetch");
const containFavo = document.querySelector("#container-favorities");
const API = import.meta.env.VITE_URL_API;
const URL_API_FAVORITES = import.meta.env.VITE_URL_API_FAVORITES;
const flecha = document.querySelector(".icon-flecha");

button.addEventListener("click", reload);
img1.addEventListener("click", () => saveFavorites(img1.name));
img2.addEventListener("click", () => saveFavorites(img2.name));
img3.addEventListener("click", () => saveFavorites(img3.name));
img4.addEventListener("click", () => saveFavorites(img4.name));
flecha.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

async function onLoad() {
  const res = await fetch(API);
  const data = await res.json();
  img1.src = data[0].url;
  img1.name = data[0].id;
  img2.src = data[1].url;
  img2.name = data[1].id;
  img3.src = data[2].url;
  img3.name = data[2].id;
  img4.src = data[3].url;
  img4.name = data[3].id;
}

function activeAlert() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Agregada a favoritos",
    showConfirmButton: false,
    timer: 1500,
  });
}

function reload() {
  onLoad();
  setTimeout(() => {
    alert.className = "alerta";
  }, 1000);
  setTimeout(() => {
    alert.className = "hidden-alert";
  }, 4000);
}

async function saveFavorites(image_id) {
  try {
    const res = await fetch(URL_API_FAVORITES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key":
          "live_HGhKPSbzMjPyw02nOVdv0i0By1g3k9hBwy69VZFAigBdrBVEILeAiFbbc2Js4JBD",
      },
      body: JSON.stringify({
        image_id: image_id,
      }),
    });
    const data = await res.json();
    if (data.message === "SUCCESS") {
      activeAlert();
      onLoadFavorities();
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadFavorities() {
  try {
    const res = await fetch(URL_API_FAVORITES, {
      method: "GET",
      headers: {
        "x-api-key":
          "live_HGhKPSbzMjPyw02nOVdv0i0By1g3k9hBwy69VZFAigBdrBVEILeAiFbbc2Js4JBD",
      },
    });
    const data = await res.json();

    containFavo.innerHTML = "";

    data.forEach((item) => {
      const div = document.createElement("div");
      const btn = document.createElement("button");
      const img = document.createElement("img");

      img.src = item.image.url;
      img.name = item.id;
      img.className = "images";
      img.alt = "dogs";
      btn.innerHTML = "Delete";
      btn.id = "delete";
      btn.onclick = () => confirmDeletion(item.id);
      div.append(img, btn);
      containFavo.appendChild(div);
    });
  } catch (error) {
    console.log(error);
  }
}

function confirmDeletion(id) {
  Swal.fire({
    title: "Desea eliminar de favoritos?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#DC2626",
    confirmButtonText: "Yes!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "Se ha eliminado de favoritos.", "success");
      deleteFavorities(id);
    }
  });
}

async function deleteFavorities(image_id) {
  try {
    const res = await fetch(`${URL_API_FAVORITES}/${image_id}`, {
      method: "DELETE",
      headers: {
        "x-api-key":
          "live_HGhKPSbzMjPyw02nOVdv0i0By1g3k9hBwy69VZFAigBdrBVEILeAiFbbc2Js4JBD",
      },
      body: {
        favourite_id: image_id,
      },
    });
    const data = await res.json();
    if (data.message === "SUCCESS") {
      onLoadFavorities();
      deleteAlert();
    }
  } catch (error) {
    console.log(error);
  }
}

onLoad();
onLoadFavorities();
