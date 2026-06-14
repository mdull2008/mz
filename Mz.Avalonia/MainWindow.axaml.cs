using Avalonia.Controls;
using Avalonia.Interactivity;

namespace Mz.Avalonia;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
    }

    private void OnSaveClick(object? sender, RoutedEventArgs e)
    {
        var name = NameTextBox.Text?.Trim() ?? string.Empty;
        var email = EmailTextBox.Text?.Trim() ?? string.Empty;
        var message = MessageTextBox.Text?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email))
        {
            StatusTextBlock.Text = "Укажите имя и email.";
            return;
        }

        StatusTextBlock.Text =
            $"Сохранено:{System.Environment.NewLine}" +
            $"Имя: {name}{System.Environment.NewLine}" +
            $"Email: {email}{System.Environment.NewLine}" +
            $"Сообщение: {(string.IsNullOrWhiteSpace(message) ? "—" : message)}";
    }

    private void OnClearClick(object? sender, RoutedEventArgs e)
    {
        NameTextBox.Text = string.Empty;
        EmailTextBox.Text = string.Empty;
        MessageTextBox.Text = string.Empty;
        StatusTextBlock.Text = "Форма очищена.";
    }
}
