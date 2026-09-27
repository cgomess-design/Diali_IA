/**
 * js/referidos.js
 * Lógica interactiva para la entrega de dinero y gestión de bonos por referidos
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

    // Alternar campos bancarios en el modal de pago
    const selectMetodoEntrega = document.getElementById('pagoMetodoEntrega');
    const boxDetalleTransferencia = document.getElementById('boxDetalleTransferencia');
    if (selectMetodoEntrega && boxDetalleTransferencia) {
        selectMetodoEntrega.addEventListener('change', function() {
            if (this.value === 'TRANSFERENCIA') {
                boxDetalleTransferencia.classList.remove('d-none');
            } else {
                boxDetalleTransferencia.classList.add('d-none');
            }
        });
    }
});

/**
 * Abrir Modal para Pagar Bono (Efectivo / Transferencia / Descuento Mensualidad)
 */
function abrirModalPagarBono(ref) {
    const modalEl = document.getElementById('modalPagarBono');
    if (!modalEl) return;

    document.getElementById('pagoReferidoId').value = ref.id;
    document.getElementById('pagoReferidorNombre').textContent = (ref.referidor_nombre || '') + ' ' + (ref.referidor_apellido || '');
    document.getElementById('pagoReferidoNombre').textContent = (ref.referido_nombre || '') + ' ' + (ref.referido_apellido || '');
    document.getElementById('pagoMembresiaPlan').textContent = ref.membresia_nombre || 'Membresía';
    
    const monto = parseFloat(ref.bono_otorgado || 0);
    document.getElementById('pagoMontoBonoText').textContent = 'Q' + monto.toFixed(2);
    document.getElementById('pagoInputMonto').value = monto.toFixed(2);

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

/**
 * Abrir Modal para Ver Comprobante de Egreso / Recibo de Pago
 */
function abrirModalVerComprobante(ref) {
    const modalEl = document.getElementById('modalVerComprobante');
    if (!modalEl) return;

    document.getElementById('compNumeroEgreso').textContent = ref.comprobante_egreso || 'EGR-REF-2026-XXXXX';
    document.getElementById('compFechaEntrega').textContent = ref.fecha_entrega || ref.fecha_referido || '--';
    document.getElementById('compBeneficiario').textContent = (ref.referidor_nombre || '') + ' ' + (ref.referidor_apellido || '');
    document.getElementById('compReferidoDe').textContent = (ref.referido_nombre || '') + ' ' + (ref.referido_apellido || '') + ' (' + (ref.membresia_nombre || '') + ')';
    document.getElementById('compMetodoEntrega').textContent = ref.metodo_entrega || 'EFECTIVO';
    document.getElementById('compMonto').textContent = 'Q' + parseFloat(ref.bono_otorgado || 0).toFixed(2);
    document.getElementById('compRecepcionista').textContent = (ref.recepcionista_nombre || '') + ' ' + (ref.recepcionista_apellido || '') || 'Recepción Central';
    document.getElementById('compObservaciones').textContent = ref.observaciones || 'Pago de bono por referir cliente a membresía Améliorant.';
    document.getElementById('compFirmaCliente').textContent = (ref.referidor_nombre || '') + ' ' + (ref.referidor_apellido || '');

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}
