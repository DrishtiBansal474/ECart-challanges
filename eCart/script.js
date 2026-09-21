


function getAllProducts() {

    const products = [];

    for (const category of storeData.categories) {

        for (const subcategory of category.subcategories) {

            for (const product of subcategory.products) {

                products.push(product);

            }
        }
    }

    return products;
}


const allProducts = getAllProducts();





const productsByPrice = [...allProducts].sort(
    (a, b) => a.price - b.price
);





function formatCurrency(amount) {

    return `₹${amount.toLocaleString("en-IN")}`;

}



function createProductCard(product, extraHTML = "") {

    return `

        <div class="product-card">

            ${extraHTML}

            <h3>
                ${product.name}
            </h3>


            <p class="product-brand">
                Brand: ${product.brand}
            </p>


            <p class="product-price">
                ${formatCurrency(product.price)}
            </p>


            <p class="product-rating">
                ★ ${product.rating}
            </p>


            <p class="product-reviews">
                ${product.reviews} reviews
            </p>


            <p class="product-stock">
                Stock: ${product.stock}
            </p>

        </div>

    `;
}






function lowerBoundByPrice(target) {

    let left = 0;

    let right = productsByPrice.length;


    while (left < right) {

        const mid =
            Math.floor((left + right) / 2);


        if (productsByPrice[mid].price < target) {

            left = mid + 1;

        } else {

            right = mid;

        }

    }


    return left;
}




function findClosestProducts(target, k) {

    if (productsByPrice.length === 0) {

        return [];

    }


    const index =
        lowerBoundByPrice(target);


    let left = index - 1;

    let right = index;


    const result = [];


    while (
        result.length < k &&
        (left >= 0 || right < productsByPrice.length)
    ) {


       
        if (left < 0) {

            result.push(
                productsByPrice[right]
            );

            right++;

        }


        // Right side khatam ho gayi
        else if (right >= productsByPrice.length) {

            result.push(
                productsByPrice[left]
            );

            left--;

        }


        else {

            const leftDifference =
                Math.abs(
                    productsByPrice[left].price - target
                );


            const rightDifference =
                Math.abs(
                    productsByPrice[right].price - target
                );



            if (leftDifference <= rightDifference) {

                result.push(
                    productsByPrice[left]
                );

                left--;

            } else {

                result.push(
                    productsByPrice[right]
                );

                right--;

            }

        }

    }


    return result;
}



function displayPriceResults(
    products,
    target
) {

    const resultsContainer =
        document.getElementById(
            "priceResults"
        );


    const message =
        document.getElementById(
            "priceMessage"
        );


    if (products.length === 0) {

        resultsContainer.innerHTML = "";

        message.textContent =
            "No products found.";

        return;

    }


    message.textContent =
        `Showing ${products.length} closest products to ${formatCurrency(target)}.`;


    resultsContainer.innerHTML =
        products.map(
            (product, index) => {

                const difference =
                    Math.abs(
                        product.price - target
                    );


                return createProductCard(
                    product,

                    `
                    <span class="difference">

                        #${index + 1}

                        • Difference:
                        ${formatCurrency(difference)}

                    </span>
                    `
                );

            }
        ).join("");

}





document
    .getElementById("priceSearchBtn")
    .addEventListener(
        "click",
        function () {

            const target =
                Number(
                    document.getElementById(
                        "targetPrice"
                    ).value
                );


            const k =
                Number(
                    document.getElementById(
                        "resultCount"
                    ).value
                );


           

            if (
                !Number.isFinite(target) ||
                target < 0
            ) {

                document.getElementById(
                    "priceMessage"
                ).textContent =
                    "Please enter a valid price.";

                document.getElementById(
                    "priceResults"
                ).innerHTML = "";

                return;

            }


            const results =
                findClosestProducts(
                    target,
                    k
                );


            displayPriceResults(
                results,
                target
            );

        }
    );






const prefixCount = [0];


 



const prefixInventoryValue = [0];



for (
    let i = 0;
    i < productsByPrice.length;
    i++
) {

    const product =
        productsByPrice[i];


    const inventoryValue =
        product.price * product.stock;


    prefixCount.push(
        prefixCount[i] + 1
    );


    prefixInventoryValue.push(
        prefixInventoryValue[i]
        + inventoryValue
    );

}




function lowerBound(target) {

    let left = 0;

    let right =
        productsByPrice.length;


    while (left < right) {

        const mid =
            Math.floor(
                (left + right) / 2
            );


        if (
            productsByPrice[mid].price
            < target
        ) {

            left = mid + 1;

        } else {

            right = mid;

        }

    }


    return left;
}






function upperBound(target) {

    let left = 0;

    let right =
        productsByPrice.length;


    while (left < right) {

        const mid =
            Math.floor(
                (left + right) / 2
            );


        if (
            productsByPrice[mid].price
            <= target
        ) {

            left = mid + 1;

        } else {

            right = mid;

        }

    }


    return left;
}





function queryInventoryRange(
    minPrice,
    maxPrice
) {


    /*
        Find first product
        whose price >= minPrice
    */

    const start =
        lowerBound(minPrice);


    

    const end =
        upperBound(maxPrice);



    

    const count =
        prefixCount[end]
        -
        prefixCount[start];




    const inventoryValue =
        prefixInventoryValue[end]
        -
        prefixInventoryValue[start];



    const products =
        productsByPrice.slice(
            start,
            end
        );


    return {

        count,

        inventoryValue,

        products

    };

}





function displayRangeResults(
    result,
    minPrice,
    maxPrice
) {


    document.getElementById(
        "productCount"
    ).textContent =
        result.count;



    document.getElementById(
        "inventoryValue"
    ).textContent =
        formatCurrency(
            result.inventoryValue
        );



    const message =
        document.getElementById(
            "rangeMessage"
        );


    const container =
        document.getElementById(
            "rangeResults"
        );



    if (result.count === 0) {

        message.textContent =
            `No products found between ${formatCurrency(minPrice)} and ${formatCurrency(maxPrice)}.`;

        container.innerHTML = "";

        return;

    }



    message.textContent =
        `${result.count} product(s) found between ${formatCurrency(minPrice)} and ${formatCurrency(maxPrice)}.`;



    container.innerHTML =
        result.products
            .map(
                product =>
                    createProductCard(product)
            )
            .join("");

}




document
    .getElementById("rangeSearchBtn")
    .addEventListener(
        "click",
        function () {


            const minPrice =
                Number(
                    document.getElementById(
                        "minPrice"
                    ).value
                );


            const maxPrice =
                Number(
                    document.getElementById(
                        "maxPrice"
                    ).value
                );


            const message =
                document.getElementById(
                    "rangeMessage"
                );



            

            if (
                !Number.isFinite(minPrice) ||
                !Number.isFinite(maxPrice) ||
                minPrice < 0 ||
                maxPrice < 0
            ) {

                message.textContent =
                    "Please enter valid prices.";

                return;

            }



           

            if (minPrice > maxPrice) {

                message.textContent =
                    "Minimum price cannot be greater than maximum price.";

                document.getElementById(
                    "rangeResults"
                ).innerHTML = "";

                document.getElementById(
                    "productCount"
                ).textContent = "0";

                document.getElementById(
                    "inventoryValue"
                ).textContent = "₹0";

                return;

            }



            const result =
                queryInventoryRange(
                    minPrice,
                    maxPrice
                );



            displayRangeResults(
                result,
                minPrice,
                maxPrice
            );

        }
    );
