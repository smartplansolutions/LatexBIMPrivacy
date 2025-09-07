# Single-folder build: run code then compile LaTeX
# Main tex file:
TEX=elsarticle-template-num.tex
.RECIPEPREFIX := >

# pdflatex options (uncomment shell-escape if you use minted)
PDFLATEX_OPTS=-interaction=nonstopmode -file-line-error
# PDFLATEX_OPTS+=-shell-escape

# Python scripts that generate figures/tables/snippets into this same folder
PY_SCRIPTS=build_results.py

all: results pdf

results: $(PY_SCRIPTS)
>python build_results.py

pdf:
>pdflatex $(PDFLATEX_OPTS) $(TEX)
>bibtex $(basename $(TEX)) || true
>pdflatex $(PDFLATEX_OPTS) $(TEX)
>pdflatex $(PDFLATEX_OPTS) $(TEX)

clean:
>rm -f *.aux *.bbl *.blg *.log *.out *.toc
>rm -f auto_*.tex auto_*.pdf

watch:
>@echo "Watch target requires latexmk and is not supported in this setup."
>@false
