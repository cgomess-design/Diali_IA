/**
 * js/clases.js
 * Lógica interactiva para Clases y Control de Aforo
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

    // Al cambiar disciplina, ajustar aforo máximo (Natación: 10, Boxeo: 15)
    const selectDisc = document.getElementById('nuevaDisciplina');
    const inputAforo = document.getElementById('nuevoAforoMax');
    const infoDisc = document.getElementById('infoDisciplinaAforo');

    if (selectDisc && inputAforo) {
        selectDisc.addEventListener('change', function() {
            if (this.value === 'NATACION') {
                inputAforo.value = 10;
                if (infoDisc) infoDisc.textContent = 'Aforo reglamentario para Natación: máximo 10 participantes.';
            } else if (this.value === 'BOXEO') {
                inputAforo.value = 15;
                if (infoDisc) infoDisc.textContent = 'Aforo reglamentario para Boxeo: máximo 15 participantes.';
            }
        });
    }

    // Auto-completar hora fin a 1 hora después de hora inicio
    const horaInicio = document.getElementById('nuevaHoraInicio');
    const horaFin = document.getElementById('nuevaHoraFin');
    if (horaInicio && horaFin) {
        horaInicio.addEventListener('change', function() {
            const parts = this.value.split(':');
            if (parts.length >= 2) {
                let h = parseInt(parts[0], 10) + 1;
                let m = parts[1];
                if (h < 10) h = '0' + h;
                horaFin.value = `${h}:${m}`;
            }
        });
    }
});

/**
 * Modal: Ver Clase y Aforo
 */
function verClase(c) {
    const modalEl = document.getElementById('modalVerClase');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('verDisciplina').textContent = c.disciplina || 'CLASE';
    document.getElementById('verCoach').textContent = c.coach_nombre ? (c.coach_nombre + ' ' + c.coach_apellido) : 'Coach Asignado';
    document.getElementById('verSucursalClase').textContent = c.sucursal_nombre || 'Central';
    document.getElementById('verFechaClase').textContent = c.fecha || '';
    document.getElementById('verHorarioClase').textContent = (c.hora_inicio ? c.hora_inicio.substring(0, 5) : '') + ' - ' + (c.hora_fin ? c.hora_fin.substring(0, 5) : '') + ' (1 hora)';

    const cupos = parseInt(c.cupos_ocupados || 0, 10);
    const max = parseInt(c.aforo_maximo || 10, 10);
    const disponibles = Math.max(0, max - cupos);
    const pct = Math.min(100, Math.round((cupos / max) * 100));

    document.getElementById('verCuposOcupados').textContent = cupos;
    document.getElementById('verAforoMaximo').textContent = max;
    document.getElementById('verCuposDisponibles').textContent = disponibles;
    document.getElementById('verPorcentajeAforo').textContent = pct + '%';

    const bar = document.getElementById('verBarraAforo');
    if (bar) {
        bar.style.width = pct + '%';
        bar.className = 'aforo-progress-bar ' + (pct >= 90 ? 'aforo-progress-rojo' : (pct >= 60 ? 'aforo-progress-ambar' : 'aforo-progress-verde'));
    }

    modal.show();
}

/**
 * Modal: Editar Clase
 */
function editarClase(c) {
    const modalEl = document.getElementById('modalEditarClase');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('editClaseId').value = c.id;
    document.getElementById('editDisciplina').value = c.disciplina || 'NATACION';
    document.getElementById('editCoachId').value = c.coach_id || '';
    document.getElementById('editSucursalClaseId').value = c.sucursal_id || 1;
    document.getElementById('editFechaClase').value = c.fecha || '';
    document.getElementById('editHoraInicio').value = c.hora_inicio || '07:00';
    document.getElementById('editHoraFin').value = c.hora_fin || '08:00';
    document.getElementById('editAforoMax').value = c.aforo_maximo || 10;
    document.getElementById('editCuposOcupados').value = c.cupos_ocupados || 0;

    modal.show();
}

/**
 * Modal: Cancelar / Eliminar Clase
 */
function eliminarClase(id, disciplina, fecha, horario) {
    const modalEl = document.getElementById('modalEliminarClase');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('deleteClaseId').value = id;
    document.getElementById('deleteDisciplina').textContent = disciplina;
    document.getElementById('deleteDetalleClase').textContent = `${fecha} (${horario})`;

    modal.show();
}
