import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator

def softmax_aggregation(x, p):
    """Calculate the soft maximum of x for a given p."""
    n = len(x)
    return (np.sum(x ** p) / n) ** (1 / p)

def plot_softmax_aggregation(p_values, data, labels):
    """Plot the soft maximum aggregation for different p values."""
    plt.figure(figsize=(10, 6))
    plt.xlabel('p')
    plt.ylabel('VI')
    plt.ylim(0, 1)
    plt.grid(True)


    plt.xticks(np.arange(0, 42, 2))
    plt.yticks(np.arange(0, 1.1, 0.05))
    plt.gca().xaxis.set_major_locator(MultipleLocator(2))  # Grid every 0.5 units
    plt.gca().yaxis.set_major_locator(MultipleLocator(0.05))  # Grid every 0.5 units

    # Different line styles for black-and-white readability
    line_styles = ['-', '--', '-.', ':']

    for i, (x, label) in enumerate(zip(data, labels)):
        softmax_values = [softmax_aggregation(x, p) for p in p_values]
        plt.plot(p_values, softmax_values, line_styles[i % len(line_styles)], label=label)

    plt.legend()
      # Save the plot as high-quality PNG and PDF
    plt.savefig('softmax_aggregation_plot.jpg', dpi=300, bbox_inches='tight')
    plt.savefig('softmax_aggregation_plot.pdf', bbox_inches='tight')
    plt.show()

# p values for plotting
p_values = np.linspace(1, 30, 30)

# Define the different window visibility settings
data = [
    np.array([0, 0, 0, 0, 0, 1]),  # one very large and very close window
    np.array([0, 0, 0, 0, 1, 1]),  # two very large and very close windows
    np.array([0, 0, 0, 1, 1, 1]),  # three very large and very close windows
    np.array([0, 0, 1, 1, 1, 1])   # four very large and very close windows
]

labels = [
    "One side window",
    "Two side windows",
    "Three side windows",
    "Four side windows"
]

# Plot the results
plot_softmax_aggregation(p_values, data, labels)
