<?php
$host = 'localhost'; // Your MySQL server
$db = 'expense_tracker'; // Your database name
$user = 'shruti'; // Your MySQL username
$pass = 'thirdyear'; // Your MySQL password

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = $data['name'];
    $amount = $data['amount'];
    $category = $data['category'];
    $date = $data['date'];

    $sql = "INSERT INTO expenses (name, amount, category, date) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdss", $name, $amount, $category, $date);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add expense.']);
    }

    $stmt->close();
}

$conn->close();
?>
