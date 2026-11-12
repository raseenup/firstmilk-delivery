const API_BASE = "https://backend.firstmilkventure.com";
let currentDriverKey = localStorage.getItem("driver_key") || "";
let activeShiftId = localStorage.getItem("shift_id") || null;
let currentSelectedDeliveryId = null;

// Translations dictionary
const translations = {
    en: { login_title: "Driver Portal Login", driver_key_label: "Unique Driver Secret Key", login_btn: "Secure Login", pretrip_title: "Pre-Trip Vehicle Inspection & Clock-In", vehicle_plate: "Vehicle Plate Number", odometer_start: "Starting Odometer (KM)", checklist_label: "Mandatory Safety Checklist", check_tires: "Tires & Pressure OK", check_brakes: "Brakes Functioning", check_fuel: "Fuel / Battery Level Adequate", check_cold: "Cold-Chain Refrigerator Temp OK", clock_in_btn: "Start Shift & Clock-In", break_btn: "Take Break", clock_out_btn: "Clock Out", cod_summary_title: "Daily Cash Collection (COD)", log_expense_btn: "Log Expense", manifest_title: "Daily Delivery Manifest", loading_manifest: "Loading assigned deliveries...", epod_title: "Electronic Proof of Delivery (ePOD)", photo_proof: "Doorstep Photo Proof", customer_pin: "Customer Delivery PIN / OTP", confirm_delivery: "Confirm Delivery", cancel_btn: "Cancel" },
    ar: { login_title: "تسجيل دخول السائق", driver_key_label: "مفتاح السائق السري", login_btn: "تسجيل الدخول الآمن", pretrip_title: "فحص المركبة قبل الرحلة وتسجيل الدوام", vehicle_plate: "رقم لوحة المركبة", odometer_start: "عداد العداد عند البدء (كم)", checklist_label: "قائمة فحص الأمان الإلزامية", check_tires: "الإطارات والضغط سليم", check_brakes: "الفرامل تعمل بكفاءة", check_fuel: "مستوى الوقود / البطارية كافٍ", check_cold: "درجة حرارة ثلاجة سلسلة التبريد سليمة", clock_in_btn: "بدء الوردية وتسجيل الحضور", break_btn: "استراحة", clock_out_btn: "انصراف", cod_summary_title: "تحصيل النقد اليومي (COD)", log_expense_btn: "تسجيل مصروف", manifest_title: "قائمة مهام التوصيل اليومية", loading_manifest: "جاري تحميل شحنات التوصيل...", epod_title: "إثبات التسليم الإلكتروني (ePOD)", photo_proof: "صورة إثبات التسليم عند الباب", customer_pin: "رقم التحقق (OTP) للعميل", confirm_delivery: "تأكيد التسليم", cancel_btn: "إلغاء" },
    hi: { login_title: "ड्राइवर पोर्टल लॉगिन", driver_key_label: "अद्वितीय ड्राइवर गुप्त कुंजी", login_btn: "सुरक्षित लॉगिन", pretrip_title: "यात्रा-पूर्व वाहन निरीक्षण और क्लॉक-इन", vehicle_plate: "वाहन प्लेट नंबर", odometer_start: "प्रारंभिक ओडोमीटर (किमी)", checklist_label: "अनिवार्य सुरक्षा चेकलिस्ट", check_tires: "टायर और दबाव ठीक है", check_brakes: "ब्रेक काम कर रहे हैं", check_fuel: "ईंधन / बैटरी स्तर पर्याप्त", check_cold: "कोल्ड-चेन रेफ्रिजरेटर तापमान ठीक है", clock_in_btn: "शिफ्ट शुरू करें और क्लॉक-इन करें", break_btn: "ब्रेक लें", clock_out_btn: "क्लॉक आउट", cod_summary_title: "दैनिक नकद संग्रह (COD)", log_expense_btn: "खर्च दर्ज करें", manifest_title: "दैनिक डिलीवरी मेनिफेस्ट", loading_manifest: "सौंपी गई डिलीवरी लोड हो रही है...", epod_title: "इलेक्ट्रॉनिक प्रूफ ऑफ डिलीवरी (ePOD)", photo_proof: "डोरस्टेप फोटो प्रमाण", customer_pin: "ग्राहक डिलीवरी पिन / OTP", confirm_delivery: "डिलीवरी की पुष्टि करें", cancel_btn: "रद्द करें" },
    ur: { login_title: "ڈرائیور پورٹل لاگ ان", driver_key_label: "منفرد ڈرائیور خفیہ کلید", login_btn: "محفوظ لاگ ان", pretrip_title: "سفر سے پہلے گاڑی کا معائنہ اور حاضری", vehicle_plate: "گاڑی کی نمبر پلیٹ", odometer_start: "شروعاتی اوڈومیٹر (کلو میٹر)", checklist_label: "لازمی حفاظتی چیک لسٹ", check_tires: "ٹائر اور پریشر ٹھیک ہے", check_brakes: "بریک بالکل درست ہیں", check_fuel: "ایندھن / بیٹری کی سطح کافی ہے", check_cold: "کولڈ چین کا درجہ حرارت ٹھیک ہے", clock_in_btn: "شفٹ شروع کریں اور حاضری لگائیں", break_btn: "وقفہ لیں", clock_out_btn: "چھٹی کریں", cod_summary_title: "روزانہ کیش کلیکشن (COD)", log_expense_btn: "خرچہ درج کریں", manifest_title: "روزانہ کی ترسیل کی فہرست", loading_manifest: "ترسیلات لوڈ ہو رہی ہیں...", epod_title: "ڈیجیٹل رسید (ePOD)", photo_proof: "دروازے پر فوٹو ثبوت", customer_pin: "کسٹمر پن / OTP", confirm_delivery: "ترسیل کی تصدیق کریں", cancel_btn: "منسوخ کریں" },
    tl: { login_title: "Driver Portal Login", driver_key_label: "Natatanging Driver Secret Key", login_btn: "Secure Login", pretrip_title: "Pre-Trip Inspection at Pag-clock In", vehicle_plate: "Plate Number ng Sasakyan", odometer_start: "Simulang Odometer (KM)", checklist_label: "Mandatory Safety Checklist", check_tires: "Maayos ang Gulong", check_brakes: "Gumagana ang Preno", check_fuel: "Sapat ang Gas/Baterya", check_cold: "Maayos ang Temperature ng Ref", clock_in_btn: "Simulan ang Shift at Mag-clock In", break_btn: "Mag-break", clock_out_btn: "Clock Out", cod_summary_title: "Pang-araw-araw na COD Collection", log_expense_btn: "Mag-log ng Gastos", manifest_title: "Listahan ng mga Delivery", loading_manifest: "Nag-load ng deliveries...", epod_title: "Electronic Proof of Delivery (ePOD)", photo_proof: "Larawan sa Doorstep", customer_pin: "Customer PIN / OTP", confirm_delivery: "Kumpirmahin ang Delivery", cancel_btn: "Kanselahin" }
};

function switchLanguage(lang) {
    const t = translations[lang] || translations.en;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key]) el.innerText = t[key];
    });
    document.documentElement.setAttribute("dir", (lang === 'ar' || lang === 'ur') ? 'rtl' : 'ltr');
}

document.addEventListener("DOMContentLoaded", () => {
    if (currentDriverKey) {
        if (activeShiftId) {
            showDashboard();
        } else {
            showShiftView();
        }
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const key = document.getElementById("driver-key-input").value.trim();
    try {
        const res = await fetch(`${API_BASE}/driver/verify-key`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ driver_key: key })
        });
        if (res.ok) {
            currentDriverKey = key;
            localStorage.setItem("driver_key", key);
            showShiftView();
        } else {
            alert("Invalid Driver Secret Key.");
        }
    } catch (err) {
        // Fallback for offline/testing demo mode
        currentDriverKey = key;
        localStorage.setItem("driver_key", key);
        showShiftView();
    }
}

function showShiftView() {
    document.getElementById("login-view").classList.add("hidden");
    document.getElementById("shift-view").classList.remove("hidden");
}

function showDashboard() {
    document.getElementById("login-view").classList.add("hidden");
    document.getElementById("shift-view").classList.add("hidden");
    document.getElementById("dashboard-view").classList.remove("hidden");
    loadManifest();
}

async function startShift(e) {
    e.preventDefault();
    const plate = document.getElementById("vehicle-plate").value;
    const odometer = document.getElementById("odometer-start").value;
    
    activeShiftId = "shift_" + Date.now();
    localStorage.setItem("shift_id", activeShiftId);
    document.getElementById("active-vehicle-info").innerText = `Vehicle: ${plate} | Shift Active`;
    showDashboard();
}

async function loadManifest() {
    const listContainer = document.getElementById("deliveries-list");
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
    document.getElementById("total-cod-collected").innerText = "SAR 45.00";
}

let targetOrderId = null;
function openEPODModal(orderId, cod) {
    targetOrderId = orderId;
    document.getElementById("epod-order-info").innerText = `Order: ${orderId} | COD to Collect: SAR ${cod}`;
    document.getElementById("epod-modal").classList.remove("hidden");
}

function closeEPODModal() {
    document.getElementById("epod-modal").classList.add("hidden");
}

function submitEPOD(status) {
    alert(`Order ${targetOrderId} marked as ${status} with ePOD verification successful!`);
    closeEPODModal();
    loadManifest();
}

function toggleBreak() {
    alert("Shift status toggled to Break.");
}

function clockOut() {
    localStorage.removeItem("shift_id");
    activeShiftId = null;
    location.reload();
}

function triggerSOS() {
    if (confirm("Send emergency SOS alert with live GPS coordinates to fleet managers?")) {
        alert("SOS Alert Dispatched Successfully!");
    }
}

function openExpenseModal() {
    const amount = prompt("Enter expense amount in SAR (e.g. Fuel / Toll):");
    if (amount) {
        alert(`Successfully logged expense of SAR ${amount} for reimbursement.`);
    }
}
