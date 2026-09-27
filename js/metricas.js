/**
 * js/metricas.js
 * Cálculo automático de bonos y control de modales para Métricas de Desempeño
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

    // Cálculo dinámico de bonos en el modal de nuevo registro
    const tipoEquipo = document.getElementById('nuevoTipoEquipo');
    const sesionesVentas = document.getElementById('nuevoSesionesVentas');
    const csatRetencion = document.getElementById('nuevoCsatRetencion');
    const pctBono = document.getElementById('nuevoPctBono');
    const montoBono = document.getElementById('nuevoMontoBono');
    const labelMeta1 = document.getElementById('labelMeta1');
    const labelMeta2 = document.getElementById('labelMeta2');

    function calcularBono() {
        if (!tipoEquipo || !sesionesVentas || !csatRetencion || !pctBono || !montoBono) return;
        
        const tipo = tipoEquipo.value;
        const val1 = parseInt(sesionesVentas.value || 0, 10);
        const val2 = parseFloat(csatRetencion.value || 0);
        let pct = 0;

        if (tipo === 'COACH') {
            // Coach: Meta 60 sesiones y CSAT >= 92%
            if (val1 >= 60 && val2 >= 92) {
                pct = 100;
            } else if (val1 >= 50 && val2 >= 85) {
                pct = 75;
            } else if (val1 >= 40 && val2 >= 75) {
                pct = 50;
            } else {
                pct = 0;
            }
        } else {
            // Recepción: Meta 25 ventas y Retención >= 95%
            if (val1 >= 25 && val2 >= 95) {
                pct = 100;
            } else if (val1 >= 20 && val2 >= 88) {
                pct = 75;
            } else if (val1 >= 15 && val2 >= 80) {
                pct = 50;
            } else {
                pct = 0;
            }
        }

        pctBono.value = pct;
        // Total bono acumulado máximo: Q700 (1er lugar) + Q500 (2do lugar / meta) = Q1,200
        const total = (1200 * (pct / 100)).toFixed(2);
        montoBono.value = total;
    }

    if (tipoEquipo) {
        tipoEquipo.addEventListener('change', function() {
            if (this.value === 'COACH') {
                if (labelMeta1) labelMeta1.textContent = 'Sesiones Realizadas (Meta: 60) *';
                if (labelMeta2) labelMeta2.textContent = 'Satisfacción CSAT % (Meta: 92%) *';
            } else {
                if (labelMeta1) labelMeta1.textContent = 'Ventas / Inscripciones (Meta: 25) *';
                if (labelMeta2) labelMeta2.textContent = 'Tasa de Retención % (Meta: 95%) *';
            }
            calcularBono();
        });
    }

    if (sesionesVentas) sesionesVentas.addEventListener('input', calcularBono);
    if (csatRetencion) csatRetencion.addEventListener('input', calcularBono);
});

/**
 * Modal: Ver Liquidación de Bono
 */
function verMetrica(m) {
    const modalEl = document.getElementById('modalVerMetrica');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('verEmpleadoMetrica').textContent = (m.empleado_nombre || '') + ' ' + (m.empleado_apellido || '');
    document.getElementById('verTipoEquipoMetrica').textContent = m.tipo_equipo || 'COACH';
    document.getElementById('verPeriodoMetrica').textContent = m.semana_periodo || '2026-W37';

    const esCoach = (m.tipo_equipo === 'COACH');
    document.getElementById('verMetaLabel1').textContent = esCoach ? 'Sesiones Realizadas:' : 'Ventas Concretadas:';
    document.getElementById('verMetaVal1').textContent = (m.sesiones_o_ventas_realizadas || 0) + (esCoach ? ' / 60 meta' : ' / 25 meta');

    document.getElementById('verMetaLabel2').textContent = esCoach ? 'Calidad CSAT:' : 'Tasa de Retención:';
    document.getElementById('verMetaVal2').textContent = (m.porcentaje_csat_o_retencion || 0) + '%' + (esCoach ? ' (meta >= 92%)' : ' (meta >= 95%)');

    document.getElementById('verPorcentajeBono').textContent = (m.porcentaje_bono_aplicado || 0) + '%';
    document.getElementById('verMontoBonoTotal').textContent = 'Q' + parseFloat(m.monto_bono_total || 0).toFixed(2);
    document.getElementById('verFechaCalculo').textContent = m.fecha_calculo || '-';

    modal.show();
}

/**
 * Modal: Editar Métrica
 */
function editarMetrica(m) {
    const modalEl = document.getElementById('modalEditarMetrica');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('editMetricaId').value = m.id;
    document.getElementById('editSemanaPeriodo').value = m.semana_periodo || '';
    document.getElementById('editSesionesVentas').value = m.sesiones_o_ventas_realizadas || 0;
    document.getElementById('editCsatRetencion').value = m.porcentaje_csat_o_retencion || 0;
    document.getElementById('editPctBono').value = m.porcentaje_bono_aplicado || 0;
    document.getElementById('editMontoBono').value = m.monto_bono_total || 0;

    modal.show();
}

/**
 * Modal: Eliminar Métrica
 */
function eliminarMetrica(id, nombre, periodo) {
    const modalEl = document.getElementById('modalEliminarMetrica');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('deleteMetricaId').value = id;
    document.getElementById('deleteEmpleadoNombre').textContent = nombre;
    document.getElementById('deletePeriodo').textContent = periodo;

    modal.show();
}
