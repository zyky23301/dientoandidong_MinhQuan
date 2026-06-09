/**
 * QuanChatApp - Frontend Logic
 * Sinh viên: Nguyễn Minh Quân
 */

const ENDPOINT = 'http://localhost:3000/api/v1/chat';
const LOCAL_STORAGE_KEY = 'nmq_chat_data';

// Get elements
const msgBoard = document.getElementById('messageBoard');
const txtMessage = document.getElementById('txtMessage');
const btnSend = document.getElementById('btnSend');
const filterText = document.getElementById('filterText');
const btnWipeData = document.getElementById('btnWipeData');

// Edit elements
const modalEdit = document.getElementById('modalEdit');
const txtEditContent = document.getElementById('txtEditContent');
const btnCancelEdit = document.getElementById('btnCancelEdit');
const btnConfirmEdit = document.getElementById('btnConfirmEdit');

// State variables
let roleType = document.body.getAttribute('data-role'); // 'admin' or 'customer'
let apiStatus = true; // true = online, false = offline
let currentEditId = null;

// Initialization
const startApp = () => {
    if(!roleType) return; // Không phải trang chat thì bỏ qua

    loadData();

    // Event Listeners
    btnSend?.addEventListener('click', postMessage);
    
    txtMessage?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            postMessage();
        }
    });

    filterText?.addEventListener('input', () => {
        loadData(filterText.value.trim());
    });

    btnWipeData?.addEventListener('click', wipeAllChats);

    // Edit Modal events
    btnCancelEdit?.addEventListener('click', closeEdit);
    btnConfirmEdit?.addEventListener('click', applyEdit);
    
    txtEditContent?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            applyEdit();
        }
    });

    // Auto refresh from server
    setInterval(() => {
        if (apiStatus && !currentEditId) {
            loadData(filterText?.value.trim(), false);
        }
    }, 2000);

    // Sync across tabs if offline
    window.addEventListener('storage', () => {
        if (!apiStatus) loadData(filterText?.value.trim(), false);
    });
};

// Data Fetching
const fetchData = async () => {
    if (apiStatus) {
        try {
            const abortCtrl = new AbortController();
            const timer = setTimeout(() => abortCtrl.abort(), 1500);
            
            const res = await fetch(`${ENDPOINT}/history`, { signal: abortCtrl.signal });
            clearTimeout(timer);
            
            if (!res.ok) throw new Error("Network response error");
            return await res.json();
        } catch (err) {
            console.log("[QuanChat] API Error. Switching to Offline Mode.");
            apiStatus = false;
            return getOfflineData();
        }
    }
    return getOfflineData();
};

const getOfflineData = () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

const saveOfflineData = (data) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

// Rendering
const renderItem = (item) => {
    const isOwner = item.role === roleType;
    
    const row = document.createElement('div');
    row.className = `msg-row ${isOwner ? 'outbound' : 'inbound'}`;
    row.id = `rec-${item.id}`;

    const formattedText = item.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, '<br>');

    const timeLabel = new Date(item.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    let actionHtml = '';
    if (isOwner) {
        actionHtml = `
            <div class="msg-tools">
                <i class="bi bi-pencil-square" onclick="openEdit(${item.id}, '${item.text.replace(/'/g, "\\'")}')"></i>
                <i class="bi bi-trash" style="color:var(--aurora-red)" onclick="removeSingle(${item.id})"></i>
            </div>
        `;
    }

    row.innerHTML = `
        <div class="msg-content">
            ${formattedText}
        </div>
        <div class="msg-meta">
            <span>${timeLabel} ${item.isEdited ? '<i>(đã sửa)</i>' : ''}</span>
            ${actionHtml}
        </div>
    `;

    return row;
};

const loadData = async (filterStr = '', scrollBottom = true) => {
    const records = await fetchData();
    const isAtBottom = msgBoard.scrollHeight - msgBoard.clientHeight <= msgBoard.scrollTop + 50;

    msgBoard.innerHTML = ''; // Clear

    const resultList = records.filter(r => !filterStr || r.text.toLowerCase().includes(filterStr.toLowerCase()));

    if (resultList.length === 0 && filterStr) {
        msgBoard.innerHTML = '<div style="text-align:center;color:#999;margin-top:20px;">Không tìm thấy.</div>';
        return;
    }

    resultList.forEach(rec => {
        msgBoard.appendChild(renderItem(rec));
    });

    if (!filterStr && (scrollBottom || isAtBottom)) {
        msgBoard.scrollTop = msgBoard.scrollHeight;
    }
};

// Actions
const postMessage = async () => {
    const content = txtMessage.value.trim();
    if (!content) return;

    if (apiStatus) {
        try {
            await fetch(`${ENDPOINT}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: roleType, text: content })
            });
        } catch (error) {
            apiStatus = false;
            saveOfflineMessage(content);
        }
    } else {
        saveOfflineMessage(content);
    }

    txtMessage.value = '';
    await loadData('', true);
};

const saveOfflineMessage = (content, specificRole = null) => {
    const list = getOfflineData();
    list.push({
        id: Date.now(),
        role: specificRole || roleType,
        text: content,
        time: new Date().toISOString(),
        isEdited: false
    });
    saveOfflineData(list);
};

// Editing
window.openEdit = (id, rawText) => {
    currentEditId = id;
    txtEditContent.value = rawText;
    modalEdit.classList.add('show');
    txtEditContent.focus();
};

window.closeEdit = () => {
    modalEdit.classList.remove('show');
    currentEditId = null;
};

const applyEdit = async () => {
    const updatedTxt = txtEditContent.value.trim();
    if (!updatedTxt || !currentEditId) return;

    if (apiStatus) {
        try {
            await fetch(`${ENDPOINT}/update/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: updatedTxt })
            });
        } catch (e) {
            apiStatus = false;
            updateOfflineMessage(currentEditId, updatedTxt);
        }
    } else {
        updateOfflineMessage(currentEditId, updatedTxt);
    }

    closeEdit();
    await loadData('', false);
};

const updateOfflineMessage = (id, newText) => {
    const list = getOfflineData();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
        list[idx].text = newText;
        list[idx].isEdited = true;
        saveOfflineData(list);
    }
};

// Deleting
window.removeSingle = async (id) => {
    if(confirm("Bạn có muốn xóa tin nhắn này?")) {
        if(apiStatus) {
            alert("[Tính năng mở rộng] Server cần thêm API Delete single item.");
        } else {
            let list = getOfflineData();
            list = list.filter(r => r.id !== id);
            saveOfflineData(list);
            await loadData('', false);
        }
    }
};

const wipeAllChats = async () => {
    if(confirm("Cảnh báo: Xóa toàn bộ dữ liệu. Bạn chắc chứ?")) {
        if(apiStatus) {
            try {
                await fetch(`${ENDPOINT}/clear`, { method: 'DELETE' });
            } catch(e) {
                apiStatus = false;
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
        
        msgBoard.innerHTML = '<div style="text-align:center;color:var(--danger-color);margin-top:20px;">Lịch sử đã bị xóa.</div>';
        setTimeout(() => loadData('', true), 2000);
    }
};

// Init
document.addEventListener('DOMContentLoaded', startApp);
