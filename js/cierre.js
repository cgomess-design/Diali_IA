/**
 * js/cierre.js
 * Control de modales y vista ejecutiva para el Reporte Diario de Cierre de Jornada
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
});

/**
 * Modal: Ver Balance Diario Ejecutivo
 */
function verCierre(c) {
    const modalEl = document.getElementById('modalVerCierre');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('verCierreSucursal').textContent = c.sucursal_nombre || 'Central';
    document.getElementById('verCierreFecha').textContent = c.fecha || '';
    document.getElementById('verCierreUsuarios').textContent = c.cantidad_usuarios_dia || 0;
    document.getElementById('verCierreTiempo').textContent = (c.tiempo_promedio_minutos || 0) + ' min';

    const vMem = parseFloat(c.ventas_membresias_total || 0);
    const vTerc = parseFloat(c.ventas_servicios_tercerizados || 0);
    const total = vMem + vTerc;

    document.getElementById('verCierreVentasMem').textContent = 'Q' + vMem.toFixed(2);
    document.getElementById('verCierreVentasTerc').textContent = 'Q' + vTerc.toFixed(2);
    document.getElementById('verCierreTotalIngresos').textContent = 'Q' + total.toFixed(2);

    document.getElementById('verCierreNatacion').textContent = (c.usuarios_clases_natacion || 0) + ' usuarios';
    document.getElementById('verCierreBoxeo').textContent = (c.usuarios_clases_boxeo || 0) + ' usuarios';
    document.getElementById('verCierreGenerado').textContent = c.generado_en || '-';

    modal.show();
}

/**
 * Modal: Editar Cierre
 */
function editarCierre(c) {
    const modalEl = document.getElementById('modalEditarCierre');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('editCierreId').value = c.id;
    document.getElementById('editSucursalCierreId').value = c.sucursal_id || 1;
    document.getElementById('editFechaCierre').value = c.fecha || '';
    document.getElementById('editUsuariosDia').value = c.cantidad_usuarios_dia || 0;
    document.getElementById('editTiempoProm').value = c.tiempo_promedio_minutos || 0;
    document.getElementById('editVentasMem').value = c.ventas_membresias_total || 0;
    document.getElementById('editVentasTerc').value = c.ventas_servicios_tercerizados || 0;
    document.getElementById('editClasesNat').value = c.usuarios_clases_natacion || 0;
    document.getElementById('editClasesBox').value = c.usuarios_clases_boxeo || 0;

    modal.show();
}

/**
 * Modal: Eliminar Cierre
 */
function eliminarCierre(id, sucursal, fecha) {
    const modalEl = document.getElementById('modalEliminarCierre');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('deleteCierreId').value = id;
    document.getElementById('deleteSucursalCierre').textContent = sucursal;
    document.getElementById('deleteFechaCierre').textContent = fecha;

    modal.show();
}
