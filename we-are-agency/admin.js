document.addEventListener("DOMContentLoaded", () => {
    const adminBtn = document.getElementById('secret-admin-btn');
    const adminModal = document.getElementById('admin-modal');
    const closeModal = document.querySelector('.close-modal');
    const loginBtn = document.getElementById('admin-login-btn');
    const passInput = document.getElementById('admin-pass');
    const errorText = document.getElementById('admin-error');
    const adminPanel = document.getElementById('admin-panel');
    const logoutBtn = document.getElementById('admin-logout');
    const clearDataBtn = document.getElementById('clear-data-btn');
    
    const SECRET_PASS = '23467';
    let isAdmin = localStorage.getItem('weare_admin_auth') === 'true';

    // Editable elements
    const editableElements = document.querySelectorAll('.editable-text');

    // Initialize content from localStorage
    function loadSavedContent() {
        editableElements.forEach(el => {
            const id = el.getAttribute('data-edit-id');
            const savedContent = localStorage.getItem(`weare_content_${id}`);
            if (savedContent) {
                el.innerHTML = savedContent;
            }
        });
    }

    // Toggle Edit Mode
    function toggleEditMode(enable) {
        if (enable) {
            adminPanel.style.display = 'block';
            editableElements.forEach(el => {
                el.setAttribute('contenteditable', 'true');
                
                // Save on blur
                el.addEventListener('blur', saveContent);
            });
        } else {
            adminPanel.style.display = 'none';
            editableElements.forEach(el => {
                el.removeAttribute('contenteditable');
                el.removeEventListener('blur', saveContent);
            });
        }
    }

    function saveContent(e) {
        const id = e.target.getAttribute('data-edit-id');
        const content = e.target.innerHTML;
        localStorage.setItem(`weare_content_${id}`, content);
        
        // Visual feedback
        const originalBg = e.target.style.backgroundColor;
        e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        setTimeout(() => {
            e.target.style.backgroundColor = originalBg;
        }, 500);
    }

    // Event Listeners
    adminBtn.addEventListener('click', () => {
        if (!isAdmin) {
            adminModal.style.display = 'flex';
            passInput.value = '';
            errorText.style.display = 'none';
        }
    });

    closeModal.addEventListener('click', () => {
        adminModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
        }
    });

    loginBtn.addEventListener('click', () => {
        if (passInput.value === SECRET_PASS) {
            isAdmin = true;
            localStorage.setItem('weare_admin_auth', 'true');
            adminModal.style.display = 'none';
            toggleEditMode(true);
        } else {
            errorText.style.display = 'block';
        }
    });

    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });

    logoutBtn.addEventListener('click', () => {
        isAdmin = false;
        localStorage.removeItem('weare_admin_auth');
        toggleEditMode(false);
    });

    clearDataBtn.addEventListener('click', () => {
        if(confirm("Tem certeza que deseja limpar todas as edições e voltar ao texto original?")) {
            editableElements.forEach(el => {
                const id = el.getAttribute('data-edit-id');
                localStorage.removeItem(`weare_content_${id}`);
            });
            location.reload();
        }
    });

    // Init
    loadSavedContent();
    if (isAdmin) {
        toggleEditMode(true);
    }
});
