// Array to store the list of expenses
let expenses = [];

// Function to fetch expenses from the database
function fetchExpenses() {
    fetch('fetch_expense.php')
        .then(response => response.json())
        .then(data => {
            expenses = data.expenses; // Assign fetched expenses to the array
            displayExpenses(expenses); // Display expenses in the table
            updateTotalAmount(data.totalAmount); // Update total amount
        })
        .catch(error => console.error('Error fetching expenses:', error));
}

// Event listener for form submission
document.getElementById('expense-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get values from form inputs
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

    // Validate if the form fields are filled correctly
    if (isNaN(amount) || name === "" || category === "" || date === "") {
        alert('Please fill in all fields with valid values.');
        return;
    }

    // Create a new expense object
    const expense = {
        name: name,
        amount: amount,
        category: category,
        date: date
    };

    // Add the expense to the database
    addExpense(expense);
});

// Function to add an expense to the database
function addExpense(expense) {
    fetch('add_expense.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Fetch expenses again to update the list
            fetchExpenses();
            // Reset the form fields after submission
            document.getElementById('expense-form').reset();
        } else {
            alert('Error adding expense: ' + data.message);
        }
    })
    .catch(error => console.error('Error adding expense:', error));
}

// Function to display expenses in the table
function displayExpenses(expenses) {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = ''; // Clear current list

    // Iterate through each expense and create a table row
    expenses.forEach((expense) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.name}</td>
            <td>$${parseFloat(expense.amount).toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button></td>
        `;
        expenseList.appendChild(row);
    });

    // Update the total amount after displaying the expenses
    updateTotalAmount();
}

// Function to update the total amount displayed
function updateTotalAmount(total = null) {
    // If total is provided, use it; otherwise, calculate from expenses
    if (total === null) {
        total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    }
    
    // Update the text content of the total amount display
    document.getElementById('total-amount').textContent = total.toFixed(2);
}

// Function to delete an expense by its id
function deleteExpense(id) {
    fetch(`delete_expense.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Fetch expenses again to update the list
            fetchExpenses();
        } else {
            alert('Error deleting expense: ' + data.message);
        }
    })
    .catch(error => console.error('Error deleting expense:', error));
}

// Event listener for filtering expenses by category
document.getElementById('filter-category').addEventListener('change', function () {
    const selectedCategory = this.value;

    // Filter the expenses based on the selected category
    if (selectedCategory === 'All') {
        displayExpenses(expenses); // Show all expenses
    } else {
        const filteredExpenses = expenses.filter(expense => expense.category === selectedCategory);
        displayExpenses(filteredExpenses); // Show filtered expenses
    }
});

// Initial fetch of expenses when the page loads
fetchExpenses();
