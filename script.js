function getAllProducts() {

    let products = [];

    for (let category of storeData.categories) {

        for (let subcategory of category.subcategories) {

            for (let product of subcategory.products) {

                products.push(product);
            }
        }
    }

    return products;
}


let products = getAllProducts();


products.sort((a, b) => a.price - b.price);


function formatCurrency(price) {

    return "₹" + price.toLocaleString("en-IN");
}


function findClosestProducts(target) {

    let result = [];

    let closestDifference = Infinity;

    for (let product of products) {

        let difference =
            Math.abs(product.price - target);

        if (difference < closestDifference) {

            closestDifference = difference;

            result = [product];

        }
        else if (difference === closestDifference) {

            result.push(product);
        }
    }

    return result;
}


function displayProducts(productList) {

    let container =
        document.getElementById("productContainer");

    container.innerHTML = "";


    for (let product of productList) {

        let card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <h3>${product.name}</h3>

            <p>
                Brand: ${product.brand}
            </p>

            <p class="price">
                ${formatCurrency(product.price)}
            </p>

            <p class="rating">
                ★ ${product.rating}
            </p>

            <button class="view-btn">
                View Product
            </button>

        `;


        container.appendChild(card);
    }
}


document
    .getElementById("searchBtn")
    .addEventListener("click", function () {

        let target =
            Number(document.getElementById("priceInput").value);


        if (!target) {

            alert("Please enter a price");

            return;
        }


        let result =
            findClosestProducts(target);


        displayProducts(result);
    });