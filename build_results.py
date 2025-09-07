# Generate artifacts for the paper into the CURRENT FOLDER (no subdirs).
# Replace this with your real analysis and figure generation.
import numpy as np, pandas as pd
import matplotlib.pyplot as plt

# 1) Demo figure
x = np.linspace(0, 2*np.pi, 200)
y = np.sin(x)

plt.figure()
plt.plot(x, y, label="sin(x)")
plt.title("Auto-generated demo figure")
plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.tight_layout()
plt.savefig("auto_demo.pdf")
plt.close()

# 2) Demo table as LaTeX
df = pd.DataFrame({"Metric":["MAE","RMSE","R2"], "Value":[0.123,0.201,0.912]})
with open("auto_metrics.tex","w",encoding="utf-8") as f:
    f.write(df.to_latex(index=False, float_format="%.3f"))
print("Wrote auto_demo.pdf and auto_metrics.tex")
