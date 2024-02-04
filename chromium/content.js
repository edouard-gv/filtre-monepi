if (!document.URL.startsWith("https://monepi.fr/boutique")) {
    console.log("Pas dans monepi, on ne fait rien.");
    console.log(document.URL);
}
else {
    console.log("Dans monepi, on fait quelque chose.");
    rawjs = document.body.children[0].innerText;
    openString = "let products = ";
    closeString = "}]";
    start = rawjs.indexOf(openString) + openString.length;
    end = rawjs.indexOf(closeString, start) + closeString.length;

    if (start == openString.length) {
        console.log("balise de début de produit non trouvée");
    }

    if (end == closeString.length) {
        console.log("balise de fin de produit non trouvée");
    }

    rawproducts = rawjs.slice(start, end);

    products = JSON.parse(rawproducts);

    console.log("Produits trouvés: "+products.length);

    let categories = (new URLSearchParams(window.location.search)).get('categorieID');
    if(categories) {
        categories = categories.split(',');
    }
    let search = (new URLSearchParams(window.location.search)).get('search');
    let nouveaute = (new URLSearchParams(window.location.search)).get('nouveaute') !== null;
    let vrac = (new URLSearchParams(window.location.search)).get('vrac') !== null;

    if(categories) {
        // filtrage des produits appartenant aux catégories sélectionnées
        products = products.filter(p => categories.includes(p.categorieP));
        // si des catégories sont sélectionnées on trie par libellé
        products.sort((p1, p2) => p1.libelleSP.toLowerCase() < p2.libelleSP.toLowerCase() ? -1 : p1.libelleSP.toLowerCase() > p2.libelleSP.toLowerCase() ? 1 : 0);
    }
    else {
        // sinon on trie par misenavant, puis is_new, puis is_gestionsurplus, et enfin par libellé
        products.sort((p1, p2) =>
                p1.misenavant != p2.misenavant ? p2.misenavant - p1.misenavant :
                p1.is_new != p2.is_new ? p2.is_new - p1.is_new :
                p1.is_gestionsurplus != p2.is_gestionsurplus ? p2.is_gestionsurplus - p1.is_gestionsurplus :
                p1.libelleSP.toLowerCase() < p2.libelleSP.toLowerCase() ? -1 : p1.libelleSP.toLowerCase() > p2.libelleSP.toLowerCase() ? 1 : 0);
    }
    if(search) {
        // filtrage des produits correspondant à la recherche
        products = products.filter(p => matchForTypeAheadList(search, p.libelleSP) || matchForTypeAheadList(search, p.fournisseur));
    }
    if(nouveaute) {
        // filtrage des produits nouveaux
        products = products.filter(p => p.is_new == '1');
    }
    if(vrac) {
        // filtrage des produits distribués en vrac
        products = products.filter(p => p.typeprix != 'u' && p.distrikg != p.conditionnement_mini && p.modecde == '0');
    }

    // si aucun paramètre n'est donné, on n'affiche que les produits :
    //   en stock avec stock disponible > 0
    //  OU
    //   en précommande non limités au stock fournisseur
    //  OU
    //   en précommande limités au stock fournisseur avec stock fournisseur > 0 ou avec gestion de surplus et stock disponible > 0
    if(!categories && !search && !nouveaute && !vrac) {
        products = products.filter(p =>
            p.modecde == '0' && parseFloat(p.qte_dispo) > 0
                || p.modecde == '1'
                    && (p.limitestock == '0'
                        || p.limitestock == '1' && (parseFloat(p.qte_commandable) > 0 || p.gestionsurplus == '1' && parseFloat(p.qte_dispo) > 0)));

    }

    window.addEventListener('scroll touchmove', function(){
        if (products.length > document.querySelector('section.Product').length && window.scrollTop() + window.height() >= document.height()){
            loadProducts(products, document.querySelector('section.Product').length);
        }
    });

    document.querySelector('#show-more-products-wrapper button').addEventListener('click', function(){
        loadProducts(products, document.querySelector('section.Product').length);
    });

    let productsRow = document.querySelector("#products-row");

    while (productsRow.firstChild) {
        productsRow.removeChild(productsRow.firstChild);
    }

    loadProducts(products, 0);

}
