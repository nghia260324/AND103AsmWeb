const tableTbody = document.querySelector('.table__tbody');
fetch('/get-list-distributor')
    .then(res => res.json())
    .then(distributorData => {
        distributorData.data.forEach((e, index) => {
            let liItem =
                `
            <tr>
                <td class="table__tbody-stt">${index + 1}</td>
                <td class="table__tbody-name">${e.name}</td>
                <td><button class="btn__style"><a href="/Distributor/update-distributor/${e._id}"><i class="material-icons">edit</i></a></button></td>
                <td><button onclick="deleteDistributor('${e._id}')" class="btn__style"><i class="material-icons">delete_forever</i></button></td>
            </tr>
        `;
            tableTbody.insertAdjacentHTML('beforeend', liItem);
        });
    })
    .catch(error => {
        console.error('Lỗi:', error);
    });

function deleteDistributor(id) {
    fetch(`/check-distributor/${id}`)
    .then(res => res.json())
    .then(data => {
        if (data.status === 200) {
            if (confirm('Bạn có chắc chắn muốn xóa Nhà Phân Phối này không?')) {
                fetch(`/delete-distributor/${id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 200) {
                            window.location.href = '/Distributor';
                        }
                    })
                    .catch(err => console.log(err))
            }
        } else {
            alert('Không thể xóa Nhà Phân Phối này!');
        }
    })
    .catch(err => console.log(err))
}