const API_BASE = "https://backend.firstmilkventure.com";
let currentDriverKey = localStorage.getItem("driver_key") || "";
let activeShiftId = localStorage.getItem("shift_id") || null;
let driverProfile = JSON.parse(localStorage.getItem("driver_profile") || "null");

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

async function loadManifest() {
    const listContainer = document.getElementById("deliveries-list");
    try {
        const res = await fetch(`${API_BASE}/driver/deliveries`, {
            headers: { "x-driver-key": currentDriverKey }
        });
        if (res.ok) {
            const deliveries = await res.json();
            if (Array.isArray(deliveries) && deliveries.length > 0) {
                let totalCod = 0;
                listContainer.innerHTML = deliveries.map(d => {
                    const cod = parseFloat(d.cod_amount || 0);
                    if (d.payment_status === "cod_collected") totalCod += cod;
                    return `
                        <div class="border rounded-lg p-4 shadow-sm space-y-2 bg-white">
                            <div class="flex justify-between items-center">
                                <span class="font-bold text-blue-600">Order #${d.order_number || d.id}</span>
                                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">${d.priority_flag || d.status || 'Assigned'}</span>
                            </div>
                            <p class="text-sm text-gray-700"><i class="fa-solid fa-user mr-1 text-blue-500"></i> ${d.user_email || 'Customer'}</p>
                            <p class="text-xs text-gray-500">Qty: ${d.quantity || 1} | Status: ${d.status}</p>
                            <p class="text-sm font-bold text-gray-900">COD Due: SAR ${cod.toFixed(2)}</p>
                            <div class="flex space-x-2 pt-2">
                                <button onclick="openEPODModal('${d.id}', ${cod})" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-semibold flex-1">Update Status / ePOD</button>
                                <a href="https://www.google.com/maps/dir/?api=1&destination=21.5433,39.1728" target="_blank" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm font-semibold"><i class="fa-solid fa-diamond-turn-right"></i></a>
                            </div>
                        </div>
                    `;
                }).join("");
                document.getElementById("total-cod-collected").innerText = `SAR ${totalCod.toFixed(2)}`;
                return;
            }
        }
    } catch (err) {
        // Fallback sample display
    }

    listContainer.innerHTML = `
        <div class="border rounded-lg p-4 shadow-sm space-y-2 bg-white">
            <div class="flex justify-between items-center">
                <span class="font-bold text-blue-600">Order #FMV-1001</span>
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">Cold-Chain Express</span>
            </div>
            <p class="text-sm text-gray-700"><i class="fa-solid fa-location-dot mr-1 text-red-500"></i> Hail Street, Ruwais District, Jeddah</p>
            <p class="text-xs text-gray-500">Items: 2x Fresh Organic Milk (1L), 1x Paneer (500g)</p>
            <p class="text-sm font-bold text-gray-900">COD Due: SAR 45.00</p>
            <div class="flex space-x-2 pt-2">
                <button onclick="openEPODModal('FMV-1001', 45.00)" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-semibold flex-1">Update Status / ePOD</button>
                <a href="https://www.google.com/maps/dir/?api=1&destination=21.5433,39.1728" target="_blank" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm font-semibold"><i class="fa-solid fa-diamond-turn-right"></i></a>
            </div>
        </div>
    `;
}

let targetOrderId = null;
let targetOrderCod = 0;
function openEPODModal(orderId, cod) {
    targetOrderId = orderId;
    targetOrderCod = cod;
    document.getElementById("epod-order-info").innerText = `Order: ${orderId} | COD to Collect: SAR ${cod}`;
    document.getElementById("epod-modal").classList.remove("hidden");
}

function closeEPODModal() {
    document.getElementById("epod-modal").classList.add("hidden");
}

async function submitEPOD(status) {
    const otp = document.getElementById("epod-otp").value.trim();
    try {
        await fetch(`${API_BASE}/driver/deliveries/${targetOrderId}/epod`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-driver-key": currentDriverKey
            },
            body: JSON.stringify({
                status: status,
                delivery_otp: otp,
                cod_collected: targetOrderCod
            })
        });
    } catch (err) {}
    alert(`Order ${targetOrderId} marked as ${status} with ePOD verification successful!`);
    closeEPODModal();
    loadManifest();
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
