<form action="save_invoice.php" method="POST">
<!DOCTYPE html>

<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Z-Bill</title>

  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <meta name="description" content="PremiumBayy Invoice Printer">
  <meta name="author" content="PremiumBayy">

  <link rel="stylesheet" href="template.css">
  <link rel="stylesheet" data-href="mobile.css">

  <!-- <script src="libs/jquery.min.js"></script>
  <script src="libs/bootstrap.min.js"></script>
  <script src="js/generator.js"></script> -->

</head>

<body>
  <div id="container">
    <section id="memo">
      <div class="logo">
        <img style="height: auto;" src="img/logo_dark.png" />
      </div>

      <div class="company-info">
        <div>PremiumBayy - Tech Support</div>
        <div>65/3b, Thalwatte, Kandy.</div>
        <div>+94 (0) 777 766 639 | +94 (0) 723 000 039</div>
        <!-- <div>{company_phone_fax}</div> -->
        <div>www.premiumbayy.com | hello@premiumbayy.com</div>
      </div>

      <div class="payment-info">
        <!-- <div>Payment details:</div> -->
        <div></div>
        <div>{payment_info2}</div>
        <div>{payment_info3}</div>
        <div> </div>
        <div>Reg No - PV123456789</div>
        <!-- <div>{payment_info5}</div> -->
        <!-- <p id="date"></p> -->
      </div>

    </section>

    <div class="memo-line"></div>

    <section id="invoice-info">
      <div>
        <span>{issue_date_label}</span>
        <span>{net_term_label}</span>
        <span>{due_date_label}</span>
        <!-- <span></span> -->
        <!-- <span>{po_number_label}</span> -->
      </div>

      <div>
        <span>{issue_date}</span>
        <span>{net_term}</span>
        <span>{net_term}</span>
        <!-- <span></span>
        <span>{po_number}</span> -->
      </div>
    </section>

    <section id="client-info">
      <span>{bill_to_label}</span>
      <div>
        <span style="text-align: right">{client_name}</span>
      </div>

      <div>
        <span style="text-align: right">{client_address}</span>
      </div>

      <!-- <div>
        <span>{client_phone_fax}</span>
      </div> -->

      <!-- <div>
        <span>{client_email}</span>
      </div> -->

    </section>

    <div class="clearfix"></div>

    <section id="invoice-title-number">

      <span id="title">Invoice</span>
      <span id="date"></span>

    </section>

    <div class="clearfix"></div>

    <section id="items">

      <table cellpadding="0" cellspacing="0">

        <tr id="in_header">
          <th>{item_row_number_label}</th>
          <!-- Dummy cell for the row number and row commands -->
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>{item_discount_label}</th>
          <th>{item_tax_label}</th>
          <th>{item_line_total_label}</th>
        </tr>

        <tr data-iterate="item">
          <td>{item_row_number}</td>
          <!-- Don't remove this column as it's needed for the row commands -->
          <td>
            <span class="show-mobile">{item_description_label}</span>
            <span>{item_description}</span>
          </td>
          <td>
            <span class="show-mobile">{item_quantity_label}</span>
            <span>{item_quantity}</span>
          </td>
          <td>
            <span class="show-mobile">{item_price_label}</span>
            <span>{item_price}</span>
          </td>
          <td>
            <span class="show-mobile">{item_discount_label}</span>
            <span>{item_discount}</span>
          </td>
          <td>
            <span class="show-mobile">{item_tax_label}</span>
            <span>{item_tax}</span>
          </td>
          <td>
            <span class="show-mobile">{item_line_total_label}</span>
            <span>{item_line_total}</span>
          </td>
        </tr>

      </table>

    </section>

    <section id="sums">

      <table cellpadding="0" cellspacing="0">
        <tr>
          <th>Subtotal:</th>
          <td>{amount_subtotal}</td>
        </tr>

        <tr data-iterate="tax">
          <th>Tax:</th>
          <td>{tax_value}</td>
        </tr>

        <tr class="amount-total">
          <th>Total:</th>
          <td>{amount_total}</td>
        </tr>

        <!-- You can use attribute data-hide-on-quote="true" to hide specific information on quotes.
               For example Invoicebus doesn't need amount paid and amount due on quotes  -->
        <!-- <tr data-hide-on-quote="true">
          <th>Paid:</th>
          <td>{amount_paid}</td>
        </tr> -->

        <tr data-hide-on-quote="true" id="tot_space">
          <th>Amount Due:</th>
          <td>{amount_due}</td>
        </tr>

      </table>

    </section>
    
    <div class="clearfix"></div>

    <section id="terms">

      <span>Terms & Notes</span>
      <div>Warranty covers only manufacture defects. The warranty does not cover damage caused such as power failures,
        lightning or environmental defects. Virus attack or System failures are not included for warranty claims.</div>

      <div id="about" style="text-align: center;">This is a System Generated Invoice by PremiumBayy - Tech Support @ 2024</div>

    </section>
  </div>

  <script type="text/javascript">
    var d = new Date();
    document.getElementById("date").innerHTML = d.getTime();
  </script>

<script>
  function saveInvoice() {
    const invoiceData = {
      issue_date: "{issue_date}",
      net_term: "{net_term}",
      due_date: "{due_date}",
      client_name: "{client_name}",
      client_address: "{client_address}",
      subtotal: "{amount_subtotal}",
      tax: "{tax_value}",
      total: "{amount_total}",
      amount_due: "{amount_due}",
      terms: "Warranty covers only manufacture defects...",
      items: [
        {
          description: "{item_description}",
          quantity: "{item_quantity}",
          price: "{item_price}",
          discount: "{item_discount}",
          tax: "{item_tax}",
          line_total: "{item_line_total}"
        }
        // Add more items if applicable
      ]
    };

    fetch("save_invoice.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          alert("Invoice saved with ID: " + data.invoice_id);
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch(error => console.error("Error:", error));
  }
</script>


  <script src="http://cdn.invoicebus.com/generator/generator.min.js?data=true"></script>
  <!-- <script src="js/generator.min.js"></script> -->
</body>

</html>
  <input type="hidden" name="issue_date" value="{issue_date}">
  <input type="hidden" name="net_term" value="{net_term}">
  <input type="hidden" name="due_date" value="{due_date}">
  <input type="hidden" name="client_name" value="{client_name}">
  <input type="hidden" name="client_address" value="{client_address}">
  <input type="hidden" name="item_description" value="{item_description}">
  <input type="hidden" name="item_quantity" value="{item_quantity}">
  <input type="hidden" name="item_price" value="{item_price}">
  <input type="hidden" name="item_discount" value="{item_discount}">
  <input type="hidden" name="item_tax" value="{item_tax}">
  <input type="hidden" name="item_line_total" value="{item_line_total}">
  <input type="hidden" name="amount_subtotal" value="{amount_subtotal}">
  <input type="hidden" name="tax_value" value="{tax_value}">
  <input type="hidden" name="amount_total" value="{amount_total}">
  <input type="hidden" name="amount_due" value="{amount_due}">
  
  <button type="submit">Save Invoice</button>
</form>
