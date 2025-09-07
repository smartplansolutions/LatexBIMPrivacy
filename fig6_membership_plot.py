import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.interpolate import PchipInterpolator

# Load sample elicited points for distance and angle
# Files should have columns 'x' and 'mu'

def load_points(filename):
    df = pd.read_csv(filename)
    return df['x'].to_numpy(), df['mu'].to_numpy()


def plot_membership(ax, x, mu, xlabel, xlim=None):
    """Plot an interpolated membership function with flat tails.

    Parameters
    ----------
    ax : matplotlib axis
        Axis on which to draw.
    x, mu : array_like
        Elicited points defining the membership.
    xlabel : str
        Label for the x-axis.
    xlim : tuple, optional
        Overall domain to show. Values outside the elicited range are drawn
        as horizontal lines using the boundary membership values.
    """

    if xlim is None:
        x_start, x_end = x[0], x[-1]
    else:
        x_start, x_end = xlim

    x_aug = x
    mu_aug = mu
    if x_start < x[0]:
        x_aug = np.concatenate(([x_start], x_aug))
        mu_aug = np.concatenate(([mu[0]], mu_aug))
    if x_end > x[-1]:
        x_aug = np.concatenate((x_aug, [x_end]))
        mu_aug = np.concatenate((mu_aug, [mu[-1]]))

    interp = PchipInterpolator(x_aug, mu_aug)
    x_dense = np.linspace(x_start, x_end, 400)
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
    plot_membership(axes[0], xd, md, 'Distance (m)', xlim=(0, xd.max()))
    plot_membership(axes[1], xa, ma, 'Angle (deg)', xlim=(0, xa.max()))
    fig.tight_layout()
    fig.savefig('fig6_memberships.pdf')


if __name__ == '__main__':
    main()
