using System.Windows;
using System.Windows.Input;

namespace NonRectWpf;

public partial class CircleWindow : Window
{
    public CircleWindow() => InitializeComponent();

    private void DragWindow(object sender, MouseButtonEventArgs e)
    {
        if (e.LeftButton == MouseButtonState.Pressed)
            DragMove();
    }

    private void Close_Click(object sender, RoutedEventArgs e) => Close();
}
