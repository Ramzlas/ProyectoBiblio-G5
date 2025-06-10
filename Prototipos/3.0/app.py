from flask import Flask, render_template, request
from datos_libros import libros

app = Flask(__name__)

@app.route('/')
def home():
    destacados = libros[:5]  
    return render_template('index.html', libros=destacados)

@app.route('/suscripcion')
def suscripcion():
    return render_template('suscripcion.html')

@app.route('/catalogo')
def catalogo():
    consulta = request.args.get('q', '').lower()
    if consulta:
        libros_filtrados = [libro for libro in libros if consulta in libro['titulo'].lower() or consulta in libro['autor'].lower()]
    else:
        libros_filtrados = libros  # 👉 Si no hay búsqueda, muestra todos
    return render_template('catalogo.html', libros=libros_filtrados)

@app.route('/donacion')
def donacion():
    return render_template('donacion.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/registro')
def registro():
    return render_template('registro.html')

if __name__ == '__main__':
    app.run(debug=True)
