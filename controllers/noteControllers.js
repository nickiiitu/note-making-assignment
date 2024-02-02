const note = require("../models/noteModel");
const user = require("../models/userModel");

const createNote = async (req, res) => {
  try {
    const { title, desc, id } = req.body;
    const userExists = await user.findOne({ _id: id });
    if (req.body.noteId) {
      const noteId = req.body.noteId;
      const updatedDocument = await note.findOneAndUpdate(
        { _id: noteId },
        { $set: { title, desc, userId: id } },
        { new: true, useFindAndModify: false }
      );
      res.status(200).send(updatedDocument);
    } else {
      if (userExists) {
        const newNote = await note.create({
          title,
          desc,
          userId: id,
        });
        if (newNote) {
          res.status(200).send(newNote);
        }
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getNote = async (req, res) => {
  // console.log(userId);
  try {
    const { userId } = req.params;
    const userExists = await user.findOne({ _id: userId });
    if (userExists) {
      const notes = await note.find({userId: userId}).lean().exec();
      res.status(200).send(notes);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const deleteNote = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDocument = await note.findOneAndDelete({ _id: id });
    console.log(deletedDocument);
    res.status(200).send(deletedDocument);
  } catch (error) {}
};
module.exports = { createNote, getNote, deleteNote };
