import css from "./style.css";

function myComponent() {
  const divElement = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.innerText = "My first webpack setup";
  h2.classList.add("red");
  divElement.appendChild(h2);
  return divElement;
}
document.body.appendChild(myComponent());
