/* Definitions and practical context; external sources remain optional. */
(() => {
  const entries = [
    ['Accounts Receivable','Money customers owe for goods or services already billed.','My work includes tracking leasing and lending receivables, recording collections, and reviewing outstanding balances.'],
    ['Billing','Preparing invoices and statements that record amounts due from customers.','I prepare approximately 900 sales invoices monthly and built an Excel/VBA generator to streamline the process.'],
    ['Bookkeeping','Recording and organizing the financial transactions of a business.','My experience includes encoding transactions in books of accounts and maintaining supporting records.'],
    ['Financial Reporting','Organizing financial information into statements and reports for review and decisions.','I have prepared monthly financial statements and receivables reports.'],
    ['Bank Reconciliation','Comparing accounting records with bank statements and explaining differences.','My accounting experience includes preparing bank reconciliations alongside monthly financial statements.'],
    ['Payroll','Calculating and recording employee pay and related deductions.','During my internship, I supported payroll for 120+ employees, including timekeeping checks and net-pay calculations.'],
    ['Tax & Compliance','Maintaining records and completing applicable filing and regulatory requirements.','My experience includes supporting BIR filings, municipal permits, and compliance-focused recordkeeping.'],
    ['Feasibility Studies','Assessing whether a proposed business or project is practical and financially viable.','I prepare financial projections and discuss assumptions and findings with clients.'],
    ['Financial Analysis','Examining financial information to understand performance and support decisions.','I apply financial analysis to feasibility studies, projections, and reporting.'],
    ['Receivables Aging','Grouping outstanding balances by how long they have remained unpaid relative to their due dates.','I use aging reports to identify overdue balances and collection priorities.'],
    ['Collection Monitoring','Tracking customer payments, outstanding balances, and follow-up activity.','My AR work connects collection records with customer balances and summary reports.'],
    ['Financial Presentation','Explaining financial results and assumptions in a clear format for an audience.','I use dashboards and visual reports to help management review sales, collections, and receivables.'],
    ['Advanced Excel','Combining spreadsheet tools to analyze information and build repeatable workflows.','My projects combine formulas, PivotTables, and VBA to generate invoices and organize AR reporting.'],
    ['Excel Formulas','Expressions that calculate results from cell values and other inputs.','I use formulas to connect underlying records with summaries and reduce repeated calculations.'],
    ['PivotTables','Excel tables that group and summarize source data for analysis.','I use PivotTables in receivables dashboards and summary reporting.'],
    ['VBA / Macros','Office automation instructions that perform repeated workbook tasks.','I built invoice generation, PDF saving, invoice lookup, and AR reporting workflows using VBA.'],
    ['QuickBooks','Accounting software for organizing transactions and financial reports.','I earned the QuickBooks Online Accountant Certification from Intuit on June 4, 2026.'],
    ['Microsoft Dynamics NAV','An enterprise system that connects financial and operational business information.','Relevant accounting uses include reviewing transactions and related financial records.'],
    ['AI-assisted tools','Tools that use artificial intelligence to support tasks such as drafting, analysis, and coding.','I use AI assistance when developing spreadsheet workflows, with review of formulas, logic, and outputs.'],
    ['In-House Accounting Systems','Internal software designed around an organization’s accounting processes.','Relevant uses include entering transactions, reviewing balances, and retrieving reports.'],
    ['Microsoft Office','Applications for spreadsheets, documents, presentations, and related office work.','Excel is central to my invoice automation and receivables reporting projects.'],
    ['Google Workspace','Cloud applications for documents, spreadsheets, communication, and collaboration.','Practical uses include sharing working documents and coordinating updates.'],
    ['Data Analysis','Organizing and examining data to identify patterns and answer questions.','My dashboard presents sales trends, collections, and overdue balances for review.'],
    ['Excel Workflow Automation','Connecting spreadsheet tasks into a repeatable process with less manual work.','My invoice generator connects customer input, invoice creation, PDF saving, and summary reporting.'],
    ['AI-Assisted Automation','Using AI assistance to help design or improve repeatable processes.','I combine AI-assisted development with accounting knowledge when improving Excel workflows.'],
    ['AI Productivity Tools','Applications that assist with drafting, organizing, or analyzing information.','Practical accounting uses include preparing draft explanations and reviewing spreadsheet logic before checking the result.'],
    ['Administrative Support','Organizing information and supporting routine office operations.','My internship included selected HR and accounting administrative activities.'],
    ['Scheduling','Organizing tasks and appointments around dates and deadlines.','Practical uses include coordinating billing cycles and reporting deadlines.'],
    ['Records Management','Organizing records so they can be retained and retrieved consistently.','My invoice workflow uses identifiable filenames and invoice-number lookup.'],
    ['Documentation & Filing','Preparing and organizing supporting documents for future reference.','My work includes maintaining financial records and invoice documentation.'],
    ['Task Coordination','Tracking responsibilities and dependencies so work can progress.','In billing, I coordinate discrepancy resolution and the information needed to prepare invoices.'],
    ['Graphics & Publication Layout','Arranging text and visuals into readable documents or publications.','Practical uses include clear report layouts and visual summaries.'],
    ['Social Media Marketing','Using social platforms to communicate with an audience and promote services.','Practical uses include presenting professional work and sharing informative content.'],
    ['Client Communication','Exchanging clear information with clients about requirements, progress, and results.','I discuss financial assumptions and findings with clients and coordinate billing concerns.'],
    ['Presentation Skills','Explaining information in a structured way suited to the audience.','I present financial information using visual summaries and clear explanations.'],
    ['Cross-Team Coordination','Working across teams to resolve dependencies and complete shared tasks.','My billing work involves coordinating with others to resolve discrepancies.'],
    ['Student Organization Leadership','Coordinating people and activities within a student organization.','Relevant applications include planning activities, assigning responsibilities, and communicating with members.'],
    ['Accounting Policies & Procedures','Documented rules and steps for consistent accounting work.','I co-authored Loans Receivable and Rent Receivable policies.'],
    ['Digital Reporting','Presenting financial information through electronic reports and dashboards.','My AR dashboard updates after data import and provides one-click category filters for management review.']
  ];
  const data = new Map(entries.map(([name, definition, context]) => [name, {definition, context}]));
  const dialog = document.createElement('dialog');
  dialog.className = 'capability-dialog';
  dialog.setAttribute('aria-labelledby', 'capability-title');
  dialog.innerHTML = '<button type="button" class="capability-close" autofocus>Close</button><p class="eyebrow">Capability</p><h2 id="capability-title"></h2><h3>What it means</h3><p class="capability-definition"></p><h3>Practical application</h3><p class="capability-context"></p><a class="button capability-reference" target="_blank" rel="noopener noreferrer">Read reference</a><p class="capability-source-note">Reference opens in a new tab.</p>';
  document.body.append(dialog);
  let trigger;
  document.querySelectorAll('.keyword-list a').forEach(link => {
    const name = link.textContent.trim();
    const entry = data.get(name);
    if (!entry || !dialog.showModal) return;
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-label', `Explore ${name}`);
    link.title = `Explore ${name}`;
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      dialog.querySelector('h2').textContent = name;
      dialog.querySelector('.capability-definition').textContent = entry.definition;
      dialog.querySelector('.capability-context').textContent = entry.context;
      dialog.querySelector('.capability-reference').href = link.href;
      dialog.showModal();
      document.body.classList.add('modal-open');
      dialog.scrollTop = 0;
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    trigger?.focus({preventScroll:true});
  });
})();
