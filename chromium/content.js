if (!document.URL.startsWith("https://monepi.fr/boutique")) {
    console.log("Pas dans monepi, on ne fait rien.");
    console.log(document.URL);
}
else {

    function customFilterProducts() {
        console.log("Dans customFilterProducts");
        let productsRow = document.querySelector("#products-row");
        for (let i = 0; i < productsRow.children.length; i++) {
            const child = productsRow.children[i];
            if (child.querySelector(".Product-CTA").classList.contains("disabled")) {
                child.style.display = "none";
            }
        }
    }

    console.log("Dans monepi, on fait quelque chose.");

    customFilterProducts();

    let button = document.createElement("button");
    let li = document.createElement("li");
    button.innerText = "Filtrer";
    button.addEventListener('click', customFilterProducts);
    li.appendChild(button);
    document.querySelector(".Nav-body").appendChild(li);

    function handleScrollAndTouchMove() {
        if (document.getElementById("show-more-products-wrapper").style.display == "block" 
                && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
            setTimeout(customFilterProducts, 200);
        }
    }

    window.addEventListener('scroll', handleScrollAndTouchMove);
    window.addEventListener('touchmove', handleScrollAndTouchMove);

    document.querySelector('#show-more-products-wrapper button').addEventListener('click', function(){
        customFilterProducts();
    });
}
