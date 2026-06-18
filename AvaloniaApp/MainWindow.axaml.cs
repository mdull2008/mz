using Avalonia.Controls;
using Avalonia.Interactivity;

namespace AvaloniaApp;

public partial class MainWindow : Window
{
    public MainWindow() => InitializeComponent();

    private void Hello_Click(object? sender, RoutedEventArgs e) =>
        StatusText.Text = "Привет из Avalonia!";

    private void Clear_Click(object? sender, RoutedEventArgs e) =>
        StatusText.Text = "Нажмите кнопку";
}
