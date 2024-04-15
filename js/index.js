const api = "data/countries.json";

async function getData() {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Faild to fetch data", response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

const openCountry = async (countryName) => {
  try {
    const data = await getData();
    if (!data) {
      console.error("No data available.");
      return;
    }

    const country = data.find((country) => country.country === countryName);

    if (!country) {
      console.error("Country not found.");
      return;
    }

    localStorage.setItem("country", JSON.stringify(country));

    const url = `country.html?country=${country.country}`;

    window.open(url, "_self");
  } catch (error) {
    console.error("Error opening country:", error);
  }
};

if (window.location.href.includes("country")) {
  const heroSection = document.querySelector(".hero-section");
  const heroSectionText = heroSection.querySelector(".text");
  const bestHotels = document.querySelector(".best-hotels");
  const citySelect = document.querySelector("#city-select");
  const hotelSelect = document.querySelector("#hotel-select");
  const ticket = document.querySelector("#ticket");
  const ticketPrice = document.querySelector("#ticket-price span");
  const totalPrice = document.querySelector("#total-price span");
  const submit = document.querySelector("#submit");

  const country = JSON.parse(localStorage.getItem("country"));

  heroSection.style.backgroundImage = `url('${country.countryCoverImg}')`;
  heroSectionText.innerHTML = `<h1>Welcome to ${country.country}</h1>`;

  //   best hotels

  const cities = country.cities;

  const container = document.createElement("div");
  container.classList.add("container");

  cities.forEach((city) => {
    const specialHeader = document.createElement("div");
    specialHeader.classList.add("special-header");
    specialHeader.innerHTML = `<h2 class='mt-4'>Best hotels in ${city.city}</h2>`;
    container.appendChild(specialHeader);

    const cityOptions = document.createElement("option");
    cityOptions.value = city.city;
    cityOptions.textContent = city.city;
    citySelect.appendChild(cityOptions);

    const hotels = city.hotels;

    hotels.forEach((hotel) => {
      container.innerHTML += `
        <div class="row">
          <div class="col-12">

          <div class="hotel mb-4">
              <div class="text">
                <h4>${hotel.name}</h4>
                <p>
                    ${hotel.description}
                </p>
              </div>
              <div>
                <img src="${hotel.img}" alt="country" />
              </div>
            </div>
          </div>
        </div> 
        
        `;

      const hotelOptions = document.createElement("option");
      hotelOptions.value = hotel.name;
      hotelOptions.textContent = hotel.name;
      hotelSelect.appendChild(hotelOptions);

      bestHotels.append(container);
    });
  });

  ticketPrice.innerHTML = country.ticketPrice;

  ticket.addEventListener("keyup", () => {
    let ticketValue = parseFloat(ticket.value);
    let pricePerTicket = parseFloat(ticketPrice.textContent);
    totalPrice.innerHTML = ticketValue * pricePerTicket;
  });

  submit.addEventListener("click", (e) => e.preventDefault());
}
