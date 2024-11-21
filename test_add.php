<?php
$host = 'localhost';
$user = 'shruti';
$pass = 'thirdyear';
$db = 'expense_tracker';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Test insert
$name = 'Test Expense';
$amount = 10.00;
$category = 'Food';
$date = '2024-09-28';

$stmt = $conn->prepare("INSERT INTO expenses (name, amount, category, date) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sdss", $name, $amount, $category, $date);

if ($stmt->execute()) {
    echo "New record created successfully.";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
