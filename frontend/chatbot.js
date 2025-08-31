// Simple AI Chatbot UI
import { aiDiagnose } from './api.js';
import { notify } from './notify.js';

let chatHistory = [];

export function showChatbot() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h2 class="mb-4">AI Medical Chatbot</h2>
    <div class="card p-3 mb-3" id="chatWindow" style="height:350px; overflow-y:auto; background:#f8f9fa;"></div>
    <form id="chatForm" class="d-flex">
      <input type="text" class="form-control me-2" id="chatInput" placeholder="Describe your symptoms..." required autocomplete="off">
      <button class="btn btn-success" type="submit">Send</button>
    </form>
  `;
  const chatWindow = document.getElementById('chatWindow');
  if (chatHistory.length === 0) {
    chatHistory.push({ sender: 'ai', text: 'Hello! How can I help you today?' });
  }
  renderChat(chatWindow);
  document.getElementById('chatForm').onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    const userMsg = input.value;
    chatHistory.push({ sender: 'user', text: userMsg });
    renderChat(chatWindow);
    input.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;
    // Typing indicator
    chatHistory.push({ sender: 'ai', text: '...', typing: true });
    renderChat(chatWindow);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    // Get AI response
    let aiMsg = '';
    try {
      const ai = await aiDiagnose(userMsg);
      if (ai.error) {
        aiMsg = `Error: ${ai.error}`;
      } else {
        aiMsg = ai.need_doctor ? ai.reason : ai.prescription;
      }
    } catch (err) {
      aiMsg = 'Error: Unable to reach AI service.';
    }
    // Remove typing indicator
    chatHistory = chatHistory.filter(m => !m.typing);
    chatHistory.push({ sender: 'ai', text: aiMsg });
    renderChat(chatWindow);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    notify('AI responded: ' + aiMsg, aiMsg.startsWith('Error') ? 'danger' : 'info');
  };
}

function renderChat(chatWindow) {
  chatWindow.innerHTML = chatHistory.map(m => {
    if (m.sender === 'user') {
      return `<div class="d-flex justify-content-end mb-2">
        <div class="bg-primary text-white rounded px-3 py-2" style="max-width:70%">${m.text}</div>
        <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=32" class="ms-2 rounded-circle" width="32" height="32" alt="User">
      </div>`;
    } else if (m.typing) {
      return `<div class="d-flex align-items-center mb-2"><img src="https://ui-avatars.com/api/?name=AI&background=6c757d&color=fff&size=32" class="me-2 rounded-circle" width="32" height="32" alt="AI"><span class="text-muted fst-italic">AI is typing...</span></div>`;
    } else {
      return `<div class="d-flex align-items-center mb-2">
        <img src="https://ui-avatars.com/api/?name=AI&background=6c757d&color=fff&size=32" class="me-2 rounded-circle" width="32" height="32" alt="AI">
        <div class="bg-light border rounded px-3 py-2" style="max-width:70%">${m.text}</div>
      </div>`;
    }
  }).join('');
}
