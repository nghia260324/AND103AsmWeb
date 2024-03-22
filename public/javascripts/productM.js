const BASE_URL = "http://localHost:3000/";

const tableTbody = document.querySelector('.table__tbody');
Promise.all([
    fetch('/get-list-products').then(res => res.json()),
    fetch('/get-list-distributors').then(res => res.json()),
    fetch('/get-list-categories').then(res => res.json())
])
    .then(([productData, distributorData, categoryData]) => {
        productData.data.forEach((e, index) => {
            let liItem =
                `
            <tr>
                <td class="table__tbody-stt">${index + 1}</td>
                <td class="table__tbody-name">${e.name}</td>
                <td class="table__tbody-quantity">${e.quantity}</td>
                <td class="table__tbody-price">${formatPrice(e.price, "₫")}</td>
                <td class="table__tbody-status">${e.status == 0 ? "Available" : "Sold out"}</td>

                <td class="table__tbody-thumbnail"><img class="product__thumbnail" style="width: 56px;height: 56px;display: block;" src="${convertLocalhostToIpAddress(e.thumbnail)}" alt=""></td>
                <td class="table__tbody-description">${e.description}</td>
                <td class="table__tbody-id_distributor">${distributorData.data.find(distributor => distributor._id === e.id_distributor).name}</td>
                <td class="table__tbody-id_distributor">${categoryData.data.find(category => category._id === e.id_category).name}</td>
                <td><button class="btn__style"><a href="Products/update-product/${e._id}"><i class="material-icons">edit</i></a></button></td>
                <td><button onclick="deleteProduct('${e._id}','${e.name}')" class="btn__style"><i
                            class="material-icons">delete_forever</i></button></td>
            </tr>
        `
            tableTbody.insertAdjacentHTML('beforeend', liItem);
        });
    })
    .catch(err => {
        console.error(err);
    });
                // <td class="table__tbody-thumbnail"><img class="product__thumbnail" style="width: 56px;height: 56px;display: block;" src="${e.thumbnail}" alt=""></td>
function deleteProduct(id,name) {
    if (confirm(`Are you sure you want to delete the product "${name} ?"`)) {
        fetch(`/delete-product/${id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    window.location.href = '/Products';
                }
            })
            .catch(err => console.log(err))
    }
}
function formatPrice(n, currency) {
    let formattedPrice = n.toFixed(2).replace(/\.00$/, '');
    formattedPrice = formattedPrice.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    return formattedPrice + currency;
}
function convertLocalhostToIpAddress(url) {
    const index = url.indexOf("3000/");
    let newUrl = "";
    if (index !== -1) {
        newUrl = BASE_URL + url.substring(index + 5);
    } else {
        newUrl = url;
    }
    return newUrl;
}