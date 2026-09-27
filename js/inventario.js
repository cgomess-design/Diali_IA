/**
 * js/inventario.js
 * Lógica interactiva para Inventario de Equipos y Certificados de Calidad
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

    // Auto-generación de código de inventario sugerido al cambiar categoría
    const selCat = document.getElementById('nuevoCategoria');
    const inputCod = document.getElementById('nuevoCodigo');
    if (selCat && inputCod) {
        selCat.addEventListener('change', function() {
            const cat = this.value || 'EQ';
            const randomNum = Math.floor(100 + Math.random() * 900);
            inputCod.value = `EQ-${cat.substring(0, 4).toUpperCase()}-${randomNum}`;
        });
    }
});

/**
 * Modal: Ver Ficha Técnica del Equipo
 */
function verEquipo(eq) {
    const modalEl = document.getElementById('modalVerEquipo');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('verCodigoEq').textContent = eq.codigo_inventario || '';
    document.getElementById('verNombreEq').textContent = eq.nombre_equipo || '';
    document.getElementById('verCategoriaEq').textContent = eq.categoria || 'PESAS';
    document.getElementById('verSucursalEq').textContent = eq.sucursal_nombre || 'Central';
    document.getElementById('verEstadoEq').textContent = eq.estado_operativo || 'OPERATIVO';
    document.getElementById('verFechaAdq').textContent = eq.fecha_adquisicion || '-';
    document.getElementById('verCertificadoNum').textContent = eq.numero_certificado || 'CERT-ISO-9001-Q100';
    document.getElementById('verOrdenCompra').textContent = eq.numero_orden || 'Adquisición Directa';

    modal.show();
}

/**
 * Modal: Editar Equipo
 */
function editarEquipo(eq) {
    const modalEl = document.getElementById('modalEditarEquipo');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('editEquipoId').value = eq.id;
    document.getElementById('editNombreEq').value = eq.nombre_equipo || '';
    document.getElementById('editCodigoEq').value = eq.codigo_inventario || '';
    document.getElementById('editCategoriaEq').value = eq.categoria || 'PESAS';
    document.getElementById('editSucursalEq').value = eq.sucursal_id || 1;
    document.getElementById('editEstadoEq').value = eq.estado_operativo || 'OPERATIVO';
    document.getElementById('editCertificadoNum').value = eq.numero_certificado || '';

    modal.show();
}

/**
 * Modal: Dar de Baja Equipo
 */
function eliminarEquipo(id, codigo, nombre) {
    const modalEl = document.getElementById('modalEliminarEquipo');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('deleteEquipoId').value = id;
    document.getElementById('deleteCodigoEq').textContent = codigo;
    document.getElementById('deleteNombreEq').textContent = nombre;

    modal.show();
}
