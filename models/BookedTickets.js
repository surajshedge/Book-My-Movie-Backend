const mongoose = require("mongoose");

// Define the card details schema
const cardSchema = new mongoose.Schema({
  cardHolder: { type: String, required: true },
  cardNumber: { type: String, required: true },
  cvv: { type: String, required: true },
});

// Define the movie schema
const movieSchema = new mongoose.Schema({
  poster_path: { type: String, required: true },
  id: { type: Number, required: true },
  title: { type: String, required: true },
});

// Define the booked tickets schema
const bookedTicketsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  cardDetails: { type: cardSchema, required: true },
  movie: { type: movieSchema, required: true },
  city: { type: String, required: true },
  date: { type: Date, required: true },
  selectedSeats: { type: [Number], required: true },
  theater: { type: String, required: true },
  ticketType: { type: String, required: true },
  time: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  bookedStatus: { type: Boolean, required: true },
});

const BookedTickets = mongoose.model("BookedTickets", bookedTicketsSchema);

module.exports = BookedTickets;
