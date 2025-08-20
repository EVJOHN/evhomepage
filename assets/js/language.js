// 语言检测和自动跳转
(function() {
    'use strict';
    
    const supportedLanguages = {
        'zh': '/',
        'en': '/en/',
        'ja': '/ja/',
        'ko': '/ko/'
    };
    
    const defaultLanguage = 'zh';
    
    function detectUserLanguage() {
        // 检查localStorage中的用户偏好
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && supportedLanguages[savedLang]) {
            return savedLang;
        }
        
        // 检测浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.substring(0, 2).toLowerCase();
        
        // 返回支持的语言，否则返回默认语言
        return supportedLanguages[langCode] ? langCode : defaultLanguage;
    }
    
    function getCurrentLanguage() {
        const path = window.location.pathname;
        if (path.startsWith('/en/')) return 'en';
        if (path.startsWith('/ja/')) return 'ja';
        if (path.startsWith('/ko/')) return 'ko';
        return 'zh';
    }
    
    function shouldRedirect() {
        // 只在根目录进行语言检测和重定向
        const path = window.location.pathname;
        return path === '/' || path === '/index.html';
    }
    
    function redirectToLanguage(targetLang) {
        if (targetLang === 'zh') return;
        
        const targetPath = supportedLanguages[targetLang];
        if (targetPath && targetPath !== window.location.pathname) {
            // 显示语言切换提示
            showLanguageNotification(targetLang);
            
            // 延迟跳转以便用户看到提示
            setTimeout(() => {
                window.location.href = targetPath;
            }, 2000);
        }
    }
    
    function showLanguageNotification(lang) {
        const messages = {
            'en': 'Detected English as your preferred language. Redirecting...',
            'ja': 'お使いの言語として日本語を検出しました。リダイレクト中...',
            'ko': '한국어를 선호 언어로 감지했습니다. 리디렉션 중...'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 47, 167, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease-out;
        `;
        
        // 添加动画CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        notification.textContent = messages[lang];
        document.body.appendChild(notification);
        
        // 3秒后移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    function setupLanguageSwitcher() {
        // 为语言链接添加点击事件
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('lang-link')) {
                const href = e.target.getAttribute('href');
                if (href) {
                    let targetLang = 'zh';
                    if (href.includes('/en/')) targetLang = 'en';
                    else if (href.includes('/ja/')) targetLang = 'ja';
                    else if (href.includes('/ko/')) targetLang = 'ko';
                    
                    // 保存用户语言偏好
                    localStorage.setItem('preferred-language', targetLang);
                }
            }
        });
    }
    
    function init() {
        // 设置语言切换器
        setupLanguageSwitcher();
        
        // 只在首页进行语言检测
        if (shouldRedirect()) {
            const detectedLang = detectUserLanguage();
            const currentLang = getCurrentLanguage();
            
            // 如果检测到的语言与当前语言不同，则重定向
            if (detectedLang !== currentLang && detectedLang !== defaultLanguage) {
                redirectToLanguage(detectedLang);
            }
        }
    }
    
    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();