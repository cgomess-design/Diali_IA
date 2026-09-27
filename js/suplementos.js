/**
 * js/suplementos.js
 * Lógica interactiva del Punto de Venta (POS) de Suplementos y Canje de Bonos
 * Renovation GYM (Línea Améliorant)
 */

let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    const sidebar = document.getElementById('sidebar');
    if (btnToggleSidebar && sidebar) {
        btnToggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // Detección de saldo por referidos al seleccionar cliente en el POS
    const selectCliente = document.getElementById('posClienteId');
    const alertBonoWrap = document.getElementById('alertBonoReferidoWrap');
    const textBonoMonto = document.getElementById('textBonoMonto');
    const chkUsarBono   = document.getElementById('chkUsarBono');

    if (selectCliente && alertBonoWrap) {
        selectCliente.addEventListener('change', function() {
            const opt = this.options[this.selectedIndex];
            const bono = parseFloat(opt.getAttribute('data-bono') || 0);

            if (bono > 0) {
                textBonoMonto.textContent = 'Q' + bono.toFixed(2);
                alertBonoWrap.classList.remove('d-none');
            } else {
                alertBonoWrap.classList.add('d-none');
                if (chkUsarBono) chkUsarBono.checked = false;
            }
            actualizarTotales();
        });
    }

    if (chkUsarBono) {
        chkUsarBono.addEventListener('change', actualizarTotales);
    }
});

/**
 * Añadir producto al carrito
 */
function agregarAlCarrito(id, codigo, nombre, precio, stockMax) {
    const existente = carrito.find(item => item.id === id);
    if (existente) {
        if (existente.cantidad < stockMax) {
            existente.cantidad += 1;
        } else {
            alert(`Stock máximo alcanzado para este producto (${stockMax} unidades disponibles).`);
            return;
        }
    } else {
        carrito.push({
            id: id,
            codigo: codigo,
            nombre: nombre,
            precio: parseFloat(precio),
            cantidad: 1,
            stockMax: stockMax
        });
    }
    actualizarCarritoUI();
}

/**
 * Modificar cantidad de un producto
 */
function cambiarCantidad(id, delta) {
    const item = carrito.find(p => p.id === id);
    if (!item) return;

    const nuevaCant = item.cantidad + delta;
    if (nuevaCant <= 0) {
        eliminarDelCarrito(id);
    } else if (nuevaCant <= item.stockMax) {
        item.cantidad = nuevaCant;
        actualizarCarritoUI();
    } else {
        alert(`Stock máximo disponible: ${item.stockMax}`);
    }
}

/**
 * Quitar producto del carrito
 */
function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    actualizarCarritoUI();
}

/**
 * Vaciar carrito
 */
function vaciarCarrito() {
    carrito = [];
    actualizarCarritoUI();
}

/**
 * Actualizar renderizado del carrito y campos ocultos del formulario
 */
function actualizarCarritoUI() {
    const container = document.getElementById('posCartItemsContainer');
    const emptyState = document.getElementById('posCartEmptyState');
    const btnCobrar = document.getElementById('btnConfirmarCobro');
    const inputProductosJSON = document.getElementById('posProductosJSON');

    if (!container) return;

    if (carrito.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('d-none');
        if (btnCobrar) btnCobrar.disabled = true;
        if (inputProductosJSON) inputProductosJSON.value = '';
    } else {
        if (emptyState) emptyState.classList.add('d-none');
        if (btnCobrar) btnCobrar.disabled = false;
        if (inputProductosJSON) inputProductosJSON.value = JSON.stringify(carrito);

        let html = '';
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            html += `
                <div class="cart-item-row d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold text-white small text-truncate" style="max-width: 150px;">${item.nombre}</div>
                        <div class="small" style="color: #4ade80;">Q${item.precio.toFixed(2)} c/u</div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary cart-item-qty-btn" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <span class="text-white fw-bold small">${item.cantidad}</span>
                        <button type="button" class="btn btn-sm btn-outline-secondary cart-item-qty-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                        <div class="fw-bold text-white small ms-2" style="min-width: 60px; text-align: right;">Q${subtotal.toFixed(2)}</div>
                        <button type="button" class="btn btn-sm btn-link text-danger p-0 ms-1" onclick="eliminarDelCarrito(${item.id})" title="Quitar">
                            &times;
                        </button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    actualizarTotales();
}

/**
 * Calcular subtotal, descuento por bono de referidos y total a pagar
 */
function actualizarTotales() {
    const subtotalText = document.getElementById('posSubtotalText');
    const totalText    = document.getElementById('posTotalText');
    const inputTotal   = document.getElementById('posInputTotal');
    const inputBono    = document.getElementById('posInputBonoUsado');
    const chkUsarBono  = document.getElementById('chkUsarBono');
    const selectCli    = document.getElementById('posClienteId');
    const rowBonoDesc  = document.getElementById('posRowBonoDescuento');
    const bonoDescText = document.getElementById('posBonoDescuentoText');

    let subtotal = 0;
    carrito.forEach(item => {
        subtotal += (item.precio * item.cantidad);
    });

    let bonoDisponible = 0;
    if (selectCli && selectCli.selectedIndex >= 0) {
        const opt = selectCli.options[selectCli.selectedIndex];
        bonoDisponible = parseFloat(opt.getAttribute('data-bono') || 0);
    }

    let bonoUsado = 0;
    if (chkUsarBono && chkUsarBono.checked && bonoDisponible > 0) {
        bonoUsado = Math.min(bonoDisponible, subtotal);
        if (rowBonoDesc) rowBonoDesc.classList.remove('d-none');
        if (bonoDescText) bonoDescText.textContent = '- Q' + bonoUsado.toFixed(2);
    } else {
        if (rowBonoDesc) rowBonoDesc.classList.add('d-none');
    }

    const totalFinal = Math.max(0, subtotal - bonoUsado);

    if (subtotalText) subtotalText.textContent = 'Q' + subtotal.toFixed(2);
    if (totalText) totalText.textContent = 'Q' + totalFinal.toFixed(2);
    if (inputTotal) inputTotal.value = totalFinal.toFixed(2);
    if (inputBono) inputBono.value = bonoUsado.toFixed(2);
}

/**
 * Modal: Ver Factura de Suplemento
 */
function verFacturaSuplemento(fac) {
    const modalEl = document.getElementById('modalVerFacturaSuplemento');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById('verFacNum').textContent = fac.numero_factura || '';
    document.getElementById('verFacFecha').textContent = fac.fecha_venta || '';
    document.getElementById('verFacCliente').textContent = fac.cliente_nombre ? (fac.cliente_nombre + ' ' + fac.cliente_apellido) : 'Cliente Mostrador / Venta Directa';
    document.getElementById('verFacSucursal').textContent = fac.sucursal_nombre || 'Central';
    document.getElementById('verFacVendedor').textContent = fac.vendedor_nombre ? (fac.vendedor_nombre + ' ' + fac.vendedor_apellido) : 'Partner Suplementos';
    document.getElementById('verFacMetodo').textContent = fac.metodo_pago || 'EFECTIVO';
    document.getElementById('verFacTotal').textContent = 'Q' + parseFloat(fac.total_venta || 0).toFixed(2);

    const bonoUsado = parseFloat(fac.monto_bono_usado || 0);
    const boxBono = document.getElementById('verFacBoxBono');
    if (bonoUsado > 0 && boxBono) {
        boxBono.classList.remove('d-none');
        document.getElementById('verFacBonoUsado').textContent = 'Q' + bonoUsado.toFixed(2);
    } else if (boxBono) {
        boxBono.classList.add('d-none');
    }

    modal.show();
}
