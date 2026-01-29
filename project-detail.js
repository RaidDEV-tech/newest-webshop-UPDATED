import { db } from "./firebase.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { Toast } from "./utils.js";

let currentProject = null;

// Get project ID from URL parameters
function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Load project details
async function loadProjectDetails() {
  try {
    const projectId = getProjectId();
    
    if (!projectId) {
      Toast.error("Error", "No project ID provided");
      setTimeout(() => window.location.href = 'projects.html', 2000);
      return;
    }

    // Fetch from Firestore
    const snap = await getDocs(collection(db, "projects"));
    let project = null;

    snap.forEach(doc => {
      if (doc.id === projectId) {
        project = { id: doc.id, ...doc.data() };
      }
    });

    if (!project) {
      Toast.error("Error", "Project not found");
      setTimeout(() => window.location.href = 'projects.html', 2000);
      return;
    }

    currentProject = project;
    displayProjectDetails();
  } catch (error) {
    console.error("Error loading project:", error);
    Toast.error("Error", "Failed to load project details");
  }
}

// Display project details on page
function displayProjectDetails() {
  if (!currentProject) return;

  const difficultyColor = 
    currentProject.difficulty === "Beginner" ? "#10b981" :
    currentProject.difficulty === "Intermediate" ? "#f59e0b" :
    "#ef4444";

  // Update page elements
  document.getElementById("projectImage").src = currentProject.image;
  document.getElementById("projectImage").onerror = () => {
    document.getElementById("projectImage").src = "https://via.placeholder.com/500x300?text=Project";
  };
  
  document.getElementById("projectName").textContent = currentProject.name;
  document.getElementById("projectDescription").textContent = currentProject.description;
  document.getElementById("projectDifficulty").textContent = currentProject.difficulty;
  document.getElementById("projectDifficulty").style.color = difficultyColor;
  document.getElementById("projectDuration").textContent = currentProject.duration;
  document.getElementById("projectCourse").textContent = formatCourseName(currentProject.course);

  // Display tutorial with proper formatting
  const tutorialContent = document.getElementById("tutorialContent");
  if (currentProject.tutorial) {
    const steps = currentProject.tutorial.split('\n');
    let html = '<ol class="tutorial-steps">';
    
    steps.forEach(step => {
      if (step.trim()) {
        // Remove "X. " at the start and format
        const cleanStep = step.replace(/^\d+\.\s*/, '');
        if (step.match(/^\d+\./)) {
          html += `<li>${cleanStep}</li>`;
        } else if (cleanStep.includes(':')) {
          html += `<li><strong>${cleanStep}</strong></li>`;
        } else {
          html += `<li>${cleanStep}</li>`;
        }
      }
    });
    
    html += '</ol>';
    tutorialContent.innerHTML = html;
  } else {
    tutorialContent.innerHTML = '<p>No tutorial available yet.</p>';
  }

  // Update page title
  document.title = `${currentProject.name} - RaidServices`;
}

// Format course name
function formatCourseName(courseId) {
  const names = {
    arduino: "Arduino",
    raspberrypi: "Raspberry Pi",
    python: "Python",
    cybersecurity: "Cybersecurity",
    webdev: "Web Development",
    linux: "Linux",
    scratch: "Scratch",
    database: "Database",
    networking: "Networking"
  };
  return names[courseId] || courseId;
}

// Start project
window.startProject = () => {
  if (!currentProject) return;
  
  Toast.success("🚀 Project Started!", `Welcome to ${currentProject.name}\n\nYou can ask our chatbot for help at any time!`);
  
  // Store current project in sessionStorage for chatbot context
  sessionStorage.setItem('currentProject', JSON.stringify(currentProject));
};

// Open chatbot with project context
window.openChatbotHelp = () => {
  if (currentProject) {
    sessionStorage.setItem('currentProject', JSON.stringify(currentProject));
    window.location.href = 'chatbot.html?project=' + currentProject.id;
  } else {
    window.location.href = 'chatbot.html';
  }
};

// Load on page ready
document.addEventListener('DOMContentLoaded', loadProjectDetails);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProjectDetails);
} else {
  loadProjectDetails();
}
