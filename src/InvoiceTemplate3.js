import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import callAddFont from './sunsetfont';

const generateInvoice = (client, books, transporter, packaging,date,LRNO) => {
  const doc = new jsPDF();

  const drawCommonElements = () => {
    doc.setDrawColor(0); // Black color (default)
    doc.setLineWidth(0.5);
    var borderWidth = -7; 
    const rectangleHeight = 5;
    doc.roundedRect(10-borderWidth, 10-borderWidth, doc.internal.pageSize.width - 20+ (2 * borderWidth), doc.internal.pageSize.height - 20+ (2 * borderWidth)+rectangleHeight, 10, 10, 'S');
    doc.roundedRect(50, 20, 110, 10, 2, 2, 'S');
    //const currentDate = new Date();
    //const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    //const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(currentDate);
    callAddFont.call(doc);
    doc.setFont('Sunset-DemiBold Regular'); // Set the font for text
    doc.setFontSize(25);
    doc.text('ORDER - ESTIMATION', 105, 28, { align: 'center' });
    doc.setFontSize(18);
    doc.text('SRI KRISHNA BINDING WORKS', 105, 38, { align: 'center' });
    doc.setFontSize(14);
    doc.text('VIJAYAWADA', 105, 45, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('+91 94415 44936, +91 99511 47195', 105, 52, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 154, 59);
    doc.text(`${client['AGENT']} / ${client['booktype']} `,20,59)

    doc.line(17, 63, 193, 63);
    //console.log(client['shopName'])
    doc.setFontSize(14);
   //doc.text(`${client['Name']},`, 14, 65);
    doc.setFont('helvetica', 'bold');
    doc.text(`${client['shopName']}`, 20, 70);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${client['ADRESS']}, ${client['CITY']}, ${client['district']}, ${client['pin']}`,20,77);
    doc.text(`${client['mobile']}`, 20, 83);
    doc.setFontSize(10);
    doc.text('GOODS ONCE SOLD CANNOT BE TAKEN BACK', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 13, {
      align: 'center',
    });

  };

  drawCommonElements(); // Draw common elements on the first page

  const tableHeaders = [['GBL', 'PARTICULARS', 'Qty', 'Rate', 'Amount']];
  const packingForwardAmount = packaging * calculateTotalQuantity(books);

  const tableData = books.map((book) => [
    book.quantity.toString(),
    book.book['name'],
    (book.quantity * book.book['bundleQuantity']),
    book['rate'].toString(),
    (book.quantity * book['rate'] * book.book['bundleQuantity']).toLocaleString('en-IN'),
  ]);
  let additionalFee = 80;
  let additionalFeeAmount =0;
  if (transporter['name'] === 'GVR' || transporter['name'] === 'CHENNUPATTI CARGO SERVICES') {

    additionalFeeAmount = additionalFee * calculateTotalQuantity(books);
    tableData.push(['', `${transporter['name']}`, `${calculateTotalQuantity(books)}`, additionalFee.toString(), additionalFeeAmount.toString()]);
    }
  tableData.push(
    ['', 'PACKING FORWARD', `${calculateTotalQuantity(books)}`, packaging.toString(), packingForwardAmount.toString()],
    ['', '               Thank You', '', 'Total ', `${calculateTotalAmount(books, packingForwardAmount + additionalFeeAmount).toLocaleString('en-IN')}`]
  );


  const rowsPerPage = 20; // Adjust this based on your content and design
  const chunks = [];

  for (let i = 0; i < tableData.length; i += rowsPerPage) {
    chunks.push(tableData.slice(i, i + rowsPerPage));
  }
  let isLastPage = false;

  chunks.forEach((chunk, chunkIndex) => {
    if (chunkIndex > 0) {
      doc.addPage(); // Add a new page for each chunk
      drawCommonElements(); // Draw common elements on the new page
    }

    // Render table for each chunk
    doc.autoTable({
      head: tableHeaders,
      body: chunk,
      startY: 90,
      margin: {horizontal:18,top: 20},
      startX: 40,
      tableWidth: 174,
      theme: 'grid',
      headStyles: {
        fillColor: false,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],

      },
      columnStyles: {
        0: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'right' },
    },        
      styles: {
        fontSize: 12,
        valign: 'middle',
        lineWidth: 0.1,

      },
      didDrawPage: function (data) {
        // Check if this is the last page
        if (chunkIndex === chunks.length - 1) {
          // This is the last page, so set the isLastPage variable to true
          isLastPage = true;
        }
      },

    });

  });
  
  if (isLastPage) {
    doc.text(`Transporter: ${transporter['name']}`, 24, doc.autoTable.previous.finalY + 5);
    if (LRNO !== null) {
      doc.text(`LR NO..${LRNO}`, 24, doc.autoTable.previous.finalY + 10);
    }
    doc.setFontSize(12);
    doc.text('Signature :',130,doc.internal.pageSize.height - 24)
  }
  // Continue with the rest of your code

  return doc;
};

const calculateTotalQuantity = (books) => {
  return books.reduce((total, book) => total + parseInt(book.quantity), 0);
};

const calculateTotalAmount = (books, packaging) => {
  const totalAmount = books.reduce((total, book) => total + book.quantity * book['rate'] * book.book['bundleQuantity'], 0);
  return totalAmount + packaging;
};

export default generateInvoice;
