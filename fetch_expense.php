<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$host = 'localhost';
$db = 'expense_tracker'; // Ensure this matches your database name
$user = 'shruti'; // Your database user
$pass = 'thirdyear'; // Your database user's password

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch expenses from the database
$sql = "SELECT * FROM expenses";
$result = $conn->query($sql);

$expenses = [];
$totalAmount = 0;

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $expenses[] = $row;
        $totalAmount += (float)$row['amount']; // Ensure amount is treated as a float
    }
}

// Return the expenses and total amount as JSON
$response = [
    'expenses' => $expenses,
    'totalAmount' => $totalAmount
];

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
