const API_BASE = window.FMV.apiBase;
let currentDriverKey = "";
let activeShiftId = null;
let driverProfile = null;

const translations = {
    en: {
        login_title: "Driver Portal Login",
        login_subtitle: "Enter the unique secret code issued to you by the Admin Portal",
        driver_key_label: "Unique Driver Secret Code",
        login_btn: "Verify & Access Portal",
        profile_title: "Driver Profile Details",
        profile_subtitle: "Complete or update your personal contact & address details",
        driver_name_label: "Driver Full Name *",
        driver_phone_label: "Mobile Phone Number *",
        driver_address_label: "Full Address / Assigned Zone *",
        save_profile_btn: "Save & Continue",
        logout_btn: "Logout",
        edit_profile_btn: "My Details",
        pretrip_title: "Pre-Trip Vehicle Inspection & Clock-In",
        vehicle_plate: "Vehicle Plate Number",
        odometer_start: "Starting Odometer (KM)",
        checklist_label: "Mandatory Safety Checklist",
        check_tires: "Tires & Pressure OK",
        check_brakes: "Brakes Functioning",
        check_fuel: "Fuel / Battery Level Adequate",
        check_cold: "Cold-Chain Refrigerator Temp OK",
        clock_in_btn: "Start Shift & Clock-In",
        break_btn: "Take Break",
        clock_out_btn: "Clock Out",
        cod_summary_title: "Daily Cash Collection (COD)",
        log_expense_btn: "Log Expense",
        manifest_title: "Daily Delivery Manifest",
        loading_manifest: "Loading assigned deliveries...",
        epod_title: "Electronic Proof of Delivery (ePOD)",
        photo_proof: "Doorstep Photo Proof",
        customer_pin: "Customer Delivery PIN / OTP",
        confirm_delivery: "Confirm Delivery",
        cancel_btn: "Cancel"
    },
    ar: {
        login_title: "تسجيل دخول السائق",
        login_subtitle: "أدخل الرمز السري الفريد الممنوح لك من بوابة الإدارة",
        driver_key_label: "الرمز السري الفريد للسائق",
        login_btn: "تحقق ودخول البوابة",
        profile_title: "بيانات ملف السائق",
        profile_subtitle: "أكمل أو حدّث بيانات الاتصال والعنوان الخاصة بك",
        driver_name_label: "الاسم الكامل للسائق *",
        driver_phone_label: "رقم الجوال *",
        driver_address_label: "العنوان الكامل / المنطقة *",
        save_profile_btn: "حفظ ومتابعة",
        logout_btn: "تسجيل خروج",
        edit_profile_btn: "بياناتي",
        pretrip_title: "فحص المركبة قبل الرحلة وتسجيل الدوام",
        vehicle_plate: "رقم لوحة المركبة",
        odometer_start: "عداد المسافة عند البدء (كم)",
        checklist_label: "قائمة فحص الأمان الإلزامية",
        check_tires: "الإطارات والضغط سليم",
        check_brakes: "الفرامل تعمل بكفاءة",
        check_fuel: "مستوى الوقود / البطارية كافٍ",
        check_cold: "درجة حرارة ثلاجة التبريد سليمة",
        clock_in_btn: "بدء الوردية وتسجيل الحضور",
        break_btn: "استراحة",
        clock_out_btn: "انصراف",
        cod_summary_title: "تحصيل النقد اليومي (COD)",
        log_expense_btn: "تسجيل مصروف",
        manifest_title: "قائمة مهام التوصيل اليومية",
        loading_manifest: "جاري تحميل شحنات التوصيل...",
        epod_title: "إثبات التسليم الإلكتروني (ePOD)",
        photo_proof: "صورة إثبات التسليم عند الباب",
        customer_pin: "رقم التحقق (OTP) للعميل",
        confirm_delivery: "تأكيد التسليم",
        cancel_btn: "إلغاء"
    },
    hi: {
        login_title: "ड्राइवर पोर्टल लॉगिन",
        login_subtitle: "एडमिन पोर्टल द्वारा दिया गया अपना अद्वितीय गुप्त कोड दर्ज करें",
        driver_key_label: "अद्वितीय ड्राइवर गुप्त कोड",
        login_btn: "सत्यापित करें और लॉगिन करें",
        profile_title: "ड्राइवर प्रोफ़ाइल विवरण",
        profile_subtitle: "अपना नाम, फ़ोन नंबर और पता दर्ज या अपडेट करें",
        driver_name_label: "ड्राइवर का पूरा नाम *",
        driver_phone_label: "मोबाइल फ़ोन नंबर *",
        driver_address_label: "पूरा पता / क्षेत्र *",
        save_profile_btn: "सहेजें और आगे बढ़ें",
        logout_btn: "लॉग आउट",
        edit_profile_btn: "मेरा विवरण",
        pretrip_title: "यात्रा-पूर्व वाहन निरीक्षण और क्लॉक-इन",
        vehicle_plate: "वाहन प्लेट नंबर",
        odometer_start: "प्रारंभिक ओडोमीटर (किमी)",
        checklist_label: "अनिवार्य सुरक्षा चेकलिस्ट",
        check_tires: "टायर और दबाव ठीक है",
        check_brakes: "ब्रेक काम कर रहे हैं",
        check_fuel: "ईंधन / बैटरी स्तर पर्याप्त",
        check_cold: "कोल्ड-चेन रेफ्रिजरेटर तापमान ठीक है",
        clock_in_btn: "शिफ्ट शुरू करें और क्लॉक-इन करें",
        break_btn: "ब्रेक लें",
        clock_out_btn: "क्लॉक आउट",
        cod_summary_title: "दैनिक नकद संग्रह (COD)",
        log_expense_btn: "खर्च दर्ज करें",
        manifest_title: "दैनिक डिलीवरी मेनिफेस्ट",
        loading_manifest: "सौंपी गई डिलीवरी लोड हो रही है...",
        epod_title: "इलेक्ट्रॉनिक प्रूफ ऑफ डिलीवरी (ePOD)",
        photo_proof: "डोरस्टेप फोटो प्रमाण",
        customer_pin: "ग्राहक डिलीवरी पिन / OTP",
        confirm_delivery: "डिलीवरी की पुष्टि करें",
        cancel_btn: "रद्द करें"
    },
    ur: {
        login_title: "ڈرائیور پورٹل لاگ ان",
        login_subtitle: "ایڈمن پورٹل سے جاری کردہ اپنا منفرد خفیہ کوڈ درج کریں",
        driver_key_label: "منفرد ڈرائیور خفیہ کوڈ",
        login_btn: "تصدیق کریں اور داخل ہوں",
        profile_title: "ڈرائیور پروفائل کی تفصیلات",
        profile_subtitle: "اپنا نام، فون نمبر اور پتہ درج یا اپ ڈیٹ کریں",
        driver_name_label: "ڈرائیور کا پورا نام *",
        driver_phone_label: "موبائل فون نمبر *",
        driver_address_label: "مکمل پتہ / زون *",
        save_profile_btn: "محفوظ کریں اور آگے بڑھیں",
        logout_btn: "لاگ آؤٹ",
        edit_profile_btn: "میری تفصیلات",
        pretrip_title: "سفر سے پہلے گاڑی کا معائنہ اور حاضری",
        vehicle_plate: "گاڑی کی نمبر پلیٹ",
        odometer_start: "شروعاتی اوڈومیٹر (کلو میٹر)",
        checklist_label: "لازمی حفاظتی چیک لسٹ",
        check_tires: "ٹائر اور پریشر ٹھیک ہے",
        check_brakes: "بریک بالکل درست ہیں",
        check_fuel: "ایندھن / بیٹری کی سطح کافی ہے",
        check_cold: "کولڈ چین کا درجہ حرارت ٹھیک ہے",
        clock_in_btn: "شفٹ شروع کریں اور حاضری لگائیں",
        break_btn: "وقفہ لیں",
        clock_out_btn: "چھٹی کریں",
        cod_summary_title: "روزانہ کیش کلیکشن (COD)",
        log_expense_btn: "خرچہ درج کریں",
        manifest_title: "روزانہ کی ترسیل کی فہرست",
        loading_manifest: "ترسیلات لوڈ ہو رہی ہیں...",
        epod_title: "ڈیجیٹل رسید (ePOD)",
        photo_proof: "دروازے پر فوٹو ثبوت",
        customer_pin: "کسٹمر پن / OTP",
        confirm_delivery: "ترسیل کی تصدیق کریں",
        cancel_btn: "منسوخ کریں"
    },
    tl: {
        login_title: "Driver Portal Login",
        login_subtitle: "Ilagay ang natatanging secret code na ibinigay ng Admin Portal",
        driver_key_label: "Natatanging Driver Secret Code",
        login_btn: "I-verify at Mag-login",
        profile_title: "Detalye ng Driver Profile",
        profile_subtitle: "Ilagay o i-update ang iyong pangalan, numero ng telepono, at address",
        driver_name_label: "Buong Pangalan ng Driver *",
        driver_phone_label: "Mobile Phone Number *",
        driver_address_label: "Buong Address / Zone *",
        save_profile_btn: "I-save at Magpatuloy",
        logout_btn: "Mag-logout",
        edit_profile_btn: "Aking Detalye",
        pretrip_title: "Pre-Trip Inspection at Pag-clock In",
        vehicle_plate: "Plate Number ng Sasakyan",
        odometer_start: "Simulang Odometer (KM)",
        checklist_label: "Mandatory Safety Checklist",
        check_tires: "Maayos ang Gulong",
        check_brakes: "Gumagana ang Preno",
        check_fuel: "Sapat ang Gas/Baterya",
        check_cold: "Maayos ang Temperature ng Ref",
        clock_in_btn: "Simulan ang Shift at Mag-clock In",
        break_btn: "Mag-break",
        clock_out_btn: "Clock Out",
        cod_summary_title: "Pang-araw-araw na COD Collection",
        log_expense_btn: "Mag-log ng Gastos",
        manifest_title: "Listahan ng mga Delivery",
        loading_manifest: "Nag-load ng deliveries...",
        epod_title: "Electronic Proof of Delivery (ePOD)",
        photo_proof: "Larawan sa Doorstep",
        customer_pin: "Customer PIN / OTP",
        confirm_delivery: "Kumpirmahin ang Delivery",
        cancel_btn: "Kanselahin"
    }
};

function switchLanguage(lang) {
    const t = translations[lang] || translations.en;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key]) el.innerText = t[key];
    });
    document.documentElement.setAttribute("dir", (lang === 'ar' || lang === 'ur') ? 'rtl' : 'ltr');
}

function hideAllViews() {
    document.getElementById("login-view").classList.add("hidden");
    document.getElementById("profile-view").classList.add("hidden");
    document.getElementById("shift-view").classList.add("hidden");
    document.getElementById("dashboard-view").classList.add("hidden");
}

function isProfileComplete(profile) {
    return profile && profile.name && profile.name.trim() !== "" &&
           profile.phone && profile.phone.trim() !== "" &&
           profile.address && profile.address.trim() !== "";
}

function updateProfileUI() {
    if (!driverProfile) return;
    document.getElementById("driver-name-input").value = driverProfile.name || "";
    document.getElementById("driver-phone-input").value = driverProfile.phone || "";
    document.getElementById("driver-address-input").value = driverProfile.address || "";
    document.getElementById("shift-driver-summary").innerText = `Driver: ${driverProfile.name} (${driverProfile.phone})`;
    document.getElementById("driver-welcome-name").innerText = driverProfile.name;
    document.getElementById("driver-contact-subline").innerText = `Phone: ${driverProfile.phone} | Address: ${driverProfile.address}`;
}

document.addEventListener("DOMContentLoaded", async () => {
    if (currentDriverKey) {
        try {
            const res = await fetch(`${API_BASE}/driver/verify-key`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ driver_key: currentDriverKey })
            });
            if (!res.ok) {
                logoutDriver();
                return;
            }
            const data = await res.json();
            if (data.driver) {
                driverProfile = data.driver;
                localStorage.setItem("driver_profile", JSON.stringify(driverProfile));
            }
        } catch (err) {
            // Keep cached profile if temporarily offline
        }

        updateProfileUI();
        if (!isProfileComplete(driverProfile)) {
            showProfileView();
        } else if (activeShiftId) {
            showDashboard();
        } else {
            showShiftView();
        }
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const keyInput = document.getElementById("driver-key-input");
    const errEl = document.getElementById("login-error-msg");
    const btn = document.getElementById("login-submit-btn");
    const key = keyInput.value.trim();

    errEl.classList.add("hidden");
    btn.disabled = true;
    btn.innerText = "Verifying...";

    try {
        const res = await fetch(`${API_BASE}/driver/verify-key`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ driver_key: key })
        });
        const data = await res.json();

        if (res.ok && data.status === "verified") {
            currentDriverKey = key;
            localStorage.setItem("driver_key", key);
            driverProfile = data.driver || { name: "", phone: "", address: "" };
            localStorage.setItem("driver_profile", JSON.stringify(driverProfile));
            updateProfileUI();

            // Always show Profile Details step right after login so driver can enter/confirm Name, Phone & Address
            showProfileView();
        } else {
            errEl.innerText = data.detail || "Invalid Driver Secret Code. Access Denied.";
            errEl.classList.remove("hidden");
        }
    } catch (err) {
        errEl.innerText = "Unable to reach server to verify secret code. Check your internet connection.";
        errEl.classList.remove("hidden");
    } finally {
        btn.disabled = false;
        btn.innerText = "Verify & Access Portal";
    }
}

function showProfileView() {
    hideAllViews();
    updateProfileUI();
    document.getElementById("profile-view").classList.remove("hidden");
}

function openEditProfile() {
    showProfileView();
}

async function saveDriverProfile(e) {
    e.preventDefault();
    const name = document.getElementById("driver-name-input").value.trim();
    const phone = document.getElementById("driver-phone-input").value.trim();
    const address = document.getElementById("driver-address-input").value.trim();
    const btn = document.getElementById("save-profile-btn");

    btn.disabled = true;
    btn.innerText = "Saving...";

    try {
        const res = await fetch(`${API_BASE}/driver/profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-driver-key": currentDriverKey
            },
            body: JSON.stringify({ name, phone, address })
        });
        if (!res.ok) {
            const errData = await res.json();
            alert(errData.detail || "Failed to save driver profile.");
            return;
        }
        driverProfile = { name, phone, address };
        localStorage.setItem("driver_profile", JSON.stringify(driverProfile));
        updateProfileUI();

        if (activeShiftId) {
            showDashboard();
        } else {
            showShiftView();
        }
    } catch (err) {
        alert("Network error while saving profile. Please try again.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Save & Continue";
    }
}

function logoutDriver() {
    localStorage.removeItem("driver_key");
    localStorage.removeItem("driver_profile");
    localStorage.removeItem("shift_id");
    currentDriverKey = "";
    driverProfile = null;
    activeShiftId = null;
    location.reload();
}

function showShiftView() {
    hideAllViews();
    updateProfileUI();
    document.getElementById("shift-view").classList.remove("hidden");
}

function showDashboard() {
    hideAllViews();
    updateProfileUI();
    document.getElementById("dashboard-view").classList.remove("hidden");
    loadManifest();
}

async function startShift(e) {
    e.preventDefault();
    const plate = document.getElementById("vehicle-plate").value.trim();
    const odometer = parseInt(document.getElementById("odometer-start").value, 10) || 0;

    try {
        const res = await fetch(`${API_BASE}/driver/shifts/clock-in`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-driver-key": currentDriverKey
            },
            body: JSON.stringify({
                vehicle_plate: plate,
                odometer_start: odometer,
                checklist_json: { tires: true, brakes: true, fuel: true, cold_chain: true }
            })
        });
        const data = await res.json();
        activeShiftId = (data.shift && data.shift.id) ? data.shift.id : ("shift_" + Date.now());
    } catch (err) {
        activeShiftId = "shift_" + Date.now();
    }

    localStorage.setItem("shift_id", activeShiftId);
    document.getElementById("active-vehicle-info").innerText = `Vehicle: ${plate} | Shift Active`;
    showDashboard();
}

let manifestOrders = [];

function computeOrderOTP(orderId) {
    const str = String(orderId);
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
        seed += str.charCodeAt(i) * (i + 1);
    }
    return String(((seed * 7919) % 9000) + 1000);
}

function getDefaultOrders() {
    return [
        {
            id: "FMV-1001",
            order_number: "FMV-1001",
            user_email: "Hail Street, Ruwais District, Jeddah",
            items_summary: "2x Fresh Organic Milk (1L), 1x Paneer (500g)",
            quantity: 3,
            cod_amount: 45.00,
            status: "Out for Delivery",
            priority_flag: "Cold-Chain Express",
            delivery_otp: computeOrderOTP("FMV-1001"),
            payment_status: "pending"
        }
    ];
}

function renderManifest(orders) {
    const listContainer = document.getElementById("deliveries-list");
    let totalCod = 0;

    listContainer.innerHTML = orders.map(d => {
        const oid = String(d.id || d.order_number);
        const orderNum = d.order_number || oid;
        const cod = parseFloat(d.cod_amount || 0);
        const statusRaw = String(d.status || "Assigned");
        const isDelivered = statusRaw.toLowerCase() === "delivered";
        const uniqueOtp = d.delivery_otp || computeOrderOTP(oid);

        if (isDelivered || d.payment_status === "cod_collected") {
            totalCod += cod;
        }

        const statusBadge = isDelivered
            ? `<span class="px-2.5 py-1 bg-green-600 text-white text-xs rounded-full font-bold shadow-sm"><i class="fa-solid fa-circle-check mr-1"></i>Delivered</span>`
            : `<span class="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold"><i class="fa-solid fa-truck-fast mr-1"></i>${statusRaw}</span>`;

        const actionArea = isDelivered
            ? `<div class="pt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-800 font-semibold">
                   <span><i class="fa-solid fa-shield-check mr-1"></i>Verified with Photo & OTP (${d.verified_otp || uniqueOtp})</span>
                   <span>${d.delivered_time || 'Completed'}</span>
               </div>`
            : `<div class="flex space-x-2 pt-2">
                   <button onclick="openEPODModal('${oid}', ${cod}, '${uniqueOtp}')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold flex-1 shadow-sm">
                       <i class="fa-solid fa-camera mr-1"></i> Mark Delivered / ePOD
                   </button>
                   <a href="https://www.google.com/maps/dir/?api=1&destination=21.5433,39.1728" target="_blank" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center">
                       <i class="fa-solid fa-diamond-turn-right"></i>
                   </a>
               </div>`;

        return `
            <div id="order-card-${oid}" class="border ${isDelivered ? 'border-green-300 bg-green-50/30' : 'border-gray-200 bg-white'} rounded-xl p-4 shadow-sm space-y-2 transition">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <span class="font-bold text-blue-700 text-base">Order #${orderNum}</span>
                        <span class="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-medium">${d.priority_flag || 'Standard'}</span>
                    </div>
                    ${statusBadge}
                </div>
                <p class="text-sm text-gray-700"><i class="fa-solid fa-location-dot mr-1 text-red-500"></i> ${d.user_email || d.address || 'Customer Address'}</p>
                <p class="text-xs text-gray-500">${d.items_summary || ('Qty: ' + (d.quantity || 1))}</p>
                <div class="flex justify-between items-center pt-1">
                    <p class="text-sm font-bold text-gray-900">COD Due: SAR ${cod.toFixed(2)}</p>
                    <span class="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Order OTP Ref: #${uniqueOtp}</span>
                </div>
                ${actionArea}
            </div>
        `;
    }).join("");

    document.getElementById("total-cod-collected").innerText = `SAR ${totalCod.toFixed(2)}`;
}

async function loadManifest() {
    try {
        const res = await fetch(`${API_BASE}/driver/deliveries`, {
            headers: { "x-driver-key": currentDriverKey }
        });
        if (res.ok) {
            const deliveries = await res.json();
            if (Array.isArray(deliveries) && deliveries.length > 0) {
                // Merge any locally confirmed Delivered status so live UI never reverts if backend is restarting
                const cachedMap = {};
                if (Array.isArray(manifestOrders)) {
                    manifestOrders.forEach(item => { cachedMap[String(item.id)] = item; });
                }
                manifestOrders = deliveries.map(d => {
                    const oid = String(d.id);
                    if (cachedMap[oid] && String(cachedMap[oid].status).toLowerCase() === "delivered") {
                        return { ...d, ...cachedMap[oid], status: "Delivered" };
                    }
                    return d;
                });
                localStorage.setItem("driver_manifest_cache", JSON.stringify(manifestOrders));
                renderManifest(manifestOrders);
                return;
            }
        }
    } catch (err) {
        // Fallback to cached or default manifest
    }

    if (!Array.isArray(manifestOrders) || manifestOrders.length === 0) {
        manifestOrders = getDefaultOrders();
    }
    localStorage.setItem("driver_manifest_cache", JSON.stringify(manifestOrders));
    renderManifest(manifestOrders);
}

let targetOrderId = null;
let targetOrderCod = 0;
let targetOrderExpectedOtp = "";
let selectedPhotoBase64 = "";

function openEPODModal(orderId, cod, expectedOtp) {
    targetOrderId = String(orderId);
    targetOrderCod = cod;
    targetOrderExpectedOtp = String(expectedOtp || computeOrderOTP(orderId));
    selectedPhotoBase64 = "";

    document.getElementById("epod-photo-file").value = "";
    const previewImg = document.getElementById("epod-photo-preview");
    previewImg.src = "";
    previewImg.classList.add("hidden");

    document.getElementById("epod-otp").value = "";
    document.getElementById("epod-error-msg").classList.add("hidden");
    document.getElementById("epod-order-info").innerText = `Order: #${orderId} | COD to Collect: SAR ${parseFloat(cod).toFixed(2)}`;
    document.getElementById("epod-otp-hint").innerText = `Ask customer for their unique 4-digit PIN (Demo/Test OTP for #${orderId}: ${targetOrderExpectedOtp})`;
    document.getElementById("epod-modal").classList.remove("hidden");
}

function previewEPODPhoto(event) {
    const file = event.target.files && event.target.files[0];
    const previewImg = document.getElementById("epod-photo-preview");
    if (!file) {
        selectedPhotoBase64 = "";
        previewImg.classList.add("hidden");
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        selectedPhotoBase64 = e.target.result;
        previewImg.src = selectedPhotoBase64;
        previewImg.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
}

function closeEPODModal() {
    document.getElementById("epod-modal").classList.add("hidden");
}

async function submitEPOD(status) {
    const errEl = document.getElementById("epod-error-msg");
    const photoInput = document.getElementById("epod-photo-file");
    const otp = document.getElementById("epod-otp").value.trim();
    const confirmBtn = document.getElementById("confirm-delivery-btn");

    errEl.classList.add("hidden");

    // 1. Mandatory Doorstep Photo Proof validation
    if (!photoInput.files || photoInput.files.length === 0) {
        errEl.innerText = "Doorstep Photo Proof is mandatory. Please capture or select a photo before confirming delivery.";
        errEl.classList.remove("hidden");
        return;
    }

    // 2. Mandatory Unique Order OTP validation
    if (!otp) {
        errEl.innerText = "Customer Delivery OTP is mandatory. Please enter the unique 4-digit PIN for this order.";
        errEl.classList.remove("hidden");
        return;
    }

    if (otp !== targetOrderExpectedOtp) {
        errEl.innerText = `Incorrect OTP for Order #${targetOrderId}. Please check the unique 4-digit code with the customer.`;
        errEl.classList.remove("hidden");
        return;
    }

    confirmBtn.disabled = true;
    confirmBtn.innerText = "Verifying & Updating...";

    const photoPayload = selectedPhotoBase64 || `photo_${targetOrderId}_${Date.now()}.jpg`;

    try {
        const res = await fetch(`${API_BASE}/driver/deliveries/${targetOrderId}/epod`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-driver-key": currentDriverKey
            },
            body: JSON.stringify({
                status: "Delivered",
                epod_photo_url: photoPayload.slice(0, 500),
                delivery_otp: otp,
                cod_collected: targetOrderCod,
                payment_status: "cod_collected"
            })
        });
        if (!res.ok && res.status === 400) {
            const errData = await res.json();
            errEl.innerText = errData.detail || "Verification failed.";
            errEl.classList.remove("hidden");
            confirmBtn.disabled = false;
            confirmBtn.innerText = "Confirm Delivery";
            return;
        }
    } catch (err) {
        // Proceed with live local state update if temporarily offline
    }

    // Immediately update live manifest state to Delivered
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!Array.isArray(manifestOrders) || manifestOrders.length === 0) {
        manifestOrders = getDefaultOrders();
    }
    manifestOrders = manifestOrders.map(order => {
        if (String(order.id) === targetOrderId || String(order.order_number) === targetOrderId) {
            return {
                ...order,
                status: "Delivered",
                payment_status: "cod_collected",
                verified_otp: otp,
                delivered_time: nowTime
            };
        }
        return order;
    });
    localStorage.setItem("driver_manifest_cache", JSON.stringify(manifestOrders));

    confirmBtn.disabled = false;
    confirmBtn.innerText = "Confirm Delivery";
    closeEPODModal();
    renderManifest(manifestOrders);
}

function toggleBreak() {
    alert("Shift status toggled to Break.");
}

async function clockOut() {
    if (activeShiftId) {
        try {
            await fetch(`${API_BASE}/driver/shifts/${activeShiftId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-driver-key": currentDriverKey
                },
                body: JSON.stringify({ status: "completed" })
            });
        } catch (err) {}
    }
    localStorage.removeItem("shift_id");
    activeShiftId = null;
    showShiftView();
}

async function triggerSOS() {
    if (confirm("Send emergency SOS alert with live GPS coordinates to fleet managers?")) {
        try {
            await fetch(`${API_BASE}/driver/sos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-driver-key": currentDriverKey
                },
                body: JSON.stringify({ message: "Emergency SOS triggered from Driver Portal" })
            });
        } catch (err) {}
        alert("SOS Alert Dispatched Successfully!");
    }
}

async function openExpenseModal() {
    const amount = prompt("Enter expense amount in SAR (e.g. Fuel / Toll):");
    if (amount && !isNaN(parseFloat(amount))) {
        try {
            await fetch(`${API_BASE}/driver/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-driver-key": currentDriverKey
                },
                body: JSON.stringify({ category: "Fuel/Toll", amount: parseFloat(amount) })
            });
        } catch (err) {}
        alert(`Successfully logged expense of SAR ${amount} for reimbursement.`);
    }
}

// ============================================================================
// v8 ACTIVE DRIVER CONTROLLERS. Server confirms shifts, routes, ePOD and cash.
// Original translations, forms and feature source are retained above.
// ============================================================================
let fmvDriverShift=null,fmvDriverTab='work',fmvTimer=null;
function computeOrderOTP(){return '';}
function getDefaultOrders(){return [];}
function handleLogin(e){e?.preventDefault();FMV.showAuth('signin');}
function logoutDriver(){return FMV.logout();}
function showProfileView(){selectDriverTab('profile');}
function openEditProfile(){selectDriverTab('profile');}
function showShiftView(){selectDriverTab('work');}
function showDashboard(){selectDriverTab('work');refreshDriver();}
function selectDriverTab(tab){
  fmvDriverTab=tab;
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('profile-view').classList.toggle('hidden',tab!=='profile');
  document.getElementById('shift-view').classList.toggle('hidden',tab!=='work' || !!fmvDriverShift);
  document.getElementById('dashboard-view').classList.remove('hidden');
  for(const key of ['work','manifest','delivered','cash'])document.getElementById('fmv-driver-'+key)?.classList.toggle('hidden',key!==tab);
  for(const b of document.querySelectorAll('#fmv-driver-nav button'))b.setAttribute('aria-selected',String(b.dataset.tab===tab));
  if(tab==='profile')updateProfileUI();
}
async function saveDriverProfile(e){e?.preventDefault();return FMV.guard(async()=>{
  const result=await FMV.request('/driver/profile',{method:'POST',body:{name:FMV.val('driver-name-input'),phone:FMV.val('driver-phone-input'),address:FMV.val('driver-address-input')}});
  driverProfile=result.driver;updateProfileUI();FMV.notice('Driver profile saved.');selectDriverTab('work');
});}
async function refreshDriver(){if(!FMV.user || FMV.user.portal!=='driver')return;return FMV.guard(async()=>{
  const [profile,active,orders,cash,history]=await Promise.all([FMV.request('/driver/profile'),FMV.request('/driver/shifts/active'),FMV.request('/driver/deliveries'),FMV.request('/driver/reconciliation'),FMV.request('/driver/shifts')]);
  driverProfile=profile.driver;fmvDriverShift=active.shift;activeShiftId=active.shift?.id || null;manifestOrders=orders;
  updateProfileUI();renderManifest(orders);renderDriverShift();
  document.getElementById('total-cod-collected').textContent=FMV.money(cash.total_cod_collected);
  FMV.setHTML('fmv-cash-detail',`<div class="fmv-row"><span>Expenses</span><strong>${FMV.money(cash.total_expenses)}</strong></div><div class="fmv-row"><span>Cash to remit</span><strong>${FMV.money(cash.net_cash_to_remit)}</strong></div>`+cash.expenses.map(e=>`<div class="fmv-row"><span>${FMV.escape(e.category)}</span><strong>${FMV.money(e.amount)}</strong></div>`).join(''));
  FMV.setHTML('fmv-work-logs',history.shifts.slice().reverse().map(sh=>`<div class="fmv-panel"><strong>${FMV.escape(sh.vehicle_plate)} · ${FMV.escape(sh.status)}</strong><p class="fmv-small">${FMV.escape(sh.clock_in)}<br>Work ${(sh.work_seconds/3600).toFixed(2)} h · Break ${(sh.break_duration_seconds/60).toFixed(0)} min</p>${sh.events.map(event=>`<p class="fmv-small">${FMV.escape(event.status)} · ${FMV.escape(event.at)}</p>`).join('')}</div>`).join('') || FMV.empty('Clock in to start your first working log.'));
  selectDriverTab(fmvDriverTab);
});}
function renderDriverShift(){
  const sh=fmvDriverShift,btn=document.getElementById('break-btn');
  const vehicle=document.getElementById('active-vehicle-info');if(vehicle)vehicle.textContent=sh?'Vehicle: '+sh.vehicle_plate+' · '+(sh.status==='on_break'?'On break':'Shift active'):'No active shift';
  if(btn)btn.textContent=sh?.status==='on_break'?'Resume work':'Take break';
  document.getElementById('fmv-work-controls')?.classList.toggle('hidden',!sh);
  const status=document.getElementById('shift-status-badge');if(status)status.textContent=sh?'Shift active':'Off duty';
  clearInterval(fmvTimer);
  if(sh){sh.syncedAt=Date.now();fmvTimer=setInterval(updateWorkTimers,1000);}updateWorkTimers();
}
function timeText(seconds){const n=Math.max(0,Math.floor(seconds));return [Math.floor(n/3600),Math.floor(n/60)%60,n%60].map(n=>String(n).padStart(2,'0')).join(':');}
function updateWorkTimers(){const sh=fmvDriverShift,elapsed=sh?(Date.now()-sh.syncedAt)/1000:0;const work=(sh?.work_seconds || 0)+(sh?.status==='active'?elapsed:0),br=(sh?.break_duration_seconds || 0)+(sh?.status==='on_break'?elapsed:0);const w=document.getElementById('fmv-work-timer'),b=document.getElementById('fmv-break-timer');if(w)w.textContent=timeText(work);if(b)b.textContent=timeText(br);}
async function startShift(e){e.preventDefault();if(!document.getElementById('shift-form').reportValidity())return;return FMV.guard(async()=>{
  const checks=[...document.querySelectorAll('#shift-form input[type=checkbox]')];
  await FMV.request('/driver/shifts/clock-in',{method:'POST',body:{vehicle_plate:FMV.val('vehicle-plate'),odometer_start:Number(FMV.val('odometer-start')),checklist_json:{tires:checks[0]?.checked===true,brakes:checks[1]?.checked===true,fuel:checks[2]?.checked===true,cold_chain:checks[3]?.checked===true}}});
  FMV.notice('Shift started.');await refreshDriver();
});}
async function toggleBreak(){if(!fmvDriverShift)return;return FMV.guard(async()=>{await FMV.request('/driver/shifts/'+encodeURIComponent(fmvDriverShift.id),{method:'PATCH',body:{status:fmvDriverShift.status==='on_break'?'active':'on_break'}});refreshDriver();});}
async function clockOut(){if(!fmvDriverShift)return;const raw=prompt('Closing odometer (km):',String(fmvDriverShift.odometer_start));if(raw===null)return;return FMV.guard(async()=>{const reading=Number(raw);if(!Number.isInteger(reading))throw new Error('Enter a whole-number odometer reading.');await FMV.request('/driver/shifts/'+encodeURIComponent(fmvDriverShift.id),{method:'PATCH',body:{status:'completed',odometer_end:reading}});FMV.notice('Shift completed and attendance saved.');refreshDriver();});}
function driverOrderCard(o,delivered=false){
  const e=FMV.escape;return `<div class="fmv-panel"><div class="fmv-row"><strong>${e(o.order_number)}</strong><span>${e(o.status)}</span></div><p>${e(o.customer_name)}</p><p class="fmv-small">${e(o.delivery_address)}<br>${e(o.customer_phone)}<br>${e(o.items_summary)}<br>${e(o.delivery_date)} · ${e(o.payment_status)}</p><div class="fmv-row"><strong>COD due: ${FMV.money(o.cod_amount)}</strong><a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(o.delivery_address)}" target="_blank" rel="noopener noreferrer">Directions</a></div>${delivered?`<p class="fmv-small">Completed ${e(o.delivered_time)} · COD collected ${FMV.money(o.cod_collected)}</p>`:`<div class="fmv-flex"><button class="fmv-btn" onclick="openEPODModal('${e(o.id)}',${Number(o.cod_amount)})">Photo & customer PIN</button><button class="fmv-btn secondary" onclick="updateRouteStatus('${e(o.id)}')">Update status</button></div>`}</div>`;
}
function renderManifest(orders){
  const pending=orders.filter(o=>!['Delivered','Cancelled','Failed'].includes(o.status)),complete=orders.filter(o=>['Delivered','Failed'].includes(o.status));
  FMV.setHTML('deliveries-list',pending.map(o=>driverOrderCard(o)).join('') || FMV.empty('No pending deliveries are assigned to you.'));
  FMV.setHTML('fmv-delivered-list',complete.map(o=>driverOrderCard(o,true)).join('') || FMV.empty('Completed and failed deliveries will appear here.'));
  const count=document.getElementById('fmv-manifest-count');if(count)count.textContent=pending.length;
}
function loadManifest(){return refreshDriver();}
function updateRouteStatus(id){return FMV.guard(async()=>{const status=prompt('New status: Picked Up, In Transit, Arrived or Failed','In Transit');if(!status)return;const failure_reason=status==='Failed'?prompt('Reason for failed delivery:') || '':'';await FMV.request('/driver/deliveries/'+encodeURIComponent(id)+'/epod',{method:'PATCH',body:{status,failure_reason}});refreshDriver();});}
function openEPODModal(id,cod){
  targetOrderId=id;targetOrderCod=Number(cod);selectedPhotoBase64='';
  document.getElementById('epod-photo-file').value='';document.getElementById('epod-otp').value='';document.getElementById('epod-photo-preview').classList.add('hidden');document.getElementById('epod-error-msg').classList.add('hidden');
  document.getElementById('epod-order-info').textContent='Order '+id+' · Collect '+FMV.money(cod);
  document.getElementById('epod-otp-hint').textContent='Ask the customer for the four-digit delivery PIN. This PIN is never shown to drivers.';
  document.getElementById('fmv-cod-collected').value=Number(cod)>0?'':'0';document.getElementById('fmv-cod-collected').disabled=Number(cod)===0;
  document.getElementById('epod-modal').classList.remove('hidden');
}
async function previewEPODPhoto(event){
  const file=event.target.files?.[0];selectedPhotoBase64='';if(!file)return;
  await FMV.guard(async()=>{
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024)throw new Error('Choose a JPEG, PNG or WebP image smaller than 10 MB.');
    const image=await createImageBitmap(file);const scale=Math.min(1,1400/Math.max(image.width,image.height));
    const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);image.close();
    selectedPhotoBase64=canvas.toDataURL('image/jpeg',.8);const img=document.getElementById('epod-photo-preview');img.src=selectedPhotoBase64;img.classList.remove('hidden');
  });
}
async function submitEPOD(){
  const err=document.getElementById('epod-error-msg'),btn=document.getElementById('confirm-delivery-btn');if(btn.disabled)return;
  err.classList.add('hidden');btn.disabled=true;
  try{
    if(!selectedPhotoBase64)throw new Error('Capture a doorstep proof photo before confirming.');
    const otp=FMV.val('epod-otp');if(!/^\d{4}$/.test(otp))throw new Error('Enter the four-digit customer delivery PIN.');
    const raw=FMV.val('fmv-cod-collected');if(raw==='')throw new Error('Enter the actual COD amount collected.');
    await FMV.request('/driver/deliveries/'+encodeURIComponent(targetOrderId)+'/epod',{method:'PATCH',body:{status:'Delivered',delivery_otp:otp,epod_photo_url:selectedPhotoBase64,cod_collected:Number(raw)}});
    closeEPODModal();selectedPhotoBase64='';FMV.notice('Delivery verified and saved.');await refreshDriver();
  }catch(e){err.textContent=e.message;err.classList.remove('hidden');}finally{btn.disabled=false;}
}
async function triggerSOS(){if(!FMV.user){FMV.showAuth();return;}if(!confirm('Record an SOS alert for fleet managers?'))return;return FMV.guard(async()=>{
  let coords={};try{const p=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{timeout:5000}));coords={gps_lat:p.coords.latitude,gps_lng:p.coords.longitude};}catch(e){}
  const result=await FMV.request('/driver/sos',{method:'POST',body:{message:'Emergency SOS from driver portal',...coords}});FMV.notice(result.message);
});}
async function openExpenseModal(){return FMV.guard(async()=>{
  const category=prompt('Expense category: Fuel, Toll, Parking or Other','Fuel');if(!category)return;
  const amount=prompt('Expense amount in INR:');if(amount===null)return;
  const result=await FMV.request('/driver/expenses',{method:'POST',body:{category,amount:Number(amount),receipt_url:null}});FMV.notice(result.message);refreshDriver();
});}
const fmvOriginalSwitchLanguage=switchLanguage;
switchLanguage=function(lang){fmvOriginalSwitchLanguage(lang);if(lang==='ml'){const title=document.querySelector('[data-i18n=manifest_title]');if(title)title.textContent='പ്രതിദിന ഡെലിവറി പട്ടിക';}document.documentElement.lang=lang;};
document.addEventListener('fmv:authenticated',()=>{selectDriverTab('work');refreshDriver();});
document.addEventListener('fmv:sync',refreshDriver);
document.addEventListener('fmv:locked',()=>clearInterval(fmvTimer));
document.addEventListener('DOMContentLoaded',()=>{
  const dashboard=document.getElementById('dashboard-view');const cards=[...dashboard.children];
  const work=document.createElement('div');work.id='fmv-driver-work';work.className='fmv-driver-pane';
  const controls=cards[0];controls.id='fmv-work-controls';work.append(controls);
  const timers=document.createElement('div');timers.className='fmv-panel';timers.innerHTML='<div class="fmv-row"><div><p class="fmv-small">ACTIVE WORK TIME</p><p id="fmv-work-timer" class="fmv-timer">00:00:00</p></div><div><p class="fmv-small">BREAK DURATION</p><p id="fmv-break-timer" class="fmv-timer">00:00:00</p></div></div><h3>Working & break logs</h3><div id="fmv-work-logs"></div>';work.append(timers);
  const manifest=document.createElement('div');manifest.id='fmv-driver-manifest';manifest.className='hidden fmv-driver-pane';manifest.append(cards[2]);
  const delivered=document.createElement('div');delivered.id='fmv-driver-delivered';delivered.className='hidden fmv-panel fmv-driver-pane';delivered.innerHTML='<h3>Delivered & failed orders</h3><div id="fmv-delivered-list"></div>';
  const cash=document.createElement('div');cash.id='fmv-driver-cash';cash.className='hidden fmv-driver-pane';cash.append(cards[1]);const summary=document.createElement('div');summary.id='fmv-cash-detail';summary.className='fmv-panel';cash.append(summary);
  dashboard.append(work,manifest,delivered,cash);
  const nav=document.createElement('nav');nav.id='fmv-driver-nav';nav.innerHTML=[['work','Working time'],['manifest','Manifest <span id="fmv-manifest-count">0</span>'],['delivered','Delivered'],['cash','Cash flow'],['profile','Profile']].map(([key,label])=>`<button data-tab="${key}" type="button" aria-selected="${key==='work'}">${label}</button>`).join('');document.body.append(nav);for(const b of nav.querySelectorAll('button'))b.addEventListener('click',()=>selectDriverTab(b.dataset.tab));
  const cod=document.createElement('label');cod.className='block text-sm font-semibold';cod.textContent='Actual COD collected (INR)';const input=document.createElement('input');input.id='fmv-cod-collected';input.type='number';input.min='0';input.step='.01';input.className='w-full px-3 py-2 border rounded-lg';cod.append(input);document.getElementById('epod-error-msg').before(cod);
  const ml=document.createElement('option');ml.value='ml';ml.textContent='മലയാളം';document.getElementById('lang-switcher').append(ml);
  const header=document.querySelector('body > nav');if(header)new ResizeObserver(()=>document.documentElement.style.setProperty('--fmv-header-height',header.getBoundingClientRect().height+'px')).observe(header);
  document.getElementById('epod-otp').maxLength=4;
});
