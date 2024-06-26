const tableTbody = document.querySelector('.table__tbody');
fetch('/get-list-distributors')
    .then(res => res.json())
    .then(distributorData => {
        distributorData.data.forEach((e, index) => {
            let liItem =
                `
            <tr>
                <td class="table__tbody-stt">${index + 1}</td>
                <td class="table__tbody-name">${e.name}</td>
                <td><button class="btn__style"><a href="/Distributors/update-distributor/${e._id}"><i class="material-icons">edit</i></a></button></td>
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
    fetch(`/check-distributor/${id}`)
    .then(res => res.json())
    .then(data => {
        if (data.status === 200) {
            if (confirm(`Are you sure you want to delete the distributor "${name}" ?`)) {
                fetch(`/delete-distributor/${id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 200) {
                            alert('Delete Distributor Successfully!')
                            window.location.href = '/Distributors';
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