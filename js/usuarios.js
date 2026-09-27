/**
 * js/usuarios.js
 * Funcionalidad interactiva y control de modales para el Mantenimiento de Usuarios
 * Renovation GYM (Línea Améliorant)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Toggle para menú móvil
    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    const sidebar = document.getElementById('sidebar');
    if (btnToggleSidebar && sidebar) {
        btnToggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }
});

/**
 * Cargar datos del usuario en el Modal "Ver Usuario"
 * @param {Object} u - Objeto con los datos del usuario
 */
function verUsuario(u) {
    const modalElement = document.getElementById('modalVerUsuario');
    if (!modalElement) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    const iniciales = (u.nombre ? u.nombre.charAt(0) : '') + (u.apellido ? u.apellido.charAt(0) : '');
    
    document.getElementById('verAvatar').textContent = iniciales.toUpperCase();
    document.getElementById('verNombreCompleto').textContent = (u.nombre || '') + ' ' + (u.apellido || '');
    document.getElementById('verRol').textContent = u.nombre_rol || 'SIN ROL';
    document.getElementById('verEstado').textContent = u.estado || 'ACTIVO';
    document.getElementById('verUsuario').textContent = '@' + (u.usuario || '');
    document.getElementById('verEmail').textContent = u.email || '';
    document.getElementById('verTelefono').textContent = u.telefono || 'No registrado';
    document.getElementById('verTipo').textContent = u.tipo_persona || 'INTERNO';
    document.getElementById('verSucursal').textContent = u.sucursal_nombre || 'Todas / Central';
    document.getElementById('verHuella').textContent = u.huella_dactilar_hash || 'No configurada';
    document.getElementById('verUltimoLogin').textContent = u.ultimo_login || 'Nunca';
    document.getElementById('verCreatedAt').textContent = u.created_at || '-';
    
    modal.show();
}

/**
 * Cargar datos del usuario en el formulario del Modal "Editar Usuario"
 * @param {Object} u - Objeto con los datos del usuario
 */
function editarUsuario(u) {
    const modalElement = document.getElementById('modalEditarUsuario');
    if (!modalElement) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    
    document.getElementById('editId').value = u.id;
    document.getElementById('editNombre').value = u.nombre || '';
    document.getElementById('editApellido').value = u.apellido || '';
    document.getElementById('editUsuario').value = u.usuario || '';
    document.getElementById('editEmail').value = u.email || '';
    document.getElementById('editTelefono').value = u.telefono || '';
    document.getElementById('editRolId').value = u.rol_id || '';
    document.getElementById('editTipoPersona').value = u.tipo_persona || 'INTERNO';
    document.getElementById('editEstado').value = u.estado || 'ACTIVO';
    document.getElementById('editSucursalId').value = u.sucursal_id || '';
    document.getElementById('editHuella').value = u.huella_dactilar_hash || '';
    
    modal.show();
}

/**
 * Preparar y abrir el modal de confirmación de eliminación
 * @param {number} id - ID del usuario
 * @param {string} nombre - Nombre completo del usuario
 * @param {string} usuario - Nombre de usuario / login
 */
function eliminarUsuario(id, nombre, usuario) {
    const modalElement = document.getElementById('modalEliminarUsuario');
    if (!modalElement) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    
    document.getElementById('deleteId').value = id;
    document.getElementById('deleteNombre').textContent = nombre;
    document.getElementById('deleteUsuario').textContent = '@' + usuario;
    
    modal.show();
}
