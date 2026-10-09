const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let users = [
    { email: 'badrikaed2024@gmail.com', pass: 'admin123', role: 'admin', active: true }
];

app.get('/manifest.json', (req, res) => {
    res.json({
        "name": "L'INCANDESCENCE Solar",
        "short_name": "L'INCANDESCENCE",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#d97706",
        "icons": [
            {
                "src": "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    });
});

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="manifest" href="/manifest.json">
        <title>L'INCANDESCENCE - تسجيل الدخول</title>
        <style>
            body { font-family: Tahoma, sans-serif; background: #f4f7f6; padding: 20px; }
            .box { max-width: 450px; margin: auto; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            h2 { color: #d97706; text-align: center; }
            label { display: block; margin-top: 10px; font-weight: bold; }
            input { width: 100%; padding: 10px; margin-top: 5px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px; }
            button { background: #d97706; color: white; border: none; padding: 12px; width: 100%; margin-top: 15px; font-size: 16px; cursor: pointer; border-radius: 5px; }
            .link { text-align: center; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="box">
            <h2>L'INCANDESCENCE</h2>
            <p style="text-align:center; color:#555;">نظام إدارة وتقارير الطاقة الشمسية</p>
            <form action="/login" method="POST">
                <label>البريد الإلكتروني:</label>
                <input type="email" name="email" required placeholder="name@example.com">
                <label>كلمة المرور:</label>
                <input type="password" name="password" required placeholder="******">
                <button type="submit">تسجيل الدخول</button>
            </form>
            <div class="link">
                <a href="/register-page" style="color:#2563eb; text-decoration:none;">تسجيل حساب جديد فوراً</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.get('/register-page', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="manifest" href="/manifest.json">
        <title>تسجيل حساب جديد</title>
        <style>
            body { font-family: Tahoma, sans-serif; background: #f4f7f6; padding: 20px; }
            .box { max-width: 450px; margin: auto; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            h2 { color: #d97706; text-align: center; }
            label { display: block; margin-top: 10px; font-weight: bold; }
            input { width: 100%; padding: 10px; margin-top: 5px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px; }
            button { background: #2563eb; color: white; border: none; padding: 12px; width: 100%; margin-top: 15px; font-size: 16px; cursor: pointer; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="box">
            <h2>إنشاء حساب مهندس جديد</h2>
            <form action="/register" method="POST">
                <label>البريد الإلكتروني:</label>
                <input type="email" name="email" required>
                <label>كلمة المرور:</label>
                <input type="password" name="password" required>
                <button type="submit">تسجيل والبدء فوراً</button>
            </form>
            <p style="text-align:center; margin-top:15px;"><a href="/">← رجوع لتسجيل الدخول</a></p>
        </div>
    </body>
    </html>
    `);
});

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const exists = users.find(u => u.email === email);
    if (!exists) {
        users.push({ email, pass: password, role: 'engineer', active: true });
    }
    res.redirect('/');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.pass === password);
    
    if (!user) {
        return res.send("<h3 style='color:red; text-align:center; margin-top:20vh;'>خطأ في البريد أو كلمة المرور!<br><a href='/'>إعادة المحاولة</a></h3>");
    }
    if (!user.active) {
        return res.send("<h3 style='color:red; text-align:center; margin-top:20vh;'>عذراً، تم إيقاف حسابك من قبل إدارة المؤسسة.<br><a href='/'>رجوع</a></h3>");
    }

    if (user.role === 'admin') {
        let userListHtml = users.map(u => `<tr><td>${u.email}</td><td>${u.role}</td><td>${u.active ? 'مفعل' : 'معطل'}</td><td>${u.role !== 'admin' ? `<a href="/toggle?email=${u.email}" style="color:${u.active ? 'red' : 'green'}; font-weight:bold;">${u.active ? 'إيقاف الاستخدام' : 'تفعيل'}</a>` : 'مدير النظام'}</td></tr>`).join('');
        return res.send(`
            <html lang="ar" dir="rtl"><body style="font-family:Tahoma; padding:20px;">
            <h2>لوحة تحكم المدير (Admin Dashboard - L'INCANDESCENCE)</h2>
            <p>مرحباً بالمهندس: بدري قائد علي عبد الله</p>
            <hr>
            <h3>قائمة المهندسين والمستخدمين المسجلين:</h3>
            <table border="1" cellpadding="8" style="border-collapse:collapse; width:100%;">
                <tr><th>البريد الإلكتروني</th><th>الدور</th><th>الحالة</th><th>تحكم المدير</th></tr>
                ${userListHtml}
            </table>
            <br><hr>
            <h3>الذهاب لنظام حاسبة المنظومات والتقارير:</h3>
            <a href="/app" style="background:#d97706; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">فتح الحاسبة الهندسية</a>
            </body></html>
        `);
    } else {
        res.redirect('/app');
    }
});

app.get('/toggle', (req, res) => {
    const targetEmail = req.query.email;
    const targetUser = users.find(u => u.email === targetEmail);
    if (targetUser && targetUser.role !== 'admin') {
        targetUser.active = !targetUser.active;
    }
    res.send(`<script>window.history.back();</script>`);
});

app.get('/app', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl" id="htmlRoot">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="manifest" href="/manifest.json">
        <title id="pageTitle">L'INCANDESCENCE - الحاسبة الهندسية الذكية</title>
        <style>
            body { font-family: Tahoma, sans-serif; background: #f4f7f6; padding: 20px; }
            .box { max-width: 600px; margin: auto; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            h2 { color: #d97706; text-align: center; }
            label { display: block; margin-top: 12px; font-weight: bold; }
            input, select { width: 100%; padding: 10px; margin-top: 5px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px; }
            button { background: #d97706; color: white; border: none; padding: 12px; width: 100%; margin-top: 20px; font-size: 16px; cursor: pointer; border-radius: 5px; }
        </style>
        <script>
            function changeLang() {
                const lang = document.getElementById('uiLang').value;
                const root = document.getElementById('htmlRoot');
                root.setAttribute('lang', lang);
                root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
            }
        </script>
    </head>
    <body>
        <div class="box">
            <h2>L'INCANDESCENCE - الحاسبة الذكية</h2>
            <form action="/report" method="POST">
                <label>اختر لغة واجهة التطبيق / Langue de l'interface:</label>
                <select id="uiLang" name="uiLang" onchange="changeLang()">
                    <option value="ar">العربية (Arabic)</option>
                    <option value="fr">الفرنسية (Français)</option>
                </select>

                <label>اسم العميل / المشروع (Client / Project):</label>
                <input type="text" name="client" required placeholder="مثال: مجمع الأحلام">

                <label>إجمالي الأحمال (كيلوواط - kW):</label>
                <input type="number" step="0.1" name="power" required placeholder="مثال: 5">

                <label>عدد ساعات التشغيل ليلاً فقط (Heures de nuit):</label>
                <input type="number" name="hours" value="10" required placeholder="مثال: 10">

                <label>لغة إصدار وطباعة التقرير (Langue du rapport PDF):</label>
                <select name="reportLang">
                    <option value="ar">العربية (Arabic)</option>
                    <option value="fr">الفرنسية (Français)</option>
                    <option value="en">الإنجليزية (English)</option>
                </select>

                <button type="submit">إصدار التقرير الفني الذكي والشامل (Générer le Rapport)</button>
            </form>
            <br>
            <a href="/" style="color:#555; text-decoration:none;">← تسجيل الخروج / Déconnexion</a>
        </div>
    </body>
    </html>
    `);
});

app.post('/report', (req, res) => {
    const { client, power, hours, reportLang } = req.body;
    const p = parseFloat(power) || 5;
    const h = parseFloat(hours) || 10;

    const inverterKW = Math.ceil(p * 1.3 * 10) / 10;
    const nightEnergy = p * h;
    const battery = (nightEnergy / (0.8 * 0.95)).toFixed(2);
    const solarKW = ((nightEnergy / 0.75) / 5.0) + (p * 0.5); 
    const panels = Math.ceil((solarKW * 1000) / 640);
    const strCount = Math.max(1, Math.ceil(panels / 12));
    const rails = Math.ceil((panels * 2.3) / 6);
    const midClamps = Math.max(0, panels - 2);
    const endClamps = 4 * Math.ceil(panels / 2);

    const acCurrent = ((inverterKW * 1000) / 220);
    const acBreaker = Math.ceil(acCurrent * 1.25 / 10) * 10;
    const dcBreakerPerString = Math.ceil((panels * 9 / strCount) * 1.25 / 10) * 10;
    
    const dcCableSize = dcBreakerPerString <= 32 ? "6 mm² (PV Solar Cable)" : "10 mm² (PV Solar Cable)";
    const acCableSize = acCurrent <= 40 ? "10 mm² (AC Copper Cable)" : "16 mm² (AC Copper Cable)";
    const estimatedMeters = panels * 4;
    const totalDcCost = (estimatedMeters * 1.5).toFixed(2);

    const lang = reportLang || 'ar';
    const isAr = lang === 'ar';
    const isFr = lang === 'fr';

    const t = {
        title: isAr ? 'تقرير دراسة منظومة الطاقة الشمسية (تصميم ذكي تلقائي)' : isFr ? 'Rapport d\'Étude du Système Solaire (Auto)' : 'Solar Energy System Study Report (Auto)',
        client: isAr ? 'العميل / المشروع:' : isFr ? 'Client / Projet:' : 'Client / Project:',
        date: isAr ? 'التاريخ:' : isFr ? 'Date:' : 'Date:',
        param: isAr ? 'المكون / العنصر الهندسي' : isFr ? 'Composant / Élément' : 'Component / Element',
        spec: isAr ? 'المواصفات الفنية المحسوبة تلقائياً' : isFr ? 'Spécification / Câblage' : 'Specification / Cabling',
        load: isAr ? 'قدرة الأحمال المتصلة' : isFr ? 'Puissance connectée' : 'Connected Load',
        inverter: isAr ? 'قدرة الانفرتر الهجين المقترحة' : isFr ? 'Onduleur Recommandé' : 'Recommended Inverter',
        batt: isAr ? 'بنك البطاريات المطلوب (ليثيوم)' : isFr ? 'Parc Batteries (Lithium)' : 'Battery Bank (Lithium)',
        panels: isAr ? 'الألواح الشمسية المطلوبة (640 واط)' : isFr ? 'Panneaux Solaires (640W)' : 'Solar Panels (640W)',
        dcCable: isAr ? 'سلك وقايس كابلات الـ DC لكل مجموعة' : isFr ? 'Section Câble DC par String' : 'DC Cable Section per String',
        dcCost: isAr ? 'أمتار وتكلفة كابلات الـ DC التقديرية' : isFr ? 'Longueur & Coût Total Câbles DC' : 'DC Cable Length & Total Cost',
        dcBrk: isAr ? 'قواطع الحماية للـ DC (String Breakers)' : isFr ? 'Disjoncteurs DC par String' : 'DC Breakers per String',
        acBrk: isAr ? 'قاطع الخروج العمومي AC والكيبل المناسب' : isFr ? 'Disjoncteur AC Général & Câble' : 'General AC Breaker & Cable',
        rails: isAr ? 'التيبرات المجلفنة وهياكل التثبيت (Tip-carrière)' : isFr ? 'Rails et Fixations (Tip-carrière)' : 'Rails & Mounting Structures (Tip-carrière)',
        engineer: isAr ? 'إعداد المدير والمهندس: بدري قائد علي عبد الله' : isFr ? 'Ingénieur Directeur : Badri Qaid Ali Abdullah' : 'Lead Engineer & Director: Badri Qaid Ali Abdullah',
        company: isAr ? "L'INCANDESCENCE - جمهورية جيبوتي" : isFr ? "L'INCANDESCENCE - République de Djibouti" : "L'INCANDESCENCE - Republic of Djibouti",
        printBtn: isAr ? 'طباعة التقرير / حفظ كـ PDF قابل للمشاركة' : isFr ? 'Imprimer / Enregistrer en PDF Partageable' : 'Print / Save as Shareable PDF',
        back: isAr ? '← العودة للحاسبة' : isFr ? '← Retour' : '← Back'
    };

    res.send(`
    <!DOCTYPE html>
    <html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Report - L'INCANDESCENCE</title>
        <style>
            body { font-family: Tahoma, sans-serif; padding: 20px; color: #000; }
            h1 { color: #d97706; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: inherit; }
            th { background: #eee; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; border-top: 1px dashed #999; padding-top: 10px; }
            .btn { background: #2563eb; color: white; padding: 12px 20px; border: none; cursor: pointer; margin-top: 20px; border-radius: 5px; font-size: 16px; width: 100%; }
            @media print { .no-print { display: none; } }
        </style>
    </head>
    <body>
        <h1>L'INCANDESCENCE</h1>
        <p style="text-align:center; font-weight:bold;">${t.title}</p>
        <p><strong>${t.client}</strong> ${client}</p>
        <p><strong>${t.date}</strong> ${new Date().toLocaleDateString()}</p>

        <table>
            <tr><th>${t.param}</th><th>${t.spec}</th></tr>
            <tr><td>${t.load}</td><td>${p} kW (مع ساعات تشغيل ليلية: ${h} ساعات)</td></tr>
            <tr><td>${t.inverter}</td><td><b>${inverterKW} kW (Hybrid Inverter)</b></td></tr>
            <tr><td>${t.batt}</td><td><b>${battery} kWh (Lithium Storage)</b></td></tr>
            <tr><td>${t.panels}</td><td><b>${panels} وحدة (${strCount} مصفوفات/Strings)</b></td></tr>
            <tr><td>${t.dcCable}</td><td><strong>${dcCableSize}</strong></td></tr>
            <tr><td>${t.dcCost}</td><td><b>حوالي ${estimatedMeters} متر بتكلفة تقديرية</b></td></tr>
            <tr><td>${t.dcBrk}</td><td><strong>${dcBreakerPerString} A</strong></td></tr>
            <tr><td>${t.acBrk}</td><td><strong>${acBreaker} A (${acCableSize})</strong></td></tr>
            <tr><td>${t.rails}</td><td>${rails} Rails (6m) | ${midClamps} Mid Clamps | ${endClamps} End Clamps</td></tr>
        </table>

        <div class="footer">
            <p><b>${t.engineer}</b></p>
            <p>${t.company} © 2026</p>
        </div>

        <div class="no-print" style="text-align:center;">
            <button class="btn" onclick="window.print()">${t.printBtn}</button>
            <br><br>
            <a href="/app" style="color:#2563eb; text-decoration:none; font-weight:bold;">${t.back}</a>
        </div>
    </body>
    </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
