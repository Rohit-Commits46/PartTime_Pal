const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  recieverid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  text: String,
  image: String,
}, {
  timestamps: true
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
