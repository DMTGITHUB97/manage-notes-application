const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../modals/Note");
const { body, validationResult } = require("express-validator");

router.post("/fetchallnotes", fetchuser, async (req, res) => {
  // obj = {
  //     a: 'thios',
  //     number: 34
  // }
  // res.json(obj)
  //res.json([])

  try {
    const notes = await Note.find({ user: req.user.id });
    res.send(notes); // send note array.
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Accured");
  }
});

// router add to new notes
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter the title").isLength({ min: 4 }),
    body("description", "Enter description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNotes = await note.save();
      res.send(saveNotes); // send note array.
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Accured");
    }
  }
);

// update notes
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //create a newNotes
    const newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }

    //find the note to update the note and updated it
    let note = await Note.findById(req.params.id.replace(":", ""));
    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      // check the user is connect (is that user is note creater)
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id.replace(":", ""),
      { $set: newnote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Accured");
  }
});

// delete notes
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //find the note to delete it
    let note = await Note.findById(req.params.id.replace(":", ""));
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // check the user is connect (is that user is note creater)
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id.replace(":", ""), {
      delete: true,
    });
    res.json("Success: Note has been deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Accured");
  }
});

module.exports = router;