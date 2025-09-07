import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/Fig1')
def fig1():
    return render_template('Fig1.html')

@app.route('/Fig2a')
def fig2a():
    return render_template('Fig2(a).html')

@app.route('/Fig2b')
def fig2b():
    return render_template('Fig2(b).html')

@app.route('/Fig3')
def fig3():
    return render_template('Fig3.html')

@app.route('/Fig3a')
def fig3a():
    return render_template('Fig3(a).html')

@app.route('/Fig3b')
def fig3b():
    return render_template('Fig3(b).html')

@app.route('/Fig4')
def fig4():
    return render_template('Fig4.html')

@app.route('/Fig4a')
def fig4a():
    return render_template('Fig4(a).html')

@app.route('/Fig4b')
def fig4b():
    return render_template('Fig4(b).html')
@app.route('/Fig5')
def fig5():
    return render_template('Fig5.html')
if __name__ == '__main__':
    app.run(debug=True)
