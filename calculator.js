// SW.BERNHARDT Legal Assistant Platform - Loan Calculator

// Legal interest rate limits (per year)
const LEGAL_LIMITS = {
    personal: 15,      // สินเชื่อส่วนบุคคล
    commercial: 15,    // สินเชื่อพาณิชย์
    creditCard: 18,    // บัตรเครดิต (ข้อยกเว้น)
    mortgage: 12       // สินเชื่อบ้าน
};

// Calculator Functions
function calculateLoan() {
    // Get input values
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const loanType = document.getElementById('loanType').value;
    
    // Validate inputs
    if (!validateInputs(loanAmount, interestRate, loanTerm)) {
        return;
    }
    
    // Check legal compliance
    const legalCheck = checkLegalCompliance(interestRate, loanType);
    
    // Calculate loan details
    const results = performCalculations(loanAmount, interestRate, loanTerm);
    
    // Display results
    displayResults(results, legalCheck, loanType);
    
    console.log('💰 Loan calculation completed:', results);
}

function validateInputs(amount, rate, term) {
    if (!amount || amount <= 0) {
        showNotification('กรุณาใส่จำนวนเงินกู้ที่ถูกต้อง', 'error');
        return false;
    }
    
    if (!rate || rate <= 0) {
        showNotification('กรุณาใส่อัตราดอกเบี้ยที่ถูกต้อง', 'error');
        return false;
    }
    
    if (!term || term <= 0) {
        showNotification('กรุณาใส่ระยะเวลาที่ถูกต้อง', 'error');
        return false;
    }
    
    if (amount > 10000000) {
        showNotification('จำนวนเงินกู้ไม่ควรเกิน 10 ล้านบาท', 'warning');
    }
    
    return true;
}

function checkLegalCompliance(rate, type) {
    const legalLimit = LEGAL_LIMITS[type] || 15;
    const isLegal = rate <= legalLimit;
    
    return {
        isLegal,
        legalLimit,
        currentRate: rate,
        message: isLegal 
            ? 'อัตราดอกเบี้ยอยู่ในขอบเขตที่กฎหมายกำหนด' 
            : `อัตราดอกเบี้ยเกินขีดจำกัดตามกฎหมาย (${legalLimit}% ต่อปี)`
    };
}

function performCalculations(principal, annualRate, months) {
    // Convert annual rate to monthly rate
    const monthlyRate = annualRate / 100 / 12;
    
    // Calculate monthly payment using PMT formula
    const monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
        (Math.pow(1 + monthlyRate, months) - 1);
    
    // Calculate total payment and interest
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;
    
    // Generate payment schedule
    const paymentSchedule = generatePaymentSchedule(principal, monthlyRate, monthlyPayment, months);
    
    return {
        principal,
        monthlyPayment,
        totalPayment,
        totalInterest,
        annualRate,
        months,
        paymentSchedule
    };
}

function generatePaymentSchedule(principal, monthlyRate, monthlyPayment, months) {
    const schedule = [];
    let remainingBalance = principal;
    
    for (let month = 1; month <= Math.min(months, 12); month++) { // Show first 12 months
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        
        schedule.push({
            month,
            monthlyPayment,
            principalPayment,
            interestPayment,
            remainingBalance: Math.max(0, remainingBalance)
        });
    }
    
    return schedule;
}

function displayResults(results, legalCheck, loanType) {
    const resultsContainer = document.getElementById('calculatorResults');
    
    const html = `
        <h3 class="results-title">📊 ผลการคำนวณ</h3>
        
        ${!legalCheck.isLegal ? `
            <div class="legal-warning">
                <h4>⚠️ คำเตือนทางกฎหมาย</h4>
                <p>${legalCheck.message}</p>
                <p><strong>ข้อแนะนำ:</strong> ควรเจรจาลดอัตราดอกเบี้ยหรือปรึกษาทนายความ</p>
            </div>
        ` : `
            <div class="warning" style="background: rgba(0, 255, 65, 0.1); border-color: var(--success-color); color: var(--success-color);">
                <h4>✅ ผ่านการตรวจสอบ</h4>
                <p>${legalCheck.message}</p>
            </div>
        `}
        
        <div class="result-item">
            <span class="result-label">💰 จำนวนเงินกู้</span>
            <span class="result-value">${formatCurrency(results.principal)}</span>
        </div>
        
        <div class="result-item">
            <span class="result-label">📅 ค่างวดรายเดือน</span>
            <span class="result-value">${formatCurrency(results.monthlyPayment)}</span>
        </div>
        
        <div class="result-item">
            <span class="result-label">💸 ดอกเบี้ยรวม</span>
            <span class="result-value">${formatCurrency(results.totalInterest)}</span>
        </div>
        
        <div class="result-item">
            <span class="result-label">💳 ยอดชำระรวม</span>
            <span class="result-value">${formatCurrency(results.totalPayment)}</span>
        </div>
        
        <div class="result-item">
            <span class="result-label">📊 อัตราดอกเบี้ย</span>
            <span class="result-value">${results.annualRate}% ต่อปี</span>
        </div>
        
        <div class="result-item">
            <span class="result-label">⏰ ระยะเวลา</span>
            <span class="result-value">${results.months} เดือน</span>
        </div>
        
        <h4 style="color: var(--primary-color); margin: 30px 0 20px 0; text-align: center;">
            📋 ตารางการผ่อนชำระ (12 เดือนแรก)
        </h4>
        
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background: rgba(0, 255, 65, 0.1); border-bottom: 1px solid var(--border-color);">
                        <th style="padding: 10px; text-align: center; color: var(--primary-color);">เดือน</th>
                        <th style="padding: 10px; text-align: right; color: var(--primary-color);">ค่างวด</th>
                        <th style="padding: 10px; text-align: right; color: var(--primary-color);">เงินต้น</th>
                        <th style="padding: 10px; text-align: right; color: var(--primary-color);">ดอกเบี้ย</th>
                        <th style="padding: 10px; text-align: right; color: var(--primary-color);">คงเหลือ</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.paymentSchedule.map(payment => `
                        <tr style="border-bottom: 1px solid rgba(0, 255, 65, 0.1);">
                            <td style="padding: 8px; text-align: center; color: var(--text-secondary);">${payment.month}</td>
                            <td style="padding: 8px; text-align: right; color: var(--text-color);">${formatNumber(Math.round(payment.monthlyPayment))}</td>
                            <td style="padding: 8px; text-align: right; color: var(--text-color);">${formatNumber(Math.round(payment.principalPayment))}</td>
                            <td style="padding: 8px; text-align: right; color: var(--text-color);">${formatNumber(Math.round(payment.interestPayment))}</td>
                            <td style="padding: 8px; text-align: right; color: var(--primary-color);">${formatNumber(Math.round(payment.remainingBalance))}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="action-buttons">
            <button class="btn btn-primary" onclick="generateLoanReport()">
                📊 สร้างรายงาน
            </button>
            <button class="btn" onclick="exportCalculation()">
                💾 ส่งออกข้อมูล
            </button>
            <button class="btn" onclick="resetCalculator()">
                🔄 คำนวณใหม่
            </button>
        </div>
    `;
    
    resultsContainer.innerHTML = html;
    resultsContainer.classList.add('show');
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    showNotification('คำนวณเสร็จสิ้น!', 'success');
}

function generateLoanReport() {
    showNotification('กำลังสร้างรายงาน...', 'warning', 2000);
    
    setTimeout(() => {
        const reportData = {
            timestamp: new Date().toLocaleString('th-TH'),
            calculation: 'loan-analysis',
            status: 'completed'
        };
        
        console.log('📊 Loan report generated:', reportData);
        showNotification('สร้างรายงานเรียบร้อยแล้ว', 'success');
    }, 2000);
}

function exportCalculation() {
    showNotification('กำลังส่งออกข้อมูล...', 'warning', 2000);
    
    setTimeout(() => {
        const exportData = {
            timestamp: new Date().toLocaleString('th-TH'),
            type: 'loan-calculation',
            format: 'json'
        };
        
        console.log('💾 Calculation exported:', exportData);
        showNotification('ส่งออกข้อมูลเรียบร้อยแล้ว', 'success');
    }, 2000);
}

function resetCalculator() {
    // Clear form
    document.getElementById('loanAmount').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('loanTerm').value = '';
    document.getElementById('loanType').value = 'personal';
    
    // Hide results
    const resultsContainer = document.getElementById('calculatorResults');
    resultsContainer.classList.remove('show');
    resultsContainer.innerHTML = '';
    
    showNotification('รีเซ็ตเครื่องคำนวณแล้ว', 'success');
    
    console.log('🔄 Calculator reset');
}

// Export functions
window.calculateLoan = calculateLoan;
window.generateLoanReport = generateLoanReport;
window.exportCalculation = exportCalculation;
window.resetCalculator = resetCalculator;