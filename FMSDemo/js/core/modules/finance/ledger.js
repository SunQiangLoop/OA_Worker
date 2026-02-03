        // ==========================================================
        // 账簿跳转逻辑
        // ==========================================================
        window.openSubjectDetail = function (code, name) {
            // 1. 把要查的科目存起来
            sessionStorage.setItem('CurrentSubjectCode', code);
            sessionStorage.setItem('CurrentSubjectName', name);

            // 2. 跳转到明细账页面
            loadContent('AcctSubjectDetail');
        }