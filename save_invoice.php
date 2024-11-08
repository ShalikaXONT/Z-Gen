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

// Retrieve JSON data from request
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO invoices (company_info, payment_info, issue_date, net_term, due_date, client_name, client_address, item_description, item_quantity, item_price, item_discount, item_tax, item_line_total, amount_subtotal, tax_value, amount_total, amount_due) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "sssssssiiiiiiddd",
        $data['company_info'],
        $data['payment_info'],
        $data['issue_date'],
        $data['net_term'],
        $data['due_date'],
        $data['client_name'],
        $data['client_address'],
        $data['item_description'],
        $data['item_quantity'],
        $data['item_price'],
        $data['item_discount'],
        $data['item_tax'],
        $data['item_line_total'],
        $data['amount_subtotal'],
        $data['tax_value'],
        $data['amount_total'],
        $data['amount_due']
    );

    // Execute and check for errors
    if ($stmt->execute()) {
        echo "Invoice saved successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "No data received!";
}

$conn->close();
?>
