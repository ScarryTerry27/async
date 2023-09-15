export function renderProduct(obj, count) {
  let productResult = document.getElementById("productResult");
  let productBox = document.createElement("div");
  let infoBox = document.createElement("div");
  let foto = document.createElement("img");
  let title = document.createElement("h2");
  let desc = document.createElement("p");
  let rating = document.createElement("div");
  let rate = document.createElement("span");
  let price = document.createElement("span");
  let btnAdd = document.createElement("button");
  let count1 = document.createElement("span");

  productBox.classList.add("productBox");
  foto.classList.add("foto");
  title.classList.add("title");
  desc.classList.add("desc");
  rating.classList.add("rating");
  rate.classList.add("rate");
  price.classList.add("price");
  btnAdd.classList.add("btnAdd");
  productBox.id = obj.id;

  foto.src = obj.image;
  desc.textContent = obj.description;
  title.textContent = obj.title;
  rate.textContent = obj.rating?.rate;
  price.textContent = obj.price;
  btnAdd.textContent = "Добавить в корзину";

  rating.append(rate, price);
  infoBox.append(foto, title, desc);
  productBox.append(infoBox, rating, btnAdd);
  if (count) {
    count1.classList.add("count");
    count1.textContent = count;
    productBox.append(count1);
  }
  if (productResult) {
    productResult.append(productBox);
  } else {
    let app = document.getElementById("app");
    btnAdd.remove();
    app.append(productBox);
  }
}

export async function getProduct(src) {
  if (src != "") {
    try {
      let result = await fetch(src);
      let data = await result.json();
      data.map((item) => renderProduct(item));
      setBug();
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      let result = await fetch("https://fakestoreapi.com/products");
      let data = await result.json();
      data.map((item) => renderProduct(item));
      setBug();
    } catch (e) {
      console.log(e);
    }
  }
}
let store = [];

export function setBug() {
  let btnsAdd = document.querySelectorAll(".btnAdd");
  btnsAdd.forEach((elem) =>
    elem.addEventListener("click", async function () {
      let flag = false;
      let cardID = elem.parentNode.id;
      let response = await fetch(`https://fakestoreapi.com/products/${cardID}`);
      let result = await response.json();
      // if (!store[cardID]) {
      //   store[cardID] = [1, result];
      // } else {
      //   store[cardID][0] += 1;
      // }
      for (const item of store) {
        if (item.id == cardID) {
          item.count += 1;
          flag = true;
        }
      }
      if (!flag) {
        result.count = 1;
        store.push(result);
      }
      localStorage.setItem("bug", JSON.stringify(store));
      BugLength();
    })
  );
}

export function AllProduct(cnd) {
  try {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        json.map((item) => {
          if (typeof cnd === "string") {
            if (item.title.toUpperCase().indexOf(cnd.toUpperCase()) >= 0) {
              renderProduct(item);
            }
          }
          if (typeof cnd === "number") {
            if (parseFloat(item.rating.rate) >= cnd) {
              renderProduct(item);
            }
          }
        });
      });
  } catch (e) {
    console.log(e);
  }
}

export function BugLength() {
  let bugCount = document.querySelector(".bugCount");
  let bugFromStor = localStorage.getItem("bug");
  let transBug = JSON.parse(bugFromStor);
  bugCount.textContent = transBug.length;
}
