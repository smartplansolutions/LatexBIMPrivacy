import numpy as np
import matplotlib.pyplot as plt

# Fuzzy membership function for distance
def fuzzyDistanceWeight(d):
    if d < 7:
        return 1  # High visibility
    elif 7 <= d < 50:
        return (50 - d) / 43  # Linear decline
    else:
        return 0  # No visibility

# Fuzzy membership function for angle
def fuzzyAngleWeight(theta):
    if theta < 10:
        return 1  # High visibility
    elif 10 <= theta < 90:
        return (90 - theta) / 80  # Linear decline
    else:
        return 0  # No visibility

# Generate data for plotting
distances = np.linspace(0, 55, 55)
angles = np.linspace(0, 95, 95)

distance_weights = [fuzzyDistanceWeight(d) for d in distances]
angle_weights = [fuzzyAngleWeight(a) for a in angles]

# Create the figure with improved layout
fig, axs = plt.subplots(1, 2, figsize=(14, 4))
fig.subplots_adjust(wspace=0.3)  # Adjust spacing between subplots

# Plotting the distance membership function
axs[0].plot(distances, distance_weights, color='blue')
axs[0].set_xlabel('Distance (d)', fontsize=10)
axs[0].set_ylabel('Membership Degree', fontsize=10)
axs[0].grid(True)
axs[0].set_xticks(np.arange(0, 55, 10))  # Set grid lines every 10 meters
axs[0].text(0.5, -0.2, '(a)', transform=axs[0].transAxes, fontsize=12, ha='center', va='center')

# Plotting the angle membership function
axs[1].plot(angles, angle_weights, color='green')

axs[1].set_xlabel(r'Angle ($\theta$)', fontsize=10)  # Using LaTeX for theta
axs[1].set_ylabel('Membership Degree', fontsize=10)
axs[1].set_xticks(np.arange(0, 95, 10)) 
axs[1].grid(True)
axs[1].text(0.5, -0.2, '(b)', transform=axs[1].transAxes, fontsize=12, ha='center', va='center')

# Save the figure with improved layout and adjustments
plt.savefig('fuzzy_membership_functions.png', dpi=300, bbox_inches='tight')
plt.show()
