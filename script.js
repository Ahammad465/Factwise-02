document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('userList');
    const searchBar = document.getElementById('searchBar');
    let users = [];

    // Fetch users from JSON file
    fetch('celebrities.json')
        .then(response => response.json())
        .then(data => {
            users = data;
            displayUsers(users);
        });

    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = users.filter(user => 
            `${user.first} ${user.last}`.toLowerCase().includes(searchTerm)
        );
        displayUsers(filteredUsers);
    });

    function displayUsers(users) {
        userList.innerHTML = users.map(user => `
            <div class="user-card" data-id="${user.id}">
                <div class="user-card-header">
                    <div>${user.first} ${user.last}</div>
                    <div class="toggle-btn">+</div>
                </div>
                <div class="user-card-details">
                    <img src="${user.picture}" alt="${user.first} ${user.last}">
                    <p>Age: ${calculateAge(new Date(user.dob))}</p>
                    <p>Gender: ${user.gender}</p>
                    <p>Country: ${user.country}</p>
                    <p>${user.description}</p>
                    <div class="actions">
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                    <form class="edit-form">
                        <label>Gender:
                            <select name="gender">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="transgender">Transgender</option>
                                <option value="rather not say">Rather not say</option>
                                <option value="other">Other</option>
                            </select>
                        </label>
                        <label>Country: <input type="text" name="country"></label>
                        <label>Description: <textarea name="description"></textarea></label>
                        <div class="actions">
                            <button type="button" class="save-btn" disabled>Save</button>
                            <button type="button" class="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.user-card').forEach(card => {
            const details = card.querySelector('.user-card-details');
            const editForm = card.querySelector('.edit-form');
            const editBtn = card.querySelector('.edit-btn');
            const deleteBtn = card.querySelector('.delete-btn');
            const toggleBtn = card.querySelector('.toggle-btn');
            const saveBtn = card.querySelector('.save-btn');
            const cancelBtn = card.querySelector('.cancel-btn');

            toggleBtn.addEventListener('click', () => {
                const isOpen = details.style.display === 'block';
                closeAllAccordions();
                if (!isOpen) {
                    details.style.display = 'block';
                    toggleBtn.textContent = '-';
                }
            });

            editBtn.addEventListener('click', () => {
                const user = users.find(user => user.id == card.dataset.id);
                if (calculateAge(new Date(user.dob)) >= 18) {
                    editForm.querySelector('select[name="gender"]').value = user.gender;
                    editForm.querySelector('input[name="country"]').value = user.country;
                    editForm.querySelector('textarea[name="description"]').value = user.description;
                    editForm.classList.add('active');
                    saveBtn.disabled = true;

                    editForm.addEventListener('input', () => {
                        const newGender = editForm.querySelector('select[name="gender"]').value;
                        const newCountry = editForm.querySelector('input[name="country"]').value;
                        const newDescription = editForm.querySelector('textarea[name="description"]').value;
                        saveBtn.disabled = (newGender === user.gender && newCountry === user.country && newDescription === user.description);
                    });
                } else {
                    alert("You can only edit details of adults.");
                }
            });

            saveBtn.addEventListener('click', () => {
                const user = users.find(user => user.id == card.dataset.id);
                user.gender = editForm.querySelector('select[name="gender"]').value;
                user.country = editForm.querySelector('input[name="country"]').value;
                user.description = editForm.querySelector('textarea[name="description"]').value;
                editForm.classList.remove('active');
                displayUsers(users);
            });

            cancelBtn.addEventListener('click', () => {
                editForm.classList.remove('active');
            });

            deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this user?')) {
                    users = users.filter(user => user.id != card.dataset.id);
                    displayUsers(users);
                }
            });
        });
    }

    function closeAllAccordions() {
        document.querySelectorAll('.user-card .user-card-details').forEach(details => {
            details.style.display = 'none';
        });
        document.querySelectorAll('.user-card .toggle-btn').forEach(btn => {
            btn.textContent = '+';
        });
    }

    function calculateAge(dob) {
        const diff = Date.now() - dob.getTime();
        const age = new Date(diff);
        return Math.abs(age.getUTCFullYear() - 1970);
    }
});
