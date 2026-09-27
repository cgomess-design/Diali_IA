/**
 * js/ordenes.js
 * Control de modales y lógica interactiva de Órdenes de Compra y Proveedores
 * Renovation GYM (Línea Améliorant)
 */

document.addEventListener('DOMContentLoaded', () => {
    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    const sidebar = document.getElementById('sidebar');
    if (btnToggleSidebar && sidebar) {
        btnToggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // Al seleccionar proveedor, mostrar índice de precio y calidad recomendada
    const selectProv = document.getElementById('nuevoProveedorId');
    const infoProv = document.getElementById('infoProveedorDetalle');
    if (selectProv && infoProv) {
        selectProv.addEventListener('change', function() {
            const opt = this.options[this.selectedIndex];
            const precio = opt.getAttribute('data-precio') || '-';
            const calidad = opt.getAttribute('data-calidad') || '5.0';
            infoProv.innerHTML = `Calificación de Calidad: <strong style="color: #fbbf24;">★ ${calidad}/5.0</strong> &bull; Índice de Precio: <span class="badge badge-price-${precio.toLowerCase()}">${precio}</span>`;
            infoProv.classList.remove('d-none');
        });
    }
});

/**
 * Modal: Ver Orden de Compra y Proveedor
 */
function verOrden(oc) {
    const modalEl = document.getElementById('modalVerOrden');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('verNumOrden').textContent = oc.numero_orden || '';
    document.getElementById('verEstadoOrden').textContent = oc.estado || 'SOLICITADA';
    document.getElementById('verProveedorNombre').textContent = oc.proveedor_nombre || '';
    document.getElementById('verProveedorContacto').textContent = oc.proveedor_contacto || 'Contacto no disponible';
    document.getElementById('verProveedorTel').textContent = oc.proveedor_telefono || '';
    document.getElementById('verProveedorEmail').textContent = oc.proveedor_email || '';
    document.getElementById('verProveedorCalidad').textContent = '★ ' + (oc.calificacion_calidad || '5.0') + ' / 5.0';
    document.getElementById('verProveedorPrecio').textContent = oc.indice_precio || 'MEDIO';

    document.getElementById('verSucursalOrden').textContent = oc.sucursal_nombre || '';
    document.getElementById('verSolicitante').textContent = oc.solicitante_nombre ? (oc.solicitante_nombre + ' ' + oc.solicitante_apellido) : 'Administración';
    document.getElementById('verFechaOrden').textContent = oc.fecha_orden || '-';
    document.getElementById('verTotalOrden').textContent = 'Q' + parseFloat(oc.total_orden || 0).toFixed(2);

    modal.show();
}

/**
 * Modal: Editar Estado de Orden de Compra
 */
function editarOrden(oc) {
    const modalEl = document.getElementById('modalEditarOrden');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('editOrdenId').value = oc.id;
    document.getElementById('editNumOrdenTitle').textContent = oc.numero_orden;
    document.getElementById('editEstadoOrden').value = oc.estado || 'SOLICITADA';
    document.getElementById('editTotalOrden').value = oc.total_orden || 0;
    document.getElementById('editSucursalOrdenId').value = oc.sucursal_id || 1;

    modal.show();
}

/**
 * Modal: Eliminar / Cancelar Orden de Compra
 */
function eliminarOrden(id, numOrden) {
    const modalEl = document.getElementById('modalEliminarOrden');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('deleteOrdenId').value = id;
    document.getElementById('deleteNumOrden').textContent = numOrden;

    modal.show();
}
