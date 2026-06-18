using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace ContextMenuWpf;

public partial class MainWindow : Window
{
    public MainWindow() => InitializeComponent();

    private void ItemsList_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ItemsList.SelectedItem is ListBoxItem item)
            StatusText.Text = $"Выбрано: {item.Content}";
    }

    private void AddItem_Click(object sender, RoutedEventArgs e)
    {
        int n = ItemsList.Items.Count + 1;
        ItemsList.Items.Add(new ListBoxItem { Content = $"Элемент {n}" });
        StatusText.Text = $"Добавлен элемент {n}";
    }

    private void DeleteItem_Click(object sender, RoutedEventArgs e)
    {
        if (ItemsList.SelectedItem != null)
        {
            ItemsList.Items.Remove(ItemsList.SelectedItem);
            StatusText.Text = "Элемент удалён";
        }
    }

    private void ClearAll_Click(object sender, RoutedEventArgs e)
    {
        ItemsList.Items.Clear();
        StatusText.Text = "Список очищен";
    }

    private void BlueBg_Click(object sender, RoutedEventArgs e) =>
        ColorPanel.Background = new SolidColorBrush(Color.FromRgb(0xE3, 0xF2, 0xFD));

    private void GreenBg_Click(object sender, RoutedEventArgs e) =>
        ColorPanel.Background = new SolidColorBrush(Color.FromRgb(0xE8, 0xF5, 0xE9));

    private void ResetBg_Click(object sender, RoutedEventArgs e) =>
        ColorPanel.Background = Brushes.White;
}
