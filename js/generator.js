/*! Invoice Template Generator @author: Invoicebus @email: info@invoicebus.com @web: https://invoicebus.com @version: 1.0.0 @updated: 2017-11-17 13:11:59 @license: MIT */
/**
 * Invoice Template Generator by Invoicebus
 */

(function () {

  /*
   * Initially hide the html and body elements
   */
  document.getElementsByTagName('html')[0].style.position = 'absolute';
  document.getElementsByTagName('html')[0].style.top = '-100000px';

  document.body.style.position = 'absolute';
  document.body.style.top = '-100000px';

  // Utility function to get the generator script path
  var ib_getGeneratorScriptPath = function() {
    var scripts = document.getElementsByTagName('script');
    for(var i = 0; i < scripts.length; i++)
    {
      var src = scripts[i].src;

      var idx = src.indexOf('generator' + '.js');
      if(idx > -1)
      {
        return src.substring(0, idx);
      }
    }
  };

  /**
   * Constants
   */
  var BLANK_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',

      TRACKING  = '?utm_source=generator&utm_medium=template&utm_campaign=invoicebus_templates',
      SAVE_URL  = 'https://invoicebus.com/saveinvoice/',
      MIN       = '',

      // Get the path of the generator script
      PATH      = ib_getGeneratorScriptPath(),
      // jQuery and Bootstrap paths
      JQUERY    = PATH + 'jquery.min.js',
      BOOTSTRAP = PATH + 'bootstrap.min.js';

  /**
   * Show error bar function
   */
  var ib_showErrorBar = function() {
    var el = document.createElement('div');
    el.innerHTML = "Oops sorry, the template cannot be rendered. Mind checking your internet connection?";
    el.setAttribute('style', 'position:fixed; top:0px; left:0px; background:#f75520; color:white; text-align:center; width:100%; padding:10px 0; font:normal 14px/1.4em "Open Sans", Arial, Sans-serif; border-bottom:3px solid #fff; box-shadow:0px 0px 10px 2px #aaa;');
    document.body.appendChild(el);

    return false;
  };

  /**
   * Script loading functions
   */
  var ib_timeout = 100, // In milliseconds
      ib_total_timeout = 0,
      max_timeout = 5000;

  var ib_loadJavaScript = function(file) {
    var js = document.createElement('script');
    js.async = true;
    js.type = 'text/javascript';
    js.src = file;
    document.body.appendChild(js);
  };

  var ib_checkJQuery = function(callback) {
    if(ib_total_timeout > max_timeout)
      return ib_showErrorBar();

    if (window.jQuery)
    {
      ib_loadJavaScript(BOOTSTRAP);
      ib_checkBootstrap(callback);
    }
    else
      setTimeout(function() { ib_checkJQuery(callback); }, ib_timeout);
    
    ib_total_timeout += ib_timeout;
  };

  var ib_checkBootstrap = function(callback) {
    if(ib_total_timeout > max_timeout)
      return ib_showErrorBar();

    if(jQuery.fn.tooltip)
      callback(jQuery);
    else
      setTimeout(function() { ib_checkBootstrap(callback); }, ib_timeout);

    ib_total_timeout += ib_timeout;
  };

  var ib_lazyLoadCss = function() {
    $('link[data-href]').each(function(idx, val) {
      $(val).attr('href', $(val).data('href'));
    });
  };

  /**
   * Main init function
   */
  var ib_initGenerator = function() {
    $(function() {

      // First strip all input elements
      ib_stripForbiddenTags();
      
      // Load bootstrap components
      ib_loadBootstrapDatepicker();
      ib_loadBootstrapTypeahead();

      // Init the invoice dependencies
      ib_initCurrencies();
      ib_initInvoiceData();
      ib_initDates();

      // Init the invoice functionality
      ib_initTemplate();

      // Init bootstrap components
      ib_initDatepickers();
      ib_initTypeahead();

      // Init the items grid
      ib_initItemsTable();

      // Init the logo functionality
      ib_initLogoTag();
      ib_initLogoUpload();

      // Init the main styles and actions
      ib_initStylesAndActions();

      // Add field listeners
      ib_addFieldListeners();

      // Init tooltip at the end when everything is in its place
      ib_initBootstrapTooltip();

      // Init the promo tools
      ib_initPromo();

      ib_lazyLoadCss();

      checkIfCssLoaded();
      
    });
  };

  /**
   * Utility functions
   */
  var checkIfCssLoaded = function() {
    var check_css = setInterval(function() {
      for(var i = 0; i < document.styleSheets.length; i++) {
        if(document.styleSheets[i].href.indexOf('generator' + MIN + '.css') != -1)
        {
          // When the main generator stylesheet is loaded show the html and body elements
          $('html').removeAttr('style');
          $('body').removeAttr('style');

          clearInterval(check_css);

          // For internal Invoicebus usage
          window.status = 'finished';
          break;
        }
      }
    }, 10);
  };

  var ALLOWED_TAGS =
  [
    'a',
    'b',
    'body',
    'br',
    'div',
    'em',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hr',
    'html',
    'i',
    'img',
    'label',
    'li',
    'link',
    'meta',
    'ol',
    'p',
    'pre',
    'section',
    'script', // Allow for debugging, otherwise comment it
    'span',
    'strong',
    'style',
    'sub',
    'sup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'title',
    'tr',
    'ul'
  ];

  var ALLOWED_ATTR =
  [
    'cellpadding',
    'cellspacing',
    'charset',
    'class',
    'colspan',
    'content',
    'data-hide-on-quote',
    'data-href',
    'data-iterate',
    'data-logo',
    'dir',
    'height',
    'href',
    'http-equiv',
    'id',
    'lang',
    'name',
    'rel',
    'rowspan',
    'src',
    'style',
    'title',
    'type',
    'width'
  ];

  var ib_stripForbiddenTags = function() {
    // Clear the html of all forbidden tags
    $(document).find(':not(' + ALLOWED_TAGS.join(',') + ')').remove();

    // Clear the html of all forbidden attributes
    $('*').each(function() {
      for(var i = 0; i < this.attributes.length; i++)
        if(ALLOWED_ATTR.indexOf(this.attributes[i].name) == -1)
          this.removeAttribute(this.attributes[i].name);
    });

    // Remove href="javascript:..." attribute on <a> tags
    $(document).find('a').each(function() {
      if($(this).attr('href').indexOf('javascript') === 0) $(this).removeAttr('href');
    });
  };
  
  var ib_isIE = function () {
    // Detect if the browser is IE
    var ua = navigator.userAgent;
    return ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1 || ua.indexOf('Edge/') > -1;
  };

  var ib_isSafari = function () {
    // Detect if the browser is Safari
    var ua = navigator.userAgent;
    return ua.indexOf('Safari/') > -1 && !(ua.indexOf('Chrome/') > -1 || ua.indexOf('OPR/') > -1);
  };

  var ib_fixNewlines = function(text) {
    if(text)
      return text
              .replace(/<div>/gi, '<br />')
              .replace(/<\/div>/gi, '')
              .replace(/<\/p>(\r*|\n*)<p>/gi, '<br />')
              .replace(/<(p|\/p)>/gi, '')
              .replace(/<br\s*(\/|\s*)>/gi, '\n');

    return text;
  };

  var ib_stripHtml = function(text) {
    if(text)
      return $('<div />').html(text).text();

    return text;
  };

  var ib_initBootstrapTooltip = function() {
    // Wait a little before init the tooltip
    setTimeout(function() {
      $(document).tooltip({
        selector: '[data-tooltip="tooltip"]',
        html: true,
        container: 'body'
      });
    }, 200);
  };

  var ib_highlighted = false;

  var ib_highlightEditable = function() {
    var fields = $('[contenteditable="true"], [data-ibcl-id="issue_date"], [data-ibcl-id="due_date"]');
    if(ib_highlighted)
    {
      fields.addClass('ib_editable_outline ib_stop_animate');
      $('.ib_highlight_editable').addClass('active active_hover');
    }
    else
    {
      fields.removeClass('ib_editable_outline');
      $('.ib_highlight_editable').removeClass('active active_hover');
    }
  };

  // The implemented languages
  var ib_languages = {
    'en': {
      long_name: 'English',
      long_name_en: 'English',
      change_lang: 'Change the language to English',
      print: 'Print',
      invoice: 'Invoice',
      print_info: 'This command is also used to save<br/>the invoice as PDF. See FAQ for more info.',
      highlight: 'Highlight',
      highlight_info: 'Highlight editable fields',
      open_data: 'Open',
      open_data_info: 'Open already saved data.<br>The file must be loaded from the<br>same location as template.html',
      text_format_alert: 'Please upload text file. Supported format is .txt',
      save_state: 'Save State',
      save_online: 'Save Online',
      save_info: 'Save current invoice data such as<br/>company address, logo, etc., for future re-use',
      online: 'Online',
      online_info: 'You\'ll be taken to the Invoicebus website<br>to save this invoice online',
      account_info: 'You\'ll need Invoicebus account to save this invoice',
      about: 'About',
      faq: 'FAQ',
      got_it: 'OK, got it',
      crafted_by: 'Crafted with &#x2764; by',
      invoicebus_mechanics: 'The Invoicebus Mechanics',
      add_new_row: 'Add new row',
      configure_columns: 'Configure columns',
      row_number: 'Row number',
      description: 'Item',
      quantity: 'Quantity',
      price: 'Price',
      discount: 'Discount',
      tax: 'Tax',
      line_total: 'Linetotal',
      insert_row: 'Insert row',
      remove_row: 'Remove row',
      drag_to_reorder: 'Drag to reorder',
      logo_upload_tooltip: 'Drop image or click to upload your logo (max 2MB).<br>For better print resolution use larger image,<br>as it\'s automatically scaled down.',
      drop_logo: 'Drop your logo here',
      remove_logo: 'Remove logo',
      image_format_alert: 'Please upload image file. Supported formats are .png, .jpg ang .gif',
      image_too_big_alert: 'File too big, maximum size is 2MB',
      currency_left: 'Show currency on left',
      currency_right: 'Show currency on right',
      company_name_tooltip: 'Enter your company name',
      company_address_tooltip: 'Enter company\'s address',
      company_city_zip_state_tooltip: 'Enter company\'s zip, city and country',
      company_phone_fax_tooltip: 'Enter company\'s contact phones',
      company_email_web_tooltip: 'Enter company\'s web and email address',
      payment_info1_tooltip: 'Enter your payment details',
      payment_info2_tooltip: 'Enter other payment details',
      payment_info3_tooltip: 'Enter other payment details',
      payment_info4_tooltip: 'Enter other payment details',
      payment_info5_tooltip: 'Enter other payment details',
      issue_date_label_tooltip: 'Enter issue date label',
      issue_date_tooltip: 'Select invoice issue date',
      net_term_label_tooltip: 'Enter net days label',
      net_term_tooltip: 'Enter invoice net days',
      due_date_label_tooltip: 'Enter invoice due date label',
      due_date_tooltip: 'Select invoice due date',
      currency_label_tooltip: 'Enter invoice currency label',
      currency_tooltip: 'Enter invoice currency',
      po_number_label_tooltip: 'Enter P.O. label',
      po_number_tooltip: 'Enter P.O. Number',
      bill_to_label_tooltip: 'Enter bill to label',
      client_name_tooltip: 'Enter client name',
      client_address_tooltip: 'Enter client address',
      client_city_zip_state_tooltip: 'Enter client city, zip, country',
      client_phone_fax_tooltip: 'Enter client pnone & fax',
      client_email_tooltip: 'Enter client email',
      client_other_tooltip: 'Enter other client info',
      invoice_title_tooltip: 'Enter invoice title',
      invoice_number_tooltip: 'Enter invoice number',
      item_row_number_label_tooltip: '',
      item_description_label_tooltip: 'Enter item header',
      item_quantity_label_tooltip: 'Enter quantity header',
      item_price_label_tooltip: 'Enter price header',
      item_discount_label_tooltip: 'Enter discount header',
      item_tax_label_tooltip: 'Enter tax header',
      item_line_total_label_tooltip: 'Enter line total header',
      item_row_number_tooltip: '',
      item_description_tooltip: 'Enter item description',
      item_quantity_tooltip: 'Enter quantity',
      item_price_tooltip: 'Enter price',
      item_discount_tooltip: 'Enter discount',
      item_tax_tooltip: 'Enter tax',
      item_line_total_tooltip: '',
      amount_subtotal_label_tooltip: 'Enter subtotal label',
      amount_subtotal_tooltip: '',
      tax_name_tooltip: 'Enter tax label',
      tax_value_tooltip: '',
      amount_total_label_tooltip: 'Enter total label',
      amount_total_tooltip: '',
      amount_paid_label_tooltip: 'Enter amount paid label',
      amount_paid_tooltip: 'Enter amount paid',
      amount_due_label_tooltip: 'Enter amount due label',
      amount_due_tooltip: '',
      terms_label_tooltip: 'Enter terms and notes label',
      terms_tooltip: 'Enter invoice terms and notes'
    },
    'de': {
      long_name: 'Deutsch',
      long_name_en: 'German',
      change_lang: 'Ã„ndern sie die sprache auf Deutsch',
      print: 'Drucken',
      invoice: 'Rechnung',
      print_info: 'Dieser befehl wird auch zu speichern<br/>die rechnung als PDF verwendet. Siehe FAQ fÃ¼r weitere informationen.',
      highlight: 'Markieren',
      highlight_info: 'Markieren sie editierbaren felder',
      open_data: 'Ã–ffnen',
      open_data_info: 'Ã–ffnen sie bereits gespeicherte daten.<br>Die datei muss von demselben speicherort<br>wie template.html geladen werden',
      text_format_alert: 'Bitte laden sie die textdatei hoch. Das unterstÃ¼tzte format ist .txt',
      save_state: 'Sicherer Staat',
      save_online: 'Speichern Online',
      save_info: 'Speichern des aktuellen rechnungsdaten wie<br/>firmenadresse, logo usw. FÃ¼r zukÃ¼nftige nutzung',
      online: 'Online',
      online_info: 'Sie werden auf Invoicebus website<br>genommen werden, um diese rechnung online zu speichern',
      account_info: 'Sie mÃ¼ssen Invoicebus konto diese rechnung zu sparen',
      about: 'Ãœber',
      faq: 'FAQ',
      got_it: 'OK, habe es',
      crafted_by: 'Mit &#x2764; hergestellt von',
      invoicebus_mechanics: 'Die Invoicebus Mechanik',
      add_new_row: 'In neue zeile',
      configure_columns: 'Spalten konfigurieren',
      row_number: 'Zeilennummer',
      description: 'Artikel',
      quantity: 'Menge',
      price: 'Preis',
      discount: 'Rabatt',
      tax: 'Steuer',
      line_total: 'Gesamt',
      insert_row: 'Zeile einfÃ¼gen',
      remove_row: 'Entfernen reihe',
      drag_to_reorder: 'Ziehen zum neuanordnen',
      logo_upload_tooltip: 'Drop-bild oder klicken sie ihr logo (max 2 MB) hochladen.<br>FÃ¼r eine bessere druckauflÃ¶sung grÃ¶ÃŸeres bild zu verwenden,<br>wie es automatisch verkleinert wird.',
      drop_logo: 'Lassen sie ihr logo hier',
      remove_logo: 'Logo entfernen',
      image_format_alert: 'Bitte laden sie die bilddatei hoch. UnterstÃ¼tzte formate sind .png, .jpg und .gif',
      image_too_big_alert: 'Datei zu groÃŸ, maximale grÃ¶ÃŸe 2mb',
      currency_left: 'Zeigen wÃ¤hrung auf der linken seite',
      currency_right: 'Zeigen wÃ¤hrung auf der rechten seite',
      company_name_tooltip: 'Geben sie den namen ihres unternehmens',
      company_address_tooltip: 'Geben sie firmenadresse',
      company_city_zip_state_tooltip: 'Geben sie unternehmens zip, stadt und land',
      company_phone_fax_tooltip: 'Geben sie unternehmens vertrag handys',
      company_email_web_tooltip: 'Geben sie unternehmens web-adresse und e-mail-adresse',
      payment_info1_tooltip: 'Geben sie ihre zahlungsdaten',
      payment_info2_tooltip: 'Geben sie eine andere zahlungsdetails',
      payment_info3_tooltip: 'Geben sie eine andere zahlungsdetails',
      payment_info4_tooltip: 'Geben sie eine andere zahlungsdetails',
      payment_info5_tooltip: 'Geben sie eine andere zahlungsdetails',
      issue_date_label_tooltip: 'Geben sie ausgabetag label',
      issue_date_tooltip: 'WÃ¤hlen sie rechnungs ausgabetag',
      net_term_label_tooltip: 'Geben sie net tage label',
      net_term_tooltip: 'Geben sie rechnung netto tage',
      due_date_label_tooltip: 'Geben sie rechnung fÃ¤lligkeit etikett',
      due_date_tooltip: 'WÃ¤hlen sie rechnungsfÃ¤lligkeitsdatum',
      currency_label_tooltip: 'Geben sie rechnungswÃ¤hrung etikett',
      currency_tooltip: 'Geben sie rechnungswÃ¤hrung',
      po_number_label_tooltip: 'Geben sie P.O. etikette',
      po_number_tooltip: 'Geben sie P.O. nummer',
      bill_to_label_tooltip: 'Geben sie rechnung zu beschriften',
      client_name_tooltip: 'Geben sie client-namen',
      client_address_tooltip: 'Geben sie client-adresse',
      client_city_zip_state_tooltip: 'Geben sie client ort, plz, land',
      client_phone_fax_tooltip: 'Geben sie client-telefon und fax',
      client_email_tooltip: 'Geben sie client-e-mail',
      client_other_tooltip: 'Geben sie anderen client-info',
      invoice_title_tooltip: 'Geben sie rechnung titel',
      invoice_number_tooltip: 'Geben sie die rechnungsnummer',
      item_row_number_label_tooltip: '',
      item_description_label_tooltip: 'Geben sie artikel kopf',
      item_quantity_label_tooltip: 'Geben sie die menge kopf',
      item_price_label_tooltip: 'Geben sie preiskopf',
      item_discount_label_tooltip: 'Geben sie rabatt kopf',
      item_tax_label_tooltip: 'Geben sie faxkopf',
      item_line_total_label_tooltip: 'Geben sie zeilensumme kopf',
      item_row_number_tooltip: '',
      item_description_tooltip: 'Geben sie artikelbeschreibung',
      item_quantity_tooltip: 'Geben sie die menge',
      item_price_tooltip: 'Geben sie preis',
      item_discount_tooltip: 'Geben sie rabatt',
      item_tax_tooltip: 'Geben sie den steuer',
      item_line_total_tooltip: '',
      amount_subtotal_label_tooltip: 'Geben sie wert ihrer label',
      amount_subtotal_tooltip: '',
      tax_name_tooltip: 'Geben sie steuerbanderole',
      tax_value_tooltip: '',
      amount_total_label_tooltip: 'Geben sie die gesamt label',
      amount_total_tooltip: '',
      amount_paid_label_tooltip: 'Geben sie den betrag bezahlt label',
      amount_paid_tooltip: 'Geben sie den betrag bezahlt',
      amount_due_label_tooltip: 'Geben sie den betrag aufgrund label',
      amount_due_tooltip: '',
      terms_label_tooltip: 'Geben sie begriffe und hinweise label',
      terms_tooltip: 'Geben sie rechnungskonditionen und notizen'
    },
    'es': {
      long_name: 'EspaÃ±ol',
      long_name_en: 'Spanish',
      change_lang: 'Cambiar el idioma a EspaÃ±ol',
      print: 'ImpresiÃ³n',
      invoice: 'Factura',
      print_info: 'Este comando tambien se utiliza para guardar<br/>la factura en PDF. Ve FAQ para mas informacion.',
      highlight: 'Destaca',
      highlight_info: 'Destaca los campos modificables',
      open_data: 'Abierto',
      open_data_info: 'Abrir datos ya guardados.<br>El archivo debe ser cargado desde la<br>misma ubicaciÃ³n que template.html',
      text_format_alert: 'Por favor, sube archivo de texto. Formato soportado es .txt',
      save_state: 'Guardar Estado',
      save_online: 'Guardar Online',
      save_info: 'Guarda los datos de la factura actuales como<br/>direccion de la empresa, logotipo, etc., por una reutilizacion futura',
      online: 'Online',
      online_info: 'Seras llevado a la pagina Invoicebus web<br>para guardar esta factura online',
      account_info: 'Necesitas una cuenta Invoicebus para guardar esta factura',
      about: 'Sobre',
      faq: 'FAQ',
      got_it: 'OK, entendido',
      crafted_by: 'Creado con &#x2764; de',
      invoicebus_mechanics: 'The Invoicebus Mechanics',
      add_new_row: 'Anade nueva fila',
      configure_columns: 'Configura columnas',
      row_number: 'Numero de fila',
      description: 'ArtÃ­culo',
      quantity: 'Cantidad',
      price: 'Precio',
      discount: 'Descuento',
      tax: 'Impuestas',
      line_total: 'Total',
      insert_row: 'Introduce fila',
      remove_row: 'Elimina fila',
      drag_to_reorder: 'Arrastre para reordenar',
      logo_upload_tooltip: 'Caiga imagen o haga clic para cargar tu logotipo (max 2MB).<br>Para obtener la mejor resolucion de impresion utiliza la imagen grande,<br>como se reducen de forma automatica.',
      drop_logo: 'Arrastre tu logotipo aqui',
      remove_logo: 'Elimina tu logotipo',
      image_format_alert: 'Por favor, cargar el archivo de imagen. Los formatos soportados son .png, .jpg .gif ang',
      image_too_big_alert: 'El archivo es demasiado grande, el tamaÃ±o mÃ¡ximo es de 2MB',
      currency_left: 'Mostra moneda a la izquierda',
      currency_right: 'Mostra moneda a la derecha',
      company_name_tooltip: 'Rellena con el nombre de la empresa',
      company_address_tooltip: 'Rellena con la direccion de la empresa',
      company_city_zip_state_tooltip: 'Rellena con el codigo postal, la ciudad y el pais de la empresa',
      company_phone_fax_tooltip: 'Rellena con el telefono de contacto de la empresa',
      company_email_web_tooltip: 'Rellena con el e-mail y la pagina web de la empresa',
      payment_info1_tooltip: 'Rellena con tus detalles de pago',
      payment_info2_tooltip: 'Rellena con tus detalles de pago',
      payment_info3_tooltip: 'Rellena con tus detalles de pago',
      payment_info4_tooltip: 'Rellena con tus detalles de pago',
      payment_info5_tooltip: 'Rellena con tus detalles de pago',
      issue_date_label_tooltip: 'Introduce la fecha de emision',
      issue_date_tooltip: 'Selecciona fecha de emision de la factura',
      net_term_label_tooltip: 'Introduce la etiqueta con el dia net',
      net_term_tooltip: 'Introduce los dias net de la fecha de la factura',
      due_date_label_tooltip: 'Introduce la etiqueta de la fecha de vencimiento de la factura',
      due_date_tooltip: 'Selecciona la fecha de vencimiento de la factura',
      currency_label_tooltip: 'Introduce la etiqueta moneda de facturacion',
      currency_tooltip: 'Introduce la moneda de factura',
      po_number_label_tooltip: 'Introduce P.O. numero',
      po_number_tooltip: 'Introduce P.O. numero',
      bill_to_label_tooltip: 'Introduce una cuenta para etiquetar',
      client_name_tooltip: 'Introduce el nombre del cliente',
      client_address_tooltip: 'Introduce la direccion del cliente',
      client_city_zip_state_tooltip: 'Introduce el codigo postas, la ciudad y el pais del cliente',
      client_phone_fax_tooltip: 'Introduce el telefono y el fax del cliente',
      client_email_tooltip: 'Introduce el e-mail del cliente',
      client_other_tooltip: 'Introduce otras informaciones del cliente',
      invoice_title_tooltip: 'Introduce el nombre de la factura',
      invoice_number_tooltip: 'Introduce el numero de la factura',
      item_row_number_label_tooltip: '',
      item_description_label_tooltip: 'Introduce el encabezado de la seccion',
      item_quantity_label_tooltip: 'Introduce el encabezado de la cantidad',
      item_price_label_tooltip: 'Introduce el encabezado del precio',
      item_discount_label_tooltip: 'Introduce el encabezado del descuento',
      item_tax_label_tooltip: 'Introduce el encabezado de las impuestas',
      item_line_total_label_tooltip: 'Introduce el encabezado de los totales de linea',
      item_row_number_tooltip: '',
      item_description_tooltip: 'Introduce descripcion de la seccion',
      item_quantity_tooltip: 'Introduce cantidad',
      item_price_tooltip: 'Introduce precio',
      item_discount_tooltip: 'Introduce descuento',
      item_tax_tooltip: 'Introduce impuestas',
      item_line_total_tooltip: '',
      amount_subtotal_label_tooltip: 'Introduce etiqueta de subtotales',
      amount_subtotal_tooltip: '',
      tax_name_tooltip: 'Introduce etiqueta de impuestos',
      tax_value_tooltip: '',
      amount_total_label_tooltip: 'Introduce etiqueta de totales',
      amount_total_tooltip: '',
      amount_paid_label_tooltip: 'Introduce etiqueta de cantidad pagada',
      amount_paid_tooltip: 'Introduce cantidad pagada',
      amount_due_label_tooltip: 'Introduce etiqueta de cantidad debida',
      amount_due_tooltip: '',
      terms_label_tooltip: 'Introduce etiqueta de condiciones y notas',
      terms_tooltip: 'Introduce condiciones y notas de la factura'
    },
    'it': {
      long_name: 'Italiano',
      long_name_en: 'Italian',
      change_lang: 'Cambiare la lingua di Italiano',
      print: 'Stampare',
      invoice: 'Fattura',
      print_info: 'Questo comando e anche usato per salvare<br/>la fattura come PDF. Vedi FAQ per piu informazioni.',
      highlight: 'Evidenzia',
      highlight_info: 'Seleziona i campi modificabili',
      open_data: 'Aperto',
      open_data_info: 'Aprire i dati giÃ  salvati.<br>Il file deve essere caricato dalla<br>stessa posizione come template.html',
      text_format_alert: 'Si prega di caricare file di testo. formato supportato Ã¨ .txt',
      save_state: 'Salva Stato Della',
      save_online: 'Salva Online',
      save_info: 'Salva i dati di fattura attuali come<br/>indirizzo dell\'azienda, logo, ecc., per un riutilizzo futuro',
      online: 'Online',
      online_info: 'Sarai portato alla pagina web di Invoicebus<br>per salvare questa fattura online',
      account_info: 'Hai bisogno di un account Invoicebus per salvare questa fattura',
      about: 'Attorno',
      faq: 'FAQ',
      got_it: 'OK, capito',
      crafted_by: 'Realizzato con &#x2764; di',
      invoicebus_mechanics: 'The Invoicebus Mechanics',
      add_new_row: 'Aggiungi nova riga',
      configure_columns: 'Configure colonne',
      row_number: 'Numero di riga',
      description: 'Articolo',
      quantity: 'QuantitÃ ',
      price: 'Prezzo',
      discount: 'Sconto',
      tax: 'Tasse',
      line_total: 'Totale',
      insert_row: 'Inserisci riga',
      remove_row: 'Rimuovi riga',
      drag_to_reorder: 'Trascinare per riordinare',
      logo_upload_tooltip: 'Rilascia immagine o clicca per caricare il tuo logo (max 2MB).<br>Per migliore risoluzione di stampa usa immagine grande,<br>com\'e scalato automaticamente.',
      drop_logo: 'Rilascia il tuo logo qui',
      remove_logo: 'Rimuovere logo',
      image_format_alert: 'Si prega di caricare file di immagine. I formati supportati sono .png, .jpg ang .gif',
      image_too_big_alert: 'File troppo grande, la dimensione massima Ã¨ di 2MB',
      currency_left: 'Mostra la valuta alla sinistra',
      currency_right: 'Mostra la valuta alla destra',
      company_name_tooltip: 'Inserisci il nome della tua azienda',
      company_address_tooltip: 'Inserisci l\'indirizzo della tua azienda',
      company_city_zip_state_tooltip: 'Inserisci il cap, la citta e il Paese dove si trova l\'azienda',
      company_phone_fax_tooltip: 'Inserisci i telefoni di contatto dell\'azienda',
      company_email_web_tooltip: 'Inserisci l\'e-mail e la pagina web dell\'azienda',
      payment_info1_tooltip: 'Inserisci i tuoi dettagli di pagamento',
      payment_info2_tooltip: 'Inserisci i tuoi dettagli di pagamento',
      payment_info3_tooltip: 'Inserisci i tuoi dettagli di pagamento',
      payment_info4_tooltip: 'Inserisci i tuoi dettagli di pagamento',
      payment_info5_tooltip: 'Inserisci i tuoi dettagli di pagamento',
      issue_date_label_tooltip: 'Inserisci la data di emissione',
      issue_date_tooltip: 'Seleziona la datta di emissione della fattura',
      net_term_label_tooltip: 'Inserisci l\'etichetta con i giorni net (da)',
      net_term_tooltip: 'Inserisci i giorni dalla data della fattura',
      due_date_label_tooltip: 'Inserisci l\'etichetta sulla data di scadenza della fattura',
      due_date_tooltip: 'Seleziona data di scadenza della fattura',
      currency_label_tooltip: 'Inserisci l\'etichetta della valuta della fattura',
      currency_tooltip: 'Inserisci la valuta della fattura',
      po_number_label_tooltip: 'Inserisci P.O. etichetta',
      po_number_tooltip: 'Inserisci P.O. Numero',
      bill_to_label_tooltip: 'Inserisci bolletta da etichettare',
      client_name_tooltip: 'Inserisci il nome del cliente',
      client_address_tooltip: 'Inserisci l\'indirizzo del cliente',
      client_city_zip_state_tooltip: 'Inserisci il cap, la citta e il Paese del cliente',
      client_phone_fax_tooltip: 'Inserisci il telefono e il fax del cliente',
      client_email_tooltip: 'Inserisci l\'e-mail del cliente',
      client_other_tooltip: 'Inserisci altre informazioni del cliente',
      invoice_title_tooltip: 'Inserisci il nome della fattura',
      invoice_number_tooltip: 'Inserisci il numero della fattura',
      item_row_number_label_tooltip: '',
      item_description_label_tooltip: 'Inserisci l\'intestazione della voce',
      item_quantity_label_tooltip: 'Inserisci intestazione della quantita',
      item_price_label_tooltip: 'Inserisci intestazione del prezzo',
      item_discount_label_tooltip: 'Inserisci intestazione dello sconto',
      item_tax_label_tooltip: 'Inserisci intestazione delle tasse',
      item_line_total_label_tooltip: 'Inserisci intestazione del totale di linea',
      item_row_number_tooltip: '',
      item_description_tooltip: 'Inserisci descrizione della voce',
      item_quantity_tooltip: 'Inserisci quantita',
      item_price_tooltip: 'Inserisci prezzo',
      item_discount_tooltip: 'Inserisci sconto',
      item_tax_tooltip: 'Inserisci tasse',
      item_line_total_tooltip: '',
      amount_subtotal_label_tooltip: 'Inserisci etichetta di subtotali',
      amount_subtotal_tooltip: '',
      tax_name_tooltip: 'Inserisci etichetta di tasse',
      tax_value_tooltip: '',
      amount_total_label_tooltip: 'Inserisci etichetta di totali',
      amount_total_tooltip: '',
      amount_paid_label_tooltip: 'Inserisci etichetta dell\'importo pagato',
      amount_paid_tooltip: 'Inserisci importo pagato',
      amount_due_label_tooltip: 'Inserisci etichetta dell\'importo dovuto',
      amount_due_tooltip: '',
      terms_label_tooltip: 'Inserisci etichetta di condizioni e note',
      terms_tooltip: 'Inserisci condizioni e note della fattura'
    },
    'fr': {
      long_name: 'FranÃ§ais',
      long_name_en: 'French',
      change_lang: 'Changer la langue FranÃ§aise',
      print: 'Imprimer',
      invoice: 'Facture',
      print_info: 'Cette commande est aussi utilisÃ©e pour sauvegarder<br/>la facture sous forme PDF. Consultez FAQ pour plus d\'infos.',
      highlight: 'Marque',
      highlight_info: 'Mettre en relief les champs modifiables',
      open_data: 'Ouvrir',
      open_data_info: 'Ouvrez les donnÃ©es dÃ©jÃ  enregistrÃ©es.<br>Le fichier doit Ãªtre chargÃ© Ã  partir<br>du mÃªme emplacement que template.html',
      text_format_alert: 'S\'il vous plaÃ®t tÃ©lÃ©charger le fichier texte. Format pris en charge est .txt',
      save_state: 'Enregistrer L\'Ã©tat',
      save_online: 'Enregistrer en Ligne',
      save_info: 'Enregistrer les donnÃ©es actuelles de la facture telles que<br/>adresse de l\'entreprise, logo, etc., pour un futur rÃ©emploi',
      online: 'En ligne',
      online_info: 'Vous serez rÃ©orientÃ© vers le site de Invoicebus website<br>sauvegarder cette facture en ligne',
      account_info: 'Vous avez besoin d\'un compte Invoicebus pour sauvegarder cette facture',
      about: 'Pour',
      faq: 'FAQ',
      got_it: 'OK, compris',
      crafted_by: 'ConÃ§u avec &#x2764; par',
      invoicebus_mechanics: 'La MÃ©canique Invoicebus',
      add_new_row: 'Ajouter ligne',
      configure_columns: 'Configurer colonnes',
      row_number: 'NumÃ©ro de ligne',
      description: 'Article',
      quantity: 'QuantitÃ©',
      price: 'Prix',
      discount: 'RÃ©duction',
      tax: 'Taxe',
      line_total: 'Total',
      insert_row: 'InsÃ©rer ligne',
      remove_row: 'Supprimer ligne',
      drag_to_reorder: 'Tirer pour rÃ©organiser',
      logo_upload_tooltip: 'Laisser tomber l\'image ou cliquer pour tÃ©lÃ©charger votre logo (max 2MB).<br>Pour une meilleure rÃ©solution d\'impression utiliser un image plus large,<br>comme c\'est automatiquement rÃ©duit.',
      drop_logo: 'Laisser tomber votre logo ici',
      remove_logo: 'Supprimer logo',
      image_format_alert: 'S\'il vous plaÃ®t tÃ©lÃ©charger le fichier d\'image. Les formats supportÃ©s sont .png, .jpg ang .gif',
      image_too_big_alert: 'Fichier trop grand, la taille maximale est de 2MB',
      currency_left: 'Montrer la monnaie Ã  gauche',
      currency_right: 'Montrer la monnaie Ã  droite',
      company_name_tooltip: 'Entrer le nom de votre entreprise',
      company_address_tooltip: 'Entrer l\'adresse de votre entreprise',
      company_city_zip_state_tooltip: 'Entrer le code postale, la ville et le pays de votre entreprise',
      company_phone_fax_tooltip: 'Entrer les numÃ©ros de tÃ©lÃ©phone de votre entreprise',
      company_email_web_tooltip: 'Entrer le site internet et le courriel de votre entreprise',
      payment_info1_tooltip: 'Entrer les dÃ©tails de votre paiement',
      payment_info2_tooltip: 'Entrer d\'autres dÃ©tails de paiement',
      payment_info3_tooltip: 'Entrer d\'autres dÃ©tails de paiement',
      payment_info4_tooltip: 'Entrer d\'autres dÃ©tails de paiement',
      payment_info5_tooltip: 'Entrer d\'autres dÃ©tails de paiement',
      issue_date_label_tooltip: 'Entrer l\'Ã©tiquette de la date de dÃ©livrance',
      issue_date_tooltip: 'SÃ©lectionner la date de dÃ©livrance de la facture',
      net_term_label_tooltip: 'Entrer l\'Ã©tiquette des jours nets',
      net_term_tooltip: 'Entrer la facture des jours nets',
      due_date_label_tooltip: 'Entrer l\'Ã©tiquette de la date limite de la facture',
      due_date_tooltip: 'SÃ©lectionner la date limite de la facture',
      currency_label_tooltip: 'Entrer l\'Ã©tiquette de la monnaie de la facture',
      currency_tooltip: 'Entrer la monnaie de la facture',
      po_number_label_tooltip: 'Entrer l\'Ã©tiquette de l\'ordre d\'achat',
      po_number_tooltip: 'Entrer le nombre de l\'ordre d\'achat',
      bill_to_label_tooltip: 'Enter l\'Ã©tiquette de la facture',
      client_name_tooltip: 'Entrer le nom du client ',
      client_address_tooltip: 'Enter l\'adresse du client ',
      client_city_zip_state_tooltip: 'Enter la ville,le code postal et le pays du client',
      client_phone_fax_tooltip: 'Entrer le numÃ©ro de tÃ©lÃ©phone et de fax du client',
      client_email_tooltip: 'Entrer le courrier du client',
      client_other_tooltip: 'Entrer d\'autres infos sur le client info',
      invoice_title_tooltip: 'Entrer le titre de facture',
      invoice_number_tooltip: 'Entrer le numÃ©ro de facture',
      item_row_number_label_tooltip: '',
      item_description_label_tooltip: 'Entrer l\'en-tÃªte de l\'article',
      item_quantity_label_tooltip: 'Entrer l\'en-tÃªte de la quantitÃ©',
      item_price_label_tooltip: 'Entrerl\'en-tÃªte du prix',
      item_discount_label_tooltip: 'Entrer l\'en-tÃªte de la rÃ©duction',
      item_tax_label_tooltip: 'Entrer l\'en-tÃªte de la taxe',
      item_line_total_label_tooltip: 'Entrer l\'en-tÃªte du total de la ligne',
      item_row_number_tooltip: '',
      item_description_tooltip: 'Entrer la description de l\'article',
      item_quantity_tooltip: 'Entrer la quantitÃ©',
      item_price_tooltip: 'Entrer le  prix',
      item_discount_tooltip: 'Entrer la rÃ©duction',
      item_tax_tooltip: 'Entrer la taxe',
      item_line_total_tooltip: '',
      amount_subtotal_label_tooltip: 'Entrer l\'Ã©tiquette du total partiel',
      amount_subtotal_tooltip: '',
      tax_name_tooltip: 'Entrer l\'Ã©tiquette de la taxe',
      tax_value_tooltip: '',
      amount_total_label_tooltip: 'Entrer l\'Ã©tiquette du total ',
      amount_total_tooltip: '',
      amount_paid_label_tooltip: 'Entrer l\'Ã©tiquette du montant payÃ©',
      amount_paid_tooltip: 'Entrer le montant payÃ©',
      amount_due_label_tooltip: 'Entrer l\'Ã©tiquette du montant dÃ»',
      amount_due_tooltip: '',
      terms_label_tooltip: 'Entrer l\'Ã©tiquette des termes et des notes ',
      terms_tooltip: 'Entrer les termes et les notes de la facture'
    }
  };

  var ib_generateLanguageSelect = function () {
    var lang_select = '';

    // language select short names
    lang_select += '<select class="ib_pull_right ib_lang_select">';

    // add default option that reverts to user data
    lang_select += '<option value="" selected="selected" title="These are the data and language saved in your \'data.txt\' file">Default</option>';
    lang_select += '<option value="" disabled="disabled">------------</option>';

    for(var key in ib_languages) {
      lang_select += '<option value="' + key + '" title="' + ib_languages[key].change_lang + '">' + ib_languages[key].long_name + '</option>';
    }

    lang_select += '</select>';

    return lang_select;
  };

  var ib_initStylesAndActions = function() {
    $('head')
      .prepend('<link rel="stylesheet" href="' + PATH + 'generator' + MIN + '.css" media="all" />');

    $(document.body)
      .before($('<ib-span class="ib_invoice_commands_wrap">' +
                  '<ib-span class="ib_invoice_commands">' +
                    '<ib-span id="ib-print-btn" class="ib_default_button" data-tooltip="tooltip" data-placement="bottom" title="' + ib_languages[ib_lang].print_info + '"><i class="fa fa-print"></i><span class="ib_hide_xsmall"> ' + ib_languages[ib_lang].print + '</span></ib-span>' +
                    '<ib-span class="ib_default_button ib_highlight_editable" data-tooltip="tooltip" data-placement="bottom" title="' + ib_languages[ib_lang].highlight_info + '"><i class="fa fa-edit"></i><span class="ib_hide_xsmall"> ' + ib_languages[ib_lang].highlight + '</span></ib-span>' +
                    '<ib-span class="ib_default_button ib_open_data" data-tooltip="tooltip" data-placement="bottom" title="' + ib_languages[ib_lang].open_data_info + '"><i class="fa fa-fw"></i><span class="ib_hide_xsmall"> ' + ib_languages[ib_lang].open_data + '</span><input type="file" accept=".txt,text/plain" class="ib_load_saved_data"></ib-span>' +
                    '<ib-span id="ib-save-data-btn" class="ib_default_button" data-toggle="modal" data-target="#ib_saveCurrentStateModal" data-tooltip="tooltip" data-placement="bottom" title="' + ib_languages[ib_lang].save_info + '"><i class="fa fa-bolt"></i><span class="ib_hide_xsmall"> ' + ib_languages[ib_lang].save_state + '</span></ib-span>' +
                    '<iframe id="ib_download_data_frame" class="ib_force_hide"></iframe>' +
                    '<ib-span class="ib_default_button ib_save_online" data-tooltip="tooltip" data-placement="bottom" title="' + ib_languages[ib_lang].online_info + '"><i class="fa fa-cloud-upload"></i><span class="ib_hide_xsmall"> ' + ib_languages[ib_lang].save_online + '</span></ib-span>' +
                    '<ib-span class="ib_save_info" data-tooltip="tooltip" data-placement="right" title="' + ib_languages[ib_lang].account_info + '"><i class="fa fa-question-circle"></i></ib-span>' +

                    '<ib-span class="ib_clear_xsmall"></ib-span>' +

                    '<ib-span class="ib_gray_link ib_how_to_link ib_pull_right" data-toggle="modal" data-target="#ib_howToModal">' + ib_languages[ib_lang].about + '</ib-span>' +
                    '<ib-span class="ib_top_separator ib_pull_right">â—</ib-span>' +
                    '<ib-span class="ib_gray_link ib_how_to_link ib_pull_right" onclick="window.open(\'https://groups.google.com/d/forum/html-invoice-generator\', \'_blank\')">' + ib_languages[ib_lang].faq + '</ib-span>' +
                    '<ib-span class="ib_top_separator ib_pull_right">â—</ib-span>' +
                    
                    ib_generateLanguageSelect() +

                  '</ib-span>' +
                '</ib-span>'))
      .after($('<ib-span class="ib_invoicebus_love">' + ib_languages[ib_lang].crafted_by + '<br><ib-span onclick="window.open(\'https://invoicebus.com/team/\', \'_blank\')">' + ib_languages[ib_lang].invoicebus_mechanics + '</ib-span></ib-span>'));

    $('#ib-print-btn').click(function() {
      ib_highlighted = false;
      ib_highlightEditable();

      window.print();
    });

    $('.ib_highlight_editable').click(function() {
      ib_highlighted = !ib_highlighted;

      ib_highlightEditable();
    });

    $('input.ib_load_saved_data').change(function(e){
      var file = $(this).prop('files')[0];
      if(file) {

        if(file.type != 'text/plain')
          alert(ib_languages[ib_lang].text_format_alert);
        else {
          var loc = window.location.href;

          if(loc.indexOf('data=') > -1)
            loc = loc.replace(/(data=)[^\&]+/, '$1' + file.name);
          else if(loc.indexOf('?') > -1)
            loc += '&data=' + file.name;
          else
            loc += '?data=' + file.name;

          if(!file.name) {
            loc = window.location.origin + window.location.pathname;
          }
          window.location = loc;
        }
      }
    });

    // Select the appropriate language
    $('.ib_lang_select').val(ib_lang_original);

    $('.ib_lang_select').change(function() {
      var lang = $(this).val();
      var loc = window.location.href;

      if(loc.indexOf('lang=') > -1)
        loc = loc.replace(/lang=.{2}/, 'lang=' + lang);
      else if(loc.indexOf('?') > -1)
        loc += '&lang=' + lang;
      else
        loc += '?lang=' + lang;

      if(!lang) {
        loc = window.location.origin + window.location.pathname;
      }

      window.location = loc;
    });

    $(document).scroll(function(e) {
      if(document.body.scrollTop === 0 && document.documentElement.scrollTop === 0)
        $('.ib_invoice_commands_wrap').removeClass('ib_commands_shadow');
      else if(!$('.ib_invoice_commands_wrap').hasClass('ib_commands_shadow'))
        $('.ib_invoice_commands_wrap').addClass('ib_commands_shadow');
    });

    $(document.body)
      .after($('<ib-span class="ib_invoicebus_fineprint">Receive online payments through your invoices at <ib-span onclick="window.open(\'https://invoicebus.com\', \'_blank\')">invoicebus.com</ib-span></ib-span>'));

    if(!JSON.parse(ib_data.invoicebus_fineprint))
      $('.ib_invoicebus_fineprint').css('visibility', 'hidden');

    $('.ib_save_online').click(ib_saveInvoice);
    
    $('[data-iterate="item"]:last').after($('<ib-span class="ib_bottom_row_commands"><ib-span class="ib_blue_link ib_add_new_row_link">' + ib_languages[ib_lang].add_new_row + '</ib-span><ib-span class="ib_blue_link ib_show_hide_columns_link">' + ib_languages[ib_lang].configure_columns + '</ib-span></ib-span>'));

    $('.ib_add_new_row_link').click(function(e) {
      ib_addRow(this, e);
    });

    $('.ib_show_hide_columns_link')
      .after($('<ib-span class="ib_show_hide_columns">' +
                  '<ib-span>' +
                    '<input type="checkbox" value="item_row_number" />' +
                    '<ib-span>' + ib_languages[ib_lang].row_number + '</ib-span>' +
                  '</ib-span>' +
                  '<ib-span>' +
                    '<input type="checkbox" value="item_description" />' +
                    '<ib-span>' + ib_languages[ib_lang].description + '</ib-span>' +
                  '</ib-span>' +
                  '<ib-span>' +
                    '<input type="checkbox" value="item_quantity" />' +
                    '<ib-span>' + ib_languages[ib_lang].quantity + '</ib-span>' +
                  '</ib-span>' +
                  '<ib-span>' +
                    '<input type="checkbox" value="item_price" />' +
                    '<ib-span>' + ib_languages[ib_lang].price + '</ib-span>' +
                  '</ib-span>' +
                  '<ib-span>' +
                    '<input type="checkbox" value="item_discount" />' +
                    '<ib-span>' + ib_languages[ib_lang].discount + '</ib-span>' +
                  '</ib-span>' +
                  '<ib-span>' +
                    '<input type="checkbox" value="item_tax" />' +
                    '<ib-span>' + ib_languages[ib_lang].tax + '</ib-span>' +
                  '</ib-span>' +
                  '<ib-span>' +
                    '<input type="checkbox" value="item_line_total" />' +
                    '<ib-span>' + ib_languages[ib_lang].line_total + '</ib-span>' +
                  '</ib-span>' +
                '</ib-span>'));

    $('.ib_show_hide_columns_link, .ib_show_hide_columns').hover(function(e) {
      $('.ib_show_hide_columns').css('display', 'block');
    }, function(e) {
      $('.ib_show_hide_columns').hide();
    });

    $('.ib_show_hide_columns > ib-span > ib-span').click(function() {
      var chk = $(this).parent().find('input:checkbox');
      chk.prop('checked', !chk.is(':checked'));
      chk.change();
    });

    $('.ib_show_hide_columns > ib-span > input:checkbox').change(function() {
      var column  = $(this).val();
      var checked = $(this).is(':checked');

      if(column == 'item_row_number') // This is special case that we need to handle because of the row commands
        $('[data-ibcl-id="' + column + '_label"], [data-ibcl-id="' + column + '"]').toggleClass('ib_hide_column', !checked);
      else
      {
        $('[data-ibcl-id="' + column + '_label"], [data-ibcl-id="' + column + '"]')
          .toggle(checked);

        $('[data-ibcl-id="' + column + '_label"], [data-ibcl-id="' + column + '"]').parent('td')
          .toggle(checked);

        if($('[data-ibcl-id="' + column + '_label"]').hasClass('ibcl_ie_contenteditable'))
          $('[data-ibcl-id="' + column + '_label"]').parent().toggle(checked);

        if($('[data-ibcl-id="' + column + '"]').hasClass('ibcl_ie_contenteditable'))
          $('[data-ibcl-id="' + column + '"]').parent().toggle(checked);

        ib_calculateTotals();
      }
    });

    // Set the initial checkboxes state
    for(var i = 0; i < ib_data.default_columns.length; i++) {
      $('input[type="checkbox"][value="' + ib_data.default_columns[i] + '"]').prop('checked', true);
    }

    $('.ib_show_hide_columns > ib-span > input:checkbox').change();

  };

  var ib_getScriptQueryVariables = function() {
    var scripts = document.getElementsByTagName('script');
    for(var i = 0; i < scripts.length; i++)
    {
      var src = scripts[i].src;

      if(src.indexOf('generator' + MIN + '.js?') > -1)
      {
        return src.substring(src.indexOf('?') + 1);
      }
    }
  };

  /**
   * Template functions
   */
  var ib_data,
      ib_data_timeout = 0;

  var ib_initInvoiceData = function() {
    ib_data = {
      '{company_logo}'          : '',
      '{company_name}'          : { default_text: 'Dino Store', tooltip: 'Enter your company name' },
      '{company_address}'       : { default_text: '227 Cobblestone Road', tooltip: 'Enter company\'s address' },
      '{company_city_zip_state}': { default_text: '30000 Bedrock, Cobblestone County', tooltip: 'Enter company\'s zip, city and country' },
      '{company_phone_fax}'     : { default_text: '+555 7 789-1234', tooltip: 'Enter company\'s contact phones' },
      '{company_email_web}'     : { default_text: 'http://dinostore.bed | hello@dinostore.bed', tooltip: 'Enter company\'s web and email address' },
      '{payment_info1}'         : { default_text: 'Payment details:', tooltip: 'Enter your payment details' },
      '{payment_info2}'         : { default_text: 'ACC:123006705', tooltip: 'Enter other payment details' },
      '{payment_info3}'         : { default_text: 'IBAN:US100000060345', tooltip: 'Enter other payment details' },
      '{payment_info4}'         : { default_text: 'SWIFT:BOA447', tooltip: 'Enter other payment details' },
      '{payment_info5}'         : { default_text: '', tooltip: 'Enter other payment details' },
      '{issue_date_label}'      : { default_text: 'Issue Date:', tooltip: 'Enter issue date label' },
      '{issue_date}'            : { default_text: '', tooltip: 'Select invoice issue date' },
      '{net_term_label}'        : { default_text: 'Net:', tooltip: 'Enter net days label' },
      '{net_term}'              : { default_text: 21, tooltip: 'Enter invoice net days' },
      '{due_date_label}'        : { default_text: 'Due Date:', tooltip: 'Enter invoice due date label' },
      '{due_date}'              : { default_text: '', tooltip: 'Select invoice due date' },
      '{currency_label}'        : { default_text: 'Currency:', tooltip: 'Enter invoice currency label' },
      '{currency}'              : { default_text: 'USD', tooltip: 'Enter invoice currency' },
      '{po_number_label}'       : { default_text: 'P.O. #', tooltip: 'Enter P.O. label' },
      '{po_number}'             : { default_text: '1/3-147', tooltip: 'Enter P.O. Number' },
      '{bill_to_label}'         : { default_text: 'Bill to:', tooltip: 'Enter bill to label' },
      '{client_name}'           : { default_text: 'Slate Rock and Gravel Company', tooltip: 'Enter client name' },
      '{client_address}'        : { default_text: '222 Rocky Way', tooltip: 'Enter client address' },
      '{client_city_zip_state}' : { default_text: '30000 Bedrock, Cobblestone County', tooltip: 'Enter client city, zip, country' },
      '{client_phone_fax}'      : { default_text: '+555 7 123-5555', tooltip: 'Enter client pnone & fax' },
      '{client_email}'          : { default_text: 'fred@slaterockgravel.bed', tooltip: 'Enter client email' },
      '{client_other}'          : { default_text: 'Attn: Fred Flintstone', tooltip: 'Enter other client info' },
      '{invoice_title}'         : { default_text: 'INVOICE', tooltip: 'Enter invoice title' },
      '{invoice_number}'        : { default_text: '#1', tooltip: 'Enter invoice number' },
      '{item_row_number_label}' : { default_text: '', tooltip: '' },
      '{item_description_label}': { default_text: 'Item', tooltip: 'Enter item header' },
      '{item_quantity_label}'   : { default_text: 'Quantity', tooltip: 'Enter quantity header' },
      '{item_price_label}'      : { default_text: 'Price', tooltip: 'Enter price header' },
      '{item_discount_label}'   : { default_text: 'Discount', tooltip: 'Enter discount header' },
      '{item_tax_label}'        : { default_text: 'Tax', tooltip: 'Enter tax header' },
      '{item_line_total_label}' : { default_text: 'Linetotal', tooltip: 'Enter line total header' },
      '{item_row_number}'       : { default_text: '', tooltip: '' },
      '{item_description}'      : { default_text: '', tooltip: 'Enter item description' },
      '{item_quantity}'         : { default_text: '', tooltip: 'Enter quantity' },
      '{item_price}'            : { default_text: '', tooltip: 'Enter price' },
      '{item_discount}'         : { default_text: '', tooltip: 'Enter discount' },
      '{item_tax}'              : { default_text: '', tooltip: 'Enter tax' },
      '{item_line_total}'       : { default_text: '', tooltip: '' },
      '{amount_subtotal_label}' : { default_text: 'Subtotal:', tooltip: 'Enter subtotal label' },
      '{amount_subtotal}'       : { default_text: '', tooltip: '' },
      '{tax_name}'              : { default_text: 'Tax:', tooltip: 'Enter tax label' },
      '{tax_value}'             : { default_text: '', tooltip: '' },
      '{amount_total_label}'    : { default_text: 'Total:', tooltip: 'Enter total label' },
      '{amount_total}'          : { default_text: '', tooltip: '' },
      '{amount_paid_label}'     : { default_text: 'Paid:', tooltip: 'Enter amount paid label' },
      '{amount_paid}'           : { default_text: '', tooltip: 'Enter amount paid' },
      '{amount_due_label}'      : { default_text: 'Amount Due:', tooltip: 'Enter amount due label' },
      '{amount_due}'            : { default_text: '', tooltip: '' },
      '{terms_label}'           : { default_text: 'Terms & Notes', tooltip: 'Enter terms and notes label' },
      '{terms}'                 : { default_text: 'Fred, thank you very much. We really appreciate your business.<br />Please send payments before the due date.', tooltip: 'Enter invoice terms and notes' },

      // Settings
      'date_format'             : 'mm/dd/yyyy', // One of 'dd/mm/yyyy', 'dd-mm-yyyy', 'dd.mm.yyyy', 'mm/dd/yyyy', 'mm-dd-yyyy', 'mm.dd.yyyy', 'yyyy mm dd', 'yyyy-mm-dd', 'yyyy.mm.dd'
      'currency_position'       : 'left', // One of 'left' or 'right'
      'show_currency'           : true,
      'number_format'           : '0,000.00', // One of '0,000.00', '0 000.00', '0000.00', '0.000,00', '0 000,00', '0000,00'
      'default_columns'         : ['item_row_number', 'item_description', 'item_quantity', 'item_price', 'item_discount', 'item_tax', 'item_line_total'],
      'default_quantity'        : '1',
      'default_price'           : '0',
      'default_discount'        : '0',
      'default_tax'             : '0',
      'default_number_rows'     : 3,
      'auto_calculate_dates'    : true,
      'load_items'              : true,
      'invoicebus_fineprint'    : true,
      'lang'                    : ib_lang,

      // Items
      'items': [
        {
          'item_description' : 'Frozen Brontosaurus Ribs',
          'item_quantity'    : '2',
          'item_price'       : '120',
          'item_discount'    : '',
          'item_tax'         : '2%'
        },
        {
          'item_description' : 'Mammoth Chops',
          'item_quantity'    : '14',
          'item_price'       : '175',
          'item_discount'    : '-10%',
          'item_tax'         : '5%'
        },
        {
          'item_description' : '',
          'item_quantity'    : '',
          'item_price'       : '',
          'item_discount'    : '',
          'item_tax'         : ''
        }
      ]
    };

    ib_loadCompanyData();
  };

  var ib_loadCompanyData = function() {
    if(ib_data_timeout > max_timeout)
      return; // Stop with loading

    if(typeof ib_invoice_data !== 'undefined')
    {
      if(typeof ib_invoice_data == 'function') // new data format
      {
        // Make it JSON same as the legacy data format
        ib_invoice_data = ib_parseData(ib_multiline.stripIndent(ib_invoice_data));
      }

      for(var key in ib_invoice_data)
      {
        if(typeof ib_data[key] === 'undefined')
        {
          ib_data[key] = { default_text: ib_invoice_data[key], tooltip: 'Enter ' + key.replace(/{(document|client)_custom_([a-zA-Z0-9_]+)}/gi, '$1 $2').replace(/_/g, ' ') };
        }

        if(typeof ib_data[key].default_text !== 'undefined')
          ib_data[key].default_text = ib_invoice_data[key];
        else
          ib_data[key] = ib_invoice_data[key];
      }

      ib_currency_position = ib_invoice_data.currency_position || 'left';
      ib_show_currency     = ib_invoice_data.show_currency     || true;
      ib_number_format     = ib_invoice_data.number_format     || '0,000.00';

      if(ib_number_format) {
        ib_decimal_separator   = ib_number_format[ib_number_format.length - 3];
        ib_thousands_separator = ib_number_format[1];
        if(!isNaN(parseInt(ib_thousands_separator)))
          ib_thousands_separator = '';
      }

      ib_currency_symbol = $(ib_currencies).map(function(idx, val) {
                                                  if(val.code == ib_data['{currency}'].default_text)
                                                    return val.symbol;
                                                })[0];

      // Set the default invoice template interface, fallback to English
      ib_lang = ib_invoice_data.lang || ib_lang_original || 'en';
      if(ib_open_data)
        ib_lang = ib_lang_original || 'en';

      var js = document.createElement('script');
      js.onload = function() {
        var ib_save_state = ib_multiline.stripIndent(ib_save_state_data);

        var modal_save_state = '<ib-div id="ib_saveCurrentStateModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="saveStateModal" aria-hidden="true">' +
                                 '<ib-div class="modal-dialog">' +
                                  '<ib-div class="modal-content">' +
                                    '<ib-div class="modal-header">' +
                                      '<ib-span type="button" class="close" data-dismiss="modal"><ib-span aria-hidden="true">&times;</ib-span></ib-span>' +
                                      '<ib-div class="modal-title" id="saveStateModal">' + ib_languages[ib_lang].save_state + '</ib-div>' +
                                    '</ib-div>' +
                                    '<ib-div class="modal-body">' +
                                      '<ib-div class="ib_how_to_container">' + ib_save_state + '</ib-div>' +
                                    '</ib-div>' +
                                  '</ib-div>' +
                                '</ib-div>' +
                              '</ib-div>';

        $(document.body)
          .after($(modal_save_state));

        $('#ib-save-data-btn').click(function() {
          if(ib_isSafari()) {
            var raw_data = ib_getCurrentState();
            $('#ib-save-current-data').attr('href', 'data:text/plain;charset=UTF-8,' + encodeURIComponent(raw_data));

            $('#ib-safari-save-as').removeClass('ib_hide');
          }
        });

        $('#ib-save-current-data').click(function() {
          var raw_data = ib_getCurrentState();

          if(ib_isIE()) {
            var iframe_doc = ib_download_data_frame.document || ib_download_data_frame.contentDocument || ib_download_data_frame.contentWindow.document;

            iframe_doc.open('text/html', 'replace');
            iframe_doc.write('<pre>' + raw_data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>'); // pre-format the data to preserve newlines when saving
            iframe_doc.close();
            
            ib_download_data_frame.focus();

            iframe_doc.execCommand('SaveAs', true, 'data.txt');
          }
          else
            $(this).attr('href', 'data:text/plain;charset=UTF-8,' + encodeURIComponent(raw_data));
        });
      };
      js.src = PATH + 'docs/save-state/save-state-' + (ib_lang || 'en') + '.js';
      document.body.appendChild(js);

      js = document.createElement('script');
      js.onload = function() {
        var ib_how_to = ib_multiline.stripIndent(ib_how_to_data);

        var modal_how_to = '<ib-div id="ib_howToModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="howToModal" aria-hidden="true">' +
                             '<ib-div class="modal-dialog">' +
                              '<ib-div class="modal-content">' +
                                '<ib-div class="modal-header">' +
                                  '<ib-span type="button" class="close" data-dismiss="modal"><ib-span aria-hidden="true">&times;</ib-span></ib-span>' +
                                  '<ib-div class="modal-title" id="howToModal">' + ib_languages[ib_lang].about + '</ib-div>' +
                                '</ib-div>' +
                                '<ib-div class="modal-body">' +
                                  '<ib-div class="ib_how_to_container">' + ib_how_to + '</ib-div>' +
                                '</ib-div>' +
                                '<ib-div class="modal-footer">' +
                                  '<ib-span class="ib_default_button" data-dismiss="modal">' + ib_languages[ib_lang].got_it + '</ib-span>' +
                                '</ib-div>' +
                              '</ib-div>' +
                            '</ib-div>' +
                          '</ib-div>';

        $(document.body)
          .after($(modal_how_to));
      };
      js.src = PATH + 'docs/how-to/how-to-' + (ib_lang || 'en') + '.js';
      document.body.appendChild(js);

      for(key in ib_data)
      {
        if(typeof ib_data[key].tooltip !== 'undefined') {
          ib_data[key].tooltip = ib_languages[ib_lang][key.substring(1, key.length - 1) + '_tooltip'];
        }
      }
    }
    else
      setTimeout(function() { ib_loadCompanyData(); }, ib_timeout);

    ib_data_timeout += ib_timeout;
  };

  var ib_initTemplate = function() {
    ib_processHtml();
  };

  var ib_processHtml = function() {
    ib_replacePlaceholder('{company_name}');
    ib_replacePlaceholder('{company_address}');
    ib_replacePlaceholder('{company_city_zip_state}');
    ib_replacePlaceholder('{company_phone_fax}');
    ib_replacePlaceholder('{company_email_web}');
    ib_replacePlaceholder('{payment_info1}');
    ib_replacePlaceholder('{payment_info2}');
    ib_replacePlaceholder('{payment_info3}');
    ib_replacePlaceholder('{payment_info4}');
    ib_replacePlaceholder('{issue_date_label}');
    ib_replacePlaceholder('{issue_date}', true, { 'data-date': ib_issue_date_formated });
    ib_replacePlaceholder('{net_term_label}');
    ib_replacePlaceholder('{net_term}');
    ib_replacePlaceholder('{due_date_label}');
    ib_replacePlaceholder('{due_date}', true, { 'data-date': ib_due_date_formated });
    ib_replacePlaceholder('{currency_label}');
    ib_replacePlaceholder('{currency}');
    ib_replacePlaceholder('{po_number_label}');
    ib_replacePlaceholder('{po_number}');
    ib_replacePlaceholder('{bill_to_label}');
    ib_replacePlaceholder('{payment_info5}');
    ib_replacePlaceholder('{client_name}');
    ib_replacePlaceholder('{client_address}');
    ib_replacePlaceholder('{client_city_zip_state}');
    ib_replacePlaceholder('{client_phone_fax}');
    ib_replacePlaceholder('{client_email}');
    ib_replacePlaceholder('{client_other}');
    ib_replacePlaceholder('{invoice_title}');
    ib_replacePlaceholder('{invoice_number}');
    ib_replacePlaceholder('{item_row_number_label}', true);
    ib_replacePlaceholder('{item_description_label}');
    ib_replacePlaceholder('{item_quantity_label}');
    ib_replacePlaceholder('{item_price_label}');
    ib_replacePlaceholder('{item_discount_label}');
    ib_replacePlaceholder('{item_tax_label}');
    ib_replacePlaceholder('{item_line_total_label}');
    ib_replacePlaceholder('{item_row_number}', true);
    ib_replacePlaceholder('{item_description}');
    ib_replacePlaceholder('{item_quantity}');
    ib_replacePlaceholder('{item_price}');
    ib_replacePlaceholder('{item_discount}');
    ib_replacePlaceholder('{item_tax}');
    ib_replacePlaceholder('{item_line_total}', true);
    ib_replacePlaceholder('{amount_subtotal_label}');
    ib_replacePlaceholder('{amount_subtotal}', true);
    ib_replacePlaceholder('{tax_name}');
    ib_replacePlaceholder('{tax_value}', true);
    ib_replacePlaceholder('{amount_total_label}');
    ib_replacePlaceholder('{amount_total}', true);
    ib_replacePlaceholder('{amount_paid_label}');
    ib_replacePlaceholder('{amount_paid}');
    ib_replacePlaceholder('{amount_due_label}');
    ib_replacePlaceholder('{amount_due}', true);
    ib_replacePlaceholder('{terms_label}');
    ib_replacePlaceholder('{terms}');

    // Handle custom document and client fields
    $('*')
      .filter(function() {
        var el = $(this);
        return (/{document_custom_[a-zA-Z0-9_]+}/.test(el.text()) || /{client_custom_[a-zA-Z0-9_]+}/.test(el.text())) && 
        el.children().length === 0 && 
        el.prop('firstChild').nodeType == 3;
      })
      .each(function(idx, val) {
        var placeholder = $(val).text();
        
        if(typeof ib_data[placeholder] === 'undefined')
          ib_data[placeholder] = { default_text: '', tooltip: 'Enter ' + placeholder.replace(/{(document|client)_custom_([a-zA-Z0-9_]+)}/gi, '$1 $2').replace(/_/g, ' ') };

        ib_replacePlaceholder(placeholder);
      });
  };

  var ib_replacePlaceholder = function(id, not_editable, attr) {
    var data_id = id.substring(1, id.length - 1),
        notEditableByIE = "TABLE,COL,COLGROUP,TBODY,TD,TFOOT,TH,THEAD,TR".split(',');

    var elements = $('*:contains("' + id + '")');
    for(var i = 0; i < elements.length; i++)
    {
      if($(elements[i]).children().length === 0 && $(elements[i]).prop('firstChild').nodeType == 3 /* TEXT NODE */)
      {
        var el = $(elements[i]);

        if(ib_isIE() && notEditableByIE.indexOf(el.prop("tagName")) > -1 && !not_editable)
        {
          var tmp_el = $('<ib-span class="ibcl_ie_contenteditable" contenteditable="true"></ib-span>');
          
          el.html(tmp_el);
          el = tmp_el;
        }

        el.attr('data-ibcl-id', data_id)
          .addClass('ibcl_' + data_id)
          .attr('data-tooltip', 'tooltip')
          .attr('data-placement', 'top')
          .attr('title', ib_data[id].tooltip)
          .html(ib_data[id].default_text);
        
        if(attr)
          el.attr(attr);
        
        if(!not_editable)
          el.attr('contenteditable', 'true');
      }
    }
  };

  var ib_addFieldListeners = function() {
    // This will update all fields for the same placeholder with the typed value
    $('[data-ibcl-id]').on('keydown keyup', function(e) {
      var field = $(this).data('ibcl-id');

      // Don't apply this for the item fields, they don't need to update their values
      if(['item_row_number', 'item_description', 'item_quantity', 'item_price', 'item_tax_percentage', 'item_tax', 'item_discount', 'item_line_total'].indexOf(field) == -1)
      {
        var value = $(this).html();

        $('[data-ibcl-id="' + field + '"]').each(function(idx, val) {
          if($(val).html() !== value) // only update the field if the value is different
            $(val).html(value);
        });
      }
    });
  };

  /**
   * Logo functions
   */
  var ib_max_width     = 820, // Because the maximum template width is 820px the logo should be also maximum 820px wide
      ib_max_height    = 820,
      ratio            = 1,
      ib_logo_width    = 0,
      ib_logo_height   = 0,
      ib_canvas_width  = 820,
      ib_canvas_height = 820;

  var ib_initLogoTag = function() {
    $('[data-logo="{company_logo}"]')
      .attr('data-logo', 'company_logo')
      .attr('src', BLANK_GIF);
  };

  var ib_initLogoUpload = function() {
    var logo_img = $('[data-logo="company_logo"]').attr('src', BLANK_GIF);

    $(document).bind('drop dragover', function (e) {
      e.stopPropagation();
      e.preventDefault();
      
      e.originalEvent.dataTransfer.dropEffect = 'none';
    });

    logo_img
      .after($('<ib-div class="ib_remove_logo_overlay" data-tooltip="tooltip" data-placement="top"><ib-span class="ib_remove_logo" title="' + ib_languages[ib_lang].remove_logo + '"><i class="fa fa-times-circle"></i></ib-span></ib-div>')
        .hover(
          function() { },
          function() {
            $('.ib_remove_logo_overlay').hide();
          }
        ));

    logo_img.hover(
      function() {
        if(logo_img.attr('src') !== '')
        {
          var lo = $('[data-logo="company_logo"]').offset();

          $('.ib_remove_logo_overlay')
            .show()
            .offset(lo)
            .width(ib_logo_width)
            .height(ib_logo_height);
        }
      },
      function() { }
    );

    // Wait for 100 ms before rendering the drag & drop container, to fix rendering issues
    setTimeout(function() {
      ib_logo_width = $('[data-logo="company_logo"]').width();
      ib_logo_height = $('[data-logo="company_logo"]').height();

      ratio = ib_logo_width / ib_logo_height;
      // Calculate the actual maximum width and height for the logo
      if(ib_logo_width > ib_logo_height)
        ib_max_height *= 1 / ratio;
      else
        ib_max_width *= ratio;

      logo_img
        .hide()
        .before($('<ib-span class="ib_drop_zone" data-tooltip="tooltip" data-placement="top" title="' + ib_languages[ib_lang].logo_upload_tooltip + '"><ib-span>' + ib_languages[ib_lang].drop_logo + '<br /><ib-span>(' + ib_logo_width + ' x ' + ib_logo_height + 'px)</ib-span><input type="file" accept="image/*" class="ib_drop_logo" /></ib-span></ib-span>').width(ib_logo_width).height(ib_logo_height));
      
      // Setup the D&D listeners
      $('.ib_drop_zone')
        .bind('dragenter', handleDragEnter)
        .bind('dragleave', handleDragLeave)
        .bind('dragover', handleDragOver)
        .bind('drop', handleFileSelect);
        
      $('input.ib_drop_logo').change(function(e){
        e.originalEvent.dataTransfer = { files: $(this).prop('files') };
        handleFileSelect(e);
      });

      setTimeout(function() {
        if(ib_data['{company_logo}'] && /^data:image\/.+;base64/.test(ib_data['{company_logo}']))
        {
          logo_img
            .attr('src', ib_data['{company_logo}'])
            .css('display', 'block')
            .hide()
            .show();

          $('.ib_logo_base64')
            .val($('[data-logo="company_logo"]').attr('src'));

          $('.ib_drop_zone').hide();
        }
      }, 100);
    }, 100);
    
    var handleFileSelect = function(e) {

      e.stopPropagation();
      e.preventDefault();

      var files = e.originalEvent.dataTransfer.files; // FileList object. 
      var file = files[0];
      
      if(!file)
        return;

      if(!file.type.match(/image.*/))
      {
        alert(ib_languages[ib_lang].image_format_alert);
        return;
      }
      if(file.size > 2097152)
      {
        alert(ib_languages[ib_lang].image_too_big_alert);
        return;
      }
      
      var img = new Image();
      var reader = new FileReader();
      reader.onload = function(e) { img.src = e.target.result; };
      
      img.onload = function(e) {
        var width = img.width;
        var height = img.height;

        ib_canvas_width = ib_max_width;
        ib_canvas_height = ib_max_height;

        if(width <= ib_canvas_width && width >= height) {
          ib_canvas_height = width * 1 / ratio;
          ib_canvas_width = width;
        }
        if(height <= ib_canvas_height && height >= width) {
          ib_canvas_width = height * ratio;
          ib_canvas_height = height;
        }

        if(width <= ib_logo_width && width >= height) {
          ib_canvas_height = ib_logo_width * 1 / ratio;
          ib_canvas_width = ib_logo_width;
        }
        if(height <= ib_logo_height && height >= width) {
          ib_canvas_width = ib_logo_height * ratio;
          ib_canvas_height = ib_logo_height;
        }

        if (width >= ib_canvas_width) {
          height *= ib_canvas_width / width;
          width = ib_canvas_width;
        }
        if (height >= ib_canvas_height) {
          width *= ib_canvas_height / height;
          height = ib_canvas_height;
        }
        
        if(width < 1) width = 1;
        if(height < 1) height = 1;

        var canvas = document.createElement('canvas');
        canvas.width = ib_canvas_width;
        canvas.height = ib_canvas_height;

        var left = (ib_canvas_width - width) / 2;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, left, 0, width, height);
        
        var dataurl = canvas.toDataURL("image/png");
        
        logo_img
          .attr('src', dataurl)
          .css('display', 'block')
          .hide()
          .fadeIn();

        $('.ib_logo_base64')
            .val($('[data-logo="company_logo"]').attr('src'));
        
        $('.ib_drop_zone').hide();
      };

      reader.readAsDataURL(file);
      
      $('.ib_drop_zone').removeClass('ib_border_hover');
    };

    var removeLogo = function(e) {
      e.preventDefault();
      e.stopPropagation();

      logo_img.attr('src', BLANK_GIF).hide();
      $('.ib_drop_zone').show();
      $('.ib_remove_logo_overlay').hide();
      $('input.ib_drop_logo').val(''); // Reset the file field
    };

    var handleDragOver = function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      e.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };

    var handleDragEnter = function(e) {
      e.stopPropagation();
      e.preventDefault();

      $('.ib_drop_zone').addClass('ib_border_hover');
    };

    var handleDragLeave = function(e) {
      e.stopPropagation();
      e.preventDefault();

      $('.ib_drop_zone').removeClass('ib_border_hover');
    };

    $('.ib_remove_logo').click(removeLogo);
  };

  /**
   * Items grid functions
   */
  var ib_items_line, ib_tax_line;

  var ib_initItemsTable = function() {
    ib_items_line = $('[data-iterate="item"]');
    ib_tax_line = $('[data-iterate="tax"]').hide().clone();

    var num = 1;
    var rows_num = parseInt(ib_data.default_number_rows);

    if(typeof ib_invoice_data !== 'undefined' && typeof ib_invoice_data.items !== 'undefined')
      ib_data.items = ib_invoice_data.items;

    // If we have more items than rows than add more rows
    if(rows_num < ib_data.items.length)
      rows_num = ib_data.items.length;

    while (num < rows_num)
    {
      $(ib_items_line).after($(ib_items_line).clone());
      num++;
    }

    ib_initRowNumbers();

    ib_items_line = ib_items_line.clone();
    
    ib_initRowCommands();

    ib_setRowData();

    ib_calculateTotals();
  };

  var ib_getExistingTax = function(taxes, tax) {
    for(var i = 0; i < taxes.length; i++)
      if(Object.keys(taxes[i])[0] == tax)
        return i;

    return -1;
  };

  var ib_getExistingTaxRow = function(tax_rows, tax_value) {
    for(var i = 0; i < tax_rows.length; i++)
    {
      tax_row = $(tax_rows[i]).find('[data-ib-value="' + tax_value.getFormatedNumber() + '"]');
      if(tax_row.length)
        return i;
    }

    return -1;
  };

  var ib_getTaxName = function(tax_value) {
    if(tax_value)
      return $('[data-iterate="tax"]:visible').find('[data-ib-value="' + tax_value.toString().getFormatedNumber() + '"]').closest('[data-iterate="tax"]').find('[data-ibcl-id="tax_name"]').text().replace(/:/gi, '');

    return '';
  };

  String.prototype.insertString = function(str, position) {
    if(this)
      return [this.slice(0, position), str, this.slice(position)].join('');

    return '';
  };

  String.prototype.getNumber = function() {
    if(this) {
      if(ib_decimal_separator == '.')
        return parseFloat(this.replace(/[^0-9.-]/g, ''));
      else if(ib_decimal_separator == ',')
        return parseFloat(this.replace(/[^0-9,-]/g, '').replace(/,/g, '.'));
    }

    return 0;
  };

  // Get string from the number with the currently used decimal separator
  String.prototype.toValidNumberString = function() {
    if(this) {

      if(ib_decimal_separator == '.')
        return this.replace(/[^0-9.-]/g, '');
      else if(ib_decimal_separator == ',')
        return this.replace(/[^0-9,-]/g, '');

    }

    return '';
  };

  String.prototype.getValidNumberChars = function() {
    if(this)
      return this.replace(/[^0-9.,-]/gi, '');

    return '';
  };

  String.prototype.getFormatedNumber = function() {
    if(this)
    {
      var i, counter,
          number = this.toString(),
          minus_sign = ''; // initially there's no minus

      if(number.indexOf('-') === 0)
      {
        number = number.substring(1);
        minus_sign = '-'; // set the minus sign
      }

      var thousands_separator = ib_thousands_separator;
      if(ib_thousands_separator == ' ')
        thousands_separator = '&#8239;';

      number = number.replace(/\./g, ib_decimal_separator);
      counter = 0;
      for(i = number.lastIndexOf(ib_decimal_separator) - 1; i >= 0; i--)
      {
        if(counter < 2)
        {
          counter++;
          continue;
        }
        else {
          counter = 0;
          number = number.insertString(thousands_separator, i);
        }
      }

      if(number[0] == '.' || number[0] == ',')
        number = number.substring(1);

      return minus_sign + number;
    }
    return this;
  };

  // Override the native toFixed function to prevent imprecisions of floating-point arithmetics
  Number.prototype.toFixed = function(precision) {
    if(!precision) precision = 0;

    var num = (+(Math.round(+(this.toString() + 'e' + precision)).toString() + 'e' + -precision)).toString();

    if(num.indexOf('.') == -1 && precision > 0)
      num += '.';

    var counter = 0;
    for(var i = num.indexOf('.') + 1; i <= num.length; i++)
    {
      if(num[i] === undefined && counter < precision)
      {
        num += '0';
      }
      counter++;
    }

    return num;
  };

  var ib_calculateTotals = function() {
    var rows = $('[data-iterate="item"]');

    var sum_total = 0,
        tax_total = 0,
        line_tax = 0,
        taxes = [],
        amount_paid,
        amount_due,
        j;

    for(var i = 0; i < rows.length; i++)
    {
      var row = $(rows[i]);

      var item_quantity = row.find('[data-ibcl-id="item_quantity"]:visible').text().getNumber();
      if(row.find('[data-ibcl-id="item_quantity"]:visible').text().trim() === '')
        item_quantity = ib_data.default_quantity.getNumber();

      var item_price    = row.find('[data-ibcl-id="item_price"]:visible').text().getNumber()    || ib_data.default_price;
      var item_discount = row.find('[data-ibcl-id="item_discount"]:visible').text().getNumber() || ib_data.default_discount.getNumber();
      var item_tax      = row.find('[data-ibcl-id="item_tax"]:visible').text().getNumber()      || ib_data.default_tax.getNumber();
      if(isNaN(parseFloat(row.find('[data-ibcl-id="item_tax"]:visible').text())))
        item_tax = null;

      // Handle the price and line total currency sign with pseudo element
      if(!isNaN(row.find('[data-ibcl-id="item_price"]').text().getNumber())) {
        row.find('[data-ibcl-id="item_price"]')
          .removeClass('add_currency_left add_currency_right')
          .attr('data-currency', ib_currency_symbol).data('currency', ib_currency_symbol);

        if(JSON.parse(ib_show_currency))
          row.find('[data-ibcl-id="item_price"]').addClass(ib_currency_position == 'left' ? 'add_currency_left' : 'add_currency_right');
      }
      else
        row.find('[data-ibcl-id="item_price"]').removeClass('add_currency_left add_currency_right').find('br, p, div').remove();

      // Handle discount percentage (%) sign with pseudo element
      if(!isNaN(row.find('[data-ibcl-id="item_discount"]').text().getNumber()))
        row.find('[data-ibcl-id="item_discount"]').addClass('ib_item_percentage').find('br, p, div').remove();
      else
        row.find('[data-ibcl-id="item_discount"]').removeClass('ib_item_percentage').find('br, p, div').remove();

      // Handle tax percentage (%) sign with pseudo element
      if(!isNaN(row.find('[data-ibcl-id="item_tax"]').text().getNumber()))
        row.find('[data-ibcl-id="item_tax"]').addClass('ib_item_percentage').find('br, p, div').remove();
      else
        row.find('[data-ibcl-id="item_tax"]').removeClass('ib_item_percentage').find('br, p, div').remove();
      
      var item_line_total = row.find('[data-ibcl-id="item_line_total"]:visible');
      
      amount_paid = $('[data-ibcl-id="amount_paid"]').text().getNumber();
      amount_due  = $('[data-ibcl-id="amount_due"]').text().getNumber();
      
      var line_sum = 0, tax = 0, discount = 0;
      if(!isNaN(item_quantity) && !isNaN(item_price))
        line_sum = item_quantity * item_price;
      
      if(!isNaN(item_discount))
        line_sum -= Math.abs(line_sum * (item_discount / 100));
        
      sum_total += line_sum;

      // taxes are always calculated in percentage
      if(!isNaN(item_tax)) {
        tax = item_tax / 100;
      }

      line_tax = line_sum * tax;
      tax_total += line_tax;

      if(item_tax !== null)
      {
        var tax_tmp = {};
        tax_tmp[item_tax] = line_tax;

        var t = ib_getExistingTax(taxes, item_tax);
        if(t > -1)
          taxes[t][item_tax] += line_tax;
        else
          taxes.push(tax_tmp);
      }

      // item_line_total.text(line_sum !== 0 ? line_sum.toFixed(2).getFormatedNumber() : '');

      item_line_total
        .html(line_sum.toFixed(2).getFormatedNumber())
        .removeClass('add_currency_left add_currency_right')
        .attr('data-currency', ib_currency_symbol).data('currency', ib_currency_symbol);

      if(JSON.parse(ib_show_currency))
        item_line_total.addClass(ib_currency_position == 'left' ? 'add_currency_left' : 'add_currency_right');
    }

    var tax_rows = [], tax_row, tax_value;
    // Get the already existing tax rows
    for(j = 0; j < taxes.length; j++)
    {
      tax_value = Object.keys(taxes[j])[0];
      tax_row = $('[data-iterate="tax"]:visible').find('[data-ib-value="' + tax_value.getFormatedNumber() + '"]').closest('[data-iterate="tax"]');
      if(tax_row.length)
        tax_rows.push($(tax_row).clone());
    }

    // Remove all visible tax rows
    $('[data-iterate="tax"]:visible').remove();

    // Add tax rows for the new taxes and insert the existing ones
    for(j = 0; j < taxes.length; j++)
    {
      tax_value = Object.keys(taxes[j])[0];
      var tr = ib_getExistingTaxRow(tax_rows, tax_value);
      if(tr > -1)
        $('[data-iterate="tax"]:hidden').before(tax_rows[tr]);
      else
      {
        tax_row = ib_tax_line.clone().show();

        var tax_name      = tax_row.find('[data-ibcl-id="tax_name"]'),
            tax_name_text = tax_name.text().trim(),
            colon         = tax_name_text.lastIndexOf(':');

        if(colon == -1 || colon != tax_name_text.length - 1) colon = tax_name_text.length;

        tax_name.html(tax_name_text.substring(0, colon) + ' ' + (j + 1) + tax_name_text.substring(colon, tax_name_text.length));

        tax_row.find('[data-ibcl-id="tax_value"]').attr('data-ib-value', Object.keys(taxes[j])[0].getFormatedNumber());
        $('[data-iterate="tax"]:hidden').before(tax_row);
      }
    }

    // Set the calculated tax
    for(j = 0; j < taxes.length; j++)
    {
      tax_value = Object.keys(taxes[j])[0];
      if(JSON.parse(ib_show_currency))
        tax_row = ib_currency_position == 'left' ? ib_currency_symbol + taxes[j][tax_value].toFixed(2).getFormatedNumber() : taxes[j][tax_value].toFixed(2).getFormatedNumber() + ib_currency_symbol;
      else
        tax_row = taxes[j][tax_value].toFixed(2).getFormatedNumber();

      $('[data-iterate="tax"]').find('[data-ib-value="' + tax_value.getFormatedNumber() + '"]').html(tax_row);
    }

    var amount_total = sum_total + tax_total;
    
    if(isNaN(amount_paid))
    {
      amount_paid = 0;
      $('[data-ibcl-id="amount_paid"]')
        .html(amount_paid.toFixed(2).getFormatedNumber());
    }

    $('[data-ibcl-id="amount_paid"]')
      .removeClass('add_currency_left add_currency_right')
      .attr('data-currency', ib_currency_symbol).data('currency', ib_currency_symbol);

    if(JSON.parse(ib_show_currency))
      $('[data-ibcl-id="amount_paid"]').addClass(ib_currency_position == 'left' ? 'add_currency_left' : 'add_currency_right');

    if(isNaN(amount_due)) amount_due = 0;
    
    amount_due = amount_total - amount_paid;
    
    if(JSON.parse(ib_show_currency)) {
      sum_total    = ib_currency_position == 'left' ? ib_currency_symbol + sum_total.toFixed(2).getFormatedNumber() : sum_total.toFixed(2).getFormatedNumber() + ib_currency_symbol;
      amount_total = ib_currency_position == 'left' ? ib_currency_symbol + amount_total.toFixed(2).getFormatedNumber() : amount_total.toFixed(2).getFormatedNumber() + ib_currency_symbol;
      amount_due   = ib_currency_position == 'left' ? ib_currency_symbol + amount_due.toFixed(2).getFormatedNumber() : amount_due.toFixed(2).getFormatedNumber() + ib_currency_symbol;
    }
    else {
      sum_total    = sum_total.toFixed(2).getFormatedNumber();
      amount_total = amount_total.toFixed(2).getFormatedNumber();
      amount_due   = amount_due.toFixed(2).getFormatedNumber();
    }
    
    $('[data-ibcl-id="amount_subtotal"]').html(sum_total);
    $('[data-ibcl-id="amount_total"]').html(amount_total);
    $('[data-ibcl-id="amount_due"]').html(amount_due);

    ib_highlightEditable();
  };

  /**
   * Item row commands
   */
  var ib_initRowNumbers = function() {
    var rows = $('[data-ibcl-id="item_row_number"]');
    
    for(var i = 0; i < rows.length; i++)
      $(rows[i]).append($('<ib-span data-row-number="item_row_number"></ib-span>'));
      
    ib_resetRowNumbers();
  };

  var ib_resetRowNumbers = function() {
    var rows = $('[data-row-number="item_row_number"]');
    for(var i = 0; i < rows.length; i++)
      $(rows[i]).html(i + 1);
  };

  var ib_setRowData = function() {
    // Check to see if we're going to load dummy items ot not
    if(!JSON.parse(ib_data.load_items))
      return;

    var rows = $('[data-iterate="item"]');

    if(typeof ib_invoice_data !== 'undefined' && typeof ib_invoice_data.items !== 'undefined')
      ib_data.items = ib_invoice_data.items;

    for (var i = 0; i < ib_data.items.length; i++)
    {
      $(rows[i]).find('[data-ibcl-id="item_description"]').html(ib_data.items[i].item_description);
      $(rows[i]).find('[data-ibcl-id="item_quantity"]').html(ib_data.items[i].item_quantity);
      $(rows[i]).find('[data-ibcl-id="item_price"]').html(ib_data.items[i].item_price);
      $(rows[i]).find('[data-ibcl-id="item_discount"]').html(ib_data.items[i].item_discount.replace(/%/g, '')); // remove the percent sign
      $(rows[i]).find('[data-ibcl-id="item_tax"]').html(ib_data.items[i].item_tax.replace(/%/g, '')); // remove the percent sign
    }
  };

  var ib_initRowCommands = function() {
    var row_commands = '<ib-span class="ib_row_commands" style="height:' + $('[data-iterate="item"]').height() + 'px;"><ib-span class="ib_commands"><ib-span class="ib_add" title="' + ib_languages[ib_lang].insert_row + '"><i class="fa fa-plus"></i></ib-span><ib-span class="ib_delete" title="' + ib_languages[ib_lang].remove_row + '"><i class="fa fa-minus"></i></ib-span><ib-span class="ib_move" title="' + ib_languages[ib_lang].drag_to_reorder + '"><i class="fa fa-sort"></i></ib-span></ib-span></ib-span>';
    
    $('.ib_row_commands').remove();
    
    var rows = $('[data-iterate="item"]');
    for (var i = 0; i < rows.length; i++) {
      $(rows[i]).children(':first').css('position', 'relative').prepend($(row_commands));
    }

    $('.ib_add').click(function(e) {
      ib_addRow(this, e);
    });

    $('.ib_delete').click(function(e) {
      ib_deleteRow(this, e);
    });
    
    $('[data-iterate="item"]').hover(function() { $(this).find('.ib_row_commands .ib_commands').css('display', 'block'); }, function() { $(this).find('.ib_row_commands .ib_commands').hide(); });
    
    // Init the table for drag & drop
    new ib_TableDnD(ib_resetRowNumbers, ib_getInvoiceData).init();
    
    ib_setRowsEvents();
  };

  var ib_setRowsEvents = function() {
    // private
    function ib_fieldKeypress(e) {
      var pos, key = String.fromCharCode(e.which);

      // allow only numbers and navigation keys
      if (e.which === 0 || e.which === 8 || /[0-9.,\-]/.test(key)) {
        // Don't do anything

        switch($(this).data('ibcl-id'))
        {
          case 'net_term':

            if((key == '.' || key == ',' || key == '-') || ($(this).text().length >= 3 && e.which >= 48 /* 0 */ && e.which <= 57 /* 9 */ && window.getSelection().isCollapsed))
              e.preventDefault();
            else {
              $('[data-ibcl-id="net_term"], [data-ibcl-id="due_date"]').removeClass('ib_stop_animate').addClass('ib_highlight_bg');
              setTimeout(function () { $('[data-ibcl-id="net_term"], [data-ibcl-id="due_date"]').removeClass('ib_highlight_bg'); }, 10);
            }
            break;

          case 'item_quantity':
          case 'item_price':
          case 'item_discount':
          case 'amount_paid':

            // Allow minus (-) sign
            if(key == '-')
            {
              if($(this).text().indexOf('-') == -1) {

                pos = window.getSelection().extentOffset + 1;

                $(this).text('-' + $(this).text().replace(/\-/g, ''));

                try {
                  window.getSelection().collapse(this.firstChild, pos);
                }
                catch(err) { }
              }

              e.preventDefault();
            }
            break;
        }

        // if a decimal separator has been added, disable the '.' or ',' keys
        if(ib_decimal_separator == '.' && $(this).text().indexOf('.') != -1 && key == '.')
          e.preventDefault(); 

        if(ib_decimal_separator == ',' && $(this).text().indexOf(',') != -1 && key == ',')
          e.preventDefault();

        // if decimal separator is '.' than preven the ',' from being typed
        if(ib_decimal_separator == '.' && key == ',')
          e.preventDefault();

        // if decimal separator is ',' than preven the '.' from being typed
        if(ib_decimal_separator == ',' && key == '.')
          e.preventDefault();
      }
      else
        e.preventDefault();
    }
    
    $('[data-ibcl-id="net_term"], [data-ibcl-id="item_quantity"], [data-ibcl-id="item_price"], [data-ibcl-id="item_discount"], [data-ibcl-id="item_tax"], [data-ibcl-id="amount_paid"], [data-ibcl-id="amount_due"]')
      .keypress(ib_fieldKeypress)
      .on('keyup keydown', function() {
        
        switch($(this).data('ibcl-id'))
        {
          case 'net_term':

            setTimeout(ib_calculateDates, 0);
            break;

          case 'item_quantity':
          case 'item_price':
          case 'item_discount':

            break;

          case 'amount_paid':

            if($(this).text().trim().replace(',', '.') != $(this).text().getNumber().toFixed(2)) {

              pos = window.getSelection().extentOffset + 1;

              $(this).text($(this).text().getNumber().toFixed(2).replace('.', ib_decimal_separator));

              try {
                window.getSelection().collapse(this.firstChild, pos);
              }
              catch(err) { }
            }
            break;
        }

        if($(this).text().trim() == '-')
          $(this).text('');

        setTimeout(ib_calculateTotals, 0);
      });
  };

  var ib_addRow = function(el, e) {
    e.stopPropagation();
    e.preventDefault();

    if(!$(el).hasClass('ib_add_new_row_link'))
      $(el).closest('[data-iterate="item"]').before($(ib_items_line).clone());
    else
      $(el).closest('.ib_bottom_row_commands').before($(ib_items_line).clone());
      
    ib_resetRowNumbers();
    
    // Re-initialize the row commands;
    ib_initRowCommands();

    $('.ib_show_hide_columns > ib-span > input:checkbox').each(function(idx, chk) {
      $('.ib_show_hide_columns > ib-span > input:checkbox:nth(' + idx + ')').change();
    });

    ib_highlightEditable();

    ib_calculateTotals();
  };

  var ib_deleteRow = function(el, e) {
    e.stopPropagation();
    e.preventDefault();
    
    $(el).closest('[data-iterate="item"]').remove();
    
    ib_resetRowNumbers();

    ib_calculateTotals();
  };

  /**
   * Date functions
   */
  var ib_issue_date,
      ib_due_date,
      ib_issue_date_formated,
      ib_due_date_formated;

  var ib_initDates = function() {
    ib_issue_date = new Date();
    ib_due_date = new Date(new Date().setDate(new Date().getDate() + parseInt(ib_data['{net_term}'].default_text)));

    ib_issue_date_formated = ib_formatDate(ib_issue_date, ib_data.date_format);
    ib_due_date_formated = ib_formatDate(ib_due_date, ib_data.date_format);

    ib_data['{issue_date}'].default_text = ib_issue_date_formated;
    ib_data['{due_date}'].default_text = ib_due_date_formated;
  };

  var ib_formatDate = function(date, format) {
    var separator = format.match(/[.\/\-\s].*?/),
        parts = format.split(/\W+/);

    if (!separator || !parts || parts.length === 0)
      throw new Error("Invalid date format.");

    format = { separator: separator, parts: parts };

    var val = {
      d: date.getDate(),
      m: date.getMonth() + 1,
      yy: date.getFullYear().toString().substring(2),
      yyyy: date.getFullYear()
    };

    val.dd = (val.d < 10 ? '0' : '') + val.d;
    val.mm = (val.m < 10 ? '0' : '') + val.m;
    date = [];

    for (var i = 0; i < format.parts.length; i++) {
      date.push(val[format.parts[i]]);
    }

    return date.join(format.separator);
  };

  var ib_initDatepickers = function() {
    var radios = '';
    var date_formats = ['dd/mm/yyyy', 'dd-mm-yyyy', 'dd.mm.yyyy', 'mm/dd/yyyy', 'mm-dd-yyyy', 'mm.dd.yyyy', 'yyyy mm dd', 'yyyy-mm-dd', 'yyyy.mm.dd'];
    for(var i = 0; i < date_formats.length; i++)
    {
      radios += '<ib-div><input type="radio" id="ib_date_format_radio' + i + '" name="ib_date_format_choice" value="' + date_formats[i] + '"><label for="ib_date_format_radio' + i + '">' + date_formats[i] + '</label></ib-div>';
    }

    var date_format = 
      $('<ib-div class="ib_date_format">' + radios + '</ib-div>')
        .hover(
          function() {
            $(this).show();
          },
          function() {
            $(this).hide();
          }
        );

    $(document.body).after(date_format);

    $('[data-ibcl-id="issue_date"]')
      .datepicker({
        format: ib_data.date_format
      })
      .data('datepicker');

    $('[data-ibcl-id="due_date"]')
      .datepicker({
        format: ib_data.date_format,
        onRender: function(date) {
          ib_issue_date.setHours(0,0,0,0);
          return date.valueOf() < ib_issue_date.valueOf() ? 'disabled' : '';
        }
      })
      .data('datepicker');

    $('[data-ibcl-id="issue_date"], [data-ibcl-id="due_date"]')
      .on('changeDate', function(e) {
        // Only if it's day selected, proceed with calculations
        if(e.viewMode != "days")
          return;

        $(this).text($(this).data('date'));

        var net_term = parseInt(ib_data['{net_term}'].default_text) || 0;

        if(!isNaN(parseInt($('[data-ibcl-id="net_term"]').text())))
          net_term = parseInt($('[data-ibcl-id="net_term"]').text());
        
        if($(this).data('ibcl-id') == 'issue_date')
        {
          ib_issue_date = new Date(e.date);
          if(JSON.parse(ib_data.auto_calculate_dates))
          {
            ib_due_date = new Date(e.date.setDate(ib_issue_date.getDate() + net_term));
            $('[data-ibcl-id="due_date"]').datepicker('setValue', ib_due_date).text($('[data-ibcl-id="due_date"]').data('date'));

            // Also set the issue date picker value
            $('[data-ibcl-id="issue_date"]').datepicker('setValue', ib_issue_date).text($('[data-ibcl-id="issue_date"]').data('date'));

            $('[data-ibcl-id="issue_date"], [data-ibcl-id="due_date"]').removeClass('ib_stop_animate').addClass('ib_highlight_bg');
            setTimeout(function () { $('[data-ibcl-id="issue_date"], [data-ibcl-id="due_date"]').removeClass('ib_highlight_bg'); }, 10);
          }
        }
        else if($(this).data('ibcl-id') == 'due_date')
        {
          ib_due_date = new Date(e.date);
          if(JSON.parse(ib_data.auto_calculate_dates))
          {
            net_term = Math.ceil(Math.abs((ib_due_date.getTime() - ib_issue_date.getTime()) / (24 * 60 * 60 * 1000)));
            $('[data-ibcl-id="net_term"]').text(net_term);

            $('[data-ibcl-id="net_term"], [data-ibcl-id="due_date"]').removeClass('ib_stop_animate').addClass('ib_highlight_bg');
            setTimeout(function () { $('[data-ibcl-id="net_term"], [data-ibcl-id="due_date"]').removeClass('ib_highlight_bg'); }, 10);
          }
        }
        
        $(this).datepicker('hide');
      })
      .hover(
        function() {
          var offset = $(this).offset(), width = $(this).width();
          date_format.show().offset({ top: offset.top - 5, left: offset.left + width });
        },
        function() {
          date_format.hide();
        }
      );
      
      date_format
        .find('input:radio')
        .val([ib_data.date_format])
        .change(function(e){
          ib_data.date_format = $(this).val();
          $('[data-ibcl-id="issue_date"], [data-ibcl-id="due_date"]').datepicker('setFormat', ib_data.date_format);
          $('[data-ibcl-id="issue_date"]').datepicker('setValue', ib_issue_date).text($('[data-ibcl-id="issue_date"]').data('date'));
          $('[data-ibcl-id="due_date"]').datepicker('setValue', ib_due_date).text($('[data-ibcl-id="due_date"]').data('date'));
        });
  };

  var ib_calculateDates = function() {
    var net_term = parseInt(ib_data['{net_term}'].default_text) || 0;

    if(!isNaN(parseInt($('[data-ibcl-id="net_term"]').text())))
      net_term = parseInt($('[data-ibcl-id="net_term"]').text());

    // Only auto calculate dates if it is enabled
    if(JSON.parse(ib_data.auto_calculate_dates))
    {
      ib_due_date = new Date(new Date(ib_issue_date).setDate(ib_issue_date.getDate() + net_term));

      $('[data-ibcl-id="due_date"]').datepicker('setValue', ib_due_date).text($('[data-ibcl-id="due_date"]').data('date'));
    }
  };

  /**
   * Currency and number format functions
   */
  var ib_currencies          = [],
      ib_currency_symbol     = '$',
      ib_currency_position   = 'left',
      ib_show_currency       = true,
      ib_number_format       = '0,000.00',
      ib_decimal_separator   = '.',
      ib_thousands_separator = ',';

  var ib_raw_currencies = 
    // name,symbol,code,priority
    'Afghan afghani,Ø‹,AFN,255;' +
    'Albanian lek,L,ALL,255;' +
    'Algerian dinar,Ø¯.Ø¬,DZD,255;' +
    'Angolan kwanza,Kz,AOA,255;' +
    'Argentine peso,$,ARS,255;' +
    'Armenian dram,Õ¤Ö€.,AMD,255;' +
    'Aruban florin,Æ’,AWG,255;' +
    'Australian dollar,$,AUD,3;' +
    'Azerbaijani manat,man.,AZN,255;' +
    'Bahamian dollar,$,BSD,255;' +
    'Bahraini dinar,.Ø¯.Ø¨,BHD,255;' +
    'Bangladeshi taka,à§³,BDT,255;' +
    'Barbadian dollar,$,BBD,255;' +
    'Belarusian ruble,Br,BYR,255;' +
    'Belize dollar,$,BZD,255;' +
    'Bermudian dollar,$,BMD,255;' +
    'Bhutanese ngultrum,Nu.,BTN,255;' +
    'Bolivian boliviano,Bs.,BOB,255;' +
    'Bosnia and Herzegovina convertible mark,KM,BAM,255;' +
    'Botswana pula,P,BWP,255;' +
    'Brazilian real,R$,BRL,255;' +
    'British pound,Â£,GBP,5;' +
    'Brunei dollar,$,BND,255;' +
    'Bulgarian lev,Ð»Ð²,BGN,255;' +
    'Burundian franc,Fr,BIF,255;' +
    'Cambodian riel,áŸ›,KHR,255;' +
    'Canadian dollar,$,CAD,2;' +
    'Cape Verdean escudo,$,CVE,255;' +
    'Cayman Islands dollar,$,KYD,255;' +
    'Central African CFA franc,Fr,XAF,255;' +
    'CFP franc,Fr,XPF,255;' +
    'Chilean peso,$,CLP,255;' +
    'Chinese yuan,Â¥,CNY,255;' +
    'Colombian peso,$,COP,255;' +
    'Comorian franc,Fr,KMF,255;' +
    'Congolese franc,Fr,CDF,255;' +
    'Costa Rican colÃ³n,â‚¡,CRC,255;' +
    'Croatian kuna,kn,HRK,255;' +
    'Cuban convertible peso,$,CUC,255;' +
    'Cuban peso,$,CUP,255;' +
    'Czech koruna,KÄ,CZK,255;' +
    'Danish krone,kr,DKK,255;' +
    'Djiboutian franc,Fr,DJF,255;' +
    'Dominican peso,$,DOP,255;' +
    'East Caribbean dollar,$,XCD,255;' +
    'Egyptian pound,Â£,EGP,255;' +
    'Eritrean nakfa,Nfk,ERN,255;' +
    'Estonian kroon[B],kr,EEK,255;' +
    'Ethiopian birr,Br,ETB,255;' +
    'Euro,â‚¬,EUR,4;' +
    'Falkland Islands pound,Â£,FKP,255;' +
    'Fijian dollar,$,FJD,255;' +
    'Gambian dalasi,D,GMD,255;' +
    'Georgian lari,áƒš,GEL,255;' +
    'Ghanaian cedi,â‚µ,GHS,255;' +
    'Gibraltar pound,Â£,GIP,255;' +
    'Guatemalan quetzal,Q,GTQ,255;' +
    'Guinean franc,Fr,GNF,255;' +
    'Guyanese dollar,$,GYD,255;' +
    'Haitian gourde,G,HTG,255;' +
    'Honduran lempira,L,HNL,255;' +
    'Hong Kong dollar,$,HKD,255;' +
    'Hungarian forint,Ft,HUF,255;' +
    'Icelandic krÃ³na,kr,ISK,255;' +
    'Indian rupee,â‚¹,INR,255;' +
    'Indonesian rupiah,Rp,IDR,255;' +
    'Iranian rial,ï·¼,IRR,255;' +
    'Iraqi dinar,Ø¹.Ø¯,IQD,255;' +
    'Israeli new shekel,â‚ª,ILS,255;' +
    'Jamaican dollar,$,JMD,255;' +
    'Japanese yen,Â¥,JPY,255;' +
    'Jordanian dinar,Ø¯.Ø§,JOD,255;' +
    'Kazakhstani tenge,â‚¸,KZT,255;' +
    'Kenyan shilling,Sh,KES,255;' +
    'Kuwaiti dinar,Ø¯.Ùƒ,KWD,255;' +
    'Kyrgyzstani som,Ð»Ð²,KGS,255;' +
    'Lao kip,â‚­,LAK,255;' +
    'Latvian lats,Ls,LVL,255;' +
    'Lebanese pound,Ù„.Ù„,LBP,255;' +
    'Lesotho loti,L,LSL,255;' +
    'Liberian dollar,$,LRD,255;' +
    'Libyan dinar,Ù„.Ø¯,LYD,255;' +
    'Lithuanian litas,Lt,LTL,255;' +
    'Macanese pataca,P,MOP,255;' +
    'Macedonian denar,Ð´ÐµÐ½,MKD,255;' +
    'Malagasy ariary,Ar,MGA,255;' +
    'Malawian kwacha,MK,MWK,255;' +
    'Malaysian ringgit,RM,MYR,255;' +
    'Maldivian rufiyaa,Þƒ.,MVR,255;' +
    'Mauritanian ouguiya,UM,MRO,255;' +
    'Mauritian rupee,â‚¨,MUR,255;' +
    'Mexican peso,$,MXN,255;' +
    'Moldovan leu,L,MDL,255;' +
    'Mongolian tÃ¶grÃ¶g,â‚®,MNT,255;' +
    'Moroccan dirham,Ø¯.Ù….,MAD,255;' +
    'Mozambican metical,MTn,MZN,255;' +
    'Myanma kyat,K,MMK,255;' +
    'Namibian dollar,$,NAD,255;' +
    'Nepalese rupee,â‚¨,NPR,255;' +
    'Netherlands Antillean guilder,Æ’,ANG,255;' +
    'New Taiwan dollar,$,TWD,255;' +
    'New Zealand dollar,$,NZD,255;' +
    'Nicaraguan cÃ³rdoba,C$,NIO,255;' +
    'Nigerian naira,â‚¦,NGN,255;' +
    'North Korean won,â‚©,KPW,255;' +
    'Norwegian krone,kr,NOK,255;' +
    'Omani rial,Ø±.Ø¹.,OMR,255;' +
    'Pakistani rupee,â‚¨,PKR,255;' +
    'Panamanian balboa,B/.,PAB,255;' +
    'Papua New Guinean kina,K,PGK,255;' +
    'Paraguayan guaranÃ­,â‚²,PYG,255;' +
    'Peruvian nuevo sol,S/.,PEN,255;' +
    'Philippine peso,â‚±,PHP,255;' +
    'Polish zÅ‚oty,zÅ‚,PLN,255;' +
    'Qatari riyal,Ø±.Ù‚,QAR,255;' +
    'Romanian leu,L,RON,255;' +
    'Russian ruble,Ñ€.,RUB,255;' +
    'Rwandan franc,Fr,RWF,255;' +
    'Saint Helena pound,Â£,SHP,255;' +
    'Salvadoran colÃ³n,â‚¡,SVC,255;' +
    'Samoan tala,T,WST,255;' +
    'SÃ£o TomÃ© and PrÃ­ncipe dobra,Db,STD,255;' +
    'Saudi riyal,Ø±.Ø³,SAR,255;' +
    'Serbian dinar,din.,RSD,255;' +
    'Seychellois rupee,â‚¨,SCR,255;' +
    'Sierra Leonean leone,Le,SLL,255;' +
    'Singapore dollar,$,SGD,255;' +
    'Solomon Islands dollar,$,SBD,255;' +
    'Somali shilling,Sh,SOS,255;' +
    'South African rand,R,ZAR,255;' +
    'South Korean won,â‚©,KRW,255;' +
    'Sri Lankan rupee,Rs,LKR,255;' +
    'Sudanese pound,Â£,SDG,255;' +
    'Surinamese dollar,$,SRD,255;' +
    'Swazi lilangeni,L,SZL,255;' +
    'Swedish krona,kr,SEK,255;' +
    'Swiss franc,Fr,CHF,255;' +
    'Syrian pound,Â£,SYP,255;' +
    'Tajikistani somoni,Ð…Ðœ,TJS,255;' +
    'Tanzanian shilling,Sh,TZS,255;' +
    'Thai baht,à¸¿,THB,255;' +
    'Tongan paÊ»anga,T$,TOP,255;' +
    'Trinidad and Tobago dollar,$,TTD,255;' +
    'Tunisian dinar,Ø¯.Øª,TND,255;' +
    'Turkish lira,TL,TRY,255;' +
    'Turkmenistani manat,m,TMT,255;' +
    'Ugandan shilling,Sh,UGX,255;' +
    'Ukrainian hryvnia,â‚´,UAH,255;' +
    'United Arab Emirates dirham,Ø¯.Ø¥,AED,255;' +
    'United States dollar,$,USD,1;' +
    'Uruguayan peso,$,UYU,255;' +
    'Uzbekistani som,Ð»Ð²,UZS,255;' +
    'Vanuatu vatu,Vt,VUV,255;' +
    'Venezuelan bolÃ­var,Bs F,VEF,255;' +
    'Vietnamese Ä‘á»“ng,â‚«,VND,255;' +
    'West African CFA franc,Fr,XOF,255;' +
    'Yemeni rial,ï·¼,YER,255;' +
    'Zambian kwacha,ZK,ZMK,255;' +
    'Zimbabwean dollar,$,ZWL,255';

  var ib_initCurrencies = function() {
    $.each(ib_raw_currencies.split(';'), function(idx, val) {
      var tmp_curr = val.split(',');
      ib_currencies.push({ name: tmp_curr[0], symbol: tmp_curr[1], code: tmp_curr[2], priority: tmp_curr[3] });
    });
  };

  var ib_initTypeahead = function() {
    var number_settings = 
      $('<ib-span class="ib_number_settings">' +
          '<table>' +

            '<tr>' +
              '<td>' +
                '<input type="radio" id="ib_currency_left" name="ib_currency" value="left" checked />' +
                '<label for="ib_currency_left" title="' + ib_languages[ib_lang].currency_left + '">$100</label>' +
              '</td>' +
              '<td>' +
                '<input type="radio" id="ib_number_format_1" name="ib_number_format" value="0,000.00" checked />' +
                '<label for="ib_number_format_1">1,234.56</label>' +
              '</td>' +
            '</tr>' +

            '<tr>' +
              '<td>' +
                '<input type="radio" id="ib_currency_right" name="ib_currency" value="right" />' +
                '<label for="ib_currency_right" title="' + ib_languages[ib_lang].currency_right + '">100$</label>' +
              '</td>' +
              '<td>' +
                '<input type="radio" id="ib_number_format_3" name="ib_number_format" value="0 000.00" />' +
                '<label for="ib_number_format_3">1&#8239;234.56</label>' +
              '</td>' +
            '</tr>' +

            '<tr>' +
              '<td></td>' +
              '<td>' +
                '<input type="radio" id="ib_number_format_2" name="ib_number_format" value="0000.00" />' +
                '<label for="ib_number_format_2">1234.56</label>' +
              '</td>' +
            '</tr>' +

            '<tr>' +
              '<td></td>' +
              '<td>' +
                '<input type="radio" id="ib_number_format_4" name="ib_number_format" value="0.000,00" />' +
                '<label for="ib_number_format_4">1.234,56</label>' +
              '</td>' +
            '</tr>' +

            '<tr>' +
              '<td></td>' +
              '<td>' +
                '<input type="radio" id="ib_number_format_6" name="ib_number_format" value="0 000,00" />' +
                '<label for="ib_number_format_6">1&#8239;234,56</label>' +
              '</td>' +
            '</tr>' +

            '<tr>' +
              '<td></td>' +
              '<td>' +
                '<input type="radio" id="ib_number_format_5" name="ib_number_format" value="0000,00" />' +
                '<label for="ib_number_format_5">1234,56</label>' +
              '</td>' +
            '</tr>' +

            '<tr>' +
              '<td colspan="2" class="ib_show_currency">' +
                '<input type="checkbox" id="ib_show_currency" name="ib_show_currency" />' +
                '<label for="ib_show_currency" title="Checking this will show the currency symbol on all amounts on the invoice">Show currency symbol</label>' +
              '</td>' +
            '</tr>' +

          '</table>' +
        '</ib-span>')
        .hover(
          function() {
            $(this).show();
          },
          function() {
            $(this).hide();
          }
        );

    $(document.body).after(number_settings);
    
    $('[data-ibcl-id="currency"]')
      .typeahead({
          source: function (query, process) {
            ib_currencies_combo = [];

            $.each(ib_currencies, function (idx, val) {
              ib_currencies_combo.push('<ib-span data-code=\'' + val.code + '\' data-symbol=\'' + val.symbol + '\' class="ib_currencies_item"><ib-span>' + val.code + '</ib-span><ib-span>' + val.symbol + '</ib-span><ib-span>' + val.name + '</ib-span></ib-span>');
            });
         
            process(ib_currencies_combo);
          },
          updater: function (item) {
            ib_currency_symbol = $(item).data('symbol');
            ib_calculateTotals();
            
            return $(item).data('code');
          },
          matcher: function (item) {
            if ($(item).text().toLowerCase().indexOf(this.query.trim().toLowerCase()) != -1)
              return true;
          },
          sorter: function (items) {
            return items.sort();
          },
          highlighter: function (item) {
            var text1 = $(item).children(':first').text();
            var text2 = $(item).children(':nth(1)').text();
            var text3 = $(item).children(':last').text();
            
            var html = $(item).text('').prop('outerHTML');

            var regex = new RegExp('(' + this.query + ')', 'gi');
            var bold = '<strong style="font-weight:bold;">$1</strong>';
            return $(html)
                      .html($('<ib-span />').html(text1.replace(regex, bold)).prop('outerHTML') + 
                            $('<ib-span />').html(text2.replace(regex, bold)).prop('outerHTML') +
                            $('<ib-span />').html(text3.replace(regex, bold)).prop('outerHTML'))
                      .prop('outerHTML');
          },
      })
      .blur(function(e) {
        var $this = $(this), currency = $(this).text().toUpperCase();
        ib_currency_symbol = '';
        $this.text(currency);
        
        $.each(ib_currencies, function(idx, val) {
          if(val.code.toUpperCase() == currency)
          {
            $this.text(val.code);
            ib_currency_symbol = val.symbol;
            ib_calculateTotals();
            return;
          }
        });
      })
      .hover(
        function() {
          var offset = $(this).offset(), width = $(this).width();
          number_settings.show().offset({ top: offset.top - 5, left: offset.left + width + 1 });
        },
        function() {
          number_settings.hide();
        }
      );

    $('[name="ib_currency"][value="' + ib_currency_position + '"]').attr('checked','checked');

    if(JSON.parse(ib_show_currency))
      $('[name="ib_show_currency"]').attr('checked','checked');

    $('[name="ib_number_format"][value="' + ib_number_format + '"]').attr('checked','checked');

    $('[name="ib_currency"]').change(function(e) {
      ib_currency_position = $(this).val();
      ib_calculateTotals();
    });

    $('[name="ib_show_currency"]').change(function(e) {
      ib_show_currency = $(this).is(':checked');
      ib_calculateTotals();
    });

    $('[name="ib_number_format"]').change(function(e) {
      ib_number_format = $(this).val();
      if(ib_number_format) {
        ib_decimal_separator   = ib_number_format[ib_number_format.length - 3];
        ib_thousands_separator = ib_number_format[1];
        if(!isNaN(parseInt(ib_thousands_separator)))
          ib_thousands_separator = '';
      }

      var rows = $('[data-iterate="item"]');
      for(var i = 0; i < rows.length; i++)
      {
        var row = $(rows[i]);

        row.find('[data-ibcl-id="item_quantity"]').text(row.find('[data-ibcl-id="item_quantity"]').text().replace(/[.,]/g, ib_decimal_separator));
        row.find('[data-ibcl-id="item_price"]').text(row.find('[data-ibcl-id="item_price"]').text().replace(/[.,]/g, ib_decimal_separator));
        row.find('[data-ibcl-id="item_discount"]').text(row.find('[data-ibcl-id="item_discount"]').text().replace(/[.,]/g, ib_decimal_separator));
        row.find('[data-ibcl-id="item_tax"]').text(row.find('[data-ibcl-id="item_tax"]').text().replace(/[.,]/g, ib_decimal_separator));
      }

      $('[data-ibcl-id="amount_paid"]').text($('[data-ibcl-id="amount_paid"]').text().replace(/[.,]/g, ib_decimal_separator));

      ib_calculateTotals();
    });
  };

  /**
   * Get invoice data
   */
  var ib_getInvoiceData = function() {
    var data = {
      'hash'                   : '',
      'type'                   : 'invoice',
      'company_logo'           : '',
      'company_name'           : '',
      'company_address'        : '',
      'company_city_zip_state' : '',
      'company_phone_fax'      : '',
      'company_email_web'      : '',
      'payment_info1'          : '',
      'payment_info2'          : '',
      'payment_info3'          : '',
      'payment_info4'          : '',
      'payment_info5'          : '',
      'issue_date_label'       : '',
      'issue_date'             : '',
      'net_term_label'         : '',
      'net_term'               : '0',
      'due_date_label'         : '',
      'due_date'               : '',
      'currency_label'         : '',
      'po_number_label'        : '',
      'po_number'              : '',
      'bill_to_label'          : '',
      'client_name'            : '',
      'client_address'         : '',
      'client_city_zip_state'  : '',
      'client_phone_fax'       : '',
      'client_email'           : '',
      'client_other'           : '',
      'invoice_title'          : '',
      'invoice_number'         : '',
      'item_row_number_label'  : '',
      'item_description_label' : '',
      'item_quantity_label'    : '',
      'item_price_label'       : '',
      'item_discount_label'    : '',
      'item_tax_label'         : '',
      'item_line_total_label'  : '',
      'amount_subtotal_label'  : '',
      'amount_subtotal'        : '0',
      'amount_total_label'     : '',
      'amount_total'           : '0',
      'amount_paid_label'      : '',
      'amount_paid'            : '0',
      'amount_due_label'       : '',
      'amount_due'             : '0',
      'terms_label'            : '',
      'terms'                  : '',
      'items_columns'          : [],
      'items'                  : [],
      'taxes'                  : [],
      'date_format'            : '',
      'currency_code'          : '',
      'currency_symbol'        : '',
      'currency_position'      : '',
      'show_currency'          : 'true',
      'number_format'          : '',
      'lang'                   : 'en',
      'document_custom'        : [],
      'client_custom'          : []
    };

    data.hash = $('meta[name="template-hash"]').attr('content') || data.hash;

    data.type = $('meta[name="document-type"]').attr('content') || data.type;

    if($('[data-logo="company_logo"]').is(':visible'))
      data.company_logo = $('[data-logo="company_logo"]').attr('src') || data.company_logo;
    
    $('[data-ibcl-id]').each(function(idx, val) {
      var el = $(val);
      
      data[el.data('ibcl-id')] = ib_stripHtml(ib_fixNewlines(el.html())) || data[el.data('ibcl-id')];
    });

    if(!data.net_term)
      data.net_term = Math.floor(Math.abs((ib_due_date.getTime() - ib_issue_date.getTime()) / (24 * 60 * 60 * 1000)));

    // Get the displayed columns
    $('.ib_show_hide_columns > ib-span > input:checkbox').each(function(idx, chk) {
      if($(chk).is(':checked'))
        data.items_columns.push($(chk).val());
    });
    
    // Clear the obsolete item properties, as we'll get all items from the table
    delete data.item_row_number;
    delete data.item_description;
    delete data.item_quantity;
    delete data.item_price;
    delete data.item_discount;
    delete data.item_tax;
    delete data.item_line_total;
    
    $('[data-iterate="item"]').each(function(idx, val) {
      var item_row = {};
      $(val).find('*').each(function(i, v) {
        var el = $(v);
        if(el.data('ibcl-id') && ['item_row_number', 'item_description', 'item_quantity', 'item_price', 'item_tax_percentage', 'item_tax', 'item_discount', 'item_line_total'].indexOf(el.data('ibcl-id')) != -1)
        {
          if(!el.data('ibcl-id') && ib_isIE()) // For IE get the data from editable spans
            el = el.find('.ibcl_ie_contenteditable');

          item_row[el.data('ibcl-id')] = ib_stripHtml(ib_fixNewlines(el.html()));
        }
      });

      item_row.item_row_number     = $(item_row.item_row_number).text();
      item_row.item_quantity       = item_row.item_quantity.toValidNumberString();
      item_row.item_price          = item_row.item_price.toValidNumberString();
      item_row.item_tax_percentage = item_row.item_tax.toValidNumberString();
      item_row.item_tax            = ib_getTaxName(item_row.item_tax.toValidNumberString());
      item_row.item_discount       = item_row.item_discount.toValidNumberString();
      item_row.item_line_total     = item_row.item_line_total.toValidNumberString();
      
      data.items.push(item_row);
    });
    
    // Clear the obsolete tax properties, as we'll get all taxes from the table
    delete data.tax_name;
    delete data.tax_value;

    $('[data-iterate="tax"]:visible').each(function(idx, val) {
      var tax_row = {};
      $(val).find('*').each(function(i, v) {
        var el = $(v);
        if(el.data('ibcl-id') && ['tax_name', 'tax_value'].indexOf(el.data('ibcl-id')) != -1)
        {
          if(!el.data('ibcl-id') && ib_isIE()) // For IE get the data from editable spans
            el = el.find('.ibcl_ie_contenteditable');

          tax_row[el.data('ibcl-id')] = ib_stripHtml(ib_fixNewlines(el.html()));
          if(el.attr('data-ib-value'))
            tax_row.tax_percentage = el.attr('data-ib-value').toValidNumberString();
        }
      });

      tax_row.tax_value = tax_row.tax_value.toValidNumberString();
      
      data.taxes.push(tax_row);
    });

    data.amount_subtotal = data.amount_subtotal.toValidNumberString();
    data.amount_total    = data.amount_total.toValidNumberString();
    data.amount_paid     = data.amount_paid.toValidNumberString();
    data.amount_due      = data.amount_due.toValidNumberString();
    
    // Get the date format
    data.date_format = ib_data.date_format;

    // Get currency properties
    data.currency_code     = data.currency;
    data.currency_symbol   = ib_currency_symbol;
    delete data.currency;  // Delete the old currency property

    data.currency_position = $('.ib_number_settings input[name="ib_currency"]:checked').val();
    data.show_currency     = $('.ib_number_settings input[name="ib_show_currency"]').is(':checked');
    data.number_format     = $('.ib_number_settings input[name="ib_number_format"]:checked').val();

    // Properly structure custom document and client fields
    for(var key in data) {
      if(/document_custom_[a-zA-Z0-9_]+/.test(key))
      {
        data.document_custom.push({
          name:  key.replace(/document_custom_([a-zA-Z0-9_]+)/, '$1'),
          type:  'constant',
          value: data[key]
        });

        delete data[key];
      }
      else if(/client_custom_[a-zA-Z0-9_]+/.test(key))
      {
        data.client_custom.push({
          name:  key.replace(/client_custom_([a-zA-Z0-9_]+)/, '$1'),
          value: data[key]
        });

        delete data[key];
      }
    }

    return data;
  };

  /**
   * Save invoice to Invoicebus
   */
  var ib_is_saving = false;

  var ib_saveInvoice = function() {
    if (ib_is_saving) return;

    ib_is_saving = true;

    // Add spinner so we know that something is happening
    $(this)
        .addClass('ib_disabled_button')
        .attr('disabled', 'disabled')
        .find('i.fa')
        .removeClass('fa-cloud-upload')
        .addClass('fa-spinner fa-spin');

    // Get the invoice data
    var invoiceData = ib_getInvoiceData();

    // Send the data to the server using AJAX
    $.ajax({
        url: 'save_invoice.php', // URL to your PHP script
        type: 'POST',
        data: { invoice_data: JSON.stringify(invoiceData) },
        success: function(response) {
            // Handle success response
            console.log('Invoice saved successfully:', response);
            // Optionally, you can redirect or show a success message
        },
        error: function(xhr, status, error) {
            // Handle error response
            console.error('Error saving invoice:', error);
        },
        complete: function() {
            // Reset the button state
            ib_is_saving = false;
            $('#ib-save-data-btn')
                .removeClass('ib_disabled_button')
                .removeAttr('disabled')
                .find('i.fa')
                .removeClass('fa-spinner fa-spin')
                .addClass('fa-cloud-upload');
        }
    });
};

  /*var ib_saveInvoice = function() {
    if(ib_is_saving)
      return;

    ib_is_saving = true;

    // Add spinner so we know that something is happening
    $(this)
      .addClass('ib_disabled_button')
      .attr('disabled', 'disabled')
      .find('i.fa')
      .removeClass('fa-cloud-upload')
      .addClass('fa-spinner fa-spin');
    
    // Escape the data for sending in form post
    var data = $('<div />').text(JSON.stringify(ib_getInvoiceData())).html().replace(/"/gi, '&quot;');

    // Build dynamic form where the data will be submitted
    SAVE_URL += TRACKING + '&utm_term=' + encodeURIComponent(document.title); //&utm_content=
    $('<form id="ib_save_tamplate_form" style="display:none !important;" action="' + SAVE_URL + '" method="POST" />')
      .append($('<input type="hidden" name="invoice_data" value="' + data + '" />'))
      .appendTo($(document.body)).submit();
  }; */

  /**
   * Prepare currend data for download
   */
  var ib_getCurrentState = function() {
    var raw_data = ib_multiline.stripIndent(ib_raw_data).replace(/\\\//g, '/').replace(/'/g, "\\'").replace(/\r\n/g, '[crlf]');
    var invoice_data = ib_getInvoiceData();
    var i;

    raw_data = raw_data.replace('|item_row_number|', ib_data['{item_row_number}'].default_text);
    raw_data = raw_data.replace('|item_description|', ib_data['{item_description}'].default_text);
    raw_data = raw_data.replace('|item_quantity|', ib_data['{item_quantity}'].default_text);
    raw_data = raw_data.replace('|item_price|', ib_data['{item_price}'].default_text);
    raw_data = raw_data.replace('|item_discount|', ib_data['{item_discount}'].default_text);
    raw_data = raw_data.replace('|item_tax|', ib_data['{item_tax}'].default_text);
    raw_data = raw_data.replace('|item_line_total|', ib_data['{item_line_total}'].default_text);
    raw_data = raw_data.replace('|tax_name|', ib_data['{tax_name}'].default_text);
    raw_data = raw_data.replace('|tax_value|', ib_data['{tax_value}'].default_text);
    raw_data = raw_data.replace('|amount_total|', ib_data['{amount_total}'].default_text);
    raw_data = raw_data.replace('|amount_due|', ib_data['{amount_due}'].default_text);

    raw_data = raw_data.replace('|default_quantity|', ib_data.default_quantity);
    raw_data = raw_data.replace('|default_price|', ib_data.default_price);
    raw_data = raw_data.replace('|default_discount|', ib_data.default_discount);
    raw_data = raw_data.replace('|default_tax|', ib_data.default_tax);
    raw_data = raw_data.replace('|default_number_rows|', ib_data.default_number_rows);
    raw_data = raw_data.replace('|auto_calculate_dates|', ib_data.auto_calculate_dates);
    raw_data = raw_data.replace('|load_items|', ib_data.load_items);
    raw_data = raw_data.replace('|invoicebus_fineprint|', ib_data.invoicebus_fineprint);
    raw_data = raw_data.replace('|lang|', ib_lang);

    for(var key in invoice_data)
    {
      var data_key   = '|' + key + '|';
      var data_value = invoice_data[key].toString().replace(/\n/g, '<br />');

      // special cases
      switch(key) {
        case 'issue_date':
        case 'due_date':
          raw_data = raw_data.replace(data_key, '');
          break;

        case 'items_columns':
          raw_data = raw_data.replace('|default_columns|', invoice_data[key].join(','));
          break;

        case 'items':
          data_value = '';
          var items = invoice_data[key];
          for(i = 0; i < items.length; i++)
          {
            data_value += (items[i].item_description    || '').toString().replace(/\n/g, '<br />') + '@||@' +
                          (items[i].item_quantity       || '').toString().replace(/\n/g, '<br />') + '@||@' +
                          (items[i].item_price          || '').toString().replace(/\n/g, '<br />') + '@||@' +
                          (items[i].item_discount       || '').toString().replace(/\n/g, '<br />') + '@||@' +
                          (items[i].item_tax_percentage || '').toString().replace(/\n/g, '<br />') +
                          '\r\n';
          }
          raw_data = raw_data.replace(data_key, data_value);
          break;

        case 'currency_code':
          raw_data = raw_data.replace('|currency|', data_value);
          break;

        case 'document_custom':
        case 'client_custom':
          data_value = '';
          var custom_data = invoice_data[key];
          for(i = 0; i < custom_data.length; i++)
          {
            data_value += (custom_data[i].name  || '').toString().replace(/\n/g, '<br />') + '@||@' +
                          (custom_data[i].value || '').toString().replace(/\n/g, '<br />') +
                          '\r\n';
          }
          raw_data = raw_data.replace(data_key, data_value);
          break;

        default:
          raw_data = raw_data.replace(data_key, data_value);
          break;
      }
      
    }

    raw_data = raw_data.replace(/\[crlf\]/g, '\r\n');

    return raw_data;
  };

  /**
   * Initialize the promo banner if found
   */
  var ib_initPromo = function() {
    var promo = ''.replace(/\[crlf\]/g, '\r\n');

    if(promo)
      $(document.body).before($(promo));
  };

  /**
   * Get URL query variable
   */
  var ib_getQueryVariable = function(variable, query_string)
  {
    var query = query_string || window.location.search.substring(1);
    var vars = query.split("&");

    for (var i=0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable)
        return pair[1];
    }

    return false;
  };

  /*
   * ==================================================================================
   */
  ib_loadJavaScript(JQUERY);

  // Load the external data form data.txt
  var ib_query = ib_getScriptQueryVariables();

  // Set the template language
  var ib_lang          = ib_getQueryVariable('lang') || '';
  if(!ib_languages[ib_lang]) ib_lang = '';
  
  var ib_lang_original = ib_lang;
  var ib_open_data     = ib_getQueryVariable('data');

  var js = document.createElement('script');
  js.onerror = function() {
    js = document.createElement('script');
    js.src = 'data.js';
    document.body.appendChild(js);
  };

  js.src = 'data.txt';
  if(ib_lang) {
    js.src = PATH + 'lang/' + ib_lang + '.txt';
  }
  document.body.appendChild(js);

  if(ib_open_data && ib_open_data.split('.').pop().toLowerCase() == 'txt') {
    js = document.createElement('script');
    js.src = ib_open_data;
    document.body.appendChild(js);
  }

  js = document.createElement('script');
  js.src = PATH + 'docs/raw-data/raw-data-' + (ib_lang || 'en') + '.js';
  document.body.appendChild(js);

  // Start polling...
  ib_checkJQuery(function($) {
    ib_initGenerator();
  });

})();

// ===================================================================
// Author: Denis Howlett <feedback@isocra.com>
// WWW: http://www.isocra.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however we
// would appreciate it if at least the web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download.
// If you wish to share this code with others, please just point them
// to the URL instead.
//
// Please DO NOT link directly to this .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================


/**
 * Encapsulate table Drag and Drop in a class. We'll have this as a Singleton
 * so we don't get scoping problems.
 */
var ib_TableDnD = function(ib_resetRowNumbers) {

  /**
   * Keep hold of the current table being dragged
   */
  var currentTable = null;
  /**
   * Keep hold of the current drag object if any
   */
  this.dragObject = null;
  /**
   * The current mouse offset
   */
  this.mouseOffset = null;
  /**
   * Remember the old value of Y so that we don't do too much processing
   */
  this.oldY = 0;

  /**
   * Initialise the drag and drop by capturing mouse move events
   */
  this.init = function () {
    var rows = $('[data-iterate="item"]');
    for (var i = 0; i < rows.length; i++)
      this.makeDraggable(rows[i]);
    
    /**
     * Capture the onmousemove so that we can see if a row from the current
     * table if any is being dragged.
     * @param ev the event (for Firefox and Safari, otherwise we use window.event for IE)
     */
    document.onmousemove = function (ev) {
      if (currentTable && currentTable.dragObject) {
        ev = ev || window.event;
        var mousePos = currentTable.mouseCoords(ev);
        var y = mousePos.y;
        if (y != currentTable.oldY) {
          // work out if we're going up or down...
          var movingDown = y > currentTable.oldY;
          // update the old value
          currentTable.oldY = y;
          // update the style to show we're dragging
          $(currentTable.dragObject).addClass('ib_dragrow');
          document.body.style.cursor = "move";

          // If we're over a row then move the dragged row to there so that the user sees the
          // effect dynamically
          var currentRow = currentTable.findDropTargetRow(y);
          if (currentRow) {
            if (movingDown && currentTable.dragObject != currentRow) {
              currentTable.dragObject.parentNode.insertBefore(currentTable.dragObject, currentRow.nextSibling);
            } else if (!movingDown && currentTable.dragObject != currentRow) {
              currentTable.dragObject.parentNode.insertBefore(currentTable.dragObject, currentRow);
            }
          }
        }

        return false;
      }
    };

    /**
     * Similarly for the mouseup
     */
    document.onmouseup = function (ev) {
      if (currentTable && currentTable.dragObject) {
        var droppedRow = currentTable.dragObject;
        // If we have a dragObject, then we need to release it,
        // The row will already have been moved to the right place so we just reset stuff
        $(currentTable.dragObject).removeClass('ib_dragrow');
        
        currentTable.dragObject = null;
        // And then call the onDrop method in case anyone wants to do any post processing
        currentTable.onDrop(droppedRow);
        currentTable = null; // let go of the table too
      }
    };
  };

  /**
   * This function is called when you drop a row, so redefine it in your code
   * to do whatever you want, for example use Ajax to update the server
   */
  this.onDrop = function (droppedRow) {
    document.body.style.cursor = "default";
    ib_resetRowNumbers();
  };

  /**
   * Get the scroll X and Y position
   */
  var getScrollXY = function () {
    var scrOfX = 0, scrOfY = 0;
    if (typeof (window.pageYOffset) == 'number') {
      //Netscape compliant
      scrOfY = window.pageYOffset;
      scrOfX = window.pageXOffset;
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
      //DOM compliant
      scrOfY = document.body.scrollTop;
      scrOfX = document.body.scrollLeft;
    } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
      //IE6 standards compliant mode
      scrOfY = document.documentElement.scrollTop;
      scrOfX = document.documentElement.scrollLeft;
    }
    return [scrOfX, scrOfY];
  };

  /**
   * Get the mouse coordinates from the event (allowing for browser differences)
   */
  this.mouseCoords = function (ev) {
    if (ev.pageX || ev.pageY) {
      return { x: ev.pageX, y: ev.pageY };
    }
    return {
      x: ev.clientX + getScrollXY()[0],
      y: ev.clientY + getScrollXY()[1]
    };
  };

  /**
   * Given a target element and a mouse event, get the mouse offset from that element.
   * To do this we need the element's position and the mouse position
   */
  this.getMouseOffset = function (target, ev) {
    e = ev || window.event;

    var docPos = $(target).offset();
    var mousePos = this.mouseCoords(e);
    return { x: mousePos.x - docPos.left, y: mousePos.y - docPos.top };
  };

  /**
   * Get the source element from an event in a way that works for IE and Firefox and Safari
   * @param evt the source event for Firefox (but not IE--IE uses window.event)
   */
  var getEventSource = function (evt) {
    if (window.event) {
      evt = window.event; // For IE
      return evt.srcElement;
    } else {
      return evt.target; // For Firefox
    }
  };

  /**
   * Take an item and add an onmousedown method so that we can make it draggable
   */
  this.makeDraggable = function (item) {
    if (!item) return;
    var self = this; // Keep the context of the TableDnd inside the function
    $(item).find('.ib_move').on('mousedown', function (ev) {
      // Need to check to see if we are an input or not, if we are an input, then return true to allow normal processing
      var target = getEventSource(ev);
      if (target.tagName == 'INPUT' || target.tagName == 'SELECT' || target.tagName == 'TEXTAREA') return true;
      currentTable = self;
      self.dragObject = item;
      self.mouseOffset = self.getMouseOffset(item, ev);
      return false;
    });
    $(item).find('.ib_move').css("cursor", "move");
  };

  /**
   * We're only worried about the y position really, because we can only move rows up and down
   */
  this.findDropTargetRow = function (y) {
    var rows = $('[data-iterate="item"]');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var rowY = $(row).offset().top;
      var rowHeight = parseInt(row.offsetHeight);
      if (row.offsetHeight === 0) {
        rowY = $(row.firstChild).offset().top;
        rowHeight = parseInt(row.firstChild.offsetHeight);
      }
      // Because we always have to insert before, we need to offset the height a bit
      if ((y > rowY - rowHeight) && (y < (rowY + rowHeight))) {
        // that's the row we're over
        return row;
      }
    }
    return null;
  };

};

/* =========================================================
 * bootstrap-datepicker.js 
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

var ib_loadBootstrapDatepicker = function() {

  // Picker object
  var Datepicker = function(element, options) {
    this.element = $(element);
    this.format = DPGlobal.parseFormat(options.format||this.element.data('date-format')||'mm/dd/yyyy');
    this.picker = $(DPGlobal.template)
                      .appendTo('body')
                      .on({
                        click: $.proxy(this.click, this)//,
                        //mousedown: $.proxy(this.mousedown, this)
                      });
    this.isInput = this.element.is('input');
    this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
    
    if (this.isInput) {
      this.element.on({
        focus: $.proxy(this.show, this),
        //blur: $.proxy(this.hide, this),
        keyup: $.proxy(this.update, this)
      });
    } else {
      if (this.component){
        this.component.on('click', $.proxy(this.show, this));
      } else {
        this.element.on('click', $.proxy(this.show, this));
      }
    }
  
    this.minViewMode = options.minViewMode||this.element.data('date-minviewmode')||0;
    if (typeof this.minViewMode === 'string') {
      switch (this.minViewMode) {
        case 'months':
          this.minViewMode = 1;
          break;
        case 'years':
          this.minViewMode = 2;
          break;
        default:
          this.minViewMode = 0;
          break;
      }
    }
    this.viewMode = options.viewMode||this.element.data('date-viewmode')||0;
    if (typeof this.viewMode === 'string') {
      switch (this.viewMode) {
        case 'months':
          this.viewMode = 1;
          break;
        case 'years':
          this.viewMode = 2;
          break;
        default:
          this.viewMode = 0;
          break;
      }
    }
    this.startViewMode = this.viewMode;
    this.weekStart = options.weekStart||this.element.data('date-weekstart')||0;
    this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
    this.onRender = options.onRender;
    this.fillDow();
    this.fillMonths();
    this.update();
    this.showMode();
  };
  
  Datepicker.prototype = {
    constructor: Datepicker,
    
    show: function(e) {
      this.picker.show();
      this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
      this.place();
      $(window).on('resize', $.proxy(this.place, this));
      if (e ) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (!this.isInput) {
      }
      var that = this;
      $(document).on('mousedown', function(ev){
        if ($(ev.target).closest('.datepicker').length === 0) {
          that.hide();
        }
      });
      this.element.trigger({
        type: 'show',
        date: this.date
      });
      this.fill();
    },
    
    hide: function(){
      this.picker.hide();
      $(window).off('resize', this.place);
      this.viewMode = this.startViewMode;
      this.showMode();
      if (!this.isInput) {
        $(document).off('mousedown', this.hide);
      }
      //this.set();
      this.element.trigger({
        type: 'hide',
        date: this.date
      });
    },
    
    set: function() {
      var formated = DPGlobal.formatDate(this.date, this.format);
      if (!this.isInput) {
        if (this.component){
          this.element.find('input').prop('value', formated);
        }
        this.element.data('date', formated);
      } else {
        this.element.prop('value', formated);
      }
    },
    
    setValue: function(newDate) {
      if (typeof newDate === 'string') {
        this.date = DPGlobal.parseDate(newDate, this.format);
      } else {
        this.date = new Date(newDate);
      }
      this.set();
      this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
      this.fill();
    },
    
    setFormat: function(newFormat) {
      this.format = DPGlobal.parseFormat(newFormat);
      var formated = DPGlobal.formatDate(this.date, this.format);
      if (!this.isInput) {
        if (this.component){
          this.element.find('input').prop('value', formated);
        }
        this.element.data('date', formated);
      } else {
        this.element.prop('value', formated);
      }
      this.set();
      this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
      this.fill();
    },
    
    place: function(){
      var offset = this.component ? this.component.offset() : this.element.offset();
      this.picker.css({
        top: offset.top + this.height,
        left: offset.left + (this.element.width() / 2)
      });
    },
    
    update: function(newDate){
      this.date = DPGlobal.parseDate(
        typeof newDate === 'string' ? newDate : (this.isInput ? this.element.prop('value') : this.element.data('date')),
        this.format
      );
      this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
      this.fill();
    },
    
    fillDow: function(){
      var dowCnt = this.weekStart;
      var html = '<tr>';
      while (dowCnt < this.weekStart + 7) {
        html += '<th class="dow">'+DPGlobal.dates.daysMin[(dowCnt++)%7]+'</th>';
      }
      html += '</tr>';
      this.picker.find('.datepicker-days thead').append(html);
    },
    
    fillMonths: function(){
      var html = '';
      var i = 0;
      while (i < 12) {
        html += '<ib-span class="month">'+DPGlobal.dates.monthsShort[i++]+'</ib-span>';
      }
      this.picker.find('.datepicker-months td').append(html);
    },
    
    fill: function() {
      var d = new Date(this.viewDate),
        year = d.getFullYear(),
        month = d.getMonth(),
        currentDate = this.date.valueOf();
      this.picker.find('.datepicker-days th:eq(1)')
            .text(DPGlobal.dates.months[month]+' '+year);
      var prevMonth = new Date(year, month-1, 28,0,0,0,0),
        day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
      prevMonth.setDate(day);
      prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7)%7);
      var nextMonth = new Date(prevMonth);
      nextMonth.setDate(nextMonth.getDate() + 42);
      nextMonth = nextMonth.valueOf();
      var html = [];
      var clsName,
        prevY,
        prevM;
      while(prevMonth.valueOf() < nextMonth) {
        if (prevMonth.getDay() === this.weekStart) {
          html.push('<tr>');
        }
        clsName = this.onRender(prevMonth);
        prevY = prevMonth.getFullYear();
        prevM = prevMonth.getMonth();
        if ((prevM < month &&  prevY === year) ||  prevY < year) {
          clsName += ' old';
        } else if ((prevM > month && prevY === year) || prevY > year) {
          clsName += ' new';
        }
        if (prevMonth.valueOf() === currentDate) {
          clsName += ' active';
        }
        html.push('<td class="day '+clsName+'">'+prevMonth.getDate() + '</td>');
        if (prevMonth.getDay() === this.weekEnd) {
          html.push('</tr>');
        }
        prevMonth.setDate(prevMonth.getDate()+1);
      }
      this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
      var currentYear = this.date.getFullYear();
      
      var months = this.picker.find('.datepicker-months')
            .find('th:eq(1)')
              .text(year)
              .end()
            .find('ib-span').removeClass('active');
      if (currentYear === year) {
        months.eq(this.date.getMonth()).addClass('active');
      }
      
      html = '';
      year = parseInt(year/10, 10) * 10;
      var yearCont = this.picker.find('.datepicker-years')
                .find('th:eq(1)')
                  .text(year + '-' + (year + 9))
                  .end()
                .find('td');
      year -= 1;
      for (var i = -1; i < 11; i++) {
        html += '<ib-span class="year'+(i === -1 || i === 10 ? ' old' : '')+(currentYear === year ? ' active' : '')+'">'+year+'</ib-span>';
        year += 1;
      }
      yearCont.html(html);
    },
    
    click: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var target = $(e.target).closest('ib-span, td, th');
      if (target.length === 1) {
        var day, month, year;
        switch(target[0].nodeName.toLowerCase()) {
          case 'th':
            switch(target[0].className) {
              case 'switch':
                this.showMode(1);
                break;
              case 'prev':
              case 'next':
                this.viewDate['set'+DPGlobal.modes[this.viewMode].navFnc].call(
                  this.viewDate,
                  this.viewDate['get'+DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate) + 
                  DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1)
                );
                this.fill();
                this.set();
                break;
            }
            break;
          case 'ib-span':
            if (target.is('.month')) {
              month = target.parent().find('ib-span').index(target);
              this.viewDate.setMonth(month);
            } else {
              year = parseInt(target.text(), 10)||0;
              this.viewDate.setFullYear(year);
            }
            if (this.viewMode !== 0) {
              this.date = new Date(this.viewDate);
              this.element.trigger({
                type: 'changeDate',
                date: this.date,
                viewMode: DPGlobal.modes[this.viewMode].clsName
              });
            }
            this.showMode(-1);
            this.fill();
            this.set();
            break;
          case 'td':
            if (target.is('.day') && !target.is('.disabled')){
              day = parseInt(target.text(), 10)||1;
              month = this.viewDate.getMonth();
              if (target.is('.old')) {
                month -= 1;
              } else if (target.is('.new')) {
                month += 1;
              }
              year = this.viewDate.getFullYear();
              this.date = new Date(year, month, day,0,0,0,0);
              this.viewDate = new Date(year, month, Math.min(28, day),0,0,0,0);
              this.fill();
              this.set();
              this.element.trigger({
                type: 'changeDate',
                date: this.date,
                viewMode: DPGlobal.modes[this.viewMode].clsName
              });
            }
            break;
        }
      }
    },
    
    mousedown: function(e){
      e.stopPropagation();
      e.preventDefault();
    },
    
    showMode: function(dir) {
      if (dir) {
        this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir));
      }
      this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
    }
  };
  
  $.fn.datepicker = function ( option, val ) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('datepicker'),
        options = typeof option === 'object' && option;
      if (!data) {
        $this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults,options))));
      }
      if (typeof option === 'string') data[option](val);
    });
  };

  $.fn.datepicker.defaults = {
    onRender: function(date) {
      return '';
    }
  };
  $.fn.datepicker.Constructor = Datepicker;
  
  var DPGlobal = {
    modes: [
      {
        clsName: 'days',
        navFnc: 'Month',
        navStep: 1
      },
      {
        clsName: 'months',
        navFnc: 'FullYear',
        navStep: 1
      },
      {
        clsName: 'years',
        navFnc: 'FullYear',
        navStep: 10
    }],
    dates:{
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    isLeapYear: function (year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    },
    getDaysInMonth: function (year, month) {
      return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
    parseFormat: function(format){
      var separator = format.match(/[.\/\-\s].*?/),
        parts = format.split(/\W+/);
      if (!separator || !parts || parts.length === 0){
        throw new Error("Invalid date format.");
      }
      return {separator: separator, parts: parts};
    },
    parseDate: function(date, format) {
      var parts = date.split(format.separator), val;
      date = new Date();
          
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      if (parts.length === format.parts.length) {
        var year = date.getFullYear(), day = date.getDate(), month = date.getMonth();
        for (var i=0, cnt = format.parts.length; i < cnt; i++) {
          val = parseInt(parts[i], 10)||1;
          switch(format.parts[i]) {
            case 'dd':
            case 'd':
              day = val;
              date.setDate(val);
              break;
            case 'mm':
            case 'm':
              month = val - 1;
              date.setMonth(val - 1);
              break;
            case 'yy':
              year = 2000 + val;
              date.setFullYear(2000 + val);
              break;
            case 'yyyy':
              year = val;
              date.setFullYear(val);
              break;
          }
        }
        date = new Date(year, month, day, 0 ,0 ,0);
      }
      return date;
    },
    formatDate: function(date, format){
      var val = {
        d: date.getDate(),
        m: date.getMonth() + 1,
        yy: date.getFullYear().toString().substring(2),
        yyyy: date.getFullYear()
      };
      val.dd = (val.d < 10 ? '0' : '') + val.d;
      val.mm = (val.m < 10 ? '0' : '') + val.m;
      date = [];
      for (var i=0, cnt = format.parts.length; i < cnt; i++) {
        date.push(val[format.parts[i]]);
      }
      return date.join(format.separator);
    },
    headTemplate: '<thead>'+
                    '<tr>'+
                      '<th class="prev">&lsaquo;</th>'+
                      '<th colspan="5" class="switch"></th>'+
                      '<th class="next">&rsaquo;</th>'+
                    '</tr>'+
                  '</thead>',
    contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
  };
  DPGlobal.template = '<div class="datepicker dropdown-menu">'+
                        '<div class="datepicker-days">'+
                          '<table class=" table-condensed">'+
                            DPGlobal.headTemplate+
                            '<tbody></tbody>'+
                          '</table>'+
                        '</div>'+
                        '<div class="datepicker-months">'+
                          '<table class="table-condensed">'+
                            DPGlobal.headTemplate+
                            DPGlobal.contTemplate+
                          '</table>'+
                        '</div>'+
                        '<div class="datepicker-years">'+
                          '<table class="table-condensed">'+
                            DPGlobal.headTemplate+
                            DPGlobal.contTemplate+
                          '</table>'+
                        '</div>'+
                      '</div>';

};

/* =============================================================
 * bootstrap3-typeahead.js v3.0.3
 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
 * =============================================================
 * Original written by @mdo and @fat
 * =============================================================
 * Copyright 2014 Bass Jobsen @bassjobsen
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

var ib_loadBootstrapTypeahead = function() {

  "use strict";
  // jshint laxcomma: true

  /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.typeahead.defaults, options);
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.select = this.options.select || this.select;
    this.autoSelect = typeof this.options.autoSelect == 'boolean' ? this.options.autoSelect : true;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.updater = this.options.updater || this.updater;
    this.source = this.options.source;
    this.delay = typeof this.options.delay == 'number' ? this.options.delay : 250;
    this.$menu = $(this.options.menu);
    this.shown = false;
    this.listen();
    this.showHintOnFocus = typeof this.options.showHintOnFocus == 'boolean' ? this.options.showHintOnFocus : false;
  };

  Typeahead.prototype = {

    constructor: Typeahead,

    select: function () {
      var val = this.$menu.find('.active').data('value');
      if(this.autoSelect || val) {
        this.$element
          .text(this.updater(val))
          .change();
      }
      return this.hide();
    },

    updater: function (item) {
      return item;
    },

    setSource: function (source) {
      this.source = source;
    },

    show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      }), scrollHeight;

      scrollHeight = typeof this.options.scrollHeight == 'function' ?
          this.options.scrollHeight.call() :
          this.options.scrollHeight;

      this.$menu
        //.insertAfter(this.$element)
        .appendTo(document.body)
        .css({
          top: pos.top + pos.height + scrollHeight,
          left: pos.left
        })
        .show();

      this.shown = true;
      return this;
    },

    hide: function () {
      this.$menu.hide();
      this.shown = false;
      return this;
    },

    lookup: function (query) {
      var items;
      if (typeof(query) != 'undefined' && query !== null) {
        this.query = query;
      } else {
        this.query = this.$element.text() ||  '';
      }

      if (this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this;
      }

      var worker = $.proxy(function() {
        items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source;
        if (items) {
          this.process(items);
        }
      }, this);

      clearTimeout(this.lookupWorker);
      this.lookupWorker = setTimeout(worker, this.delay);
    },

    process: function (items) {
      var that = this;

      items = $.grep(items, function (item) {
        return that.matcher(item);
      });

      items = this.sorter(items);

      if (!items.length) {
        return this.shown ? this.hide() : this;
      }

      if (this.options.items == 'all') {
        return this.render(items).show();
      } else {
        return this.render(items.slice(0, this.options.items)).show();
      }
    },

    matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase());
    },

    sorter: function (items) {
      var beginswith = [],
          caseSensitive = [],
          caseInsensitive = [],
          item;

      while ((item = items.shift())) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
        else if (~item.indexOf(this.query)) caseSensitive.push(item);
        else caseInsensitive.push(item);
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    },

    highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>';
      });
    },

    render: function (items) {
      var that = this;

      items = $(items).map(function (i, item) {
        i = $(that.options.item).data('value', item);
        i.find('a').html(that.highlighter(item));
        return i[0];
      });

      if (this.autoSelect) {
        items.first().addClass('active');
      }
      this.$menu.html(items);
      return this;
    },

    next: function (event) {
      var active = this.$menu.find('.active').removeClass('active'),
          next = active.next();

      if (!next.length) {
        next = $(this.$menu.find('li')[0]);
      }

      next.addClass('active');
    },

    prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active'),
          prev = active.prev();

      if (!prev.length) {
        prev = this.$menu.find('li').last();
      }

      prev.addClass('active');
    },

    listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus,     this))
        .on('blur',     $.proxy(this.blur,      this))
        .on('keypress', $.proxy(this.keypress,  this))
        .on('keyup',    $.proxy(this.keyup,     this));

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this));
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this));
    },
    
    destroy : function () {
      this.$element.data('typeahead',null);
      this.$element
        .off('focus')
        .off('blur')
        .off('keypress')
        .off('keyup');

      if (this.eventSupported('keydown')) {
        this.$element.off('keydown');
      }

      this.$menu.remove();
    },
    
    eventSupported: function(eventName) {
      var isSupported = eventName in this.$element;
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;');
        isSupported = typeof this.$element[eventName] === 'function';
      }
      return isSupported;
    },

    move: function (e) {
      if (!this.shown) return;

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault();
          break;

        case 38: // up arrow
          e.preventDefault();
          this.prev();
          break;

        case 40: // down arrow
          e.preventDefault();
          this.next();
          break;
      }

      e.stopPropagation();
    },

    keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
      if (!this.shown && e.keyCode == 40) {
        this.lookup("");
      } else {
        this.move(e);
      }
    },

    keypress: function (e) {
      if (this.suppressKeyPressRepeat) return;
      this.move(e);
    },

    keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break;

        case 9: // tab
        case 13: // enter
          if (!this.shown) return;
          this.select();
          break;

        case 27: // escape
          if (!this.shown) return;
          this.hide();
          break;
        default:
          this.lookup();
      }

      e.stopPropagation();
      e.preventDefault();
    },

    focus: function (e) {
      if (!this.focused) {
        this.focused = true;
        if (this.options.minLength === 0 && !this.$element.text() || this.options.showHintOnFocus) {
          this.lookup();
        }
      }
    },

    blur: function (e) {
      this.focused = false;
      if (!this.mousedover && this.shown) this.hide();
    },

    click: function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.select();
      this.$element.focus();
    },

    mouseenter: function (e) {
      this.mousedover = true;
      this.$menu.find('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    },

    mouseleave: function (e) {
      this.mousedover = false;
      if (!this.focused && this.shown) this.hide();
    }

  };

  /* TYPEAHEAD PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.typeahead;

  $.fn.typeahead = function (option) {
  var arg = arguments;
    return this.each(function () {
      var $this = $(this),
          data = $this.data('typeahead'),
          options = typeof option == 'object' && option;
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)));
      if (typeof option == 'string') {
        if (arg.length > 1) {
          data[option].apply(data, Array.prototype.slice.call(arg ,1));
        } else {
          data[option]();
        }
      }
    });
  };

  $.fn.typeahead.defaults = {
    source: [],
    items: 8,
    menu: '<ul class="typeahead dropdown-menu"></ul>',
    item: '<li><a href="#"></a></li>',
    minLength: 1,
    scrollHeight: 0,
    autoSelect: true
  };

  $.fn.typeahead.Constructor = Typeahead;

  /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old;
    return this;
  };

  /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this);
    if ($this.data('typeahead')) return;
    $this.typeahead($this.data());
  });

};

// Used from https://github.com/sindresorhus/strip-indent and https://github.com/sindresorhus/multiline

var ib_stripIndent = function (str) {
  var match = str.match(/^[ \t]*(?=\S)/gm);

  if (!match) {
    return str;
  }

  var indent = Math.min.apply(Math, match.map(function (el) {
    return el.length;
  }));

  var re = new RegExp('^[ \\t]{' + indent + '}', 'gm');

  return indent > 0 ? str.replace(re, '') : str;
};

// start matching after: comment start block => ! or @preserve => optional whitespace => newline
// stop matching before: last newline => optional whitespace => comment end block
var reCommentContents = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//;

var ib_multiline = function (fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }

  var match = reCommentContents.exec(fn.toString());

  if (!match) {
    throw new TypeError('Multiline comment missing.');
  }

  return match[1];
};

ib_multiline.stripIndent = function (fn) {
  return ib_stripIndent(ib_multiline(fn));
};

var ib_parseData = function(data) {
  var d, i, j, line, custom_data, items = [], parsed_data = {};

  d = data.split('\n');

  function trim(val) {
    return val.trim();
  }

  for(i = 0; i < d.length; i++)
  {
    line = d[i].trim();

    if(line == '#') // this is comment, ignore it
      continue;

    if(line[0] == '[') // this is property, the value is the next line
    {
      var property = line.substring(1, line.length - 1);
      parsed_data[property] = d[i + 1].replace(/\r|\n/g, ''); // clean the new line characters
    }

    if(line == '[default_columns]') // this is special case for [default_columns] because the value should be an array
    {
      parsed_data.default_columns = parsed_data.default_columns.split(',').map(trim);
    }

    if(line == '[items]') // this is special case for [items] because the value is multiline
    {
      j = i + 1;
      line = d[j].replace(/\r|\n/g, ''); // clean the new line characters
      while(line !== '')
      {
        var item = line.split('@||@');
        items.push({
          item_description : item[0],
          item_quantity    : item[1],
          item_price       : item[2],
          item_discount    : item[3],
          item_tax         : item[4]
        });
        j++;
        line = d[j].trim();
      }

      parsed_data.items = items;
    }

    if(line == '[document_custom]') // this is special case for [document_custom] because the value is multiline
    {
      j = i + 1;
      line = d[j].replace(/\r|\n/g, ''); // clean the new line characters
      while(line !== '')
      {
        custom_data = line.split('@||@');
        parsed_data['{document_custom_' + custom_data[0] + '}'] = custom_data[1];
        j++;
        line = d[j].trim();
      }
    }

    if(line == '[client_custom]') // this is special case for [client_custom] because the value is multiline
    {
      j = i + 1;
      line = d[j].replace(/\r|\n/g, ''); // clean the new line characters
      while(line !== '')
      {
        custom_data = line.split('@||@');
        parsed_data['{client_custom_' + custom_data[0] + '}'] =  custom_data[1];
        j++;
        line = d[j].trim();
      }
    }
  }

  delete parsed_data.document_custom;
  delete parsed_data.client_custom;

  return parsed_data;
};