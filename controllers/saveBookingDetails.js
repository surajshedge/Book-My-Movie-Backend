// controllers/saveBookingDetails.js
const mongoose = require("mongoose");
const Card = require("../models/BookedTickets");
const BookedTickets = require("../models/BookedTickets");
const saveBookingDetails = async (req, res) => {
  console.log(req.body);

  try {
    const {
      userId,
      cardDetails,
      movie,
      city,
      date,
      selectedSeats,
      theater,
      ticketType,
      time,
      totalAmount,
      totalSeats,
      bookedStatus,
    } = req.body;
    console.log("req.body");
    console.log(req.body);
    if (
      !userId ||
      !cardDetails ||
      !movie ||
      !city ||
      !date ||
      !selectedSeats ||
      !theater ||
      !ticketType ||
      !time ||
      !totalAmount ||
      !bookedStatus ||
      !totalSeats
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBookedTickets = new BookedTickets({
      userId,
      cardDetails,
      movie,
      city,
      date,
      selectedSeats,
      theater,
      ticketType,
      time,
      totalAmount,
      totalSeats,
      bookedStatus,
    });
    console.log("newBookedTickets");
    console.log(newBookedTickets);
    await newBookedTickets.save();
    res.status(201).json({ message: "BookedTickets saved successfully" });
  } catch (error) {
    console.error("Error saving BookedTickets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllBookedTickets = async (req, res) => {
  try {
    const tickets = await BookedTickets.find(); // Find all documents
    console.log(tickets);
    res.status(200).json(tickets); // Respond with the tickets
  } catch (error) {
    res.status(500).json({ message: "Error fetching booked tickets", error });
  }
};

const cancelTicket = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const updatedTicket = await BookedTickets.findByIdAndUpdate(
      ticketId,
      { bookedStatus: false }, // Update the status to "Cancelled"
      { new: true }
    );

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    res.json({ success: true, ticket: updatedTicket });
  } catch (error) {
    console.error("Error updating ticket status", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllBookedTickets, saveBookingDetails,cancelTicket };
