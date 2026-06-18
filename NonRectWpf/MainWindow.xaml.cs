using System.Windows;

namespace NonRectWpf;

public partial class MainWindow : Window
{
    public MainWindow() => InitializeComponent();

    private void Circle_Click(object sender, RoutedEventArgs e)
    {
        new CircleWindow().Show();
    }

    private void Star_Click(object sender, RoutedEventArgs e)
    {
        new StarWindow().Show();
    }
}
