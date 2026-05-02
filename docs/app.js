const $ = (sel) => document.querySelector(sel);

// ===== DATA MANAGEMENT =====
const DB = {
  get income() { return JSON.parse(localStorage.getItem('runway-income') || '[]'); },
  get expenses() { return JSON.parse(localStorage.getItem('runway-expenses') || '[]'); },
  get savingsGoals() { return JSON.parse(localStorage.getItem('runway-goals') || '[]'); },
  get budgets() { return JSON.parse(localStorage.getItem('runway-budgets') || '[]'); },

  saveIncome(items) { localStorage.setItem('runway-income', JSON.stringify(items)); },
  saveExpenses(items) { localStorage.setItem('runway-expenses', JSON.stringify(items)); },
  saveSavingsGoals(items) { localStorage.setItem('runway-goals', JSON.stringify(items)); },
  saveBudgets(items) { localStorage.setItem('runway-budgets', JSON.stringify(items)); }
};

// ===== THEME MANAGEMENT =====
function changeTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('futureworth-theme', theme);
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.value = theme;
  }
}

const VALID_THEMES = ['indigo', 'mint', 'forest', 'slate'];

// Restore theme on load
window.addEventListener('load', () => {
  const saved = localStorage.getItem('futureworth-theme');
  changeTheme(VALID_THEMES.includes(saved) ? saved : 'indigo');
});

// ===== ROCKET LAUNCH =====
function launchRocket() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const target = document.querySelector('.header-left .rocket-launcher');
  if (!target) return;
  const r = target.getBoundingClientRect();

  const overlay = document.createElement('div');
  overlay.className = 'launch-overlay';
  overlay.style.left = (r.left + r.width / 2) + 'px';
  overlay.style.top = (r.top + r.height / 2) + 'px';
  overlay.innerHTML =
    '<svg width="40" height="40" viewBox="0 0 40 40" style="fill: white;">' +
      '<path d="M20 2C20 2 10 10 10 20C10 27.7 15 35 20 35C25 35 30 27.7 30 20C30 10 20 2 20 2Z" fill="white"/>' +
      '<circle cx="20" cy="20" r="6" fill="#3f51b5"/>' +
      '<path d="M12 28C12 28 8 32 5 35M28 28C28 28 32 32 35 35" stroke="white" stroke-width="2" fill="none"/>' +
    '</svg>' +
    '<div class="launch-flame"></div>';
  document.body.appendChild(overlay);

  setTimeout(() => overlay.remove(), 2000);
}

window.addEventListener('load', launchRocket);

// ===== CONFETTI =====
function celebrate() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#3f51b5', '#66bb6a', '#ef5350', '#26a69a', '#ec407a', '#ff9800', '#ffd54f', '#5c6bc0'];
  const count = 36;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[i % colors.length];
    piece.style.width = (5 + Math.random() * 7) + 'px';
    piece.style.height = (9 + Math.random() * 8) + 'px';
    piece.style.animationDuration = (1.4 + Math.random() * 1.2) + 's';
    piece.style.animationDelay = (Math.random() * 0.25) + 's';
    piece.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

// ===== HELP TOOLTIPS (tap-friendly) =====
function showHelpTip(icon) {
  document.querySelectorAll('.tooltip-popup').forEach(t => t.remove());
  const text = icon.getAttribute('data-tip') || icon.getAttribute('title');
  if (!text) return;
  const tip = document.createElement('div');
  tip.className = 'tooltip tooltip-popup';
  tip.textContent = text;
  document.body.appendChild(tip);
  const r = icon.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  let left = r.left + r.width / 2 - tipRect.width / 2;
  if (left < 8) left = 8;
  if (left + tipRect.width > window.innerWidth - 8) {
    left = window.innerWidth - tipRect.width - 8;
  }
  tip.style.left = left + 'px';
  tip.style.top = (r.bottom + 8) + 'px';
}

document.addEventListener('click', (e) => {
  const icon = e.target.closest('.help-icon');
  if (icon) {
    e.stopPropagation();
    showHelpTip(icon);
  } else {
    document.querySelectorAll('.tooltip-popup').forEach(t => t.remove());
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('help-icon')) {
    e.preventDefault();
    showHelpTip(e.target);
  } else if (e.key === 'Escape') {
    document.querySelectorAll('.tooltip-popup').forEach(t => t.remove());
  }
});

// ===== HELPERS =====
function money(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calculateMonthlyValue(amount, frequency) {
  switch (frequency) {
    case 'daily': return amount * 30.4375;
    case 'weekly': return amount * 4.333333;
    case 'bi-weekly': return amount * 2.166667;
    case 'monthly': return amount;
    case 'yearly': return amount / 12;
    case 'one-time': return 0;
    default: return 0;
  }
}

function getNextId(list) {
  if (!list.length) return 1;
  return Math.max(...list.map(item => item.income_id || item.expense_id || item.budget_id || 0)) + 1;
}

// ===== DASHBOARD =====
function loadDashboard() {
  const income = DB.income;
  const expenses = DB.expenses;
  const goals = DB.savingsGoals;

  let incomeTotal = 0;
  let expenseTotal = 0;

  income.forEach(item => {
    incomeTotal += calculateMonthlyValue(item.amount, item.frequency);
  });

  expenses.forEach(item => {
    expenseTotal += calculateMonthlyValue(item.amount, item.frequency);
  });

  const savingsTotal = incomeTotal - expenseTotal;
  const yearlyTotal = incomeTotal * 12;
  const annualExpenses = expenseTotal * 12;

  $('#incomeTotal').textContent = money(incomeTotal);
  $('#expenseTotal').textContent = money(expenseTotal);
  $('#savingsTotal').textContent = money(savingsTotal);
  $('#yearlyTotal').textContent = money(yearlyTotal);
  if ($('#annualExpenseTotal')) {
    $('#annualExpenseTotal').textContent = money(annualExpenses);
  }

  loadIncomeList();
  loadExpenseList();
  loadSavingsGoals();
  loadBudgets();
}

// ===== INCOME =====
$('#incomeForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const income = DB.income;
  income.push({
    income_id: getNextId(income),
    source_name: form.get('source_name'),
    amount: parseFloat(form.get('amount')),
    frequency: form.get('frequency'),
    created_at: new Date().toISOString()
  });
  DB.saveIncome(income);
  e.target.reset();
  loadDashboard();
  celebrate();
});

function loadIncomeList() {
  const income = DB.income;
  const list = $('#incomeList');
  list.innerHTML = '';

  if (income.length === 0) {
    list.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No income sources yet</p>';
    return;
  }

  income.forEach(item => {
    const monthlyVal = calculateMonthlyValue(item.amount, item.frequency);
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div>
        <strong>${item.source_name}</strong> - ${money(item.amount)} (${item.frequency})
        <p style="margin: 0.25rem 0 0 0; color: #999; font-size: 0.85rem;">Monthly equivalent: ${money(monthlyVal)}</p>
      </div>
      <div>
        <button class="btn" style="font-size: 0.75rem; padding: 0.4rem 0.8rem; margin-bottom: 0.5rem;" onclick="editIncome(${item.income_id})">Edit</button>
        <button class="btn" style="font-size: 0.75rem; padding: 0.4rem 0.8rem; background: #c84b4b; border-color: #c84b4b;" onclick="deleteIncome(${item.income_id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function editIncome(incomeId) {
  const income = DB.income.find(i => i.income_id === incomeId);
  if (!income) return;

  document.getElementById('editIncomeId').value = incomeId;
  document.getElementById('editIncomeSourceName').value = income.source_name;
  document.getElementById('editIncomeAmount').value = income.amount;
  document.getElementById('editIncomeFrequency').value = income.frequency;
  $('#editIncomeModal').style.display = 'block';
}

function closeEditIncomeModal() {
  $('#editIncomeModal').style.display = 'none';
}

$('#editIncomeForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const incomeId = parseInt(document.getElementById('editIncomeId').value);
  const income = DB.income;
  const item = income.find(i => i.income_id === incomeId);
  if (item) {
    item.source_name = document.getElementById('editIncomeSourceName').value;
    item.amount = parseFloat(document.getElementById('editIncomeAmount').value);
    item.frequency = document.getElementById('editIncomeFrequency').value;
    DB.saveIncome(income);
  }
  closeEditIncomeModal();
  loadDashboard();
});

function deleteIncome(incomeId) {
  if (confirm('Delete this income source?')) {
    const income = DB.income.filter(i => i.income_id !== incomeId);
    DB.saveIncome(income);
    loadDashboard();
  }
}

// ===== EXPENSES =====
$('#expenseForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const expenses = DB.expenses;
  expenses.push({
    expense_id: getNextId(expenses),
    category: form.get('category'),
    amount: parseFloat(form.get('amount')),
    frequency: form.get('frequency'),
    date: form.get('date'),
    created_at: new Date().toISOString()
  });
  DB.saveExpenses(expenses);
  e.target.reset();
  const today = new Date().toISOString().split('T')[0];
  document.querySelector('#expenseForm input[name="date"]').value = today;
  loadDashboard();
});

function loadExpenseList() {
  const expenses = DB.expenses.slice();
  const sortBy = document.getElementById('expenseSort')?.value || 'default';
  if (sortBy === 'amount-desc') {
    expenses.sort((a, b) =>
      calculateMonthlyValue(b.amount, b.frequency) - calculateMonthlyValue(a.amount, a.frequency));
  } else if (sortBy === 'amount-asc') {
    expenses.sort((a, b) =>
      calculateMonthlyValue(a.amount, a.frequency) - calculateMonthlyValue(b.amount, b.frequency));
  } else if (sortBy === 'category-asc') {
    expenses.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortBy === 'category-desc') {
    expenses.sort((a, b) => b.category.localeCompare(a.category));
  }

  const list = $('#expenseList');
  list.innerHTML = '';

  if (expenses.length === 0) {
    list.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No expenses yet</p>';
    return;
  }

  expenses.forEach(item => {
    const monthlyVal = calculateMonthlyValue(item.amount, item.frequency);
    const yearlyVal = monthlyVal * 12;
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div>
        <strong>${item.category}</strong> - ${money(item.amount)} (${item.frequency} • ${item.date})
        <p style="margin: 0.25rem 0 0 0; color: #999; font-size: 0.85rem;">Monthly equivalent: ${money(monthlyVal)}</p>
        <p style="margin: 0.15rem 0 0 0; color: #999; font-size: 0.85rem;">Yearly equivalent: ${money(yearlyVal)}</p>
      </div>
      <div>
        <button class="btn" style="font-size: 0.75rem; padding: 0.4rem 0.8rem; margin-bottom: 0.5rem;" onclick="editExpense(${item.expense_id})">Edit</button>
        <button class="btn" style="font-size: 0.75rem; padding: 0.4rem 0.8rem; background: #c84b4b; border-color: #c84b4b;" onclick="deleteExpense(${item.expense_id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function editExpense(expenseId) {
  const expense = DB.expenses.find(e => e.expense_id === expenseId);
  if (!expense) return;

  document.getElementById('editExpenseId').value = expenseId;
  document.getElementById('editExpenseCategory').value = expense.category;
  document.getElementById('editExpenseAmount').value = expense.amount;
  document.getElementById('editExpenseFrequency').value = expense.frequency;
  document.getElementById('editExpenseDate').value = expense.date;
  $('#editExpenseModal').style.display = 'block';
}

function closeEditExpenseModal() {
  $('#editExpenseModal').style.display = 'none';
}

$('#editExpenseForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const expenseId = parseInt(document.getElementById('editExpenseId').value);
  const expenses = DB.expenses;
  const item = expenses.find(e => e.expense_id === expenseId);
  if (item) {
    item.category = document.getElementById('editExpenseCategory').value;
    item.amount = parseFloat(document.getElementById('editExpenseAmount').value);
    item.frequency = document.getElementById('editExpenseFrequency').value;
    item.date = document.getElementById('editExpenseDate').value;
    DB.saveExpenses(expenses);
  }
  closeEditExpenseModal();
  loadDashboard();
});

function deleteExpense(expenseId) {
  if (confirm('Delete this expense?')) {
    const expenses = DB.expenses.filter(e => e.expense_id !== expenseId);
    DB.saveExpenses(expenses);
    loadDashboard();
    celebrate();
  }
}

// ===== FINANCIAL RUNWAY =====
function calculateRunway() {
  const savingsInput = document.getElementById('currentSavings');
  const savings = parseFloat(savingsInput.value) || 0;
  const expenseText = document.getElementById('expenseTotal').textContent;
  const monthlyExpenses = parseFloat(expenseText.replace('$', '').replace(/,/g, '')) || 0;
  const resultsDiv = document.getElementById('runwayResults');

  if (savings <= 0) {
    resultsDiv.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Enter your current savings to calculate your financial runway</p>';
    return;
  }

  if (monthlyExpenses <= 0) {
    resultsDiv.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Add some expenses first to calculate your runway</p>';
    return;
  }

  const months = Math.floor(savings / monthlyExpenses);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const weeks = Math.floor((savings % monthlyExpenses) / (monthlyExpenses / 4.33));

  let timeText = '';
  if (years > 0) {
    timeText = `${years} year${years > 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  } else if (months > 0) {
    timeText = `${months} month${months !== 1 ? 's' : ''} and ${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else {
    const days = Math.floor((savings / monthlyExpenses) * 30);
    timeText = `${days} day${days !== 1 ? 's' : ''}`;
  }

  resultsDiv.innerHTML = `
    <div class="cards">
      <article class="card highlight-card">
        <h3>Financial Runway</h3>
        <p style="font-size: 1.8rem;">${timeText}</p>
        <small style="color: #999;">How long you can live off your current savings</small>
      </article>
      <article class="card highlight-card">
        <h3>Monthly Burn Rate</h3>
        <p style="font-size: 1.8rem;">$${monthlyExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        <small style="color: #999;">Your current monthly expenses</small>
      </article>
      <article class="card">
        <h3>Savings Left</h3>
        <p style="font-size: 1.8rem;">$${savings.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        <small style="color: #999;">Your current savings balance</small>
      </article>
    </div>
  `;
}

// ===== SAVINGS GOALS =====
function toggleGainInput() {
  const checkbox = document.getElementById('hasGainCheckbox');
  const gainLabel = document.getElementById('gainLabel');
  gainLabel.style.display = checkbox.checked ? 'flex' : 'none';
}

$('#savingsGoalForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const goals = DB.savingsGoals;
  goals.push({
    id: Date.now(),
    name: form.get('goal_name'),
    amount: parseFloat(form.get('amount')) || 0,
    gain: form.get('hasGain') ? (parseFloat(form.get('gain')) || 0) : 0
  });
  DB.saveSavingsGoals(goals);
  e.target.reset();
  document.getElementById('hasGainCheckbox').checked = false;
  document.getElementById('gainLabel').style.display = 'none';
  loadDashboard();
});

function loadSavingsGoals() {
  const goals = DB.savingsGoals;
  const list = $('#savingsGoalsList');
  list.innerHTML = '';

  if (goals.length === 0) {
    list.innerHTML = '<p style="color: #999; text-align: center;">No savings goals yet</p>';
  } else {
    goals.forEach((goal) => {
      const yearlyBase = goal.amount * 12;
      const interest = yearlyBase * (goal.gain / 100);
      const yearlyTotal = yearlyBase + interest;

      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <div>
          <h4 style="margin: 0;">${goal.name}</h4>
          <p style="margin: 0.25rem 0 0 0; color: var(--xp-accent); font-weight: bold;">${money(goal.amount)}/month</p>
          <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.85rem;">
            Yearly: ${money(yearlyBase)}${goal.gain > 0 ? ` + ${money(interest)} interest (${goal.gain}%)` : ''} = ${money(yearlyTotal)}
          </p>
        </div>
        <div style="text-align: right;">
          <button class="btn" style="font-size: 0.75rem; padding: 0.4rem 0.8rem; margin-bottom: 0.5rem;" onclick="editSavingsGoal(${goal.id})">Edit</button>
          <button class="btn" style="font-size: 0.75rem; padding: 0.4rem 0.8rem; background: #c84b4b; border-color: #c84b4b;" onclick="deleteSavingsGoal(${goal.id})">Delete</button>
        </div>
      `;
      list.appendChild(div);
    });
  }

  updateSavingsGoalsSummary();
}

function updateSavingsGoalsSummary() {
  const goals = DB.savingsGoals;

  let totalMonthly = 0;
  let totalAnnual = 0;

  goals.forEach((goal) => {
    totalMonthly += goal.amount;
    const yearlyBase = goal.amount * 12;
    const gainAmount = yearlyBase * (goal.gain / 100);
    totalAnnual += yearlyBase + gainAmount;
  });

  $('#totalMonthlySavings') && ($('#totalMonthlySavings').textContent = money(totalMonthly));
  $('#totalAnnualSavings') && ($('#totalAnnualSavings').textContent = money(totalAnnual));

  if ($('#overviewMonthlySavings')) {
    $('#overviewMonthlySavings').textContent = money(totalMonthly);
    $('#overviewAnnualSavings').textContent = money(totalAnnual);
  }
}

function editSavingsGoal(goalId) {
  const goal = DB.savingsGoals.find(g => g.id === goalId);
  if (!goal) return;

  document.getElementById('editSavingsGoalId').value = goalId;
  document.getElementById('editSavingsGoalName').value = goal.name;
  document.getElementById('editSavingsGoalAmount').value = goal.amount;
  document.getElementById('editSavingsGoalHasGain').checked = goal.gain > 0;
  if (goal.gain > 0) {
    document.getElementById('editGainLabel').style.display = 'flex';
    document.getElementById('editSavingsGoalGain').value = goal.gain;
  }
  $('#editSavingsGoalModal').style.display = 'block';
}

function closeEditSavingsGoalModal() {
  $('#editSavingsGoalModal').style.display = 'none';
}

function toggleEditGainInput() {
  const checkbox = document.getElementById('editSavingsGoalHasGain');
  const gainLabel = document.getElementById('editGainLabel');
  gainLabel.style.display = checkbox.checked ? 'flex' : 'none';
}

$('#editSavingsGoalForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const goalId = parseInt(document.getElementById('editSavingsGoalId').value);
  const goals = DB.savingsGoals;
  const goal = goals.find(g => g.id === goalId);
  if (goal) {
    goal.name = document.getElementById('editSavingsGoalName').value;
    goal.amount = parseFloat(document.getElementById('editSavingsGoalAmount').value);
    goal.gain = document.getElementById('editSavingsGoalHasGain').checked ? parseFloat(document.getElementById('editSavingsGoalGain').value) || 0 : 0;
    DB.saveSavingsGoals(goals);
  }
  closeEditSavingsGoalModal();
  loadDashboard();
});

function deleteSavingsGoal(goalId) {
  if (confirm('Delete this savings goal?')) {
    const goals = DB.savingsGoals.filter(g => g.id !== goalId);
    DB.saveSavingsGoals(goals);
    loadDashboard();
  }
}

// ===== BUDGETS =====
function saveBudget() {
  const name = document.getElementById('budgetName').value;
  if (!name) {
    alert('Please enter a budget name');
    return;
  }

  const budgets = DB.budgets;
  budgets.push({
    budget_id: getNextId(budgets),
    budget_name: name,
    income: DB.income,
    expenses: DB.expenses,
    created_at: new Date().toISOString()
  });
  DB.saveBudgets(budgets);
  document.getElementById('budgetName').value = '';
  loadBudgets();
}

function loadBudgets() {
  const budgets = DB.budgets;
  const list = $('#budgetsList');
  list.innerHTML = '';

  if (budgets.length === 0) {
    list.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No budget snapshots yet</p>';
    return;
  }

  budgets.forEach(budget => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const date = new Date(budget.created_at).toLocaleDateString();
    div.innerHTML = `
      <div>
        <h4 style="margin: 0;">${budget.budget_name}</h4>
        <p style="margin: 0.25rem 0 0 0; color: #999; font-size: 0.85rem;">Saved on ${date}</p>
        <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.85rem;">
          ${budget.income.length} income items • ${budget.expenses.length} expense items
        </p>
      </div>
      <div>
        <button class="btn" style="font-size: 0.75rem; padding: 0.4rem 0.8rem; margin-bottom: 0.5rem;" onclick="loadBudgetForEditing(${budget.budget_id})">Load & Edit</button>
        <button class="btn" style="font-size: 0.75rem; padding: 0.4rem 0.8rem; background: #c84b4b; border-color: #c84b4b;" onclick="deleteBudget(${budget.budget_id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function loadBudgetForEditing(budgetId) {
  const budgets = DB.budgets;
  const budget = budgets.find(b => b.budget_id === budgetId);
  if (!budget) {
    alert('Budget not found');
    return;
  }

  DB.saveIncome(budget.income);
  DB.saveExpenses(budget.expenses);
  loadDashboard();
  alert('Budget loaded! You can now edit these items.');
}

function deleteBudget(budgetId) {
  if (confirm('Delete this budget snapshot?')) {
    const budgets = DB.budgets.filter(b => b.budget_id !== budgetId);
    DB.saveBudgets(budgets);
    loadBudgets();
  }
}

// ===== FILE IMPORT/EXPORT =====
function downloadData() {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    income: DB.income,
    expenses: DB.expenses,
    savingsGoals: DB.savingsGoals,
    budgets: DB.budgets
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `runway-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      if (data.income) DB.saveIncome(data.income);
      if (data.expenses) DB.saveExpenses(data.expenses);
      if (data.savingsGoals) DB.saveSavingsGoals(data.savingsGoals);
      if (data.budgets) DB.saveBudgets(data.budgets);

      loadDashboard();
      alert('Data loaded successfully!');
    } catch (err) {
      alert('Error loading file: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('Service Worker registered'))
    .catch(err => console.log('SW registration failed:', err));
}

// ===== GUIDED TOUR =====
const TOUR_STEPS = [
  {
    title: 'Welcome to Runway 🚀',
    body:
      '<p>This quick tour walks through everything in the app: adding income, expenses, and savings goals, saving and loading your data, calculating your runway, and switching themes.</p>' +
      '<p>You can hit <strong>Skip</strong> at any time or use <strong>Back</strong> to revisit a step. Use the arrow keys or Esc as well.</p>'
  },
  {
    title: 'Step 1 — Add your income',
    body:
      '<p>Start with every source of money coming in: salary, freelance, dividends, side hustle.</p>' +
      '<p>Pick the right <strong>frequency</strong> so we can compute the real monthly total — the app converts everything to a monthly equivalent for the dashboard.</p>',
    setup: () => switchTab('income-tab'),
    target: () => document.querySelector('#incomeForm')
  },
  {
    title: 'Step 2 — Add your expenses',
    body:
      '<p>List every expense: rent, groceries, subscriptions, bills, the lot. Each gets a category, amount, frequency, and date.</p>' +
      '<p><strong>The more in-depth, the more accurate your runway.</strong> Missing a recurring bill makes the runway look too optimistic.</p>' +
      '<p>Each entry shows its monthly and yearly equivalent below it, and the Sort dropdown helps you scan them by amount or category.</p>',
    setup: () => switchTab('expense-tab'),
    target: () => document.querySelector('#expenseForm')
  },
  {
    title: 'Step 3 — Add savings goals',
    body:
      '<p>Track what you\'re saving <em>toward</em> — emergency fund, vacation, down payment.</p>' +
      '<p>Tick <strong>Include annual gain %</strong> if the goal is parked somewhere that earns interest (high-yield account, index fund). The app applies that gain to the yearly total.</p>',
    setup: () => switchTab('savings-tab'),
    target: () => document.querySelector('#savingsGoalForm')
  },
  {
    title: 'Step 4 — Save a snapshot',
    body:
      '<p><strong>Snapshots</strong> save your current setup with a label so you can compare scenarios — "Current Plan", "If I Move", "After Raise".</p>' +
      '<p>They live <em>inside</em> the app, in your browser storage. Use them for quick what-if comparisons without losing your main numbers.</p>',
    setup: () => switchTab('budgets-tab'),
    target: () => document.querySelector('#budgets-tab')
  },
  {
    title: 'Step 5 — Save to a file',
    body:
      '<p>The <strong>Save</strong> button up top downloads everything — income, expenses, goals, snapshots — to a JSON file on your device.</p>' +
      '<p>Use this for a real backup. Browser storage can be cleared; a JSON file you keep is permanent.</p>',
    target: () => Array.from(document.querySelectorAll('.header-right .file-btn')).find(b => b.textContent.trim() === 'Save'),
    scrollToTop: true
  },
  {
    title: 'Step 6 — Load from a file',
    body:
      '<p>The <strong>Load</strong> button reads a JSON file you saved before and restores all your data.</p>' +
      '<p>Handy for moving between devices, restoring after clearing browser data, or sharing a setup with someone.</p>',
    target: () => Array.from(document.querySelectorAll('.header-right .file-btn')).find(b => b.textContent.trim() === 'Load'),
    scrollToTop: true
  },
  {
    title: 'Step 7 — Calculate your runway',
    body:
      '<p>This is the headline number. Type your <strong>current savings</strong> here and tap Calculate Runway.</p>' +
      '<p>Runway = how many months you can survive on those savings if income stopped, based on your monthly expenses. Bigger number = more breathing room.</p>',
    setup: () => { document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active')); switchTab('income-tab'); },
    target: () => document.querySelector('#runwaySection')
  },
  {
    title: 'Step 8 — Pick a theme',
    body:
      '<p>The <strong>Theme</strong> button cycles between four palettes: Indigo, Mint, Forest, and Slate. Pick whichever matches your mood.</p>' +
      '<p>Your choice is saved in your browser, so you\'ll see the same theme next time.</p>',
    target: () => document.querySelector('.theme-btn'),
    scrollToTop: true
  },
  {
    title: 'You\'re all set! 🎉',
    body:
      '<p>That\'s the whole tour. Quick recap:</p>' +
      '<ul style="margin: 0 0 14px 18px; padding: 0; font-size: 0.88rem; line-height: 1.6;">' +
        '<li>Add income, expenses, and savings goals in their tabs</li>' +
        '<li>Snapshots compare scenarios inside the app</li>' +
        '<li>Save / Load handle real file backups</li>' +
        '<li>Runway tells you how many months you can coast</li>' +
      '</ul>' +
      '<p>Tap <strong>Click here for a guided tour</strong> any time to run through this again.</p>'
  }
];

let tourIdx = 0;
let tourActive = false;

function startTour() {
  if (tourActive) return;
  tourActive = true;
  tourIdx = 0;
  document.addEventListener('keydown', tourKeyHandler);
  renderTour();
}

function endTour() {
  tourActive = false;
  removeTourSpotlight();
  document.getElementById('tourCard')?.remove();
  document.removeEventListener('keydown', tourKeyHandler);
}

function tourNext() {
  if (tourIdx < TOUR_STEPS.length - 1) {
    tourIdx++;
    renderTour();
  } else {
    endTour();
    celebrate();
  }
}

function tourPrev() {
  if (tourIdx > 0) {
    tourIdx--;
    renderTour();
  }
}

function tourKeyHandler(e) {
  if (!tourActive) return;
  if (e.key === 'Escape') { e.preventDefault(); endTour(); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); tourNext(); }
  else if (e.key === 'ArrowLeft')  { e.preventDefault(); tourPrev(); }
}

function removeTourSpotlight() {
  document.querySelectorAll('.tour-mask, .tour-ring').forEach(el => el.remove());
}

function placeTourSpotlight(rect) {
  removeTourSpotlight();
  const dim = 'rgba(10, 14, 30, 0.55)';
  const make = (styles) => {
    const d = document.createElement('div');
    d.className = 'tour-mask';
    Object.assign(d.style, {
      position: 'fixed', background: dim, zIndex: '9000', pointerEvents: 'auto'
    }, styles);
    return d;
  };

  if (!rect) {
    const full = make({ inset: '0' });
    document.body.appendChild(full);
    return;
  }

  const top    = make({ top: '0', left: '0', right: '0', height: rect.top + 'px' });
  const bottom = make({ top: rect.bottom + 'px', left: '0', right: '0', bottom: '0' });
  const left   = make({ top: rect.top + 'px', left: '0', width: rect.left + 'px', height: rect.height + 'px' });
  const right  = make({ top: rect.top + 'px', left: rect.right + 'px', right: '0', height: rect.height + 'px' });

  const ring = document.createElement('div');
  ring.className = 'tour-ring';
  Object.assign(ring.style, {
    position: 'fixed',
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
    pointerEvents: 'none',
    zIndex: '9001'
  });

  document.body.append(top, bottom, left, right, ring);
}

function renderTour() {
  removeTourSpotlight();
  document.getElementById('tourCard')?.remove();

  const step = TOUR_STEPS[tourIdx];
  if (step.setup) {
    try { step.setup(); } catch (e) { /* swallow */ }
  }
  if (step.scrollToTop) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  requestAnimationFrame(() => {
    setTimeout(() => {
      const target = step.target ? step.target() : null;
      const proceed = () => {
        if (target) {
          const r = target.getBoundingClientRect();
          const pad = 8;
          const rect = {
            top:    Math.max(0, r.top - pad),
            left:   Math.max(0, r.left - pad),
            right:  Math.min(window.innerWidth,  r.right + pad),
            bottom: Math.min(window.innerHeight, r.bottom + pad),
          };
          rect.width  = rect.right  - rect.left;
          rect.height = rect.bottom - rect.top;
          placeTourSpotlight(rect);
        } else {
          placeTourSpotlight(null);
        }
        renderTourCard(step);
      };
      if (target && !step.scrollToTop) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(proceed, 380);
      } else if (step.scrollToTop) {
        setTimeout(proceed, 380);
      } else {
        proceed();
      }
    }, 60);
  });
}

function renderTourCard(step) {
  const card = document.createElement('div');
  card.id = 'tourCard';
  card.className = 'tour-card';
  const isLast = tourIdx === TOUR_STEPS.length - 1;
  card.innerHTML =
    '<h3>' + step.title + '</h3>' +
    step.body +
    '<div class="tour-controls">' +
      '<span class="tour-step">' + (tourIdx + 1) + ' of ' + TOUR_STEPS.length + '</span>' +
      '<button type="button" onclick="endTour()">Skip</button>' +
      '<button type="button" onclick="tourPrev()" ' + (tourIdx === 0 ? 'disabled' : '') + '>Back</button>' +
      '<button type="button" onclick="tourNext()" class="tour-primary">' + (isLast ? 'Finish' : 'Next →') + '</button>' +
    '</div>';
  document.body.appendChild(card);
}

// Reposition spotlight on resize/scroll while tour is active
let tourRepositionTimer = null;
function tourReposition() {
  if (!tourActive) return;
  clearTimeout(tourRepositionTimer);
  tourRepositionTimer = setTimeout(() => {
    const step = TOUR_STEPS[tourIdx];
    const target = step.target ? step.target() : null;
    if (!target) return;
    const r = target.getBoundingClientRect();
    const pad = 8;
    const rect = {
      top:    Math.max(0, r.top - pad),
      left:   Math.max(0, r.left - pad),
      right:  Math.min(window.innerWidth,  r.right + pad),
      bottom: Math.min(window.innerHeight, r.bottom + pad),
    };
    rect.width  = rect.right  - rect.left;
    rect.height = rect.bottom - rect.top;
    placeTourSpotlight(rect);
  }, 120);
}
window.addEventListener('resize', tourReposition);
window.addEventListener('scroll', tourReposition, { passive: true });

// ===== INITIALIZE =====
window.addEventListener('load', () => {
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) input.value = today;
  });
  loadDashboard();
});
