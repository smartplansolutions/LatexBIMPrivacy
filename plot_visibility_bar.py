import matplotlib.pyplot as plt
import numpy as np
import matplotlib.colors as mcolors

# Create a gradient for visibility: 0 (no visibility) to 1 (complete visibility)
def plot_visibility_legend():
    # Create a colormap from red to white
    cmap = mcolors.LinearSegmentedColormap.from_list('visibility_cmap', ['white', 'red'])
    
    # Create a figure and axis
    fig, ax = plt.subplots(figsize=(4, 4))
    #fig.subplots_adjust(bottom=0.5)

    # Generate a gradient from 0 to 1
    gradient = np.linspace(0, 1, 256).reshape(1, -1)
    gradient = np.vstack((gradient, gradient))

    # Plot the gradient
    ax.imshow(gradient, aspect='auto', cmap=cmap)
    
    # Set the labels and ticks
    ax.set_title('Visibility Degree', fontsize=12)
    ax.set_yticks([])  # No y-ticks
    ax.set_xticks([0, 127, 255])
    ax.set_xticklabels(['0 ', '0.5', '1'])

    # Add a color bar
    cbar = plt.colorbar(mappable=plt.cm.ScalarMappable(cmap=cmap), ax=ax, orientation='horizontal', pad=0.2)
    cbar.set_ticks([0, 1])
    cbar.set_ticklabels(['0', '1'])
    cbar.set_label("Visibility Degree")
    
    # Save high-quality images
    plt.savefig("visibility_legend.png", dpi=300)
    plt.savefig("visibility_legend.pdf", dpi=300)

    plt.show()

# Plot the visibility legend
plot_visibility_legend()