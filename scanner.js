// SW.BERNHARDT Legal Assistant Platform - Contract Scanner

// Global variables for scanner
let selectedFile = null;
let analysisResults = null;

// File handling functions
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!validateFile(file)) {
        return;
    }
    
    selectedFile = file;
    displayFilePreview(file);
    
    console.log('📁 File selected:', file.name);
}

function validateFile(file) {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('ประเภทไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ PDF, รูปภาพ, DOCX หรือ TXT', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)', 'error');
        return false;
    }
    
    return true;
}

function displayFilePreview(file) {
    const previewSection = document.getElementById('filePreview');
    const previewContent = document.getElementById('previewContent');
    
    const fileInfo = `
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="font-size: 2rem;">📄</div>
            <div>
                <div style="color: var(--primary-color); font-weight: bold;">${file.name}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">
                    ขนาด: ${formatFileSize(file.size)} | ประเภท: ${getFileTypeDisplay(file.type)}
                </div>
            </div>
        </div>
        <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px; color: var(--text-secondary);">
            <div style="margin-bottom: 10px;">📋 <strong>ข้อมูลไฟล์:</strong></div>
            <div>• ชื่อไฟล์: ${file.name}</div>
            <div>• ขนาด: ${formatFileSize(file.size)}</div>
            <div>• ประเภท: ${getFileTypeDisplay(file.type)}</div>
            <div>• วันที่แก้ไขล่าสุด: ${new Date(file.lastModified).toLocaleString('th-TH')}</div>
        </div>
    `;
    
    previewContent.innerHTML = fileInfo;
    previewSection.classList.add('show');
    
    // Scroll to preview
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileTypeDisplay(mimeType) {
    const types = {
        'application/pdf': 'PDF Document',
        'image/jpeg': 'JPEG Image',
        'image/jpg': 'JPG Image',
        'image/png': 'PNG Image',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
        'text/plain': 'Text File'
    };
    return types[mimeType] || 'Unknown';
}

// Analysis functions
function analyzeContract() {
    if (!selectedFile) {
        showNotification('กรุณาเลือกไฟล์ก่อน', 'error');
        return;
    }
    
    // Show analysis section
    const analysisSection = document.getElementById('analysisSection');
    analysisSection.classList.add('show');
    
    // Start analysis process
    startAnalysisProcess();
    
    console.log('🔍 Starting contract analysis for:', selectedFile.name);
}

function startAnalysisProcess() {
    const steps = [
        'กำลังอ่านไฟล์...',
        'กำลังแยกข้อความ...',
        'กำลังวิเคราะห์เนื้อหา...',
        'กำลังตรวจสอบข้อกฎหมาย...',
        'กำลังสร้างรายงาน...',
        'เสร็จสิ้น!'
    ];
    
    const scanningSteps = document.getElementById('scanningSteps');
    const progressFill = document.getElementById('progressFill');
    const scanningText = document.getElementById('scanningText');
    
    // Create step elements
    scanningSteps.innerHTML = steps.map((step, index) => 
        `<div id="step-${index}">${step}</div>`
    ).join('');
    
    let currentStep = 0;
    
    const processStep = () => {
        if (currentStep > 0) {
            document.getElementById(`step-${currentStep - 1}`).classList.remove('active');
        }
        
        if (currentStep < steps.length) {
            document.getElementById(`step-${currentStep}`).classList.add('active');
            scanningText.textContent = steps[currentStep];
            progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
            
            currentStep++;
            setTimeout(processStep, 1500);
        } else {
            // Analysis complete
            setTimeout(() => {
                completeAnalysis();
            }, 1000);
        }
    };
    
    processStep();
}

function completeAnalysis() {
    // Hide analysis section
    const analysisSection = document.getElementById('analysisSection');
    analysisSection.classList.remove('show');
    
    // Generate mock analysis results
    analysisResults = generateMockAnalysis();
    
    // Show results
    displayAnalysisResults(analysisResults);
    
    showNotification('วิเคราะห์สัญญาเสร็จสิ้น!', 'success');
    
    console.log('✅ Contract analysis completed:', analysisResults);
}

function generateMockAnalysis() {
    const contractTypes = ['สัญญาเช่า', 'สัญญาซื้อขาย', 'สัญญาจ้างงาน', 'สัญญาสินเชื่อ'];
    const randomType = contractTypes[Math.floor(Math.random() * contractTypes.length)];
    
    return {
        contractType: randomType,
        summary: {
            parties: ['บริษัท ABC จำกัด', 'นาย สมชาย ใจดี'],
            amount: Math.floor(Math.random() * 1000000) + 100000,
            duration: Math.floor(Math.random() * 24) + 6,
            interestRate: (Math.random() * 10 + 5).toFixed(2),
            startDate: '1 มกราคม 2567',
            endDate: '31 ธันวาคม 2568'
        },
        legalIssues: [
            {
                type: 'warning',
                title: 'อัตราดอกเบี้ยสูง',
                description: 'อัตราดอกเบี้ยในสัญญาอาจเกินขีดจำกัดตามกฎหมาย (15% ต่อปี)',
                severity: 'medium',
                recommendation: 'ควรเจรจาลดอัตราดอกเบี้ยหรือปรึกษาทนายความ'
            },
            {
                type: 'info',
                title: 'ข้อสัญญาปกติ',
                description: 'ข้อสัญญาส่วนใหญ่เป็นไปตามมาตรฐาน',
                severity: 'low',
                recommendation: 'ควรอ่านรายละเอียดให้ครบถ้วน'
            },
            {
                type: 'error',
                title: 'ข้อสัญญาไม่ชัดเจน',
                description: 'พบข้อสัญญาที่อาจก่อให้เกิดความเข้าใจผิด',
                severity: 'high',
                recommendation: 'ควรขอให้แก้ไขข้อสัญญาให้ชัดเจนก่อนลงนาม'
            }
        ],
        riskScore: Math.floor(Math.random() * 40) + 30, // 30-70%
        confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
    };
}

function displayAnalysisResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    const contractSummary = document.getElementById('contractSummary');
    const legalIssues = document.getElementById('legalIssues');
    
    // Display contract summary
    contractSummary.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">📋 ประเภทสัญญา</span>
            <span class="summary-value">${results.contractType}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">👥 คู่สัญญา</span>
            <span class="summary-value">${results.summary.parties.join(' และ ')}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">💰 จำนวนเงิน</span>
            <span class="summary-value">${formatCurrency(results.summary.amount)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">📅 ระยะเวลา</span>
            <span class="summary-value">${results.summary.duration} เดือน</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">📊 อัตราดอกเบี้ย</span>
            <span class="summary-value">${results.summary.interestRate}% ต่อปี</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">⚠️ ระดับความเสี่ยง</span>
            <span class="summary-value" style="color: ${getRiskColor(results.riskScore)}">${results.riskScore}%</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">🎯 ความแม่นยำ</span>
            <span class="summary-value">${results.confidence}%</span>
        </div>
    `;
    
    // Display legal issues
    legalIssues.innerHTML = results.legalIssues.map(issue => `
        <div class="legal-issue" style="
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid ${getIssueColor(issue.type)};
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
        ">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 1.5rem;">${getIssueIcon(issue.type)}</span>
                <h5 style="color: ${getIssueColor(issue.type)}; margin: 0;">${issue.title}</h5>
                <span class="severity-badge" style="
                    background: ${getSeverityColor(issue.severity)};
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    margin-left: auto;
                ">${getSeverityText(issue.severity)}</span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 10px;">${issue.description}</p>
            <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 4px;">
                <strong style="color: var(--primary-color);">💡 คำแนะนำ:</strong>
                <span style="color: var(--text-secondary);">${issue.recommendation}</span>
            </div>
        </div>
    `).join('');
    
    resultsContainer.classList.add('show');
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getRiskColor(score) {
    if (score < 30) return 'var(--success-color)';
    if (score < 60) return 'var(--warning-color)';
    return 'var(--error-color)';
}

function getIssueColor(type) {
    const colors = {
        'error': 'var(--error-color)',
        'warning': 'var(--warning-color)',
        'info': 'var(--primary-color)'
    };
    return colors[type] || 'var(--text-secondary)';
}

function getIssueIcon(type) {
    const icons = {
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || '📝';
}

function getSeverityColor(severity) {
    const colors = {
        'high': '#ff4444',
        'medium': '#ffa500',
        'low': '#00ff41'
    };
    return colors[severity] || '#666';
}

function getSeverityText(severity) {
    const texts = {
        'high': 'สูง',
        'medium': 'ปานกลาง',
        'low': 'ต่ำ'
    };
    return texts[severity] || 'ไม่ระบุ';
}

// Action functions
function generateReport() {
    if (!analysisResults) {
        showNotification('ไม่พบผลการวิเคราะห์', 'error');
        return;
    }
    
    showNotification('กำลังสร้างรายงาน...', 'warning', 2000);
    
    setTimeout(() => {
        const reportData = {
            timestamp: new Date().toLocaleString('th-TH'),
            fileName: selectedFile?.name || 'unknown',
            analysis: analysisResults,
            reportType: 'contract-analysis'
        };
        
        console.log('📊 Contract analysis report generated:', reportData);
        showNotification('สร้างรายงานเรียบร้อยแล้ว', 'success');
    }, 2000);
}

function exportAnalysis() {
    if (!analysisResults) {
        showNotification('ไม่พบผลการวิเคราะห์', 'error');
        return;
    }
    
    showNotification('กำลังส่งออกข้อมูล...', 'warning', 2000);
    
    setTimeout(() => {
        const exportData = {
            timestamp: new Date().toLocaleString('th-TH'),
            fileName: selectedFile?.name || 'unknown',
            results: analysisResults,
            exportFormat: 'json'
        };
        
        console.log('💾 Analysis exported:', exportData);
        showNotification('ส่งออกข้อมูลเรียบร้อยแล้ว', 'success');
    }, 2000);
}

function resetScanner() {
    // Reset all variables
    selectedFile = null;
    analysisResults = null;
    
    // Reset file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
    
    // Hide all sections
    document.getElementById('filePreview').classList.remove('show');
    document.getElementById('analysisSection').classList.remove('show');
    document.getElementById('resultsContainer').classList.remove('show');
    
    // Clear content
    document.getElementById('previewContent').innerHTML = '';
    document.getElementById('contractSummary').innerHTML = '';
    document.getElementById('legalIssues').innerHTML = '';
    document.getElementById('scanningSteps').innerHTML = '';
    document.getElementById('progressFill').style.width = '0%';
    
    showNotification('รีเซ็ตเครื่องสแกนแล้ว', 'success');
    
    console.log('🔄 Scanner reset');
}

// Export functions
window.handleFileSelect = handleFileSelect;
window.analyzeContract = analyzeContract;
window.generateReport = generateReport;
window.exportAnalysis = exportAnalysis;
window.resetScanner = resetScanner;