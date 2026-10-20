
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const client = new MongoClient(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());

let projects;

app.get("/api/projects", async (req, res) => {
  try {
    const data = await projects.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve projects" });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await projects.findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve project" });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const { projectId, projectName, category, status } = req.body;

    if (!projectId || !projectName || !category || !status) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existing = await projects.findOne({ projectId });

    if (existing) {
      return res.status(409).json({
        message: "Project ID already exists"
      });
    }

    const newProject = {
      projectId,
      projectName,
      category,
      status,
      createdAt: new Date()
    };

    const result = await projects.insertOne(newProject);

    res.status(201).json({
      _id: result.insertedId,
      ...newProject
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save project" });
  }
});

async function startServer() {
  try {
    await client.connect();
    projects = client.db("projectManagementDB").collection("projects");

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
