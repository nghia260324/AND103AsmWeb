const tableTbody = document.querySelector('.table__tbody');
fetch('/get-list-categories')
    .then(res => res.json())
    .then(distributorData => {
        distributorData.data.forEach((e, index) => {
            let liItem =
                `
            <tr>
                <td class="table__tbody-stt">${index + 1}</td>
                <td class="table__tbody-name">${e.name}</td>
                <td><button class="btn__style"><a href="/Categories/update-category/${e._id}"><i class="material-icons">edit</i></a></button></td>
                <td><button onclick="deleteDistributor('${e._id}','${e.name}')" class="btn__style"><i class="material-icons">delete_forever</i></button></td>
            </tr>
        `;
            tableTbody.insertAdjacentHTML('beforeend', liItem);
        });
    })
    .catch(error => {
        console.error('Lỗi:', error);
    });

function deleteDistributor(id,name) {
    fetch(`/check-category/${id}`)
    .then(res => res.json())
    .then(data => {
        if (data.status === 200) {
            if (confirm(`Are you sure you want to delete the category "${name}" ?`)) {
                fetch(`/delete-category/${id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 200) {
                            alert('Delete Category Successfully!')
                            window.location.href = '/Categories';
                        }
                    })
                    .catch(err => console.log(err))
            }
        } else {
            alert(`The following item can't be deleted because they have dependent items!`);
        }
    })
    .catch(err => console.log(err))
}