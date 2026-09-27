/**
 * js/inscripciones.js
 * Lógica interactiva para el Módulo de Inscripciones y Membresías
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

    // Actualización de precio en modal Nueva Inscripción al cambiar plan
    const selectPlan = document.getElementById('nuevaMembresiaId');
    const inputMonto = document.getElementById('nuevoMonto');
    if (selectPlan && inputMonto) {
        selectPlan.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const precio = selectedOption.getAttribute('data-precio') || '250.00';
            inputMonto.value = precio;
        });
    }
});

/**
 * Modal: Ver Ficha de Inscripción y Beneficios
 */
function verInscripcion(ins) {
    const modalEl = document.getElementById('modalVerInscripcion');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('verClienteNombre').textContent = (ins.cliente_nombre || '') + ' ' + (ins.cliente_apellido || '');
    document.getElementById('verClienteEmail').textContent = ins.cliente_email || '';
    document.getElementById('verClienteTel').textContent = ins.cliente_telefono || 'No registrado';
    document.getElementById('verPlanNombre').textContent = ins.plan_nombre || '';
    document.getElementById('verSucursal').textContent = ins.sucursal_nombre || '';
    document.getElementById('verFechaInicio').textContent = ins.fecha_inicio || '-';
    document.getElementById('verFechaFin').textContent = ins.fecha_fin || '-';
    document.getElementById('verEstado').textContent = ins.estado || 'VIGENTE';
    document.getElementById('verRenovacion').textContent = (ins.renovacion_automatica == 1) ? 'Activada' : 'Manual';
    document.getElementById('verFacturaNum').textContent = ins.numero_factura || 'Sin factura';
    document.getElementById('verMontoPagado').textContent = 'Q' + parseFloat(ins.monto_pagado || ins.precio_mes || 0).toFixed(2);
    document.getElementById('verMetodoPago').textContent = ins.metodo_pago || 'TARJETA';

    // Desglose de beneficios
    const descParqueo = ins.descuento_parqueo || (ins.membresia_id == 2 ? '20%' : '10%');
    const coaching = (ins.membresia_id == 2 ? '3 sesiones retroalimentación' : '1 sesión / semana');
    const diasPrueba = (ins.membresia_id == 2 ? '5 días para 2 personas al mes' : '2 días para 1 persona al mes');
    const bonoRef = (ins.membresia_id == 2 ? 'Q150.00' : 'Q100.00');
    const accesoPiscina = (ins.membresia_id == 2 ? 'Sí (Piscinas y Boxeo ilimitado)' : 'No incluido');
    const sillones = (ins.membresia_id == 2 ? '3 usos semanales' : 'No incluido');

    document.getElementById('verBenParqueo').textContent = descParqueo + ' desc.';
    document.getElementById('verBenCoaching').textContent = coaching;
    document.getElementById('verBenPrueba').textContent = diasPrueba;
    document.getElementById('verBenReferido').textContent = bonoRef;
    document.getElementById('verBenPiscina').textContent = accesoPiscina;
    document.getElementById('verBenSillones').textContent = sillones;

    modal.show();
}

/**
 * Modal: Editar Inscripción
 */
function editarInscripcion(ins) {
    const modalEl = document.getElementById('modalEditarInscripcion');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('editInscripcionId').value = ins.id;
    document.getElementById('editClienteNombre').textContent = (ins.cliente_nombre || '') + ' ' + (ins.cliente_apellido || '');
    document.getElementById('editMembresiaId').value = ins.membresia_id || 1;
    document.getElementById('editSucursalId').value = ins.sucursal_id || 1;
    document.getElementById('editFechaInicio').value = ins.fecha_inicio || '';
    document.getElementById('editFechaFin').value = ins.fecha_fin || '';
    document.getElementById('editEstado').value = ins.estado || 'VIGENTE';
    document.getElementById('editRenovacion').checked = (ins.renovacion_automatica == 1);

    modal.show();
}

/**
 * Modal: Cancelar / Eliminar Inscripción
 */
function eliminarInscripcion(id, clienteNombre, planNombre) {
    const modalEl = document.getElementById('modalEliminarInscripcion');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('deleteInscripcionId').value = id;
    document.getElementById('deleteClienteNombre').textContent = clienteNombre;
    document.getElementById('deletePlanNombre').textContent = planNombre;

    modal.show();
}
