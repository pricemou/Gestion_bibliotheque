$(document).ready(function() {

// Permet de faire une rechercher
    $('#searchInput').on('input', function() {
        let query = $(this).val();

        $.ajax({
            url: `/search?q=${query}`,
            type: 'GET',
            dataType: 'json',
            success: function(books) {
                let tableBody = $('#bookTable');
                tableBody.empty();

                books.forEach(book => {
                    let availabilityBadge = book.available 
                        ? '<span class="badge badge-sm bg-gradient-success">Disponible</span>' 
                        : '<span class="badge badge-sm bg-gradient-danger">Indisponible</span>';

                    let row = `<tr>
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img src="/img/team-2.jpg" class="avatar avatar-sm me-3" alt="livre">
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${book.title}</h6>
                            <p class="text-xs text-secondary mb-0">${book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p class="text-xs font-weight-bold mb-0">${book.genre}</p>
                        <p class="text-xs text-secondary mb-0">${book.category}</p>
                      </td>
                      <td class="align-middle text-center text-sm">
                        ${availabilityBadge}
                      </td>
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${book.date}</span>
                      </td>
                      <td class="align-middle">
                        <a href="javascript:;" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip"
                          data-original-title="Modifier livre">
                          Modifier
                        </a>
                      </td>
                    </tr>`;

                    tableBody.append(row);
                });
            }
        });
    });
});
