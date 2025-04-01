// Danh sách thành viên
let MEMBERS = JSON.parse(localStorage.getItem('members')) || ['Phương', 'Thắng', 'Hoàng', 'Giang', 'Đức', 'Duyệt', 'Tâm'];

// Lưu trữ chi tiêu
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

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

// Xử lý submit form
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const expenseName = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const payer = document.getElementById('payer').value;
    const participants = Array.from(document.querySelectorAll('#participantsGroup input:checked')).map(cb => cb.value);
    const splitEqually = splitEquallyToggle.checked;

    if (!expenseName || !amount || !payer || participants.length === 0) {
        alert('Vui lòng điền đầy đủ thông tin!');
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
            alert('Tổng số tiền chia phải bằng với số tiền chi tiêu!');
            return;
        }
    }

    const expense = {
        id: Date.now(),
        name: expenseName,
        amount,
        payer,
        participants,
        splits,
        date: new Date().toISOString()
    };

    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateExpensesList();
    updateSettlementResults();
    expenseForm.reset();
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
function deleteExpense(id) {
    if (confirm('Bạn có chắc chắn muốn xóa chi tiêu này?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateExpensesList();
        updateSettlementResults();
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

// Khởi tạo trang web
function initialize() {
    initializeParticipantsCheckboxes();
    updatePayerSelect();
    initializeCustomSplitInputs();
    updateExpensesList();
    updateSettlementResults();
}

// Chạy khởi tạo khi trang web được tải
document.addEventListener('DOMContentLoaded', initialize); 