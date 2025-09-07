import glob
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit


def load_points(pattern):
    """Load elicited points from files matching ``pattern``.

    Each CSV is expected to contain columns ``x`` and ``mu``.  The
    function returns arrays with shape (N_files, N_points).
    """
    xs, mus = [], []
    for fname in sorted(glob.glob(pattern)):
        df = pd.read_csv(fname)
        xs.append(df['x'].to_numpy())
        mus.append(df['mu'].to_numpy())
    return np.array(xs), np.array(mus)


def logistic(x, x0, k):
    """Monotone decreasing logistic used for membership fits."""
    return 1 / (1 + np.exp(k * (x - x0)))


def plot_membership(ax, xs, mus, xlabel, xlim=None):
    """Plot respondent and pooled memberships with flat tails.

    Parameters
    ----------
    ax : matplotlib axis
        Axis on which to draw.
    xs, mus : ndarray
        Arrays of shape (N_files, N_points) holding elicited data.
    xlabel : str
        Label for the x-axis.
    xlim : tuple, optional
        Domain to show; defaults to the data range.
    """

    x = xs[0]
    if xlim is None:
        x_start, x_end = x[0], x[-1]
    else:
        x_start, x_end = xlim

    x_dense = np.linspace(x_start, x_end, 400)

    # pooled average across respondents
    pooled_mu = mus.mean(axis=0)
    p0 = (np.median(x), 0.1)
    popt, _ = curve_fit(logistic, x, pooled_mu, p0=p0)
    ax.plot(x_dense, logistic(x_dense, *popt), 'k', linewidth=2,
            label='Pooled')

    # individual respondent curves
    for mu in mus:
        popt_i, _ = curve_fit(logistic, x, mu, p0=popt)
        ax.plot(x_dense, logistic(x_dense, *popt_i), '--', alpha=0.5)
        ax.scatter(x, mu, color='k', s=10, zorder=5)

    ax.set_xlabel(xlabel)
    ax.set_ylabel('Membership')
    ax.set_ylim(0, 1)
    ax.legend()


def main():
    xd, md = load_points('fig6_distance_points*.csv')
    xa, ma = load_points('fig6_angle_points*.csv')
    fig, axes = plt.subplots(1, 2, figsize=(8, 4), sharey=True)
    plot_membership(axes[0], xd, md, 'Distance (m)', xlim=(0, xd[0].max()))
    plot_membership(axes[1], xa, ma, 'Angle (deg)', xlim=(0, xa[0].max()))
    fig.tight_layout()
    fig.savefig('fig6_memberships.pdf')


if __name__ == '__main__':
    main()
