// ۱. ثبت سرویس ورکر به صورت خودکار
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Service failed', err));
    });
}

// ۲. تزریق استایل‌های پاپ‌آپ به تگ head صفحه
const style = document.createElement('style');
style.innerHTML = `
    #pwa-install-banner {
        position: fixed; bottom: 24px; left: 24px; right: 24px;
        background: #ffffff; color: #333333; z-index: 99999;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 16px;
        padding: 16px; direction: rtl; font-family: system-ui, -apple-system, sans-serif;
        display: none; align-items: center; justify-content: space-between;
        border: 1px solid #e0e0e0; max-width: 500px; margin: 0 auto;
    }
    .pwa-text { flex: 1; padding-left: 12px; }
    .pwa-title { font-weight: bold; font-size: 15px; color: #0056b3; margin-bottom: 4px; }
    .pwa-desc { font-size: 13px; color: #666; line-height: 1.4; }
    .pwa-buttons { display: flex; gap: 8px; align-items: center; }
    .pwa-btn-install { 
        background: #0056b3; color: white; border: none; 
        padding: 8px 16px; border-radius: 8px; cursor: pointer; 
        font-weight: bold; font-size: 13px; white-space: nowrap;
    }
    .pwa-btn-close { 
        background: none; color: #999; border: none; 
        padding: 8px; cursor: pointer; font-size: 18px; 
    }
    @media (max-width: 480px) {
        #pwa-install-banner { bottom: 12px; left: 12px; right: 12px; padding: 12px; }
    }
`;
document.head.appendChild(style);

// ۳. تزریق ساختار HTML پاپ‌آ‌پ به انتهای body
const bannerHTML = `
    <div id="pwa-install-banner">
        <div class="pwa-text">
            <div class="pwa-title" id="pwa-title-text">نصب وب‌اپلیکیشن</div>
            <div class="pwa-desc" id="pwa-desc-text">برای دسترسی سریع‌تر و آفلاین، این سامانه را نصب کنید.</div>
        </div>
        <div class="pwa-buttons">
            <button class="pwa-btn-install" id="pwa-btn-action">نصب</button>
            <button class="pwa-btn-close" id="pwa-btn-dismiss">✕</button>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', bannerHTML);

// ۴. منطق مدیریت نمایش و دکمه‌ها
const banner = document.getElementById('pwa-install-banner');
const actionBtn = document.getElementById('pwa-btn-action');
const dismissBtn = document.getElementById('pwa-btn-dismiss');
let deferredPrompt;

// بررسی اینکه آیا کاربر قبلاً پاپ‌آپ را رد کرده است یا خیر
const isDismissed = () => {
    const dismissTime = localStorage.getItem('pwa_banner_dismissed_time');
    if (!dismissTime) return false;
    // اگر کمتر از 7 روز گذشته باشد، نشان نده
    return (Date.now() - parseInt(dismissTime)) < (7 * 24 * 60 * 60 * 1000);
};

// تابع بستن پاپ‌آپ و ذخیره در LocalStorage
const dismissBanner = () => {
    banner.style.display = 'none';
    localStorage.setItem('pwa_banner_dismissed_time', Date.now().toString());
};

dismissBtn.addEventListener('click', dismissBanner);

// الف) سناریو اندروید و مرورگرهای کروم
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // اگر برنامه نصب نیست و قبلاً هم رد نشده، پاپ‌آپ را نشان بده
    if (!isDismissed()) {
        banner.style.display = 'flex';
    }
});

actionBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        banner.style.display = 'none';
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        deferredPrompt = null;
    }
});

// ب) سناریو iOS و مرورگر سافاری
const isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);

if (isIos && !isInStandaloneMode && !isDismissed()) {
    // تغییر متن پاپ‌آپ متناسب با راهنمای آیفون
    document.getElementById('pwa-title-text').innerText = "اضافه کردن به صفحه اصلی";
    document.getElementById('pwa-desc-text').innerText = "در مرورگر Safari روی دکمه Share (یا 📄) بزنید و Add to Home Screen را انتخاب کنید.";
    actionBtn.style.display = 'none'; // در آیفون دکمه نصب مستقیم کار نمی‌کند، پس مخفی می‌شود
    banner.style.display = 'flex';
}
