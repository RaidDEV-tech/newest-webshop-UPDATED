import { db } from "./firebase.js";
import { getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { Toast } from "./utils.js";

const list = document.getElementById("courseList");

// Sample courses to add if collection is empty
const sampleCourses = [
  {
    title: "Arduino Basics & IoT Projects",
    price: 29.99,
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    desc: "Master Arduino microcontroller programming from scratch. Learn how to build IoT projects, work with sensors, LEDs, motors, and create real-world applications. Perfect for beginners looking to start their electronics journey!\n\n✨ What you'll learn:\n• Arduino IDE setup & programming basics\n• Digital & analog inputs/outputs\n• Working with sensors (temperature, motion, light)\n• Building LED & motor control circuits\n• Creating IoT projects with WiFi\n• Debugging and troubleshooting\n\n🎯 Perfect for: Hobbyists, students, makers\n⏱️ Duration: 6 weeks\n📚 Projects: 15+ hands-on projects"
  },
  {
    title: "Raspberry Pi Mastery",
    price: 39.99,
    img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=500&fit=crop",
    desc: "Master Raspberry Pi from basics to advanced projects. Build smart home systems, automation projects, and learn Linux. Create IoT applications that control your environment!"
  },
  {
    title: "Cybersecurity Essentials",
    price: 49.99,
    img: "https://images.unsplash.com/photo-1550751827-4bd582f200e5?w=800&h=500&fit=crop",
    desc: "Essential cybersecurity concepts, penetration testing, and ethical hacking techniques. Protect systems and understand modern security threats."
  },
  {
    title: "Python for IoT",
    price: 34.99,
    img: "https://images.unsplash.com/photo-1526374965328-7f5ae4e8a83f?w=800&h=500&fit=crop",
    desc: "Complete Python programming for IoT devices and smart systems. Includes real-world projects, data handling, and cloud integration."
  },
  {
    title: "Network Security",
    price: 44.99,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    desc: "Protect your networks from cyber threats. Learn firewalls, VPNs, network protocols, and security best practices."
  },
  {
    title: "Web Development Bootcamp",
    price: 59.99,
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    desc: "Full-stack web development with modern frameworks and best practices. Build responsive, scalable web applications."
  },
  {
    title: "Python Mastery: From Basics to Advanced",
    price: 39.99,
    img: "https://images.unsplash.com/photo-1526374965328-7f5ae4e8a83f?w=800&h=500&fit=crop",
    desc: "Complete Python programming course covering fundamentals, OOP, data structures, and real-world projects. Build professional Python applications!"
  },
  {
    title: "JavaScript & TypeScript Essentials",
    price: 34.99,
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    desc: "Master JavaScript from basics to async programming. Learn modern ES6+ features, TypeScript, and build interactive web applications with confidence."
  },
  {
    title: "Java Full-Stack Development",
    price: 49.99,
    img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=500&fit=crop",
    desc: "Learn Java programming for enterprise applications. Covers OOP, Spring Framework, databases, and building scalable backend systems."
  },
  {
    title: "C++ Advanced Programming",
    price: 44.99,
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    desc: "Master C++ from fundamentals to advanced concepts. Learn memory management, templates, STL, and build high-performance applications."
  },
  {
    title: "Go (Golang) for Backend",
    price: 39.99,
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    desc: "Learn Go programming language for building fast, scalable backend systems. Perfect for microservices, cloud applications, and concurrent programming."
  },
  {
    title: "Rust Systems Programming",
    price: 49.99,
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    desc: "Master Rust for system-level programming with safety guarantees. Build fast, secure applications without garbage collection."
  },
  {
    title: "PHP & Laravel Web Development",
    price: 34.99,
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    desc: "Learn PHP and Laravel framework for modern web development. Build dynamic websites, RESTful APIs, and scalable web applications."
  },
  {
    title: "Ruby on Rails Development",
    price: 39.99,
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    desc: "Master Ruby and Rails framework for rapid web application development. Learn conventions, routing, databases, and deployment strategies."
  },
  {
    title: "SQL Database Design & Optimization",
    price: 29.99,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    desc: "Learn database design, SQL queries, indexing, and optimization. Master PostgreSQL, MySQL, and build efficient data systems."
  }
];

async function displayCourses(courses) {
  if (!list) {
    console.error("courseList element not found");
    return;
  }
  
  if (courses.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px;">No courses available. Loading...</p>';
    return;
  }

  list.innerHTML = "";
  courses.forEach(doc => {
    const c = doc.data ? doc.data() : doc;
    const id = doc.id || '';
    const description = c.desc ? c.desc.split('\n')[0] : "Quality course for learning";
    list.innerHTML += `
      <div class="card">
        <a href="course-detail.html?id=${id}" style="text-decoration: none; color: inherit; cursor: pointer;">
          <img src="${c.img}" alt="${c.title}" onerror="this.src='https://via.placeholder.com/500x300?text=Course'">
          <div class="card-body">
            <h3>${c.title}</h3>
            <p class="card-desc">${description}</p>
            <strong class="card-price">€${c.price.toFixed(2)}</strong>
          </div>
        </a>
        <button class="btn primary full" onclick="addToCart('${id}', '${c.title}', ${c.price})" style="margin-top: 10px;">🛒 Add to Cart</button>
      </div>
    `;
  });
}

async function loadCourses() {
  try {
    const snap = await getDocs(collection(db, "courses"));
    
    if (snap.empty) {
      Toast.info("Loading", "Initializing courses...");
      for (const course of sampleCourses) {
        await addDoc(collection(db, "courses"), course);
      }
      Toast.success("Ready!", "Courses loaded successfully");
      // Reload to display new courses
      setTimeout(() => location.reload(), 1000);
    } else {
      const courses = [];
      snap.forEach(doc => {
        courses.push({ id: doc.id, ...doc.data() });
      });
      await displayCourses(courses);
    }
  } catch (error) {
    console.error("Error loading courses:", error);
    Toast.error("Error", "Failed to load courses: " + error.message);
  }
}

window.addToCart = (id, title, price) => {
  if (!id) {
    Toast.error("Error", "Invalid course");
    return;
  }
  
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  
  // Create course object for consistent storage
  const courseItem = {
    id: id,
    name: title,
    price: price || 0,
    type: "course"
  };
  
  // Check if already in cart
  const exists = cart.some(item => {
    if (typeof item === 'object') return item.id === id;
    return item === id;
  });
  
  if (!exists) {
    cart.push(courseItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart count
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.innerText = `(${cart.length})`;
    
    Toast.success("Added to Cart!", `${title} added successfully`);
  } else {
    Toast.info("Already Added", "This course is already in your cart");
  }
};

// Display sample courses immediately while Firebase loads
async function initializeCourses() {
  try {
    await loadCourses();
  } catch (error) {
    console.warn("Firebase error, showing sample courses:", error);
    // Fallback: show sample courses if Firebase fails
    await displayCourses(sampleCourses);
  }
}

// Load courses when page is ready
document.addEventListener('DOMContentLoaded', initializeCourses);
// Also call immediately in case DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCourses);
} else {
  initializeCourses();
}
