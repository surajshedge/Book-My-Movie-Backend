// routes/ticketBookingRouter.js
const express = require("express");
const router = express.Router();
const {
  saveBookingDetails,
  getAllBookedTickets,
  cancelTicket,
} = require("../controllers/saveBookingDetails");

router.post("/tickets", saveBookingDetails);

// Route to get all booked tickets
router.get("/tickets", getAllBookedTickets);

// PUT endpoint to cancel a ticket
router.put("/tickets/:ticketId", cancelTicket);
module.exports = router;
