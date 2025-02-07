const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

// https://restcountries.com/v2/name/portugal

// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}


const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  // countriesContainer.style.opacity = 1;
};
const renderCountry = function (data, className = "") {
  const html = `<article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 100000
            ).toFixed(1)}</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>`;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  //   countriesContainer.style.opacity = 1;
};

// const getCountryAndNeighbour = function (country) {
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.com/v2/name/${country}`);
//   request.send();

//   request.addEventListener("load", function () {
//     console.log(this.responseText);

//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     renderCountry(data);

// // get neighbour country
//     const neighbour = data.borders?.[0];
//     if (!neighbour) return;

//     const request2 = new XMLHttpRequest();
//     request2.open("GET", `https://restcountries.com/v2/alpha/${neighbour}`);
//     request2.send();

//     request2.addEventListener("load", function () {
//       console.log(this.responseText);
//       const data2 = JSON.parse(this.responseText);
//       console.log(data2);
//       renderCountry(data2, "neighbour");
//     });

//   });
// };

// getCountryAndNeighbour("portugal");

// const request = fetch("https://restcountries.com/v2/name/portugal")
//   .then(function (response) {
//     console.log(response);
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   })

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    console.log(response);

    if (!response.ok)
      throw new Error(`${errorMsg} 
              (${response.status})`);

    return response.json();
  });
};

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v2/name/${country}`, "Country not found")
    .then((data) => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      if (!neighbour) throw new Error("No neighbour found!");

      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        "Country not found "
      );
    })
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err) => {
      console.log(err);
      renderError(`Something went wrong ${err.message}. Try again!`);
    })

    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener("click", function () {
  getCountryData("brazil");
});



// const getPoistion = function () {
//     return new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject);
//     })
// }
// const whereAmI = async function (country) {
//     const pos = await getPoistion()
//     const {latitude: lat, longitude: lng} = pos.coords
//   const resGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`)
//     const dataGeo = await resGeo.json()
//     console.log(dataGeo);
    
//   const res = await fetch(`https://restcountries.com/v2/name/${country}`);
//   const data = await res.json();
//   renderCountry(data[0]);
// };

// whereAmI("");
// console.log('first');
