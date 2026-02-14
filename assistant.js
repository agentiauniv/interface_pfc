let currentChatId = null;
let allChats = JSON.parse(localStorage.getItem('uniConversations')) || [];
const database = ["How to register?", "Scholarship info", "Campus map", "Tuition fees", "Library hours"];

window.onload = renderHistoryList;

function handleSearch() {
    const query = document.getElementById('user-input').value.toLowerCase();
    const box = document.getElementById('suggestion-box');
    if (!query) { box.style.display = 'none'; return; }
    const filtered = database.filter(item => item.toLowerCase().includes(query));
    if (filtered.length > 0) {
        box.innerHTML = filtered.map(item =>
            <div onclick="applyText('${item}')" class="p-4 hover:bg-purple-500/10 cursor-pointer border-b border-purple-900/10 last:border-0 text-sm">${item}</div>
        ).join('');
        box.style.display = 'block';
    } else { box.style.display = 'none'; }
}

function applyText(text) {
    document.getElementById('user-input').value = text;
    document.getElementById('suggestion-box').style.display = 'none';
}

function send() {
    const input = document.getElementById('user-input');
    const messageText = input.value.trim();
    if (!messageText) return;

    if (currentChatId === null) {
        currentChatId = Date.now();
        const newChat = {
            id: currentChatId,
            title: messageText.substring(0, 30),
            messages: []
        };
        allChats.unshift(newChat);
        updateUIForChatMode();
    }

    const chatIndex = allChats.findIndex(c => c.id === currentChatId);
    allChats[chatIndex].messages.push({ role: 'user', text: messageText });

    setTimeout(() => {
        allChats[chatIndex].messages.push({
            role: 'ai',
            text: "UniAcademic AI: I am analyzing your request regarding " + messageText
        });
        saveAndRefresh();
        renderChatMessages();
    }, 400);

    saveAndRefresh();
    renderChatMessages();
    input.value = "";
    document.getElementById('suggestion-box').style.display = 'none';
}

function renderChatMessages() {
    const chat = allChats.find(c => c.id === currentChatId);
    const windowEl = document.getElementById('chat-window');
    if (!chat) return;
    windowEl.innerHTML = chat.messages.map(m => `
        <div onclick="applyText('${item}')" class="p-4 hover:bg-purple-500/10 cursor-pointer border-b border-purple-900/10 last:border-0 text-sm">${item}</div>
    `).join('');
    windowEl.scrollTop = windowEl.scrollHeight;
}

function loadChat(id) {
    currentChatId = id;
    updateUIForChatMode();
    renderChatMessages();
    renderHistoryList();
}

function updateUIForChatMode() {
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('chat-window').style.display = 'block';
    const container = document.getElementById('input-container');
    container.classList.remove('pos-mid');
    container.classList.add('pos-bottom');
    document.getElementById('suggestion-box').classList.replace('sug-below', 'sug-above');
}

function startNewChat() {
    currentChatId = null;
    document.getElementById('chat-window').innerHTML = "";
    document.getElementById('chat-window').style.display = 'none';
    document.getElementById('welcome').style.display = 'block';
    const container = document.getElementById('input-container');
    container.classList.remove('pos-bottom');
    container.classList.add('pos-mid');
    document.getElementById('suggestion-box').classList.replace('sug-above', 'sug-below');
    renderHistoryList();
}

function renderHistoryList() {
    const list = document.getElementById('history-list');
    list.innerHTML = allChats.map(chat => `
        <div class="history-item ${chat.id === currentChatId ? 'active-chat' : ''}" onclick="loadChat(${chat.id})">
            <span class="opacity-40">💬</span>
            <span class="truncate">${chat.title}</span>
        </div>
    `).join('');
}

function saveAndRefresh() {
    localStorage.setItem('uniConversations', JSON.stringify(allChats));
    renderHistoryList();
}

document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') send();
});