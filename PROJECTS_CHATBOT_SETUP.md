# 🤖 Projects & Chatbot Setup Guide

## ✨ New Features Added

### 1. **Projects Section**
- Browse projects by course (Arduino, Raspberry Pi, Python, etc.)
- View project details with images and difficulty levels
- Filter by course category
- Start projects directly from the UI

### 2. **Chatbot Assistant**
- Chat interface for asking questions
- AI-powered responses using Firebase Vertex AI
- Knows about Arduino, Python, Cybersecurity, Web Dev
- Quick question templates

### 3. **Integration**
- "View Projects" button on each course detail page
- Links in main navigation
- Auto-filters projects when clicking from course page

---

## 📁 Files Created

### New Pages
- `projects.html` - Projects listing and filtering
- `chatbot.html` - Chat interface

### New Scripts
- `projects.js` - Project management and filtering
- `chatbot.js` - Chat logic and AI integration

### Updated Files
- `style.css` - Added styles for projects and chatbot
- `course-detail.html` - Added "View Projects" button
- `index.html`, `courses.html` - Added navigation links

---

## 🚀 Features Overview

### Projects Page
**URL:** `/projects.html`

**Features:**
- Filter by course (All, Arduino, Raspberry Pi, Python, Cybersecurity, Web Dev)
- Display projects with:
  - Image preview
  - Name and description
  - Difficulty level (Beginner, Intermediate, Advanced)
  - Estimated duration
  - "Start Project" button

**Sample Projects Included:**
- Arduino: LED Blink, Temperature Sensor, Motor Control, Smart Home Lights
- Raspberry Pi: Weather Station, Media Center
- Python: Web Scraper, Discord Bot
- Cybersecurity: Password Cracker, Network Scanner
- Web Dev: Portfolio Website, Chat Application

### Chatbot Page
**URL:** `/chatbot.html`

**Features:**
- Chat message history
- Bot typing indicator
- Automatic responses based on knowledge base
- Beautiful UI with gradient header
- Mobile responsive

**Knowledge Topics:**
- Arduino & Embedded Systems
- Raspberry Pi & Linux
- Cybersecurity & Hacking
- Python Programming
- Web Development

---

## 🔧 Firebase Vertex AI Setup (Optional)

For production AI chatbot responses, follow these steps:

### Step 1: Enable Vertex AI API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Go to **APIs & Services** → **Library**
4. Search for "Vertex AI API"
5. Click **Enable**

### Step 2: Create Service Account
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in service account details
4. Grant roles:
   - Vertex AI User
   - Editor (for testing)
5. Create key (JSON format)

### Step 3: Deploy Cloud Function (Optional)
Replace the chatbot.js with this for real AI:

```javascript
// In chatbot.js, replace sendMessage function with:
window.sendMessage = async () => {
  const input = document.getElementById("userInput");
  const userMessage = input.value.trim();
  
  if (!userMessage) return;
  
  displayMessage(userMessage, false);
  input.value = "";
  
  // Call Firebase Cloud Function for AI response
  try {
    const response = await fetch('https://your-project.cloudfunctions.net/generateResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });
    
    const data = await response.json();
    displayMessage(data.response, true);
  } catch (error) {
    displayMessage("Sorry, I couldn't process that request.", true);
  }
};
```

### Step 4: Create Cloud Function
Deploy this function to handle chatbot requests:

```python
# Python Cloud Function
from vertexai.generative_models import GenerativeModel

def generate_response(request):
    message = request.json.get('message')
    
    model = GenerativeModel('gemini-pro')
    prompt = f"""You are a helpful coding and electronics tutor for RaidAcademy.
    You help students learn about Arduino, Python, Cybersecurity, Web Development, and Raspberry Pi.
    Be friendly, concise, and provide practical examples.
    
    Student question: {message}"""
    
    response = model.generate_content(prompt)
    
    return {'response': response.text}
```

---

## 💡 How to Use

### For Students
1. **Explore Projects:**
   - Go to Projects page
   - Filter by course
   - Click "Start Project" to begin

2. **Get Help:**
   - Click 💬 Chat in navigation
   - Ask questions about your course/project
   - Get instant AI-powered answers

3. **Quick Access:**
   - On course detail page
   - Click "View Projects" button
   - Automatically filtered to that course

### For Admins
Add projects via Firebase:
1. Go to Firestore
2. Collection: `projects`
3. Add document with fields:
   - `course` (arduino, raspberrypi, python, cybersecurity, webdev)
   - `name` (project name)
   - `description` (what students will learn)
   - `image` (URL to image)
   - `difficulty` (Beginner, Intermediate, Advanced)
   - `duration` (time estimate)

Example:
```json
{
  "course": "arduino",
  "name": "LED RGB Controller",
  "description": "Learn to control RGB LEDs with PWM",
  "image": "https://example.com/rgb-led.jpg",
  "difficulty": "Intermediate",
  "duration": "1.5 hours"
}
```

---

## 📱 Current Chatbot Features (Local)

The chatbot currently uses a knowledge base system:
- Fast responses (no API delay)
- Works offline
- Smart keyword matching
- Helpful for common questions

### Supported Topics
- Arduino basics and projects
- Sensor integration
- Motor control
- IoT concepts
- Raspberry Pi setup
- GPIO programming
- Python fundamentals
- Web scraping
- Discord bot creation
- Cybersecurity basics
- Password security
- Network security
- Web development HTML/CSS/JS
- Portfolio building

---

## 🎯 Next Steps

1. **Add More Projects:** Update `projects.js` or add to Firestore
2. **Customize Chatbot:** Edit knowledge base in `chatbot.js`
3. **Enable Real AI:** Follow Vertex AI setup above
4. **Analytics:** Track which projects/topics are popular
5. **Project Details:** Create detailed project pages with tutorials

---

## 🐛 Troubleshooting

**Projects not showing?**
- Check Firestore is initialized
- Verify Firebase is loaded before projects.js
- Check browser console for errors

**Chatbot not responding?**
- Check JavaScript console
- Verify chatbot.js is loaded
- Clear browser cache

**Course filtering not working?**
- Check URL parameter format
- Verify course names match in courseMap
- Check browser console for errors

---

## 📊 API Endpoints (When Real AI is Enabled)

```
POST /api/chat
Body: { "message": "user question" }
Response: { "response": "AI answer" }

GET /api/projects?course=arduino
Response: [ { project objects } ]

GET /api/projects/:id
Response: { project details }
```

---

## 📚 Resources

- [Firebase Vertex AI Docs](https://cloud.google.com/vertex-ai/docs)
- [Firebase Generative AI Extension](https://firebase.google.com/docs/extensions/official/firestore-gemini-chatbot)
- [Google Cloud Console](https://console.cloud.google.com)
- [Cloud Functions for Python](https://cloud.google.com/functions/docs/writing/write-http-functions)

---

Enjoy your new Projects & Chatbot features! 🚀
