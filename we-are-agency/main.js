document.addEventListener('DOMContentLoaded', () => {
    // === Data & State ===
    const defaultData = {
        site_name: "WE ARE",
        hero_title: "Transformamos ideias em resultados digitais",
        hero_desc: "Edição profissional, design criativo e soluções digitais para sua empresa crescer.",
        about_text: "A We Are é uma empresa especializada em soluções digitais criativas, oferecendo serviços profissionais de edição, design e desenvolvimento para empresas, criadores de conteúdo e marcas.",
        footer_desc: "Transformando ideias em resultados digitais.",
        
        port_1_title: "Projeto Alpha", port_1_desc: "Design e Edição",
        port_2_title: "Campanha Beta", port_2_desc: "Vídeo Promocional",
        port_3_title: "Website Gamma", port_3_desc: "Desenvolvimento Web",
        
        test_1_text: `"Trabalho incrível! O design do nosso site ficou maravilhoso e a equipe é super profissional. Ajudou muito nas nossas vendas."`,
        test_1_author: "- João Silva, CEO",
        test_2_text: `"As edições de vídeo para o Instagram transformaram nosso engajamento. Recomendo a We Are de olhos fechados!"`,
        test_2_author: "- Maria Fernanda, Influenciadora",

        pix_msg: "Após realizar o pagamento envie o comprovante para nosso atendimento.",
        pix_key: "12954113421",
        whatsapp: "5582991424574",
        
        logo_url: "logo.jpg.jpeg",
        about_img_url: "logo.jpg.jpeg",

        services: [
            { id: 1, icon: 'bx-video', name: "Edição de Vídeo", price: "50", desc: "Edição profissional para vídeos curtos, TikTok, Instagram, YouTube e conteúdo empresarial." },
            { id: 2, icon: 'bx-camera', name: "Edição de Fotos", price: "30", desc: "Tratamento e edição profissional de imagens." },
            { id: 3, icon: 'bx-cube-alt', name: "Design de Logos", price: "80", desc: "Criação de logos modernas e personalizadas." },
            { id: 4, icon: 'bx-code-alt', name: "Design de Sites", price: "1000", desc: "Criação de sites modernos, profissionais e responsivos." },
            { id: 5, icon: 'bx-share-alt', name: "Artes para Redes Sociais", price: "40", desc: "Criação de posts e artes criativas." },
            { id: 6, icon: 'bx-layout', name: "Banners e Flyers", price: "50", desc: "Criação de banners digitais e materiais promocionais." }
        ]
    };

    let siteData = JSON.parse(localStorage.getItem('weare_data'));
    if (!siteData) {
        siteData = JSON.parse(JSON.stringify(defaultData));
    } else {
        // Merge missing keys in case of update
        siteData = { ...defaultData, ...siteData };
        if (!siteData.services || siteData.services.length === 0) {
            siteData.services = JSON.parse(JSON.stringify(defaultData.services));
        }
    }

    let isAdminMode = false;
    let selectedImageElement = null;

    // === UI Elements ===
    const servicesContainer = document.getElementById('services-container');
    const editableTexts = document.querySelectorAll('.editable-text');
    const editableImgs = document.querySelectorAll('.editable-img');
    const waBtn = document.getElementById('wa-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Modals
    const checkoutModal = document.getElementById('checkout-modal');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const imgEditModal = document.getElementById('img-edit-modal');
    const adminPanel = document.getElementById('admin-panel');
    const closeBtns = document.querySelectorAll('.close-modal');

    // === Functions ===

    function renderContent() {
        // Render Texts
        editableTexts.forEach(el => {
            const key = el.getAttribute('data-key');
            if (key && siteData[key] !== undefined) {
                el.innerText = siteData[key];
            }
        });

        // Render Images
        document.getElementById('nav-logo').src = siteData.logo_url;
        document.getElementById('hero-logo-img').src = siteData.logo_url;
        document.getElementById('footer-logo-btn').src = siteData.logo_url;
        document.getElementById('about-logo-img').src = siteData.about_img_url;

        // Render Services
        renderServices();

        // Update WhatsApp Links
        updateWhatsAppLinks();
        
        // Update Admin Inputs if open
        document.getElementById('admin-wa-input').value = siteData.whatsapp;
        document.getElementById('admin-pix-input').value = siteData.pix_key;
        // Update Checkout Display removed
    }

    function renderServices() {
        servicesContainer.innerHTML = '';
        siteData.services.forEach((srv, index) => {
            const delay = index % 3; // For animation delay
            
            const card = document.createElement('div');
            card.className = `service-card reveal delay-${delay}`;
            card.innerHTML = `
                <div class="icon-box" style="font-size: 2.5rem; color: var(--accent); margin-bottom: 1rem;"><i class='bx ${srv.icon}'></i></div>
                <h3 class="service-price editable-text" data-srv-id="${srv.id}" data-srv-key="price">R$${srv.price}</h3>
                <h4 class="service-title editable-text" data-srv-id="${srv.id}" data-srv-key="name">${srv.name}</h4>
                <p class="service-desc editable-text" data-srv-id="${srv.id}" data-srv-key="desc">${srv.desc}</p>
                <button class="btn btn-outline w-100 buy-btn" data-id="${srv.id}">Comprar</button>
            `;
            servicesContainer.appendChild(card);
        });

        // Re-attach listeners for buy buttons
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                openCheckout(id);
            });
        });

        // Re-apply admin editing logic if active
        if (isAdminMode) {
            setupAdminEditing();
        }
    }

    function updateWhatsAppLinks() {
        const msg = encodeURIComponent("Olá! Vi o site da We Are e gostaria de contratar um serviço.");
        const link = `https://wa.me/${siteData.whatsapp}?text=${msg}`;
        waBtn.href = link;
    }

    // === Theme Handling ===
    if (localStorage.getItem('theme') === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeToggle.innerHTML = "<i class='bx bx-sun'></i>";
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeToggle.innerHTML = "<i class='bx bx-moon'></i>";
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeToggle.innerHTML = "<i class='bx bx-sun'></i>";
            localStorage.setItem('theme', 'light');
        }
    });

    // === Animations & Scroll ===
    const backToTop = document.getElementById('back-to-top');

    function checkScroll() {
        const reveals = document.querySelectorAll('.reveal');
        const triggerBottom = window.innerHeight * 0.85;
        reveals.forEach(reveal => {
            const boxTop = reveal.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                reveal.classList.add('active');
            }
        });

        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Init

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // FAQ Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = "0";
            }
        });
    });

    // === Checkout Logic ===
    function openCheckout(srvId) {
        const srv = siteData.services.find(s => s.id === srvId);
        if (!srv) return;

        document.getElementById('checkout-srv-name').innerText = srv.name;
        document.getElementById('checkout-srv-price').innerText = `R$${srv.price}`;
        
        // Generate valid PIX BR Code payload
        const pixPayload = generatePixPayload(siteData.pix_key, siteData.site_name, "Brasil", srv.price);
        document.getElementById('pix-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixPayload)}`;
        
        document.getElementById('checkout-desc').value = ''; // Clear description
        
        checkoutModal.classList.add('active');
    }

    function generatePixPayload(pixKey, merchantName, merchantCity, amount) {
        let payload = "000201";
        let gui = "0014br.gov.bcb.pix";
        let key = `01${pixKey.length.toString().padStart(2, '0')}${pixKey}`;
        let accountInfo = `${gui}${key}`;
        payload += `26${accountInfo.length.toString().padStart(2, '0')}${accountInfo}`;
        payload += "52040000";
        payload += "5303986";
        if (amount) {
            let amtStr = parseFloat(amount).toFixed(2);
            payload += `54${amtStr.length.toString().padStart(2, '0')}${amtStr}`;
        }
        payload += "5802BR";
        let name = merchantName.substring(0, 25).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        if(!name) name = "WE ARE";
        payload += `59${name.length.toString().padStart(2, '0')}${name}`;
        let city = merchantCity.substring(0, 15).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        if(!city) city = "BRASIL";
        payload += `60${city.length.toString().padStart(2, '0')}${city}`;
        let txid = "***";
        let addData = `05${txid.length.toString().padStart(2, '0')}${txid}`;
        payload += `62${addData.length.toString().padStart(2, '0')}${addData}`;
        payload += "6304";
        let crc = 0xFFFF;
        for (let i = 0; i < payload.length; i++) {
            crc ^= payload.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc = crc << 1;
                }
            }
        }
        let crcStr = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
        return payload + crcStr;
    }

    document.getElementById('send-proof-btn').addEventListener('click', () => {
        const srvName = document.getElementById('checkout-srv-name').innerText;
        const srvPrice = document.getElementById('checkout-srv-price').innerText;
        const desc = document.getElementById('checkout-desc').value.trim();
        
        let rawMsg = `Olá! Realizei o pagamento via PIX para o serviço de *${srvName}* no valor de *${srvPrice}*.`;
        if (desc) {
            rawMsg += `\n\n*Detalhes do pedido:*\n${desc}`;
        }
        rawMsg += `\n\nSegue o meu comprovante:`;
        
        const msg = encodeURIComponent(rawMsg);
        window.open(`https://wa.me/${siteData.whatsapp}?text=${msg}`, '_blank');
    });

    // Close Modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // === Secret Admin Logic ===
    let clickCount = 0;
    let clickTimer;
    const footerLogo = document.getElementById('footer-logo-btn');

    footerLogo.addEventListener('click', (e) => {
        if (isAdminMode) {
            handleImageEditClick(e.target);
            return;
        }

        clickCount++;
        clearTimeout(clickTimer);
        
        if (clickCount >= 5) {
            clickCount = 0;
            adminLoginModal.classList.add('active');
            document.getElementById('admin-pass').value = '';
            document.getElementById('admin-error').style.display = 'none';
        } else {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 1000); // Reset after 1 second of inactivity
        }
    });

    document.getElementById('admin-login-btn').addEventListener('click', () => {
        const pass = document.getElementById('admin-pass').value;
        if (pass === '23467') {
            adminLoginModal.classList.remove('active');
            enableAdminMode();
        } else {
            document.getElementById('admin-error').style.display = 'block';
        }
    });

    function enableAdminMode() {
        isAdminMode = true;
        body.classList.add('admin-mode');
        adminPanel.style.display = 'block';
        setupAdminEditing();
    }

    function disableAdminMode() {
        isAdminMode = false;
        body.classList.remove('admin-mode');
        adminPanel.style.display = 'none';
        
        // Remove contenteditable
        document.querySelectorAll('.editable-text').forEach(el => {
            el.removeAttribute('contenteditable');
        });
    }

    function setupAdminEditing() {
        document.querySelectorAll('.editable-text').forEach(el => {
            el.setAttribute('contenteditable', 'true');
            // Prevent entering newlines in simple text
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    el.blur();
                }
            });
        });

        // Image editing logic
        document.querySelectorAll('.editable-img').forEach(img => {
            // Remove previous listener to avoid duplicates if re-rendered
            const newImg = img.cloneNode(true);
            img.parentNode.replaceChild(newImg, img);
            
            newImg.addEventListener('click', (e) => {
                if (!isAdminMode) return;
                handleImageEditClick(e.target);
            });
        });
    }

    function handleImageEditClick(imgElement) {
        selectedImageElement = imgElement;
        document.getElementById('img-url-input').value = imgElement.src;
        imgEditModal.classList.add('active');
    }

    document.getElementById('save-img-btn').addEventListener('click', () => {
        if (selectedImageElement) {
            const url = document.getElementById('img-url-input').value;
            selectedImageElement.src = url;
            
            // Save to state based on ID
            if (selectedImageElement.id === 'about-logo-img') {
                siteData.about_img_url = url;
            } else {
                siteData.logo_url = url; // Applies to nav, hero, footer
                document.getElementById('nav-logo').src = url;
                document.getElementById('hero-logo-img').src = url;
                document.getElementById('footer-logo-btn').src = url;
            }
        }
        imgEditModal.classList.remove('active');
    });

    document.getElementById('admin-logout-btn').addEventListener('click', disableAdminMode);

    document.getElementById('admin-save-btn').addEventListener('click', () => {
        // Collect text changes
        document.querySelectorAll('.editable-text').forEach(el => {
            const key = el.getAttribute('data-key');
            if (key) {
                siteData[key] = el.innerText;
            }
            
            // Handle service modifications
            const srvId = el.getAttribute('data-srv-id');
            const srvKey = el.getAttribute('data-srv-key');
            if (srvId && srvKey) {
                const srv = siteData.services.find(s => s.id == srvId);
                if (srv) {
                    if (srvKey === 'price') {
                        srv[srvKey] = el.innerText.replace('R$', '').trim();
                    } else {
                        srv[srvKey] = el.innerText;
                    }
                }
            }
        });

        // Collect admin inputs
        siteData.whatsapp = document.getElementById('admin-wa-input').value;
        siteData.pix_key = document.getElementById('admin-pix-input').value;

        // Save to local storage
        localStorage.setItem('weare_data', JSON.stringify(siteData));
        
        // Visual feedback
        const btn = document.getElementById('admin-save-btn');
        btn.innerText = "Salvo com sucesso!";
        setTimeout(() => { btn.innerText = "Salvar Alterações"; }, 2000);
        
        // Re-render to apply non-DOM state like links
        renderContent();
    });

    document.getElementById('admin-reset-btn').addEventListener('click', () => {
        if(confirm("Tem certeza que deseja restaurar o site para os dados padrão? Isso apagará todas as suas edições.")) {
            localStorage.removeItem('weare_data');
            siteData = JSON.parse(JSON.stringify(defaultData));
            renderContent();
        }
    });

    // Initial render
    document.getElementById('year').innerText = new Date().getFullYear();
    renderContent();
});
