namespace ProjectBAnk;

partial class MainForm
{
    private System.ComponentModel.IContainer components = null;

    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
            components.Dispose();
        base.Dispose(disposing);
    }

    private void InitializeComponent()
    {
        lblTitle = new Label();
        lblName = new Label();
        txtName = new TextBox();
        lblInitialBalance = new Label();
        txtInitialBalance = new TextBox();
        btnCreate = new Button();
        lblOwner = new Label();
        lblBalance = new Label();
        grpOperations = new GroupBox();
        lblAmount = new Label();
        txtAmount = new TextBox();
        btnDeposit = new Button();
        btnWithdraw = new Button();
        lblLog = new Label();
        txtLog = new TextBox();
        grpOperations.SuspendLayout();
        SuspendLayout();

        // lblTitle
        lblTitle.AutoSize = true;
        lblTitle.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
        lblTitle.Location = new Point(20, 15);
        lblTitle.Text = "ProjectBAnk — простой банк";

        // lblName
        lblName.AutoSize = true;
        lblName.Location = new Point(20, 55);
        lblName.Text = "Имя:";

        // txtName
        txtName.Location = new Point(120, 52);
        txtName.Size = new Size(200, 23);
        txtName.Text = "Иван";

        // lblInitialBalance
        lblInitialBalance.AutoSize = true;
        lblInitialBalance.Location = new Point(20, 85);
        lblInitialBalance.Text = "Начальный баланс:";

        // txtInitialBalance
        txtInitialBalance.Location = new Point(150, 82);
        txtInitialBalance.Size = new Size(100, 23);
        txtInitialBalance.Text = "1000";

        // btnCreate
        btnCreate.Location = new Point(270, 80);
        btnCreate.Size = new Size(120, 27);
        btnCreate.Text = "Создать счёт";
        btnCreate.Click += btnCreate_Click;

        // lblOwner
        lblOwner.AutoSize = true;
        lblOwner.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
        lblOwner.Location = new Point(20, 120);
        lblOwner.Text = "Счёт: —";

        // lblBalance
        lblBalance.AutoSize = true;
        lblBalance.Font = new Font("Segoe UI", 12F);
        lblBalance.ForeColor = Color.DarkGreen;
        lblBalance.Location = new Point(20, 145);
        lblBalance.Text = "Баланс: —";

        // grpOperations
        grpOperations.Location = new Point(20, 175);
        grpOperations.Size = new Size(370, 110);
        grpOperations.Text = "Операции";
        grpOperations.Enabled = false;

        // lblAmount
        lblAmount.AutoSize = true;
        lblAmount.Location = new Point(15, 30);
        lblAmount.Text = "Сумма:";

        // txtAmount
        txtAmount.Location = new Point(70, 27);
        txtAmount.Size = new Size(100, 23);
        txtAmount.Text = "100";

        // btnDeposit
        btnDeposit.Location = new Point(190, 25);
        btnDeposit.Size = new Size(80, 27);
        btnDeposit.Text = "Положить";
        btnDeposit.Click += btnDeposit_Click;

        // btnWithdraw
        btnWithdraw.Location = new Point(280, 25);
        btnWithdraw.Size = new Size(80, 27);
        btnWithdraw.Text = "Снять";
        btnWithdraw.Click += btnWithdraw_Click;

        grpOperations.Controls.Add(lblAmount);
        grpOperations.Controls.Add(txtAmount);
        grpOperations.Controls.Add(btnDeposit);
        grpOperations.Controls.Add(btnWithdraw);

        // lblLog
        lblLog.AutoSize = true;
        lblLog.Location = new Point(20, 295);
        lblLog.Text = "История:";

        // txtLog
        txtLog.Location = new Point(20, 315);
        txtLog.Size = new Size(370, 120);
        txtLog.Multiline = true;
        txtLog.ReadOnly = true;
        txtLog.ScrollBars = ScrollBars.Vertical;

        // MainForm
        AutoScaleDimensions = new SizeF(7F, 15F);
        AutoScaleMode = AutoScaleMode.Font;
        ClientSize = new Size(410, 455);
        Controls.Add(lblTitle);
        Controls.Add(lblName);
        Controls.Add(txtName);
        Controls.Add(lblInitialBalance);
        Controls.Add(txtInitialBalance);
        Controls.Add(btnCreate);
        Controls.Add(lblOwner);
        Controls.Add(lblBalance);
        Controls.Add(grpOperations);
        Controls.Add(lblLog);
        Controls.Add(txtLog);
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox = false;
        StartPosition = FormStartPosition.CenterScreen;
        Text = "ProjectBAnk";

        btnOffers = new Button();
        btnOffers.Location = new Point(270, 115);
        btnOffers.Size = new Size(120, 27);
        btnOffers.Text = "Предложения";
        btnOffers.Click += btnOffers_Click;
        Controls.Add(btnOffers);

        grpOperations.ResumeLayout(false);
        grpOperations.PerformLayout();
        ResumeLayout(false);
        PerformLayout();
    }

    private Label lblTitle;
    private Label lblName;
    private TextBox txtName;
    private Label lblInitialBalance;
    private TextBox txtInitialBalance;
    private Button btnCreate;
    private Label lblOwner;
    private Label lblBalance;
    private GroupBox grpOperations;
    private Label lblAmount;
    private TextBox txtAmount;
    private Button btnDeposit;
    private Button btnWithdraw;
    private Label lblLog;
    private TextBox txtLog;
    private Button btnOffers;
}
