
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
import "./App.css";

const API = "http://localhost:5000/api/projects";

function ProjectCard({ project }) {
  return (
    <div className="card">
      <h3>{project.projectName}</h3>
      <p>Project ID: {project.projectId}</p>
      <p>Category: {project.category}</p>
      <p>Status: {project.status}</p>
      <Link to={`/projects/${project._id}`}>View Details</Link>
    </div>
  );
}

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("All");
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [newCategory, setNewCategory] = useState("Web Development");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to fetch projects");
      }

      setProjects(await response.json());
    } catch (err) {
      setError("Cannot connect to the backend. Start the server.");
    } finally {
      setLoading(false);
    }
  }

  async function addProject(e) {
    e.preventDefault();

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          projectName,
          category: newCategory,
          status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add project");
      }

      setProjects((oldProjects) => [...oldProjects, data]);
      setProjectId("");
      setProjectName("");
      alert("Project added successfully");
    } catch (err) {
      alert(err.message);
    }
  }

  const filteredProjects =
    category === "All"
      ? projects
      : projects.filter((p) => p.category === category);

  return (
    <main className="container">
      <h1>Project Management Application</h1>

      <h2>Add Project</h2>

      <form onSubmit={addProject}>
        <input
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        />

        <input
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />

        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        >
          <option>Web Development</option>
          <option>Mobile App</option>
          <option>Data Science</option>
          <option>Cloud Computing</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button type="submit">Add Project</button>
      </form>

      <h2>Project List</h2>

      <label htmlFor="category">Filter by category: </label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>All</option>
        <option>Web Development</option>
        <option>Mobile App</option>
        <option>Data Science</option>
        <option>Cloud Computing</option>
      </select>

      <button onClick={fetchProjects}>Refresh</button>

      {loading && <p>Loading projects...</p>}
      {error && <p>{error}</p>}

      {!loading && !error &&
        (filteredProjects.length > 0 ? (
          <div className="projects">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <p>No projects available.</p>
        ))}
    </main>
  );
}

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`${API}/${id}`);

        if (!response.ok) {
          throw new Error("Project not found");
        }

        setProject(await response.json());
      } catch (err) {
        setError(err.message);
      }
    }

    loadProject();
  }, [id]);

  return (
    <main className="container">
      <Link to="/">Back to Project List</Link>
      <h1>Project Details</h1>
      {error && <p>{error}</p>}

      {project && (
        <div className="card">
          <h2>{project.projectName}</h2>
          <p>Project ID: {project.projectId}</p>
          <p>Category: {project.category}</p>
          <p>Status: {project.status}</p>
        </div>
      )}
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <span>Project Manager</span>
      </nav>

      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
