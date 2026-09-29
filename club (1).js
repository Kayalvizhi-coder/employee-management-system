const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB error:", error);
    });

// Campus Club Member Schema
const memberSchema = new mongoose.Schema({
    memberId: String,
    name: String,
    clubName: String,
    yearOfStudy: Number,
    role: String,
    points: Number,
    interests: String,
    status: String
});

const Member = mongoose.model("Member", memberSchema);


// Display HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// 1. Add Club Member
app.post("/members", async (req, res) => {
    try {
        const member = new Member({
            memberId: req.body.memberId,
            name: req.body.name,
            clubName: req.body.clubName,
            yearOfStudy: req.body.yearOfStudy,
            role: req.body.role,
            points: req.body.points,
            interests: req.body.interests,
            status: req.body.status
        });

        await member.save();

        res.send("Club member added successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get("/search/club", async (req, res) => {
    try {
        const clubName = req.query.clubName;
        const points = Number(req.query.points);

        const members = await Member.find({
            clubName: clubName,
            points: { $gt: points }
        });

        res.json(members);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get("/search/:memberId", async (req, res) => {
    try {
        const member = await Member.findOne({
            memberId: req.params.memberId
        });

        if (!member) {
            return res.send("Club member not found");
        }

        res.json(member);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get("/details/:memberId", async (req, res) => {
    try {
        const member = await Member.findOne(
            { memberId: req.params.memberId },
            {
                _id: 0,
                name: 1,
                clubName: 1,
                role: 1,
                points: 1
            }
        );

        if (!member) {
            return res.send("Club member not found");
        }

        res.json(member);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.put("/update/:memberId", async (req, res) => {
    try {
        const member = await Member.findOneAndUpdate(
            { memberId: req.params.memberId },
            {
                role: req.body.role,
                points: req.body.points
            },
            { new: true }
        );

        if (!member) {
            return res.send("Club member not found");
        }

        res.json({
            message: "Updated successfully",
            member: member
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.put("/increase-points", async (req, res) => {
    try {
        const clubName = req.body.clubName;
        const amount = Number(req.body.amount);

        await Member.updateMany(
            { clubName: clubName },
            { $inc: { points: amount } }
        );

        res.send("Points increased successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get("/points-range", async (req, res) => {
    try {
        const min = Number(req.query.min);
        const max = Number(req.query.max);

        const members = await Member.find({
            points: {
                $gte: min,
                $lte: max
            }
        });

        res.json(members);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.delete("/members/:memberId", async (req, res) => {
    try {
        const result = await Member.deleteOne({
            memberId: req.params.memberId
        });

        if (result.deletedCount === 0) {
            return res.send("Club member not found");
        }

        res.send("Club member deleted successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get("/members", async (req, res) => {
    try {
        const members = await Member.find()
            .sort({ points: -1 });

        res.json(members);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});