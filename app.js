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

// Travel Buddy Schema
const buddySchema = new mongoose.Schema({
    buddyId: String,
    name: String,
    destination: String,
    age: Number,
    budget: Number,
    tripDuration: Number,
    interests: String,
    status: String
});

const TravelBuddy = mongoose.model("TravelBuddy", buddySchema);


// Display HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index3.html"));
});


// 1. Add Travel Buddy
app.post("/buddies", async (req, res) => {
    try {
        const buddy = new TravelBuddy({
            buddyId: req.body.buddyId,
            name: req.body.name,
            destination: req.body.destination,
            age: req.body.age,
            budget: req.body.budget,
            tripDuration: req.body.tripDuration,
            interests: req.body.interests,
            status: req.body.status
        });

        await buddy.save();

        res.send("Travel buddy added successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// 2. Search destination + budget greater than amount
app.get("/search/destination", async (req, res) => {
    try {
        const destination = req.query.destination;
        const budget = Number(req.query.budget);

        const buddies = await TravelBuddy.find({
            destination: destination,
            budget: { $gt: budget }
        });

        res.json(buddies);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// 3. Search using Buddy ID
app.get("/search/:buddyId", async (req, res) => {
    try {
        const buddy = await TravelBuddy.findOne({
            buddyId: req.params.buddyId
        });

        if (!buddy) {
            return res.send("Travel buddy not found");
        }

        res.json(buddy);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// 4. Display only Name, Destination, Budget, Trip Duration
app.get("/details/:buddyId", async (req, res) => {
    try {
        const buddy = await TravelBuddy.findOne(
            { buddyId: req.params.buddyId },
            {
                _id: 0,
                name: 1,
                destination: 1,
                budget: 1,
                tripDuration: 1
            }
        );

        if (!buddy) {
            return res.send("Travel buddy not found");
        }

        res.json(buddy);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// 5. Update destination and budget
app.put("/update/:buddyId", async (req, res) => {
    try {
        const buddy = await TravelBuddy.findOneAndUpdate(
            { buddyId: req.params.buddyId },
            {
                destination: req.body.destination,
                budget: req.body.budget
            },
            { new: true }
        );

        if (!buddy) {
            return res.send("Travel buddy not found");
        }

        res.json({
            message: "Updated successfully",
            buddy: buddy
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// 6. Increase budget for a destination
app.put("/increase-budget", async (req, res) => {
    try {
        const destination = req.body.destination;
        const amount = Number(req.body.amount);

        await TravelBuddy.updateMany(
            { destination: destination },
            { $inc: { budget: amount } }
        );

        res.send("Budget increased successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// 7. Find buddies within budget range
app.get("/budget-range", async (req, res) => {
    try {
        const min = Number(req.query.min);
        const max = Number(req.query.max);

        const buddies = await TravelBuddy.find({
            budget: {
                $gte: min,
                $lte: max
            }
        });

        res.json(buddies);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// 8. Delete using Buddy ID
app.delete("/buddies/:buddyId", async (req, res) => {
    try {
        const result = await TravelBuddy.deleteOne({
            buddyId: req.params.buddyId
        });

        if (result.deletedCount === 0) {
            return res.send("Travel buddy not found");
        }

        res.send("Travel buddy deleted successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// 9. Display all buddies in descending budget order
app.get("/buddies", async (req, res) => {
    try {
        const buddies = await TravelBuddy.find()
            .sort({ budget: -1 });

        res.json(buddies);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});