import { db } from "./firebase.js";
import { getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { Toast } from "./utils.js";

let currentFilter = "all";
let allProjects = [];

// Sample projects with proper string formatting
const sampleProjects = [
  // ARDUINO PROJECTS
  {
    course: "arduino",
    name: "LED Blink Project",
    description: "Learn the basics by making an LED blink on and off",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=300&fit=crop",
    difficulty: "Beginner",
    duration: "30 min",
    price: 0,
    tutorial: "1. Connect long leg of LED to pin 13\n2. Connect resistor (220Ω) from LED to ground\n3. Open Arduino IDE → File → Examples → Basics → Blink\n4. Upload the sketch\n5. Your LED will blink every 1 second!"
  },
  {
    course: "arduino",
    name: "Temperature Sensor",
    description: "Build a temperature monitoring system with sensors",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "1.5 hours",
    price: 29.99,
    tutorial: "1. Install DHT11 sensor library via Arduino IDE\n2. Connect DHT11: VCC→5V, GND→GND, DATA→pin 2\n3. Add: #include <DHT.h>\n4. Read values: float temp = dht.readTemperature();\n5. Display on Serial Monitor or LCD display"
  },
  {
    course: "arduino",
    name: "Motor Control Robot",
    description: "Create a simple moving robot controlled by Arduino",
    image: "https://images.unsplash.com/photo-1581092162562-40038f6b95d0?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2 hours",
    price: 39.99,
    tutorial: "1. Connect 2 DC motors to L298N motor driver\n2. Motor driver to Arduino pins (IN1-4) and power\n3. analogWrite(pin, speed) for control (0-255)\n4. digitalWrite() to set direction\n5. Test: Forward, Backward, Left, Right movements"
  },
  {
    course: "arduino",
    name: "Smart Home Light Control",
    description: "Build a WiFi-enabled light control system",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "3 hours",
    price: 49.99,
    tutorial: "1. Add ESP8266/ESP32 WiFi module\n2. Set up Firebase Realtime Database\n3. Connect relay module to control lights\n4. Code WiFi connection and Firebase sync\n5. Create smartphone app control interface\n6. Deploy and test remote control"
  },
  {
    course: "arduino",
    name: "Ultrasonic Distance Sensor",
    description: "Create a distance measuring device with ultrasonic sensors",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2 hours",
    price: 34.99,
    tutorial: "1. Connect HC-SR04 sensor (TRIG, ECHO, VCC, GND)\n2. Send 10µs pulse to TRIG pin\n3. Measure ECHO pulse duration\n4. Calculate: distance = (duration/2) / 29.1 cm\n5. Display on LCD or Serial Monitor\n6. Create distance alert system"
  },
  {
    course: "arduino",
    name: "Bluetooth Remote Control",
    description: "Control your Arduino projects via Bluetooth from your phone",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "2.5 hours",
    price: 44.99,
    tutorial: "1. Connect HC-05 Bluetooth module\n2. Set up serial communication (9600 baud)\n3. Use Arduino Bluetooth terminal app\n4. Parse commands from phone (e.g., 'L' for LED on)\n5. Control multiple devices via single app\n6. Test range and reliability"
  },

  // RASPBERRY PI PROJECTS
  {
    course: "raspberrypi",
    name: "Pi Weather Station",
    description: "Create a weather monitoring station with Raspberry Pi",
    image: "https://images.unsplash.com/photo-1551431009-381d36ac3a12?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2 hours",
    price: 39.99,
    tutorial: "1. Connect BME680 sensor via I2C\n2. Install Adafruit BME680 library\n3. Write Python script to read temp/humidity/pressure\n4. Store data in SQLite database\n5. Create Flask web dashboard\n6. Display graphs and historical data"
  },
  {
    course: "raspberrypi",
    name: "Media Center Setup",
    description: "Turn your Pi into a home media server",
    image: "https://images.unsplash.com/photo-1505355412790-aa3249d33b2e?w=500&h=300&fit=crop",
    difficulty: "Beginner",
    duration: "1 hour",
    price: 19.99,
    tutorial: "1. Download OSMC or LibreELEC image\n2. Flash to SD card with Raspberry Pi Imager\n3. Boot Raspberry Pi and complete setup\n4. Configure network sharing (SMB)\n5. Add movie/music folders to library\n6. Install streaming add-ons (Netflix, YouTube)\n7. Set up remote control"
  },
  {
    course: "raspberrypi",
    name: "Security Camera System",
    description: "Build a DIY security camera system with video recording",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "3 hours",
    price: 54.99,
    tutorial: "1. Connect Raspberry Pi camera module\n2. Enable camera in raspi-config\n3. Install motion detection library\n4. Write Python script using picamera\n5. Implement motion detection and recording\n6. Set up FTP or cloud upload\n7. Create viewing dashboard"
  },
  {
    course: "raspberrypi",
    name: "Game Server Setup",
    description: "Host your own game server on Raspberry Pi",
    image: "https://images.unsplash.com/photo-1551431009-381d36ac3a12?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "2.5 hours",
    price: 44.99,
    tutorial: "1. Install Minecraft server software\n2. Configure server.properties\n3. Set port forwarding on router\n4. Invite players with server IP\n5. Manage players and plugins\n6. Create backups regularly\n7. Monitor CPU and memory usage"
  },
  {
    course: "raspberrypi",
    name: "Home Automation Hub",
    description: "Create a central smart home automation system",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "4 hours",
    price: 59.99,
    tutorial: "1. Install Home Assistant on Pi\n2. Configure MQTT broker (Mosquitto)\n3. Add smart devices (lights, thermostats)\n4. Create automations and scenes\n5. Build web dashboard\n6. Set up voice control (Alexa/Google Home)\n7. Mobile app integration"
  },

  // PYTHON PROJECTS
  {
    course: "python",
    name: "Web Scraper",
    description: "Build a web scraper using Python and BeautifulSoup",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2 hours",
    price: 34.99,
    tutorial: "1. Install requests and BeautifulSoup: pip install requests beautifulsoup4\n2. Make HTTP request: requests.get(url)\n3. Parse HTML: BeautifulSoup(html, 'html.parser')\n4. Find elements: soup.find_all('tag')\n5. Extract data: get text, attributes\n6. Save to CSV with pandas\n7. Add delays to respect servers"
  },
  {
    course: "python",
    name: "Discord Bot",
    description: "Create your own Discord bot with Python",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2.5 hours",
    price: 39.99,
    tutorial: "1. Install discord.py: pip install discord.py\n2. Create app on Discord Developer Portal\n3. Get bot token\n4. Create bot instance and events\n5. Add commands with @bot.command()\n6. Implement message handling\n7. Deploy to hosting (Heroku, replit, etc)"
  },
  {
    course: "python",
    name: "Automation Script",
    description: "Learn task automation with Python scripts",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2 hours",
    price: 34.99,
    tutorial: "1. Learn subprocess module for system commands\n2. File operations: os, shutil modules\n3. Schedule tasks: APScheduler library\n4. Email automation: smtplib\n5. Web automation: Selenium\n6. Create batch renaming script\n7. Auto-backup system"
  },
  {
    course: "python",
    name: "Data Analysis with Pandas",
    description: "Analyze and visualize data using Python libraries",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "3 hours",
    price: 49.99,
    tutorial: "1. Install pandas: pip install pandas matplotlib\n2. Load CSV: pd.read_csv()\n3. Data exploration: df.head(), df.info()\n4. Data cleaning: handle missing values\n5. Filter and sort: df[df['column'] > value]\n6. Group by: df.groupby('column')\n7. Visualize: matplotlib, seaborn"
  },
  {
    course: "python",
    name: "Machine Learning Model",
    description: "Build your first ML model with Python",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "3.5 hours",
    price: 59.99,
    tutorial: "1. Install scikit-learn: pip install scikit-learn\n2. Load dataset (Iris, Titanic)\n3. Split data: train_test_split()\n4. Choose model: Decision Tree, Random Forest\n5. Train: model.fit(X_train, y_train)\n6. Evaluate: accuracy_score(), confusion_matrix()\n7. Make predictions and visualize results"
  },
  {
    course: "python",
    name: "Flask Web Application",
    description: "Create a web app with Flask framework",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "3 hours",
    price: 44.99,
    tutorial: "1. Install Flask: pip install flask\n2. Create app.py with Flask()\n3. Define routes with @app.route()\n4. Create HTML templates\n5. Connect to database (SQLite/MongoDB)\n6. Implement forms and validation\n7. Deploy to Heroku or PythonAnywhere"
  },

  // CYBERSECURITY PROJECTS
  {
    course: "cybersecurity",
    name: "Password Cracker",
    description: "Learn password security by building a cracker tool",
    image: "https://images.unsplash.com/photo-1550751827-4bd582f200e5?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "3 hours",
    price: 54.99,
    tutorial: "1. Understand hash functions: MD5, SHA256\n2. Create dictionary attack: read wordlist\n3. Hash each word and compare\n4. Implement brute force (slower)\n5. Use hashlib library\n6. Test on known hashes\n7. Discuss defense: salt, bcrypt, argon2"
  },
  {
    course: "cybersecurity",
    name: "Network Scanner",
    description: "Build a network security scanning tool",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "2.5 hours",
    price: 49.99,
    tutorial: "1. Learn ARP and IP protocols\n2. Use nmap library: python-nmap\n3. Scan for active hosts\n4. Scan open ports\n5. Identify services\n6. Generate security report\n7. Create GUI with tkinter"
  },
  {
    course: "cybersecurity",
    name: "Firewall Configuration",
    description: "Learn to configure firewalls for security",
    image: "https://images.unsplash.com/photo-1550751827-4bd582f200e5?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2 hours",
    price: 39.99,
    tutorial: "1. Understand firewall rules\n2. Configure iptables (Linux)\n3. Create inbound/outbound rules\n4. Set default policies\n5. Configure port filtering\n6. Test with nmap\n7. Monitor connections with netstat"
  },
  {
    course: "cybersecurity",
    name: "Encryption & Decryption",
    description: "Master encryption algorithms and cryptography",
    image: "https://images.unsplash.com/photo-1550751827-4bd582f200e5?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "3 hours",
    price: 54.99,
    tutorial: "1. Study symmetric (AES) vs asymmetric (RSA)\n2. Use cryptography library: pip install cryptography\n3. Encrypt files with Fernet\n4. Implement RSA key generation\n5. Encrypt messages with public key\n6. Decrypt with private key\n7. Create secure file locker app"
  },
  {
    course: "cybersecurity",
    name: "Ethical Hacking Basics",
    description: "Learn ethical hacking principles and techniques",
    image: "https://images.unsplash.com/photo-1550751827-4bd582f200e5?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "4 hours",
    price: 69.99,
    tutorial: "1. Study hacking ethics and laws\n2. Network reconnaissance: nmap, whois\n3. Vulnerability scanning\n4. SQL injection testing\n5. XSS vulnerability testing\n6. Exploit databases (Exploit-DB)\n7. Document findings in reports"
  },

  // WEB DEVELOPMENT PROJECTS
  {
    course: "webdev",
    name: "Portfolio Website",
    description: "Create a professional portfolio website",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Beginner",
    duration: "3 hours",
    price: 29.99,
    tutorial: "1. Design portfolio layout\n2. Create about and projects sections\n3. Add contact form\n4. Responsive design with CSS Grid\n5. Add animations\n6. Deploy to GitHub Pages\n7. SEO optimization"
  },
  {
    course: "webdev",
    name: "Chat Application",
    description: "Build a real-time chat application with WebSockets",
    image: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "4 hours",
    price: 59.99,
    tutorial: "1. Set up Node.js and Express\n2. Implement WebSockets with Socket.io\n3. Create user authentication\n4. Build chat interface\n5. Implement rooms/channels\n6. Add message history\n7. Deploy to cloud"
  },
  {
    course: "webdev",
    name: "E-commerce Store",
    description: "Create a complete e-commerce website",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "5 hours",
    price: 79.99,
    tutorial: "1. Database design for products\n2. Shopping cart functionality\n3. User authentication\n4. Payment integration (Stripe)\n5. Order management\n6. Admin dashboard\n7. Deployment and optimization"
  },
  {
    course: "webdev",
    name: "Todo App",
    description: "Build a todo application with React",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Beginner",
    duration: "2 hours",
    price: 19.99,
    tutorial: "1. Create React project with Create React App\n2. Build components: TodoList, TodoItem\n3. Manage state with useState\n4. Add, edit, delete todos\n5. Local storage persistence\n6. Styling with CSS\n7. Deploy to Netlify"
  },
  {
    course: "webdev",
    name: "Weather App",
    description: "Create a weather app using APIs",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2.5 hours",
    price: 34.99,
    tutorial: "1. Get API key from OpenWeatherMap\n2. Fetch weather data with fetch()\n3. Display current conditions\n4. Add forecast section\n5. Search by city\n6. Display icons and animations\n7. Deploy to GitHub Pages"
  },

  // LINUX PROJECTS
  {
    course: "linux",
    name: "Linux System Setup",
    description: "Master Linux installation and configuration",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Beginner",
    duration: "2 hours",
    price: 29.99,
    tutorial: "1. Download Linux distribution (Ubuntu recommended)\n2. Create bootable USB\n3. BIOS/UEFI settings\n4. Partition disk\n5. Install Linux\n6. Post-installation setup\n7. Install essential software"
  },
  {
    course: "linux",
    name: "Shell Scripting",
    description: "Learn Bash scripting and automation",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2.5 hours",
    price: 39.99,
    tutorial: "1. Variables and data types\n2. Control flow: if, for, while\n3. Functions and parameters\n4. File operations\n5. Text processing: grep, sed, awk\n6. Cron jobs\n7. Error handling"
  },
  {
    course: "linux",
    name: "User Management",
    description: "Learn to manage users and permissions on Linux",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "1.5 hours",
    price: 34.99,
    tutorial: "1. Create and delete users\n2. User groups and membership\n3. File permissions: chmod, chown\n4. Sudo and sudoers\n5. Password policies\n6. User home directories\n7. ACL (Access Control Lists)"
  },
  {
    course: "linux",
    name: "Server Administration",
    description: "Manage and maintain Linux servers",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "3 hours",
    price: 54.99,
    tutorial: "1. Network configuration\n2. SSH setup and hardening\n3. Firewall rules\n4. System monitoring tools\n5. Log analysis\n6. Backup strategies\n7. Security hardening"
  },
  {
    course: "linux",
    name: "Docker & Containers",
    description: "Learn containerization with Docker",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "3.5 hours",
    price: 59.99,
    tutorial: "1. Docker concepts and architecture\n2. Install Docker\n3. Create Dockerfile\n4. Build and run containers\n5. Docker Compose for multiple containers\n6. Registry and pushing images\n7. Container orchestration basics"
  },

  // SCRATCH PROJECTS
  {
    course: "scratch",
    name: "Pong Game",
    description: "Create the classic Pong game in Scratch",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=300&fit=crop",
    difficulty: "Beginner",
    duration: "1.5 hours",
    price: 0,
    tutorial: "1. Create two paddle sprites\n2. Create ball sprite\n3. Program paddle movement (arrow keys)\n4. Ball bouncing physics\n5. Score tracking\n6. Win condition\n7. Add sound effects"
  },
  {
    course: "scratch",
    name: "Interactive Story",
    description: "Build an interactive story with Scratch",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=300&fit=crop",
    difficulty: "Beginner",
    duration: "1 hour",
    price: 0,
    tutorial: "1. Design story scenes (backgrounds)\n2. Create character sprites\n3. Add dialogue bubbles\n4. Create choice buttons\n5. Branch story paths based on choices\n6. Add transitions between scenes\n7. Include sound and music"
  },
  {
    course: "scratch",
    name: "Platformer Game",
    description: "Create a platform game with collision detection",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2.5 hours",
    price: 0,
    tutorial: "1. Create player character\n2. Program jump mechanics\n3. Create platforms\n4. Implement gravity and collision\n5. Add enemy sprites\n6. Collect coins for points\n7. Create level progression"
  },
  {
    course: "scratch",
    name: "Quiz Game",
    description: "Build an interactive quiz game",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=300&fit=crop",
    difficulty: "Beginner",
    duration: "1.5 hours",
    price: 0,
    tutorial: "1. Store questions and answers in lists\n2. Display random questions\n3. Check user answers\n4. Track score\n5. Lives system\n6. Difficulty levels\n7. Show final results"
  },
  {
    course: "scratch",
    name: "Flappy Bird Clone",
    description: "Recreate Flappy Bird in Scratch",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2 hours",
    price: 0,
    tutorial: "1. Create bird sprite\n2. Program gravity and falling\n3. Jump on spacebar\n4. Create pipe obstacles\n5. Pipe collision detection\n6. Score increments\n7. Game over condition"
  },

  // DATABASE PROJECTS
  {
    course: "database",
    name: "Database Design",
    description: "Learn to design databases with normalization",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2.5 hours",
    price: 39.99,
    tutorial: "1. Study database fundamentals\n2. Learn entity relationships (ERD)\n3. Normalization forms (1NF, 2NF, 3NF)\n4. Primary and foreign keys\n5. Create schema in SQL\n6. Design for performance\n7. Document design"
  },
  {
    course: "database",
    name: "SQL Queries",
    description: "Master complex SQL queries and optimization",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2 hours",
    price: 34.99,
    tutorial: "1. SELECT, WHERE, ORDER BY\n2. JOIN operations (INNER, LEFT, RIGHT)\n3. GROUP BY and aggregations\n4. Subqueries and CTEs\n5. UNION operations\n6. CREATE INDEX for optimization\n7. Analyze query plans"
  },
  {
    course: "database",
    name: "MongoDB NoSQL",
    description: "Learn NoSQL databases with MongoDB",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2.5 hours",
    price: 44.99,
    tutorial: "1. Install MongoDB locally or Atlas\n2. CRUD operations with documents\n3. Insert, find, update, delete\n4. Index creation\n5. Aggregation pipeline\n6. Transactions\n7. Backup and replication"
  },
  {
    course: "database",
    name: "Database Administration",
    description: "Manage, backup, and maintain databases",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "3 hours",
    price: 54.99,
    tutorial: "1. User management and permissions\n2. Backup strategies (full, incremental)\n3. Restore procedures\n4. Replication setup\n5. Monitoring and logging\n6. Performance tuning\n7. Disaster recovery planning"
  },

  // NETWORKING PROJECTS
  {
    course: "networking",
    name: "Network Fundamentals",
    description: "Learn TCP/IP and networking basics",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    difficulty: "Beginner",
    duration: "2 hours",
    price: 29.99,
    tutorial: "1. OSI model layers\n2. TCP/IP protocols\n3. IP addressing and subnetting\n4. MAC addresses\n5. DNS and DHCP\n6. Network tools: ping, traceroute, ifconfig\n7. Wireshark packet analysis"
  },
  {
    course: "networking",
    name: "Routing & Switching",
    description: "Master routing and switch configuration",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "3 hours",
    price: 49.99,
    tutorial: "1. Static vs dynamic routing\n2. OSPF and BGP protocols\n3. VLAN configuration\n4. Switch port security\n5. Spanning Tree Protocol\n6. Load balancing\n7. Cisco IOS commands"
  },
  {
    course: "networking",
    name: "VPN Setup",
    description: "Configure secure VPN connections",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    difficulty: "Advanced",
    duration: "2.5 hours",
    price: 54.99,
    tutorial: "1. VPN concepts and protocols\n2. OpenVPN setup\n3. IPsec configuration\n4. Certificate generation\n5. Client configuration\n6. Testing and verification\n7. Security hardening"
  },
  {
    course: "networking",
    name: "Network Monitoring",
    description: "Monitor and analyze network traffic",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    difficulty: "Intermediate",
    duration: "2 hours",
    price: 39.99,
    tutorial: "1. SNMP protocol basics\n2. Nagios setup and configuration\n3. Zabbix monitoring\n4. Packet capture with tcpdump\n5. NetFlow analysis\n6. Alert configuration\n7. Create dashboards"
  }
];

const courseEmojis = {
  arduino: "🎯",
  raspberrypi: "🎯",
  python: "🎯",
  cybersecurity: "🔒",
  webdev: "🌐",
  linux: "🐧",
  scratch: "🐱",
  database: "💾",
  networking: "🌐"
};

const courseNames = {
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

// Initialize projects
async function initializeProjects() {
  const params = new URLSearchParams(window.location.search);
  const courseParam = params.get('course');
  
  try {
    const snap = await getDocs(collection(db, "projects"));
    
    if (snap.empty) {
      for (const project of sampleProjects) {
        await addDoc(collection(db, "projects"), project);
      }
      allProjects = sampleProjects;
    } else {
      allProjects = [];
      snap.forEach(doc => {
        allProjects.push({ id: doc.id, ...doc.data() });
      });
    }
    
    if (courseParam && courseParam !== "all") {
      currentFilter = courseParam;
      document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.onclick && btn.onclick.toString().includes(courseParam)) {
          btn.classList.add("active");
        }
      });
      const title = document.getElementById("projectsTitle");
      if(title) title.innerText = `${courseEmojis[courseParam] || ''} ${courseNames[courseParam] || 'Projects'}`;
    }
    
    displayProjects();
  } catch (error) {
    console.error("Error initializing projects:", error);
    allProjects = sampleProjects;
    displayProjects();
  }
}

// Filter projects
window.filterProjects = (course) => {
  currentFilter = course;
  
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  if(event && event.target) event.target.classList.add("active");
  
  const title = document.getElementById("projectsTitle");
  if (title) {
    if (course === "all") {
      title.innerText = "📚 All Projects";
    } else {
      title.innerText = `${courseEmojis[course] || ''} ${courseNames[course] || 'Projects'}`;
    }
  }
  
  displayProjects();
};

// Display projects
function displayProjects() {
  const list = document.getElementById("projectsList");
  if (!list) return;
  
  let filtered = allProjects;
  if (currentFilter !== "all") {
    filtered = allProjects.filter(p => p.course === currentFilter);
  }
  
  if (filtered.length === 0) {
    list.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 40px;">No projects available for this course yet.</p>';
    return;
  }

  list.innerHTML = "";
  filtered.forEach((project, index) => {
    const difficultyColor = 
      project.difficulty === "Beginner" ? "#10b981" :
      project.difficulty === "Intermediate" ? "#f59e0b" :
      "#ef4444";

    list.innerHTML += `
      <div class="project-card">
        <div class="project-image">
          <img src="${project.image}" alt="${project.name}" onerror="this.src='https://via.placeholder.com/500x300?text=Project'">
          <div class="project-badge">${project.difficulty}</div>
          ${project.price > 0 ? `<div class="project-price">€${project.price.toFixed(2)}</div>` : '<div class="project-price" style="background: #10b981;">FREE</div>'}
        </div>
        <div class="project-content">
          <h3>${project.name}</h3>
          <p class="project-desc">${project.description}</p>
          <div class="project-meta">
            <span>⏱️ ${project.duration}</span>
            <span style="color: ${difficultyColor}; font-weight: 600;">●</span>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn primary" style="flex: 1;" onclick="startProject('${project.id}')">Learn →</button>
            ${project.price > 0 ? `<button class="btn secondary" onclick="addToCart('${project.id}', '${project.name}', ${project.price})">🛒 Add</button>` : ''}
          </div>
        </div>
      </div>
    `;
  });
}

// Start project / open tutorial
window.startProject = (projectId) => {
  window.location.href = `project-detail.html?id=${projectId}`;
};

// Add project course to cart
window.addToCart = (projectId, projectName, price) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const courseItem = { id: projectId, name: projectName, price: price, type: "project" };
  cart.push(courseItem);
  localStorage.setItem("cart", JSON.stringify(cart));
  Toast.success("Added", `${projectName} added to cart!`);
  
  // Update cart count
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.innerText = `(${cart.length})`;
  }
};

// Load on page ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProjects);
} else {
  initializeProjects();
}
