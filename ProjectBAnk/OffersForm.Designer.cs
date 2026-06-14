namespace ProjectBAnk;

partial class OffersForm
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
        lblUrl = new Label();
        txtUrl = new TextBox();
        btnLoad = new Button();
        btnAnalyze = new Button();
        dgvOffers = new DataGridView();
        txtResult = new TextBox();
        lblStatus = new Label();
        colTitle = new DataGridViewTextBoxColumn();
        colPrice = new DataGridViewTextBoxColumn();
        colRating = new DataGridViewTextBoxColumn();
        colCategory = new DataGridViewTextBoxColumn();
        colDiscount = new DataGridViewTextBoxColumn();
        colVerdict = new DataGridViewTextBoxColumn();
        ((System.ComponentModel.ISupportInitialize)dgvOffers).BeginInit();
        SuspendLayout();

        lblTitle.AutoSize = true;
        lblTitle.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
        lblTitle.Location = new Point(15, 12);
        lblTitle.Text = "Предложения с сайта + нейросеть";

        lblUrl.AutoSize = true;
        lblUrl.Location = new Point(15, 42);
        lblUrl.Text = "URL (JSON):";

        txtUrl.Location = new Point(90, 39);
        txtUrl.Size = new Size(430, 23);
        txtUrl.Text = "https://dummyjson.com/products?limit=20";

        btnLoad.Location = new Point(530, 37);
        btnLoad.Size = new Size(120, 27);
        btnLoad.Text = "Загрузить JSON";
        btnLoad.Click += btnLoad_Click;

        btnAnalyze.Location = new Point(660, 37);
        btnAnalyze.Size = new Size(120, 27);
        btnAnalyze.Text = "Анализ ML.NET";
        btnAnalyze.Enabled = false;
        btnAnalyze.Click += btnAnalyze_Click;

        dgvOffers.Location = new Point(15, 75);
        dgvOffers.Size = new Size(765, 220);
        dgvOffers.ReadOnly = true;
        dgvOffers.AllowUserToAddRows = false;
        dgvOffers.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
        dgvOffers.Columns.AddRange(colTitle, colPrice, colRating, colCategory, colDiscount, colVerdict);

        colTitle.HeaderText = "Название";
        colPrice.HeaderText = "Цена";
        colRating.HeaderText = "Рейтинг";
        colCategory.HeaderText = "Категория";
        colDiscount.HeaderText = "Скидка";
        colVerdict.HeaderText = "Нейросеть";

        txtResult.Location = new Point(15, 305);
        txtResult.Size = new Size(765, 150);
        txtResult.Multiline = true;
        txtResult.ReadOnly = true;
        txtResult.ScrollBars = ScrollBars.Vertical;

        lblStatus.AutoSize = true;
        lblStatus.Location = new Point(15, 465);
        lblStatus.Text = "Нажмите «Загрузить JSON»";

        AutoScaleDimensions = new SizeF(7F, 15F);
        AutoScaleMode = AutoScaleMode.Font;
        ClientSize = new Size(795, 490);
        Controls.Add(lblTitle);
        Controls.Add(lblUrl);
        Controls.Add(txtUrl);
        Controls.Add(btnLoad);
        Controls.Add(btnAnalyze);
        Controls.Add(dgvOffers);
        Controls.Add(txtResult);
        Controls.Add(lblStatus);
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox = false;
        StartPosition = FormStartPosition.CenterScreen;
        Text = "Анализ предложений";

        ((System.ComponentModel.ISupportInitialize)dgvOffers).EndInit();
        ResumeLayout(false);
        PerformLayout();
    }

    private Label lblTitle;
    private Label lblUrl;
    private TextBox txtUrl;
    private Button btnLoad;
    private Button btnAnalyze;
    private DataGridView dgvOffers;
    private TextBox txtResult;
    private Label lblStatus;
    private DataGridViewTextBoxColumn colTitle;
    private DataGridViewTextBoxColumn colPrice;
    private DataGridViewTextBoxColumn colRating;
    private DataGridViewTextBoxColumn colCategory;
    private DataGridViewTextBoxColumn colDiscount;
    private DataGridViewTextBoxColumn colVerdict;
}
