# Single-folder build: run code then compile LaTeX
# Main tex file:
TEX=elsarticle-template-num.tex

# latexmk options (uncomment shell-escape if you use minted)
LATEXMK_OPTS=-pdf -interaction=nonstopmode -file-line-error
# LATEXMK_OPTS+=-shell-escape

# Python scripts that generate figures/tables/snippets into this same folder
PY_SCRIPTS=build_results.py

all: results pdf

results: $(PY_SCRIPTS)
	python build_results.py

pdf:
	latexmk $(LATEXMK_OPTS) $(TEX)

clean:
	latexmk -C
	rm -f auto_*.tex auto_*.pdf

watch:
	latexmk $(LATEXMK_OPTS) -pvc $(TEX)
