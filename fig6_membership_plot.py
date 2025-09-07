import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.interpolate import PchipInterpolator

# Load sample elicited points for distance and angle
# Files should have columns 'x' and 'mu'

def load_points(filename):
    df = pd.read_csv(filename)
    return df['x'].to_numpy(), df['mu'].to_numpy()


def plot_membership(ax, x, mu, xlabel):
    interp = PchipInterpolator(x, mu)
    x_dense = np.linspace(x.min(), x.max(), 200)
    ax.plot(x_dense, interp(x_dense), label='Interpolated')
    ax.scatter(x, mu, color='k', zorder=5, label='Elicited points')
    ax.set_xlabel(xlabel)
    ax.set_ylabel('Membership')
    ax.set_ylim(0, 1)
    ax.legend()


def main():
    xd, md = load_points('fig6_distance_points.csv')
    xa, ma = load_points('fig6_angle_points.csv')
    fig, axes = plt.subplots(1, 2, figsize=(8, 4), sharey=True)
    plot_membership(axes[0], xd, md, 'Distance (m)')
    plot_membership(axes[1], xa, ma, 'Angle (deg)')
    fig.tight_layout()
    fig.savefig('fig6_memberships.pdf')


if __name__ == '__main__':
    main()
