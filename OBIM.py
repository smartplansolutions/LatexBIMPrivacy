import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('Fig6.html')

@app.route('/Fig1')
def fig1():
    return render_template('Fig1.html')

@app.route('/Fig2')
def fig2():
    return render_template('Fig2.html')

@app.route('/Fig3')
def fig3():
    return render_template('Fig3.html')

@app.route('/Fig4')
def fig4():
    return render_template('Fig4.html')

@app.route('/Fig6')
def fig6():
    return render_template('Fig6.html')

@app.route('/window_height_impact')
def window_height_impact():
    return render_template('window_height_impact.html')

@app.route('/window_width_impact')
def window_width_impact():
    return render_template('window_width_impact.html')
    
@app.route('/Distance_impact2')
def Distance_impact2():
    return render_template('Distance_impact2.html')

@app.route('/Distance_impact')
def Distance_impact():
    return render_template('Distance_impact.html')

@app.route('/Angle_impact')
def Angle_impact():
    return render_template('Angle_impact.html')


@app.after_request
def apply_csp(response):
    csp = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-eval'; "
        "style-src 'self'; "
        "img-src 'self' data:; "
        "font-src 'self' data:; "
        "object-src 'none'"
    )
    response.headers["Content-Security-Policy"] = csp
    return response

if __name__ == '__main__':
    app.run(debug=True)
