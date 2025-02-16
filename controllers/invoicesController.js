const Invoice = require('../models/invoice');
const fs = require('fs');
const path = require('path');
const jsPDF = require('jspdf');
const autoTable = require('jspdf-autotable');

exports.createInvoice = async (req, res) => {
  try {
    const formData = req.body;
    const doc = new jsPDF();

    // Add a heading
    doc.setFontSize(20);
    doc.text("THE GRAND TRAVEL", 105, 15, { align: "center" });

    // Add a horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 20, 190, 20);

    // Add the table with form data
    autoTable(doc, {
      startY: 25,
      head: [["Field", "Details"]],
      body: [
        ["Name", formData.name],
        ["Email", formData.email],
        ["Phone", formData.phone],
        ["Departure", formData.departure],
        ["Destination", formData.destination],
        ["Date", formData.date],
        ["Seat Number", formData.seatNumber],
        ["Price", `$${Number(formData.price).toFixed(2)}`],
      ],
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 12, cellPadding: 2 },
    });

    // Ensure `finalY` exists before using it
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 60;

    // Add another table for flight details
    autoTable(doc, {
      startY: finalY + 5,
      head: [
        ["Airline", "Flight No", "Class", "From", "To", "Dept Time", "Arr Time", "Status"],
      ],
      body: [
        [formData.airline, formData.flightNumber, formData.flightClass, formData.departure, formData.destination, formData.departureTime, formData.arrivalTime, "Confirmed"],
      ],
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 12, cellPadding: 2 },
    });

    const lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY : finalY + 15;

    // Add a note
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const noteText = doc.splitTextToSize(
      "Your Financial Protection: When you buy an ATOL protected flight or flight inclusive holiday from us you will receive an ATOL Certificate. This lists what is financially protected, where you can get information on what this means for you and who to contact if things go wrong.",
      170
    );
    doc.text(noteText, 105, lastY + 5, { align: "center" });

    // Add a footer
    doc.setLineWidth(0.5);
    doc.line(20, lastY + 15, 190, lastY + 15);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const footerText = doc.splitTextToSize(
      "The Grand Travel | Address: 1352 Leeds Road, Bradford, BD3 8ND, Tel: 01274 271818 | 01274665809, Emails: grandtravel786@gmail.com | Grand world travel | Address: 64 Leeds Old Road, Bradford, BD3 8HX | Tel: 01274661777, 01274015013",
      170
    );
    doc.text(footerText, 105, lastY + 20, { align: "center" });

    // Save PDF to file system
    const pdfPath = path.join(__dirname, `../../invoices/${Date.now()}-invoice.pdf`);
    fs.writeFileSync(pdfPath, doc.output());

    // Save invoice details to database
    const newInvoice = new Invoice({
      ...formData,
      pdfPath,
    });
    await newInvoice.save();

    res.status(201).json({ message: 'Invoice created and saved', invoiceUrl: pdfPath });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: 'Error generating PDF' });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching invoices' });
  }
};