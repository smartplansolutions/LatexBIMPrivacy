import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator


def softmax_aggregation(x, p):
    """Calculate the soft maximum of ``x`` for a given ``p``."""
    n = len(x)
    return (np.sum(x ** p) / n) ** (1 / p)


def plot_softmax_aggregation(p_values, data, labels):
    """Plot the soft maximum aggregation for different ``p`` values.

    In addition to scenario-specific curves, a pooled line averaging
    across scenarios is drawn to highlight the overall impact of ``p``.
    """
    plt.figure(figsize=(10, 6))
    plt.xlabel('p')
    plt.ylabel('VI')
    plt.ylim(0, 1)
    plt.grid(True)

    plt.xticks(np.arange(0, 52, 2))
    plt.yticks(np.arange(0, 1.1, 0.05))
    plt.gca().xaxis.set_major_locator(MultipleLocator(2))
    plt.gca().yaxis.set_major_locator(MultipleLocator(0.05))

    # Different line styles for black-and-white readability
    line_styles = ['-', '--', '-.', ':']

    all_softmax = []
    for i, (x, label) in enumerate(zip(data, labels)):
        softmax_values = [softmax_aggregation(x, p) for p in p_values]
        all_softmax.append(softmax_values)
        plt.plot(p_values, softmax_values,
                 line_styles[i % len(line_styles)], label=label)

    # pooled average across scenarios
    pooled_values = np.mean(np.array(all_softmax), axis=0)
    plt.plot(p_values, pooled_values, 'k', linewidth=2,
             label='Pooled average')

    plt.legend()
    # Save the plot as high-quality PNG and PDF
    plt.savefig('softmax_aggregation_plot.jpg', dpi=300,
                bbox_inches='tight')
    plt.savefig('softmax_aggregation_plot.pdf', bbox_inches='tight')
    plt.close()


def main():
    # p values for plotting -- extended to show saturation at high ``p``
    p_values = np.linspace(1, 50, 50)

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
        "Four side windows",
    ]

    plot_softmax_aggregation(p_values, data, labels)


if __name__ == "__main__":
    main()

