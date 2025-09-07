import numpy as np
import matplotlib.pyplot as plt


def softmax_aggregate(vals, p):
    vals = np.asarray(vals)
    return (np.mean(vals ** p, axis=0)) ** (1 / p)


def main():
    # Synthetic visibility values for 8 directions over a grid.
    np.random.seed(0)
    grid_shape = (25, 25)
    dirs = 8

    base = np.random.rand(dirs, *grid_shape) * 0.4

    # Add a central hotspot visible from one direction.
    x = np.linspace(-1, 1, grid_shape[0])
    y = np.linspace(-1, 1, grid_shape[1])
    X, Y = np.meshgrid(x, y, indexing="ij")
    hotspot = np.exp(-(X ** 2 + Y ** 2) / 0.1)
    base[0] += hotspot

    ps = [1, 4, 10, 32]
    fig, axes = plt.subplots(1, len(ps), figsize=(12, 3))
    vmax = base.max()
    for ax, p in zip(axes, ps):
        vi = softmax_aggregate(base, p)
        im = ax.imshow(vi, cmap="inferno", vmin=0, vmax=vmax)
        ax.set_title(f"p={p}")
        ax.axis("off")
    fig.colorbar(im, ax=axes.ravel().tolist(), shrink=0.6)
    fig.tight_layout()
    fig.savefig("fig_softmax_p.pdf")


if __name__ == "__main__":
    main()
