<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "123";
$dbname = "zgen";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch all invoices
$sql = "SELECT * FROM invoices";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "<h2>Invoice #" . $row["id"] . "</h2>";
        echo "Issue Date: " . $row["issue_date"] . "<br>";
        echo "Due Date: " . $row["due_date"] . "<br>";
        echo "Client Name: " . $row["client_name"] . "<br>";
        echo "Client Address: " . $row["client_address"] . "<br>";
        echo "Total Amount: " . $row["amount_total"] . "<br>";
        echo "<hr>";
    }
} else {
    echo "No invoices found.";
}

$conn->close();
?>
