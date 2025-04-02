// Danh sách thành viên
let MEMBERS = JSON.parse(localStorage.getItem('members')) || ['Phương', 'Thắng', 'Hoàng', 'Giang', 'Đức', 'Duyệt', 'Tâm'];

// Lưu trữ chi tiêu
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Biến toàn cục
let currentUser = null;
let currentGroup = null;

// Khởi tạo các phần tử DOM
const expenseForm = document.getElementById('expenseForm');
const expensesList = document.getElementById('expensesList');
const personalSummary = document.getElementById('personalSummary');
const settlementList = document.getElementById('settlementList');
const splitEquallyToggle = document.getElementById('splitEqually');
const customSplitGroup = document.getElementById('customSplitGroup');
const customSplitInputs = document.getElementById('customSplitInputs');
const participantsGroup = document.getElementById('participantsGroup');
const newParticipantInput = document.getElementById('newParticipant');
const addParticipantBtn = document.getElementById('addParticipantBtn');

// DOM Elements
const loginSection = document.getElementById('loginSection');
const groupSection = document.getElementById('groupSection');
const mainContent = document.getElementById('mainContent');
const userInfo = document.getElementById('userInfo');
const userNameSpan = document.getElementById('userName');
const loginForm = document.getElementById('loginForm');
const createGroupBtn = document.getElementById('createGroupBtn');
const joinGroupBtn = document.getElementById('joinGroupBtn');
const createGroupModal = document.getElementById('createGroupModal');
const createGroupForm = document.getElementById('createGroupForm');
const copyGroupCodeBtn = document.getElementById('copyGroupCodeBtn');
const switchGroupBtn = document.getElementById('switchGroupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const currentGroupName = document.getElementById('currentGroupName');

// Khởi tạo checkbox cho người tham gia
function initializeParticipantsCheckboxes() {
    participantsGroup.innerHTML = '';
    MEMBERS.forEach(member => {
        const div = document.createElement('div');
        div.className = 'participant-item';
        div.innerHTML = `
            <input type="checkbox" id="${member}" value="${member}">
            <label for="${member}">${member}</label>
            <button type="button" onclick="removeMember('${member}')" title="Xóa người này">
                <i class="fas fa-times"></i>
            </button>
        `;
        participantsGroup.appendChild(div);
    });
}

// Thêm người tham gia mới
function addNewParticipant() {
    const newName = newParticipantInput.value.trim();

    if (!newName) {
        alert('Vui lòng nhập tên người tham gia!');
        return;
    }

    if (MEMBERS.includes(newName)) {
        alert('Người này đã có trong danh sách!');
        return;
    }

    MEMBERS.push(newName);
    localStorage.setItem('members', JSON.stringify(MEMBERS));

    // Cập nhật danh sách người tham gia
    initializeParticipantsCheckboxes();

    // Cập nhật danh sách người trả
    updatePayerSelect();

    // Cập nhật input chia tiền tùy chỉnh
    initializeCustomSplitInputs();

    // Xóa input
    newParticipantInput.value = '';
}

// Xóa người tham gia
function removeMember(member) {
    if (confirm(`Bạn có chắc chắn muốn xóa ${member} khỏi danh sách?`)) {
        MEMBERS = MEMBERS.filter(m => m !== member);
        localStorage.setItem('members', JSON.stringify(MEMBERS));

        // Cập nhật danh sách người tham gia
        initializeParticipantsCheckboxes();

        // Cập nhật danh sách người trả
        updatePayerSelect();

        // Cập nhật input chia tiền tùy chỉnh
        initializeCustomSplitInputs();
    }
}

// Cập nhật danh sách người trả
function updatePayerSelect() {
    const payerSelect = document.getElementById('payer');
    const currentValue = payerSelect.value;

    payerSelect.innerHTML = '<option value="">Chọn người trả</option>';
    MEMBERS.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        payerSelect.appendChild(option);
    });

    // Giữ lại giá trị đã chọn nếu vẫn còn trong danh sách
    if (MEMBERS.includes(currentValue)) {
        payerSelect.value = currentValue;
    }
}

// Xử lý sự kiện thêm người tham gia
addParticipantBtn.addEventListener('click', addNewParticipant);
newParticipantInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addNewParticipant();
    }
});

// Khởi tạo input cho chia tiền tùy chỉnh
function initializeCustomSplitInputs() {
    customSplitInputs.innerHTML = '';
    MEMBERS.forEach(member => {
        const div = document.createElement('div');
        div.className = 'custom-split-input';
        div.innerHTML = `
            <label for="split-${member}">${member}:</label>
            <input type="number" id="split-${member}" min="0" step="1000" value="0">
        `;
        customSplitInputs.appendChild(div);
    });
}

// Xử lý sự kiện toggle chia đều
splitEquallyToggle.addEventListener('change', (e) => {
    customSplitGroup.style.display = e.target.checked ? 'none' : 'block';
});

// Khởi tạo ứng dụng
function initialize() {
    // Kiểm tra người dùng đã đăng nhập chưa
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserInfo();
        loadGroups();
    } else {
        showLoginForm();
    }
}

// Hiển thị form đăng nhập
function showLoginForm() {
    loginSection.style.display = 'block';
    groupSection.style.display = 'none';
    mainContent.style.display = 'none';
    userInfo.style.display = 'none';
}

// Hiển thị thông tin người dùng
function showUserInfo() {
    userNameSpan.textContent = currentUser.name;
    userInfo.style.display = 'flex';
}

// Xử lý đăng nhập
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userName = document.getElementById('userNameInput').value.trim();

    if (!userName) {
        showToast('Vui lòng nhập tên của bạn!');
        return;
    }

    currentUser = {
        id: Date.now().toString(),
        name: userName
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showUserInfo();
    loadGroups();
});

// Tải danh sách nhóm
async function loadGroups() {
    loginSection.style.display = 'none';
    groupSection.style.display = 'block';
    mainContent.style.display = 'none';

    const groupsList = document.getElementById('groupsList');
    groupsList.innerHTML = '';

    try {
        const snapshot = await db.collection('users').doc(currentUser.id).collection('groups').get();

        snapshot.forEach(doc => {
            const group = { id: doc.id, ...doc.data() };
            const div = document.createElement('div');
            div.className = 'group-item';
            div.innerHTML = `
                <div class="group-name">${group.name}</div>
                <div class="group-code">${group.id}</div>
            `;
            div.onclick = () => selectGroup(group);
            groupsList.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading groups:', error);
        showToast('Không thể tải danh sách nhóm');
    }
}

// Tạo nhóm mới
createGroupBtn.addEventListener('click', () => {
    createGroupModal.style.display = 'flex';
});

createGroupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const groupName = document.getElementById('groupName').value.trim();

    if (!groupName) {
        showToast('Vui lòng nhập tên nhóm!');
        return;
    }

    try {
        const groupRef = await db.collection('groups').add({
            name: groupName,
            createdBy: currentUser.id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            members: [{
                id: currentUser.id,
                name: currentUser.name
            }]
        });

        await db.collection('users').doc(currentUser.id).collection('groups').doc(groupRef.id).set({
            name: groupName,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        closeCreateGroupModal();
        loadGroups();
        showToast('Đã tạo nhóm thành công!');
    } catch (error) {
        console.error('Error creating group:', error);
        showToast('Không thể tạo nhóm mới');
    }
});

// Xử lý nhập mã nhóm
const joinGroupInput = document.getElementById('joinGroupInput');
joinGroupInput.addEventListener('input', (e) => {
    // Chỉ cho phép nhập số
    e.target.value = e.target.value.replace(/[^0-9]/g, '');

    // Giới hạn độ dài 6 số
    if (e.target.value.length > 6) {
        e.target.value = e.target.value.slice(0, 6);
    }
});

// Xử lý tham gia nhóm
joinGroupBtn.addEventListener('click', async () => {
    const groupCode = joinGroupInput.value;
    if (groupCode.length !== 6 || !/^\d+$/.test(groupCode)) {
        showToast('Mã nhóm phải gồm đúng 6 số');
        return;
    }

    try {
        const groupDoc = await db.collection('groups').doc(groupCode).get();

        if (!groupDoc.exists) {
            showToast('Không tìm thấy nhóm với mã này!');
            return;
        }

        const groupData = groupDoc.data();

        // Kiểm tra xem đã là thành viên chưa
        if (groupData.members.some(member => member.id === currentUser.id)) {
            showToast('Bạn đã là thành viên của nhóm này!');
            return;
        }

        // Thêm người dùng vào nhóm
        await db.collection('groups').doc(groupCode).update({
            members: firebase.firestore.FieldValue.arrayUnion({
                id: currentUser.id,
                name: currentUser.name
            })
        });

        // Thêm nhóm vào danh sách nhóm của người dùng
        await db.collection('users').doc(currentUser.id).collection('groups').doc(groupCode).set({
            name: groupData.name,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        document.getElementById('joinGroupInput').value = '';
        loadGroups();
        showToast('Đã tham gia nhóm thành công!');
    } catch (error) {
        console.error('Error joining group:', error);
        showToast('Không thể tham gia nhóm');
    }
});

// Chọn nhóm
async function selectGroup(group) {
    currentGroup = group;
    localStorage.setItem('currentGroup', JSON.stringify(group));

    groupSection.style.display = 'none';
    mainContent.style.display = 'block';

    currentGroupName.textContent = group.name;

    // Tải dữ liệu của nhóm
    await loadGroupData();
}

// Tải dữ liệu của nhóm
async function loadGroupData() {
    try {
        const groupDoc = await db.collection('groups').doc(currentGroup.id).get();
        const groupData = groupDoc.data();

        // Cập nhật danh sách thành viên
        MEMBERS = groupData.members.map(member => member.name);

        // Tải chi tiêu
        const expensesSnapshot = await db.collection('groups').doc(currentGroup.id)
            .collection('expenses').orderBy('createdAt', 'desc').get();

        expenses = expensesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Cập nhật giao diện
        initializeParticipantsCheckboxes();
        updatePayerSelect();
        initializeCustomSplitInputs();
        updateExpensesList();
        updateSettlementResults();
    } catch (error) {
        console.error('Error loading group data:', error);
        showToast('Không thể tải dữ liệu nhóm');
    }
}

// Lưu chi tiêu mới
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const expenseName = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const payer = document.getElementById('payer').value;
    const participants = Array.from(document.querySelectorAll('#participantsGroup input:checked')).map(cb => cb.value);
    const splitEqually = splitEquallyToggle.checked;

    if (!expenseName || !amount || !payer || participants.length === 0) {
        showToast('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    let splits = {};
    if (splitEqually) {
        const splitAmount = amount / participants.length;
        participants.forEach(participant => {
            splits[participant] = splitAmount;
        });
    } else {
        let totalCustomSplit = 0;
        participants.forEach(participant => {
            const splitAmount = parseFloat(document.getElementById(`split-${participant}`).value) || 0;
            splits[participant] = splitAmount;
            totalCustomSplit += splitAmount;
        });

        if (Math.abs(totalCustomSplit - amount) > 0.01) {
            showToast('Tổng số tiền chia phải bằng với số tiền chi tiêu!');
            return;
        }
    }

    try {
        await db.collection('groups').doc(currentGroup.id).collection('expenses').add({
            name: expenseName,
            amount,
            payer,
            participants,
            splits,
            createdBy: currentUser.id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        expenseForm.reset();
        await loadGroupData();
        showToast('Đã lưu chi tiêu thành công!');
    } catch (error) {
        console.error('Error saving expense:', error);
        showToast('Không thể lưu chi tiêu');
    }
});

// Cập nhật danh sách chi tiêu
function updateExpensesList() {
    expensesList.innerHTML = '';
    expenses.forEach(expense => {
        const div = document.createElement('div');
        div.className = 'expense-item';
        div.innerHTML = `
            <div>
                <h3>${expense.name}</h3>
                <p>Số tiền: ${formatCurrency(expense.amount)}</p>
                <p>Người trả: ${expense.payer}</p>
                <p>Người tham gia: ${expense.participants.join(', ')}</p>
            </div>
            <div class="expense-actions">
                <button class="btn-edit" onclick="editExpense(${expense.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteExpense(${expense.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        expensesList.appendChild(div);
    });
}

// Cập nhật kết quả chi tiền
function updateSettlementResults() {
    const balances = {};
    MEMBERS.forEach(member => {
        balances[member] = 0;
    });

    // Tính toán số dư cho mỗi người
    expenses.forEach(expense => {
        // Người trả được cộng số tiền đã trả
        balances[expense.payer] += expense.amount;

        // Người tham gia bị trừ số tiền phải trả
        Object.entries(expense.splits).forEach(([participant, amount]) => {
            balances[participant] -= amount;
        });
    });

    // Hiển thị tổng kết cá nhân
    personalSummary.innerHTML = '';
    Object.entries(balances).forEach(([member, balance]) => {
        const div = document.createElement('div');
        div.className = 'settlement-item';
        div.innerHTML = `
            <span>${member}:</span>
            <span class="${balance >= 0 ? 'positive' : 'negative'}">
                ${formatCurrency(balance)}
            </span>
        `;
        personalSummary.appendChild(div);
    });

    // Tính toán và hiển thị các giao dịch cần thực hiện
    const settlements = calculateSettlements(balances);
    settlementList.innerHTML = '';
    settlements.forEach(settlement => {
        const div = document.createElement('div');
        div.className = 'settlement-item';
        div.innerHTML = `
            <span>${settlement.from} → ${settlement.to}:</span>
            <span>${formatCurrency(settlement.amount)}</span>
        `;
        settlementList.appendChild(div);
    });
}

// Tính toán các giao dịch cần thực hiện
function calculateSettlements(balances) {
    const settlements = [];
    const debtors = Object.entries(balances)
        .filter(([_, balance]) => balance < 0)
        .map(([person, balance]) => ({ person, balance: -balance }))
        .sort((a, b) => b.balance - a.balance);

    const creditors = Object.entries(balances)
        .filter(([_, balance]) => balance > 0)
        .map(([person, balance]) => ({ person, balance }))
        .sort((a, b) => b.balance - a.balance);

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
        const debtor = debtors[debtorIndex];
        const creditor = creditors[creditorIndex];

        const amount = Math.min(debtor.balance, creditor.balance);
        settlements.push({
            from: debtor.person,
            to: creditor.person,
            amount
        });

        debtor.balance -= amount;
        creditor.balance -= amount;

        if (debtor.balance === 0) debtorIndex++;
        if (creditor.balance === 0) creditorIndex++;
    }

    return settlements;
}

// Xóa chi tiêu
async function deleteExpense(id) {
    if (confirm('Bạn có chắc chắn muốn xóa chi tiêu này?')) {
        try {
            await db.collection('groups').doc(currentGroup.id).collection('expenses').doc(id).delete();
            await loadGroupData();
            showToast('Đã xóa chi tiêu thành công!');
        } catch (error) {
            console.error('Error deleting expense:', error);
            showToast('Không thể xóa chi tiêu');
        }
    }
}

// Chỉnh sửa chi tiêu
function editExpense(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;

    // TODO: Implement edit functionality
    alert('Tính năng chỉnh sửa đang được phát triển!');
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Các hàm tiện ích
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
        toast.remove();
    }, 3000);
}

function closeCreateGroupModal() {
    createGroupModal.style.display = 'none';
    createGroupForm.reset();
}

// Copy mã nhóm
copyGroupCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentGroup.id)
        .then(() => showToast('Đã sao chép mã nhóm!'))
        .catch(() => showToast('Không thể sao chép mã nhóm'));
});

// Đổi nhóm
switchGroupBtn.addEventListener('click', () => {
    mainContent.style.display = 'none';
    groupSection.style.display = 'block';
    loadGroups();
});

// Đăng xuất
logoutBtn.addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentGroup');
        currentUser = null;
        currentGroup = null;
        showLoginForm();
    }
});

// Tạo mã nhóm ngẫu nhiên 6 số
function generateGroupCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', initialize); 
