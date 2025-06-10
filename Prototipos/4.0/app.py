from flask import Flask, render_template, request, redirect, jsonify, url_for, current_app, flash, session
from datos_libros import libros
from libros_inicio import librosInicio
from usuarios import usuarios
from usuario_actual import usuario_actual
from usuarios_pendientes import usuarios_pendientes
import os
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)
app.secret_key = 'clave-super-secreta-123'

app.config['UPLOAD_FOLDER'] = 'static/img/libros'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

def guardar_en_archivo(nombre_variable, datos, archivo):
    contenido = f"{nombre_variable} = {repr(datos)}\n"
    with open(archivo, 'w', encoding='utf-8') as f:
        f.write(contenido)

def guardar_imagen_sin_sobrescribir(imagen, carpeta_relativa='img/libros'):
    carpeta_destino = os.path.join(current_app.root_path, 'static', carpeta_relativa)
    os.makedirs(carpeta_destino, exist_ok=True)

    nombre_seguro = secure_filename(imagen.filename)
    nombre_base, extension = os.path.splitext(nombre_seguro)
    nombre_final = nombre_seguro
    contador = 1

    # Generar nombre único si ya existe
    while os.path.exists(os.path.join(carpeta_destino, nombre_final)):
        nombre_final = f"{nombre_base}_{contador}{extension}"
        contador += 1

    ruta_completa = os.path.join(carpeta_destino, nombre_final)
    imagen.save(ruta_completa)

    # Ruta relativa para HTML
    return f"{carpeta_relativa}/{nombre_final}"

# Diccionario global que podés usar en Jinja
niveles_jerarquia = {
    'creador': 5,
    'dueño': 4,
    'jefe': 3,
    'gerente': 2,
    'colaborador': 1
}

# Función para comparar niveles
def jerarquia(cargo):
    return niveles_jerarquia.get(cargo, 0)

def reenumerar_ids(lista):
    for i, usuario in enumerate(lista, start=1):
        usuario["id"] = str(i)

@app.route('/')
def home():
    return render_template('index.html', libros=librosInicio)

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

@app.route('/login', methods=['GET', 'POST'])
def login():
    mensaje_error = None
    if request.method == 'POST':
        email = request.form['email']
        contrasena = request.form['contrasena']
        usuario = next((u for u in usuarios if u['email'] == email), None)

        if usuario:
            if usuario['contrasena'] == contrasena:
                # Actualiza usuario_actual.py
                with open('usuario_actual.py', 'w', encoding='utf-8') as f:
                    f.write(f"usuario_actual = {usuario}")
                return redirect(url_for('inicio_admin'))
            else:
                mensaje_error = "Contraseña incorrecta."
        else:
            mensaje_error = ("Usuario no encontrado.<br>"
                             "Todavía no te has creado una cuenta o tu cuenta no ha sido aceptada.<br>"
                             "Para más detalles escribí a <a href='mailto:hola@biblio.com'>hola@biblio.com</a> "
                             "con el título <strong>Problemas de Inicio de Sesión</strong>.")
    return render_template('login.html', mensaje_error=mensaje_error)

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre = request.form['nombre']
        email = request.form['email']
        contrasena = request.form['contrasena']
        confirmar = request.form['confirmar']
        imagen = request.files.get('imagen')

        if contrasena != confirmar:
            flash('Las contraseñas no coinciden.', 'error')
            return redirect(url_for('registro'))

        todos_los_emails = [u['email'] for u in usuarios + usuarios_pendientes]
        if email in todos_los_emails:
            flash('Ese correo ya está registrado.', 'error')
            return redirect(url_for('registro'))

        ruta_img = 'img/usuarios/icono-usuario.jpg'
        if imagen and imagen.filename != '':
            ruta_img = guardar_imagen_sin_sobrescribir(imagen, carpeta_relativa='img/usuarios')

        nuevo_usuario = {
            'id': str(len(usuarios_pendientes)),
            'img': ruta_img,
            'nombre': nombre,
            'email': email,
            'contrasena': contrasena,
            'cargo': 'colaborador'
        }

        usuarios_pendientes.append(nuevo_usuario)
        guardar_en_archivo('usuarios_pendientes', usuarios_pendientes, 'usuarios_pendientes.py')

        mensaje_exito = (
            "Tus datos han sido validados. Podrás ingresar tu cuenta en login cuando un administrador "
            "te lo permita.\nSi pasan más de 72 horas y no se aceptó tu cuenta, escribinos a hola@biblio.com"
        )
        flash(mensaje_exito, 'success')
        return redirect(url_for('login'))

    return render_template('registro.html')



@app.route('/inicio_admin')
def inicio_admin():
    return render_template('inicio-admin.html', libros=librosInicio)

@app.route('/eliminar_libro/<id>', methods=['POST'])
def eliminar_libro(id):
    libro_en_libros = next((libro for libro in libros if libro['id'] == id), None)
    if libro_en_libros:
        ruta_imagen = libro_en_libros['portada']
        ruta_imagen_completa = os.path.join(current_app.static_folder, ruta_imagen)

        titulo_a_eliminar = libro_en_libros['titulo']
        libros.remove(libro_en_libros)

        try:
            if os.path.exists(ruta_imagen_completa):
                os.remove(ruta_imagen_completa)
        except Exception as e:
            print(f"Error eliminando imagen: {e}")

        for i, libro in enumerate(libros):
            libro['id'] = str(i)

        guardar_en_archivo("libros", libros, "datos_libros.py")

        librosInicio[:] = [libro for libro in librosInicio if libro['titulo'] != titulo_a_eliminar]

        ids_en_inicio = {libro['id'] for libro in librosInicio}
        libro_reemplazo = next((libro for libro in libros if libro['id'] not in ids_en_inicio), None)
        if libro_reemplazo and len(librosInicio) < 5:
            librosInicio.append(libro_reemplazo)

        for libro_inicio in librosInicio:
            libro_correspondiente = next((l for l in libros if l['titulo'] == libro_inicio['titulo']), None)
            if libro_correspondiente:
                libro_inicio['id'] = libro_correspondiente['id']

        guardar_en_archivo("librosInicio", librosInicio, "libros_inicio.py")

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'status': 'ok'})
    else:
        return redirect(url_for('inicio_admin'))

@app.route('/libros_inicio', methods=['GET', 'POST'])
def libros_inicio():
    mensaje_error = None
    titulos_no_encontrados = []
    
    if request.method == 'POST':
        # Capturamos los títulos del formulario
        titulos = [
            request.form.get('libro1'),
            request.form.get('libro2'),
            request.form.get('libro3'),
            request.form.get('libro4'),
            request.form.get('libro5'),
        ]

        nuevos_libros = []
        for titulo in titulos:
            libro = next((l for l in libros if l['titulo'].lower() == titulo.lower()), None)
            if libro:
                nuevos_libros.append({
                    'id': libro['id'],
                    'titulo': libro['titulo'],
                    'autor': libro['autor'],
                    'descarga': libro['descarga'],
                    'portada': libro['portada']
                })
            else:
                titulos_no_encontrados.append(titulo)

        if titulos_no_encontrados:
            mensaje_error = "Los siguientes libros no se encuentran en la base de datos: " + ", ".join(titulos_no_encontrados)
        else:
            # Si todos los libros están, se actualiza `librosInicio`
            librosInicio.clear()
            librosInicio.extend(nuevos_libros)
            guardar_en_archivo('librosInicio', librosInicio, 'libros_inicio.py')
            return redirect(url_for('inicio_admin'))

    # Renderizar formulario
    return render_template('libros-inicio.html', libros=libros, mensaje_error=mensaje_error)


@app.route('/catalogo_admin')
def catalogo_admin():
    consulta = request.args.get('q', '').lower()
    if consulta:
        libros_filtrados = [libro for libro in libros if consulta in libro['titulo'].lower() or consulta in libro['autor'].lower()]
    else:
        libros_filtrados = libros  # 👉 Si no hay búsqueda, muestra todos
    return render_template('catalogo-admin.html', libros=libros_filtrados)

@app.route('/agregar_libro', methods=['GET', 'POST'])
def agregar_libro():
    if request.method == 'POST':
        titulo = request.form['titulo']
        autor = request.form['autor']
        descarga = request.form['descarga']
        imagen = request.files.get('imagen')

        portada = ''
        if imagen and imagen.filename != '':
            portada = guardar_imagen_sin_sobrescribir(imagen)

        nuevo_libro = {
            'id': str(len(libros)),
            'titulo': titulo,
            'autor': autor,
            'descarga': descarga,
            'portada': portada
        }

        libros.append(nuevo_libro)
        guardar_en_archivo('libros', libros, 'datos_libros.py')
        return redirect(url_for('inicio_admin'))

    return render_template('agregar-libro.html')

@app.route('/modificar_libro', methods=['GET', 'POST'])
def modificar_libro():
    if request.method == 'POST':
        libro_id = request.form['id']
        nuevo_titulo = request.form['titulo']
        nuevo_autor = request.form['autor']
        nueva_descarga = request.form['descarga']
        nueva_portada = None

        imagen = request.files.get('imagen')
        
        # Buscar el libro original para obtener la portada actual
        libro_original = next((l for l in libros if l['id'] == libro_id), None)
        portada_anterior = libro_original.get('portada') if libro_original else None
        
        if imagen and imagen.filename != '':
            nueva_portada = guardar_imagen_sin_sobrescribir(imagen)
            
            # Borrar imagen anterior si existía
            if portada_anterior:
                ruta_completa = os.path.join(current_app.root_path, 'static', *portada_anterior.split('/'))
                if os.path.exists(ruta_completa):
                    os.remove(ruta_completa)

        for libro in libros:
            if libro['id'] == libro_id:
                libro['titulo'] = nuevo_titulo
                libro['autor'] = nuevo_autor
                libro['descarga'] = nueva_descarga
                if nueva_portada:
                    libro['portada'] = nueva_portada
                break

        for libro in librosInicio:
            if libro['id'] == libro_id:
                libro['titulo'] = nuevo_titulo
                libro['autor'] = nuevo_autor
                libro['descarga'] = nueva_descarga
                if nueva_portada:
                    libro['portada'] = nueva_portada
                break

        guardar_en_archivo('libros', libros, 'datos_libros.py')
        guardar_en_archivo('librosInicio', librosInicio, 'libros_inicio.py')
        return redirect(url_for('inicio_admin'))

    else:
        libro_id = request.args.get('id')
        libro = next((l for l in libros if l['id'] == libro_id), None)
        return render_template('modificar-libro.html', libro=libro)

@app.route("/perfil")
def perfil():
    # Filtrar empleados con cargo menor
    empleados = [u for u in usuarios if jerarquia(u['cargo']) < jerarquia(usuario_actual['cargo'])]

    return render_template("perfil.html",
                           usuario=usuario_actual,
                           empleados=empleados,
                           postulantes=usuarios_pendientes,
                           niveles=niveles_jerarquia,
                           jerarquia=jerarquia)
    
@app.route('/aceptar_postulante/<email>')
def aceptar_postulante(email):
    postulante = next((p for p in usuarios_pendientes if p['email'] == email), None)
    if postulante and jerarquia(postulante['cargo']) < jerarquia(usuario_actual['cargo']):
        usuarios.append(postulante)
        usuarios_pendientes.remove(postulante)

        # Reenumerar IDs
        reenumerar_ids(usuarios)
        reenumerar_ids(usuarios_pendientes)

        # Guardar cambios
        guardar_en_archivo("usuarios", usuarios, "usuarios.py")
        guardar_en_archivo("usuarios_pendientes", usuarios_pendientes, "usuarios_pendientes.py")

    return redirect(url_for("perfil"))

@app.route('/borrar_postulante/<email>')
def borrar_postulante(email):
    postulante = next((p for p in usuarios_pendientes if p['email'] == email), None)
    
    # Verificamos que exista y que el usuario actual tenga mayor jerarquía
    if postulante and jerarquia(postulante['cargo']) < jerarquia(usuario_actual['cargo']):
        usuarios_pendientes.remove(postulante)

        # Reenumerar IDs
        reenumerar_ids(usuarios_pendientes)

        # Guardar cambios
        guardar_en_archivo("usuarios_pendientes", usuarios_pendientes, "usuarios_pendientes.py")
    
    return redirect(url_for("perfil"))

@app.route('/borrar_empleado/<email>')
def borrar_empleado(email):
    global usuarios
    empleado = next((u for u in usuarios if u['email'] == email), None)
    if empleado and jerarquia(empleado['cargo']) < jerarquia(usuario_actual['cargo']):
        usuarios = [u for u in usuarios if u['email'] != email]

        # Reenumerar IDs
        reenumerar_ids(usuarios)

        # Guardar cambios
        guardar_en_archivo("usuarios", usuarios, "usuarios.py")

    return redirect(url_for("perfil"))

@app.route("/cambiar_cargo/<email>", methods=["POST"])
def cambiar_cargo(email):
    nuevo_cargo = request.form.get("nuevo_cargo")
    for u in usuarios:
        if u['email'] == email and jerarquia(u['cargo']) < jerarquia(usuario_actual['cargo']):
            if jerarquia(nuevo_cargo) < jerarquia(usuario_actual['cargo']):
                u['cargo'] = nuevo_cargo
                guardar_en_archivo("usuarios", usuarios, "usuarios.py")
            break
    return redirect(url_for("perfil"))

@app.route("/modificar_perfil", methods=["GET", "POST"])
def modificar_perfil():
    if request.method == "POST":
        id_usuario = request.form.get("id")
        nombre = request.form.get("nombre")
        email = request.form.get("email")
        contraseña = request.form.get("contraseña")
        confirmar = request.form.get("confirmar_contraseña")
        imagen = request.files.get("imagen")

        if contraseña != confirmar:
            flash("Las contraseñas no coinciden.")
            return redirect(url_for("modificar_perfil"))

        # Validar que el email no exista en otro usuario
        email_existente = any(
            (u["email"] == email and u["id"] != id_usuario)
            for u in usuarios + usuarios_pendientes
        )
        if email_existente:
            flash("Ese correo electrónico ya está registrado.")
            return redirect(url_for("modificar_perfil"))

        # Buscar usuario por id
        usuario_modificar = next((u for u in usuarios if u["id"] == id_usuario), None)
        if not usuario_modificar:
            flash("Usuario no encontrado.")
            return redirect(url_for("modificar_perfil"))

        # Imagen anterior
        imagen_anterior = usuario_modificar.get("img")
        nueva_ruta = imagen_anterior

        if imagen and imagen.filename:
            nueva_ruta = guardar_imagen_sin_sobrescribir(imagen, "img/usuarios")
            if imagen_anterior and imagen_anterior != "img/usuarios/icono-usuario.jpg":
                ruta_completa = os.path.join(current_app.root_path, 'static', *imagen_anterior.split('/'))
                if os.path.exists(ruta_completa):
                    os.remove(ruta_completa)

        # Actualizar usuario
        usuario_modificar["nombre"] = nombre
        usuario_modificar["email"] = email
        usuario_modificar["contrasena"] = contraseña
        usuario_modificar["img"] = nueva_ruta

        # Si es el usuario_actual, también actualizarlo
        if usuario_actual["id"] == id_usuario:
            usuario_actual["nombre"] = nombre
            usuario_actual["email"] = email
            usuario_actual["contrasena"] = contraseña
            usuario_actual["img"] = nueva_ruta

        guardar_en_archivo("usuarios", usuarios, "usuarios.py")
        guardar_en_archivo("usuario_actual", usuario_actual, "usuario_actual.py")

        return redirect(url_for("perfil"))

    return render_template("modificar-perfil.html", usuario=usuario_actual)

if __name__ == '__main__':
    app.run(debug=True)
