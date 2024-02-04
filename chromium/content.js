if (document.URL.startsWith("https://monepi.fr/boutique") && document.getElementById('show-more-products-wrapper')) {
    function customFilterProducts() {
        if (document.getElementById("custom-filter-button").classList.contains("light")) {
            let productsRow = document.querySelector("#products-row");
            for (let i = 0; i < productsRow.children.length; i++) {
                const child = productsRow.children[i];
                if (child.querySelector(".Product-CTA").classList.contains("disabled")) {
                    child.style.display = "none";
                }
            }
        }
    }

    function cancelFilterProducts() {
        let productsRow = document.querySelector("#products-row");
        for (let i = 0; i < productsRow.children.length; i++) {
            const child = productsRow.children[i];
            if (child.style.display == "none") {
                child.style.display = "block";
            }
        }
    }

    console.log("Extension filtre monépi active sur cette page.");

    let button = document.createElement("button");
    button.innerText = "Filtrer";
    button.id = "custom-filter-button";
    button.classList.add("Button", "green", "small", "lowercased");
    button.addEventListener('click', event => {
        if (button.classList.contains("light")) {
            button.classList.remove("light");
            cancelFilterProducts();
        }
        else {
            button.classList.add("light");
        }
    });
    let li = document.createElement("li");
    button.addEventListener('click', customFilterProducts);
    li.appendChild(button);
    document.querySelector(".Nav-body").appendChild(li);

    customFilterProducts();

    function handleScrollAndTouchMove() {
        if (document.getElementById("show-more-products-wrapper").style.display == "block" 
                && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
            setTimeout(customFilterProducts, 200);
        }
    }

    window.addEventListener('scroll', handleScrollAndTouchMove);
    window.addEventListener('touchmove', handleScrollAndTouchMove);

    document.getElementById('show-more-products-wrapper').addEventListener('click', function(){
        customFilterProducts();
    });
}
