<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EzSplit+ - Chia tiền dễ dàng cùng Hoàng</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="container">
        <header>
            <h1>EzSplit+</h1>
            <p class="subtitle">Chia tiền dễ dàng cùng Hoàng</p>
            <div id="userInfo" style="display: none;">
                <span id="userName"></span>
                <button id="logoutBtn" class="btn-secondary">
                    <i class="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
            </div>
        </header>

        <!-- Phần đăng nhập -->
        <section id="loginSection" class="login-section">
            <h2>Đăng nhập / Tham gia nhóm</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="userNameInput">Tên của bạn:</label>
                    <input type="text" id="userNameInput" required placeholder="Nhập tên của bạn">
                </div>
                <button type="submit" class="btn-primary">Tiếp tục</button>
            </form>
        </section>

        <!-- Phần chọn nhóm -->
        <section id="groupSection" class="group-section" style="display: none;">
            <h2>Chọn nhóm</h2>
            <div class="groups-container">
                <div id="groupsList" class="groups-list">
                    <!-- Danh sách nhóm sẽ được thêm vào đây -->
                </div>
                <div class="group-actions">
                    <button id="createGroupBtn" class="btn-primary">
                        <i class="fas fa-plus"></i> Tạo nhóm mới
                    </button>
                    <div class="form-group">
                        <div class="group-input-container">
                            <input type="text" id="joinGroupInput" pattern="[0-9]{6}" maxlength="6"
                                placeholder="Nhập mã nhóm 6 số để tham gia" title="Mã nhóm phải gồm 6 số">
                            <div class="group-input-error">Mã nhóm phải gồm đúng 6 số</div>
                        </div>
                        <button id="joinGroupBtn" class="btn-secondary">
                            <i class="fas fa-sign-in-alt"></i> Tham gia nhóm
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Form tạo nhóm mới -->
        <div id="createGroupModal" class="modal" style="display: none;">
            <div class="modal-content">
                <h3>Tạo nhóm mới</h3>
                <form id="createGroupForm">
                    <div class="form-group">
                        <label for="groupName">Tên nhóm:</label>
                        <input type="text" id="groupName" required placeholder="Nhập tên nhóm">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeCreateGroupModal()">Hủy</button>
                        <button type="submit" class="btn-primary">Tạo nhóm</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Phần chính của ứng dụng -->
        <main id="mainContent" style="display: none;">
            <div class="group-header">
                <h2 id="currentGroupName"></h2>
                <div class="group-info">
                    <button id="copyGroupCodeBtn" class="btn-secondary">
                        <i class="fas fa-copy"></i> Sao chép mã nhóm
                    </button>
                    <button id="switchGroupBtn" class="btn-secondary">
                        <i class="fas fa-exchange-alt"></i> Đổi nhóm
                    </button>
                </div>
            </div>

            <section class="add-expense">
                <h2>Thêm chi tiêu mới</h2>
                <form id="expenseForm">
                    <div class="form-group">
                        <label for="expenseName">Tên chi tiêu:</label>
                        <input type="text" id="expenseName" required>
                    </div>

                    <div class="form-group">
                        <label for="amount">Số tiền:</label>
                        <input type="number" id="amount" min="0" step="1000" required>
                    </div>

                    <div class="form-group">
                        <label for="payer">Người trả:</label>
                        <select id="payer" required>
                            <option value="">Chọn người trả</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Những người tham gia:</label>
                        <div class="add-participant">
                            <input type="text" id="newParticipant" placeholder="Nhập tên người mới">
                            <button type="button" class="btn-secondary" id="addParticipantBtn">
                                <i class="fas fa-plus"></i> Thêm
                            </button>
                            <button type="button" class="btn-secondary" id="selectAllBtn">
                                <i class="fas fa-check-double"></i> All
                            </button>
                        </div>
                        <div class="checkbox-group" id="participantsGroup">
                            <!-- Checkboxes will be added dynamically -->
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="switch">
                            <span class="switch-label">Chia đều theo đầu người</span>
                            <input type="checkbox" id="splitEqually">
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <div class="form-group" id="customSplitGroup" style="display: none;">
                        <label>Chi tiêu theo người:</label>
                        <div id="customSplitInputs">
                            <!-- Custom split inputs will be added dynamically -->
                        </div>
                    </div>

                    <button type="submit" class="btn-primary">Lưu chi tiêu</button>
                </form>
            </section>

            <section class="expenses-list">
                <h2>Danh sách chi tiêu</h2>
                <div id="expensesList">
                    <!-- Expenses will be added dynamically -->
                </div>
            </section>

            <section class="settlement-results">
                <h2>Kết quả chi tiền</h2>
                <div class="results-container">
                    <div class="personal-summary">
                        <h3>Tổng kết cá nhân</h3>
                        <div id="personalSummary">
                            <!-- Personal summary will be added dynamically -->
                        </div>
                    </div>
                    <div class="settlement-list">
                        <h3>Các giao dịch cần thực hiện</h3>
                        <div id="settlementList">
                            <!-- Settlement list will be added dynamically -->
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer>
            <p>Made with ♥️ by Harish </p>
            <p>&copy; 2025 EzSplit+. All rights reserved.</p>
        </footer>
    </div>

    <!-- Firebase -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
    <script src="firebase-config.js"></script>
    <script src="script.js"></script>
</body>

</html>
