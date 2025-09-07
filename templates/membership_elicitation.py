import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

# Simple isotonic regression (monotone non-increasing) using PAVA

def isotonic_regression(y):
    y = np.asarray(y, dtype=float)
    n = len(y)
    sol = list(y)
    w = [1.0]*n
    i = 0
    while i < len(sol)-1:
        if sol[i] < sol[i+1]:  # violation of non-increasing
            tot_w = w[i] + w[i+1]
            avg = (w[i]*sol[i] + w[i+1]*sol[i+1]) / tot_w
            sol[i] = avg
            w[i] = tot_w
            del sol[i+1]
            del w[i+1]
            if i > 0:
                i -= 1
        else:
            i += 1
    # expand back
    fitted = np.concatenate([np.full(int(weight), value) for value, weight in zip(sol, w)])
    fitted = np.clip(fitted, 0, 1)
    fitted[0] = 1.0
    fitted[-1] = 0.0
    return fitted

# Generate synthetic rating data for distance and angle
M = 5  # number of respondents
x_dist = np.linspace(7, 50, 10)   # distance levels (m)
x_ang = np.linspace(10, 90, 10)   # angle levels (deg)

# True underlying membership curves (exponential decay)
true_dist = np.exp(-(x_dist-7)/20)
true_ang = np.exp(-(x_ang-10)/30)

# Simulate respondent ratings with noise and fit isotonic curves
curves_dist = []
curves_ang = []
for _ in range(M):
    noise_d = np.random.normal(0, 0.05, size=len(x_dist))
    noise_a = np.random.normal(0, 0.05, size=len(x_ang))
    y_d = np.clip(true_dist + noise_d, 0, 1)
    y_a = np.clip(true_ang + noise_a, 0, 1)
    curves_dist.append(isotonic_regression(y_d))
    curves_ang.append(isotonic_regression(y_a))
curves_dist = np.array(curves_dist)
curves_ang = np.array(curves_ang)

# Pooled means and 95% CI
mean_dist = curves_dist.mean(axis=0)
std_dist = curves_dist.std(axis=0)
se_dist = std_dist / np.sqrt(M)
ci_dist = 1.96 * se_dist

mean_ang = curves_ang.mean(axis=0)
std_ang = curves_ang.std(axis=0)
se_ang = std_ang / np.sqrt(M)
ci_ang = 1.96 * se_ang

# Plotting
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

# Left column: pooled fits with CI
axes[0,0].plot(x_dist, mean_dist, color='C0', lw=2)
axes[0,0].fill_between(x_dist, mean_dist-ci_dist, mean_dist+ci_dist, color='C0', alpha=0.3)
axes[0,0].set_title('Pooled distance')
axes[0,0].set_xlabel('Distance (m)')
axes[0,0].set_ylabel('Membership')

axes[1,0].plot(x_ang, mean_ang, color='C1', lw=2)
axes[1,0].fill_between(x_ang, mean_ang-ci_ang, mean_ang+ci_ang, color='C1', alpha=0.3)
axes[1,0].set_title('Pooled angle')
axes[1,0].set_xlabel('Angle (deg)')
axes[1,0].set_ylabel('Membership')

# Right column: respondent-specific curves and linear special case
for mu in curves_dist:
    axes[0,1].plot(x_dist, mu, alpha=0.7)
axes[0,1].plot([7,50], [1,0], 'k--', label='Linear special case')
axes[0,1].set_title('Respondent distance')
axes[0,1].set_xlabel('Distance (m)')
axes[0,1].set_ylabel('Membership')
axes[0,1].legend()

for mu in curves_ang:
    axes[1,1].plot(x_ang, mu, alpha=0.7)
axes[1,1].plot([10,90], [1,0], 'k--', label='Linear special case')
axes[1,1].set_title('Respondent angle')
axes[1,1].set_xlabel('Angle (deg)')
axes[1,1].set_ylabel('Membership')
axes[1,1].legend()

plt.tight_layout()
plt.savefig('fig_memberships.pdf')
print('Wrote fig_memberships.pdf')