const attractions = [
  {
    id: 1,
    name: "Unirii Square (Piața Unirii)",
    category: "Landmark",
    location: "City Center",
    image: "../media/piata-unirii.jpg",
    shortDesc: "The historic heart of Cluj-Napoca, home to St. Michael's Church and Matthias Corvinus statue.",
    fullDesc: "Unirii Square is the largest and most famous square in Cluj-Napoca. Visitors can admire the Gothic St. Michael's Church, historic palaces, and lively outdoor cafes."
  },
  {
    id: 2,
    name: "Central Park (Parcul Central)",
    category: "Park",
    location: "West of City Center",
    image: "../media/parcul-central.jpg",
    shortDesc: "A peaceful green oasis with walking paths, a boating lake, and the historic Casino building.",
    fullDesc: "Founded over 180 years ago, Central Park Simion Barnutiu is ideal for relaxing walks, paddle boating on Chios Lake, and visiting the Chios Casino cultural center."
  },
  {
    id: 3,
    name: "Alexandru Borza Botanical Garden",
    category: "Park",
    location: "Republicii Street",
    image: "../media/gradina-botanica.jpg",
    shortDesc: "Over 10,000 plant species from around the world, featuring a Japanese Garden and greenhouses.",
    fullDesc: "Covering 14 hectares, the Botanical Garden features themed areas including a Japanese Garden, a Roman Garden with archaeological artifacts, and tropical greenhouses."
  },
  {
    id: 4,
    name: "National Museum of Transylvanian History",
    category: "Museum",
    location: "Constantin Daicoviciu Street",
    image: "../media/muzeul-istorie.jpg",
    shortDesc: "Discover ancient Dacian, Roman, and medieval artifacts from across Transylvania.",
    fullDesc: "This museum preserves over 400,000 historical items, showcasing the rich multicultural history of Cluj and Transylvania from prehistoric times to the modern era."
  },
  {
    id: 5,
    name: "Tailors' Bastion (Bastionul Croitorilor)",
    category: "Culture",
    location: "Baba Novac Street",
    image: "../media/bastionul-croitorilor.jpg",
    shortDesc: "A preserved 15th-century medieval fortress tower that now hosts art exhibitions and events.",
    fullDesc: "Built in the 15th century and maintained by the tailors' guild, this medieval bastion has been restored into a modern urban culture center and museum space."
  },
  {
    id: 6,
    name: "Cetatuia Hill (Dealul Cetățuia)",
    category: "Landmark",
    location: "North of Somes River",
    image: "../media/cetatuia.jpg",
    shortDesc: "The best panoramic viewpoint over Cluj-Napoca, especially popular at sunset.",
    fullDesc: "Originally an 18th-century Habsburg fortification, Cetatuia Hill offers breathtaking 360-degree views over the entire city of Cluj-Napoca."
  }
];

function getFavourites() {
  const saved = localStorage.getItem("clujFavourites");
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

function saveFavourites(favList) {
  localStorage.setItem("clujFavourites", JSON.stringify(favList));
}

function toggleFavourite(id) {
  let favList = getFavourites();

  if (favList.includes(id)) {
    favList = favList.filter(function(item) {
      return item !== id;
    });
    alert("Removed from Favourites!");
  } else {
    favList.push(id);
    alert("Added to Favourites!");
  }

  saveFavourites(favList);
  renderCurrentPage();
}

function createCardHTML(place, isFavPage) {
  const favList = getFavourites();
  const isSaved = favList.includes(place.id);
  const favBtnText = isSaved ? "Remove Favourite" : "Add to Favourites";

  let detailsBtn = "";
  if (!isFavPage) {
    detailsBtn = `<button class="btn btn-blue" onclick="openModal(${place.id})">View Details</button>`;
  }

  return `
    <div class="card">
      <img src="${place.image}" alt="${place.name}">
      <div class="card-info">
        <span class="category-tag">${place.category}</span>
        <h3>${place.name}</h3>
        <p class="location-text">Location: ${place.location}</p>
        <p>${place.shortDesc}</p>
        <div class="card-buttons">
          ${detailsBtn}
          <button class="btn" onclick="toggleFavourite(${place.id})">${favBtnText}</button>
        </div>
      </div>
    </div>
  `;
}

function renderFeatured() {
  const container = document.getElementById("featured-list");
  if (!container) return;

  const topThree = attractions.slice(0, 3);
  container.innerHTML = "";

  for (let i = 0; i < topThree.length; i++) {
    container.innerHTML += createCardHTML(topThree[i], true);
  }
}

function renderAttractions() {
  const container = document.getElementById("attractions-list");
  if (!container) return;

  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");

  const searchText = searchInput ? searchInput.value.toLowerCase() : "";
  const selectedCategory = categorySelect ? categorySelect.value : "All";

  container.innerHTML = "";
  let foundCount = 0;

  for (let i = 0; i < attractions.length; i++) {
    const place = attractions[i];
    const matchesName = place.name.toLowerCase().includes(searchText);
    const matchesCategory = selectedCategory === "All" || place.category === selectedCategory;

    if (matchesName && matchesCategory) {
      container.innerHTML += createCardHTML(place, false);
      foundCount++;
    }
  }

  if (foundCount === 0) {
    container.innerHTML = "<p>No attractions found matching your search.</p>";
  }
}

function renderFavourites() {
  const container = document.getElementById("favourites-list");
  const countText = document.getElementById("favourites-count");
  if (!container) return;

  const favIds = getFavourites();
  countText.textContent = "Total Saved: " + favIds.length;
  container.innerHTML = "";

  if (favIds.length === 0) {
    container.innerHTML = "<p>You have no saved attractions yet. Go to Attractions to add some!</p>";
    return;
  }

  for (let i = 0; i < attractions.length; i++) {
    if (favIds.includes(attractions[i].id)) {
      container.innerHTML += createCardHTML(attractions[i], true);
    }
  }
}

function openModal(id) {
  const modal = document.getElementById("details-modal");
  if (!modal) return;

  for (let i = 0; i < attractions.length; i++) {
    if (attractions[i].id === id) {
      document.getElementById("modal-title").textContent = attractions[i].name;
      document.getElementById("modal-category").textContent = attractions[i].category + " - " + attractions[i].location;
      document.getElementById("modal-img").src = attractions[i].image;
      document.getElementById("modal-desc").textContent = attractions[i].fullDesc;
      modal.style.display = "flex";
    }
  }
}

function setupModal() {
  const closeBtn = document.getElementById("close-modal");
  const modal = document.getElementById("details-modal");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", function() {
      modal.style.display = "none";
    });
  }
}

function setupFilters() {
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");

  if (searchInput) {
    searchInput.addEventListener("input", renderAttractions);
  }
  if (categorySelect) {
    categorySelect.addEventListener("change", renderAttractions);
  }
}

function setupAccordion() {
  const buttons = document.getElementsByClassName("toggle-btn");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
      const content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  if (!form) return;

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || message === "") {
      feedback.style.color = "red";
      feedback.textContent = "Please fill in all fields before sending.";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      feedback.style.color = "red";
      feedback.textContent = "Please enter a valid email address.";
      return;
    }

    feedback.style.color = "green";
    feedback.textContent = "Thank you, " + name + "! Your message has been sent.";
    form.reset();
  });
}

function renderCurrentPage() {
  renderFeatured();
  renderAttractions();
  renderFavourites();
}

renderCurrentPage();
setupFilters();
setupModal();
setupAccordion();
setupContactForm();