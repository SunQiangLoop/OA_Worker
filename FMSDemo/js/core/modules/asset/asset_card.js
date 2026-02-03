// js/modules/asset/asset_card.js

// 1. 打开新增弹窗
window.openAddAssetModal = function() {
    const modal = document.getElementById('assetModal');
    if (modal) {
        modal.style.display = 'block';
        // 清空表单
        document.getElementById('fa-name').value = '';
        document.getElementById('fa-val').value = '';
    } else {
        alert("页面加载异常，请刷新重试");
    }
}

// 2. 保存资产卡片
window.saveAssetCard = function() {
    const name = document.getElementById('fa-name').value;
    const type = document.getElementById('fa-type').value;
    const valStr = document.getElementById('fa-val').value;
    const dept = document.getElementById('fa-dept').value;
    
    if (!name || !valStr) return alert("请填写完整信息！");

    // 生成编码
    const code = "FA" + new Date().getFullYear() + Math.floor(Math.random()*10000);

    // 模拟图片读取 (真实环境需上传服务器，这里用假图演示)
    // 如果是车辆，随机给个卡车图；如果是电脑，给个电脑图
    let imgUrl = 'https://via.placeholder.com/100?text=Asset';
    if (type === '运输车辆') imgUrl = 'https://img.icons8.com/color/96/truck.png'; 
    if (type === '办公设备') imgUrl = 'img/computer.ico';
    if (type === '总部办公室装修工程') imgUrl = 'img/fixHouse.ico';

    const newAsset = {
        code: code,
        name: name,
        category: type,
        dept: dept,
        model: '标准型号',
        originalValue: parseFloat(valStr).toFixed(2),
        accumulatedDepr: '0.00',
        netValue: parseFloat(valStr).toFixed(2),
        status: '使用中',
        image: imgUrl // 保存图片链接
    };

    // 存入 Session
    let list = JSON.parse(sessionStorage.getItem('AssetCards') || "[]");
    list.unshift(newAsset);
    sessionStorage.setItem('AssetCards', JSON.stringify(list));

    // 关闭弹窗并刷新
    document.getElementById('assetModal').style.display = 'none';
    alert(`✅ 资产【${name}】已入库！\n资产编码：${code}`);
    loadContent('AssetCard');
}

// 3. 处置/报废
window.disposeAsset = function(btn, code) {
    if(!confirm("⚠️ 确认要处置/报废该资产吗？")) return;
    
    let list = JSON.parse(sessionStorage.getItem('AssetCards') || "[]");
    let item = list.find(a => a.code === code);
    if(item) {
        item.status = "已处置";
        sessionStorage.setItem('AssetCards', JSON.stringify(list));
        alert("✅ 资产已处置！");
        loadContent('AssetCard');
    }
}

// 4. 编辑 (简单模拟)
window.editAssetCard = function(code) {
    alert(`编辑功能：正在打开【${code}】的详细信息...`);
}