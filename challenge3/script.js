const productContainer = document.getElementById("productContainer");

function displayProducts() {
    products.forEach(function(product) {

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>₹${product.price}</p>
            <button onclick="viewProduct(${product.id})">
                View Product
            </button>
        `;

        productContainer.appendChild(card);
    });
}
displayProducts();
const productModal = document.getElementById("productModal");
const productDetails = document.getElementById("productDetails");
const closeModal = document.getElementById("closeModal");

function viewProduct(id) {

    const product = products.find(function(product) {
        return product.id === id;
    });

    productDetails.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>Price: ₹${product.price}</p>
        <p>${product.description}</p>
    `;

    productModal.style.display = "block";
}

closeModal.addEventListener("click", function() {
    productModal.style.display = "none";
});
let recentlyViewed = [];

function viewProduct(id) {

    const product = products.find(function(product) {
        return product.id === id;
    });

    // Recently viewed mein product already hai to remove karo
    recentlyViewed = recentlyViewed.filter(function(product) {
        return product.id !== id;
    });

    // Latest viewed product ko beginning mein add karo
    recentlyViewed.unshift(product);

    productDetails.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>Price: ₹${product.price}</p>
        <p>${product.description}</p>
    `;

    productModal.style.display = "block";

    displayRecentlyViewed();
}
function displayRecentlyViewed() {

    const recentlyViewedContainer =
        document.getElementById("recentlyViewed");

    const emptyMessage =
        document.getElementById("emptyMessage");

    recentlyViewedContainer.innerHTML = "";

    if (recentlyViewed.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }