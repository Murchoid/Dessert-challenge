import data from "../public/data.json";
import { styleCards, styleCart } from "./style-content";

async function fetchData(): unknown{
  const res = await fetch("../public/data");
  const data = await res.json();
  if(data)
    console.log(data);
}

fetchData();

function loadData(){

}
