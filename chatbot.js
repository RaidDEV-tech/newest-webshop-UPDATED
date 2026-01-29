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